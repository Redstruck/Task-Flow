import React, { useState, useEffect } from 'react';
import { Check, X, Calendar, AlertCircle, Edit3, Clock, Tag, Copy } from 'lucide-react';
import { Task } from '../types';
import { getPriorityColor, formatDueDate } from '../utils/taskUtils';
import TimeTracking from './TimeTracking';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDuplicate?: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  onToggleComplete, 
  onDelete, 
  onUpdate, 
  onDuplicate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [isCompleting, setIsCompleting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleToggleComplete = () => {
    if (!task.completed) {
      // Starting completion animation
      setIsCompleting(true);
      setShowCelebration(true);
      
      // Complete the task after animation starts
      setTimeout(() => {
        onToggleComplete(task.id);
      }, 200);
      
      // Hide celebration after animation
      setTimeout(() => {
        setShowCelebration(false);
        setIsCompleting(false);
      }, 1500);
    } else {
      // Uncompleting - no animation needed
      onToggleComplete(task.id);
    }
  };

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdate(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        updatedAt: new Date(),
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
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
          className="w-full text-xs text-gray-600 border-none outline-none resize-none p-2 rounded-lg bg-gray-50/70 focus:bg-white transition-colors focus-ring"
          placeholder="Add description..."
          rows={2}
        />
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
    <div className={`group flex flex-col p-4 bg-white/60 backdrop-blur-sm rounded-xl border shadow-md hover:shadow-lg transition-all duration-500 hover:bg-white/80 hover-lift-subtle relative overflow-hidden ${
      task.completed ? 'opacity-60 scale-95' : ''
    } ${isOverdue ? 'border-red-200 bg-red-50/50' : 'border-gray-200/50'} ${
      isCompleting ? 'animate-pulse scale-105' : ''
    }`}>
      
      {/* Celebration Animation */}
      {showCelebration && (
        <>
          {/* Confetti particles */}
          <div className="absolute inset-0 pointer-events-none z-10">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-2 h-2 rounded-full animate-bounce ${
                  ['bg-yellow-400', 'bg-green-400', 'bg-blue-400', 'bg-purple-400', 'bg-pink-400', 'bg-red-400'][i % 6]
                }`}
                style={{
                  left: `${20 + (i * 8)}%`,
                  top: `${30 + (i % 3) * 20}%`,
                  animationDelay: `${i * 50}ms`,
                  animationDuration: '800ms',
                }}
              />
            ))}
          </div>
          
          {/* Success ripple effect */}
          <div className="absolute inset-0 bg-green-400/20 rounded-xl animate-ping pointer-events-none z-5" />
          
          {/* Checkmark burst */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center animate-bounce shadow-2xl">
              <Check className="w-8 h-8 text-white animate-pulse" />
            </div>
          </div>
        </>
      )}

      <div className="flex items-start space-x-3">
        <button
          onClick={handleToggleComplete}
          className={`flex-shrink-0 w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-300 mt-0.5 hover:shadow-md btn-animate transform hover:scale-110 ${
            task.completed
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-500 text-white shadow-lg shadow-green-500/30 animate-pulse'
              : 'border-gray-300 hover:border-green-400 hover:bg-green-50 hover:shadow-green-200'
          } ${isCompleting ? 'animate-spin' : ''}`}
        >
          {task.completed && <Check className={`w-3 h-3 ${isCompleting ? 'animate-bounce' : ''}`} />}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className={`text-sm font-medium transition-all duration-500 break-words ${
                task.completed ? 'line-through text-gray-500 transform scale-95' : 'text-gray-900'
              } ${isCompleting ? 'animate-pulse' : ''}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className={`text-xs mt-1 transition-all duration-500 break-words whitespace-pre-wrap ${
                  task.completed ? 'line-through text-gray-400 transform scale-95' : 'text-gray-600'
                } ${isCompleting ? 'animate-pulse' : ''}`}>
                  {task.description}
                </p>
              )}
            </div>
            
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-200 ml-2 flex-shrink-0">
              {onDuplicate && (
                <button
                  onClick={() => onDuplicate(task.id)}
                  className="p-1.5 text-gray-400 hover:text-purple-500 hover:bg-purple-50 rounded-lg transition-all duration-200 btn-animate"
                  title="Duplicate task"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200 btn-animate"
                title="Edit task"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 btn-animate"
                title="Delete task"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2 flex-wrap">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
              
              {task.dueDate && (
                <div className={`flex items-center space-x-1 text-xs px-2 py-1 rounded-full transition-all duration-200 ${
                  isOverdue ? 'text-red-600 bg-red-100' : 'text-gray-500 bg-gray-100'
                }`}>
                  {isOverdue ? <AlertCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                  <span>{formatDueDate(new Date(task.dueDate))}</span>
                </div>
              )}

              {task.tags && task.tags.length > 0 && (
                <div className="flex items-center space-x-1 flex-wrap">
                  {task.tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full transition-all duration-200 hover:bg-purple-200"
                    >
                      <Tag className="w-2 h-2 mr-1" />
                      {tag}
                    </span>
                  ))}
                  {task.tags.length > 2 && (
                    <span className="text-xs text-gray-500">+{task.tags.length - 2}</span>
                  )}
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