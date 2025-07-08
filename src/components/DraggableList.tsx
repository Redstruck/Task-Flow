import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { TodoList } from '../types';
import DroppableList from './DroppableList';

interface DraggableListProps {
  list: TodoList;
  index: number;
  totalLists: number;
  onAddTask: (listId: string, title: string, priority: any, dueDate?: Date) => void;
  onToggleTask: (listId: string, taskId: string) => void;
  onDeleteTask: (listId: string, taskId: string) => void;
  onUpdateTask: (listId: string, taskId: string, updates: any) => void;
  onUpdateList: (listId: string, updates: any) => void;
  onDeleteList: (listId: string) => void;
  onDuplicateTask: (listId: string, taskId: string) => void;
  onSelectTask: (taskId: string, selected: boolean) => void;
  selectedTasks: string[];
  onShowCollaboration?: () => void;
  defaultPriority: Task['priority'];
}

const DraggableList: React.FC<DraggableListProps> = ({
  list,
  index,
  totalLists,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onUpdateTask,
  onUpdateList,
  onDeleteList,
  onDuplicateTask,
  onSelectTask,
  selectedTasks,
  onShowCollaboration,
  defaultPriority,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({
    id: list.id,
    data: {
      type: 'list',
      list,
      index,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${
        isDragging 
          ? 'z-50 opacity-80 scale-105 shadow-2xl ring-2 ring-blue-500/50' 
          : ''
      } ${
        isOver && !isDragging 
          ? 'scale-102 shadow-xl' 
          : ''
      }`}
    >
      {/* List Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className={`absolute -left-3 top-6 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing z-20 p-2 rounded-lg bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200/50 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 ${
          isDragging ? 'opacity-100' : ''
        }`}
        title="Drag to reorder list"
      >
        <GripVertical className="w-4 h-4 text-gray-400 hover:text-blue-600 transition-colors" />
      </div>

      {/* Drop Indicator */}
      {isOver && !isDragging && (
        <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full shadow-lg animate-pulse" />
      )}

      {/* List Content */}
      <div className={`transition-all duration-200 ${
        isDragging 
          ? 'bg-white/95 backdrop-blur-sm rounded-2xl border-2 border-blue-300' 
          : ''
      }`}>
        <DroppableList
          list={list}
          totalLists={totalLists}
          onAddTask={onAddTask}
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
          onUpdateTask={onUpdateTask}
          onUpdateList={onUpdateList}
          onDeleteList={onDeleteList}
          onDuplicateTask={onDuplicateTask}
          onSelectTask={onSelectTask}
          selectedTasks={selectedTasks}
          onShowCollaboration={onShowCollaboration}
          defaultPriority={defaultPriority}
        />
      </div>

      {/* Drag Ghost Effect */}
      {isDragging && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl pointer-events-none" />
      )}
    </div>
  );
};

export default DraggableList;