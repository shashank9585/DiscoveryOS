'use client';

import Layout from '@/components/layout/Layout';

export default function SettingsPage() {
  return (
    <Layout>
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Settings
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Configure your workspace and preferences
          </p>
        </div>
      </main>
    </Layout>
  );
}
