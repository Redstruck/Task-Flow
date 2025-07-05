import React, { useState } from 'react';
import { Settings as SettingsIcon, X, Bell, Keyboard, Palette, Clock, Globe, Download, Upload, Trash2, Moon, Sun, Monitor, Focus, Shield, Zap, Info, AlertCircle, CheckCircle, Target } from 'lucide-react';
import { AppSettings, NotificationSettings, ProductivitySettings } from '../types';

interface SettingsProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onExportData: () => void;
  onImportData: (file: File) => void;
  onClearData: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({
  settings,
  onUpdateSettings,
  onExportData,
  onImportData,
  onClearData,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'productivity' | 'security' | 'data'>('general');

  if (!isOpen) return null;

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'productivity', label: 'Productivity', icon: Focus },
    { id: 'security', label: 'Security', icon: Shield },
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

  const updateProductivity = (updates: Partial<ProductivitySettings>) => {
    const newSettings = {
      ...settings,
      productivity: { ...settings.productivity, ...updates }
    };
    onUpdateSettings(newSettings);
  };

  const ToggleSwitch = ({ checked, onChange, label, description }: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    description: string;
  }) => (
    <div className="flex items-center justify-between p-5 bg-white/60 dark:bg-gray-800/40 rounded-xl border border-gray-200/60 dark:border-gray-700/40 hover:bg-white/80 dark:hover:bg-gray-800/60 transition-all duration-300 hover:shadow-md hover:border-gray-300/60 dark:hover:border-gray-600/60">
      <div className="flex-1 pr-4">
        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">{label}</h4>
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
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
    <div className="bg-white/70 dark:bg-gray-800/50 rounded-2xl border border-gray-200/50 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/30 bg-gradient-to-r from-gray-50/50 to-white/50 dark:from-gray-800/30 dark:to-gray-700/30">
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
            <div className="text-sm text-gray-700 dark:text-gray-300">
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
      primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl',
      secondary: 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600',
      danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl',
    };

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]}`}
      >
        <Icon className="w-4 h-4" />
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
                : 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
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
      <SettingsCard title="Appearance" icon={Palette}>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Theme Preference</label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'light', label: 'Light', icon: Sun, desc: 'Clean and bright' },
                { value: 'dark', label: 'Dark', icon: Moon, desc: 'Easy on the eyes' },
                { value: 'auto', label: 'Auto', icon: Monitor, desc: 'Follows system' }
              ].map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => updateSettings({ theme: theme.value as AppSettings['theme'] })}
                  className={`group flex flex-col items-center space-y-3 px-4 py-6 text-sm font-medium rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                    settings.theme === theme.value
                      ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-600 shadow-lg ring-2 ring-blue-500/20'
                      : 'text-gray-600 dark:text-gray-300 bg-white/50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className={`p-3 rounded-full transition-all duration-300 ${
                    settings.theme === theme.value 
                      ? 'bg-blue-100 dark:bg-blue-800/50' 
                      : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
                  }`}>
                    <theme.icon className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{theme.label}</div>
                    <div className="text-xs opacity-75 mt-1">{theme.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Task Defaults" icon={Target}>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Default Priority Level
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
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

      <SettingsCard title="Working Hours" icon={Clock}>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Start Time</label>
              <input
                type="time"
                value={settings.workingHours.start}
                onChange={(e) => updateSettings({
                  workingHours: { ...settings.workingHours, start: e.target.value }
                })}
                className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 transition-all duration-200 shadow-sm hover:shadow-md"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">End Time</label>
              <input
                type="time"
                value={settings.workingHours.end}
                onChange={(e) => updateSettings({
                  workingHours: { ...settings.workingHours, end: e.target.value }
                })}
                className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 transition-all duration-200 shadow-sm hover:shadow-md"
              />
            </div>
          </div>
          <InfoBox type="info" title="Productivity Tracking">
            These hours are used for productivity analytics and smart notifications
          </InfoBox>
        </div>
      </SettingsCard>

      <SettingsCard title="Preferences" icon={Globe}>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Time Format</label>
              <div className="flex space-x-3">
                {(['12h', '24h'] as const).map((format) => (
                  <button
                    key={format}
                    onClick={() => updateSettings({ timeFormat: format })}
                    className={`flex-1 px-4 py-3 text-sm font-medium rounded-xl border transition-all duration-200 ${
                      settings.timeFormat === format
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700 shadow-md'
                        : 'text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Week Starts On</label>
              <div className="flex space-x-3">
                {(['monday', 'sunday'] as const).map((day) => (
                  <button
                    key={day}
                    onClick={() => updateSettings({ weekStart: day })}
                    className={`flex-1 px-4 py-3 text-sm font-medium rounded-xl border transition-all duration-200 ${
                      settings.weekStart === day
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700 shadow-md'
                        : 'text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
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
                checked={settings.notifications.email}
                onChange={(checked) => updateNotifications({ email: checked })}
                label="Email Notifications"
                description="Receive important updates via email"
              />

              <ToggleSwitch
                checked={settings.notifications.dueDateReminders}
                onChange={(checked) => updateNotifications({ dueDateReminders: checked })}
                label="Due Date Reminders"
                description="Get notified about upcoming task deadlines"
              />

              <ToggleSwitch
                checked={settings.notifications.dailyDigest}
                onChange={(checked) => updateNotifications({ dailyDigest: checked })}
                label="Daily Digest"
                description="Receive a daily summary of your tasks and progress"
              />
            </div>
          </SettingsCard>

          <SettingsCard title="Timing & Schedule" icon={Clock}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Daily Reminder Time</label>
              <input
                type="time"
                value={settings.notifications.reminderTime}
                onChange={(e) => updateNotifications({ reminderTime: e.target.value })}
                className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 transition-all duration-200 shadow-sm hover:shadow-md"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Time for daily digest and reminder notifications
              </p>
            </div>
          </SettingsCard>
        </>
      )}
    </div>
  );

  const ProductivitySettings = () => (
    <div className="space-y-8 settings-content">
      <SettingsCard title="Focus & Productivity" icon={Focus}>
        <div className="space-y-4">
          <ToggleSwitch
            checked={settings.productivity.focusMode}
            onChange={(checked) => updateProductivity({ focusMode: checked })}
            label="Focus Mode"
            description="Reduce visual distractions and enhance concentration"
          />

          <ToggleSwitch
            checked={settings.productivity.timeBlocking}
            onChange={(checked) => updateProductivity({ timeBlocking: checked })}
            label="Time Blocking"
            description="Schedule tasks in dedicated time blocks for better planning"
          />

          <ToggleSwitch
            checked={settings.productivity.deepWorkSessions}
            onChange={(checked) => updateProductivity({ deepWorkSessions: checked })}
            label="Deep Work Sessions"
            description="Track and optimize periods of focused, uninterrupted work"
          />
        </div>
      </SettingsCard>

      <SettingsCard title="Productivity Goals" icon={Zap}>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Daily Tasks Target</label>
            <input
              type="number"
              min="1"
              max="50"
              value={settings.productivity.productivityGoals.dailyTasks}
              onChange={(e) => updateProductivity({
                productivityGoals: {
                  ...settings.productivity.productivityGoals,
                  dailyTasks: parseInt(e.target.value) || 5
                }
              })}
              className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 transition-all duration-200 shadow-sm hover:shadow-md"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Weekly Hours Goal</label>
            <input
              type="number"
              min="1"
              max="168"
              value={settings.productivity.productivityGoals.weeklyHours}
              onChange={(e) => updateProductivity({
                productivityGoals: {
                  ...settings.productivity.productivityGoals,
                  weeklyHours: parseInt(e.target.value) || 40
                }
              })}
              className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 transition-all duration-200 shadow-sm hover:shadow-md"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Focus Hours/Day</label>
            <input
              type="number"
              min="1"
              max="12"
              value={settings.productivity.productivityGoals.focusHours}
              onChange={(e) => updateProductivity({
                productivityGoals: {
                  ...settings.productivity.productivityGoals,
                  focusHours: parseInt(e.target.value) || 4
                }
              })}
              className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 transition-all duration-200 shadow-sm hover:shadow-md"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Learning Hours/Week</label>
            <input
              type="number"
              min="0"
              max="40"
              value={settings.productivity.productivityGoals.learningHours}
              onChange={(e) => updateProductivity({
                productivityGoals: {
                  ...settings.productivity.productivityGoals,
                  learningHours: parseInt(e.target.value) || 2
                }
              })}
              className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 transition-all duration-200 shadow-sm hover:shadow-md"
            />
          </div>
        </div>
      </SettingsCard>
    </div>
  );

  const SecuritySettings = () => (
    <div className="space-y-8 settings-content">
      <SettingsCard title="Data Protection" icon={Shield}>
        <div className="space-y-4">
          <ToggleSwitch
            checked={settings.security.dataEncryption}
            onChange={(checked) => updateSettings({
              security: { ...settings.security, dataEncryption: checked }
            })}
            label="Data Encryption"
            description="Encrypt sensitive data stored locally for enhanced security"
          />

          <ToggleSwitch
            checked={settings.security.auditLogging}
            onChange={(checked) => updateSettings({
              security: { ...settings.security, auditLogging: checked }
            })}
            label="Audit Logging"
            description="Keep detailed logs of all actions for security monitoring"
          />
        </div>
      </SettingsCard>

      <SettingsCard title="Session Management" icon={Clock}>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Session Timeout</label>
          <select
            value={settings.security.sessionTimeout}
            onChange={(e) => updateSettings({
              security: { ...settings.security, sessionTimeout: parseInt(e.target.value) }
            })}
            className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <option value={30}>30 minutes</option>
            <option value={60}>1 hour</option>
            <option value={120}>2 hours</option>
            <option value={240}>4 hours</option>
            <option value={480}>8 hours</option>
            <option value={1440}>24 hours</option>
          </select>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Automatically log out after this period of inactivity
          </p>
        </div>
      </SettingsCard>

      <SettingsCard title="Password Policy" icon={Shield}>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Minimum Length</label>
            <input
              type="number"
              min="4"
              max="32"
              value={settings.security.passwordPolicy.minLength}
              onChange={(e) => updateSettings({
                security: {
                  ...settings.security,
                  passwordPolicy: {
                    ...settings.security.passwordPolicy,
                    minLength: parseInt(e.target.value) || 8
                  }
                }
              })}
              className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 transition-all duration-200 shadow-sm hover:shadow-md"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <ToggleSwitch
              checked={settings.security.passwordPolicy.requireUppercase}
              onChange={(checked) => updateSettings({
                security: {
                  ...settings.security,
                  passwordPolicy: {
                    ...settings.security.passwordPolicy,
                    requireUppercase: checked
                  }
                }
              })}
              label="Require Uppercase"
              description="Must include capital letters"
            />
            
            <ToggleSwitch
              checked={settings.security.passwordPolicy.requireNumbers}
              onChange={(checked) => updateSettings({
                security: {
                  ...settings.security,
                  passwordPolicy: {
                    ...settings.security.passwordPolicy,
                    requireNumbers: checked
                  }
                }
              })}
              label="Require Numbers"
              description="Must include numeric digits"
            />
          </div>
        </div>
      </SettingsCard>
    </div>
  );

  const DataSettings = () => (
    <div className="space-y-8 settings-content">
      <SettingsCard title="Export & Backup" icon={Download}>
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Export Your Data</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Download all your data including tasks, lists, and settings in JSON format</p>
            <ActionButton onClick={onExportData} variant="primary" icon={Download}>
              Export Data
            </ActionButton>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Import Data</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Import data from a previous export or backup file</p>
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
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Clear All Data</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Permanently delete all tasks, lists, and settings. This action cannot be undone.</p>
          <ActionButton onClick={onClearData} variant="danger" icon={Trash2}>
            Clear All Data
          </ActionButton>
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
            <span>Data encryption:</span>
            <span className={settings.security.dataEncryption ? 'text-green-600 dark:text-green-400 font-medium' : 'text-red-600 dark:text-red-400 font-medium'}>
              {settings.security.dataEncryption ? 'Enabled' : 'Disabled'}
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 modal-backdrop">
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 w-full max-w-6xl max-h-[90vh] overflow-hidden animate-in slide-in-from-top-2 duration-300 settings-modal">
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-gray-600 to-gray-700 dark:from-gray-500 dark:to-gray-600 rounded-xl shadow-lg">
              <SettingsIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Settings</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Customize your TaskFlow experience</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Enhanced Sidebar */}
          <div className="w-72 bg-gradient-to-b from-gray-50/80 to-white/80 dark:from-gray-800/50 dark:to-gray-900/50 border-r border-gray-200/50 dark:border-gray-700/50 p-6 settings-sidebar overflow-y-auto">
            <nav className="space-y-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center space-x-4 px-5 py-4 text-sm font-medium rounded-xl transition-all duration-300 group ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 tab-active transform scale-105'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-700/50 hover:shadow-md tab-inactive'
                  }`}
                >
                  <div className={`p-2 rounded-lg transition-all duration-300 ${
                    activeTab === tab.id 
                      ? 'bg-white/20' 
                      : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
                  }`}>
                    <tab.icon className="w-4 h-4" />
                  </div>
                  <span className="font-semibold">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Enhanced Content */}
          <div className="flex-1 p-8 overflow-y-auto settings-panel bg-gradient-to-br from-gray-50/30 to-white/30 dark:from-gray-900/30 dark:to-gray-800/30">
            <div className="settings-content-wrapper">
              {activeTab === 'general' && <GeneralSettings />}
              {activeTab === 'notifications' && <NotificationSettings />}
              {activeTab === 'productivity' && <ProductivitySettings />}
              {activeTab === 'security' && <SecuritySettings />}
              {activeTab === 'data' && <DataSettings />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;