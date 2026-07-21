/**
 * Gemini AI Service - Server-side only
 * Uses @google/genai SDK to extract real insights from uploaded documents.
 * This file should ONLY be imported in API routes (server-side).
 */

import { GoogleGenAI } from '@google/genai';

// ─── Types ────────────────────────────────────────────────────

export interface AIExtractedInsights {
  painPoints: Array<{
    issue: string;
    category: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    sentiment: 'negative' | 'neutral' | 'positive';
    frequency: number;
    confidence: number;
    evidenceQuotes: string[];
  }>;
  themes: Array<{
    name: string;
    description: string;
    relatedPainPoints: string[];
    frequency: number;
  }>;
  personas: Array<{
    role: string;
    companySize: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    mainPainPoints: string[];
    frequency: number;
  }>;
  sentiment: {
    overall: 'positive' | 'neutral' | 'negative';
    positivePercent: number;
    neutralPercent: number;
    negativePercent: number;
  };
  risks: Array<{
    name: string;
    description: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    confidence: number;
  }>;
  recommendations: Array<{
    action: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    confidence: number;
    businessImpact: string;
    customerImpact: string;
    effort: string;
    supportingQuotes: string[];
  }>;
}

export interface AIQueryResponse {
  answer: string;
  sources: string[];
  confidence: number;
}

// ─── Service ──────────────────────────────────────────────────

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set. Please add it to your .env.local file.');
  }
  return new GoogleGenAI({ apiKey });
}

/**
 * Extract structured insights from document text using Gemini.
 */
export async function extractInsightsFromText(
  text: string,
  filename: string
): Promise<AIExtractedInsights> {
  const client = getClient();

  // Truncate very long texts to stay within context limits
  const maxChars = 60000;
  const truncatedText = text.length > maxChars
    ? text.substring(0, maxChars) + '\n\n[... content truncated due to length ...]'
    : text;

  const prompt = `You are an expert product research analyst. Analyze the following document and extract structured insights.

Document: "${filename}"

Content:
${truncatedText}

Extract the following and return ONLY valid JSON (no markdown, no code fences):
{
  "painPoints": [
    {
      "issue": "Clear description of the pain point",
      "category": "category like onboarding, performance, pricing, usability, etc.",
      "severity": "critical|high|medium|low",
      "sentiment": "negative|neutral|positive",
      "frequency": <estimated number of times this issue is mentioned or implied>,
      "confidence": <0.0 to 1.0 confidence score>,
      "evidenceQuotes": ["direct quote or paraphrase from the text"]
    }
  ],
  "themes": [
    {
      "name": "Theme name",
      "description": "Description of the theme",
      "relatedPainPoints": ["related pain point issues"],
      "frequency": <number>
    }
  ],
  "personas": [
    {
      "role": "User role mentioned or inferred",
      "companySize": "enterprise|smb|startup|unknown",
      "sentiment": "positive|neutral|negative",
      "mainPainPoints": ["their specific pain points"],
      "frequency": <number of mentions>
    }
  ],
  "sentiment": {
    "overall": "positive|neutral|negative",
    "positivePercent": <number 0-100>,
    "neutralPercent": <number 0-100>,
    "negativePercent": <number 0-100>
  },
  "risks": [
    {
      "name": "Risk name",
      "description": "What could go wrong based on this feedback",
      "severity": "critical|high|medium|low",
      "confidence": <0.0 to 1.0>
    }
  ],
  "recommendations": [
    {
      "action": "Specific actionable recommendation",
      "priority": "critical|high|medium|low",
      "confidence": <0.0 to 1.0>,
      "businessImpact": "Expected business impact",
      "customerImpact": "Expected customer impact",
      "effort": "small|medium|large|xlarge",
      "supportingQuotes": ["quotes from the document supporting this recommendation"]
    }
  ]
}

Important rules:
- Base ALL insights on the ACTUAL content of the document. Do NOT invent data.
- If the document doesn't contain enough information for a category, return an empty array.
- Sentiment percentages must sum to 100.
- Confidence scores should reflect how certain you are based on the evidence available.
- Each pain point must have at least one evidence quote from the actual text.
- Be specific and actionable in recommendations.`;

  const response = await client.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: {
      temperature: 0.3,
      maxOutputTokens: 8000,
    },
  });

  const responseText = response.text || '';

  // Parse JSON from response, handling potential markdown code fences
  let jsonStr = responseText.trim();
  if (jsonStr.startsWith('```json')) {
    jsonStr = jsonStr.slice(7);
  } else if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.slice(3);
  }
  if (jsonStr.endsWith('```')) {
    jsonStr = jsonStr.slice(0, -3);
  }
  jsonStr = jsonStr.trim();

  try {
    const parsed = JSON.parse(jsonStr) as AIExtractedInsights;

    // Validate and ensure sentiment sums to 100
    if (parsed.sentiment) {
      const total = parsed.sentiment.positivePercent + parsed.sentiment.neutralPercent + parsed.sentiment.negativePercent;
      if (Math.abs(total - 100) > 5) {
        // Normalize
        parsed.sentiment.positivePercent = Math.round((parsed.sentiment.positivePercent / total) * 100);
        parsed.sentiment.neutralPercent = Math.round((parsed.sentiment.neutralPercent / total) * 100);
        parsed.sentiment.negativePercent = 100 - parsed.sentiment.positivePercent - parsed.sentiment.neutralPercent;
      }
    }

    return parsed;
  } catch (parseError) {
    console.error('Failed to parse Gemini response as JSON:', parseError);
    console.error('Raw response:', responseText.substring(0, 500));
    throw new Error('AI returned invalid structured data. Please try again.');
  }
}

/**
 * Answer a user question based on the context of uploaded documents.
 * RAG-style: we provide the actual insights data as context.
 */
export async function queryWithContext(
  question: string,
  context: {
    painPoints: Array<{ issue: string; severity: string; frequency: number; evidenceQuotes: string[] }>;
    themes: Array<{ name: string; description: string }>;
    personas: Array<{ role: string; mainPainPoints: string[] }>;
    sentimentResults: Array<{ overall: string; positivePercent: number; negativePercent: number }>;
    recommendations: Array<{ action: string; priority: string; businessImpact: string }>;
    documentNames: string[];
  }
): Promise<AIQueryResponse> {
  const client = getClient();

  const contextStr = JSON.stringify(context, null, 2);

  const prompt = `You are an AI Product Intelligence Assistant for DiscoveryOS. You answer questions about customer feedback data that has been analyzed and extracted from real documents.

Here is the ACTUAL data from uploaded documents:
${contextStr}

Documents analyzed: ${context.documentNames.join(', ')}

User Question: ${question}

Instructions:
- Answer ONLY based on the actual data provided above. 
- If the data doesn't contain information relevant to the question, say so clearly.
- Cite specific evidence (pain points, sentiment data, document names) to support your answers.
- Be concise and data-driven.
- Include confidence levels where appropriate.
- Format with markdown for readability (bold, bullet points, etc.)

Return ONLY valid JSON (no markdown fences):
{
  "answer": "Your detailed answer here with markdown formatting",
  "sources": ["document names or data categories used to answer"],
  "confidence": <0.0 to 1.0 based on how well the data supports the answer>
}`;

  const response = await client.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: {
      temperature: 0.4,
      maxOutputTokens: 2000,
    },
  });

  const responseText = (response.text || '').trim();

  let jsonStr = responseText;
  if (jsonStr.startsWith('```json')) {
    jsonStr = jsonStr.slice(7);
  } else if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.slice(3);
  }
  if (jsonStr.endsWith('```')) {
    jsonStr = jsonStr.slice(0, -3);
  }
  jsonStr = jsonStr.trim();

  try {
    return JSON.parse(jsonStr) as AIQueryResponse;
  } catch {
    // If JSON parsing fails, return the raw text as the answer
    return {
      answer: responseText,
      sources: context.documentNames,
      confidence: 0.5,
    };
  }
}

/**
 * Analyze CSV analytics data and correlate with existing feedback insights.
 */
export async function analyzeAnalyticsCSV(
  csvText: string,
  existingPainPoints: Array<{ issue: string; severity: string; frequency: number }>
): Promise<{
  metrics: Array<{
    metricName: string;
    currentValue: string;
    trend: 'up' | 'down' | 'stable';
    correlation: string;
  }>;
}> {
  const client = getClient();

  const prompt = `You are a product analytics expert. Analyze this CSV data and correlate it with known customer pain points.

CSV Data:
${csvText.substring(0, 10000)}

Known Pain Points from Customer Feedback:
${JSON.stringify(existingPainPoints, null, 2)}

Extract key metrics from the CSV and correlate them with the pain points. Return ONLY valid JSON (no markdown fences):
{
  "metrics": [
    {
      "metricName": "Name of the metric from CSV",
      "currentValue": "Current value as string",
      "trend": "up|down|stable",
      "correlation": "How this metric correlates with feedback pain points"
    }
  ]
}`;

  const response = await client.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: {
      temperature: 0.3,
      maxOutputTokens: 2000,
    },
  });

  const responseText = (response.text || '').trim();
  let jsonStr = responseText;
  if (jsonStr.startsWith('```json')) jsonStr = jsonStr.slice(7);
  else if (jsonStr.startsWith('```')) jsonStr = jsonStr.slice(3);
  if (jsonStr.endsWith('```')) jsonStr = jsonStr.slice(0, -3);
  jsonStr = jsonStr.trim();

  try {
    return JSON.parse(jsonStr);
  } catch {
    return { metrics: [] };
  }
}
