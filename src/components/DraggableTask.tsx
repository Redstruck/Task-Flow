import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { Task } from '../types';
import TaskItem from './TaskItem';
import { DropIndicator } from './DragPreview';

interface DraggableTaskProps {
  task: Task;
  listId: string;
  index: number;
  onToggleComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  totalTasks: number; // Keep for consistency with other components
}

const DraggableTask: React.FC<DraggableTaskProps> = ({
  task,
  listId,
  index,
  onToggleComplete,
  onDelete,
  onUpdate,
  totalTasks: _totalTasks, // Keeping for consistency, prefix with _ to suppress warning
}) => {
  const [showDropIndicator, setShowDropIndicator] = useState<'top' | 'bottom' | null>(null);
  const [isTaskEditing, setIsTaskEditing] = useState(false);
  
  // Disable dragging for completed tasks
  const isDragDisabled = task.completed;
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
    isOver,
    active,
  } = useSortable({
    id: task.id,
    disabled: isDragDisabled, // Disable dragging for completed tasks
    data: {
      type: 'task',
      task,
      listId,
      index,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : undefined,
  };

  // Determine drop indicator position - don't show indicators for completed tasks
  React.useEffect(() => {
    if (isOver && active && active.id !== task.id && active.data.current?.type === 'task' && !isDragDisabled) {
      const activeTask = active.data.current?.task;
      // Don't allow reordering with completed tasks or if the dragged task is completed
      if (!activeTask?.completed) {
        const activeIndex = active.data.current?.index;
        const currentIndex = index;
        
        if (typeof activeIndex === 'number') {
          if (activeIndex < currentIndex) {
            setShowDropIndicator('bottom');
          } else if (activeIndex > currentIndex) {
            setShowDropIndicator('top');
          } else {
            setShowDropIndicator(null);
          }
        }
      }
    } else {
      setShowDropIndicator(null);
    }
  }, [isOver, active, task.id, index, isDragDisabled]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group sortable-item ${
        isDragging ? 'z-50 opacity-50' : ''
      } ${isOver ? 'drop-zone-active' : ''}`}
    >
      {/* Drop indicators */}
      <DropIndicator isActive={showDropIndicator === 'top'} position="top" />
      <DropIndicator isActive={showDropIndicator === 'bottom'} position="bottom" />
      
      {/* Drag handle - Hidden when editing or task is completed */}
      {!isTaskEditing && !isDragDisabled && (
        <div
          {...attributes}
          {...listeners}
          className={`absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing z-10 p-1 rounded hover:bg-gray-100 ${
            isDragging ? 'opacity-100' : ''
          }`}
        >
          <GripVertical className="w-4 h-4 text-gray-400 hover:text-gray-600" />
        </div>
      )}
      
      {/* Task content */}
      <div className={isDragging ? 'shadow-2xl ring-2 ring-blue-500/50 bg-white rounded-xl' : ''}>
        <TaskItem
          task={task}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onEditingChange={setIsTaskEditing}
        />
      </div>
    </div>
  );
};

export default DraggableTask;