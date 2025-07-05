import { Task, SearchFilters } from '../types';

export const filterTasks = (tasks: Task[], filters: SearchFilters): Task[] => {
  return tasks.filter(task => {
    // Text search
    if (filters.query) {
      const query = filters.query.toLowerCase();
      const searchableText = [
        task.title,
        task.description || '',
        ...(task.tags || [])
      ].join(' ').toLowerCase();
      
      if (!searchableText.includes(query)) {
        return false;
      }
    }

    // Priority filter
    if (filters.priority && task.priority !== filters.priority) {
      return false;
    }

    // Completion status filter
    if (filters.completed !== undefined && task.completed !== filters.completed) {
      return false;
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      const taskTags = task.tags || [];
      const hasMatchingTag = filters.tags.some(tag => taskTags.includes(tag));
      if (!hasMatchingTag) {
        return false;
      }
    }

    // Due date filter
    if (filters.dueDate && task.dueDate) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      const taskDate = new Date(task.dueDate);

      switch (filters.dueDate) {
        case 'today':
          if (taskDate.toDateString() !== today.toDateString()) {
            return false;
          }
          break;
        case 'tomorrow':
          if (taskDate.toDateString() !== tomorrow.toDateString()) {
            return false;
          }
          break;
        case 'week':
          if (taskDate > nextWeek) {
            return false;
          }
          break;
        case 'overdue':
          if (taskDate >= today || task.completed) {
            return false;
          }
          break;
      }
    } else if (filters.dueDate === 'overdue') {
      // If no due date but filtering for overdue, exclude this task
      return false;
    }

    // Assignee filter
    if (filters.assignee && task.assignee !== filters.assignee) {
      return false;
    }

    return true;
  });
};

export const getAllTags = (tasks: Task[]): string[] => {
  const tagSet = new Set<string>();
  tasks.forEach(task => {
    if (task.tags) {
      task.tags.forEach(tag => tagSet.add(tag));
    }
  });
  return Array.from(tagSet).sort();
};

export const highlightSearchTerm = (text: string, searchTerm: string): string => {
  if (!searchTerm) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
};