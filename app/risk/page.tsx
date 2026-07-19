'use client';

import { getSampleDashboardData, getSampleRisks } from '@/lib/sampleData';
import { AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RiskPage() {
  const data = getSampleDashboardData();
  const risks = getSampleRisks();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-900', badge: 'bg-red-100 text-red-800' };
      case 'high':
        return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-900', badge: 'bg-orange-100 text-orange-800' };
      case 'medium':
        return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-900', badge: 'bg-yellow-100 text-yellow-800' };
      default:
        return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-900', badge: 'bg-green-100 text-green-800' };
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

  return (
      <main className="flex-1 overflow-auto bg-background">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Risk Dashboard</h1>
            <p className="text-muted-foreground">Monitor product health threats and mitigation strategies</p>
          </div>

          {/* Risk Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card border rounded-lg p-6">
              <p className="text-sm text-muted-foreground mb-2">Critical Risks</p>
              <p className="text-3xl font-bold text-red-600">2</p>
              <p className="text-xs text-muted-foreground mt-2">Require immediate action</p>
            </div>
            <div className="bg-card border rounded-lg p-6">
              <p className="text-sm text-muted-foreground mb-2">High Risks</p>
              <p className="text-3xl font-bold text-orange-600">2</p>
              <p className="text-xs text-muted-foreground mt-2">Monitor closely</p>
            </div>
            <div className="bg-card border rounded-lg p-6">
              <p className="text-sm text-muted-foreground mb-2">Avg Confidence</p>
              <p className="text-3xl font-bold">90%</p>
              <p className="text-xs text-muted-foreground mt-2">Risk predictions</p>
            </div>
            <div className="bg-card border rounded-lg p-6">
              <p className="text-sm text-muted-foreground mb-2">Impact Range</p>
              <p className="text-3xl font-bold">$50-150K</p>
              <p className="text-xs text-muted-foreground mt-2">Potential revenue at risk</p>
            </div>
          </div>

          {/* Risk Details */}
          <div className="space-y-4">
            {data.risks.map((risk, idx) => {
              const colors = getSeverityColor(risk.severity);
              return (
                <div
                  key={idx}
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
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors.badge}`}>
                        {risk.severity.toUpperCase()}
                      </span>
                      <span className="text-sm font-medium">
                        {Math.round(risk.confidence * 100)}% confidence
                      </span>
                    </div>
                  </div>

                  {/* Risk Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t" style={{ borderColor: 'currentColor', opacity: 0.2 }}>
                    <div>
                      <p className="text-xs font-medium mb-1">Affected Customers</p>
                      <p className="text-sm">~{Math.floor(Math.random() * 100) + 20}% of user base</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium mb-1">Timeline</p>
                      <p className="text-sm">{idx === 0 ? 'Immediate' : idx === 1 ? 'This week' : 'This month'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium mb-1">Mitigation Effort</p>
                      <p className="text-sm">{idx === 0 ? 'Critical' : idx === 1 ? 'High' : 'Medium'}</p>
                    </div>
                  </div>

                  {/* Recommended Actions */}
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: 'currentColor', opacity: 0.2 }}>
                    <p className="text-xs font-medium mb-2">Recommended Actions:</p>
                    <ul className="space-y-1">
                      {idx === 0 && (
                        <>
                          <li className="text-sm">1. Review and redesign onboarding flow</li>
                          <li className="text-sm">2. Conduct user testing to identify pain points</li>
                          <li className="text-sm">3. Implement improved tooltips and help text</li>
                        </>
                      )}
                      {idx === 1 && (
                        <>
                          <li className="text-sm">1. Audit mobile experience and responsive design</li>
                          <li className="text-sm">2. Prioritize mobile app development</li>
                          <li className="text-sm">3. Establish mobile-first design guidelines</li>
                        </>
                      )}
                      {idx === 2 && (
                        <>
                          <li className="text-sm">1. Perform sentiment analysis on recent feedback</li>
                          <li className="text-sm">2. Identify root causes of negative feedback</li>
                          <li className="text-sm">3. Execute rapid response plan</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Risk Mitigation Summary */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">📋 Mitigation Roadmap</h3>
            <p className="text-sm text-blue-900 mb-4">
              Addressing the top 3 risks would require ~6-8 weeks of engineering effort but could reduce churn by 15-20%.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Priority 1: Onboarding Redesign</span>
                <span className="font-medium">3-4 weeks</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Priority 2: Mobile Experience</span>
                <span className="font-medium">4-6 weeks (parallel)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Priority 3: Performance Optimization</span>
                <span className="font-medium">2-3 weeks (parallel)</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
}
