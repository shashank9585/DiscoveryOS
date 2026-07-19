/**
 * AI Service - Handles all AI-powered operations
 * Uses OpenAI API for MVP
 * For hackathon: uses mock responses if API key not available
 */

import axios from 'axios';

export interface ExtractedInsights {
  painPoints: Array<{
    issue: string;
    category: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    sentiment: 'negative' | 'neutral' | 'positive';
    frequency?: number;
  }>;
  themes: Array<{
    name: string;
    description: string;
    painPoints: string[];
    frequency: number;
  }>;
  personas: Array<{
    role: string;
    company_size: 'enterprise' | 'smb' | 'startup';
    pain_points: string[];
  }>;
  sentimentAnalysis: {
    overall: 'positive' | 'neutral' | 'negative';
    positivePercentage: number;
    neutralPercentage: number;
    negativePercentage: number;
  };
}

export interface GeneratedRecommendation {
  action: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  reasoning: string;
  confidenceScore: number;
  businessImpact: string;
  customerImpact: string;
  estimatedEffort: 'small' | 'medium' | 'large' | 'xlarge';
  supportingQuotes: string[];
}

class AIService {
  private apiKey: string;
  private baseUrl: string = 'https://api.openai.com/v1';
  private model: string = 'gpt-3.5-turbo';
  private useMock: boolean;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
    this.useMock = !this.apiKey;
  }

  /**
   * Extract insights from customer feedback
   */
  async extractInsights(feedbackText: string): Promise<ExtractedInsights> {
    if (this.useMock) {
      return this.generateMockInsights(feedbackText);
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: `You are a product research analyst. Extract key insights from customer feedback.
              
Return valid JSON only with this structure:
{
  "painPoints": [{"issue": "string", "category": "string", "severity": "critical|high|medium|low", "sentiment": "negative|neutral|positive"}],
  "themes": [{"name": "string", "description": "string", "painPoints": ["string"], "frequency": number}],
  "personas": [{"role": "string", "company_size": "enterprise|smb|startup", "pain_points": ["string"]}],
  "sentimentAnalysis": {"overall": "positive|neutral|negative", "positivePercentage": number, "neutralPercentage": number, "negativePercentage": number}
}`,
            },
            {
              role: 'user',
              content: `Extract insights from this feedback:\n\n${feedbackText}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const content = response.data.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      console.error('Error extracting insights:', error);
      return this.generateMockInsights(feedbackText);
    }
  }

  /**
   * Generate recommendations based on insights
   */
  async generateRecommendations(
    insights: ExtractedInsights,
    analyticsData?: Record<string, any>
  ): Promise<GeneratedRecommendation[]> {
    if (this.useMock) {
      return this.generateMockRecommendations(insights);
    }

    try {
      const analyticsContext = analyticsData
        ? `\n\nAnalytics Data:\n${JSON.stringify(analyticsData, null, 2)}`
        : '';

      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: `You are a product strategy expert. Generate prioritized roadmap recommendations based on customer insights.
              
Return a JSON array with this structure:
[{
  "action": "string (specific, actionable item)",
  "priority": "critical|high|medium|low",
  "reasoning": "string (why this matters)",
  "confidenceScore": number (0-1),
  "businessImpact": "string",
  "customerImpact": "string",
  "estimatedEffort": "small|medium|large|xlarge",
  "supportingQuotes": ["quote1", "quote2"]
}]`,
            },
            {
              role: 'user',
              content: `Based on these insights, generate recommendations:\n\n${JSON.stringify(insights, null, 2)}${analyticsContext}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const content = response.data.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return this.generateMockRecommendations(insights);
    }
  }

  /**
   * Query assistant - Answer questions about the data using RAG
   */
  async queryAssistant(question: string, context: string): Promise<string> {
    if (this.useMock) {
      return this.generateMockResponse(question, context);
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: `You are a Product Intelligence AI assistant. Answer questions about customer feedback and product data.
Always cite specific evidence and provide confidence scores when making claims.
Be concise and data-driven.`,
            },
            {
              role: 'user',
              content: `Context:\n${context}\n\nQuestion: ${question}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 1500,
          stream: false,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error querying assistant:', error);
      return this.generateMockResponse(question, context);
    }
  }

  /**
   * Generate mock insights for MVP/testing
   */
  private generateMockInsights(feedbackText: string): ExtractedInsights {
    const textLower = feedbackText.toLowerCase();
    const hasOnboarding = textLower.includes('onboarding') || textLower.includes('getting started');
    const hasPerformance = textLower.includes('slow') || textLower.includes('performance');
    const hasMobile = textLower.includes('mobile') || textLower.includes('app');

    return {
      painPoints: [
        {
          issue: hasOnboarding ? 'Onboarding process is confusing' : 'Complex feature set',
          category: hasOnboarding ? 'onboarding' : 'usability',
          severity: 'high',
          sentiment: 'negative',
          frequency: Math.floor(Math.random() * 20) + 5,
        },
        {
          issue: hasPerformance ? 'Application is slow' : 'Lack of mobile support',
          category: hasPerformance ? 'performance' : 'feature_gap',
          severity: 'high',
          sentiment: 'negative',
          frequency: Math.floor(Math.random() * 15) + 3,
        },
        {
          issue: hasMobile ? 'No mobile app available' : 'Limited customization',
          category: hasMobile ? 'mobile' : 'feature_gap',
          severity: 'medium',
          sentiment: 'negative',
          frequency: Math.floor(Math.random() * 10) + 2,
        },
      ],
      themes: [
        {
          name: 'Usability Issues',
          description: 'Customers struggle with UI/UX complexity',
          painPoints: ['Complex feature set', 'Navigation confusion'],
          frequency: 15,
        },
        {
          name: 'Performance Concerns',
          description: 'Application slowness affecting user experience',
          painPoints: ['Slow load times', 'Laggy interactions'],
          frequency: 12,
        },
        {
          name: 'Mobile Gap',
          description: 'Lack of mobile experience',
          painPoints: ['No mobile app', 'Poor mobile web'],
          frequency: 9,
        },
      ],
      personas: [
        {
          role: 'Product Manager',
          company_size: 'enterprise',
          pain_points: ['Complex workflows', 'Limited analytics'],
        },
        {
          role: 'Engineering Lead',
          company_size: 'startup',
          pain_points: ['Poor API documentation', 'Performance issues'],
        },
        {
          role: 'Operations Manager',
          company_size: 'smb',
          pain_points: ['Expensive pricing', 'Limited support'],
        },
      ],
      sentimentAnalysis: {
        overall: 'negative',
        positivePercentage: 15,
        neutralPercentage: 35,
        negativePercentage: 50,
      },
    };
  }

  /**
   * Generate mock recommendations
   */
  private generateMockRecommendations(
    insights: ExtractedInsights
  ): GeneratedRecommendation[] {
    return [
      {
        action: 'Redesign onboarding flow to reduce 67% signup drop-off',
        priority: 'critical',
        reasoning: 'Customers consistently mention onboarding confusion. Analytics show high drop-off.',
        confidenceScore: 0.95,
        businessImpact: 'Could reduce churn by 10-15%',
        customerImpact: 'Affects 80% of new users',
        estimatedEffort: 'large',
        supportingQuotes: [
          'Getting started is really confusing',
          'Took me 2 hours to understand the basics',
          'Setup process is overwhelming',
        ],
      },
      {
        action: 'Implement mobile app or responsive mobile web experience',
        priority: 'high',
        reasoning: 'Multiple customers requesting mobile support, increasing market demand',
        confidenceScore: 0.88,
        businessImpact: 'Access new market segment, 30% revenue growth potential',
        customerImpact: 'Enables 40% of users working on mobile devices',
        estimatedEffort: 'xlarge',
        supportingQuotes: [
          'No mobile app is a deal-breaker',
          'I need to use this on the go',
          'Mobile version would be critical for us',
        ],
      },
      {
        action: 'Optimize performance - target 50% faster load times',
        priority: 'high',
        reasoning: 'Performance complaints directly correlate with session drop-off',
        confidenceScore: 0.82,
        businessImpact: 'Increase retention by 8-12%',
        customerImpact: 'Improves experience for all users',
        estimatedEffort: 'large',
        supportingQuotes: [
          'The app is really slow',
          'It takes forever to load',
          'Laggy interactions frustrate me',
        ],
      },
      {
        action: 'Expand API documentation and add code examples',
        priority: 'medium',
        reasoning: 'Engineering leads cite poor API docs as barrier to adoption',
        confidenceScore: 0.75,
        businessImpact: 'Unlock developer adoption channel',
        customerImpact: 'Enables technical integration use cases',
        estimatedEffort: 'small',
        supportingQuotes: ['API docs are incomplete', 'No examples for common use cases'],
      },
    ];
  }

  /**
   * Generate mock response for query assistant
   */
  private generateMockResponse(question: string, context: string): string {
    const questionLower = question.toLowerCase();

    if (questionLower.includes('build') || questionLower.includes('next')) {
      return `Based on customer feedback analysis, here are the top priorities:\n\n1. **Onboarding Redesign (Confidence: 95%)** - Mentioned by 34 customers, directly correlates with 67% signup drop-off. Estimated impact: 10-15% churn reduction.\n\n2. **Mobile Experience (Confidence: 88%)** - 28 customers requested mobile support. Could unlock 30% revenue growth.\n\n3. **Performance Optimization (Confidence: 82%)** - Slowness complaints correlate with declining session duration. 50% improvement target.`;
    }

    if (questionLower.includes('why') || questionLower.includes('churn') || questionLower.includes('leaving')) {
      return `Customer churn analysis reveals three primary factors:\n\n• **Onboarding friction (40%)** - Users struggle with initial setup\n• **Performance issues (28%)** - Slow load times and laggy interactions\n• **Missing mobile support (22%)** - Users need on-the-go access\n• **Feature gaps (10%)** - Limited customization options\n\nRecommendation: Prioritize onboarding redesign for immediate impact.`;
    }

    if (questionLower.includes('pain') || questionLower.includes('problem')) {
      return `Top customer pain points:\n\n1. **Onboarding Complexity** (High severity, 34 mentions)\n   - Users struggle with initial setup\n   - Directly impacts new customer retention\n\n2. **Performance** (High severity, 28 mentions)\n   - Application slowness affects productivity\n   - Correlates with declining session duration\n\n3. **Mobile Experience** (Medium severity, 18 mentions)\n   - No mobile app available\n   - Mobile web experience is limited\n\n4. **Feature Gaps** (Medium severity, 12 mentions)\n   - Limited customization options\n   - Missing advanced analytics`;
    }

    return `Based on the analysis of customer feedback:\n\n• We've identified 3 major themes affecting customer satisfaction\n• Onboarding issues are the top priority with 95% confidence\n• Performance optimization could improve retention by 8-12%\n• Mobile support is the second highest priority request\n\nWould you like more details on any specific area?`;
  }
}

// Export singleton instance
export const aiService = new AIService();
