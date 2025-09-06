import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { LearningMaterial, StudentProgress, LearningPath, RecentActivity } from '../types/learningMaterials';

interface LearningMaterialsDB extends DBSchema {
  materials: {
    key: string;
    value: LearningMaterial;
  };
  progress: {
    key: string;
    value: StudentProgress;
  };
  paths: {
    key: string;
    value: LearningPath;
  };
  activities: {
    key: string;
    value: RecentActivity;
  };
}

class LearningMaterialsService {
  private db: IDBPDatabase<LearningMaterialsDB> | null = null;
  private materials: LearningMaterial[] = [];
  private listeners: (() => void)[] = [];

  async init() {
    this.db = await openDB<LearningMaterialsDB>('learning-materials', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('materials')) {
          db.createObjectStore('materials', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('progress')) {
          db.createObjectStore('progress', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('paths')) {
          db.createObjectStore('paths', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('activities')) {
          db.createObjectStore('activities', { keyPath: 'id' });
        }
      },
    });
    
    // Load cached materials
    await this.loadFromCache();
    this.notifyListeners();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  private async loadFromCache() {
    if (!this.db) return;
    
    try {
      this.materials = await this.db.getAll('materials');
    } catch (error) {
      console.error('Failed to load materials from cache:', error);
      this.materials = [];
    }
  }

  private async updateCache(materials: LearningMaterial[]) {
    if (!this.db) return;
    
    try {
      const tx = this.db.transaction('materials', 'readwrite');
      await tx.store.clear();
      
      for (const material of materials) {
        await tx.store.put(material);
      }
      
      await tx.done;
    } catch (error) {
      console.error('Failed to update cache:', error);
    }
  }

  async getMaterials(filters?: {
    type?: string;
    subject?: string;
    gradeLevel?: number;
    difficulty?: string;
    search?: string;
    isPublic?: boolean;
  }): Promise<LearningMaterial[]> {
    try {
      // Try to fetch fresh data from network
      const response = await fetch('/api/materials');
      if (response.ok) {
        const freshMaterials = await response.json();
        this.materials = freshMaterials;
        await this.updateCache(freshMaterials);
        this.notifyListeners();
      }
    } catch (error) {
      console.log('Using cached materials (offline mode)');
    }

    let filteredMaterials = [...this.materials];

    if (filters) {
      if (filters.type) {
        filteredMaterials = filteredMaterials.filter(m => m.type === filters.type);
      }
      if (filters.subject) {
        filteredMaterials = filteredMaterials.filter(m => 
          m.subject.toLowerCase().includes(filters.subject!.toLowerCase())
        );
      }
      if (filters.gradeLevel) {
        filteredMaterials = filteredMaterials.filter(m => m.gradeLevel === filters.gradeLevel);
      }
      if (filters.difficulty) {
        filteredMaterials = filteredMaterials.filter(m => m.difficulty === filters.difficulty);
      }
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredMaterials = filteredMaterials.filter(m =>
          m.title.toLowerCase().includes(searchTerm) ||
          m.description.toLowerCase().includes(searchTerm) ||
          m.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }
      if (filters.isPublic !== undefined) {
        filteredMaterials = filteredMaterials.filter(m => m.isPublic === filters.isPublic);
      }
    }

    return filteredMaterials;
  }

  async getMaterialById(id: string): Promise<LearningMaterial | null> {
    const material = this.materials.find(m => m.id === id);
    if (material) return material;

    // Try to fetch from network if not in cache
    try {
      const response = await fetch(`/api/materials/${id}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Failed to fetch material:', error);
    }

    return null;
  }

  async createMaterial(materialData: Partial<LearningMaterial>): Promise<LearningMaterial> {
    const newMaterial: LearningMaterial = {
      id: Date.now().toString(),
      title: materialData.title || '',
      description: materialData.description || '',
      type: materialData.type || 'lesson',
      subject: materialData.subject || '',
      gradeLevel: materialData.gradeLevel || 6,
      difficulty: materialData.difficulty || 'beginner',
      content: materialData.content || '',
      externalUrl: materialData.externalUrl,
      attachments: materialData.attachments || [],
      tags: materialData.tags || [],
      estimatedDuration: materialData.estimatedDuration || 30,
      createdBy: 'current-user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublished: materialData.isPublished || false,
      isPublic: materialData.isPublic || false,
      assignedTo: materialData.assignedTo || [],
      maxScore: materialData.maxScore,
      instructions: materialData.instructions,
      courseId: materialData.courseId,
      module: materialData.module,
      prerequisites: materialData.prerequisites || [],
      learningObjectives: materialData.learningObjectives || [],
      downloadable: materialData.downloadable || false,
      parentId: materialData.parentId,
      order: materialData.order || 0,
      isActive: materialData.isActive !== false
    };

    try {
      const response = await fetch('/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMaterial)
      });

      if (response.ok) {
        const savedMaterial = await response.json();
        this.materials.push(savedMaterial);
        await this.updateCache(this.materials);
        return savedMaterial;
      }
    } catch (error) {
      console.error('Failed to create material on server, saving locally:', error);
    }

    // Save locally if network fails
    this.materials.push(newMaterial);
    await this.updateCache(this.materials);
    this.notifyListeners();
    return newMaterial;
  }

  async updateMaterial(id: string, updates: Partial<LearningMaterial>): Promise<LearningMaterial | null> {
    const index = this.materials.findIndex(m => m.id === id);
    if (index === -1) return null;

    const updatedMaterial = {
      ...this.materials[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    try {
      const response = await fetch(`/api/materials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMaterial)
      });

      if (response.ok) {
        const savedMaterial = await response.json();
        this.materials[index] = savedMaterial;
        await this.updateCache(this.materials);
        return savedMaterial;
      }
    } catch (error) {
      console.error('Failed to update material on server, updating locally:', error);
    }

    // Update locally if network fails
    this.materials[index] = updatedMaterial;
    await this.updateCache(this.materials);
    this.notifyListeners();
    return updatedMaterial;
  }

  async deleteMaterial(id: string): Promise<boolean> {
    const index = this.materials.findIndex(m => m.id === id);
    if (index === -1) return false;

    try {
      const response = await fetch(`/api/materials/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        this.materials.splice(index, 1);
        await this.updateCache(this.materials);
        return true;
      }
    } catch (error) {
      console.error('Failed to delete material on server, deleting locally:', error);
    }

    // Delete locally if network fails
    this.materials.splice(index, 1);
    await this.updateCache(this.materials);
    this.notifyListeners();
    return true;
  }

  async getPublicMaterials(): Promise<LearningMaterial[]> {
    return this.getMaterials({ isPublic: true });
  }

  async getMaterialsByType(type: string): Promise<LearningMaterial[]> {
    return this.getMaterials({ type });
  }

  async getMaterialsBySubject(subject: string): Promise<LearningMaterial[]> {
    return this.getMaterials({ subject });
  }

  async getMaterialsByGrade(gradeLevel: number): Promise<LearningMaterial[]> {
    return this.getMaterials({ gradeLevel });
  }

  async searchMaterials(query: string): Promise<LearningMaterial[]> {
    return this.getMaterials({ search: query });
  }

  async getRecentMaterials(limit: number = 10): Promise<LearningMaterial[]> {
    const materials = await this.getMaterials();
    return materials
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, limit);
  }

  async getPopularMaterials(limit: number = 10): Promise<LearningMaterial[]> {
    const materials = await this.getMaterials();
    return materials
      .filter(m => m.rating && m.rating >= 4)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);
  }

  async getMaterialStatistics() {
    const materials = await this.getMaterials();
    
    const totalMaterials = materials.length;
    const publishedMaterials = materials.filter(m => m.isPublished).length;
    const publicMaterials = materials.filter(m => m.isPublic).length;
    
    const subjects = [...new Set(materials.map(m => m.subject))];
    const gradeLevels = [...new Set(materials.map(m => m.gradeLevel))].sort();
    
    const materialsByType = materials.reduce((acc, material) => {
      acc[material.type] = (acc[material.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalMaterials,
      publishedMaterials,
      publicMaterials,
      subjects,
      gradeLevels,
      materialsByType
    };
  }
}

export const learningMaterialsService = new LearningMaterialsService();