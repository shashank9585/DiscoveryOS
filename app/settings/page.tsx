'use client';

import { Save, Key, Mail, Bell, Palette } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('sk-proj-••••••••••••••••••••');
  const [showApiKey, setShowApiKey] = useState(false);
  const [email, setEmail] = useState('user@example.com');
  const [notifications, setNotifications] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(true);

  return (
      <main className="flex-1 overflow-auto bg-background">
        <div className="p-8 max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </div>

          {/* Profile Settings */}
          <div className="bg-card border rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Profile</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Display Name</label>
                <input
                  type="text"
                  defaultValue="John Doe"
                  className="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
                />
              </div>

              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2 hover:opacity-90">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>

          {/* API Settings */}
          <div className="bg-card border rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Key className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">API Configuration</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">LLM API Key (OpenAI)</label>
                <div className="flex gap-2 mt-1">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKey}
                    className="flex-1 px-3 py-2 border rounded-lg bg-background"
                    readOnly
                  />
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="px-3 py-2 border rounded-lg hover:bg-muted"
                  >
                    {showApiKey ? 'Hide' : 'Show'}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Used for AI-powered insights extraction and query assistance
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Supabase Connection</label>
                <div className="mt-1 px-3 py-2 border rounded-lg bg-muted text-sm">
                  Connected to project: discovery-os-prod
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Database for storing projects, feedback, and insights
                </p>
              </div>

              <button className="px-4 py-2 border rounded-lg hover:bg-muted">
                Update API Keys
              </button>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-card border rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Notifications</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable Notifications</p>
                  <p className="text-sm text-muted-foreground">Get alerts for important insights</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="w-5 h-5 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Daily Digest</p>
                  <p className="text-sm text-muted-foreground">Receive daily summary of insights</p>
                </div>
                <input
                  type="checkbox"
                  checked={dailyDigest}
                  onChange={(e) => setDailyDigest(e.target.checked)}
                  className="w-5 h-5 rounded"
                />
              </div>

              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2 hover:opacity-90">
                <Save className="w-4 h-4" />
                Save Preferences
              </button>
            </div>
          </div>

          {/* About */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">About DiscoveryOS</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Version: 1.0.0 (MVP)</p>
              <p>Last Updated: January 2024</p>
              <p>
                DiscoveryOS is an AI-powered Product Intelligence Platform helping PMs make data-driven decisions.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
}

