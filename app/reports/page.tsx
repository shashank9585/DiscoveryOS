'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Download, Share2, Plus, Eye, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ReportsPage() {
  const {
    painPoints,
    sentimentResults,
    recommendations,
    documents,
    loadFromStorage,
    hasData,
  } = useAppStore();

  // Load persisted data on mount
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const dataExists = hasData();

  const reportDescriptions: Record<string, string> = {
    weekly: 'Weekly summary of top insights, sentiment trends, and recommended actions',
    executive: 'One-page overview of product health, critical alerts, and strategic recommendations',
    risk: 'Comprehensive risk assessment with severity scores and mitigation strategies',
    roadmap: 'Prioritized feature recommendations backed by customer feedback analysis',
  };

  // Generate reports from real data
  const generateReport = (type: string) => {
    // In production, this would call an API to generate a PDF
    alert(`Report generation for "${type}" would be implemented with a backend service.`);
    setShowGenerateModal(false);
  };

  // Empty state
  if (!dataExists) {
    return (
      <main className="flex-1 overflow-auto bg-background">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">AI Reports</h1>
            <p className="text-slate-600 dark:text-slate-400">Auto-generated executive-ready insights</p>
          </div>

          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="w-12 h-12 text-slate-400 mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No reports available yet</h2>
            <p className="text-slate-600 dark:text-slate-400 text-center mb-8">
              Upload customer feedback documents to generate AI-powered reports.
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
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">AI Reports</h1>
            <p className="text-slate-600 dark:text-slate-400">Auto-generated executive-ready insights</p>
          </div>
          <button
            onClick={() => setShowGenerateModal(!showGenerateModal)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Generate Report
          </button>
        </div>

        {/* Generate Modal */}
        {showGenerateModal && (
          <div className="mb-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Generate New Report</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Weekly', 'Executive', 'Risk', 'Roadmap'].map((type) => (
                <button
                  key={type}
                  onClick={() => generateReport(type)}
                  className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition text-left"
                >
                  <p className="font-medium text-slate-900 dark:text-white">{type}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {reportDescriptions[type.toLowerCase()]}
                  </p>
                </button>
              ))}
            </div>
            <div className="mt-6 flex gap-2">
              <button
                onClick={() => alert('Report generation would process in background')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
              >
                Generate
              </button>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Current Data Summary Report */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">📄 Current Analysis Report</h2>

          <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300">
            {/* Executive Summary */}
            <section>
              <h3 className="font-bold mb-2 text-slate-900 dark:text-white">EXECUTIVE SUMMARY</h3>
              <p className="text-slate-600 dark:text-slate-400">
                {documents.length} document(s) analyzed containing {painPoints.length} identified pain points.{' '}
                {sentimentResults.length > 0 && (
                  <>
                    Overall sentiment is{' '}
                    {sentimentResults[0].overall === 'negative'
                      ? 'negative'
                      : sentimentResults[0].overall === 'positive'
                        ? 'positive'
                        : 'neutral'}
                    . Key findings include opportunities for product improvement and customer satisfaction enhancement.
                  </>
                )}
              </p>
            </section>

            {/* Top Pain Points */}
            {painPoints.length > 0 && (
              <section>
                <h3 className="font-bold mb-2 text-slate-900 dark:text-white">TOP PAIN POINTS</h3>
                <ol className="space-y-2 text-slate-600 dark:text-slate-400">
                  {painPoints.slice(0, 5).map((pp, idx) => (
                    <li key={pp.id || idx}>
                      {idx + 1}. {pp.issue} ({pp.frequency} mentions, {Math.round(pp.confidence * 100)}%
                      confidence)
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* Sentiment Analysis */}
            {sentimentResults.length > 0 && (
              <section>
                <h3 className="font-bold mb-2 text-slate-900 dark:text-white">SENTIMENT ANALYSIS</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Sentiment breakdown: {sentimentResults[0].positivePercent}% positive, {sentimentResults[0].neutralPercent}%
                  neutral, {sentimentResults[0].negativePercent}% negative. This reflects customer perception of the
                  product and identifies areas for improvement.
                </p>
              </section>
            )}

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <section>
                <h3 className="font-bold mb-2 text-slate-900 dark:text-white">RECOMMENDED ACTIONS (PRIORITY ORDER)</h3>
                <ol className="space-y-3 text-slate-600 dark:text-slate-400">
                  {recommendations.slice(0, 3).map((rec, idx) => (
                    <li key={rec.id || idx}>
                      <strong>{idx + 1}. {rec.action}</strong> - Priority: {rec.priority.toUpperCase()}
                      <br />
                      Business Impact: {rec.businessImpact} | Customer Impact: {rec.customerImpact} | Effort: {rec.effort}
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* Next Steps */}
            <section>
              <h3 className="font-bold mb-2 text-slate-900 dark:text-white">NEXT STEPS</h3>
              <p className="text-slate-600 dark:text-slate-400">
                1. Review the identified pain points and prioritize fixes based on frequency and severity<br />
                2. Use the AI Assistant to ask specific questions about the data<br />
                3. Upload additional data to refine insights over time<br />
                4. Track improvements after implementing recommended actions
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex gap-4">
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all">
              <Download className="w-4 h-4 inline mr-2" />
              Download as PDF
            </button>
            <button className="px-6 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800">
              <Share2 className="w-4 h-4 inline mr-2" />
              Share Report
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}