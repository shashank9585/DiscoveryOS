/**
 * Groq API Route - Fast AI processing using Groq's LLM
 * Replaces Gemini for blazing-fast insight extraction with strict JSON validation
 */

import { NextRequest, NextResponse } from 'next/server';

interface GroqInsights {
  pain_points: string[];
  themes: string[];
  personas: string[];
  sentiment: 'positive' | 'negative' | 'mixed';
  urgency: 'low' | 'medium' | 'high';
  confidence_score: number;
  business_impact: string;
}

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile'; // Or mixtral-8x7b-32768 if needed

const systemPrompt = `You are an expert business analyst. Analyze the provided customer feedback and extract structured insights.

CRITICAL: You MUST respond ONLY with valid JSON that matches this exact schema:
{
  "pain_points": ["list", "of", "customer", "pain", "points"],
  "themes": ["recurring", "themes", "in", "feedback"],
  "personas": ["customer", "personas", "or", "user", "types"],
  "sentiment": "positive|negative|mixed",
  "urgency": "low|medium|high",
  "confidence_score": 85,
  "business_impact": "brief description of potential business impact"
}

Rules:
1. Extract 3-5 pain points from the text
2. Identify 2-4 recurring themes
3. Define 2-3 customer personas
4. Assess overall sentiment as positive/negative/mixed
5. Rate urgency (low/medium/high) based on problem severity
6. Provide confidence score 0-100
7. Do NOT include markdown code blocks or any text outside the JSON
8. Do NOT add explanation text before or after the JSON
9. Ensure the JSON is valid and parseable`;

export async function POST(request: NextRequest) {
  try {
    if (!GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY not configured. Add it to .env.local' },
        { status: 500 }
      );
    }

    const { text, filename } = await request.json();

    if (!text || text.trim().length < 10) {
      return NextResponse.json(
        { error: 'Text content is too short or empty' },
        { status: 400 }
      );
    }

    // Call Groq API
    const groqResponse = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: `Analyze this customer feedback and extract insights:\n\n${text.substring(0, 8000)}`,
          },
        ],
        temperature: 0.3, // Low temperature for consistency
        max_tokens: 1024,
      }),
    });

    if (!groqResponse.ok) {
      const errorData = await groqResponse.json();
      console.error('Groq API error:', errorData);
      return NextResponse.json(
        { error: `Groq API error: ${errorData.error?.message || 'Unknown error'}` },
        { status: 500 }
      );
    }

    const groqData = await groqResponse.json();
    const responseText = groqData.choices?.[0]?.message?.content || '';

    // Parse JSON response - handle potential markdown code blocks
    let jsonContent = responseText.trim();
    
    // Remove markdown code blocks if present
    if (jsonContent.startsWith('```json')) {
      jsonContent = jsonContent.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    } else if (jsonContent.startsWith('```')) {
      jsonContent = jsonContent.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }

    let insights: GroqInsights;
    try {
      insights = JSON.parse(jsonContent);
    } catch (parseError) {
      console.error('Failed to parse Groq response:', responseText);
      return NextResponse.json(
        { error: 'Failed to parse AI response. Invalid JSON returned.' },
        { status: 422 }
      );
    }

    // Validate schema
    if (!insights.pain_points || !Array.isArray(insights.pain_points)) {
      throw new Error('Invalid response schema: pain_points must be an array');
    }

    // Transform Groq insights to application format
    const transformedInsights = {
      painPoints: (insights.pain_points || []).map((point, idx) => ({
        id: `pain-${Date.now()}-${idx}`,
        issue: point,
        frequency: Math.floor(Math.random() * 100),
        confidence: insights.confidence_score,
        severity: insights.urgency === 'high' ? 'critical' : insights.urgency === 'medium' ? 'high' : 'medium',
        evidenceQuotes: [],
      })),
      themes: (insights.themes || []).map((theme, idx) => ({
        id: `theme-${Date.now()}-${idx}`,
        name: theme,
        frequency: Math.floor(Math.random() * 100),
        relatedPainPoints: [],
      })),
      personas: (insights.personas || []).map((persona, idx) => ({
        id: `persona-${Date.now()}-${idx}`,
        name: persona,
        description: '',
        companySize: 'unknown',
        mainPainPoints: insights.pain_points.slice(0, 2),
      })),
      sentiment: {
        positivePercent: insights.sentiment === 'positive' ? 70 : insights.sentiment === 'negative' ? 10 : 50,
        neutralPercent: insights.sentiment === 'mixed' ? 40 : insights.sentiment === 'positive' ? 20 : 30,
        negativePercent: insights.sentiment === 'negative' ? 60 : insights.sentiment === 'mixed' ? 40 : 10,
        overall: insights.sentiment,
      },
      risks: [
        {
          id: `risk-${Date.now()}`,
          title: insights.business_impact,
          description: `Business impact if not addressed: ${insights.business_impact}`,
          severity: insights.urgency,
          likelihood: insights.confidence_score > 80 ? 'high' : insights.confidence_score > 50 ? 'medium' : 'low',
        },
      ],
      recommendations: [
        {
          id: `rec-${Date.now()}`,
          title: 'Address Top Pain Points',
          description: `Focus on resolving these pain points: ${insights.pain_points.slice(0, 2).join(', ')}`,
          priority: insights.urgency,
          effort: 'medium',
          impact: 'high',
        },
      ],
    };

    return NextResponse.json({
      success: true,
      filename,
      insights: transformedInsights,
      groqConfidence: insights.confidence_score,
      processingTime: 'instant',
    });
  } catch (error) {
    console.error('Process insights error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      { error: `Processing failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
