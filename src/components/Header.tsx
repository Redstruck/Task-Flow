import React from 'react';
import { CheckSquare, Settings, CalendarDays, BookTemplate as Template, Keyboard, BarChart3 } from 'lucide-react';
import SearchBar from './SearchBar';
import { SearchFilters } from '../types';

interface HeaderProps {
  searchFilters: SearchFilters;
  onSearchFiltersChange: (filters: SearchFilters) => void;
  allTags: string[];
  onShowTemplates: () => void;
  onShowShortcuts: () => void;
  onShowAnalytics: () => void;
  onShowEventCalendar: () => void;
  onShowSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({
  searchFilters,
  onSearchFiltersChange,
  allTags,
  onShowTemplates,
  onShowShortcuts,
  onShowAnalytics,
  onShowEventCalendar,
  onShowSettings,
}) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-6 py-4 shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-blue-700 rounded-xl shadow-lg dark:shadow-none">
            <CheckSquare className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold 
                  bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent 
                  dark:bg-none dark:bg-transparent dark:text-white">
                  TaskFlux
            </h1>
            <p className="text-xs text-gray-500 -mt-1">Advanced Task Management</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-8">
          <SearchBar
            filters={searchFilters}
            onFiltersChange={onSearchFiltersChange}
            allTags={allTags}
          />
        </div>
        
        <div className="flex items-center space-x-1">
          <button 
            onClick={onShowAnalytics}
            className="group relative p-3 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:shadow-purple-200/50 rounded-xl transition-all duration-200 hover:shadow-md"
            title="Analytics"
          >
            <BarChart3 className="w-5 h-5 transition-transform group-hover:scale-110" />
          </button>
          
          <button 
            onClick={onShowTemplates}
            className="group relative p-3 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:shadow-indigo-200/50 rounded-xl transition-all duration-200 hover:shadow-md"
            title="Templates"
          >
            <Template className="w-5 h-5 transition-transform group-hover:scale-110" />
          </button>
          
          <button 
            onClick={onShowShortcuts}
            className="group relative p-3 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:shadow-emerald-200/50 rounded-xl transition-all duration-200 hover:shadow-md"
            title="Keyboard Shortcuts"
          >
            <Keyboard className="w-5 h-5 transition-transform group-hover:scale-110" />
          </button>
          
          <button 
            onClick={onShowEventCalendar}
            className="group p-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:shadow-blue-200/50 rounded-xl transition-all duration-200 hover:shadow-md"
            title="Calendar"
          >
            <CalendarDays className="w-5 h-5 transition-transform group-hover:scale-110" />
          </button>
          
          <button 
            onClick={onShowSettings}
            className="group p-3 text-gray-600 dark:text-gray-400 hover:text-slate-600 dark:hover:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:shadow-slate-200/50 rounded-xl transition-all duration-200 hover:shadow-md"
            title="Settings"
          >
            <Settings className="w-5 h-5 transition-transform group-hover:scale-110" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;