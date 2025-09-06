import React from 'react';
import { Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { useConnectionStatus } from '../../hooks/useConnectionStatus';

export function ConnectionIndicator() {
  const { isOnline, wasOffline } = useConnectionStatus();

  if (isOnline && !wasOffline) {
    return null; // Don't show indicator when online and never was offline
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`
        flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg text-sm font-medium transition-all duration-300
        ${isOnline 
          ? 'bg-green-50 border border-green-200 text-green-800' 
          : 'bg-red-50 border border-red-200 text-red-800'
        }
      `}>
        {isOnline ? (
          <>
            <Wifi className="w-4 h-4" />
            <span>Back Online</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            <span>Offline Mode</span>
          </>
        )}
      </div>

      {!isOnline && (
        <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Limited Functionality</p>
              <p className="text-xs mt-1">Some features may not work while offline. Changes will sync when connection is restored.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}