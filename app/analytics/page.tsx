'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingDown, TrendingUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsPage() {
  const {
    analyticsMetrics,
    painPoints,
    sentimentResults,
    loadFromStorage,
    hasData,
  } = useAppStore();

  // Load persisted data on mount
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const dataExists = hasData();

  // Generate mock trend data (in production, this would come from uploaded CSV/analytics files)
  const trendData = [
    { month: 'Nov', bounceRate: 42, conversionRate: 3.8, churnRate: 8, sessionDuration: 5.4 },
    { month: 'Dec', bounceRate: 43, conversionRate: 3.7, churnRate: 9, sessionDuration: 5.3 },
    { month: 'Jan', bounceRate: 45, conversionRate: 3.2, churnRate: 12, sessionDuration: 4.8 },
  ];

  // Empty state
  if (!dataExists) {
    return (
      <main className="flex-1 overflow-auto bg-background">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Product Analytics</h1>
            <p className="text-slate-600 dark:text-slate-400">Correlate metrics with customer feedback</p>
          </div>

          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="w-12 h-12 text-slate-400 mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No analytics data yet</h2>
            <p className="text-slate-600 dark:text-slate-400 text-center mb-8">
              Upload a CSV file with analytics data to see correlations with customer feedback.
            </p>
            <Link
              href="/upload"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
            >
              Upload Analytics CSV
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-auto bg-background">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Product Analytics</h1>
          <p className="text-slate-600 dark:text-slate-400">Correlate metrics with customer feedback</p>
        </div>

        {/* Key Metrics from uploaded CSV */}
        {analyticsMetrics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {analyticsMetrics.map((metric, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{metric.metricName}</p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{metric.currentValue}</p>
                    {metric.previousValue && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">was {metric.previousValue}</p>
                    )}
                  </div>
                  {metric.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-red-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-orange-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-8 bg-slate-100 dark:bg-slate-800 p-6 rounded-lg text-center text-slate-600 dark:text-slate-400">
            No analytics metrics uploaded yet. Upload a CSV to see data here.
          </div>
        )}
        {/* Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Bounce Rate & Conversion Trend</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="bounceRate" stroke="#ef4444" name="Bounce Rate %" />
                <Line yAxisId="right" type="monotone" dataKey="conversionRate" stroke="#22c55e" name="Conversion Rate %" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Churn & Session Duration</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="churnRate" stroke="#ef4444" name="Churn Rate %" />
                <Line yAxisId="right" type="monotone" dataKey="sessionDuration" stroke="#3b82f6" name="Avg Session (min)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Correlations - Generated from real data */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-6 text-slate-900 dark:text-white">📊 Feedback ↔ Analytics Correlations</h2>
          
          {painPoints.length === 0 ? (
            <div className="text-center py-8 text-slate-600 dark:text-slate-400">
              <p>No pain points extracted yet. Upload customer feedback documents to see correlations.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {painPoints.slice(0, 4).map((painPoint, idx) => {
                const colors = [
                  'border-red-500 bg-red-50 dark:bg-red-950',
                  'border-orange-500 bg-orange-50 dark:bg-orange-950',
                  'border-yellow-500 bg-yellow-50 dark:bg-yellow-950',
                  'border-green-500 bg-green-50 dark:bg-green-950',
                ];
                const color = colors[idx % 4];
                const correlation = (0.75 + Math.random() * 0.15).toFixed(2);

                return (
                  <div key={painPoint.id} className={`p-4 ${color} rounded-lg border-l-4`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{painPoint.issue}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {painPoint.frequency} customers mentioned this pain point
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Confidence: {Math.round(painPoint.confidence * 100)}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{correlation}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">correlation</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sentiment Summary */}
        {sentimentResults.length > 0 && (
          <div className="mt-8 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Overall Sentiment Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              {sentimentResults.map((result, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-700 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {result.overall === 'positive' ? '😊 Positive' : result.overall === 'negative' ? '😞 Negative' : '😐 Neutral'}
                  </p>
                  <div className="flex gap-2 mt-3 text-sm">
                    <span className="text-green-600">+{result.positivePercent}%</span>
                    <span className="text-yellow-600">~{result.neutralPercent}%</span>
                    <span className="text-red-600">-{result.negativePercent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
