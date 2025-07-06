import React, { useState, useMemo, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverEvent,
  closestCenter,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, Users as UsersIcon, Calendar } from 'lucide-react';

import Header from './components/Header';
import DraggableList from './components/DraggableList';
import ListCreator from './components/ListCreator';
import TaskStats from './components/TaskStats';
import TaskItem from './components/TaskItem';
import TaskTemplates from './components/TaskTemplates';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import BulkActions from './components/BulkActions';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import Collaboration from './components/Collaboration';
import RealTimeCollaboration from './components/RealTimeCollaboration';
import CalendarView from './components/CalendarView';
import DragPreview from './components/DragPreview';
import { MobileNavigation, useMobileOptimization } from './components/MobileOptimization';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { TodoList, Task, TaskTemplate, SearchFilters, AppSettings, Collaborator } from './types';
import { createTask, createDefaultList, createList, createTemplate, createTaskFromTemplate, duplicateTask } from './utils/taskUtils';
import { filterTasks, getAllTags } from './utils/searchUtils';
import { exportData, importData, clearAllData, generateCSVReport } from './utils/exportUtils';

const defaultSettings: AppSettings = {
  theme: 'light',
  notifications: {
    enabled: true,
    email: false,
    push: true,
    dueDateReminders: true,
    dailyDigest: false,
    weeklyReport: false,
    reminderTime: '09:00',
    mentions: true,
    taskAssignments: true,
    deadlineAlerts: true,
    teamUpdates: true,
    aiInsights: true,
    workloadWarnings: true,
  },
  keyboardShortcuts: true,
  autoSave: true,
  defaultPriority: 'medium',
  workingHours: {
    start: '09:00',
    end: '17:00',
  },
  timezone: 'UTC',
  language: 'en',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  weekStart: 'monday',
  productivity: {
    focusMode: false,
    timeBlocking: false,
    deepWorkSessions: false,
    distractionBlocking: false,
    productivityGoals: {
      dailyTasks: 5,
      weeklyHours: 40,
      monthlyProjects: 3,
      focusHours: 4,
      learningHours: 2,
    },
  },
  ai: {
    enabled: true,
    autoSuggestions: true,
    smartPrioritization: true,
    timeEstimation: true,
    workloadOptimization: true,
    burnoutPrevention: true,
    insightGeneration: true,
    naturalLanguageProcessing: true,
    predictiveAnalytics: true,
  },
  security: {
    twoFactorAuth: false,
    sessionTimeout: 480,
    dataEncryption: true,
    auditLogging: true,
    ipWhitelist: [],
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSymbols: false,
      expirationDays: 90,
    },
    ssoEnabled: false,
    backupEncryption: true,
  },
  collaboration: {
    allowGuestUsers: true,
    defaultPermissions: {
      canCreateTasks: true,
      canEditTasks: true,
      canDeleteTasks: false,
      canManageList: false,
      canInviteUsers: false,
      canViewAnalytics: true,
      canExportData: false,
      canManageIntegrations: false,
    },
    mentionNotifications: true,
    realTimeUpdates: true,
    conflictResolution: 'last_write_wins',
    maxCollaborators: 50,
  },
};

function App() {
  const [lists, setLists] = useLocalStorage<TodoList[]>('todo-lists', [createDefaultList()]);
  const [templates, setTemplates] = useLocalStorage<TaskTemplate[]>('task-templates', []);
  const [settings, setSettings] = useLocalStorage<AppSettings>('app-settings', defaultSettings);
  const [showListCreator, setShowListCreator] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCollaboration, setShowCollaboration] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeList, setActiveList] = useState<TodoList | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    priority: undefined,
    completed: undefined,
    tags: [],
    dueDate: undefined,
    assignee: undefined,
  });

  // Drag state for DragPreview
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    activeTask: Task | null;
    overId: string | null;
  }>({
    isDragging: false,
    activeTask: null,
    overId: null,
  });

  const { isMobile } = useMobileOptimization();

  // Apply theme settings to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply theme
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else { // auto
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }

    // Apply focus mode
    if (settings.productivity.focusMode) {
      root.classList.add('focus-mode');
    } else {
      root.classList.remove('focus-mode');
    }

    // Apply time format to document for global access
    root.setAttribute('data-time-format', settings.timeFormat);
    root.setAttribute('data-date-format', settings.dateFormat);
    root.setAttribute('data-week-start', settings.weekStart);
  }, [settings.theme, settings.productivity.focusMode, settings.timeFormat, settings.dateFormat, settings.weekStart]);

  // Auto-save functionality
  useEffect(() => {
    if (settings.autoSave) {
      const autoSaveInterval = setInterval(() => {
        // Auto-save is handled by useLocalStorage hook automatically
        console.log('Auto-save triggered');
      }, 30000); // Auto-save every 30 seconds

      return () => clearInterval(autoSaveInterval);
    }
  }, [settings.autoSave]);

  // Notification permissions
  useEffect(() => {
    if (settings.notifications.enabled && settings.notifications.push) {
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, [settings.notifications.enabled, settings.notifications.push]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Get all tasks and tags for search
  const allTasks = useMemo(() => lists.flatMap(list => list.tasks), [lists]);
  const allTags = useMemo(() => getAllTags(allTasks), [allTasks]);

  // Filter lists based on search and active list
  const filteredLists = useMemo(() => {
    let listsToShow = lists;
    
    // Filter by active list if mobile
    if (isMobile && activeListId) {
      listsToShow = lists.filter(list => list.id === activeListId);
    }
    
    // Apply search filters
    if (!searchFilters.query && !searchFilters.priority && searchFilters.completed === undefined && 
        (!searchFilters.tags || searchFilters.tags.length === 0) && !searchFilters.dueDate) {
      return listsToShow;
    }

    return listsToShow.map(list => ({
      ...list,
      tasks: filterTasks(list.tasks, searchFilters)
    })).filter(list => list.tasks.length > 0 || !searchFilters.query);
  }, [lists, searchFilters, isMobile, activeListId]);

  // Keyboard shortcuts - only enable if setting is on
  useKeyboardShortcuts({
    onSearch: () => {
      if (!settings.keyboardShortcuts) return;
      const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
      searchInput?.focus();
    },
    onNewTask: () => {
      if (!settings.keyboardShortcuts) return;
      const addTaskInput = document.querySelector('input[placeholder*="Add a new task"]') as HTMLInputElement;
      addTaskInput?.focus();
    },
    onNewList: () => {
      if (!settings.keyboardShortcuts) return;
      setShowListCreator(true);
    },
    onShowShortcuts: () => setShowShortcuts(true),
    onSelectAll: () => {
      const allTaskIds = allTasks.map(task => task.id);
      setSelectedTasks(allTaskIds);
    },
    onMarkAllComplete: () => handleBulkComplete(),
    onEscape: () => {
      setShowListCreator(false);
      setShowTemplates(false);
      setShowShortcuts(false);
      setShowAnalytics(false);
      setShowSettings(false);
      setShowCollaboration(null);
      setShowCalendar(false);
      setSelectedTasks([]);
    },
  });

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    
    if (active.data.current?.type === 'task') {
      const task = active.data.current.task;
      setActiveTask(task);
      setDragState({
        isDragging: true,
        activeTask: task,
        overId: null,
      });
    } else if (active.data.current?.type === 'list') {
      const list = active.data.current.list;
      setActiveList(list);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    setDragState(prev => ({
      ...prev,
      overId: event.over?.id as string || null,
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    // Reset drag state
    setActiveTask(null);
    setActiveList(null);
    setDragState({
      isDragging: false,
      activeTask: null,
      overId: null,
    });

    if (!over || !active.data.current) {
      return;
    }

    const activeData = active.data.current;
    const overData = over.data.current;

    // Handle list reordering
    if (activeData.type === 'list' && active.id !== over.id) {
      const oldIndex = lists.findIndex(list => list.id === active.id);
      const newIndex = lists.findIndex(list => list.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedLists = arrayMove(lists, oldIndex, newIndex);
        setLists(reorderedLists);
      }
      return;
    }

    // Handle task operations
    if (activeData.type !== 'task') {
      return;
    }

    const sourceListId = activeData.listId;
    const taskId = active.id as string;

    // NEW APPROACH: Check if we're dropping on a list (either directly or on its container)
    let targetListId: string | null = null;

    // First, check if we're dropping directly on a list
    if (overData?.type === 'list') {
      targetListId = overData.listId || over.id as string;
    } 
    // If not, check if the over.id is a list ID
    else if (lists.some(list => list.id === over.id)) {
      targetListId = over.id as string;
    }
    // Finally, check if we're dropping on a task and get its list
    else if (overData?.type === 'task') {
      targetListId = overData.listId;
    }

    // If we found a target list and it's different from source, move the task
    if (targetListId && sourceListId !== targetListId) {
      setLists(prevLists => {
        const newLists = [...prevLists];
        const sourceList = newLists.find(list => list.id === sourceListId);
        const targetList = newLists.find(list => list.id === targetListId);
        
        if (sourceList && targetList) {
          const taskIndex = sourceList.tasks.findIndex(task => task.id === taskId);
          if (taskIndex !== -1) {
            const [task] = sourceList.tasks.splice(taskIndex, 1);
            
            // If dropping on a task, insert at that position
            if (overData?.type === 'task') {
              const targetIndex = targetList.tasks.findIndex(task => task.id === over.id);
              if (targetIndex !== -1) {
                targetList.tasks.splice(targetIndex, 0, { ...task, updatedAt: new Date() });
              } else {
                targetList.tasks.push({ ...task, updatedAt: new Date() });
              }
            } else {
              // Otherwise, add to the end
              targetList.tasks.push({ ...task, updatedAt: new Date() });
            }
          }
        }
        
        return newLists;
      });
      return;
    }

    // Handle same-list reordering (task dropped on another task in same list)
    if (overData?.type === 'task' && active.id !== over.id && sourceListId === overData.listId) {
      setLists(prevLists => {
        const newLists = [...prevLists];
        const sourceList = newLists.find(list => list.id === sourceListId);
        
        if (sourceList) {
          const oldIndex = sourceList.tasks.findIndex(task => task.id === active.id);
          const newIndex = sourceList.tasks.findIndex(task => task.id === over.id);
          
          if (oldIndex !== -1 && newIndex !== -1) {
            sourceList.tasks = arrayMove(sourceList.tasks, oldIndex, newIndex);
          }
        }
        
        return newLists;
      });
    }
  };

  const handleDragCancel = () => {
    setActiveTask(null);
    setActiveList(null);
    setDragState({
      isDragging: false,
      activeTask: null,
      overId: null,
    });
  };

  const handleAddTask = (listId: string, title: string, priority: Task['priority'], dueDate?: Date) => {
    // Create task with the exact priority passed from AddTaskInput
    const newTask = createTask(title, priority, dueDate);
    
    setLists(prevLists =>
      prevLists.map(list =>
        list.id === listId
          ? { ...list, tasks: [...list.tasks, newTask] }
          : list
      )
    );

    // Show notification if enabled
    if (settings.notifications.enabled && settings.notifications.push && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('Task Created', {
        body: `"${title}" has been added to your list`,
        icon: '/favicon.ico'
      });
    }
  };

  const handleToggleTask = (listId: string, taskId: string) => {
    setLists(prevLists =>
      prevLists.map(list =>
        list.id === listId
          ? {
              ...list,
              tasks: list.tasks.map(task =>
                task.id === taskId ? { 
                  ...task, 
                  completed: !task.completed, 
                  completedAt: !task.completed ? new Date() : undefined,
                  updatedAt: new Date() 
                } : task
              ),
            }
          : list
      )
    );

    // Show completion notification if enabled
    const task = lists.find(list => list.id === listId)?.tasks.find(task => task.id === taskId);
    if (task && !task.completed && settings.notifications.enabled && settings.notifications.push && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('Task Completed! 🎉', {
        body: `"${task.title}" has been completed`,
        icon: '/favicon.ico'
      });
    }
  };

  const handleDeleteTask = (listId: string, taskId: string) => {
    setLists(prevLists =>
      prevLists.map(list =>
        list.id === listId
          ? { ...list, tasks: list.tasks.filter(task => task.id !== taskId) }
          : list
      )
    );
    setSelectedTasks(prev => prev.filter(id => id !== taskId));
  };

  const handleUpdateTask = (listId: string, taskId: string, updates: Partial<Task>) => {
    setLists(prevLists =>
      prevLists.map(list =>
        list.id === listId
          ? {
              ...list,
              tasks: list.tasks.map(task =>
                task.id === taskId ? { ...task, ...updates, updatedAt: new Date() } : task
              ),
            }
          : list
      )
    );
  };

  const handleDuplicateTask = (listId: string, taskId: string) => {
    setLists(prevLists =>
      prevLists.map(list =>
        list.id === listId
          ? {
              ...list,
              tasks: list.tasks.flatMap(task =>
                task.id === taskId ? [task, duplicateTask(task)] : [task]
              ),
            }
          : list
      )
    );
  };

  const handleUpdateList = (listId: string, updates: Partial<TodoList>) => {
    setLists(prevLists =>
      prevLists.map(list =>
        list.id === listId ? { ...list, ...updates } : list
      )
    );
  };

  const handleCreateList = (title: string, color: string, description?: string) => {
    const newList = createList(title, color, description);
    setLists(prevLists => [...prevLists, newList]);
    setShowListCreator(false);
  };

  const handleDeleteList = (listId: string) => {
    if (lists.length > 1) {
      setLists(prevLists => prevLists.filter(list => list.id !== listId));
    }
  };

  // Template management
  const handleCreateTemplate = (templateData: Omit<TaskTemplate, 'id' | 'createdAt'>) => {
    const newTemplate = createTemplate(templateData.name, templateData.title, templateData.priority);
    setTemplates(prev => [...prev, { ...newTemplate, ...templateData }]);
  };

  const handleUseTemplate = (template: TaskTemplate) => {
    const newTask = createTaskFromTemplate(template);
    if (lists.length > 0) {
      handleAddTask(lists[0].id, newTask.title, newTask.priority, newTask.dueDate);
    }
    setShowTemplates(false);
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(template => template.id !== templateId));
  };

  // Bulk actions
  const handleTaskSelect = (taskId: string, selected: boolean) => {
    setSelectedTasks(prev => 
      selected 
        ? [...prev, taskId]
        : prev.filter(id => id !== taskId)
    );
  };

  const handleBulkComplete = () => {
    setLists(prevLists =>
      prevLists.map(list => ({
        ...list,
        tasks: list.tasks.map(task =>
          selectedTasks.includes(task.id)
            ? { ...task, completed: true, completedAt: new Date(), updatedAt: new Date() }
            : task
        ),
      }))
    );
    setSelectedTasks([]);
  };

  const handleBulkDelete = () => {
    setLists(prevLists =>
      prevLists.map(list => ({
        ...list,
        tasks: list.tasks.filter(task => !selectedTasks.includes(task.id)),
      }))
    );
    setSelectedTasks([]);
  };

  const handleBulkArchive = () => {
    setSelectedTasks([]);
  };

  const handleBulkTag = () => {
    setSelectedTasks([]);
  };

  const handleBulkAssign = () => {
    setSelectedTasks([]);
  };

  const handleBulkSetDueDate = () => {
    setSelectedTasks([]);
  };

  // Collaboration
  const handleInviteCollaborator = (listId: string, email: string, role: Collaborator['role']) => {
    const newCollaborator: Collaborator = {
      id: Date.now().toString(),
      name: email.split('@')[0],
      email,
      role,
      joinedAt: new Date(),
    };

    setLists(prevLists =>
      prevLists.map(list =>
        list.id === listId
          ? {
              ...list,
              collaborators: [...(list.collaborators || []), newCollaborator],
            }
          : list
      )
    );
  };

  const handleRemoveCollaborator = (listId: string, collaboratorId: string) => {
    setLists(prevLists =>
      prevLists.map(list =>
        list.id === listId
          ? {
              ...list,
              collaborators: list.collaborators?.filter(c => c.id !== collaboratorId) || [],
            }
          : list
      )
    );
  };

  const handleUpdateCollaboratorRole = (listId: string, collaboratorId: string, role: Collaborator['role']) => {
    setLists(prevLists =>
      prevLists.map(list =>
        list.id === listId
          ? {
              ...list,
              collaborators: list.collaborators?.map(c =>
                c.id === collaboratorId ? { ...c, role } : c
              ) || [],
            }
          : list
      )
    );
  };

  // Settings management with proper persistence
  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    
    // Show notification if enabled
    if (newSettings.notifications.enabled && newSettings.notifications.push && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('Settings Updated', {
        body: 'Your preferences have been saved successfully',
        icon: '/favicon.ico'
      });
    }
  };

  // Data management
  const handleExportData = () => {
    exportData(lists, templates, settings);
  };

  const handleImportData = async (file: File) => {
    const result = await importData(file);
    if (result.success) {
      window.location.reload(); // Reload to apply imported data
    } else {
      alert(`Import failed: ${result.errors.join(', ')}`);
    }
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      clearAllData();
      window.location.reload();
    }
  };

  // Get sample collaborators for real-time collaboration
  const sampleCollaborators: Collaborator[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'editor',
      joinedAt: new Date(),
      lastActive: new Date(),
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'viewer',
      joinedAt: new Date(),
      lastActive: new Date(Date.now() - 120000), // 2 minutes ago
    },
  ];

  // Apply theme class to body
  const themeClass = settings.theme === 'dark' ? 'dark' : 
                    settings.theme === 'auto' ? 
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : 
                    'light';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      themeClass === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    } ${settings.productivity.focusMode ? 'focus-mode' : ''}`}>
      {/* Mobile Navigation */}
      <MobileNavigation
        lists={lists}
        activeListId={activeListId}
        onSelectList={setActiveListId}
        onShowSearch={() => {
          const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
          searchInput?.focus();
        }}
        onShowAddTask={() => {
          const addTaskInput = document.querySelector('input[placeholder*="Add a new task"]') as HTMLInputElement;
          addTaskInput?.focus();
        }}
        searchFilters={searchFilters}
        onSearchFiltersChange={setSearchFilters}
      />

      {/* Desktop Header */}
      {!isMobile && (
        <Header 
          searchFilters={searchFilters}
          onSearchFiltersChange={setSearchFilters}
          allTags={allTags}
          onShowTemplates={() => setShowTemplates(true)}
          onShowShortcuts={() => setShowShortcuts(true)}
          onShowAnalytics={() => setShowAnalytics(true)}
          onShowCalendar={() => setShowCalendar(true)}
          onShowSettings={() => setShowSettings(true)}
        />
      )}
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {!isMobile && <TaskStats lists={lists} />}
        
        <DragPreview dragState={dragState}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <SortableContext 
              items={filteredLists.map(list => list.id)} 
              strategy={horizontalListSortingStrategy}
            >
              <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'space-x-6 overflow-x-auto items-start'} pb-4`}>
                {filteredLists.map((list, index) => (
                  <DraggableList
                    key={list.id}
                    list={list}
                    index={index}
                    totalLists={lists.length}
                    onAddTask={handleAddTask}
                    onToggleTask={handleToggleTask}
                    onDeleteTask={handleDeleteTask}
                    onUpdateTask={handleUpdateTask}
                    onUpdateList={handleUpdateList}
                    onDeleteList={handleDeleteList}
                    onDuplicateTask={handleDuplicateTask}
                    onSelectTask={handleTaskSelect}
                    selectedTasks={selectedTasks}
                    onShowCollaboration={() => setShowCollaboration(list.id)}
                    defaultPriority={settings.defaultPriority}
                  />
                ))}
                
                {!isMobile && (showListCreator ? (
                  <div className="animate-in scale-in">
                    <ListCreator
                      onCreateList={handleCreateList}
                      onCancel={() => setShowListCreator(false)}
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => setShowListCreator(true)}
                    className={`flex-shrink-0 w-80 h-32 rounded-2xl border-2 border-dashed transition-all duration-200 flex items-center justify-center group hover-lift btn-animate ${
                      themeClass === 'dark'
                        ? 'bg-gray-800/50 backdrop-blur-sm border-gray-600 hover:border-blue-400 hover:bg-blue-900/30'
                        : 'bg-white/50 backdrop-blur-sm border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-200">
                        <Plus className="w-6 h-6 text-white" />
                      </div>
                      <p className={`text-sm font-medium transition-colors ${
                        themeClass === 'dark' 
                          ? 'text-gray-300 group-hover:text-blue-400' 
                          : 'text-gray-600 group-hover:text-blue-600'
                      }`}>
                        Add New List
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeTask ? (
                <div className="rotate-3 scale-105 animate-in bounce-in shadow-2xl">
                  <TaskItem
                    task={activeTask}
                    onToggleComplete={() => {}}
                    onDelete={() => {}}
                    onUpdate={() => {}}
                  />
                </div>
              ) : activeList ? (
                <div className="rotate-2 scale-105 opacity-90 shadow-2xl">
                  <div className={`w-80 h-32 rounded-2xl border p-6 flex items-center justify-center ${
                    themeClass === 'dark'
                      ? 'bg-gray-800/90 backdrop-blur-sm border-gray-600'
                      : 'bg-white/90 backdrop-blur-sm border-gray-200'
                  }`}>
                    <div className="text-center">
                      <h3 className={`text-lg font-semibold mb-1 ${
                        themeClass === 'dark' ? 'text-gray-100' : 'text-gray-900'
                      }`}>{activeList.title}</h3>
                      <p className={`text-sm ${
                        themeClass === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>{activeList.tasks.length} tasks</p>
                    </div>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </DragPreview>

        {/* Bulk Actions */}
        <BulkActions
          selectedTasks={selectedTasks}
          onBulkComplete={handleBulkComplete}
          onBulkDelete={handleBulkDelete}
          onBulkArchive={handleBulkArchive}
          onBulkTag={handleBulkTag}
          onBulkAssign={handleBulkAssign}
          onBulkSetDueDate={handleBulkSetDueDate}
          onClearSelection={() => setSelectedTasks([])}
        />

        {/* Real-time Collaboration */}
        {!isMobile && sampleCollaborators.length > 0 && settings.collaboration.realTimeUpdates && (
          <RealTimeCollaboration
            collaborators={sampleCollaborators}
            currentUser="current-user"
            onSendMessage={() => {}}
            onStartCall={() => {}}
            onShareScreen={() => {}}
            isConnected={true}
          />
        )}

        {/* Modals */}
        <TaskTemplates
          templates={templates}
          onCreateTemplate={handleCreateTemplate}
          onUseTemplate={handleUseTemplate}
          onDeleteTemplate={handleDeleteTemplate}
          isOpen={showTemplates}
          onClose={() => setShowTemplates(false)}
        />

        <KeyboardShortcuts
          isOpen={showShortcuts}
          onClose={() => setShowShortcuts(false)}
        />

        <Analytics
          lists={lists}
          isOpen={showAnalytics}
          onClose={() => setShowAnalytics(false)}
        />

        <Settings
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onExportData={handleExportData}
          onImportData={handleImportData}
          onClearData={handleClearData}
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />

        <CalendarView
          lists={lists}
          isOpen={showCalendar}
          onClose={() => setShowCalendar(false)}
          onUpdateTask={handleUpdateTask}
        />

        {showCollaboration && (
          <Collaboration
            list={lists.find(l => l.id === showCollaboration)!}
            onUpdateList={handleUpdateList}
            onInviteCollaborator={handleInviteCollaborator}
            onRemoveCollaborator={handleRemoveCollaborator}
            onUpdateCollaboratorRole={handleUpdateCollaboratorRole}
            isOpen={!!showCollaboration}
            onClose={() => setShowCollaboration(null)}
          />
        )}
      </main>

      {/* Mobile FAB for Settings */}
      {isMobile && (
        <button
          onClick={() => setShowSettings(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center z-30 btn-animate"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* Focus Mode Overlay */}
      {settings.productivity.focusMode && (
        <div className="fixed inset-0 pointer-events-none z-10">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        </div>
      )}
    </div>
  );
}

export default App;