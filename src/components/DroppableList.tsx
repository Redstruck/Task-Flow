import React, { useState, useRef, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TodoList, Task, SortMethod } from '../types';
import { sortTasks, getListColor } from '../utils/taskUtils';
import DraggableTask from './DraggableTask';
import AddTaskInput from './AddTaskInput';
import { MoreVertical, ArrowUpDown, Trash2, CheckSquare, Share2 } from 'lucide-react';

interface DroppableListProps {
  list: TodoList;
  totalLists: number;
  onAddTask: (listId: string, title: string, priority: Task['priority'], dueDate?: Date, tags?: string[]) => void;
  onToggleTask: (listId: string, taskId: string) => void;
  onDeleteTask: (listId: string, taskId: string) => void;
  onUpdateTask: (listId: string, taskId: string, updates: Partial<Task>) => void;
  onUpdateList: (listId: string, updates: Partial<TodoList>) => void;
  onDeleteList: (listId: string) => void;
  defaultPriority: Task['priority'];
}

const DroppableList: React.FC<DroppableListProps> = ({
  list,
  totalLists,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onUpdateTask,
  onUpdateList,
  onDeleteList,
  defaultPriority,
}) => {
  const [dragOverState, setDragOverState] = useState<{
    isOver: boolean;
    activeTask: Task | null;
  }>({
    isOver: false,
    activeTask: null,
  });

  // State for dropdown menus
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Refs for dropdown menus
  const sortMenuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  const { setNodeRef, isOver, active } = useDroppable({
    id: list.id,
    data: {
      type: 'list',
      listId: list.id,
      accepts: ['task'],
    },
  });

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
        setShowSortMenu(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Enhanced drag over detection for cross-list drops
  React.useEffect(() => {
    if (isOver && active?.data.current?.type === 'task') {
      const activeListId = active.data.current.listId;
      const isDifferentList = activeListId !== list.id;
      
      setDragOverState({
        isOver: isDifferentList,
        activeTask: isDifferentList ? active.data.current.task : null,
      });
    } else {
      setDragOverState({
        isOver: false,
        activeTask: null,
      });
    }
  }, [isOver, active, list.id]);

  const activeTasks = sortTasks(list.tasks, list.sortMethod);
  const completedTasks = list.tasks.filter(task => task.completed);
  const colorConfig = getListColor(list.color);

  // Generate checkbox color that matches the aesthetic of blue and purple
  const getCheckboxColor = (color: string): string => {
    const checkboxColors: Record<string, string> = {
      red: 'text-red-400',
      orange: 'text-orange-400',
      yellow: 'text-yellow-400',
      green: 'text-green-400',
      blue: 'text-blue-400',
      purple: 'text-purple-400'
    };
    // Handle migration from indigo to orange
    if (color === 'indigo') {
      return checkboxColors.orange;
    }
    return checkboxColors[color] || 'text-red-400';
  };

  const sortMethodLabels: Record<SortMethod, string> = {
    smart: 'Smart Sort',
    priority: 'Priority',
    dueDate: 'Due Date',
    manual: 'Manual',
  };

  // Check if dragging from different list
  const isDraggingFromDifferentList = active?.data.current?.listId !== list.id;
  const showListDropZone = dragOverState.isOver && isDraggingFromDifferentList;

  const handleSortMethodChange = (method: SortMethod) => {
    onUpdateList(list.id, { sortMethod: method });
    setShowSortMenu(false); // Close dropdown after selection
  };

  const handleDeleteList = () => {
    setIsDeleting(true);
    setShowMoreMenu(false); // Close dropdown after action
    
    // Add a delay for the deletion animation
    setTimeout(() => {
      onDeleteList(list.id);
    }, 600);
  };

  return (
    <div 
      ref={setNodeRef}
      className={`flex-shrink-0 w-full md:w-80 bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl shadow-gray-200/50 border border-white/50 hover:shadow-2xl hover:shadow-gray-300/30 transition-all duration-300 flex flex-col ${colorConfig.border} ${
        showListDropZone ? 'ring-2 ring-blue-500/50 bg-blue-50/30 border-blue-300' : ''
      } ${
        activeTasks.length === 0 && completedTasks.length === 0 ? 'h-[400px]' : ''
      } ${isDeleting ? 'list-deleting' : ''}`}
    >
      {/* List Header */}
      <div className="mb-6 flex-shrink-0">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <div className={`w-3 h-3 rounded-full ${colorConfig.accent}`}></div>
              <h2 className="text-lg font-semibold text-gray-900">{list.title}</h2>
              {list.shared && (
                <div title="Shared list">
                  <Share2 className="w-4 h-4 text-blue-500" />
                </div>
              )}
            </div>
            {list.description && (
              <p className="text-xs text-gray-500 ml-5">{list.description}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            {/* Sort Menu */}
            <div className="relative" ref={sortMenuRef}>
              <button 
                onClick={() => {
                  setShowSortMenu(!showSortMenu);
                  setShowMoreMenu(false); // Close other dropdown
                }}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  showSortMenu 
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' 
                    : 'text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                }`}
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
              {showSortMenu && (
                <div className="absolute right-0 top-12 w-44 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 py-2 z-20">
                  {Object.entries(sortMethodLabels).map(([method, label]) => (
                    <button
                      key={method}
                      onClick={() => handleSortMethodChange(method as SortMethod)}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors ${
                        list.sortMethod === method ? 'text-blue-600 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-900/30 font-medium' : 'text-gray-700 dark:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* More Options Menu - Only show if there are multiple lists */}
            {totalLists > 1 && (
              <div className="relative" ref={moreMenuRef}>
                <button 
                  onClick={() => {
                    setShowMoreMenu(!showMoreMenu);
                    setShowSortMenu(false); // Close other dropdown
                  }}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    showMoreMenu 
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' 
                      : 'text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                  }`}
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {showMoreMenu && (
                  <div className="absolute right-0 top-12 w-40 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 py-2 z-20">
                    <button 
                      onClick={handleDeleteList}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center space-x-2"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete List</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {activeTasks.length} active task{activeTasks.length !== 1 ? 's' : ''}
          </p>
          <p className="text-xs text-gray-400 dark:text-white bg-gray-100/70 dark:bg-gray-700/70 px-2 py-1 rounded-full">
            {sortMethodLabels[list.sortMethod]}
          </p>
        </div>
      </div>

      {/* Tasks Container - Now flexible height */}
      <div className={`flex-1 flex flex-col min-h-0 ${
        showListDropZone ? 'bg-blue-50/20 rounded-xl p-2' : ''
      }`}>
        {/* Drop zone indicator for cross-list drops - Show for both empty and non-empty lists */}
        {showListDropZone && (
          <div className="mb-4 p-6 border-2 border-dashed border-blue-400 rounded-xl bg-blue-50/50 flex-shrink-0">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-lg font-bold">+</span>
              </div>
              <p className="text-sm font-medium text-blue-700 mb-1">Drop task here</p>
              <p className="text-xs text-blue-600">Move to "{list.title}"</p>
              {dragOverState.activeTask && (
                <p className="text-xs text-blue-500 mt-2 font-medium">
                  "{dragOverState.activeTask.title}"
                </p>
              )}
            </div>
          </div>
        )}

        <div className="space-y-3 mb-6 flex-1">
          {activeTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className={`w-16 h-16 ${colorConfig.bg} rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 ${
                showListDropZone ? 'scale-110' : ''
              }`}>
                <CheckSquare className={`w-8 h-8 ${getCheckboxColor(list.color)}`} />
              </div>
              <p className="text-gray-500 text-sm font-medium">
                {showListDropZone ? 'Drop your task here' : 'No tasks yet'}
              </p>
              <p className="text-gray-400 text-xs mt-1">
                {showListDropZone ? `Add to ${list.title}` : 'Add your first task below'}
              </p>
            </div>
          ) : (
            <SortableContext items={activeTasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {activeTasks.map((task, index) => (
                  <div 
                    key={task.id}
                    className="stagger-item animate-in fade-in"
                    style={{ '--stagger-delay': index } as React.CSSProperties}
                  >
                    <DraggableTask
                      task={task}
                      listId={list.id}
                      index={index}
                      totalTasks={activeTasks.length}
                      onToggleComplete={(taskId) => onToggleTask(list.id, taskId)}
                      onDelete={(taskId) => onDeleteTask(list.id, taskId)}
                      onUpdate={(taskId, updates) => onUpdateTask(list.id, taskId, updates)}
                    />
                  </div>
                ))}
              </div>
            </SortableContext>
          )}
        </div>

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div className="mb-6 flex-shrink-0">
            <details className="group">
              <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200 mb-3 flex items-center space-x-2">
                <span className="select-none font-medium">
                  Completed ({completedTasks.length})
                </span>
                <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center transition-all duration-200">
                  <CheckSquare className="w-2.5 h-2.5 text-green-600" />
                </div>
              </summary>
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                {completedTasks.map((task, index) => (
                  <div 
                    key={task.id}
                    className="stagger-item animate-in fade-in"
                    style={{ '--stagger-delay': index } as React.CSSProperties}
                  >
                    <DraggableTask
                      task={task}
                      listId={list.id}
                      index={index + activeTasks.length}
                      totalTasks={completedTasks.length}
                      onToggleComplete={(taskId) => onToggleTask(list.id, taskId)}
                      onDelete={(taskId) => onDeleteTask(list.id, taskId)}
                      onUpdate={(taskId, updates) => onUpdateTask(list.id, taskId, updates)}
                    />
                  </div>
                ))}
              </div>
            </details>
          </div>
        )}
      </div>

      {/* Add Task Input - Always at bottom */}
      <div className="flex-shrink-0">
        <AddTaskInput 
          onAddTask={(title, priority, dueDate) => onAddTask(list.id, title, priority, dueDate)}
          defaultPriority={defaultPriority}
        />
      </div>
    </div>
  );
};

export default DroppableList;