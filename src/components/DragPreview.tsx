import React from 'react';
import { Task } from '../types';

interface DragPreviewProps {
  children: React.ReactNode;
  dragState: {
    isDragging: boolean;
    activeTask: Task | null;
    overId: string | null;
  };
}

interface DropIndicatorProps {
  isActive: boolean;
  position: 'top' | 'bottom';
}

const DropIndicator: React.FC<DropIndicatorProps> = ({ isActive, position }) => {
  if (!isActive) return null;

  return (
    <div
      className={`absolute left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 ${
        position === 'top' ? '-top-1' : '-bottom-1'
      }`}
      style={{
        boxShadow: '0 0 8px rgba(59, 130, 246, 0.6)',
      }}
    >
      <div className="absolute left-0 w-2 h-2 bg-blue-500 rounded-full -translate-y-0.5 shadow-lg" />
      <div className="absolute right-0 w-2 h-2 bg-indigo-500 rounded-full -translate-y-0.5 shadow-lg" />
    </div>
  );
};

interface TaskPlaceholderProps {
  task: Task;
  isVisible: boolean;
}

const TaskPlaceholder: React.FC<TaskPlaceholderProps> = ({ task, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div 
      className="relative p-4 bg-blue-50/40 backdrop-blur-sm rounded-xl border-2 border-dashed border-blue-300/60"
      style={{ 
        opacity: 0.4,
        transform: 'scale(0.98)',
      }}
    >
      <div className="flex items-start space-x-3">
        <div className="w-5 h-5 rounded-lg border-2 border-blue-300/60 bg-blue-100/50 mt-0.5" />
        
        <div className="flex-1 min-w-0">
          <div className="h-4 bg-blue-200/60 rounded mb-2" style={{ width: '70%' }} />
          {task.description && (
            <div className="h-3 bg-blue-100/60 rounded" style={{ width: '50%' }} />
          )}
          
          <div className="flex items-center space-x-2 mt-3">
            <div className="h-6 w-16 bg-blue-200/60 rounded-full" />
            {task.dueDate && (
              <div className="h-6 w-20 bg-blue-100/60 rounded-full" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DragPreview: React.FC<DragPreviewProps> = ({ children, dragState }) => {
  return (
    <>
      {children}
      {/* Global drag overlay styles */}
      {dragState.isDragging && (
        <style>
          {`
            .drop-zone-active {
              background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%);
              border-color: rgba(59, 130, 246, 0.2);
              box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.1), 0 4px 12px rgba(59, 130, 246, 0.1);
            }
          `}
        </style>
      )}
    </>
  );
};

export default DragPreview;
export { DropIndicator, TaskPlaceholder };