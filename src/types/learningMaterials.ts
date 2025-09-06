export interface LearningMaterial {
  id: string;
  title: string;
  description: string;
  type: 'lesson' | 'video' | 'assignment' | 'quiz' | 'document' | 'pdf' | 'presentation' | 'reading' | 'interactive';
  subject: string;
  gradeLevel: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  content: string;
  externalUrl?: string;
  attachments: MaterialAttachment[];
  tags: string[];
  estimatedDuration: number; // in minutes
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  isPublic?: boolean;
  assignedTo: string[];
  dueDate?: string;
  maxScore?: number;
  instructions?: string;
  courseId?: string;
  module?: string;
  prerequisites?: string[];
  learningObjectives?: string[];
  downloadable?: boolean;
  fileSize?: number;
  lastAccessed?: string;
  completionStatus?: 'not_started' | 'in_progress' | 'completed';
  timeSpent?: number; // in minutes
  bookmarked?: boolean;
  rating?: number; // 1-5 stars
  notes?: string;
  parentId?: string;
  order: number;
  isActive: boolean;
}

export interface MaterialAttachment {
  id: string;
  name: string;
  url: string;
  type: 'pdf' | 'doc' | 'ppt' | 'image' | 'video' | 'audio' | 'other';
  size: number;
  uploadedAt: string;
}

export interface Assignment extends LearningMaterial {
  type: 'assignment';
  submissions: AssignmentSubmission[];
  rubric?: AssignmentRubric;
  allowLateSubmissions: boolean;
  maxAttempts?: number;
}

export interface AssignmentSubmission {
  id: string;
  studentId: string;
  assignmentId: string;
  submittedAt: string;
  content: string;
  attachments: MaterialAttachment[];
  score?: number;
  feedback?: string;
  gradedAt?: string;
  gradedBy?: string;
  attempt: number;
  status: 'submitted' | 'graded' | 'returned';
}

export interface AssignmentRubric {
  id: string;
  criteria: RubricCriterion[];
  totalPoints: number;
}

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  points: number;
  levels: RubricLevel[];
}

export interface RubricLevel {
  id: string;
  name: string;
  description: string;
  points: number;
}

export interface Quiz extends LearningMaterial {
  type: 'quiz';
  questions: QuizQuestion[];
  timeLimit?: number; // in minutes
  attempts: QuizAttempt[];
  showCorrectAnswers: boolean;
  randomizeQuestions: boolean;
  passingScore?: number;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  question: string;
  options?: string[]; // for multiple choice
  correctAnswer: string | string[];
  points: number;
  explanation?: string;
}

export interface QuizAttempt {
  id: string;
  studentId: string;
  quizId: string;
  startedAt: string;
  submittedAt?: string;
  answers: QuizAnswer[];
  score?: number;
  timeSpent?: number;
  attempt: number;
}

export interface QuizAnswer {
  questionId: string;
  answer: string | string[];
  isCorrect?: boolean;
  pointsEarned?: number;
}

export interface StudentProgress {
  studentId: string;
  materialId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number; // 0-100
  timeSpent: number; // in minutes
  lastAccessed: string;
  completedSections?: string[];
  bookmarked: boolean;
  rating?: number;
  notes?: string;
  score?: number;
  attempts?: number;
  lastAttemptAt?: string;
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  courseId: string;
  materials: string[]; // material IDs in order
  estimatedDuration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites?: string[];
  isRecommended?: boolean;
}

export interface RecentActivity {
  id: string;
  studentId: string;
  materialId: string;
  materialTitle: string;
  action: 'viewed' | 'completed' | 'bookmarked' | 'downloaded' | 'started';
  timestamp: string;
  duration?: number;
}

export interface MaterialCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  materials: string[]; // material IDs
  order: number;
}

export interface StudySession {
  id: string;
  studentId: string;
  materialIds: string[];
  startedAt: string;
  endedAt?: string;
  totalDuration: number; // in minutes
  materialsCompleted: number;
  notes?: string;
}

export interface Bookmark {
  id: string;
  studentId: string;
  materialId: string;
  createdAt: string;
  notes?: string;
  tags?: string[];
}

export interface MaterialReview {
  id: string;
  studentId: string;
  materialId: string;
  rating: number; // 1-5 stars
  review?: string;
  createdAt: string;
  helpful?: boolean;
}

export interface LearningGoal {
  id: string;
  studentId: string;
  title: string;
  description: string;
  targetDate: string;
  materialIds: string[];
  progress: number; // 0-100
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
  updatedAt: string;
}