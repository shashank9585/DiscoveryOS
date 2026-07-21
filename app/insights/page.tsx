'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Search, Filter, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function InsightsPage() {
  const {
    painPoints,
    themes,
    personas,
    sentimentResults,
    loadFromStorage,
    hasData,
  } = useAppStore();

  // Load persisted data on mount
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const [activeTab, setActiveTab] = useState('pain_points');
  const [searchTerm, setSearchTerm] = useState('');

  const dataExists = hasData();

  // Pain points data for chart
  const painPointData = painPoints
    .filter(p => searchTerm === '' || p.issue.toLowerCase().includes(searchTerm.toLowerCase()))
    .map(p => ({
      name: p.issue.substring(0, 30),
      frequency: p.frequency,
      confidence: (p.confidence * 100).toFixed(0),
      id: p.id,
    }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 10);

  // Sentiment data from actual results
  const sentimentData = sentimentResults.length > 0 ? [
    { name: 'Positive', value: sentimentResults[0].positivePercent, fill: '#22c55e' },
    { name: 'Neutral', value: sentimentResults[0].neutralPercent, fill: '#eab308' },
    { name: 'Negative', value: sentimentResults[0].negativePercent, fill: '#ef4444' },
  ] : [];

  // Empty state
  if (!dataExists) {
    return (
      <main className="flex-1 overflow-auto bg-background">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Customer Insights</h1>
            <p className="text-slate-600 dark:text-slate-400">Deep dive into customer feedback and extracted themes</p>
          </div>

          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="w-12 h-12 text-slate-400 mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No insights yet</h2>
            <p className="text-slate-600 dark:text-slate-400 text-center mb-8">
              Upload customer interviews, surveys, or feedback documents to extract insights using AI.
            </p>
            <Link
              href="/upload"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
            >
              Upload Documents
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
            <h1 className="text-3xl font-bold mb-2">Customer Insights</h1>
            <p className="text-slate-600 dark:text-slate-400">Deep dive into customer feedback and extracted themes</p>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-600 dark:text-slate-400" />
              <input
                type="text"
                placeholder="Search insights..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
              />
            </div>
            <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-slate-200 dark:border-slate-700">
            {['pain_points', 'themes', 'personas', 'sentiment'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium border-b-2 transition ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab === 'pain_points' && `📍 Pain Points (${painPoints.length})`}
                {tab === 'themes' && `🎯 Themes (${themes.length})`}
                {tab === 'personas' && `👥 Personas (${personas.length})`}
                {tab === 'sentiment' && '😊 Sentiment'}
              </button>
            ))}
          </div>

          {/* Content */}
          {activeTab === 'pain_points' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Pain Points Frequency</h2>
                  {painPointData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={painPointData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="frequency" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-center py-8 text-slate-500">No pain points data available</p>
                  )}
                </div>
              </div>
              <div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
                  <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Top Issues</h2>
                  {painPoints.length > 0 ? (
                    <div className="space-y-3">
                      {painPoints.slice(0, 3).map((pp) => (
                        <div key={pp.id} className="p-3 bg-slate-100 dark:bg-slate-700 rounded">
                          <p className="font-medium text-sm text-slate-900 dark:text-white">{pp.issue}</p>
                          <div className="flex justify-between mt-2 text-xs text-slate-600 dark:text-slate-400">
                            <span>{pp.frequency} mentions</span>
                            <span>{Math.round(pp.confidence * 100)}% confident</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-slate-500">No pain points yet</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'themes' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {themes.length > 0 ? (
                themes.map((theme) => (
                  <div key={theme.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
                    <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">{theme.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{theme.description || 'Recurring topic in customer feedback'}</p>
                    <div className="space-y-2 mb-4">
                      {theme.relatedPainPoints?.slice(0, 3).map((pp, idx) => (
                        <div key={idx} className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-900 dark:text-white">
                          {typeof pp === 'string' ? pp : 'Pain point'}
                        </div>
                      ))}
                    </div>
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{theme.frequency} mentions</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-slate-500">
                  No themes extracted yet. Upload documents to analyze themes.
                </div>
              )}
            </div>
          )}

          {activeTab === 'personas' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {personas.length > 0 ? (
                personas.map((persona) => (
                  <div key={persona.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
                    <div className="mb-4">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{persona.role}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 capitalize">{persona.companySize} company</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium mb-2 text-slate-700 dark:text-slate-300">Main Pain Points:</p>
                      <ul className="space-y-1">
                        {persona.mainPainPoints.slice(0, 3).map((pain, idx) => (
                          <li key={idx} className="text-sm text-slate-600 dark:text-slate-400">• {pain}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <span className="text-sm text-slate-700 dark:text-slate-300">{persona.frequency} feedback items</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-slate-500">
                  No personas identified yet. Upload documents to identify personas.
                </div>
              )}
            </div>
          )}

          {activeTab === 'sentiment' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sentimentResults.length > 0 ? (
                <>
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Sentiment Distribution</h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={sentimentData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name} ${value}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {sentimentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Sentiment Breakdown</h2>
                    <div className="space-y-4">
                      {sentimentData.map((item) => (
                        <div key={item.name}>
                          <div className="flex justify-between mb-2">
                            <span className="font-medium text-slate-900 dark:text-white">{item.name}</span>
                            <span className="text-slate-700 dark:text-slate-300">{item.value}%</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${item.value}%`, backgroundColor: item.fill }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="col-span-full text-center py-8 text-slate-500">
                  No sentiment data yet. Upload documents to analyze sentiment.
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    );
}

