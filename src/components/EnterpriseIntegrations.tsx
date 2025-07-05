import React, { useState } from 'react';
import { Plug, Check, X, Settings, RefreshCw, AlertCircle, ExternalLink } from 'lucide-react';
import { Integration } from '../types';

interface EnterpriseIntegrationsProps {
  integrations: Integration[];
  onToggleIntegration: (integrationId: string, enabled: boolean) => void;
  onConfigureIntegration: (integrationId: string, config: Record<string, any>) => void;
  onSyncIntegration: (integrationId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const EnterpriseIntegrations: React.FC<EnterpriseIntegrationsProps> = ({
  integrations,
  onToggleIntegration,
  onConfigureIntegration,
  onSyncIntegration,
  isOpen,
  onClose,
}) => {
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [configValues, setConfigValues] = useState<Record<string, any>>({});

  const availableIntegrations = [
    {
      type: 'slack',
      name: 'Slack',
      description: 'Send notifications and updates to Slack channels',
      icon: '💬',
      configFields: [
        { key: 'webhookUrl', label: 'Webhook URL', type: 'url', required: true },
        { key: 'channel', label: 'Default Channel', type: 'text', required: true },
        { key: 'username', label: 'Bot Username', type: 'text', required: false },
      ]
    },
    {
      type: 'discord',
      name: 'Discord',
      description: 'Post updates to Discord servers',
      icon: '🎮',
      configFields: [
        { key: 'webhookUrl', label: 'Webhook URL', type: 'url', required: true },
        { key: 'username', label: 'Bot Username', type: 'text', required: false },
      ]
    },
    {
      type: 'email',
      name: 'Email',
      description: 'Send email notifications and reports',
      icon: '📧',
      configFields: [
        { key: 'smtpHost', label: 'SMTP Host', type: 'text', required: true },
        { key: 'smtpPort', label: 'SMTP Port', type: 'number', required: true },
        { key: 'username', label: 'Username', type: 'text', required: true },
        { key: 'password', label: 'Password', type: 'password', required: true },
      ]
    },
    {
      type: 'calendar',
      name: 'Google Calendar',
      description: 'Sync tasks with Google Calendar',
      icon: '📅',
      configFields: [
        { key: 'clientId', label: 'Client ID', type: 'text', required: true },
        { key: 'clientSecret', label: 'Client Secret', type: 'password', required: true },
        { key: 'calendarId', label: 'Calendar ID', type: 'text', required: true },
      ]
    },
    {
      type: 'github',
      name: 'GitHub',
      description: 'Create issues and sync with repositories',
      icon: '🐙',
      configFields: [
        { key: 'token', label: 'Personal Access Token', type: 'password', required: true },
        { key: 'repository', label: 'Repository', type: 'text', required: true },
        { key: 'owner', label: 'Owner', type: 'text', required: true },
      ]
    },
    {
      type: 'jira',
      name: 'Jira',
      description: 'Sync with Jira issues and projects',
      icon: '🔷',
      configFields: [
        { key: 'baseUrl', label: 'Jira Base URL', type: 'url', required: true },
        { key: 'username', label: 'Username', type: 'text', required: true },
        { key: 'apiToken', label: 'API Token', type: 'password', required: true },
        { key: 'projectKey', label: 'Project Key', type: 'text', required: true },
      ]
    },
    {
      type: 'trello',
      name: 'Trello',
      description: 'Sync cards and boards with Trello',
      icon: '📋',
      configFields: [
        { key: 'apiKey', label: 'API Key', type: 'text', required: true },
        { key: 'token', label: 'Token', type: 'password', required: true },
        { key: 'boardId', label: 'Board ID', type: 'text', required: true },
      ]
    },
    {
      type: 'notion',
      name: 'Notion',
      description: 'Sync with Notion databases and pages',
      icon: '📝',
      configFields: [
        { key: 'token', label: 'Integration Token', type: 'password', required: true },
        { key: 'databaseId', label: 'Database ID', type: 'text', required: true },
      ]
    },
  ];

  const getIntegrationStatus = (type: string) => {
    const integration = integrations.find(i => i.type === type);
    return integration?.enabled ? 'connected' : integration ? 'configured' : 'available';
  };

  const handleConfigureIntegration = (integrationType: string) => {
    const integration = availableIntegrations.find(i => i.type === integrationType);
    if (integration) {
      setSelectedIntegration(integrations.find(i => i.type === integrationType) || {
        id: '',
        type: integrationType as any,
        name: integration.name,
        config: {},
        enabled: false,
      });
      setConfigValues(integrations.find(i => i.type === integrationType)?.config || {});
    }
  };

  const handleSaveConfiguration = () => {
    if (selectedIntegration) {
      onConfigureIntegration(selectedIntegration.id, configValues);
      setSelectedIntegration(null);
      setConfigValues({});
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 w-full max-w-6xl max-h-[90vh] overflow-hidden animate-in slide-in-from-top-2 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl">
              <Plug className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Enterprise Integrations</h2>
              <p className="text-sm text-gray-600">Connect with your favorite tools and services</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableIntegrations.map((integration) => {
              const status = getIntegrationStatus(integration.type);
              const connectedIntegration = integrations.find(i => i.type === integration.type);
              
              return (
                <div key={integration.type} className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{integration.icon}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                        <p className="text-sm text-gray-600">{integration.description}</p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                      status === 'connected' ? 'bg-green-100 text-green-800' :
                      status === 'configured' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {status === 'connected' ? 'Connected' :
                       status === 'configured' ? 'Configured' : 'Available'}
                    </div>
                  </div>

                  {connectedIntegration && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Last Sync:</span>
                        <span className="text-gray-900">
                          {connectedIntegration.lastSync 
                            ? new Date(connectedIntegration.lastSync).toLocaleString()
                            : 'Never'
                          }
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    {status === 'connected' && (
                      <>
                        <button
                          onClick={() => onToggleIntegration(connectedIntegration!.id, false)}
                          className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                        >
                          Disconnect
                        </button>
                        <button
                          onClick={() => onSyncIntegration(connectedIntegration!.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Sync now"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    
                    {status === 'configured' && (
                      <button
                        onClick={() => onToggleIntegration(connectedIntegration!.id, true)}
                        className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                      >
                        Connect
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleConfigureIntegration(integration.type)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Configure"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    
                    <button
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="View documentation"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Configuration Modal */}
        {selectedIntegration && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl max-h-[80vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Configure {selectedIntegration.name}
                </h3>
                <button
                  onClick={() => setSelectedIntegration(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
                <div className="space-y-4">
                  {availableIntegrations
                    .find(i => i.type === selectedIntegration.type)
                    ?.configFields.map((field) => (
                      <div key={field.key}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <input
                          type={field.type}
                          value={configValues[field.key] || ''}
                          onChange={(e) => setConfigValues(prev => ({
                            ...prev,
                            [field.key]: e.target.value
                          }))}
                          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                          required={field.required}
                        />
                      </div>
                    ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900">Security Note</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Your credentials are encrypted and stored securely. We never share your data with third parties.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
                <button
                  onClick={() => setSelectedIntegration(null)}
                  className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveConfiguration}
                  className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnterpriseIntegrations;