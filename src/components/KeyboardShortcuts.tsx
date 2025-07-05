import React, { useState, useEffect } from 'react';
import { Keyboard, X } from 'lucide-react';

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts = [
    { key: '⌘ + K', description: 'Open search' },
    { key: '⌘ + N', description: 'Create new task' },
    { key: '⌘ + L', description: 'Create new list' },
    { key: '⌘ + /', description: 'Show keyboard shortcuts' },
    { key: 'Escape', description: 'Close dialogs' },
    { key: '⌘ + Enter', description: 'Save task' },
    { key: '⌘ + D', description: 'Duplicate task' },
    { key: 'Delete', description: 'Delete selected task' },
    { key: '⌘ + A', description: 'Select all tasks' },
    { key: '⌘ + Shift + C', description: 'Mark all as complete' },
    { key: '1, 2, 3', description: 'Set priority (low, medium, high)' },
    { key: 'Space', description: 'Toggle task completion' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 w-full max-w-2xl max-h-[80vh] overflow-hidden animate-in slide-in-from-top-2 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
              <Keyboard className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50/70 rounded-xl hover:bg-gray-100/70 transition-colors"
              >
                <span className="text-sm text-gray-700">{shortcut.description}</span>
                <kbd className="px-3 py-1 text-xs font-mono bg-white border border-gray-300 rounded-lg shadow-sm">
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcuts;