import React, { useState } from 'react';
import { CheckSquare, Settings, Calendar, Search, BookTemplate as Template, Keyboard, BarChart3 } from 'lucide-react';
import SearchBar from './SearchBar';
import { SearchFilters } from '../types';

interface HeaderProps {
  searchFilters: SearchFilters;
  onSearchFiltersChange: (filters: SearchFilters) => void;
  allTags: string[];
  onShowTemplates: () => void;
  onShowShortcuts: () => void;
  onShowAnalytics: () => void;
  onShowCalendar: () => void;
  onShowSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({
  searchFilters,
  onSearchFiltersChange,
  allTags,
  onShowTemplates,
  onShowShortcuts,
  onShowAnalytics,
  onShowCalendar,
  onShowSettings,
}) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-6 py-4 shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
            <CheckSquare className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              TaskFlow
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
            className="group relative p-3 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200 hover:shadow-md"
            title="Analytics"
          >
            <BarChart3 className="w-5 h-5 transition-transform group-hover:scale-110" />
          </button>
          
          <button 
            onClick={onShowTemplates}
            className="group relative p-3 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200 hover:shadow-md"
            title="Templates"
          >
            <Template className="w-5 h-5 transition-transform group-hover:scale-110" />
          </button>
          
          <button 
            onClick={onShowShortcuts}
            className="group relative p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:shadow-md"
            title="Keyboard Shortcuts"
          >
            <Keyboard className="w-5 h-5 transition-transform group-hover:scale-110" />
          </button>
          
          <button 
            onClick={onShowCalendar}
            className="group p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:shadow-md"
            title="Calendar View"
          >
            <Calendar className="w-5 h-5 transition-transform group-hover:scale-110" />
          </button>
          
          <button 
            onClick={onShowSettings}
            className="group p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:shadow-md"
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