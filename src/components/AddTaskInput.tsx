import React, { useState } from 'react';
import { Plus, Calendar, Flag, Sparkles } from 'lucide-react';
import { Task } from '../types';

interface AddTaskInputProps {
  onAddTask: (title: string, priority: Task['priority'], dueDate?: Date) => void;
  defaultPriority?: Task['priority'];
}

const AddTaskInput: React.FC<AddTaskInputProps> = ({ onAddTask, defaultPriority = 'medium' }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Task['priority']>(defaultPriority);
  const [dueDate, setDueDate] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  // Update priority when defaultPriority changes
  React.useEffect(() => {
    setPriority(defaultPriority);
  }, [defaultPriority]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      const dueDateObj = dueDate ? new Date(dueDate) : undefined;
      // Always pass the current priority state, not defaultPriority
      onAddTask(title.trim(), priority, dueDateObj);
      setTitle('');
      setDueDate('');
      setPriority(defaultPriority); // Reset to default priority after creating task
      setShowOptions(false);
    }
  };

  const priorityColors = {
    low: 'text-green-600 bg-green-50 border-green-200 hover:bg-green-100',
    medium: 'text-yellow-600 bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
    high: 'text-red-600 bg-red-50 border-red-200 hover:bg-red-100',
  };

  const priorityLabels = {
    low: 'Low',
    medium: 'Medium', 
    high: 'High'
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add a new task..."
              className="w-full px-4 py-3.5 text-sm border border-gray-200/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all duration-200 bg-white/70 backdrop-blur-sm placeholder-gray-400 hover:border-gray-300"
            />
            {title && (
              <Sparkles className="absolute right-3 top-3.5 w-4 h-4 text-blue-400 animate-pulse" />
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            className={`flex-shrink-0 p-3.5 rounded-xl transition-all duration-200 hover:shadow-md ${
              showOptions 
                ? 'bg-blue-100 text-blue-600 shadow-md' 
                : 'bg-gray-100/70 text-gray-600 hover:bg-gray-200/70'
            }`}
          >
            <Flag className={`w-4 h-4 transition-transform ${showOptions ? 'scale-110' : ''}`} />
          </button>
          <button
            type="submit"
            disabled={!title.trim()}
            className="flex-shrink-0 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none transform hover:scale-105 disabled:scale-100"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className={`overflow-hidden transition-all duration-300 ease-out ${
          showOptions ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50 space-y-4 shadow-lg">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">Priority</label>
              <div className="flex space-x-2">
                {(['low', 'medium', 'high'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`px-4 py-2 text-xs font-medium rounded-lg border transition-all duration-200 hover:shadow-md ${
                      priority === p ? priorityColors[p] : 'text-gray-600 bg-white/70 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {priorityLabels[p]}
                  </button>
                ))}
              </div>
              {priority !== defaultPriority && (
                <p className="text-xs text-blue-600 mt-2">
                  Using {priorityLabels[priority]} priority (default: {priorityLabels[defaultPriority]})
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-3 text-sm border border-gray-200/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all duration-200 bg-white/70 backdrop-blur-sm hover:border-gray-300"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddTaskInput;