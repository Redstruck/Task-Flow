import { Task, TodoList, SortMethod, TaskTemplate } from '../types';

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const createTask = (title: string, priority: Task['priority'] = 'medium', dueDate?: Date): Task => {
  return {
    id: generateId(),
    title,
    description: '',
    completed: false,
    priority, // Use the exact priority passed in
    dueDate,
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: [],
    subtasks: [],
  };
};

export const createTaskFromTemplate = (template: TaskTemplate): Task => {
  return {
    id: generateId(),
    title: template.title,
    description: template.description || '',
    completed: false,
    priority: template.priority,
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: template.tags || [],
    subtasks: template.subtasks?.map(subtask => ({
      ...subtask,
      id: generateId(),
      createdAt: new Date(),
    })) || [],
    estimatedTime: template.estimatedTime,
  };
};

export const createDefaultList = (): TodoList => {
  return {
    id: generateId(),
    title: 'My Tasks',
    description: 'Default task list',
    color: 'blue',
    tasks: [],
    sortMethod: 'smart',
    createdAt: new Date(),
  };
};

export const createList = (title: string, color: string = 'blue', description?: string): TodoList => {
  return {
    id: generateId(),
    title,
    description,
    color,
    tasks: [],
    sortMethod: 'smart',
    createdAt: new Date(),
  };
};

export const createTemplate = (name: string, title: string, priority: Task['priority'] = 'medium'): TaskTemplate => {
  return {
    id: generateId(),
    name,
    title,
    priority,
    createdAt: new Date(),
  };
};

export const sortTasks = (tasks: Task[], sortMethod: SortMethod): Task[] => {
  const activeTasks = tasks.filter(task => !task.completed);
  
  switch (sortMethod) {
    case 'smart':
      return activeTasks.sort((a, b) => {
        // First by priority (high to low)
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        
        // Then by due date (sooner first, no date last)
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        if (a.dueDate && !b.dueDate) return -1;
        if (!a.dueDate && b.dueDate) return 1;
        
        // Finally by creation date
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
      
    case 'priority':
      return activeTasks.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
      
    case 'dueDate':
      return activeTasks.sort((a, b) => {
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        if (a.dueDate && !b.dueDate) return -1;
        if (!a.dueDate && b.dueDate) return 1;
        return 0;
      });
      
    case 'manual':
    default:
      return activeTasks;
  }
};

export const getPriorityColor = (priority: Task['priority']): string => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getListColor = (color: string): { bg: string; border: string; text: string; accent: string } => {
  const colors = {
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      accent: 'bg-red-500'
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-800',
      accent: 'bg-orange-500'
    },
    yellow: {
      bg: 'bg-yellow-50',
      border: '',
      text: 'text-yellow-800',
      accent: 'bg-yellow-500'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      accent: 'bg-green-500'
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      accent: 'bg-blue-500'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-800',
      accent: 'bg-purple-500'
    }
  };
  
  // Handle migration from indigo to orange
  if (color === 'indigo') {
    return colors.orange;
  }
  
  return colors[color as keyof typeof colors] || colors.blue;
};

export const formatDueDate = (date: Date): string => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const dateStr = date.toDateString();
  const todayStr = today.toDateString();
  const tomorrowStr = tomorrow.toDateString();
  
  if (dateStr === todayStr) return 'Today';
  if (dateStr === tomorrowStr) return 'Tomorrow';
  
  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
  if (diffDays <= 7) return `${diffDays} days`;
  
  return date.toLocaleDateString();
};

export const getTaskStats = (tasks: Task[]) => {
  const total = tasks.filter(task => !task.completed).length;
  const completed = tasks.filter(task => task.completed).length;
  const overdue = tasks.filter(task => 
    task.dueDate && 
    new Date(task.dueDate) < new Date() && 
    !task.completed
  ).length;
  const highPriority = tasks.filter(task => 
    task.priority === 'high' && !task.completed
  ).length;
  
  return { total, completed, overdue, highPriority };
};

export const duplicateTask = (task: Task): Task => {
  return {
    ...task,
    id: generateId(),
    title: `${task.title} (Copy)`,
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    subtasks: task.subtasks?.map(subtask => ({
      ...subtask,
      id: generateId(),
      completed: false,
      createdAt: new Date(),
    })),
  };
};

export const getProductivityStats = (tasks: Task[]) => {
  const completedTasks = tasks.filter(task => task.completed);
  const totalEstimatedTime = tasks.reduce((sum, task) => sum + (task.estimatedTime || 0), 0);
  const totalActualTime = tasks.reduce((sum, task) => sum + (task.actualTime || 0), 0);
  
  const averageCompletionTime = completedTasks.length > 0 
    ? completedTasks.reduce((sum, task) => sum + (task.actualTime || 0), 0) / completedTasks.length
    : 0;

  const timeAccuracy = totalEstimatedTime > 0 
    ? (totalEstimatedTime / Math.max(totalActualTime, 1)) * 100
    : 100;

  return {
    totalEstimatedTime,
    totalActualTime,
    averageCompletionTime,
    timeAccuracy: Math.min(timeAccuracy, 100),
    completedTasks: completedTasks.length,
  };
};