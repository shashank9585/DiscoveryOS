'use client';

import { useState } from 'react';
import { getSampleDashboardData, getSampleInsightsList } from '@/lib/sampleData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Search, Filter } from 'lucide-react';

export default function InsightsPage() {
  const data = getSampleDashboardData();
  const insights = getSampleInsightsList();
  const [activeTab, setActiveTab] = useState('pain_points');
  const [searchTerm, setSearchTerm] = useState('');

  const painPointData = data.painPoints.map(p => ({
    name: p.issue.substring(0, 30),
    frequency: p.frequency,
    confidence: (p.confidence * 100).toFixed(0),
  }));

  const sentimentData = [
    { name: 'Positive', value: 28, fill: '#22c55e' },
    { name: 'Neutral', value: 35, fill: '#eab308' },
    { name: 'Negative', value: 37, fill: '#ef4444' },
  ];

  return (
      <main className="flex-1 overflow-auto bg-background">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Customer Insights</h1>
            <p className="text-muted-foreground">Deep dive into customer feedback and extracted themes</p>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search insights..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background"
              />
            </div>
            <button className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-muted">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b">
            {['pain_points', 'themes', 'personas', 'sentiment'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium border-b-2 transition ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab === 'pain_points' && '📍 Pain Points'}
                {tab === 'themes' && '🎯 Themes'}
                {tab === 'personas' && '👥 Personas'}
                {tab === 'sentiment' && '😊 Sentiment'}
              </button>
            ))}
          </div>

          {/* Content */}
          {activeTab === 'pain_points' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-card border rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Pain Points Frequency</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={painPointData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="frequency" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <div className="bg-card border rounded-lg p-6">
                  <h2 className="text-lg font-semibold mb-4">Top Issue</h2>
                  <div className="space-y-3">
                    {data.painPoints.slice(0, 3).map((pp) => (
                      <div key={pp.id} className="p-3 bg-muted rounded">
                        <p className="font-medium text-sm">{pp.issue}</p>
                        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                          <span>{pp.frequency} mentions</span>
                          <span>{(pp.confidence * 100).toFixed(0)}% confident</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'themes' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.themes.map((theme) => (
                <div key={theme.id} className="bg-card border rounded-lg p-6">
                  <h3 className="font-semibold mb-2">{theme.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{theme.description}</p>
                  <div className="space-y-2">
                    {theme.painPoints.map((pp, idx) => (
                      <div key={idx} className="text-xs bg-muted px-2 py-1 rounded">
                        {pp}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <span className="text-sm font-medium">{theme.frequency} mentions</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'personas' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.personas.map((persona) => (
                <div key={persona.id} className="bg-card border rounded-lg p-6">
                  <div className="mb-4">
                    <h3 className="font-semibold">{persona.role}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{persona.company_size} company</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium mb-2">Main Pain Points:</p>
                    <ul className="space-y-1">
                      {persona.main_pain_points.map((pain, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground">• {pain}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <span className="text-sm">{persona.frequency} feedback items</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'sentiment' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Sentiment Distribution</h2>
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
              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Sentiment Breakdown</h2>
                <div className="space-y-4">
                  {sentimentData.map((item) => (
                    <div key={item.name}>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{item.name}</span>
                        <span>{item.value}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${item.value}%`, backgroundColor: item.fill }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    );
}

