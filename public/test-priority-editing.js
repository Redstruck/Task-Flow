// Priority Editing Test Script
// Run this in the browser console to add test tasks for priority editing

const addPriorityTestTasks = () => {
  const existingLists = JSON.parse(localStorage.getItem('task-flow-lists') || '[]');
  
  if (existingLists.length === 0) {
    console.log('❌ No task lists found. Please create a task list first.');
    return;
  }
  
  const today = new Date();
  const testTasks = [
    {
      id: `priority-test-1-${Date.now()}`,
      title: 'High Priority Task - Edit Me!',
      description: 'This is a high priority task. Try editing it to change the priority.',
      completed: false,
      priority: 'high',
      dueDate: new Date(today.getTime() + (24 * 60 * 60 * 1000)).toISOString(), // Tomorrow
      createdAt: today.toISOString(),
      updatedAt: today.toISOString(),
      tags: ['test', 'priority'],
      subtasks: [],
      estimatedTime: 60
    },
    {
      id: `priority-test-2-${Date.now() + 1}`,
      title: 'Medium Priority Task - Change Priority!',
      description: 'Click the edit button to test the priority selector.',
      completed: false,
      priority: 'medium',
      createdAt: today.toISOString(),
      updatedAt: today.toISOString(),
      tags: ['test'],
      subtasks: []
    },
    {
      id: `priority-test-3-${Date.now() + 2}`,
      title: 'Low Priority Task - Try Different Priorities!',
      description: 'Test changing this from low to high priority.',
      completed: false,
      priority: 'low',
      createdAt: today.toISOString(),
      updatedAt: today.toISOString(),
      tags: ['test', 'ui'],
      subtasks: []
    }
  ];
  
  // Add tasks to the first list
  existingLists[0].tasks.push(...testTasks);
  localStorage.setItem('task-flow-lists', JSON.stringify(existingLists));
  
  console.log('✅ Added 3 test tasks for priority editing!');
  console.log('📝 To test priority editing:');
  console.log('  1. Find the test tasks in your task list');
  console.log('  2. Click the edit icon (pencil) on any task');
  console.log('  3. Look for the "Priority" section in the edit form');
  console.log('  4. Click different priority buttons (Low, Medium, High)');
  console.log('  5. Click "Save" to persist the changes');
  console.log('  6. Notice the priority badge updates with new color and icon');
  console.log('🎯 Refresh the page to see the test tasks!');
};

// Instructions
console.log(`
🎯 PRIORITY EDITING TEST

To add test tasks for priority editing, run:
addPriorityTestTasks();

This will add 3 test tasks with different priorities that you can edit.

🔧 HOW TO TEST PRIORITY EDITING:
1. Look for tasks with "Edit Me!" or "Change Priority!" in the title
2. Click the edit icon (pencil) on any incomplete task
3. In the edit form, find the "Priority" section
4. Click on Low, Medium, or High priority buttons
5. Notice the visual feedback and selection state
6. Click "Save" to apply changes
7. Observe the updated priority badge with flag icon and color

🎨 VISUAL INDICATORS:
- High Priority: Red flag icon and red background
- Medium Priority: Yellow flag icon and yellow background  
- Low Priority: Green flag icon and green background
- Selected priority button has colored background
- Unselected buttons are gray with hover effects
`);

// Make function globally available
window.addPriorityTestTasks = addPriorityTestTasks;
