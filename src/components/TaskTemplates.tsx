import React, { useState } from 'react';
import { BookTemplate as Template, Plus, X, Clock, Star } from 'lucide-react';
import { TaskTemplate, Task } from '../types';

interface TaskTemplatesProps {
  templates: TaskTemplate[];
  onCreateTemplate: (template: Omit<TaskTemplate, 'id' | 'createdAt'>) => void;
  onUseTemplate: (template: TaskTemplate) => void;
  onDeleteTemplate: (templateId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const TaskTemplates: React.FC<TaskTemplatesProps> = ({
  templates,
  onCreateTemplate,
  onUseTemplate,
  onDeleteTemplate,
  isOpen,
  onClose,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    estimatedTime: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.title.trim()) {
      onCreateTemplate({
        name: formData.name.trim(),
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        priority: formData.priority,
        estimatedTime: formData.estimatedTime ? parseInt(formData.estimatedTime) : undefined,
        subtasks: [],
      });
      setFormData({
        name: '',
        title: '',
        description: '',
        priority: 'medium',
        estimatedTime: '',
      });
      setShowCreateForm(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 w-full max-w-4xl max-h-[80vh] overflow-hidden animate-in slide-in-from-top-2 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
              <Template className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Task Templates</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm font-medium flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Template</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          {showCreateForm && (
            <div className="mb-6 p-6 bg-purple-50/50 rounded-2xl border border-purple-200/50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Template</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Weekly Review"
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/70"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Review weekly goals"
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/70"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Template description..."
                    rows={3}
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/70 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/70"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Time (min)</label>
                    <input
                      type="number"
                      value={formData.estimatedTime}
                      onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                      placeholder="30"
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/70"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Create Template
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className="p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-purple-500" />
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  </div>
                  <button
                    onClick={() => onDeleteTemplate(template.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>

                <p className="text-sm text-gray-700 mb-3">{template.title}</p>
                
                {template.description && (
                  <p className="text-xs text-gray-500 mb-3">{template.description}</p>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      template.priority === 'high' ? 'bg-red-100 text-red-800' :
                      template.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {template.priority}
                    </span>
                    {template.estimatedTime && (
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{template.estimatedTime}m</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onUseTemplate(template)}
                  className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm font-medium"
                >
                  Use Template
                </button>
              </div>
            ))}
          </div>

          {templates.length === 0 && !showCreateForm && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Template className="w-8 h-8 text-purple-400" />
              </div>
              <p className="text-gray-500 text-sm font-medium">No templates yet</p>
              <p className="text-gray-400 text-xs mt-1">Create your first template to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskTemplates;