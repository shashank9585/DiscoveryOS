'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { KPICard } from '@/components/dashboard/KPICard';
import { PainPointsCard } from '@/components/dashboard/PainPointsCard';
import { UploadStatus } from '@/components/dashboard/UploadStatus';
import { TrendingUp, AlertCircle, Users, Activity, Upload, FileText, Brain, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const {
    documents,
    painPoints,
    risks,
    themes,
    recommendations,
    isProcessing,
    processingFilename,
    getDashboardMetrics,
    hasData,
    loadFromStorage,
  } = useAppStore();

  // Load persisted data on mount
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const metrics = getDashboardMetrics();
  const dataExists = hasData();

  // Prepare recent uploads for the sidebar card
  const recentUploads = documents
    .slice()
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    .slice(0, 5)
    .map(doc => ({
      id: doc.id,
      filename: doc.filename,
      uploadedAt: getRelativeTime(doc.uploadedAt),
      status: doc.status as 'uploading' | 'processing' | 'completed' | 'error',
      size: formatSize(doc.size),
    }));

  // Prepare pain points for the card
  const painPointCards = painPoints.map(p => ({
    id: p.id,
    issue: p.issue,
    frequency: p.frequency,
    severity: p.severity,
    confidence: p.confidence,
    evidenceCount: p.evidenceQuotes?.length || 0,
  }));

  // ─── Empty State ───────────────────────────────────────────
  if (!dataExists && !isProcessing) {
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

          {/* Empty State Hero */}
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-blue-500" />
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <Upload className="w-4 h-4 text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              No documents uploaded yet
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-center max-w-md mb-2">
              Upload customer interviews, surveys, support tickets, or analytics data to get
              AI-powered product insights.
            </p>
            <p className="text-slate-500 dark:text-slate-500 text-sm text-center max-w-md mb-8">
              Supported formats: PDF, TXT, CSV, DOCX
            </p>

            <Link
              href="/upload"
              className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40"
            >
              <Upload className="w-5 h-5" />
              Upload Your First Document
            </Link>

            {/* Feature cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16 w-full max-w-3xl">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-5 text-center">
                <Brain className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">AI-Powered Analysis</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Gemini AI extracts pain points, themes, and personas from your data
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-5 text-center">
                <Activity className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Real-Time Metrics</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Health scores and sentiment calculated from your actual data
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-5 text-center">
                <FileText className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Actionable Reports</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Get prioritized recommendations backed by evidence
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ─── Processing State ──────────────────────────────────────
  if (isProcessing) {
    return (
      <main className="flex-1 overflow-auto bg-background">
        <div className="p-8 w-full">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Executive Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Processing your document...
            </p>
          </div>
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-6">
              <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 rounded-full animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              AI is analyzing your document
            </h2>
            {processingFilename && (
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Processing: {processingFilename}
              </p>
            )}
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-2">
              Extracting pain points, themes, personas, and sentiment...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ── Data-Populated Dashboard ──────────────────────────────
  return (
    <main className="flex-1 overflow-auto bg-background">
      <div className="p-8 w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Executive Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Real-time product health and customer insights •{' '}
            <span className="font-medium">{metrics.totalDocuments || 0} document{(metrics.totalDocuments || 0) !== 1 ? 's' : ''}</span>{' '}
            analyzed • <span className="font-medium">{metrics.totalInsights || 0} insight{(metrics.totalInsights || 0) !== 1 ? 's' : ''}</span>{' '}
            extracted
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KPICard
            icon={<Activity className="w-5 h-5" />}
            title="Health Score"
            value={metrics.healthScore || 0}
            unit="%"
            trend={metrics.healthTrend || null}
            color="blue"
          />
          <KPICard
            icon={<Users className="w-5 h-5" />}
            title="Satisfaction"
            value={metrics.satisfactionScore || 0}
            unit="%"
            trend={metrics.satisfactionTrend || null}
            color="green"
          />
          <KPICard
            icon={<TrendingUp className="w-5 h-5" />}
            title="AI Confidence"
            value={metrics.aiConfidence || 0}
            unit="%"
            trend={null}
            color="purple"
          />
          <KPICard
            icon={<AlertCircle className="w-5 h-5" />}
            title="Active Issues"
            value={metrics.activeIssues || 0}
            trend={null}
            color="orange"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Pain Points */}
          <div className="lg:col-span-2">
            <PainPointsCard painPoints={painPointCards} />
          </div>

          {/* Recent Uploads */}
          <div>
            <UploadStatus uploads={recentUploads} />
          </div>
        </div>

        {/* Risk Alerts */}
        <div className="mb-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            🚨 Risk Indicators
          </h2>
          <div className="space-y-3">
            {risks.length > 0 ? (
              risks.map((risk, idx) => (
                <div key={risk.id || idx} className="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
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
              <div className="text-center py-8">
                <AlertCircle className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No risks detected yet. Upload more data to identify potential risks.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mb-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              💡 AI Recommendations
            </h2>
            <div className="space-y-3">
              {recommendations.slice(0, 5).map((rec, idx) => (
                <div key={rec.id || idx} className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-semibold text-slate-900 dark:text-white flex-1">
                      {rec.action}
                    </p>
                    <span className={`ml-3 px-2 py-0.5 rounded text-xs font-medium ${
                      rec.priority === 'critical' ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' :
                      rec.priority === 'high' ? 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300' :
                      rec.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' :
                      'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    }`}>
                      {rec.priority}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400">
                    <div>
                      <span className="font-medium">Business Impact: </span>
                      {rec.businessImpact || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Customer Impact: </span>
                      {rec.customerImpact || 'N/A'}
                    </div>
                  </div>
                  {rec.supportingQuotes?.length > 0 && (
                    <div className="mt-2 pl-3 border-l-2 border-blue-300 dark:border-blue-700">
                      <p className="text-xs italic text-slate-500 dark:text-slate-400">
                        &ldquo;{rec.supportingQuotes[0]}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/upload"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            📤 Upload Research
          </Link>
          <Link
            href="/insights"
            className="px-6 py-2 bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
          >
            🔍 View Insights
          </Link>
          <Link
            href="/reports"
            className="px-6 py-2 bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
          >
            📋 View Reports
          </Link>
        </div>
      </div>
    </main>
  );
}

// ─── Helpers ──────────────────────────────────────────────────

function getRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}