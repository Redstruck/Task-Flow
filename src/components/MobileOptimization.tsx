import React, { useState, useEffect } from 'react';
import { Menu, X, Search, Plus, Filter } from 'lucide-react';
import { TodoList, Task, SearchFilters } from '../types';

interface MobileNavigationProps {
  lists: TodoList[];
  activeListId: string | null;
  onSelectList: (listId: string | null) => void;
  onShowSearch: () => void;
  onShowAddTask: () => void;
  searchFilters: SearchFilters;
  onSearchFiltersChange: (filters: SearchFilters) => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  lists,
  activeListId,
  onSelectList,
  onShowSearch,
  onShowAddTask,
  searchFilters,
  onSearchFiltersChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile) return null;

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden bg-white/90 backdrop-blur-sm border-b border-gray-200/50 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <h1 className="text-lg font-semibold text-gray-900">
            {activeListId ? lists.find(l => l.id === activeListId)?.title || 'TaskFlow' : 'All Tasks'}
          </h1>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onShowSearch}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={onShowAddTask}
              className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-lg"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-80 bg-white/95 backdrop-blur-sm shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
              <h2 className="text-lg font-semibold text-gray-900">Lists</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-2">
              <button
                onClick={() => {
                  onSelectList(null);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeListId === null
                    ? 'bg-blue-100 text-blue-800 shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                All Tasks
              </button>
              
              {lists.map((list) => (
                <button
                  key={list.id}
                  onClick={() => {
                    onSelectList(list.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center space-x-3 ${
                    activeListId === list.id
                      ? 'bg-blue-100 text-blue-800 shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full bg-${list.color}-500`} />
                  <span className="flex-1">{list.title}</span>
                  <span className="text-xs text-gray-500">
                    {list.tasks.filter(t => !t.completed).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

interface MobileTaskViewProps {
  task: Task;
  onToggleComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const MobileTaskView: React.FC<MobileTaskViewProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="md:hidden p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-lg">
      <div className="flex items-start space-x-3">
        <button
          onClick={onToggleComplete}
          className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 mt-1 ${
            task.completed
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-green-400'
          }`}
        >
          {task.completed && <span className="text-xs">✓</span>}
        </button>
        
        <div className="flex-1 min-w-0">
          <h3 className={`text-base font-medium ${
            task.completed ? 'line-through text-gray-500' : 'text-gray-900'
          }`}>
            {task.title}
          </h3>
          
          {task.description && (
            <p className={`text-sm mt-1 ${
              task.completed ? 'line-through text-gray-400' : 'text-gray-600'
            }`}>
              {task.description}
            </p>
          )}
          
          <div className="flex items-center space-x-2 mt-3">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              task.priority === 'high' ? 'bg-red-100 text-red-800' :
              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {task.priority}
            </span>
            
            {task.dueDate && (
              <span className="text-xs text-gray-500">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 mt-4 pt-3 border-t border-gray-200/50">
        <button
          onClick={onEdit}
          className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export const useMobileOptimization = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  return { isMobile, orientation };
};