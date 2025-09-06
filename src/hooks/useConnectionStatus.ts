import { useState, useEffect } from 'react';
import { storageService } from '../lib/storageService';

export function useConnectionStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        // Show reconnection notification
        console.log('Connection restored');
        setWasOffline(false);
      }
      storageService.setOfflineMode(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      storageService.setOfflineMode(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial offline mode from storage
    const wasOfflineMode = storageService.getOfflineMode();
    if (wasOfflineMode && navigator.onLine) {
      setWasOffline(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  return { isOnline, wasOffline };
}