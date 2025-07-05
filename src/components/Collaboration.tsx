import React, { useState } from 'react';
import { Users, UserPlus, Mail, Crown, Shield, Edit3, Eye, X, Send } from 'lucide-react';
import { TodoList, Collaborator } from '../types';

interface CollaborationProps {
  list: TodoList;
  onUpdateList: (listId: string, updates: Partial<TodoList>) => void;
  onInviteCollaborator: (listId: string, email: string, role: Collaborator['role']) => void;
  onRemoveCollaborator: (listId: string, collaboratorId: string) => void;
  onUpdateCollaboratorRole: (listId: string, collaboratorId: string, role: Collaborator['role']) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Collaboration: React.FC<CollaborationProps> = ({
  list,
  onUpdateList,
  onInviteCollaborator,
  onRemoveCollaborator,
  onUpdateCollaboratorRole,
  isOpen,
  onClose,
}) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<Collaborator['role']>('editor');
  const [showInviteForm, setShowInviteForm] = useState(false);

  if (!isOpen) return null;

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteEmail.trim()) {
      onInviteCollaborator(list.id, inviteEmail.trim(), inviteRole);
      setInviteEmail('');
      setShowInviteForm(false);
    }
  };

  const roleIcons = {
    owner: Crown,
    admin: Shield,
    editor: Edit3,
    viewer: Eye,
  };

  const roleColors = {
    owner: 'text-yellow-600 bg-yellow-100',
    admin: 'text-purple-600 bg-purple-100',
    editor: 'text-blue-600 bg-blue-100',
    viewer: 'text-gray-600 bg-gray-100',
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 w-full max-w-2xl max-h-[80vh] overflow-hidden animate-in slide-in-from-top-2 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Collaboration</h2>
              <p className="text-sm text-gray-600">{list.title}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowInviteForm(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm font-medium flex items-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite</span>
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
          {/* Invite Form */}
          {showInviteForm && (
            <div className="mb-6 p-4 bg-blue-50/50 rounded-xl border border-blue-200/50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Invite Collaborator</h3>
              <form onSubmit={handleInvite} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@example.com"
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as Collaborator['role'])}
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="viewer">Viewer - Can view tasks</option>
                    <option value="editor">Editor - Can edit tasks</option>
                    <option value="admin">Admin - Can manage list and invite others</option>
                  </select>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowInviteForm(false)}
                    className="flex-1 px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Invite</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Collaborators List */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Collaborators ({list.collaborators?.length || 0})
            </h3>
            
            {list.collaborators && list.collaborators.length > 0 ? (
              <div className="space-y-3">
                {list.collaborators.map((collaborator) => {
                  const RoleIcon = roleIcons[collaborator.role];
                  return (
                    <div
                      key={collaborator.id}
                      className="flex items-center justify-between p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {collaborator.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{collaborator.name}</h4>
                          <p className="text-sm text-gray-600">{collaborator.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${roleColors[collaborator.role]}`}>
                          <RoleIcon className="w-3 h-3" />
                          <span>{collaborator.role}</span>
                        </div>
                        
                        {collaborator.role !== 'owner' && (
                          <div className="flex items-center space-x-1">
                            <select
                              value={collaborator.role}
                              onChange={(e) => onUpdateCollaboratorRole(list.id, collaborator.id, e.target.value as Collaborator['role'])}
                              className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                            >
                              <option value="viewer">Viewer</option>
                              <option value="editor">Editor</option>
                              <option value="admin">Admin</option>
                            </select>
                            <button
                              onClick={() => onRemoveCollaborator(list.id, collaborator.id)}
                              className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm font-medium">No collaborators yet</p>
                <p className="text-gray-400 text-xs mt-1">Invite team members to collaborate on this list</p>
              </div>
            )}
          </div>

          {/* Sharing Settings */}
          <div className="mt-8 p-4 bg-gray-50/50 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sharing Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Public Link</h4>
                  <p className="text-xs text-gray-500">Allow anyone with the link to view this list</p>
                </div>
                <button
                  onClick={() => onUpdateList(list.id, { shared: !list.shared })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    list.shared ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      list.shared ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              {list.shared && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <code className="text-xs text-blue-800 bg-blue-100 px-2 py-1 rounded">
                      https://taskflow.app/shared/{list.id}
                    </code>
                    <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                      Copy Link
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collaboration;