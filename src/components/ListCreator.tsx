import React, { useState } from 'react';
import { X, Palette } from 'lucide-react';
import { getListColor } from '../utils/taskUtils';

interface ListCreatorProps {
  onCreateList: (title: string, color: string, description?: string) => void;
  onCancel: () => void;
}

const ListCreator: React.FC<ListCreatorProps> = ({ onCreateList, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('red');

  const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onCreateList(title.trim(), selectedColor, description.trim() || undefined);
      // Reset form after successful creation
      setTitle('');
      setDescription('');
      setSelectedColor('red');
    }
  };

  return (
    <div className="flex-shrink-0 w-80 bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl shadow-gray-200/50 border-2 border-blue-200 animate-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Create New List</h3>
        <button
          onClick={onCancel}
          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">List Name</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter list name..."
            className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description..."
            rows={2}
            className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Palette className="w-4 h-4 inline mr-1" />
            Color Theme
          </label>
          <div className="grid grid-cols-6 gap-2">
            {colors.map((color) => {
              const colorConfig = getListColor(color);
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-lg ${colorConfig.accent} transition-all duration-200 hover:scale-110 ${
                    selectedColor === color ? 'ring-2 ring-gray-400 ring-offset-2' : ''
                  }`}
                />
              );
            })}
          </div>
        </div>

        <div className="flex space-x-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/60 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700/80 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim()}
            className="flex-1 px-4 py-3 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Create List
          </button>
        </div>
      </form>
    </div>
  );
};

export default ListCreator;