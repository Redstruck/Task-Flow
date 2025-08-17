// COMPREHENSIVE LOCALSTORAGE TEST SUITE
// Copy and paste this entire script into the browser console to run all tests

console.log(`
🧪 TASK FLOW - COMPREHENSIVE LOCALSTORAGE TEST SUITE
===================================================
This script will test all aspects of data persistence in Task Flow.
`);

const runComprehensiveTests = async () => {
  let passed = 0;
  let failed = 0;
  
  const test = (name, fn) => {
    try {
      const result = fn();
      if (result) {
        console.log(`✅ ${name}`);
        passed++;
      } else {
        console.log(`❌ ${name}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${name} - Error: ${error.message}`);
      failed++;
    }
  };

  console.log('\n📋 TESTING LOCALSTORAGE KEYS...');
  
  // Test 1: Check all required keys exist
  test('Required localStorage keys exist', () => {
    const requiredKeys = [
      'task-flow-lists',
      'task-flow-templates', 
      'task-flow-settings',
      'task-flow-calendar-events'
    ];
    return requiredKeys.every(key => localStorage.getItem(key) !== null);
  });

  // Test 2: Validate JSON structure
  test('All stored data is valid JSON', () => {
    const keys = ['task-flow-lists', 'task-flow-templates', 'task-flow-settings', 'task-flow-calendar-events'];
    return keys.every(key => {
      const data = localStorage.getItem(key);
      if (!data) return true; // Empty is ok
      try {
        JSON.parse(data);
        return true;
      } catch {
        return false;
      }
    });
  });

  // Test 3: Check lists structure
  test('Task lists have valid structure', () => {
    const listsData = localStorage.getItem('task-flow-lists');
    if (!listsData) return true;
    const lists = JSON.parse(listsData);
    return Array.isArray(lists) && lists.every(list => 
      list.id && list.title && Array.isArray(list.tasks)
    );
  });

  // Test 4: Check settings structure
  test('Settings have valid structure', () => {
    const settingsData = localStorage.getItem('task-flow-settings');
    if (!settingsData) return false;
    const settings = JSON.parse(settingsData);
    return typeof settings === 'object' && 
           settings.theme &&
           settings.notifications &&
           settings.defaultPriority;
  });

  // Test 5: Check calendar events structure  
  test('Calendar events have valid structure', () => {
    const eventsData = localStorage.getItem('task-flow-calendar-events');
    if (!eventsData) return true; // Empty is ok
    const events = JSON.parse(eventsData);
    return Array.isArray(events) && events.every(event => 
      event.id && event.title && event.start && event.end
    );
  });

  console.log('\n🔧 TESTING DATA OPERATIONS...');

  // Test 6: Write and read test
  test('Can write and read data', () => {
    const testKey = 'test-persistence';
    const testData = { test: true, timestamp: Date.now() };
    localStorage.setItem(testKey, JSON.stringify(testData));
    const retrieved = JSON.parse(localStorage.getItem(testKey));
    localStorage.removeItem(testKey);
    return retrieved && retrieved.test === true;
  });

  // Test 7: Check data sizes
  test('Data sizes are reasonable', () => {
    const keys = ['task-flow-lists', 'task-flow-templates', 'task-flow-settings', 'task-flow-calendar-events'];
    const totalSize = keys.reduce((size, key) => {
      const data = localStorage.getItem(key);
      return size + (data ? new Blob([data]).size : 0);
    }, 0);
    console.log(`   Total storage used: ${(totalSize / 1024).toFixed(2)} KB`);
    return totalSize < 5 * 1024 * 1024; // Less than 5MB
  });

  // Test 8: Check for backup system
  test('Backup system is working', () => {
    const allKeys = Object.keys(localStorage);
    const hasBackups = allKeys.some(key => key.includes('-backup'));
    return hasBackups;
  });

  console.log('\n📊 TESTING DATA CONTENT...');

  // Test 9: Check if task data includes all required fields
  test('Tasks contain required fields', () => {
    const listsData = localStorage.getItem('task-flow-lists');
    if (!listsData) return true;
    const lists = JSON.parse(listsData);
    return lists.every(list => 
      list.tasks.every(task => 
        task.id && 
        task.title && 
        typeof task.completed === 'boolean' &&
        task.priority &&
        task.createdAt &&
        task.updatedAt
      )
    );
  });

  // Test 10: Check priority values
  test('Task priorities are valid', () => {
    const listsData = localStorage.getItem('task-flow-lists');
    if (!listsData) return true;
    const lists = JSON.parse(listsData);
    const validPriorities = ['low', 'medium', 'high'];
    return lists.every(list => 
      list.tasks.every(task => 
        validPriorities.includes(task.priority)
      )
    );
  });

  console.log('\n🔍 STORAGE ANALYSIS...');

  // Storage analysis
  const storageAnalysis = () => {
    const keys = ['task-flow-lists', 'task-flow-templates', 'task-flow-settings', 'task-flow-calendar-events'];
    keys.forEach(key => {
      const data = localStorage.getItem(key);
      if (data) {
        const parsed = JSON.parse(data);
        const size = new Blob([data]).size;
        const itemCount = Array.isArray(parsed) ? parsed.length : Object.keys(parsed).length;
        console.log(`   ${key}: ${itemCount} items, ${(size / 1024).toFixed(2)} KB`);
      } else {
        console.log(`   ${key}: Not found`);
      }
    });
  };
  storageAnalysis();

  // Final results
  console.log('\n🎯 TEST RESULTS:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

  if (failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED! Data persistence is working perfectly!');
  } else {
    console.log(`\n⚠️ ${failed} test(s) failed. Check the issues above.`);
  }

  return { passed, failed, successRate: (passed / (passed + failed)) * 100 };
};

// Additional utility functions
const quickDataCheck = () => {
  console.log('\n📋 QUICK DATA CHECK:');
  const lists = JSON.parse(localStorage.getItem('task-flow-lists') || '[]');
  const events = JSON.parse(localStorage.getItem('task-flow-calendar-events') || '[]');
  const settings = JSON.parse(localStorage.getItem('task-flow-settings') || '{}');
  const templates = JSON.parse(localStorage.getItem('task-flow-templates') || '[]');

  console.log(`Lists: ${lists.length} (${lists.reduce((sum, list) => sum + list.tasks.length, 0)} total tasks)`);
  console.log(`Calendar Events: ${events.length}`);
  console.log(`Templates: ${templates.length}`);
  console.log(`Settings: ${Object.keys(settings).length} categories`);
  
  return { lists: lists.length, events: events.length, templates: templates.length, settings: Object.keys(settings).length };
};

const testDataPersistenceFlow = () => {
  console.log('\n🔄 TESTING PERSISTENCE FLOW:');
  
  // Create test task
  console.log('1. Creating test data...');
  const testTask = {
    id: 'test-' + Date.now(),
    title: 'Test Persistence Task',
    completed: false,
    priority: 'medium',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subtasks: []
  };
  
  // Add to first list
  const lists = JSON.parse(localStorage.getItem('task-flow-lists') || '[]');
  if (lists.length > 0) {
    lists[0].tasks.push(testTask);
    localStorage.setItem('task-flow-lists', JSON.stringify(lists));
    console.log('2. ✅ Added test task to localStorage');
    
    // Verify it exists
    const updatedLists = JSON.parse(localStorage.getItem('task-flow-lists'));
    const foundTask = updatedLists[0].tasks.find(task => task.id === testTask.id);
    
    if (foundTask) {
      console.log('3. ✅ Test task found after storage');
      
      // Remove test task
      updatedLists[0].tasks = updatedLists[0].tasks.filter(task => task.id !== testTask.id);
      localStorage.setItem('task-flow-lists', JSON.stringify(updatedLists));
      console.log('4. ✅ Test task removed, cleanup complete');
      
      return true;
    } else {
      console.log('3. ❌ Test task not found after storage');
      return false;
    }
  } else {
    console.log('2. ❌ No lists found to test with');
    return false;
  }
};

// Instructions
console.log(`
🛠️ AVAILABLE COMMANDS:

runComprehensiveTests()     // Run full test suite
quickDataCheck()           // Quick overview of stored data  
testDataPersistenceFlow()  // Test create/read/delete flow
validateLocalStorage()     // Detailed validation (if available)
exportLocalStorageData()   // Export backup (if available)

USAGE:
runComprehensiveTests();   // Start with this
`);

// Make functions globally available
window.runComprehensiveTests = runComprehensiveTests;
window.quickDataCheck = quickDataCheck;
window.testDataPersistenceFlow = testDataPersistenceFlow;
