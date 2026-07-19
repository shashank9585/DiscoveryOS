/**
 * Sample/Mock Data for MVP
 * Generates realistic test data for all dashboard views
 */

export function getSampleDashboardData() {
  return {
    healthScore: 68,
    healthTrend: 5,
    satisfactionScore: 72,
    satisfactionTrend: -3,
    aiConfidence: 87,
    confidenceTrend: 8,
    activeIssues: 12,
    issuesTrend: 2,

    painPoints: [
      {
        id: '1',
        issue: 'Onboarding process is confusing',
        frequency: 34,
        severity: 'high',
        sentiment: 'negative',
        confidence: 0.95,
        evidenceCount: 12,
      },
      {
        id: '2',
        issue: 'Application performance is slow',
        frequency: 28,
        severity: 'high',
        sentiment: 'negative',
        confidence: 0.88,
        evidenceCount: 9,
      },
      {
        id: '3',
        issue: 'No mobile app or mobile experience',
        frequency: 18,
        severity: 'medium',
        sentiment: 'negative',
        confidence: 0.82,
        evidenceCount: 7,
      },
      {
        id: '4',
        issue: 'Limited customization options',
        frequency: 12,
        severity: 'medium',
        sentiment: 'negative',
        confidence: 0.75,
        evidenceCount: 5,
      },
      {
        id: '5',
        issue: 'Excellent customer support',
        frequency: 21,
        severity: 'low',
        sentiment: 'positive',
        confidence: 0.91,
        evidenceCount: 8,
      },
    ],

    themes: [
      {
        id: 'theme-1',
        name: 'Usability Issues',
        description: 'Customers struggle with UI/UX complexity and navigation',
        frequency: 24,
        painPoints: ['Onboarding confusion', 'Complex feature set'],
      },
      {
        id: 'theme-2',
        name: 'Performance Concerns',
        description: 'Application slowness affecting user experience and productivity',
        frequency: 18,
        painPoints: ['Slow load times', 'Laggy interactions'],
      },
      {
        id: 'theme-3',
        name: 'Mobile Gap',
        description: 'Lack of mobile-first experience limiting accessibility',
        frequency: 15,
        painPoints: ['No mobile app', 'Poor mobile web'],
      },
    ],

    recentUploads: [
      {
        id: 'upload-1',
        filename: 'customer_interviews_jan_2024.pdf',
        uploadedAt: '2 hours ago',
        status: 'completed',
        documentsProcessed: 5,
        insightsExtracted: 34,
      },
      {
        id: 'upload-2',
        filename: 'support_tickets_export.csv',
        uploadedAt: '1 day ago',
        status: 'completed',
        documentsProcessed: 128,
        insightsExtracted: 12,
      },
      {
        id: 'upload-3',
        filename: 'user_survey_responses.xlsx',
        uploadedAt: '3 days ago',
        status: 'completed',
        documentsProcessed: 89,
        insightsExtracted: 28,
      },
    ],


    risks: [
      {
        id: 'risk-1',
        name: 'Churn Rate Increasing',
        description: 'Churn has increased from 8% to 12% month-over-month',
        severity: 'critical',
        confidence: 0.92,
      },
      {
        id: 'risk-2',
        name: 'Feature Adoption Declining',
        description: '67% onboarding drop-off indicates critical UX issue',
        severity: 'critical',
        confidence: 0.95,
      },
      {
        id: 'risk-3',
        name: 'Negative Sentiment Spike',
        description: 'Negative sentiment increased from 35% to 50% last week',
        severity: 'high',
        confidence: 0.88,
      },
      {
        id: 'risk-4',
        name: 'Support Volume Increasing',
        description: 'Support tickets up 25% with common themes around onboarding',
        severity: 'high',
        confidence: 0.85,
      },
    ],

    recommendations: [
      {
        id: 'rec-1',
        action: 'Redesign onboarding flow to reduce 67% signup drop-off',
        priority: 'critical',
        confidence: 0.95,
        businessImpact: 'Could reduce churn by 10-15%',
        customerImpact: 'Affects 80% of new users',
        effort: 'large',
        supporting_quotes: [
          'Getting started is really confusing',
          'Took me 2 hours to understand the basics',
          'The onboarding process is overwhelming',
        ],
      },
      {
        id: 'rec-2',
        action: 'Implement mobile app or responsive mobile web',
        priority: 'high',
        confidence: 0.88,
        businessImpact: 'Access new market, 30% revenue growth',
        customerImpact: 'Enables 40% of users on mobile',
        effort: 'xlarge',
        supporting_quotes: [
          'No mobile app is a deal-breaker',
          'I need to use this on mobile',
          'Mobile support is critical for us',
        ],
      },
      {
        id: 'rec-3',
        action: 'Optimize performance - target 50% faster load times',
        priority: 'high',
        confidence: 0.82,
        businessImpact: 'Increase retention by 8-12%',
        customerImpact: 'Better UX for all users',
        effort: 'large',
        supporting_quotes: [
          'The app is way too slow',
          'It takes forever to load',
          'Performance issues are frustrating',
        ],
      },
    ],

    conversationHistory: [
      {
        id: 'conv-1',
        userMessage: 'What should we build next?',
        aiResponse:
          'Based on customer feedback analysis, your top 3 priorities are:\n\n1. **Onboarding Redesign (Confidence: 95%)** - 34 customers mentioned onboarding confusion, correlating with 67% signup drop-off.\n\n2. **Mobile Experience (Confidence: 88%)** - 18 customers requested mobile support. This could unlock 30% revenue growth.\n\n3. **Performance Optimization (Confidence: 82%)** - 28 customers complained about slow application performance.\n\nEstimated combined impact: 15-20% churn reduction if all three are addressed.',
        createdAt: '2 hours ago',
      },
      {
        id: 'conv-2',
        userMessage: 'Why are customers leaving?',
        aiResponse:
          'Churn analysis reveals these primary factors:\n\n• **Onboarding friction (40%)** - Users struggle with initial setup, leading to early abandonment\n• **Performance issues (28%)** - Slow load times and laggy interactions reduce satisfaction\n• **Missing mobile (22%)** - Users need on-the-go access\n• **Feature gaps (10%)** - Limited customization vs. competitors\n\nTop action: Fix onboarding first - it has the highest impact and fastest implementation timeline.',
        createdAt: '1 day ago',
      },
    ],

    personas: [
      {
        id: 'persona-1',
        role: 'Product Manager',
        company_size: 'enterprise',
        sentiment: 'negative',
        main_pain_points: ['Complex workflows', 'Limited analytics'],
        frequency: 12,
      },
      {
        id: 'persona-2',
        role: 'Engineering Lead',
        company_size: 'startup',
        sentiment: 'neutral',
        main_pain_points: ['Poor API docs', 'Performance issues'],
        frequency: 8,
      },
      {
        id: 'persona-3',
        role: 'Operations Manager',
        company_size: 'smb',
        sentiment: 'negative',
        main_pain_points: ['Expensive pricing', 'Limited support'],
        frequency: 5,
      },
    ],

    analyticsMetrics: [
      {
        metric: 'Bounce Rate',
        current: '45%',
        previous: '40%',
        trend: 'up',
        correlation: 'Correlated with "confusing UI" feedback',
      },
      {
        metric: 'Conversion Rate',
        current: '3.2%',
        previous: '3.8%',
        trend: 'down',
        correlation: 'Linked to onboarding complaints',
      },
      {
        metric: 'Churn Rate',
        current: '12%',
        previous: '8%',
        trend: 'up',
        correlation: 'Driven by performance and UX issues',
      },
      {
        metric: 'Session Duration',
        current: '4.8m',
        previous: '5.2m',
        trend: 'down',
        correlation: 'Related to slowness complaints',
      },
    ],
  };
}

export function getSampleInsightsList() {
  return [
    {
      id: '1',
      type: 'pain_point',
      content: 'Onboarding complexity is causing 67% signup drop-off',
      confidence: 0.95,
      frequency: 34,
      severity: 'critical',
    },
    {
      id: '2',
      type: 'pain_point',
      content: 'Application performance degradation affecting user retention',
      confidence: 0.88,
      frequency: 28,
      severity: 'high',
    },
    {
      id: '3',
      type: 'theme',
      content: 'Usability Issues - Customers struggle with UI complexity',
      confidence: 0.85,
      frequency: 24,
      severity: 'high',
    },
    {
      id: '4',
      type: 'recommendation',
      content: 'Implement mobile-first responsive design',
      confidence: 0.82,
      frequency: 18,
      severity: 'high',
    },
  ];
}

export function getSampleRisks() {
  return [
    {
      id: 'risk-1',
      name: 'Critical: Churn Spike',
      description: 'Churn increased from 8% to 12% MoM',
      severity: 'critical',
      metric: 'churn_rate',
      correlatedPainPoints: ['Onboarding', 'Performance'],
    },
    {
      id: 'risk-2',
      name: 'High: Adoption Decline',
      description: '67% of users drop during onboarding',
      severity: 'high',
      metric: 'feature_adoption',
      correlatedPainPoints: ['Onboarding', 'UI Complexity'],
    },
    {
      id: 'risk-3',
      name: 'High: Negative Sentiment',
      description: 'Sentiment degraded from 60% positive to 40%',
      severity: 'high',
      metric: 'sentiment',
      correlatedPainPoints: ['Performance', 'Support Quality'],
    },
  ];
}

export function getSampleReports() {
  return [
    {
      id: 'report-1',
      name: 'Weekly Product Discovery Report',
      type: 'weekly',
      generatedAt: '2024-01-15',
      insights: 34,
      recommendations: 8,
    },
    {
      id: 'report-2',
      name: 'Executive Summary',
      type: 'executive',
      generatedAt: '2024-01-15',
      insights: 12,
      recommendations: 5,
    },
    {
      id: 'report-3',
      name: 'Risk Assessment',
      type: 'risk',
      generatedAt: '2024-01-14',
      insights: 6,
      recommendations: 4,
    },
  ];
}
