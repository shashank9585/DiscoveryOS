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

    // Updated conversational prompt that STILL enforces JSON output for the frontend
    const prompt = `You are an expert, conversational Product Intelligence Assistant. Your goal is to help the user understand their customer data naturally and insightfully.

STRICT RULES FOR YOUR RESPONSES:
1. Be conversational, professional, and concise. Do not sound like a rigid robot.
2. Directly answer the user's specific question first, then provide brief, relevant context.
3. Do NOT just list the same pain points or percentages repeatedly. Synthesize the information naturally.
4. If the user asks "why", explain the root cause based on the data, don't just repeat the stats.
5. Use natural language. Avoid excessive bolding or bullet points unless the user specifically asks for a list.
6. If you don't know the answer based on the provided data, politely say so and suggest what might help.

Here is the context from the user's uploaded documents:
${contextStr}

User Question: ${question}

You MUST return ONLY valid JSON matching this exact schema. Do not include markdown formatting like \`\`\`json.
{
  "answer": "Your detailed, conversational answer here",
  "sources": ["document names or data categories used to answer"],
  "confidence": 0.85
}`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant that answers questions about product intelligence data conversationally and returns strictly formatted JSON responses.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.6, // Balanced for natural conversation while maintaining JSON structure
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