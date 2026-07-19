'use client';

import { getSampleDashboardData } from '@/lib/sampleData';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingDown, TrendingUp } from 'lucide-react';

export default function AnalyticsPage() {
  const data = getSampleDashboardData();

  const trendData = [
    { month: 'Nov', bounceRate: 42, conversionRate: 3.8, churnRate: 8, sessionDuration: 5.4 },
    { month: 'Dec', bounceRate: 43, conversionRate: 3.7, churnRate: 9, sessionDuration: 5.3 },
    { month: 'Jan', bounceRate: 45, conversionRate: 3.2, churnRate: 12, sessionDuration: 4.8 },
  ];

  return (
    <main className="flex-1 overflow-auto bg-background">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Product Analytics</h1>
          <p className="text-muted-foreground">Correlate metrics with customer feedback</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {data.analyticsMetrics.map((metric, idx) => (
            <div key={idx} className="bg-card border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-2">{metric.metric}</p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold">{metric.current}</p>
                  <p className="text-xs text-muted-foreground mt-1">was {metric.previous}</p>
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

        {/* Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Bounce Rate & Conversion Trend</h2>
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

          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Churn & Session Duration</h2>
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

        {/* Correlations */}
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-6">📊 Feedback ↔ Analytics Correlations</h2>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg border-l-4 border-red-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Onboarding Complaints ↔ Signup Drop-off</p>
                  <p className="text-sm text-muted-foreground mt-1">34 customers complained about onboarding</p>
                  <p className="text-sm text-muted-foreground">Analytics show 67% signup drop-off</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-red-500">0.92</p>
                  <p className="text-xs text-muted-foreground">correlation</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg border-l-4 border-orange-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Performance Complaints ↔ Session Decline</p>
                  <p className="text-sm text-muted-foreground mt-1">28 customers cited slowness</p>
                  <p className="text-sm text-muted-foreground">Session duration dropped 7% this month</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-500">0.85</p>
                  <p className="text-xs text-muted-foreground">correlation</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg border-l-4 border-yellow-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Negative Sentiment Spike ↔ Churn Increase</p>
                  <p className="text-sm text-muted-foreground mt-1">Negative sentiment up from 35% to 50%</p>
                  <p className="text-sm text-muted-foreground">Churn increased from 8% to 12% MoM</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-yellow-500">0.78</p>
                  <p className="text-xs text-muted-foreground">correlation</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg border-l-4 border-green-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Positive Support Feedback ↔ Higher Retention</p>
                  <p className="text-sm text-muted-foreground mt-1">21 customers praised support quality</p>
                  <p className="text-sm text-muted-foreground">These customers show 3x lower churn</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-500">0.88</p>
                  <p className="text-xs text-muted-foreground">correlation</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="mt-8 bg-card border border-red-200 rounded-lg p-6 bg-red-50">
          <h3 className="font-semibold text-red-900 mb-3">⚠️ Alert: Metrics Declining</h3>
          <p className="text-sm text-red-800">
            Multiple key metrics show decline correlated with customer complaints about onboarding and performance.
            Recommended action: Prioritize onboarding redesign to reverse trends.
          </p>
        </div>
      </div>
    </main>
  );
}
