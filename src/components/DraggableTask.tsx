import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { Task } from '../types';
import TaskItem from './TaskItem';
import { DropIndicator, TaskPlaceholder } from './DragPreview';

interface DraggableTaskProps {
  task: Task;
  listId: string;
  index: number;
  onToggleComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDuplicate: (taskId: string) => void;
  onSelect: (taskId: string, selected: boolean) => void;
  isSelected: boolean;
  totalTasks: number;
}

const DraggableTask: React.FC<DraggableTaskProps> = ({
  task,
  listId,
  index,
  onToggleComplete,
  onDelete,
  onUpdate,
  onDuplicate,
  onSelect,
  isSelected,
  totalTasks,
}) => {
  const [showDropIndicator, setShowDropIndicator] = useState<'top' | 'bottom' | null>(null);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
    active,
  } = useSortable({
    id: task.id,
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

  // Determine drop indicator position
  React.useEffect(() => {
    if (isOver && active && active.id !== task.id && active.data.current?.type === 'task') {
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
    } else {
      setShowDropIndicator(null);
    }
  }, [isOver, active, task.id, index]);

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
      
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className={`absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing z-10 p-1 rounded hover:bg-gray-100 ${
          isDragging ? 'opacity-100' : ''
        }`}
      >
        <GripVertical className="w-4 h-4 text-gray-400 hover:text-gray-600" />
      </div>
      
      {/* Task content */}
      <div className={isDragging ? 'shadow-2xl ring-2 ring-blue-500/50 bg-white rounded-xl' : ''}>
        <TaskItem
          task={task}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onDuplicate={onDuplicate}
          onSelect={onSelect}
          isSelected={isSelected}
        />
      </div>
    </div>
  );
};

export default DraggableTask;