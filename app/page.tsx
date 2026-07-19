'use client';

import { useState, useEffect } from 'react';
import { KPICard } from '@/components/dashboard/KPICard';
import { PainPointsCard } from '@/components/dashboard/PainPointsCard';
import { UploadStatus } from '@/components/dashboard/UploadStatus';
import { getSampleDashboardData } from '@/lib/sampleData';
import { TrendingUp, AlertCircle, Users, Activity } from 'lucide-react';

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading dashboard data
    const timer = setTimeout(() => {
      const data = getSampleDashboardData();
      setDashboardData(data);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <main className="flex-1 overflow-auto bg-background">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-8">Executive Dashboard</h1>
          <div className="space-y-6">
            <div className="h-32 bg-muted rounded-lg animate-pulse" />
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!dashboardData) {
    return (
      <main className="flex-1 overflow-auto bg-background">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-8">Executive Dashboard</h1>
          <p className="text-muted-foreground">No data available. Upload some files to get started.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-auto bg-background">
      <div className="p-8 w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Executive Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Real-time product health and customer insights
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KPICard
            icon={<Activity className="w-5 h-5" />}
            title="Health Score"
            value={dashboardData.healthScore || 0}
            unit="%"
            trend={dashboardData.healthTrend || 0}
            color="blue"
          />
          <KPICard
            icon={<Users className="w-5 h-5" />}
            title="Satisfaction"
            value={dashboardData.satisfactionScore || 0}
            unit="%"
            trend={dashboardData.satisfactionTrend || 0}
            color="green"
          />
          <KPICard
            icon={<TrendingUp className="w-5 h-5" />}
            title="AI Confidence"
            value={dashboardData.aiConfidence || 0}
            unit="%"
            trend={dashboardData.confidenceTrend || 0}
            color="purple"
          />
          <KPICard
            icon={<AlertCircle className="w-5 h-5" />}
            title="Active Issues"
            value={dashboardData.activeIssues || 0}
            trend={dashboardData.issuesTrend || 0}
            color="orange"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Pain Points */}
          <div className="lg:col-span-2">
            <PainPointsCard painPoints={dashboardData.painPoints} />
          </div>

          {/* Recent Uploads */}
          <div>
            <UploadStatus uploads={dashboardData.recentUploads} />
          </div>
        </div>

        {/* Risk Alerts */}
        <div className="mb-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            🚨 Risk Indicators
          </h2>
          <div className="space-y-3">
            {dashboardData.risks && dashboardData.risks.length > 0 ? (
              dashboardData.risks.map((risk: any, idx: number) => (
                <div key={idx} className="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {risk.name}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {risk.description}
                    </p>
                  </div>
                  <div className={`ml-4 px-3 py-1 rounded-full text-sm font-medium flex-shrink-0 ${
                    risk.severity === 'critical' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                    risk.severity === 'high' ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200' :
                    risk.severity === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                    'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                  }`}>
                    {risk.severity}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-600 dark:text-slate-400">No active risks</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
            📤 Upload Research
          </button>
          <button className="px-6 py-2 bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-lg font-medium transition-colors">
            🤖 Ask AI Assistant
          </button>
          <button className="px-6 py-2 bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-lg font-medium transition-colors">
            📋 Generate Report
          </button>
        </div>
      </div>
    </main>
  );
}
