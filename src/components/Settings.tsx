import React, { useState } from 'react';
import { Settings as SettingsIcon, X, Bell, Globe, Download, Upload, Trash2, Info, AlertCircle, CheckCircle, Target } from 'lucide-react';
import { AppSettings, NotificationSettings } from '../types';

interface SettingsProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onExportData: () => void;
  onImportData: (file: File) => void;
  onClearData: () => void;
  onDeleteAllCompletedTasks: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({
  settings,
  onUpdateSettings,
  onExportData,
  onImportData,
  onClearData,
  onDeleteAllCompletedTasks,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'data'>('general');

  if (!isOpen) return null;

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'data', label: 'Data', icon: Download },
  ];

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportData(file);
    }
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    const newSettings = { ...settings, ...updates };
    onUpdateSettings(newSettings);
  };

  const updateNotifications = (updates: Partial<NotificationSettings>) => {
    const newSettings = {
      ...settings,
      notifications: { ...settings.notifications, ...updates }
    };
    onUpdateSettings(newSettings);
  };



  const ToggleSwitch = ({ checked, onChange, label, description }: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    description: string;
  }) => (
    <div className="flex items-center justify-between p-5 bg-white/70 dark:bg-gray-800/60 rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/90 dark:hover:bg-gray-800/80 transition-all duration-300 hover:shadow-md hover:border-gray-300/60 dark:hover:border-gray-600/50">
      <div className="flex-1 pr-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">{label}</h4>
        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
          checked 
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30' 
            : 'bg-gray-300 dark:bg-gray-600 shadow-inner'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-all duration-300 shadow-lg ${
            checked ? 'translate-x-6 shadow-blue-200' : 'translate-x-1 shadow-gray-300'
          }`}
        />
      </button>
    </div>
  );

  const SettingsCard = ({ title, children, icon: Icon }: {
    title: string;
    children: React.ReactNode;
    icon?: React.ElementType;
  }) => (
    <div className="bg-white/80 dark:bg-gray-800/70 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/60 to-white/60 dark:from-gray-800/40 dark:to-gray-700/40">
        <div className="flex items-center space-x-3">
          {Icon && (
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-md">
              <Icon className="w-4 h-4 text-white" />
            </div>
          )}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );

  const InfoBox = ({ type, title, children }: {
    type: 'info' | 'warning' | 'success';
    title: string;
    children: React.ReactNode;
  }) => {
    const styles = {
      info: {
        bg: 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
        border: 'border-blue-200/60 dark:border-blue-700/40',
        icon: Info,
        iconColor: 'text-blue-600 dark:text-blue-400',
        titleColor: 'text-blue-900 dark:text-blue-200',
      },
      warning: {
        bg: 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20',
        border: 'border-yellow-200/60 dark:border-yellow-700/40',
        icon: AlertCircle,
        iconColor: 'text-yellow-600 dark:text-yellow-400',
        titleColor: 'text-yellow-900 dark:text-yellow-200',
      },
      success: {
        bg: 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
        border: 'border-green-200/60 dark:border-green-700/40',
        icon: CheckCircle,
        iconColor: 'text-green-600 dark:text-green-400',
        titleColor: 'text-green-900 dark:text-green-200',
      },
    };

    const style = styles[type];
    const IconComponent = style.icon;

    return (
      <div className={`p-5 rounded-xl border ${style.bg} ${style.border} shadow-sm`}>
        <div className="flex items-start space-x-3">
          <IconComponent className={`w-5 h-5 mt-0.5 ${style.iconColor}`} />
          <div className="flex-1">
            <h4 className={`text-sm font-semibold mb-2 ${style.titleColor}`}>{title}</h4>
            <div className="text-sm text-gray-700 dark:text-gray-200">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ActionButton = ({ 
    onClick, 
    variant = 'primary', 
    icon: Icon, 
    children, 
    disabled = false 
  }: {
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    icon: React.ElementType;
    children: React.ReactNode;
    disabled?: boolean;
  }) => {
    const variants = {
      primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:scale-105',
      secondary: 'bg-gray-100 dark:bg-gray-700/80 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:shadow-md hover:scale-105 hover:border-gray-400 dark:hover:border-gray-500',
      danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl hover:scale-105',
    };

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`group px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0 ${variants[variant]}`}
      >
        <Icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
        <span>{children}</span>
      </button>
    );
  };

  const PrioritySelector = ({ value, onChange }: {
    value: 'low' | 'medium' | 'high';
    onChange: (priority: 'low' | 'medium' | 'high') => void;
  }) => {
    const priorities = [
      { 
        value: 'low', 
        label: 'Low Priority', 
        color: 'from-green-500 to-emerald-500',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        borderColor: 'border-green-200 dark:border-green-700',
        textColor: 'text-green-800 dark:text-green-200',
        description: 'For tasks that can wait'
      },
      { 
        value: 'medium', 
        label: 'Medium Priority', 
        color: 'from-yellow-500 to-orange-500',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        borderColor: 'border-yellow-200 dark:border-yellow-700',
        textColor: 'text-yellow-800 dark:text-yellow-200',
        description: 'Standard importance level'
      },
      { 
        value: 'high', 
        label: 'High Priority', 
        color: 'from-red-500 to-pink-500',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-700',
        textColor: 'text-red-800 dark:text-red-200',
        description: 'Urgent and important tasks'
      }
    ];

    return (
      <div className="grid grid-cols-1 gap-3">
        {priorities.map((priority) => (
          <button
            key={priority.value}
            onClick={() => onChange(priority.value as 'low' | 'medium' | 'high')}
            className={`group relative p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
              value === priority.value
                ? `${priority.bgColor} ${priority.borderColor} shadow-md ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-blue-500/50`
                : 'bg-white dark:bg-gray-800/70 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600/80 hover:bg-gray-50 dark:hover:bg-gray-800/90'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${priority.color} flex items-center justify-center shadow-lg transition-transform duration-300 ${
                value === priority.value ? 'scale-110' : 'group-hover:scale-105'
              }`}>
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h4 className={`font-semibold text-base mb-1 transition-colors ${
                  value === priority.value ? priority.textColor : 'text-gray-900 dark:text-gray-100'
                }`}>
                  {priority.label}
                </h4>
                <p className={`text-sm transition-colors ${
                  value === priority.value ? priority.textColor.replace('800', '700').replace('200', '300') : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {priority.description}
                </p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                value === priority.value
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300 dark:border-gray-600 group-hover:border-blue-400'
              }`}>
                {value === priority.value && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    );
  };

  const GeneralSettings = () => (
    <div className="space-y-8 settings-content">
      <SettingsCard title="Task Defaults" icon={Target}>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Default Priority Level
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              New tasks will automatically use this priority level unless specified otherwise
            </p>
            <PrioritySelector
              value={settings.defaultPriority}
              onChange={(priority) => updateSettings({ defaultPriority: priority })}
            />
          </div>
          
          <InfoBox type="info" title="Smart Defaults">
            This setting helps you maintain consistency in your task management. You can always change the priority when creating individual tasks.
          </InfoBox>
        </div>
      </SettingsCard>

      <SettingsCard title="Preferences" icon={Globe}>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">Time Format</label>
              <div className="flex space-x-3">
                {(['12h', '24h'] as const).map((format) => (
                  <button
                    key={format}
                    onClick={() => updateSettings({ timeFormat: format })}
                    className={`flex-1 px-4 py-3 text-sm font-medium rounded-xl border transition-all duration-200 ${
                      settings.timeFormat === format
                        ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-100 border-blue-200 dark:border-blue-600/60 shadow-md'
                        : 'text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800/60 border-gray-200 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-700/70 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">Week Starts On</label>
              <div className="flex space-x-3">
                {(['monday', 'sunday'] as const).map((day) => (
                  <button
                    key={day}
                    onClick={() => updateSettings({ weekStart: day })}
                    className={`flex-1 px-4 py-3 text-sm font-medium rounded-xl border transition-all duration-200 ${
                      settings.weekStart === day
                        ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-100 border-blue-200 dark:border-blue-600/60 shadow-md'
                        : 'text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800/60 border-gray-200 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-700/70 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <ToggleSwitch
              checked={settings.autoSave}
              onChange={(checked) => updateSettings({ autoSave: checked })}
              label="Auto Save"
              description="Automatically save changes every 30 seconds"
            />

            <ToggleSwitch
              checked={settings.keyboardShortcuts}
              onChange={(checked) => updateSettings({ keyboardShortcuts: checked })}
              label="Keyboard Shortcuts"
              description="Enable keyboard shortcuts for faster navigation"
            />
          </div>
        </div>
      </SettingsCard>
    </div>
  );

  const NotificationSettings = () => (
    <div className="space-y-8 settings-content">
      <SettingsCard title="Master Control" icon={Bell}>
        <InfoBox type="warning" title="Notification Master Switch">
          Disabling this will turn off all notifications across the application
        </InfoBox>
        <div className="mt-6">
          <ToggleSwitch
            checked={settings.notifications.enabled}
            onChange={(checked) => updateNotifications({ enabled: checked })}
            label="Enable All Notifications"
            description="Master switch for all notification types"
          />
        </div>
      </SettingsCard>

      {settings.notifications.enabled && (
        <>
          <SettingsCard title="Notification Types" icon={Bell}>
            <div className="space-y-4">
              <ToggleSwitch
                checked={settings.notifications.push}
                onChange={(checked) => updateNotifications({ push: checked })}
                label="Browser Notifications"
                description="Show desktop notifications in your browser"
              />

              <ToggleSwitch
                checked={settings.notifications.dueDateReminders}
                onChange={(checked) => updateNotifications({ dueDateReminders: checked })}
                label="Due Date Reminders"
                description="Get notified about upcoming task deadlines"
              />
            </div>
          </SettingsCard>
        </>
      )}
    </div>
  );





  const DataSettings = () => (
    <div className="space-y-8 settings-content">
      <SettingsCard title="Export & Backup" icon={Download}>
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">Export Your Data</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Download all your data including tasks, lists, and settings in JSON format</p>
            <ActionButton onClick={onExportData} variant="primary" icon={Download}>
              Export Data
            </ActionButton>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">Import Data</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Import data from a previous export or backup file</p>
            <label>
              <ActionButton onClick={() => {}} variant="secondary" icon={Upload}>
                Import Data
              </ActionButton>
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Data Management" icon={Trash2}>
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">Delete Completed Tasks</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Remove all completed tasks from all lists. This helps keep your workspace clean and focused.</p>
            <ActionButton onClick={onDeleteAllCompletedTasks} variant="secondary" icon={Trash2}>
              Delete All Completed Tasks
            </ActionButton>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">Clear All Data</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Permanently delete all tasks, lists, and settings. This action cannot be undone.</p>
            <ActionButton onClick={onClearData} variant="danger" icon={Trash2}>
              Clear All Data
            </ActionButton>
          </div>
        </div>
      </SettingsCard>

      <InfoBox type="success" title="Storage Information">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Auto-save:</span>
            <span className={settings.autoSave ? 'text-green-600 dark:text-green-400 font-medium' : 'text-red-600 dark:text-red-400 font-medium'}>
              {settings.autoSave ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Storage type:</span>
            <span className="font-medium">Local Browser Storage</span>
          </div>
        </div>
      </InfoBox>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 modal-backdrop">
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 w-full max-w-6xl max-h-[90vh] overflow-hidden animate-in slide-in-from-top-2 duration-300 settings-modal">
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-gray-600 to-gray-700 dark:from-gray-500 dark:to-gray-600 rounded-xl shadow-lg">
              <SettingsIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Settings</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">Customize your TaskFlow experience</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/70 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Enhanced Sidebar */}
          <div className="w-72 bg-gradient-to-b from-gray-50/90 to-white/90 dark:from-gray-800/70 dark:to-gray-900/70 p-6 settings-sidebar overflow-y-auto">
            <nav className="space-y-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center space-x-4 px-5 py-4 text-sm font-medium rounded-xl transition-all duration-300 group ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 tab-active transform scale-105'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-white/70 dark:hover:bg-gray-700/60 hover:shadow-md tab-inactive hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <div className={`p-2 rounded-lg transition-all duration-300 ${
                    activeTab === tab.id 
                      ? 'bg-white/20' 
                      : 'bg-gray-100 dark:bg-gray-700/80 group-hover:bg-gray-200 dark:group-hover:bg-gray-600/80'
                  }`}>
                    <tab.icon className="w-4 h-4" />
                  </div>
                  <span className="font-semibold">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Enhanced Content */}
          <div className="flex-1 p-8 overflow-y-auto settings-panel bg-gradient-to-br from-gray-50/40 to-white/40 dark:from-gray-900/40 dark:to-gray-800/40">
            <div className="settings-content-wrapper">
              {activeTab === 'general' && <GeneralSettings />}
              {activeTab === 'notifications' && <NotificationSettings />}
              {activeTab === 'data' && <DataSettings />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;