/**
 * AI Chat API Route - Handles user questions using RAG
 * Receives the question + context (all insights from store) and
 * uses Gemini to answer based on actual uploaded data.
 */

import { NextRequest, NextResponse } from 'next/server';
import { queryWithContext } from '@/lib/geminiService';

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

    const result = await queryWithContext(question, context);

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
