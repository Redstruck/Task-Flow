// Test script to add sample data for calendar testing
// This can be run in the browser console to add test tasks with due dates

const addTestData = () => {
  // Get existing data
  const existingLists = JSON.parse(localStorage.getItem('task-flow-lists') || '[]');
  const existingCalendarEvents = JSON.parse(localStorage.getItem('task-flow-calendar-events') || '[]');
  
  // Create test tasks with due dates if no lists exist or if lists are empty
  if (existingLists.length === 0 || existingLists.every(list => list.tasks.length === 0)) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    const testTasks = [
      {
        id: 'test-task-1',
        title: 'High Priority Meeting',
        description: 'Important client meeting - cannot be rescheduled',
        completed: false,
        priority: 'high',
        dueDate: today.toISOString(),
        createdAt: today.toISOString(),
        updatedAt: today.toISOString(),
        tags: ['meeting', 'client'],
        subtasks: [],
        estimatedTime: 120 // 2 hours
      },
      {
        id: 'test-task-2',
        title: 'Medium Priority Report',
        description: 'Weekly status report due tomorrow',
        completed: false,
        priority: 'medium',
        dueDate: tomorrow.toISOString(),
        createdAt: today.toISOString(),
        updatedAt: today.toISOString(),
        tags: ['report', 'weekly'],
        subtasks: [],
        estimatedTime: 60 // 1 hour
      },
      {
        id: 'test-task-3',
        title: 'Low Priority Code Review',
        description: 'Review pull requests when time permits',
        completed: false,
        priority: 'low',
        dueDate: nextWeek.toISOString(),
        createdAt: today.toISOString(),
        updatedAt: today.toISOString(),
        tags: ['code', 'review'],
        subtasks: [],
        estimatedTime: 45
      }
    ];
    
    // Add tasks to the first list, or create a new list if none exists
    if (existingLists.length === 0) {
      const newList = {
        id: 'default-list',
        title: 'My Tasks',
        description: 'Default task list',
        color: 'red',
        tasks: testTasks,
        sortMethod: 'smart',
        createdAt: today.toISOString()
      };
      localStorage.setItem('task-flow-lists', JSON.stringify([newList]));
    } else {
      existingLists[0].tasks.push(...testTasks);
      localStorage.setItem('task-flow-lists', JSON.stringify(existingLists));
    }
    
    console.log('✅ Added test tasks with due dates');
  } else {
    console.log('ℹ️ Test tasks already exist or lists have tasks');
  }
  
  // Add a test calendar event if none exist
  if (existingCalendarEvents.length === 0) {
    const testEvent = {
      id: 'test-calendar-event-1',
      title: 'Team Standup',
      description: 'Daily team synchronization meeting',
      start: new Date(today.getTime() + (2 * 24 * 60 * 60 * 1000)).toISOString(), // Day after tomorrow
      end: new Date(today.getTime() + (2 * 24 * 60 * 60 * 1000) + (30 * 60 * 1000)).toISOString(), // 30 minutes later
      allDay: false,
      color: 'sky',
      listId: existingLists[0]?.id || 'default-list'
    };
    
    localStorage.setItem('task-flow-calendar-events', JSON.stringify([testEvent]));
    console.log('✅ Added test calendar event');
  } else {
    console.log('ℹ️ Test calendar events already exist');
  }
  
  console.log('🎯 Test data setup complete! Refresh the page to see the changes.');
};

// Instructions for use
console.log(`
📋 CALENDAR TEST DATA SETUP

To add test data for calendar testing, run this in the browser console:
addTestData();

This will add:
- 3 test tasks with due dates (today, tomorrow, next week)
- 1 test calendar event
- Tasks will have different priorities (high, medium, low) to test color coding

After running, refresh the page and open the calendar to see:
- Tasks appearing as calendar events with correct colors
- Regular calendar events
- Both types working together
`);

// Export the function globally so it can be called from console
window.addTestData = addTestData;
