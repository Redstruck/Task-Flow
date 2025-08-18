import { useState, useEffect } from 'react';

// Deep merge utility function
function deepMerge<T>(target: T, source: Partial<T>): T {
  const result = { ...target };
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key];
      const targetValue = result[key];
      
      if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue) &&
          targetValue && typeof targetValue === 'object' && !Array.isArray(targetValue)) {
        result[key] = deepMerge(targetValue, sourceValue);
      } else if (sourceValue !== undefined) {
        result[key] = sourceValue;
      }
    }
  }
  
  return result;
}

// Enhanced useLocalStorage hook with error handling and backup
export function useLocalStorage<T>(key: string, initialValue: T, useDeepMerge: boolean = false) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        
        // Check if parsed value is null or undefined
        if (parsed === null || parsed === undefined) {
          console.log(`🆕 Parsed value is null for ${key}, using default value`);
          return initialValue;
        }
        
        console.log(`📖 Loaded ${key}:`, Array.isArray(parsed) ? `${parsed.length} items` : 'data loaded');
        
        // Use deep merge for settings to ensure all nested properties exist
        if (useDeepMerge && key === 'task-flow-settings') {
          return deepMerge(initialValue, parsed);
        }
        
        return parsed;
      }
      console.log(`🆕 Initializing ${key} with default value`);
      return initialValue;
    } catch (error) {
      console.error(`❌ Error reading localStorage key "${key}":`, error);
      // Try to recover from backup
      try {
        const backupKey = `${key}-backup`;
        const backup = window.localStorage.getItem(backupKey);
        if (backup) {
          console.log(`🔄 Attempting recovery from backup for "${key}"`);
          const parsed = JSON.parse(backup);
          
          // Check if backup parsed value is null or undefined
          if (parsed === null || parsed === undefined) {
            console.log(`🆕 Backup parsed value is null for ${key}, using default value`);
            return initialValue;
          }
          
          // Use deep merge for settings backup recovery too
          if (useDeepMerge && key === 'task-flow-settings') {
            return deepMerge(initialValue, parsed);
          }
          
          return parsed;
        }
      } catch (backupError) {
        console.error(`❌ Backup recovery failed for "${key}":`, backupError);
      }
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Create backup of current data before overwriting
      const currentData = window.localStorage.getItem(key);
      if (currentData) {
        const backupKey = `${key}-backup`;
        window.localStorage.setItem(backupKey, currentData);
      }
      
      // Save new data
      setStoredValue(valueToStore);
      const serialized = JSON.stringify(valueToStore);
      window.localStorage.setItem(key, serialized);
      
      console.log(`💾 Saved ${key}:`, Array.isArray(valueToStore) ? `${valueToStore.length} items` : 'data saved');
      
      // Dispatch custom event for other parts of app to listen to
      window.dispatchEvent(new CustomEvent('taskflow-data-saved', {
        detail: { key, size: new Blob([serialized]).size }
      }));
      
    } catch (error) {
      console.error(`❌ Error setting localStorage key "${key}":`, error);
      
      // Check if storage is full
      if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
        console.warn('⚠️ LocalStorage quota exceeded! Attempting cleanup...');
        cleanupOldData();
        
        // Try again after cleanup
        try {
          setStoredValue(valueToStore);
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          console.log(`💾 Saved ${key} after cleanup`);
        } catch (retryError) {
          console.error(`❌ Failed to save ${key} even after cleanup:`, retryError);
        }
      }
    }
  };

  return [storedValue, setValue] as const;
}

// Cleanup function for old data
function cleanupOldData() {
  const keysToClean = [
    'task-flow-lists-backup',
    'task-flow-templates-backup', 
    'task-flow-settings-backup',
    'task-flow-calendar-events-backup'
  ];
  
  keysToClean.forEach(key => {
    try {
      window.localStorage.removeItem(key);
      console.log(`🧹 Cleaned up old backup: ${key}`);
    } catch (error) {
      console.error(`❌ Error cleaning up ${key}:`, error);
    }
  });
}

// Enhanced localStorage with automatic periodic saves
export function usePersistedState<T>(key: string, initialValue: T, autoSaveInterval = 30000, useDeepMerge: boolean = false) {
  const [storedValue, setValue] = useLocalStorage(key, initialValue, useDeepMerge);
  
  // Auto-save periodically
  useEffect(() => {
    if (autoSaveInterval > 0) {
      const interval = setInterval(() => {
        // Trigger a save by setting the current value
        setValue(current => current);
      }, autoSaveInterval);
      
      return () => clearInterval(interval);
    }
  }, [setValue, autoSaveInterval]);
  
  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      setValue(current => current);
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [setValue]);
  
  return [storedValue, setValue] as const;
}
