import React, { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { Task } from '../types';
import { DatePicker } from './DatePicker';

interface AddTaskInputProps {
  onAddTask: (title: string, priority: Task['priority'], dueDate?: Date) => void;
  defaultPriority: Task['priority'];
}

const AddTaskInput: React.FC<AddTaskInputProps> = ({ onAddTask, defaultPriority }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Task['priority']>(defaultPriority);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [showOptions, setShowOptions] = useState(false);

  // Update priority when defaultPriority changes
  React.useEffect(() => {
    setPriority(defaultPriority);
  }, [defaultPriority]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTask(title.trim(), priority, dueDate);
      setTitle('');
      setDueDate(undefined);
      // Reset to current default priority after creating task
      setPriority(defaultPriority);
      setShowOptions(false);
    }
  };

  const handleInputFocus = () => {
    setShowOptions(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (!showOptions && e.target.value.trim()) {
      setShowOptions(true);
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
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              placeholder="Add a new task..."
              className="w-full px-4 py-3.5 text-sm border border-gray-200/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all duration-200 bg-white/70 backdrop-blur-sm placeholder-gray-400 hover:border-gray-300"
            />
            {title && (
              <Sparkles className="absolute right-3 top-3.5 w-4 h-4 text-blue-400 animate-pulse" />
            )}
          </div>
          <button
            type="submit"
            disabled={!title.trim()}
            className="flex-shrink-0 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none transform hover:scale-105 disabled:scale-100"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className={`transition-all duration-300 ease-out ${
          showOptions ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
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
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">Due Date</label>
              <div className="relative overflow-visible">
                <DatePicker
                  value={dueDate}
                  onChange={setDueDate}
                  label={undefined}
                  placeholder="Select due date"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddTaskInput;