import { TodoList, TaskTemplate, AppSettings, ExportData, ImportResult } from '../types';

export const exportData = (
  lists: TodoList[],
  templates: TaskTemplate[],
  settings: AppSettings
): void => {
  const exportData: ExportData = {
    lists,
    templates,
    settings,
    analytics: {
      productivity: {
        tasksCompleted: 0,
        averageCompletionTime: 0,
        productivityScore: 0,
        focusTime: 0,
        distractionCount: 0,
        peakHours: [],
      },
      timeTracking: {
        totalTimeTracked: 0,
        estimationAccuracy: 0,
        timeByPriority: { low: 0, medium: 0, high: 0 },
        timeByTag: {},
        dailyAverage: 0,
        weeklyTotal: 0,
      },
      completion: {
        completionRate: 0,
        onTimeCompletion: 0,
        overdueRate: 0,
        averageTaskAge: 0,
        completionTrend: 0,
      },
      collaboration: {
        sharedLists: 0,
        collaborators: 0,
        commentsCount: 0,
        assignedTasks: 0,
        teamProductivity: 0,
      },
      trends: [],
    },
    exportedAt: new Date(),
    version: '1.0.0',
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `taskflow-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const importData = async (file: File): Promise<ImportResult> => {
  try {
    const text = await file.text();
    const data: ExportData = JSON.parse(text);
    
    // Validate the data structure
    if (!data.lists || !Array.isArray(data.lists)) {
      throw new Error('Invalid data format: missing or invalid lists');
    }
    
    if (!data.templates || !Array.isArray(data.templates)) {
      throw new Error('Invalid data format: missing or invalid templates');
    }
    
    // Store the imported data
    localStorage.setItem('todo-lists', JSON.stringify(data.lists));
    localStorage.setItem('task-templates', JSON.stringify(data.templates));
    
    if (data.settings) {
      localStorage.setItem('app-settings', JSON.stringify(data.settings));
    }
    
    return {
      success: true,
      listsImported: data.lists.length,
      templatesImported: data.templates.length,
      errors: [],
    };
  } catch (error) {
    return {
      success: false,
      listsImported: 0,
      templatesImported: 0,
      errors: [error instanceof Error ? error.message : 'Unknown error occurred'],
    };
  }
};

export const clearAllData = (): void => {
  const keys = [
    'todo-lists',
    'task-templates',
    'app-settings',
  ];
  
  keys.forEach(key => {
    localStorage.removeItem(key);
  });
};

export const generateCSVReport = (lists: TodoList[]): void => {
  const allTasks = lists.flatMap(list => 
    list.tasks.map(task => ({
      List: list.title,
      Title: task.title,
      Description: task.description || '',
      Priority: task.priority,
      Status: task.completed ? 'Completed' : 'Active',
      'Due Date': task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '',
      'Created At': new Date(task.createdAt).toLocaleDateString(),
      'Updated At': new Date(task.updatedAt).toLocaleDateString(),
      'Estimated Time': task.estimatedTime ? `${task.estimatedTime} min` : '',
      'Actual Time': task.actualTime ? `${task.actualTime} min` : '',
      Tags: task.tags?.join(', ') || '',
      Assignee: task.assignee || '',
    }))
  );
  
  if (allTasks.length === 0) {
    alert('No tasks to export');
    return;
  }
  
  const headers = Object.keys(allTasks[0]);
  const csvContent = [
    headers.join(','),
    ...allTasks.map(task => 
      headers.map(header => {
        const value = task[header as keyof typeof task];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `taskflow-report-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};