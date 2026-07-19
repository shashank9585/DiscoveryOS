/**
 * API Free LLM Service Integration
 * Integrates with apifreellm.com API
 * API Key: apf_qwy2n598j33z8p14ri8omuph
 * Rate limit: 1 request every 20 seconds
 * Context: 32k tokens (free tier)
 */

const API_KEY = 'apf_qwy2n598j33z8p14ri8omuph';
const API_ENDPOINT = 'https://apifreellm.com/api/v1/chat';
const RATE_LIMIT_DELAY = 25000; // 25 seconds to be safe (20 sec + buffer)

let lastRequestTime = 0;

interface LLMResponse {
  success: boolean;
  response: string;
  tier: string;
  features?: {
    unlimited: boolean;
    delaySeconds: number;
    priorityProcessing: boolean;
  };
  error?: string;
}

interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

/**
 * Make a request to API Free LLM
 */
export async function callLLM(message: string): Promise<LLMResponse> {
  // Check rate limit
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    const waitTime = RATE_LIMIT_DELAY - timeSinceLastRequest;
    console.log(`Rate limited. Waiting ${waitTime}ms before next request...`);
    await new Promise((resolve) => setTimeout(resolve, waitTime));
  }

  lastRequestTime = Date.now();

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        message: message,
        model: 'apifreellm',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json() as Record<string, unknown>;
      console.error('API Error:', errorData);

      if (response.status === 429) {
        return {
          success: false,
          response: 'Rate limited. Please wait 20 seconds before trying again.',
          tier: 'free',
          error: 'RATE_LIMITED',
        };
      }

      if (response.status === 401) {
        return {
          success: false,
          response: 'Invalid API key. Please check your configuration.',
          tier: 'free',
          error: 'INVALID_API_KEY',
        };
      }

      if (response.status === 400) {
        return {
          success: false,
          response: 'Bad request. Missing or invalid parameters.',
          tier: 'free',
          error: 'BAD_REQUEST',
        };
      }

      return {
        success: false,
        response: `API Error: ${response.statusText}`,
        tier: 'free',
        error: 'API_ERROR',
      };
    }

    const data: LLMResponse = await response.json() as LLMResponse;
    return data;
  } catch (error) {
    console.error('Failed to call LLM API:', error);
    return {
      success: false,
      response: `Failed to connect to AI service: ${error instanceof Error ? error.message : 'Unknown error'}`,
      tier: 'free',
      error: 'CONNECTION_ERROR',
    };
  }
}

/**
 * Generate AI insights based on customer feedback
 */
export async function generateInsights(feedbackText: string): Promise<string> {
  const prompt = `You are an AI Product Intelligence Assistant analyzing customer feedback for DiscoveryOS.

Customer Feedback:
${feedbackText}

Please provide:
1. Top 3 pain points from this feedback
2. Recommended actions with confidence scores
3. Business impact assessment
4. Customer segments affected

Be concise and analytical. Format as bullet points.`;

  const response = await callLLM(prompt);

  if (!response.success) {
    return `Failed to generate insights: ${response.response}`;
  }

  return response.response;
}

/**
 * Ask AI a question about the data
 */
export async function askAI(question: string, context?: string): Promise<string> {
  const prompt = context ? `${context}\n\nQuestion: ${question}` : question;

  const response = await callLLM(prompt);

  if (!response.success) {
    return `Failed to get AI response: ${response.response}`;
  }

  return response.response;
}

/**
 * Generate recommendations based on data
 */
export async function generateRecommendations(
  painPoints: string[],
  metrics: Record<string, unknown>
): Promise<string> {
  const metricsText = Object.entries(metrics)
    .map(([key, value]) => `- ${key}: ${value}`)
    .join('\n');

  const prompt = `As a Product Intelligence AI for DiscoveryOS, analyze this data and provide prioritized recommendations:

Pain Points:
${painPoints.map((p) => `- ${p}`).join('\n')}

Current Metrics:
${metricsText}

Provide:
1. Top 3 priority recommendations
2. Confidence score for each (0-100%)
3. Expected business impact
4. Implementation difficulty (Low/Medium/High)

Format as a structured list.`;

  const response = await callLLM(prompt);

  if (!response.success) {
    return `Failed to generate recommendations: ${response.response}`;
  }

  return response.response;
}

/**
 * Summarize customer feedback
 */
export async function summarizeFeedback(feedback: string[]): Promise<string> {
  const feedbackText = feedback.join('\n\n');

  const prompt = `Summarize the following customer feedback concisely, highlighting key themes and sentiments:

${feedbackText}

Provide a 3-4 sentence executive summary.`;

  const response = await callLLM(prompt);

  if (!response.success) {
    return `Failed to summarize feedback: ${response.response}`;
  }

  return response.response;
}

/**
 * Generate a product report
 */
export async function generateReport(
  title: string,
  data: Record<string, unknown>
): Promise<string> {
  const prompt = `Generate a professional ${title} based on this data:

${JSON.stringify(data, null, 2)}

Format as a structured report with:
- Executive Summary
- Key Findings
- Recommendations
- Risk Assessment

Make it actionable and data-driven.`;

  const response = await callLLM(prompt);

  if (!response.success) {
    return `Failed to generate report: ${response.response}`;
  }

  return response.response;
}

export type { LLMResponse, AIMessage };
