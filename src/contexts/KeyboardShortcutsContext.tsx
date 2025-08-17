import React, { createContext, useContext, ReactNode } from 'react';
import { AppSettings } from '../types';

interface KeyboardShortcutsContextType {
  enabled: boolean;
}

const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextType>({
  enabled: true,
});

interface KeyboardShortcutsProviderProps {
  children: ReactNode;
  settings: AppSettings;
}

export const KeyboardShortcutsProvider: React.FC<KeyboardShortcutsProviderProps> = ({
  children,
  settings,
}) => {
  return (
    <KeyboardShortcutsContext.Provider value={{ enabled: settings.keyboardShortcuts }}>
      {children}
    </KeyboardShortcutsContext.Provider>
  );
};

export const useKeyboardShortcutsContext = () => {
  return useContext(KeyboardShortcutsContext);
};
