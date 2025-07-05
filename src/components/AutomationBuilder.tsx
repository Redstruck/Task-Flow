import React, { useState } from 'react';
import { Zap, Plus, X, Play, Pause, Settings, ChevronDown, ChevronRight } from 'lucide-react';
import { AutomationRule, AutomationTrigger, AutomationCondition, AutomationAction } from '../types';

interface AutomationBuilderProps {
  rules: AutomationRule[];
  onCreateRule: (rule: Omit<AutomationRule, 'id' | 'createdAt'>) => void;
  onUpdateRule: (ruleId: string, updates: Partial<AutomationRule>) => void;
  onDeleteRule: (ruleId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const AutomationBuilder: React.FC<AutomationBuilderProps> = ({
  rules,
  onCreateRule,
  onUpdateRule,
  onDeleteRule,
  isOpen,
  onClose,
}) => {
  const [showBuilder, setShowBuilder] = useState(false);
  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set());
  const [newRule, setNewRule] = useState<Omit<AutomationRule, 'id' | 'createdAt'>>({
    name: '',
    trigger: { type: 'task_created' },
    conditions: [],
    actions: [],
    enabled: true,
  });

  const triggerTypes = [
    { value: 'task_created', label: 'Task Created' },
    { value: 'task_completed', label: 'Task Completed' },
    { value: 'due_date_approaching', label: 'Due Date Approaching' },
    { value: 'status_changed', label: 'Status Changed' },
    { value: 'time_tracked', label: 'Time Tracked' },
  ];

  const conditionFields = [
    { value: 'priority', label: 'Priority' },
    { value: 'assignee', label: 'Assignee' },
    { value: 'tags', label: 'Tags' },
    { value: 'dueDate', label: 'Due Date' },
    { value: 'estimatedTime', label: 'Estimated Time' },
  ];

  const operators = [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
  ];

  const actionTypes = [
    { value: 'set_priority', label: 'Set Priority' },
    { value: 'assign_to', label: 'Assign To' },
    { value: 'add_tag', label: 'Add Tag' },
    { value: 'send_notification', label: 'Send Notification' },
    { value: 'create_subtask', label: 'Create Subtask' },
    { value: 'move_to_list', label: 'Move to List' },
  ];

  const addCondition = () => {
    setNewRule(prev => ({
      ...prev,
      conditions: [...prev.conditions, { field: 'priority', operator: 'equals', value: '' }]
    }));
  };

  const addAction = () => {
    setNewRule(prev => ({
      ...prev,
      actions: [...prev.actions, { type: 'set_priority', parameters: {} }]
    }));
  };

  const updateCondition = (index: number, updates: Partial<AutomationCondition>) => {
    setNewRule(prev => ({
      ...prev,
      conditions: prev.conditions.map((condition, i) => 
        i === index ? { ...condition, ...updates } : condition
      )
    }));
  };

  const updateAction = (index: number, updates: Partial<AutomationAction>) => {
    setNewRule(prev => ({
      ...prev,
      actions: prev.actions.map((action, i) => 
        i === index ? { ...action, ...updates } : action
      )
    }));
  };

  const removeCondition = (index: number) => {
    setNewRule(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };

  const removeAction = (index: number) => {
    setNewRule(prev => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index)
    }));
  };

  const handleCreateRule = () => {
    if (newRule.name && newRule.actions.length > 0) {
      onCreateRule(newRule);
      setNewRule({
        name: '',
        trigger: { type: 'task_created' },
        conditions: [],
        actions: [],
        enabled: true,
      });
      setShowBuilder(false);
    }
  };

  const toggleRuleExpansion = (ruleId: string) => {
    setExpandedRules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(ruleId)) {
        newSet.delete(ruleId);
      } else {
        newSet.add(ruleId);
      }
      return newSet;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 w-full max-w-6xl max-h-[90vh] overflow-hidden animate-in slide-in-from-top-2 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Automation Builder</h2>
              <p className="text-sm text-gray-600">Create smart workflows to automate your tasks</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowBuilder(true)}
              className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm font-medium flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Rule</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Rule Builder */}
          {showBuilder && (
            <div className="mb-8 p-6 bg-orange-50/50 rounded-2xl border border-orange-200/50">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Create New Automation Rule</h3>
              
              <div className="space-y-6">
                {/* Rule Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rule Name</label>
                  <input
                    type="text"
                    value={newRule.name}
                    onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Auto-assign high priority tasks"
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                  />
                </div>

                {/* Trigger */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">When (Trigger)</label>
                  <select
                    value={newRule.trigger.type}
                    onChange={(e) => setNewRule(prev => ({ 
                      ...prev, 
                      trigger: { type: e.target.value as AutomationTrigger['type'] }
                    }))}
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                  >
                    {triggerTypes.map(trigger => (
                      <option key={trigger.value} value={trigger.value}>{trigger.label}</option>
                    ))}
                  </select>
                </div>

                {/* Conditions */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">If (Conditions)</label>
                    <button
                      onClick={addCondition}
                      className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm font-medium flex items-center space-x-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Condition</span>
                    </button>
                  </div>
                  
                  {newRule.conditions.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No conditions (rule will apply to all triggers)</p>
                  ) : (
                    <div className="space-y-3">
                      {newRule.conditions.map((condition, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                          <select
                            value={condition.field}
                            onChange={(e) => updateCondition(index, { field: e.target.value })}
                            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white"
                          >
                            {conditionFields.map(field => (
                              <option key={field.value} value={field.value}>{field.label}</option>
                            ))}
                          </select>
                          
                          <select
                            value={condition.operator}
                            onChange={(e) => updateCondition(index, { operator: e.target.value as AutomationCondition['operator'] })}
                            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white"
                          >
                            {operators.map(op => (
                              <option key={op.value} value={op.value}>{op.label}</option>
                            ))}
                          </select>
                          
                          <input
                            type="text"
                            value={condition.value}
                            onChange={(e) => updateCondition(index, { value: e.target.value })}
                            placeholder="Value"
                            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white"
                          />
                          
                          <button
                            onClick={() => removeCondition(index)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">Then (Actions)</label>
                    <button
                      onClick={addAction}
                      className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm font-medium flex items-center space-x-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Action</span>
                    </button>
                  </div>
                  
                  {newRule.actions.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No actions defined</p>
                  ) : (
                    <div className="space-y-3">
                      {newRule.actions.map((action, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                          <select
                            value={action.type}
                            onChange={(e) => updateAction(index, { type: e.target.value as AutomationAction['type'] })}
                            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white"
                          >
                            {actionTypes.map(actionType => (
                              <option key={actionType.value} value={actionType.value}>{actionType.label}</option>
                            ))}
                          </select>
                          
                          <input
                            type="text"
                            placeholder="Parameters (JSON)"
                            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white"
                          />
                          
                          <button
                            onClick={() => removeAction(index)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowBuilder(false)}
                    className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateRule}
                    disabled={!newRule.name || newRule.actions.length === 0}
                    className="px-4 py-2 text-sm bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Create Rule
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Existing Rules */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Automation Rules ({rules.length})
            </h3>
            
            {rules.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-orange-400" />
                </div>
                <p className="text-gray-500 text-sm font-medium">No automation rules yet</p>
                <p className="text-gray-400 text-xs mt-1">Create your first rule to automate your workflow</p>
              </div>
            ) : (
              <div className="space-y-3">
                {rules.map((rule) => (
                  <div key={rule.id} className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-lg">
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => toggleRuleExpansion(rule.id)}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {expandedRules.has(rule.id) ? 
                              <ChevronDown className="w-4 h-4" /> : 
                              <ChevronRight className="w-4 h-4" />
                            }
                          </button>
                          <div className={`w-3 h-3 rounded-full ${rule.enabled ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <h4 className="font-medium text-gray-900">{rule.name}</h4>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onUpdateRule(rule.id, { enabled: !rule.enabled })}
                            className={`p-2 rounded-lg transition-colors ${
                              rule.enabled 
                                ? 'text-green-600 bg-green-50 hover:bg-green-100' 
                                : 'text-gray-400 bg-gray-50 hover:bg-gray-100'
                            }`}
                            title={rule.enabled ? 'Disable rule' : 'Enable rule'}
                          >
                            {rule.enabled ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </button>
                          <button
                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit rule"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteRule(rule.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete rule"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {expandedRules.has(rule.id) && (
                        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                          <div>
                            <span className="text-sm font-medium text-gray-700">Trigger: </span>
                            <span className="text-sm text-gray-600 capitalize">
                              {rule.trigger.type.replace('_', ' ')}
                            </span>
                          </div>
                          
                          {rule.conditions.length > 0 && (
                            <div>
                              <span className="text-sm font-medium text-gray-700">Conditions: </span>
                              <div className="mt-1 space-y-1">
                                {rule.conditions.map((condition, index) => (
                                  <div key={index} className="text-sm text-gray-600">
                                    {condition.field} {condition.operator} "{condition.value}"
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div>
                            <span className="text-sm font-medium text-gray-700">Actions: </span>
                            <div className="mt-1 space-y-1">
                              {rule.actions.map((action, index) => (
                                <div key={index} className="text-sm text-gray-600 capitalize">
                                  {action.type.replace('_', ' ')}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationBuilder;