/**
 * Global state management using Zustand
 * All dashboard data comes from this store, which is populated from the database.
 * NO mock data - everything is fetched/calculated from real uploads.
 */
'use client';

import { create } from 'zustand';

// ─── Types ────────────────────────────────────────────────────
export interface UploadedDocument {
  id: string;
  filename: string;
  fileType: string;
  size: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  uploadedAt: string;
  extractedText?: string;
  insightsCount?: number;
  errorMessage?: string;
}

export interface PainPoint {
  id: string;
  documentId: string;
  issue: string;
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  sentiment: 'negative' | 'neutral' | 'positive';
  frequency: number;
  confidence: number;
  evidenceQuotes: string[];
  createdAt: string;
}

export interface Theme {
  id: string;
  documentId: string;
  name: string;
  description: string;
  relatedPainPoints: string[];
  frequency: number;
  createdAt: string;
}

export interface Persona {
  id: string;
  documentId: string;
  role: string;
  companySize: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  mainPainPoints: string[];
  frequency: number;
  createdAt: string;
}

export interface SentimentResult {
  documentId: string;
  overall: 'positive' | 'neutral' | 'negative';
  positivePercent: number;
  neutralPercent: number;
  negativePercent: number;
  createdAt: string;
}

export interface RiskItem {
  id: string;
  documentId: string;
  name: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  confidence: number;
  createdAt: string;
}

export interface Recommendation {
  id: string;
  documentId: string;
  action: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  confidence: number;
  businessImpact: string;
  customerImpact: string;
  effort: string;
  supportingQuotes: string[];
  createdAt: string;
}

export interface AnalyticsMetric {
  id: string;
  documentId: string;
  metricName: string;
  currentValue: string;
  previousValue?: string;
  trend: 'up' | 'down' | 'stable';
  correlation?: string;
  createdAt: string;
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  sources?: string[];
}

// ─── Calculated Dashboard Metrics ─────────────────────────────
export interface DashboardMetrics {
  healthScore: number;
  healthTrend: number;
  satisfactionScore: number;
  satisfactionTrend: number;
  aiConfidence: number;
  confidenceTrend: number;
  activeIssues: number;
  issuesTrend: number;
  totalDocuments: number;
  totalInsights: number;
}

// ─── Store Interface ──────────────────────────────────────────
interface AppStore {
  // Data
  documents: UploadedDocument[];
  painPoints: PainPoint[];
  themes: Theme[];
  personas: Persona[];
  sentimentResults: SentimentResult[];
  risks: RiskItem[];
  recommendations: Recommendation[];
  analyticsMetrics: AnalyticsMetric[];
  conversations: ConversationMessage[];

  // UI State
  isLoading: boolean;
  isProcessing: boolean;
  processingFilename: string | null;

  // Computed from real data
  getDashboardMetrics: () => DashboardMetrics;
  hasData: () => boolean;

  // Actions
  addDocument: (doc: UploadedDocument) => void;
  updateDocument: (id: string, updates: Partial<UploadedDocument>) => void;
  addInsightsFromAI: (data: {
    documentId: string;
    painPoints: Omit<PainPoint, 'id' | 'createdAt'>[];
    themes: Omit<Theme, 'id' | 'createdAt'>[];
    personas: Omit<Persona, 'id' | 'createdAt'>[];
    sentiment: Omit<SentimentResult, 'createdAt'>;
    risks: Omit<RiskItem, 'id' | 'createdAt'>[];
    recommendations: Omit<Recommendation, 'id' | 'createdAt'>[];
  }) => void;
  addAnalyticsMetrics: (metrics: Omit<AnalyticsMetric, 'id' | 'createdAt'>[]) => void;
  addConversationMessage: (msg: Omit<ConversationMessage, 'id'>) => void;
  setLoading: (loading: boolean) => void;
  setProcessing: (processing: boolean, filename?: string | null) => void;
  clearAll: () => void;

  // Persistence
  loadFromStorage: () => void;
  saveToStorage: () => void;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

const STORAGE_KEY = 'discoveryos_data';

export const useAppStore = create<AppStore>((set, get) => ({
  // Initial empty state
  documents: [],
  painPoints: [],
  themes: [],
  personas: [],
  sentimentResults: [],
  risks: [],
  recommendations: [],
  analyticsMetrics: [],
  conversations: [],
  isLoading: false,
  isProcessing: false,
  processingFilename: null,

  // ─── Computed Dashboard Metrics (from REAL data only) ───────
  getDashboardMetrics: () => {
    const state = get();
    const { painPoints, sentimentResults, documents } = state;

    const completedDocs = documents.filter(d => d.status === 'completed');
    const totalInsights = painPoints.length + state.themes.length + state.personas.length;

    // Health Score: based on positive sentiment ratio
    let healthScore = 0;
    if (sentimentResults.length > 0) {
      const avgPositive = sentimentResults.reduce((sum, s) => sum + (s.positivePercent || 0), 0) / sentimentResults.length;
      const avgNeutral = sentimentResults.reduce((sum, s) => sum + (s.neutralPercent || 0), 0) / sentimentResults.length;
      healthScore = Math.round((avgPositive || 0) + ((avgNeutral || 0) * 0.5));
    }

    // Satisfaction Score: weighted positive percentage from sentiment
    let satisfactionScore = 0;
    if (sentimentResults.length > 0) {
      satisfactionScore = Math.round(
        sentimentResults.reduce((sum, s) => sum + (s.positivePercent || 0), 0) / sentimentResults.length
      ) || 0;
    }

    // AI Confidence: average confidence across all insights
    let aiConfidence = 0;
    if (painPoints.length > 0) {
      aiConfidence = Math.round(
        (painPoints.reduce((sum, p) => sum + (p.confidence || 0), 0) / painPoints.length) * 100
      ) || 0;
    }

    // Active Issues: count of high/critical severity pain points
    const activeIssues = painPoints.filter(
      p => p.severity === 'high' || p.severity === 'critical'
    ).length;

    // Trends: compare first half vs second half of data by timestamp
    const sortedSentiments = [...sentimentResults].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    const mid = Math.floor(sortedSentiments.length / 2);
    let healthTrend = 0;
    let satisfactionTrend = 0;
    if (mid > 0 && sortedSentiments.length > 1) {
      const firstHalf = sortedSentiments.slice(0, mid);
      const secondHalf = sortedSentiments.slice(mid);
      const firstAvgPos = firstHalf.reduce((s, r) => s + r.positivePercent, 0) / firstHalf.length;
      const secondAvgPos = secondHalf.reduce((s, r) => s + r.positivePercent, 0) / secondHalf.length;
      healthTrend = Number((secondAvgPos - firstAvgPos).toFixed(1));
      satisfactionTrend = healthTrend;
    }

    return {
      healthScore,
      healthTrend,
      satisfactionScore,
      satisfactionTrend,
      aiConfidence,
      confidenceTrend: 0,
      activeIssues,
      issuesTrend: 0,
      totalDocuments: completedDocs.length,
      totalInsights,
    };
  },

  hasData: () => {
    const state = get();
    return state.documents.filter(d => d.status === 'completed').length > 0;
  },

  // ─── Actions ────────────────────────────────────────────────
  addDocument: (doc) => {
    set((state) => ({ documents: [...state.documents, doc] }));
    get().saveToStorage();
  },

  updateDocument: (id, updates) => {
    set((state) => ({
      documents: state.documents.map(d => d.id === id ? { ...d, ...updates } : d),
    }));
    get().saveToStorage();
  },

  addInsightsFromAI: (data) => {
    const now = new Date().toISOString();
    set((state) => ({
      painPoints: [
        ...state.painPoints,
        ...data.painPoints.map(p => ({ ...p, id: generateId(), createdAt: now })),
      ],
      themes: [
        ...state.themes,
        ...data.themes.map(t => ({ ...t, id: generateId(), createdAt: now })),
      ],
      personas: [
        ...state.personas,
        ...data.personas.map(p => ({ ...p, id: generateId(), createdAt: now })),
      ],
      sentimentResults: [
        ...state.sentimentResults,
        { ...data.sentiment, createdAt: now },
      ],
      risks: [
        ...state.risks,
        ...data.risks.map(r => ({ ...r, id: generateId(), createdAt: now })),
      ],
      recommendations: [
        ...state.recommendations,
        ...data.recommendations.map(r => ({ ...r, id: generateId(), createdAt: now })),
      ],
    }));
    get().saveToStorage();
  },

  addAnalyticsMetrics: (metrics) => {
    const now = new Date().toISOString();
    set((state) => ({
      analyticsMetrics: [
        ...state.analyticsMetrics,
        ...metrics.map(m => ({ ...m, id: generateId(), createdAt: now })),
      ],
    }));
    get().saveToStorage();
  },

  addConversationMessage: (msg) => {
    set((state) => ({
      conversations: [...state.conversations, { ...msg, id: generateId() }],
    }));
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setProcessing: (processing, filename = null) =>
    set({ isProcessing: processing, processingFilename: filename }),

  clearAll: () => {
    set({
      documents: [],
      painPoints: [],
      themes: [],
      personas: [],
      sentimentResults: [],
      risks: [],
      recommendations: [],
      analyticsMetrics: [],
      conversations: [],
    });
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  },

  // ─── Persistence ────────────────────────────────────────────
  loadFromStorage: () => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        set({
          documents: data.documents || [],
          painPoints: data.painPoints || [],
          themes: data.themes || [],
          personas: data.personas || [],
          sentimentResults: data.sentimentResults || [],
          risks: data.risks || [],
          recommendations: data.recommendations || [],
          analyticsMetrics: data.analyticsMetrics || [],
        });
      }
    } catch (err) {
      console.error('Failed to load from storage:', err);
    }
  },

  saveToStorage: () => {
    if (typeof window === 'undefined') return;
    try {
      const state = get();
      const data = {
        documents: state.documents,
        painPoints: state.painPoints,
        themes: state.themes,
        personas: state.personas,
        sentimentResults: state.sentimentResults,
        risks: state.risks,
        recommendations: state.recommendations,
        analyticsMetrics: state.analyticsMetrics,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('Failed to save to storage:', err);
    }
  },
}));
