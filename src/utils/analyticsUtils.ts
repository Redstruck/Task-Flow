import { TodoList, Task, AnalyticsData, TrendData } from '../types';

export const getAnalyticsData = (lists: TodoList[], timeRange: 'week' | 'month' | 'quarter' | 'year'): AnalyticsData => {
  const allTasks = lists.flatMap(list => list.tasks || []);
  const now = new Date();
  const startDate = getStartDate(now, timeRange);
  
  const filteredTasks = allTasks.filter(task => 
    task.createdAt && new Date(task.createdAt) >= startDate
  );

  const completedTasks = filteredTasks.filter(task => task.completed);
  const overdueTasks = filteredTasks.filter(task => 
    task.dueDate && new Date(task.dueDate) < now && !task.completed
  );

  // Productivity Metrics
  const productivity = {
    tasksCompleted: completedTasks.length,
    averageCompletionTime: calculateAverageCompletionTime(completedTasks),
    productivityScore: calculateProductivityScore(filteredTasks),
    focusTime: calculateFocusTime(completedTasks),
    distractionCount: 0, // Would be tracked with actual usage
    peakHours: calculatePeakHours(completedTasks),
    burnoutRisk: 'low' as const,
    workloadBalance: 80,
    goalAchievement: 75,
    efficiencyTrend: [70, 75, 80, 85, 82, 88, 90],
  };

  // Time Tracking Metrics
  const timeTracking = {
    totalTimeTracked: filteredTasks.reduce((sum, task) => sum + (task.actualTime || 0), 0),
    estimationAccuracy: calculateEstimationAccuracy(filteredTasks),
    timeByPriority: calculateTimeByPriority(filteredTasks),
    timeByTag: calculateTimeByTag(filteredTasks),
    dailyAverage: calculateDailyAverage(filteredTasks, timeRange),
    weeklyTotal: calculateWeeklyTotal(filteredTasks),
    overtimeHours: 0,
    focusTimeRatio: 0.7,
    meetingTime: 0,
    deepWorkTime: 0,
  };

  // Completion Metrics
  const completion = {
    completionRate: Math.round((completedTasks.length / Math.max(filteredTasks.length, 1)) * 100),
    onTimeCompletion: calculateOnTimeCompletion(completedTasks),
    overdueRate: Math.round((overdueTasks.length / Math.max(filteredTasks.length, 1)) * 100),
    averageTaskAge: calculateAverageTaskAge(filteredTasks),
    completionTrend: calculateCompletionTrend(allTasks, timeRange),
    qualityScore: 85,
    reworkRate: 5,
    firstTimeRight: 90,
  };

  // Collaboration Metrics
  const collaboration = {
    sharedLists: lists.filter(list => list.shared).length,
    collaborators: lists.reduce((sum, list) => sum + (list.collaborators?.length || 0), 0),
    commentsCount: allTasks.reduce((sum, task) => sum + (task.comments?.length || 0), 0),
    assignedTasks: allTasks.filter(task => task.assignee).length,
    teamProductivity: calculateTeamProductivity(lists),
    communicationFrequency: 0,
    knowledgeSharing: 0,
    conflictResolution: 0,
  };

  const trends = generateTrendData(allTasks, timeRange);

  return {
    productivity,
    timeTracking,
    completion,
    collaboration,
    trends,
    ai: {
      suggestionsGenerated: 0,
      suggestionsAccepted: 0,
      accuracyRate: 0,
      timesSaved: 0,
      insightsProvided: 0,
      automationTriggered: 0,
    },
    performance: {
      averageTaskCycleTime: 0,
      throughput: 0,
      leadTime: 0,
      blockerResolutionTime: 0,
      reworkRate: 0,
      velocityTrend: [],
    },
    quality: {
      defectRate: 0,
      customerSatisfaction: 0,
      codeReviewCoverage: 0,
      testCoverage: 0,
      documentationCompleteness: 0,
    },
  };
};

export const getProductivityTrends = (lists: TodoList[], timeRange: 'week' | 'month' | 'quarter' | 'year'): TrendData[] => {
  const allTasks = lists.flatMap(list => list.tasks || []);
  return generateTrendData(allTasks, timeRange);
};

const getStartDate = (now: Date, timeRange: 'week' | 'month' | 'quarter' | 'year'): Date => {
  const start = new Date(now);
  
  switch (timeRange) {
    case 'week':
      start.setDate(now.getDate() - 7);
      break;
    case 'month':
      start.setMonth(now.getMonth() - 1);
      break;
    case 'quarter':
      start.setMonth(now.getMonth() - 3);
      break;
    case 'year':
      start.setFullYear(now.getFullYear() - 1);
      break;
  }
  
  return start;
};

const calculateAverageCompletionTime = (tasks: Task[]): number => {
  const tasksWithTime = tasks.filter(task => task.actualTime && task.actualTime > 0);
  if (tasksWithTime.length === 0) return 0;
  
  const totalTime = tasksWithTime.reduce((sum, task) => sum + (task.actualTime || 0), 0);
  return Math.round(totalTime / tasksWithTime.length);
};

const calculateProductivityScore = (tasks: Task[]): number => {
  if (tasks.length === 0) return 0;
  
  const completed = tasks.filter(task => task.completed).length;
  const onTime = tasks.filter(task => 
    task.completed && task.dueDate && task.completedAt &&
    new Date(task.completedAt) <= new Date(task.dueDate)
  ).length;
  
  const completionRate = (completed / tasks.length) * 100;
  const onTimeRate = tasks.length > 0 ? (onTime / tasks.length) * 100 : 0;
  
  return Math.round((completionRate + onTimeRate) / 2);
};

const calculateFocusTime = (tasks: Task[]): number => {
  const totalMinutes = tasks.reduce((sum, task) => sum + (task.actualTime || 0), 0);
  return Math.round((totalMinutes / 60) * 10) / 10; // Convert to hours with 1 decimal
};

const calculatePeakHours = (tasks: Task[]): string[] => {
  const hourCounts: Record<number, number> = {};
  
  tasks.forEach(task => {
    if (task.completedAt) {
      const hour = new Date(task.completedAt).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    }
  });
  
  if (Object.keys(hourCounts).length === 0) {
    return ['9 AM', '10 AM', '11 AM']; // Default peak hours
  }
  
  const sortedHours = Object.entries(hourCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([hour]) => {
      const h = parseInt(hour);
      return h === 0 ? '12 AM' : h <= 12 ? `${h} AM` : `${h - 12} PM`;
    });
  
  return sortedHours.length > 0 ? sortedHours : ['9 AM', '10 AM', '11 AM'];
};

const calculateEstimationAccuracy = (tasks: Task[]): number => {
  const tasksWithEstimates = tasks.filter(task => 
    task.estimatedTime && task.estimatedTime > 0 && 
    task.actualTime && task.actualTime > 0
  );
  
  if (tasksWithEstimates.length === 0) return 100;
  
  const accuracies = tasksWithEstimates.map(task => {
    const estimated = task.estimatedTime!;
    const actual = task.actualTime!;
    const accuracy = Math.min((estimated / Math.max(actual, 1)) * 100, 100);
    return Math.max(0, 200 - Math.abs(100 - accuracy)); // Penalize both over and under estimation
  });
  
  return Math.round(accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length);
};

const calculateTimeByPriority = (tasks: Task[]): Record<Task['priority'], number> => {
  const timeByPriority: Record<Task['priority'], number> = {
    low: 0,
    medium: 0,
    high: 0,
  };
  
  tasks.forEach(task => {
    if (task.actualTime && task.actualTime > 0) {
      timeByPriority[task.priority] += task.actualTime / 60; // Convert to hours
    }
  });
  
  return timeByPriority;
};

const calculateTimeByTag = (tasks: Task[]): Record<string, number> => {
  const timeByTag: Record<string, number> = {};
  
  tasks.forEach(task => {
    if (task.actualTime && task.actualTime > 0 && task.tags && task.tags.length > 0) {
      task.tags.forEach(tag => {
        timeByTag[tag] = (timeByTag[tag] || 0) + (task.actualTime! / 60);
      });
    }
  });
  
  return timeByTag;
};

const calculateDailyAverage = (tasks: Task[], timeRange: 'week' | 'month' | 'quarter' | 'year'): number => {
  const totalTime = tasks.reduce((sum, task) => sum + (task.actualTime || 0), 0);
  const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : timeRange === 'quarter' ? 90 : 365;
  return Math.round((totalTime / 60) / days * 10) / 10; // Hours per day
};

const calculateWeeklyTotal = (tasks: Task[]): number => {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  
  const weekTasks = tasks.filter(task => 
    task.createdAt && new Date(task.createdAt) >= weekStart
  );
  
  return Math.round(weekTasks.reduce((sum, task) => sum + (task.actualTime || 0), 0) / 60 * 10) / 10; // Convert to hours
};

const calculateOnTimeCompletion = (tasks: Task[]): number => {
  const tasksWithDueDate = tasks.filter(task => task.dueDate && task.completedAt);
  if (tasksWithDueDate.length === 0) return 100;
  
  const onTime = tasksWithDueDate.filter(task => 
    new Date(task.completedAt!) <= new Date(task.dueDate!)
  ).length;
  
  return Math.round((onTime / tasksWithDueDate.length) * 100);
};

const calculateAverageTaskAge = (tasks: Task[]): number => {
  if (tasks.length === 0) return 0;
  
  const now = new Date();
  const ages = tasks.map(task => {
    if (!task.createdAt) return 0;
    const created = new Date(task.createdAt);
    const completed = task.completedAt ? new Date(task.completedAt) : now;
    return Math.floor((completed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  });
  
  return Math.round(ages.reduce((sum, age) => sum + age, 0) / ages.length);
};

const calculateCompletionTrend = (tasks: Task[], timeRange: 'week' | 'month' | 'quarter' | 'year'): number => {
  const now = new Date();
  const midPoint = getStartDate(now, timeRange);
  const startDate = getStartDate(midPoint, timeRange);
  
  const firstHalf = tasks.filter(task => {
    if (!task.createdAt) return false;
    const created = new Date(task.createdAt);
    return created >= startDate && created < midPoint && task.completed;
  }).length;
  
  const secondHalf = tasks.filter(task => {
    if (!task.createdAt) return false;
    const created = new Date(task.createdAt);
    return created >= midPoint && created <= now && task.completed;
  }).length;
  
  if (firstHalf === 0) return secondHalf > 0 ? 100 : 0;
  return Math.round(((secondHalf - firstHalf) / firstHalf) * 100);
};

const calculateTeamProductivity = (lists: TodoList[]): number => {
  const sharedLists = lists.filter(list => list.shared || (list.collaborators && list.collaborators.length > 0));
  if (sharedLists.length === 0) return 0;
  
  const totalTasks = sharedLists.reduce((sum, list) => sum + (list.tasks?.length || 0), 0);
  const completedTasks = sharedLists.reduce((sum, list) => 
    sum + (list.tasks?.filter(task => task.completed).length || 0), 0
  );
  
  return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
};

const generateTrendData = (tasks: Task[], timeRange: 'week' | 'month' | 'quarter' | 'year'): TrendData[] => {
  const now = new Date();
  const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : timeRange === 'quarter' ? 90 : 365;
  const trends: TrendData[] = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayTasks = tasks.filter(task => {
      if (!task.createdAt) return false;
      const taskDate = new Date(task.createdAt).toISOString().split('T')[0];
      return taskDate === dateStr;
    });
    
    const completed = dayTasks.filter(task => task.completed).length;
    const created = dayTasks.length;
    const timeSpent = Math.round(dayTasks.reduce((sum, task) => sum + (task.actualTime || 0), 0) / 60 * 10) / 10;
    const productivity = created > 0 ? Math.round((completed / created) * 100) : 0;
    
    trends.push({
      date: dateStr,
      completed,
      created,
      timeSpent,
      productivity,
      quality: Math.max(70, productivity - Math.random() * 20),
      collaboration: Math.max(60, 80 + Math.random() * 20),
      aiAssistance: Math.max(50, 70 + Math.random() * 30),
    });
  }
  
  return trends;
};