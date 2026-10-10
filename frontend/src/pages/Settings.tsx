import { useState } from 'react';
import {
  User,
  Building2,
  Bot,
  Database,
  Bell,
  Users,
  CreditCard,
  Save,
  Globe,
} from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'company', label: 'Company', icon: Building2 },
    { id: 'ai', label: 'AI Assistant', icon: Bot },
    { id: 'kb', label: 'Knowledge Base', icon: Database },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <div className="max-w-5xl">
      <div>
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <p className="text-surface-400 text-sm mt-1">
          Manage your account, team, and AI configurations.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mt-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-4 md:pb-0 hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-primary-500/10 text-primary-400'
                    : 'text-surface-400 hover:bg-white/5 hover:text-surface-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-fade-in">
              <div className="glass p-6 rounded-2xl">
                <h3 className="text-lg font-semibold text-white mb-6">Personal Information</h3>
                
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                    H
                  </div>
                  <div>
                    <button className="btn btn-secondary btn-sm mb-2">Change Avatar</button>
                    <p className="text-xs text-surface-500">JPG, GIF or PNG. Max size of 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-2">Full Name</label>
                    <input type="text" defaultValue="Harsh Sangwan" className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-2">Email Address</label>
                    <input type="email" defaultValue="harsh@example.com" className="input" disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-2">Job Title</label>
                    <input type="text" defaultValue="Administrator" className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-2">Timezone</label>
                    <select className="input">
                      <option>Asia/Kolkata (IST)</option>
                      <option>America/New_York (EST)</option>
                      <option>Europe/London (GMT)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end mt-8 pt-6 border-t border-white/5">
                  <button className="btn btn-primary">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>

              <div className="glass p-6 rounded-2xl">
                <h3 className="text-lg font-semibold text-white mb-6">Security</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-white">Password</h4>
                      <p className="text-xs text-surface-500 mt-1">Last changed 3 months ago</p>
                    </div>
                    <button className="btn btn-secondary btn-sm">Change Password</button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-white">Two-Factor Authentication</h4>
                      <p className="text-xs text-surface-500 mt-1">Add an extra layer of security to your account</p>
                    </div>
                    <button className="btn btn-secondary btn-sm">Enable 2FA</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Assistant Tab */}
          {activeTab === 'ai' && (
            <div className="space-y-6 animate-fade-in">
              <div className="glass p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Assistant Configuration</h3>
                    <p className="text-sm text-surface-500 mt-1">Customize how your AI interacts with customers.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-surface-300">Status:</span>
                    <span className="badge badge-success">Active</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-2">Assistant Name</label>
                    <input type="text" defaultValue="Supportroot Ai Support" className="input max-w-md" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-2">Greeting Message</label>
                    <textarea 
                      rows={3} 
                      defaultValue="Hello! I'm your AI assistant. I can answer questions based on our knowledge base. How can I help you today?" 
                      className="input resize-none" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-2">Tone of Voice</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button className="px-4 py-3 rounded-xl border border-primary-500 bg-primary-500/10 text-primary-400 text-sm font-medium text-center">
                        Professional
                      </button>
                      <button className="px-4 py-3 rounded-xl border border-white/10 bg-surface-800 text-surface-300 hover:bg-white/5 text-sm font-medium text-center transition-colors">
                        Friendly
                      </button>
                      <button className="px-4 py-3 rounded-xl border border-white/10 bg-surface-800 text-surface-300 hover:bg-white/5 text-sm font-medium text-center transition-colors">
                        Concise
                      </button>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5">
                    <h4 className="text-sm font-semibold text-white mb-4">Handoff Rules</h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                        <div>
                          <p className="text-sm font-medium text-white">Confidence Threshold</p>
                          <p className="text-xs text-surface-500 mt-1">Escalate if AI confidence is below this score</p>
                        </div>
                        <select className="input w-32 text-sm">
                          <option>70%</option>
                          <option selected>80%</option>
                          <option>90%</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                        <div>
                          <p className="text-sm font-medium text-white">Keywords Handoff</p>
                          <p className="text-xs text-surface-500 mt-1">Immediately route to human if these words are used</p>
                        </div>
                        <input type="text" defaultValue="human, agent, manager, complain, angry" className="input w-64 text-sm" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-8 pt-6 border-t border-white/5">
                    <button className="btn btn-primary">
                      <Save className="w-4 h-4" />
                      Save Configuration
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for other tabs in prototype */}
          {['company', 'kb', 'notifications', 'team', 'billing'].includes(activeTab) && (
            <div className="glass p-12 rounded-2xl text-center animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-surface-800 border border-white/10 flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-surface-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Configuration Page</h3>
              <p className="text-surface-400 max-w-sm mx-auto">
                This section will be fully functional when connected to the Django backend APIs in Phase 3.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
