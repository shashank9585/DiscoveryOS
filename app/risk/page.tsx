'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function RiskPage() {
  const {
    risks,
    recommendations,
    painPoints,
    loadFromStorage,
    hasData,
  } = useAppStore();

  // Load persisted data on mount
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const dataExists = hasData();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return { 
          bg: 'bg-red-50 dark:bg-red-950', 
          border: 'border-red-200 dark:border-red-800', 
          text: 'text-red-900 dark:text-red-100', 
          badge: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100' 
        };
      case 'high':
        return { 
          bg: 'bg-orange-50 dark:bg-orange-950', 
          border: 'border-orange-200 dark:border-orange-800', 
          text: 'text-orange-900 dark:text-orange-100', 
          badge: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-100' 
        };
      case 'medium':
        return { 
          bg: 'bg-yellow-50 dark:bg-yellow-950', 
          border: 'border-yellow-200 dark:border-yellow-800', 
          text: 'text-yellow-900 dark:text-yellow-100', 
          badge: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100' 
        };
      default:
        return { 
          bg: 'bg-green-50 dark:bg-green-950', 
          border: 'border-green-200 dark:border-green-800', 
          text: 'text-green-900 dark:text-green-100', 
          badge: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100' 
        };
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="w-5 h-5" />;
      case 'medium':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <CheckCircle2 className="w-5 h-5" />;
    }
  };

  // Calculate risk metrics from real data
  const criticalRisks = risks.filter(r => r.severity === 'critical').length;
  const highRisks = risks.filter(r => r.severity === 'high').length;
  const avgConfidence = risks.length > 0 
    ? Math.round((risks.reduce((sum, r) => sum + r.confidence, 0) / risks.length) * 100)
    : 0;

  // Empty state
  if (!dataExists) {
    return (
      <main className="flex-1 overflow-auto bg-background">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">Risk Dashboard</h1>
            <p className="text-slate-600 dark:text-slate-400">Monitor product health threats and mitigation strategies</p>
          </div>

          <div className="flex flex-col items-center justify-center py-20">
            <AlertTriangle className="w-12 h-12 text-slate-400 mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No risk data yet</h2>
            <p className="text-slate-600 dark:text-slate-400 text-center mb-8">
              Upload customer feedback documents to identify and analyze potential risks.
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
          <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">Risk Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400">Monitor product health threats and mitigation strategies</p>
        </div>

        {/* Risk Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Critical Risks</p>
            <p className="text-3xl font-bold text-red-600">{criticalRisks}</p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">Require immediate action</p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">High Risks</p>
            <p className="text-3xl font-bold text-orange-600">{highRisks}</p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">Monitor closely</p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Avg Confidence</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{avgConfidence}%</p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">Risk predictions</p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Total Risks</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{risks.length}</p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">Identified from data</p>
          </div>
        </div>

        {/* Risk Details */}
        {risks.length > 0 ? (
          <div className="space-y-4 mb-8">
            {risks.map((risk, idx) => {
              const colors = getSeverityColor(risk.severity);
              return (
                <div
                  key={risk.id || idx}
                  className={`${colors.bg} ${colors.border} border rounded-lg p-6`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className={colors.text}>
                        {getSeverityIcon(risk.severity)}
                      </div>
                      <div>
                        <h3 className={`font-semibold ${colors.text}`}>{risk.name}</h3>
                        <p className={`text-sm ${colors.text} opacity-75 mt-1`}>{risk.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors.badge}`}>
                        {risk.severity.toUpperCase()}
                      </span>
                      <span className={`text-sm font-medium ${colors.text}`}>
                        {Math.round(risk.confidence * 100)}% confidence
                      </span>
                    </div>
                  </div>

                  {/* Risk Timeline */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t" style={{ borderColor: 'currentColor', opacity: 0.3 }}>
                    <div>
                      <p className={`text-xs font-medium mb-1 ${colors.text}`}>Severity Level</p>
                      <p className={`text-sm ${colors.text}`}>{risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)}</p>
                    </div>
                    <div>
                      <p className={`text-xs font-medium mb-1 ${colors.text}`}>Priority Action</p>
                      <p className={`text-sm ${colors.text}`}>Review {'&'} Monitor</p>
                    </div>
                    <div>
                      <p className={`text-xs font-medium mb-1 ${colors.text}`}>Confidence</p>
                      <p className={`text-sm ${colors.text}`}>{Math.round(risk.confidence * 100)}%</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-lg text-center text-slate-600 dark:text-slate-400 mb-8">
            No risks identified in current data.
          </div>
        )}

        {/* Recommendations from AI */}
        {recommendations.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-4">📋 Recommended Mitigations</h3>
            <div className="space-y-3">
              {recommendations.slice(0, 5).map((rec, idx) => (
                <div key={rec.id || idx} className="flex items-start gap-3 pb-3 border-b border-blue-200 dark:border-blue-800 last:border-0">
                  <div className="text-xl font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">
                    {idx + 1}.
                  </div>
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-100">{rec.action}</p>
                    <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                      Impact: {rec.businessImpact} | Effort: {rec.effort}
                    </p>
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
