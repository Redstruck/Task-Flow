// Test script to create completed tasks for testing the "Delete All Completed Tasks" functionality
console.log('🧪 Creating test data for Delete All Completed Tasks feature...');

// Get existing lists or create default structure
const existingListsJson = localStorage.getItem('task-flow-lists');
let existingLists;

try {
  existingLists = existingListsJson ? JSON.parse(existingListsJson) : [];
} catch (error) {
  console.error('Error parsing existing lists, creating new ones:', error);
  existingLists = [];
}

// Ensure we have at least 2 lists for testing
if (existingLists.length === 0) {
  existingLists = [
    {
      id: `list-1-${Date.now()}`,
      title: 'Personal Tasks',
      description: 'My personal todo items',
      color: 'blue',
      tasks: [],
      sortMethod: 'smart',
      createdAt: new Date().toISOString()
    },
    {
      id: `list-2-${Date.now() + 1}`,
      title: 'Work Projects',
      description: 'Work-related tasks',
      color: 'purple',
      tasks: [],
      sortMethod: 'priority',
      createdAt: new Date().toISOString()
    }
  ];
}

// Add test tasks with mixed completion status
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

// Test tasks for first list (Personal Tasks)
const personalTasks = [
  {
    id: `task-personal-1-${Date.now()}`,
    title: 'Buy groceries',
    description: 'Get milk, eggs, and bread',
    completed: true,
    priority: 'medium',
    createdAt: yesterday.toISOString(),
    completedAt: today.toISOString(),
    updatedAt: today.toISOString(),
    tags: ['shopping', 'personal'],
    subtasks: []
  },
  {
    id: `task-personal-2-${Date.now() + 1}`,
    title: 'Walk the dog',
    description: 'Evening walk in the park',
    completed: true,
    priority: 'low',
    createdAt: yesterday.toISOString(),
    completedAt: today.toISOString(),
    updatedAt: today.toISOString(),
    tags: ['pets'],
    subtasks: []
  },
  {
    id: `task-personal-3-${Date.now() + 2}`,
    title: 'Call mom',
    description: 'Weekly check-in call',
    completed: false,
    priority: 'high',
    createdAt: today.toISOString(),
    updatedAt: today.toISOString(),
    tags: ['family'],
    subtasks: []
  },
  {
    id: `task-personal-4-${Date.now() + 3}`,
    title: 'Read book chapter',
    description: 'Finish chapter 5',
    completed: true,
    priority: 'low',
    createdAt: yesterday.toISOString(),
    completedAt: today.toISOString(),
    updatedAt: today.toISOString(),
    tags: ['reading', 'personal'],
    subtasks: []
  }
];

// Test tasks for second list (Work Projects)
const workTasks = [
  {
    id: `task-work-1-${Date.now() + 10}`,
    title: 'Submit quarterly report',
    description: 'Q3 financial summary',
    completed: true,
    priority: 'high',
    createdAt: yesterday.toISOString(),
    completedAt: today.toISOString(),
    updatedAt: today.toISOString(),
    tags: ['report', 'finance'],
    subtasks: []
  },
  {
    id: `task-work-2-${Date.now() + 11}`,
    title: 'Team standup meeting',
    description: 'Daily sync with the team',
    completed: true,
    priority: 'medium',
    createdAt: today.toISOString(),
    completedAt: today.toISOString(),
    updatedAt: today.toISOString(),
    tags: ['meeting'],
    subtasks: []
  },
  {
    id: `task-work-3-${Date.now() + 12}`,
    title: 'Review pull requests',
    description: 'Code review for new features',
    completed: false,
    priority: 'medium',
    createdAt: today.toISOString(),
    updatedAt: today.toISOString(),
    tags: ['development', 'code-review'],
    subtasks: []
  },
  {
    id: `task-work-4-${Date.now() + 13}`,
    title: 'Update documentation',
    description: 'API documentation updates',
    completed: true,
    priority: 'low',
    createdAt: yesterday.toISOString(),
    completedAt: today.toISOString(),
    updatedAt: today.toISOString(),
    tags: ['documentation'],
    subtasks: []
  },
  {
    id: `task-work-5-${Date.now() + 14}`,
    title: 'Client presentation prep',
    description: 'Prepare slides for Monday meeting',
    completed: true,
    priority: 'high',
    createdAt: yesterday.toISOString(),
    completedAt: today.toISOString(),
    updatedAt: today.toISOString(),
    tags: ['presentation', 'client'],
    subtasks: []
  }
];

// Add tasks to lists
existingLists[0].tasks = [...(existingLists[0].tasks || []), ...personalTasks];
existingLists[1].tasks = [...(existingLists[1].tasks || []), ...workTasks];

// Save to localStorage
localStorage.setItem('task-flow-lists', JSON.stringify(existingLists));

// Count completed tasks for confirmation
const completedCount = existingLists.reduce((total, list) => {
  const completed = list.tasks.filter(task => task.completed).length;
  console.log(`📋 ${list.title}: ${completed} completed tasks`);
  return total + completed;
}, 0);

console.log(`✅ Test data created successfully!`);
console.log(`📊 Summary:`);
console.log(`   • Total lists: ${existingLists.length}`);
console.log(`   • Total completed tasks: ${completedCount}`);
console.log(`   • Total active tasks: ${existingLists.reduce((total, list) => total + list.tasks.filter(t => !t.completed).length, 0)}`);
console.log('');
console.log('🧪 Test the "Delete All Completed Tasks" feature:');
console.log('   1. Open the TaskFlow application');
console.log('   2. Click the Settings button (gear icon) in the header');
console.log('   3. Go to the "Data" tab');
console.log('   4. Click "Delete All Completed Tasks" button');
console.log('   5. Confirm the deletion in the dialog');
console.log('   6. Verify that only active tasks remain');
console.log('');
console.log('💡 Expected result: All completed tasks should be removed from both lists');

// Refresh the page to load new data
window.location.reload();
