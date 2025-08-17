// Data migration and validation utilities
import { TodoList, TaskTemplate, AppSettings, CalendarEvent } from '../types';

interface MigrationResult {
  success: boolean;
  migratedKeys: string[];
  errors: string[];
}

// Legacy key mappings for migration
const LEGACY_KEY_MAPPINGS = {
  'todo-lists': 'task-flow-lists',
  'task-templates': 'task-flow-templates', 
  'app-settings': 'task-flow-settings',
  'calendar-events': 'task-flow-calendar-events'
};

export const migrateLocalStorageData = (): MigrationResult => {
  const result: MigrationResult = {
    success: true,
    migratedKeys: [],
    errors: []
  };

  Object.entries(LEGACY_KEY_MAPPINGS).forEach(([oldKey, newKey]) => {
    try {
      const oldData = localStorage.getItem(oldKey);
      const newData = localStorage.getItem(newKey);
      
      if (oldData && !newData) {
        // Migrate old data to new key
        localStorage.setItem(newKey, oldData);
        result.migratedKeys.push(`${oldKey} → ${newKey}`);
        console.log(`🔄 Migrated ${oldKey} to ${newKey}`);
        
        // Remove old key after successful migration
        localStorage.removeItem(oldKey);
      }
    } catch (error) {
      result.success = false;
      result.errors.push(`Failed to migrate ${oldKey}: ${error.message}`);
      console.error(`❌ Migration error for ${oldKey}:`, error);
    }
  });

  return result;
};

export const validateStoredData = () => {
  const validationResults = {
    lists: { valid: false, error: null as string | null, data: null as TodoList[] | null },
    templates: { valid: false, error: null as string | null, data: null as TaskTemplate[] | null },
    settings: { valid: false, error: null as string | null, data: null as AppSettings | null },
    calendarEvents: { valid: false, error: null as string | null, data: null as CalendarEvent[] | null }
  };

  // Validate lists
  try {
    const listsData = localStorage.getItem('task-flow-lists');
    if (listsData) {
      const parsed = JSON.parse(listsData) as TodoList[];
      if (Array.isArray(parsed)) {
        // Validate structure of each list
        const validLists = parsed.every(list => 
          list.id && 
          list.title && 
          Array.isArray(list.tasks) &&
          list.tasks.every(task => task.id && task.title && typeof task.completed === 'boolean')
        );
        if (validLists) {
          validationResults.lists = { valid: true, error: null, data: parsed };
        } else {
          validationResults.lists.error = 'Invalid list structure';
        }
      } else {
        validationResults.lists.error = 'Lists data is not an array';
      }
    } else {
      validationResults.lists = { valid: true, error: null, data: [] };
    }
  } catch (error) {
    validationResults.lists.error = error.message;
  }

  // Validate templates
  try {
    const templatesData = localStorage.getItem('task-flow-templates');
    if (templatesData) {
      const parsed = JSON.parse(templatesData) as TaskTemplate[];
      if (Array.isArray(parsed)) {
        const validTemplates = parsed.every(template => 
          template.id && template.name && template.title
        );
        if (validTemplates) {
          validationResults.templates = { valid: true, error: null, data: parsed };
        } else {
          validationResults.templates.error = 'Invalid template structure';
        }
      } else {
        validationResults.templates.error = 'Templates data is not an array';
      }
    } else {
      validationResults.templates = { valid: true, error: null, data: [] };
    }
  } catch (error) {
    validationResults.templates.error = error.message;
  }

  // Validate settings
  try {
    const settingsData = localStorage.getItem('task-flow-settings');
    if (settingsData) {
      const parsed = JSON.parse(settingsData) as AppSettings;
      if (typeof parsed === 'object' && parsed !== null) {
        validationResults.settings = { valid: true, error: null, data: parsed };
      } else {
        validationResults.settings.error = 'Settings data is not an object';
      }
    } else {
      validationResults.settings.error = 'No settings found';
    }
  } catch (error) {
    validationResults.settings.error = error.message;
  }

  // Validate calendar events
  try {
    const calendarData = localStorage.getItem('task-flow-calendar-events');
    if (calendarData) {
      const parsed = JSON.parse(calendarData) as CalendarEvent[];
      if (Array.isArray(parsed)) {
        const validEvents = parsed.every(event => 
          event.id && event.title && event.start && event.end
        );
        if (validEvents) {
          validationResults.calendarEvents = { valid: true, error: null, data: parsed };
        } else {
          validationResults.calendarEvents.error = 'Invalid event structure';
        }
      } else {
        validationResults.calendarEvents.error = 'Calendar events data is not an array';
      }
    } else {
      validationResults.calendarEvents = { valid: true, error: null, data: [] };
    }
  } catch (error) {
    validationResults.calendarEvents.error = error.message;
  }

  return validationResults;
};

export const createDataBackup = () => {
  const timestamp = new Date().toISOString();
  const backupData = {
    timestamp,
    version: '1.0.0',
    data: {} as any
  };

  const keys = [
    'task-flow-lists',
    'task-flow-templates', 
    'task-flow-settings',
    'task-flow-calendar-events'
  ];

  keys.forEach(key => {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        backupData.data[key] = JSON.parse(data);
      } catch (error) {
        console.error(`Error backing up ${key}:`, error);
        backupData.data[key] = data; // Store as string if JSON parse fails
      }
    }
  });

  // Store backup
  const backupKey = `task-flow-backup-${Date.now()}`;
  localStorage.setItem(backupKey, JSON.stringify(backupData));
  
  // Clean up old backups (keep only last 5)
  const allKeys = Object.keys(localStorage);
  const backupKeys = allKeys.filter(key => key.startsWith('task-flow-backup-')).sort();
  
  if (backupKeys.length > 5) {
    const keysToRemove = backupKeys.slice(0, -5);
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      console.log(`🧹 Removed old backup: ${key}`);
    });
  }

  console.log(`💾 Created backup: ${backupKey}`);
  return backupKey;
};

export const restoreDataFromBackup = (backupKey: string) => {
  try {
    const backupData = localStorage.getItem(backupKey);
    if (!backupData) {
      throw new Error('Backup not found');
    }

    const parsed = JSON.parse(backupData);
    if (!parsed.data) {
      throw new Error('Invalid backup format');
    }

    // Restore each data type
    Object.entries(parsed.data).forEach(([key, data]) => {
      localStorage.setItem(key, JSON.stringify(data));
      console.log(`🔄 Restored ${key} from backup`);
    });

    console.log('✅ Data restored successfully from backup');
    return true;
  } catch (error) {
    console.error('❌ Failed to restore from backup:', error);
    return false;
  }
};

// Initialize data migration and validation on app start
export const initializeDataPersistence = () => {
  console.log('🚀 Initializing data persistence...');
  
  // Run migration first
  const migrationResult = migrateLocalStorageData();
  if (migrationResult.migratedKeys.length > 0) {
    console.log('✅ Migration completed:', migrationResult.migratedKeys);
  }
  if (migrationResult.errors.length > 0) {
    console.warn('⚠️ Migration errors:', migrationResult.errors);
  }
  
  // Validate data
  const validation = validateStoredData();
  const hasErrors = Object.values(validation).some(result => !result.valid);
  
  if (hasErrors) {
    console.warn('⚠️ Data validation issues found:', validation);
  } else {
    console.log('✅ All data validated successfully');
  }
  
  // Create initial backup
  createDataBackup();
  
  return { migration: migrationResult, validation, hasErrors };
};
