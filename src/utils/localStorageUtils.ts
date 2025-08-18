import { TodoList, TaskTemplate, AppSettings, CalendarEvent, SearchFilters } from '../types';

// Constants for localStorage keys
export const STORAGE_KEYS = {
  LISTS: 'task-flow-lists',
  TEMPLATES: 'task-flow-templates',
  SETTINGS: 'task-flow-settings',
  CALENDAR_EVENTS: 'task-flow-calendar-events',
  LAST_ACTIVE_LIST: 'task-flow-last-active-list',
  SEARCH_FILTERS: 'task-flow-search-filters',
  THEME_PREFERENCE: 'task-flow-theme',
  COMPLETED_TASKS_ARCHIVE: 'task-flow-completed-archive',
} as const;

// Complete app state interface
export interface AppState {
  lists: TodoList[];
  templates: TaskTemplate[];
  settings: AppSettings;
  calendarEvents: CalendarEvent[];
  lastActiveListId: string | null;
  searchFilters: SearchFilters;
  completedTasksArchive: any[];
}

// Save all data to localStorage
export const saveToLocalStorage = (state: Partial<AppState>) => {
  try {
    const timestamp = new Date().toISOString();
    
    // Save each piece of data with error handling
    Object.entries(state).forEach(([key, value]) => {
      if (value !== undefined) {
        const storageKey = getStorageKeyFromStateKey(key);
        if (storageKey) {
          const dataWithMeta = {
            data: value,
            timestamp,
            version: '1.0.0'
          };
          
          // Use JSON.stringify with Date handling
          const serialized = JSON.stringify(dataWithMeta, (_, value) => {
            // Convert Date objects to ISO strings
            if (value instanceof Date) {
              return value.toISOString();
            }
            return value;
          });
          
          localStorage.setItem(storageKey, serialized);
          console.log(`💾 Saved ${key} to localStorage:`, Array.isArray(value) ? `${value.length} items` : 'data');
        }
      }
    });

    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('taskflow-data-saved', {
      detail: { 
        keys: Object.keys(state),
        timestamp,
        size: calculateStorageSize()
      }
    }));

    return { success: true };
  } catch (error) {
    console.error('❌ Error saving to localStorage:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
};

// Load all data from localStorage
export const loadFromLocalStorage = (): Partial<AppState> => {
  const state: Partial<AppState> = {};

  try {
    // Load lists
    const listsData = loadDataWithFallback(STORAGE_KEYS.LISTS);
    if (listsData) state.lists = listsData;

    // Load templates
    const templatesData = loadDataWithFallback(STORAGE_KEYS.TEMPLATES);
    if (templatesData) state.templates = templatesData;

    // Load settings
    const settingsData = loadDataWithFallback(STORAGE_KEYS.SETTINGS);
    if (settingsData) state.settings = settingsData;

    // Load calendar events
    const eventsData = loadDataWithFallback(STORAGE_KEYS.CALENDAR_EVENTS);
    if (eventsData) state.calendarEvents = eventsData;

    // Load UI state
    const lastActiveListData = loadDataWithFallback(STORAGE_KEYS.LAST_ACTIVE_LIST);
    if (lastActiveListData) state.lastActiveListId = lastActiveListData;

    const searchFiltersData = loadDataWithFallback(STORAGE_KEYS.SEARCH_FILTERS);
    if (searchFiltersData) state.searchFilters = searchFiltersData;

    console.log('📖 Loaded app state from localStorage:', Object.keys(state));
    return state;
  } catch (error) {
    console.error('❌ Error loading from localStorage:', error);
    return {};
  }
};

// Helper function to load data with fallback to backup
const loadDataWithFallback = (key: string) => {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      const parsed = JSON.parse(item, (_, value) => {
        // Convert ISO strings back to Date objects
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
          return new Date(value);
        }
        return value;
      });
      // Handle both new format with metadata and old format
      return parsed.data || parsed;
    }
  } catch (error) {
    console.warn(`⚠️ Error loading ${key}, trying backup...`);
    // Try backup
    try {
      const backupItem = localStorage.getItem(`${key}-backup`);
      if (backupItem) {
        const parsed = JSON.parse(backupItem, (_, value) => {
          // Convert ISO strings back to Date objects
          if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
            return new Date(value);
          }
          return value;
        });
        console.log(`🔄 Restored ${key} from backup`);
        return parsed.data || parsed;
      }
    } catch (backupError) {
      console.error(`❌ Backup restore failed for ${key}:`, backupError);
    }
  }
  return null;
};

// Map state keys to storage keys
const getStorageKeyFromStateKey = (stateKey: string): string | null => {
  const keyMap: Record<string, string> = {
    lists: STORAGE_KEYS.LISTS,
    templates: STORAGE_KEYS.TEMPLATES,
    settings: STORAGE_KEYS.SETTINGS,
    calendarEvents: STORAGE_KEYS.CALENDAR_EVENTS,
    lastActiveListId: STORAGE_KEYS.LAST_ACTIVE_LIST,
    searchFilters: STORAGE_KEYS.SEARCH_FILTERS,
  };
  return keyMap[stateKey] || null;
};

// Calculate total storage size
export const calculateStorageSize = (): number => {
  let total = 0;
  for (let key in localStorage) {
    if (key.startsWith('task-flow-')) {
      total += localStorage.getItem(key)?.length || 0;
    }
  }
  return total;
};

// Clear all app data from localStorage
export const clearAllLocalStorage = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
      localStorage.removeItem(`${key}-backup`);
    });
    
    console.log('🧹 Cleared all TaskFlow data from localStorage');
    
    // Dispatch clear event
    window.dispatchEvent(new CustomEvent('taskflow-data-cleared'));
    
    return { success: true };
  } catch (error) {
    console.error('❌ Error clearing localStorage:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
};

// Backup current data before making changes
export const createBackup = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      const data = localStorage.getItem(key);
      if (data) {
        localStorage.setItem(`${key}-backup`, data);
      }
    });
    console.log('💾 Created backup of all data');
    return { success: true };
  } catch (error) {
    console.error('❌ Error creating backup:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
};

// Restore from backup
export const restoreFromBackup = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      const backupData = localStorage.getItem(`${key}-backup`);
      if (backupData) {
        localStorage.setItem(key, backupData);
      }
    });
    console.log('🔄 Restored all data from backup');
    return { success: true };
  } catch (error) {
    console.error('❌ Error restoring from backup:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
};

// Get storage usage statistics
export const getStorageStats = () => {
  const stats = {
    totalSize: 0,
    itemCount: 0,
    breakdown: {} as Record<string, number>
  };

  Object.values(STORAGE_KEYS).forEach(key => {
    const data = localStorage.getItem(key);
    if (data) {
      const size = data.length;
      stats.totalSize += size;
      stats.itemCount++;
      stats.breakdown[key] = size;
    }
  });

  return stats;
};
