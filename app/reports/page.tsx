'use client';

import { useState } from 'react';
import { getSampleReports, getSampleDashboardData } from '@/lib/sampleData';
import { Download, Share2, Plus, Eye } from 'lucide-react';

export default function ReportsPage() {
  const reports = getSampleReports();
  const data = getSampleDashboardData();
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  const reportDescriptions: Record<string, string> = {
    weekly: 'Weekly summary of top insights, sentiment trends, and recommended actions',
    executive: 'One-page overview of product health, critical alerts, and strategic recommendations',
    risk: 'Comprehensive risk assessment with severity scores and mitigation strategies',
    roadmap: 'Prioritized feature recommendations backed by customer feedback analysis',
  };

  return (
      <main className="flex-1 overflow-auto bg-background">
        <div className="p-8">
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">AI Reports</h1>
              <p className="text-muted-foreground">Auto-generated executive-ready insights</p>
            </div>
            <button
              onClick={() => setShowGenerateModal(!showGenerateModal)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Generate Report
            </button>
          </div>

          {/* Generate Modal */}
          {showGenerateModal && (
            <div className="mb-8 bg-card border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Generate New Report</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Weekly', 'Executive', 'Risk', 'Roadmap'].map((type) => (
                  <button
                    key={type}
                    className="p-4 border rounded-lg hover:bg-muted transition text-left"
                  >
                    <p className="font-medium">{type}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {reportDescriptions[type.toLowerCase()]}
                    </p>
                  </button>
                ))}
              </div>
              <div className="mt-6 flex gap-2">
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
                  Generate
                </button>
                <button
                  onClick={() => setShowGenerateModal(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Recent Reports */}
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="bg-card border rounded-lg p-6 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{report.name}</h3>
                    <p className="text-sm text-muted-foreground">Generated {report.generatedAt}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 border rounded text-sm hover:bg-muted flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button className="px-3 py-1 border rounded text-sm hover:bg-muted flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      PDF
                    </button>
                    <button className="px-3 py-1 border rounded text-sm hover:bg-muted flex items-center gap-1">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-muted rounded">
                    <p className="text-xs text-muted-foreground">Insights Included</p>
                    <p className="text-2xl font-bold">{report.insights}</p>
                  </div>
                  <div className="p-3 bg-muted rounded">
                    <p className="text-xs text-muted-foreground">Recommendations</p>
                    <p className="text-2xl font-bold">{report.recommendations}</p>
                  </div>
                  <div className="p-3 bg-muted rounded">
                    <p className="text-xs text-muted-foreground">Confidence Score</p>
                    <p className="text-2xl font-bold">{85 + Math.floor(Math.random() * 10)}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sample Report Preview */}
          <div className="mt-12 bg-card border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">📄 Sample Report Preview: Weekly Discovery</h2>

            <div className="space-y-6 text-sm">
              <section>
                <h3 className="font-bold mb-2">EXECUTIVE SUMMARY</h3>
                <p className="text-muted-foreground">
                  This week's analysis reveals a critical trend: customers are increasingly frustrated with the onboarding
                  experience, resulting in a 67% signup drop-off. Combined with performance complaints, this represents a
                  high-risk situation affecting retention. Immediate action on onboarding redesign is recommended.
                </p>
              </section>

              <section>
                <h3 className="font-bold mb-2">TOP 5 PAIN POINTS</h3>
                <ol className="space-y-2 text-muted-foreground">
                  <li>1. Onboarding complexity (34 mentions, 95% confidence)</li>
                  <li>2. Performance issues (28 mentions, 88% confidence)</li>
                  <li>3. Missing mobile app (18 mentions, 82% confidence)</li>
                  <li>4. Limited customization (12 mentions, 75% confidence)</li>
                  <li>5. Poor API documentation (8 mentions, 70% confidence)</li>
                </ol>
              </section>

              <section>
                <h3 className="font-bold mb-2">SENTIMENT ANALYSIS</h3>
                <p className="text-muted-foreground">
                  Overall sentiment is negative (37% negative, 35% neutral, 28% positive). This represents a 5% decline
                  from last week, primarily driven by frustrations with onboarding and performance.
                </p>
              </section>

              <section>
                <h3 className="font-bold mb-2">RECOMMENDED ACTIONS (PRIORITY ORDER)</h3>
                <ol className="space-y-3 text-muted-foreground">
                  <li>
                    <strong>1. CRITICAL: Redesign Onboarding Flow</strong> - Confidence: 95%<br />
                    Impact: Reduce churn by 10-15%, improve NPS by 15-20 points.<br />
                    Effort: 3-4 weeks | Timeline: START IMMEDIATELY
                  </li>
                  <li>
                    <strong>2. HIGH: Performance Optimization</strong> - Confidence: 88%<br />
                    Impact: Improve session duration by 15%, reduce bounce by 5%.<br />
                    Effort: 2-3 weeks | Timeline: Parallel with onboarding
                  </li>
                  <li>
                    <strong>3. HIGH: Mobile Experience</strong> - Confidence: 82%<br />
                    Impact: Access new market segment, 30% revenue growth potential.<br />
                    Effort: 4-6 weeks | Timeline: Q2 planning
                  </li>
                </ol>
              </section>

              <section>
                <h3 className="font-bold mb-2">RISK ASSESSMENT</h3>
                <p className="text-muted-foreground">
                  🔴 CRITICAL RISK: Churn trending upward (8% → 12% MoM). If onboarding issues persist, churn could
                  reach 15% within 30 days, representing ~$150K revenue at risk.
                </p>
              </section>
            </div>

            <div className="mt-8 pt-6 border-t flex gap-4">
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg">
                Download Full Report (PDF)
              </button>
              <button className="px-6 py-2 border rounded-lg">
                Share with Team
              </button>
            </div>
          </div>
        </div>
      </main>
    );
}

