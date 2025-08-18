import React, { useState, useEffect } from 'react';
import { Check, AlertCircle, Edit3, Clock, Trash2 } from 'lucide-react';
import { Task } from '../types';
import { getPriorityColor, formatDueDate } from '../utils/taskUtils';
import TimeTracking from './TimeTracking';
import { DatePicker } from './DatePicker';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onEditingChange?: (isEditing: boolean) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  onToggleComplete, 
  onDelete, 
  onUpdate, 
  onEditingChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [editDueDate, setEditDueDate] = useState<Date | undefined>(task.dueDate);
  const [editPriority, setEditPriority] = useState<Task['priority']>(task.priority);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isUncompleting, setIsUncompleting] = useState(false);

  // Notify parent component when editing state changes
  useEffect(() => {
    onEditingChange?.(isEditing);
  }, [isEditing, onEditingChange]);

  // Update local state when task prop changes
  useEffect(() => {
    if (!isEditing) {
      setEditTitle(task.title);
      setEditDescription(task.description || '');
      setEditDueDate(task.dueDate);
      setEditPriority(task.priority);
    }
  }, [task, isEditing]);

  // Exit edit mode if task becomes completed
  useEffect(() => {
    if (task.completed && isEditing) {
      setIsEditing(false);
    }
  }, [task.completed, isEditing]);

  const handleToggleComplete = () => {
    if (task.completed) {
      // Task is being uncompleted
      setIsUncompleting(true);
      setTimeout(() => {
        onToggleComplete(task.id);
        setIsUncompleting(false);
      }, 300);
    } else {
      // Task is being completed
      setIsCompleting(true);
      
      // Show celebration for high priority tasks
      if (task.priority === 'high') {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
      }
      
      // Add a small delay for the animation to show
      setTimeout(() => {
        onToggleComplete(task.id);
        setIsCompleting(false);
      }, 300);
    }
  };

  const handleDelete = () => {
    setIsDeleting(true);
    
    // Add a delay for the deletion animation
    setTimeout(() => {
      onDelete(task.id);
    }, 500);
  };

  const handleSave = () => {
    // Don't allow saving if task is completed
    if (task.completed) {
      setIsEditing(false);
      return;
    }
    
    if (editTitle.trim()) {
      onUpdate(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        dueDate: editDueDate,
        priority: editPriority,
        updatedAt: new Date(),
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditDueDate(task.dueDate);
    setEditPriority(task.priority);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  if (isEditing) {
    return (
      <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-blue-200 shadow-lg animate-in scale-in duration-200">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full text-sm font-medium border-none outline-none mb-2 p-2 rounded-lg bg-gray-50/70 focus:bg-white transition-colors focus-ring"
          placeholder="Task title..."
          autoFocus
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full text-xs text-gray-600 border-none outline-none resize-none p-2 rounded-lg bg-gray-50/70 focus:bg-white transition-colors focus-ring mb-2"
          placeholder="Add description..."
          rows={2}
        />
        
        {/* Priority */}
        <div className="mb-2">
          <label className="block text-xs font-semibold text-gray-700 mb-1">Priority</label>
          <div className="flex space-x-2">
            {(['low', 'medium', 'high'] as const).map((priority) => (
              <button
                key={priority}
                type="button"
                onClick={() => setEditPriority(priority)}
                className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg border transition-all duration-200 ${
                  editPriority === priority
                    ? priority === 'high'
                      ? 'bg-red-100 border-red-300 text-red-800 shadow-md'
                      : priority === 'medium'
                      ? 'bg-yellow-100 border-yellow-300 text-yellow-800 shadow-md'
                      : 'bg-green-100 border-green-300 text-green-800 shadow-md'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span className="capitalize">{priority}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Due Date */}
        <div className="mb-2">
          <label className="block text-xs font-semibold text-gray-700 mb-1">Due Date</label>
          <DatePicker
            value={editDueDate}
            onChange={setEditDueDate}
            placeholder="Select due date"
            className="w-full"
          />
        </div>
        
        <div className="flex justify-end space-x-2 mt-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-xs text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:shadow-md btn-animate"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-xs bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg btn-animate"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`task-item group flex flex-col p-4 bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border shadow-md hover:shadow-lg transition-all duration-500 hover:bg-white/80 dark:hover:bg-gray-800/70 hover-lift-subtle relative overflow-hidden ${
      task.completed ? 'opacity-60 scale-95 completed' : ''
    } ${isCompleting ? `task-completing ${task.priority}-priority-completing` : ''} ${
      isUncompleting ? 'task-uncompleting' : ''
    } ${isDeleting ? 'task-deleting' : ''} ${showCelebration ? 'sparkle-effect' : ''} ${isOverdue ? 'border-red-200 dark:border-red-800/50 bg-red-50/50 dark:bg-red-900/20' : 'border-gray-200/50 dark:border-gray-700/50'}`}>

      <div className="flex items-start space-x-3">
        <button
          onClick={handleToggleComplete}
          className={`flex-shrink-0 w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-300 mt-0.5 hover:shadow-md btn-animate transform hover:scale-110 ${
            task.completed
              ? `bg-gradient-to-r from-green-500 to-emerald-500 border-green-500 text-white shadow-lg shadow-green-500/30 completion-glow ${task.priority}-priority`
              : 'border-gray-300 hover:border-green-400 hover:bg-green-50 hover:shadow-green-200'
          } ${isCompleting ? `completion-glow ${task.priority}-priority` : ''} ${
            isUncompleting ? 'checkbox-uncompleting' : ''
          }`}
        >
          {task.completed && <Check className={`w-3 h-3 ${isCompleting ? 'checkmark-pop' : ''}`} />}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className={`text-sm font-medium transition-all duration-500 break-words ${
                task.completed ? 'line-through text-gray-500 transform scale-95' : 'text-gray-900'
              }`}>
                {task.title}
              </h3>
              {task.description && (
                <p className={`text-xs mt-1 transition-all duration-500 break-words whitespace-pre-wrap ${
                  task.completed ? 'line-through text-gray-400 transform scale-95' : 'text-gray-600'
                }`}>
                  {task.description}
                </p>
              )}
            </div>
            
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-200 ml-2 flex-shrink-0">
              {/* Only show edit button for incomplete tasks */}
              {!task.completed && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 btn-animate"
                  title="Edit task"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={handleDelete}
                className={`p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 btn-animate ${isDeleting ? 'delete-shake' : ''}`}
                title="Delete task"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2 flex-wrap">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${getPriorityColor(task.priority)}`}>
                <span className="capitalize">{task.priority}</span>
              </span>
              
              {task.dueDate && (
                <div className={`flex items-center space-x-1 text-xs px-2 py-1 rounded-full transition-all duration-200 ${
                  isOverdue ? 'text-red-600 bg-red-100' : 'text-gray-500 bg-gray-100'
                }`}>
                  {isOverdue ? <AlertCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                  <span>{formatDueDate(new Date(task.dueDate))}</span>
                </div>
              )}
            </div>

            {(task.estimatedTime || task.actualTime) && (
              <TimeTracking
                task={task}
                onUpdateTime={(taskId, actualTime) => onUpdate(taskId, { actualTime, updatedAt: new Date() })}
              />
            )}
          </div>

          {task.subtasks && task.subtasks.length > 0 && (
            <div className="mt-3 space-y-1">
              {task.subtasks.slice(0, 3).map((subtask) => (
                <div key={subtask.id} className="flex items-center space-x-2 text-xs">
                  <div className={`w-3 h-3 rounded border transition-all duration-200 ${
                    subtask.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                  }`}>
                    {subtask.completed && <Check className="w-2 h-2 text-white" />}
                  </div>
                  <span className={`transition-all duration-200 break-words ${subtask.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                    {subtask.title}
                  </span>
                </div>
              ))}
              {task.subtasks.length > 3 && (
                <div className="text-xs text-gray-500 ml-5">
                  +{task.subtasks.length - 3} more subtasks
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;