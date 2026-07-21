/**
 * AI Chat API Route - Handles user questions using Groq
 * Receives the question + optional context data and uses
 * Groq to answer based on actual uploaded data.
 */

import { NextRequest, NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, context } = body;

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    if (!context || !context.documentNames || context.documentNames.length === 0) {
      return NextResponse.json({
        answer: "I don't have any data to analyze yet. Please upload some documents (interviews, surveys, support tickets, etc.) first, and then I can answer questions based on the real insights extracted from them.",
        sources: [],
        confidence: 0,
      });
    }

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

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant that answers questions about product intelligence data and returns strictly formatted JSON responses.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.4,
      response_format: { type: "json_object" }
    });

    const rawResponse = completion.choices[0]?.message?.content || '{}';
    const cleanJson = rawResponse.replace(/^```json\n?|\n?```$/g, '').trim();
    const result = JSON.parse(cleanJson);

    return NextResponse.json(result);
  } catch (error) {
    console.error('AI Chat error:', error);
    const errorMessage = error instanceof Error ? error.message : 'AI query failed';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
