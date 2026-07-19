/**
 * Database utilities and mock data store
 * For MVP, we use in-memory storage that persists to localStorage
 * This will be replaced with Supabase in production
 */

export interface Project {
  id: string;
  name: string;
  description: string;
  healthScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackItem {
  id: string;
  projectId: string;
  sourceType: 'interview' | 'survey' | 'ticket' | 'note' | 'email';
  content: string;
  customerSegment?: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  urgencyLevel: 'critical' | 'high' | 'medium' | 'low';
  createdAt: string;
}

export interface Insight {
  id: string;
  projectId: string;
  insightType: 'pain_point' | 'theme' | 'persona' | 'risk' | 'recommendation';
  content: string;
  confidenceScore: number; // 0-1
  severityLevel: 'critical' | 'high' | 'medium' | 'low';
  businessImpact: string;
  customerImpact: string;
  frequency: number;
  supportingEvidence: string[]; // feedback IDs
  createdAt: string;
}

export interface Recommendation {
  id: string;
  projectId: string;
  action: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  confidenceScore: number;
  businessImpact: string;
  customerImpact: string;
  supportingEvidence: string[];
  estimatedEffort: 'small' | 'medium' | 'large' | 'xlarge';
  status: 'new' | 'reviewed' | 'prioritized' | 'shipped';
  createdAt: string;
}

export interface AnalyticsData {
  id: string;
  projectId: string;
  metricName: string;
  metricValue: number;
  timestamp: string;
}

export interface Conversation {
  id: string;
  projectId: string;
  userMessage: string;
  aiResponse: string;
  createdAt: string;
}

// In-memory database for MVP
class DatabaseStore {
  private projects: Map<string, Project> = new Map();
  private feedbackItems: Map<string, FeedbackItem> = new Map();
  private insights: Map<string, Insight> = new Map();
  private recommendations: Map<string, Recommendation> = new Map();
  private analyticsData: Map<string, AnalyticsData> = new Map();
  private conversations: Map<string, Conversation> = new Map();

  // Project operations
  createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
    const project: Project = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.projects.set(project.id, project);
    return project;
  }

  getProject(id: string): Project | null {
    return this.projects.get(id) || null;
  }

  getAllProjects(): Project[] {
    return Array.from(this.projects.values());
  }

  // Feedback operations
  createFeedbackItem(data: Omit<FeedbackItem, 'id' | 'createdAt'>): FeedbackItem {
    const item: FeedbackItem = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    this.feedbackItems.set(item.id, item);
    return item;
  }

  getFeedbackItems(projectId: string): FeedbackItem[] {
    return Array.from(this.feedbackItems.values()).filter(
      (item) => item.projectId === projectId
    );
  }

  // Insight operations
  createInsight(data: Omit<Insight, 'id' | 'createdAt'>): Insight {
    const insight: Insight = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    this.insights.set(insight.id, insight);
    return insight;
  }

  getInsights(projectId: string): Insight[] {
    return Array.from(this.insights.values()).filter(
      (insight) => insight.projectId === projectId
    );
  }

  getInsightsByType(projectId: string, type: string): Insight[] {
    return this.getInsights(projectId).filter((insight) => insight.insightType === type);
  }

  // Recommendation operations
  createRecommendation(data: Omit<Recommendation, 'id' | 'createdAt'>): Recommendation {
    const rec: Recommendation = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    this.recommendations.set(rec.id, rec);
    return rec;
  }

  getRecommendations(projectId: string): Recommendation[] {
    return Array.from(this.recommendations.values()).filter(
      (rec) => rec.projectId === projectId
    );
  }

  // Analytics operations
  createAnalyticsData(data: Omit<AnalyticsData, 'id'>): AnalyticsData {
    const analytics: AnalyticsData = {
      ...data,
      id: uuidv4(),
    };
    this.analyticsData.set(analytics.id, analytics);
    return analytics;
  }

  getAnalyticsData(projectId: string): AnalyticsData[] {
    return Array.from(this.analyticsData.values()).filter(
      (data) => data.projectId === projectId
    );
  }

  // Conversation operations
  createConversation(data: Omit<Conversation, 'id' | 'createdAt'>): Conversation {
    const conv: Conversation = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    this.conversations.set(conv.id, conv);
    return conv;
  }

  getConversations(projectId: string): Conversation[] {
    return Array.from(this.conversations.values())
      .filter((conv) => conv.projectId === projectId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Clear all data (for testing)
  clear() {
    this.projects.clear();
    this.feedbackItems.clear();
    this.insights.clear();
    this.recommendations.clear();
    this.analyticsData.clear();
    this.conversations.clear();
  }
}

// Export singleton instance
export const db = new DatabaseStore();

// Generate UUID (simple implementation for MVP)
function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
