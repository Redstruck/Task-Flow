import React, { useState } from 'react';
import { User, LogOut, Settings, Download, Upload } from 'lucide-react';

interface UserProfileProps {
  user: any;
  onSignOut: () => void;
  onShowSettings: () => void;
  onExportData: () => void;
  onImportData: (file: File) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  user,
  onSignOut,
  onShowSettings,
  onExportData,
  onImportData,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportData(file);
      setShowDropdown(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-medium hidden md:block">
          {user.email?.split('@')[0] || 'User'}
        </span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 top-12 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{user.email}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Signed in</p>
          </div>
          
          <div className="py-2">
            <button
              onClick={() => {
                onShowSettings();
                setShowDropdown(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
            
            <button
              onClick={() => {
                onExportData();
                setShowDropdown(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3"
            >
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </button>
            
            <label className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Import Data</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
            </label>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 py-2">
            <button
              onClick={() => {
                onSignOut();
                setShowDropdown(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-3"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;