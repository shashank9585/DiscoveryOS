import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number | null | undefined;
  unit?: string;
  trend?: number | null;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

export function KPICard({
  title,
  value,
  unit,
  trend,
  icon,
  color = 'blue',
}: KPICardProps) {
  const bgColorClasses: Record<string, string> = {
    blue: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
    green: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
    purple: 'bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800',
    orange: 'bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800',
    red: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800',
  };

  const textColorClasses: Record<string, string> = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    purple: 'text-purple-600 dark:text-purple-400',
    orange: 'text-orange-600 dark:text-orange-400',
    red: 'text-red-600 dark:text-red-400',
  };

  // Safe value display
  const displayValue = value !== null && value !== undefined ? value : '—';

  // Safe trend calculation and display
  const trendValue = trend !== null && trend !== undefined ? trend : null;
  const trendDirection = trendValue !== null && trendValue > 0 ? 'up' : 'down';
  const trendColor = trendValue !== null && trendValue >= 0 
    ? 'text-green-600 dark:text-green-400' 
    : 'text-red-600 dark:text-red-400';

  return (
    <div className={`border rounded-lg p-6 ${bgColorClasses[color]}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {title}
        </h3>
        {icon && (
          <div className={`${textColorClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">
              {displayValue}
            </span>
            {unit && (
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {unit}
              </span>
            )}
          </div>

          {trendValue !== null && (
            <div className={`flex items-center gap-1 mt-2 ${trendColor}`}>
              {trendDirection === 'up' ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">
                {Math.abs(trendValue).toFixed(1)}% from last week
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
