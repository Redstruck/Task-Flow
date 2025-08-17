// localStorage Validation Script
// Run this in the browser console to verify all data is being saved properly

const validateLocalStorage = () => {
  console.log('🔍 TASK FLOW - LOCALSTORAGE VALIDATION');
  console.log('=====================================');
  
  const keys = {
    lists: 'task-flow-lists',
    templates: 'task-flow-templates', 
    settings: 'task-flow-settings',
    calendarEvents: 'task-flow-calendar-events'
  };
  
  const validation = {
    lists: null,
    templates: null,
    settings: null,
    calendarEvents: null,
    totalItems: 0,
    totalSize: 0
  };
  
  // Check each key
  Object.entries(keys).forEach(([category, key]) => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        validation[category] = {
          exists: true,
          size: new Blob([item]).size,
          itemCount: Array.isArray(parsed) ? parsed.length : (typeof parsed === 'object' ? Object.keys(parsed).length : 1),
          lastModified: parsed.updatedAt || parsed[0]?.updatedAt || 'Unknown',
          data: parsed
        };
        validation.totalSize += validation[category].size;
        validation.totalItems += validation[category].itemCount;
        
        console.log(`✅ ${category.toUpperCase()}:`);
        console.log(`   Key: ${key}`);
        console.log(`   Size: ${(validation[category].size / 1024).toFixed(2)} KB`);
        console.log(`   Items: ${validation[category].itemCount}`);
        
        // Detailed info for each category
        if (category === 'lists' && Array.isArray(parsed)) {
          console.log(`   Lists:`);
          parsed.forEach((list, i) => {
            console.log(`     ${i + 1}. "${list.title}" (${list.tasks?.length || 0} tasks)`);
          });
        } else if (category === 'templates' && Array.isArray(parsed)) {
          console.log(`   Templates:`);
          parsed.forEach((template, i) => {
            console.log(`     ${i + 1}. "${template.name}"`);
          });
        } else if (category === 'calendarEvents' && Array.isArray(parsed)) {
          console.log(`   Calendar Events:`);
          parsed.forEach((event, i) => {
            console.log(`     ${i + 1}. "${event.title}" (${new Date(event.start).toLocaleDateString()})`);
          });
        } else if (category === 'settings') {
          console.log(`   Settings categories: ${Object.keys(parsed).join(', ')}`);
        }
      } else {
        validation[category] = { exists: false };
        console.log(`❌ ${category.toUpperCase()}: Not found (key: ${key})`);
      }
    } catch (error) {
      validation[category] = { exists: false, error: error.message };
      console.log(`⚠️  ${category.toUpperCase()}: Error - ${error.message}`);
    }
    console.log('');
  });
  
  // Summary
  console.log('📊 SUMMARY:');
  console.log(`Total localStorage usage: ${(validation.totalSize / 1024).toFixed(2)} KB`);
  console.log(`Total items stored: ${validation.totalItems}`);
  
  // Storage quota info
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    navigator.storage.estimate().then(estimate => {
      const used = estimate.usage ? (estimate.usage / 1024 / 1024).toFixed(2) : 'Unknown';
      const quota = estimate.quota ? (estimate.quota / 1024 / 1024).toFixed(2) : 'Unknown';
      console.log(`Storage used: ${used} MB of ${quota} MB available`);
    });
  }
  
  return validation;
};

const testDataPersistence = () => {
  console.log('🧪 TESTING DATA PERSISTENCE');
  console.log('============================');
  
  const testKey = 'task-flow-persistence-test';
  const testData = {
    timestamp: new Date().toISOString(),
    testValue: Math.random()
  };
  
  try {
    // Test write
    localStorage.setItem(testKey, JSON.stringify(testData));
    console.log('✅ Write test: SUCCESS');
    
    // Test read
    const retrieved = JSON.parse(localStorage.getItem(testKey));
    if (retrieved && retrieved.testValue === testData.testValue) {
      console.log('✅ Read test: SUCCESS');
    } else {
      console.log('❌ Read test: FAILED - Data mismatch');
    }
    
    // Test update
    retrieved.updated = true;
    localStorage.setItem(testKey, JSON.stringify(retrieved));
    const updated = JSON.parse(localStorage.getItem(testKey));
    if (updated && updated.updated) {
      console.log('✅ Update test: SUCCESS');
    } else {
      console.log('❌ Update test: FAILED');
    }
    
    // Clean up
    localStorage.removeItem(testKey);
    console.log('✅ Cleanup: SUCCESS');
    
  } catch (error) {
    console.log('❌ Persistence test failed:', error.message);
  }
};

const exportLocalStorageData = () => {
  console.log('📤 EXPORTING LOCALSTORAGE DATA');
  console.log('==============================');
  
  const keys = [
    'task-flow-lists',
    'task-flow-templates',
    'task-flow-settings', 
    'task-flow-calendar-events'
  ];
  
  const exportData = {};
  
  keys.forEach(key => {
    const item = localStorage.getItem(key);
    if (item) {
      try {
        exportData[key] = JSON.parse(item);
      } catch (error) {
        exportData[key] = item; // Store as string if JSON parse fails
      }
    }
  });
  
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
    type: 'application/json' 
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `taskflow-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  console.log('✅ Data exported successfully!');
  return exportData;
};

// Instructions
console.log(`
🔧 TASK FLOW LOCALSTORAGE UTILITIES

Available functions:
1. validateLocalStorage() - Check all stored data
2. testDataPersistence() - Test read/write operations  
3. exportLocalStorageData() - Download backup of all data

Usage:
validateLocalStorage();    // Check what's stored
testDataPersistence();     // Test storage functionality
exportLocalStorageData();  // Export backup

📋 Expected localStorage keys:
- task-flow-lists (Task lists and tasks)
- task-flow-templates (Task templates)  
- task-flow-settings (App settings)
- task-flow-calendar-events (Calendar events)
`);

// Make functions globally available
window.validateLocalStorage = validateLocalStorage;
window.testDataPersistence = testDataPersistence;
window.exportLocalStorageData = exportLocalStorageData;
