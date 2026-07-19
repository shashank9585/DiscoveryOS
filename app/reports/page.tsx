'use client';

import Layout from '@/components/layout/Layout';

export default function ReportsPage() {
  return (
    <Layout>
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Reports
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Generate and view product reports
          </p>
        </div>
      </main>
    </Layout>
  );
}
