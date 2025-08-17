import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, X, Tag, Calendar, AlertCircle } from 'lucide-react';
import { SearchFilters } from '../types';
import { useKeyboardShortcutsContext } from '../contexts/KeyboardShortcutsContext';

interface SearchBarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  allTags: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({ filters, onFiltersChange, allTags }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const { enabled } = useKeyboardShortcutsContext();

  useEffect(() => {
    if (!enabled) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enabled]);

  const handleQueryChange = (query: string) => {
    onFiltersChange({ ...filters, query });
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      query: '',
      priority: undefined,
      completed: undefined,
      tags: [],
      dueDate: undefined,
      assignee: undefined,
    });
  };

  const hasActiveFilters = filters.priority || filters.completed !== undefined || 
    (filters.tags && filters.tags.length > 0) || filters.dueDate || filters.assignee;

  return (
    <div className="relative">
      <div className={`relative transition-all duration-300 ${isFocused ? 'scale-105' : ''}`}>
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={searchRef}
          type="text"
          value={filters.query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search tasks... (⌘K)"
          className="w-full pl-12 pr-20 py-4 text-sm bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all duration-200 hover:border-gray-300 shadow-lg"
        />
        <div className="absolute inset-y-0 right-0 flex items-center space-x-2 pr-4">
          {(filters.query || hasActiveFilters) && (
            <button
              onClick={clearFilters}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg transition-all duration-200 hover:shadow-md ${
              showFilters || hasActiveFilters
                ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 shadow-md'
                : 'bg-gray-100/70 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-700/80'
            }`}
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="absolute top-full left-0 right-0 mt-2 p-6 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 z-50 animate-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                <AlertCircle className="w-3 h-3 inline mr-1" />
                Priority
              </label>
              <div className="flex space-x-2">
                {(['low', 'medium', 'high'] as const).map((priority) => (
                  <button
                    key={priority}
                    onClick={() => handleFilterChange('priority', filters.priority === priority ? undefined : priority)}
                    className={`px-4 py-2 text-xs font-medium rounded-lg border transition-all duration-200 hover:shadow-md ${
                      filters.priority === priority
                        ? priority === 'high' ? 'bg-red-100 text-red-800 border-red-200'
                          : priority === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                          : 'bg-green-100 text-green-800 border-green-200'
                        : 'text-gray-600 bg-white/70 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                <Calendar className="w-3 h-3 inline mr-1" />
                Due Date
              </label>
              <div className="flex flex-wrap gap-2">
                {(['today', 'tomorrow', 'week', 'overdue'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => handleFilterChange('dueDate', filters.dueDate === period ? undefined : period)}
                    className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all duration-200 hover:shadow-md ${
                      filters.dueDate === period
                        ? 'bg-blue-100 text-blue-800 border-blue-200'
                        : 'text-gray-600 bg-white/70 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Status
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleFilterChange('completed', filters.completed === false ? undefined : false)}
                  className={`px-4 py-2 text-xs font-medium rounded-lg border transition-all duration-200 hover:shadow-md ${
                    filters.completed === false
                      ? 'bg-orange-100 text-orange-800 border-orange-200'
                      : 'text-gray-600 bg-white/70 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => handleFilterChange('completed', filters.completed === true ? undefined : true)}
                  className={`px-4 py-2 text-xs font-medium rounded-lg border transition-all duration-200 hover:shadow-md ${
                    filters.completed === true
                      ? 'bg-green-100 text-green-800 border-green-200'
                      : 'text-gray-600 bg-white/70 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>

            {allTags.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                  <Tag className="w-3 h-3 inline mr-1" />
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        const currentTags = filters.tags || [];
                        const newTags = currentTags.includes(tag)
                          ? currentTags.filter(t => t !== tag)
                          : [...currentTags, tag];
                        handleFilterChange('tags', newTags);
                      }}
                      className={`px-3 py-1 text-xs font-medium rounded-full border transition-all duration-200 hover:shadow-md ${
                        filters.tags?.includes(tag)
                          ? 'bg-purple-100 text-purple-800 border-purple-200'
                          : 'text-gray-600 bg-white/70 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;