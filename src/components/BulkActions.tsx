import React from 'react';
import { CheckSquare, Trash2, Archive, Calendar, User } from 'lucide-react';

interface BulkActionsProps {
  selectedTasks: string[];
  onBulkComplete: () => void;
  onBulkDelete: () => void;
  onBulkArchive: () => void;
  onBulkAssign: () => void;
  onBulkSetDueDate: () => void;
  onClearSelection: () => void;
}

const BulkActions: React.FC<BulkActionsProps> = ({
  selectedTasks,
  onBulkComplete,
  onBulkDelete,
  onBulkArchive,
  onBulkAssign,
  onBulkSetDueDate,
  onClearSelection,
}) => {
  if (selectedTasks.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 p-4 z-40 animate-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">{selectedTasks.length}</span>
          </div>
          <span className="text-sm font-medium text-gray-700">
            {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''} selected
          </span>
        </div>

        <div className="h-6 w-px bg-gray-300"></div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onBulkComplete}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 hover:shadow-md"
            title="Mark as complete"
          >
            <CheckSquare className="w-4 h-4" />
          </button>
          
          <button
            onClick={onBulkSetDueDate}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:shadow-md"
            title="Set due date"
          >
            <Calendar className="w-4 h-4" />
          </button>
          
          <button
            onClick={onBulkAssign}
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 hover:shadow-md"
            title="Assign to"
          >
            <User className="w-4 h-4" />
          </button>
          
          <button
            onClick={onBulkArchive}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200 hover:shadow-md"
            title="Archive"
          >
            <Archive className="w-4 h-4" />
          </button>
          
          <button
            onClick={onBulkDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:shadow-md"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="h-6 w-px bg-gray-300"></div>

        <button
          onClick={onClearSelection}
          className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default BulkActions;