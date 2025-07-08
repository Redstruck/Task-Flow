export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  subtasks?: Subtask[];
  estimatedTime?: number; // in minutes
  actualTime?: number; // in minutes
  assignee?: string;
  attachments?: Attachment[];
  recurring?: RecurringConfig;
  completedAt?: Date;
  comments?: Comment[];
  watchers?: string[];
  dependencies?: TaskDependency[];
  customFields?: CustomField[];
  workflowStage?: string;
  effortScore?: number; // 1-10 scale
  businessValue?: number; // 1-10 scale
  riskLevel?: 'low' | 'medium' | 'high';
  blockers?: string[];
  milestoneId?: string;
  sprintId?: string;
  epicId?: string;
  storyPoints?: number;
}

export interface TaskDependency {
  id: string;
  dependsOn: string; // Task ID
  type: 'blocks' | 'requires' | 'related';
  description?: string;
}

export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'boolean';
  value: any;
  options?: string[]; // For select/multiselect
  required?: boolean;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: Date;
  edited?: boolean;
  mentions?: string[];
  reactions?: Reaction[];
  attachments?: Attachment[];
}

export interface Reaction {
  emoji: string;
  users: string[];
  count: number;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  assignee?: string;
  estimatedTime?: number;
  actualTime?: number;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
  thumbnail?: string;
}

export interface RecurringConfig {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  interval: number;
  endDate?: Date;
  daysOfWeek?: number[]; // 0-6, Sunday = 0
  dayOfMonth?: number;
  customPattern?: string;
}

export interface TodoList {
  id: string;
  title: string;
  description?: string;
  color: string;
  tasks: Task[];
  sortMethod: 'smart' | 'priority' | 'dueDate' | 'manual';
  createdAt: Date;
  archived?: boolean;
  shared?: boolean;
  collaborators?: Collaborator[];
  permissions?: ListPermissions;
  workflow?: WorkflowStage[];
  customFields?: CustomFieldDefinition[];
  templates?: TaskTemplate[];
  milestones?: Milestone[];
  sprints?: Sprint[];
  epics?: Epic[];
  views?: CustomView[];
}

export interface WorkflowStage {
  id: string;
  name: string;
  color: string;
  order: number;
  isCompleted?: boolean;
}

export interface CustomFieldDefinition {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'boolean';
  options?: string[];
  required?: boolean;
  defaultValue?: any;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  completed: boolean;
  progress: number; // 0-100
  tasks: string[]; // Task IDs
  createdAt: Date;
}

export interface Sprint {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  goal?: string;
  tasks: string[]; // Task IDs
  status: 'planning' | 'active' | 'completed';
  velocity?: number;
  burndownData?: BurndownPoint[];
}

export interface BurndownPoint {
  date: Date;
  remainingWork: number;
  idealRemaining: number;
}

export interface Epic {
  id: string;
  title: string;
  description?: string;
  status: 'planning' | 'in_progress' | 'completed';
  tasks: string[]; // Task IDs
  progress: number; // 0-100
  businessValue: number;
  createdAt: Date;
}

export interface CustomView {
  id: string;
  name: string;
  type: 'list' | 'kanban' | 'calendar' | 'timeline' | 'table';
  filters: SearchFilters;
  groupBy?: string;
  sortBy?: string;
  columns?: string[]; // For table view
  isDefault?: boolean;
  isPublic?: boolean;
}

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer' | 'guest';
  joinedAt: Date;
  lastActive?: Date;
  permissions?: UserPermissions;
  workload?: WorkloadMetrics;
  preferences?: UserPreferences;
}

export interface UserPermissions {
  canCreateTasks: boolean;
  canEditTasks: boolean;
  canDeleteTasks: boolean;
  canManageList: boolean;
  canInviteUsers: boolean;
  canViewAnalytics: boolean;
  canExportData: boolean;
  canManageIntegrations: boolean;
}

export interface WorkloadMetrics {
  activeTasks: number;
  completedThisWeek: number;
  averageCompletionTime: number;
  utilizationRate: number; // 0-100
  burnoutRisk: 'low' | 'medium' | 'high';
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: NotificationSettings;
  defaultView: string;
  workingHours: {
    start: string;
    end: string;
    timezone: string;
  };
  focusMode: boolean;
  aiAssistance: boolean;
}

export interface ListPermissions {
  canEdit: boolean;
  canDelete: boolean;
  canInvite: boolean;
  canManagePermissions: boolean;
  canViewAnalytics: boolean;
  canExportData: boolean;
  canManageAutomation: boolean;
  canManageIntegrations: boolean;
}

export interface TaskTemplate {
  id: string;
  name: string;
  title: string;
  description?: string;
  priority: Task['priority'];
  estimatedTime?: number;
  tags?: string[];
  subtasks?: Omit<Subtask, 'id' | 'createdAt'>[];
  createdAt: Date;
  category?: string;
  isPublic?: boolean;
  usageCount?: number;
  customFields?: CustomField[];
  dependencies?: Omit<TaskDependency, 'id'>[];
}

export interface SearchFilters {
  query: string;
  priority?: Task['priority'];
  completed?: boolean;
  tags?: string[];
  dueDate?: 'today' | 'tomorrow' | 'week' | 'overdue';
  assignee?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  customFields?: Record<string, any>;
  workflowStage?: string;
  milestone?: string;
  sprint?: string;
  epic?: string;
  riskLevel?: Task['riskLevel'];
  hasBlockers?: boolean;
  hasAttachments?: boolean;
  hasComments?: boolean;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  notifications: NotificationSettings;
  keyboardShortcuts: boolean;
  autoSave: boolean;
  defaultPriority: Task['priority'];
  workingHours: {
    start: string;
    end: string;
  };
  timezone: string;
  language: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  weekStart: 'monday' | 'sunday';
  productivity: ProductivitySettings;
  ai: AISettings;
  security: SecuritySettings;
  collaboration: CollaborationSettings;
}

export interface AISettings {
  enabled: boolean;
  autoSuggestions: boolean;
  smartPrioritization: boolean;
  timeEstimation: boolean;
  workloadOptimization: boolean;
  burnoutPrevention: boolean;
  insightGeneration: boolean;
  naturalLanguageProcessing: boolean;
  predictiveAnalytics: boolean;
}

export interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number; // minutes
  dataEncryption: boolean;
  auditLogging: boolean;
  ipWhitelist: string[];
  passwordPolicy: PasswordPolicy;
  ssoEnabled: boolean;
  backupEncryption: boolean;
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSymbols: boolean;
  expirationDays: number;
}

export interface CollaborationSettings {
  allowGuestUsers: boolean;
  defaultPermissions: UserPermissions;
  mentionNotifications: boolean;
  realTimeUpdates: boolean;
  conflictResolution: 'last_write_wins' | 'merge' | 'manual';
  maxCollaborators: number;
}

export interface NotificationSettings {
  enabled: boolean;
  email: boolean;
  push: boolean;
  dueDateReminders: boolean;
  dailyDigest: boolean;
  weeklyReport: boolean;
  reminderTime: string;
  mentions: boolean;
  taskAssignments: boolean;
  deadlineAlerts: boolean;
  teamUpdates: boolean;
  aiInsights: boolean;
  workloadWarnings: boolean;
}

export interface ProductivitySettings {
  focusMode: boolean;
  timeBlocking: boolean;
  deepWorkSessions: boolean;
  distractionBlocking: boolean;
  productivityGoals: ProductivityGoals;
}

export interface ProductivityGoals {
  dailyTasks: number;
  weeklyHours: number;
  monthlyProjects: number;
  focusHours: number;
  learningHours: number;
}

export interface AnalyticsData {
  productivity: ProductivityMetrics;
  timeTracking: TimeMetrics;
  completion: CompletionMetrics;
  collaboration: CollaborationMetrics;
  trends: TrendData[];
  ai: AIMetrics;
  performance: PerformanceMetrics;
  quality: QualityMetrics;
}

export interface AIMetrics {
  suggestionsGenerated: number;
  suggestionsAccepted: number;
  accuracyRate: number;
  timesSaved: number; // minutes
  insightsProvided: number;
  automationTriggered: number;
}

export interface PerformanceMetrics {
  averageTaskCycleTime: number;
  throughput: number; // tasks per week
  leadTime: number;
  blockerResolutionTime: number;
  reworkRate: number;
  velocityTrend: number[];
}

export interface QualityMetrics {
  defectRate: number;
  customerSatisfaction: number;
  codeReviewCoverage: number;
  testCoverage: number;
  documentationCompleteness: number;
}

export interface ProductivityMetrics {
  tasksCompleted: number;
  averageCompletionTime: number;
  productivityScore: number;
  focusTime: number;
  distractionCount: number;
  peakHours: string[];
  burnoutRisk: 'low' | 'medium' | 'high';
  workloadBalance: number;
  goalAchievement: number;
  efficiencyTrend: number[];
}

export interface TimeMetrics {
  totalTimeTracked: number;
  estimationAccuracy: number;
  timeByPriority: Record<Task['priority'], number>;
  timeByTag: Record<string, number>;
  dailyAverage: number;
  weeklyTotal: number;
  overtimeHours: number;
  focusTimeRatio: number;
  meetingTime: number;
  deepWorkTime: number;
}

export interface CompletionMetrics {
  completionRate: number;
  onTimeCompletion: number;
  overdueRate: number;
  averageTaskAge: number;
  completionTrend: number;
  qualityScore: number;
  reworkRate: number;
  firstTimeRight: number;
}

export interface CollaborationMetrics {
  sharedLists: number;
  collaborators: number;
  commentsCount: number;
  assignedTasks: number;
  teamProductivity: number;
  communicationFrequency: number;
  knowledgeSharing: number;
  conflictResolution: number;
}

export interface TrendData {
  date: string;
  completed: number;
  created: number;
  timeSpent: number;
  productivity: number;
  quality: number;
  collaboration: number;
  aiAssistance: number;
}

export interface ExportData {
  lists: TodoList[];
  templates: TaskTemplate[];
  settings: AppSettings;
  analytics: AnalyticsData;
  exportedAt: Date;
  version: string;
  customFields: CustomFieldDefinition[];
  workflows: WorkflowStage[];
}

export interface ImportResult {
  success: boolean;
  listsImported: number;
  templatesImported: number;
  errors: string[];
  warnings: string[];
  migrationRequired: boolean;
}

export interface RealTimeEvent {
  id: string;
  type: 'task_created' | 'task_updated' | 'task_deleted' | 'comment_added' | 'user_joined' | 'user_left';
  data: any;
  userId: string;
  timestamp: Date;
  listId?: string;
  taskId?: string;
}

export interface WebhookEvent {
  id: string;
  event: string;
  data: any;
  timestamp: Date;
  signature: string;
  retryCount: number;
  delivered: boolean;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface AuditLog {
  id: string;
  action: string;
  userId: string;
  resourceType: string;
  resourceId: string;
  changes: Record<string, { old: any; new: any }>;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
}


export interface DragEndEvent {
  active: {
    id: string;
    data: {
      current?: {
        type: 'task' | 'list';
        task?: Task;
        list?: TodoList;
        listId?: string;
      };
    };
  };
  over: {
    id: string;
    data: {
      current?: {
        type: 'task' | 'list';
        accepts?: string[];
        listId?: string;
      };
    };
  } | null;
}