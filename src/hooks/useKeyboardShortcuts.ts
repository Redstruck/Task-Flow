import { useEffect } from 'react';

interface KeyboardShortcutsConfig {
  onSearch: () => void;
  onNewTask: () => void;
  onNewList: () => void;
  onShowShortcuts: () => void;
  onSelectAll: () => void;
  onMarkAllComplete: () => void;
  onEscape: () => void;
  enabled?: boolean; // Add enabled parameter
}

export const useKeyboardShortcuts = (config: KeyboardShortcutsConfig) => {
  useEffect(() => {
    // If shortcuts are disabled, don't set up any listeners
    if (config.enabled === false) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        if (e.key === 'Escape') {
          (e.target as HTMLElement).blur();
          config.onEscape();
        }
        return;
      }

      const isCmd = e.metaKey || e.ctrlKey;

      if (isCmd) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            config.onSearch();
            break;
          case 'n':
            e.preventDefault();
            config.onNewTask();
            break;
          case 'l':
            e.preventDefault();
            config.onNewList();
            break;
          case '/':
            e.preventDefault();
            config.onShowShortcuts();
            break;
          case 'a':
            e.preventDefault();
            config.onSelectAll();
            break;
        }

        if (e.shiftKey && e.key === 'C') {
          e.preventDefault();
          config.onMarkAllComplete();
        }
      }

      if (e.key === 'Escape') {
        config.onEscape();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [config]);
};