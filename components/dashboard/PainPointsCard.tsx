import React from 'react';
import { AlertCircle, TrendingDown } from 'lucide-react';

export interface PainPoint {
  id: string;
  issue?: string;
  title?: string;
  frequency: number;
  description?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence?: number;
  evidenceCount?: number;
}

interface PainPointsCardProps {
  painPoints: PainPoint[];
  title?: string;
}

export function PainPointsCard({
  painPoints,
  title = 'Top Pain Points',
}: PainPointsCardProps) {
  const severityColors: Record<string, { bg: string; text: string; badge: string }> = {
    low: {
      bg: 'bg-blue-50 dark:bg-blue-950',
      text: 'text-blue-900 dark:text-blue-200',
      badge: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
    },
    medium: {
      bg: 'bg-yellow-50 dark:bg-yellow-950',
      text: 'text-yellow-900 dark:text-yellow-200',
      badge: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300',
    },
    high: {
      bg: 'bg-orange-50 dark:bg-orange-950',
      text: 'text-orange-900 dark:text-orange-200',
      badge: 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300',
    },
    critical: {
      bg: 'bg-red-50 dark:bg-red-950',
      text: 'text-red-900 dark:text-red-200',
      badge: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300',
    },
  };

  const getSeverityBadge = (severity: string) => {
    const icons: Record<string, string> = {
      low: '📍',
      medium: '⚠️',
      high: '🔴',
      critical: '🚨',
    };
    return icons[severity] || '•';
  };

  // Filter and sort pain points
  const sortedPainPoints = painPoints
    .filter((p) => p && p.id)
    .sort((a, b) => (b.frequency || 0) - (a.frequency || 0));

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingDown className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          {title}
        </h3>
        <span className="ml-auto text-sm font-medium text-slate-600 dark:text-slate-400">
          {sortedPainPoints.length} issues
        </span>
      </div>

      {sortedPainPoints.length === 0 ? (
        <div className="text-center py-8">
          <AlertCircle className="h-8 w-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No pain points identified yet. Upload feedback to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedPainPoints.map((painPoint) => {
            const colors = severityColors[painPoint.severity || 'medium'];
            const itemLabel = painPoint.issue || painPoint.title || 'Unknown Issue';
            const frequency = painPoint.frequency || 0;
            const confidence = painPoint.confidence ? `${Math.round(painPoint.confidence * 100)}%` : 'N/A';

            return (
              <div
                key={painPoint.id}
                className={`border rounded-lg p-4 ${colors.bg} transition-colors hover:opacity-80`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg flex-shrink-0">
                        {getSeverityBadge(painPoint.severity || 'medium')}
                      </span>
                      <h4 className={`font-semibold text-sm ${colors.text} line-clamp-2`}>
                        {itemLabel}
                      </h4>
                    </div>
                    {painPoint.description && (
                      <p className={`text-xs ${colors.text} opacity-75 line-clamp-2 ml-6`}>
                        {painPoint.description}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 flex-shrink-0 text-right">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${colors.badge}`}>
                      {frequency}x
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      {confidence}
                    </div>
                  </div>
                </div>
                {painPoint.evidenceCount !== undefined && (
                  <div className="text-xs text-slate-600 dark:text-slate-400 ml-6">
                    {painPoint.evidenceCount} evidence item{painPoint.evidenceCount !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {sortedPainPoints.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Based on {sortedPainPoints.reduce((sum, p) => sum + (p.frequency || 0), 0)} customer mentions
          </p>
        </div>
      )}
    </div>
  );
}
