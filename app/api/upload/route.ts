/**
 * Upload API Route - Handles file upload, parsing, and Groq AI insight extraction.
 */

import { NextRequest, NextResponse } from 'next/server';
import { parseFile, validateFile } from '@/lib/fileParser';
import { Groq } from 'groq-sdk';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file
    const validation = validateFile(file.name, file.size);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Parse file to extract text
    const parsed = await parseFile(buffer, file.name);

    if (!parsed.text || parsed.text.trim().length < 10) {
      return NextResponse.json(
        { error: 'File appears to be empty or contains no readable text.' },
        { status: 400 }
      );
    }

    const isCSV = file.name.toLowerCase().endsWith('.csv');

    // Send to Groq AI for insight extraction
    try {
      // Truncate text to avoid hitting Groq token limits (approx 4000 chars is safe and fast)
      const textToAnalyze = parsed.text.substring(0, 4000);

      const prompt = `You are an expert Product Manager AI. Analyze the following customer feedback and extract insights. Return ONLY valid JSON matching this exact schema. Do not include markdown formatting like \`\`\`json.

{
  "painPoints": [{"issue": "string", "severity": "low"|"medium"|"high", "frequency": number, "confidence": number, "evidenceQuotes": ["string"]}],
  "themes": [{"name": "string", "description": "string", "relatedPainPoints": ["string"], "frequency": number}],
  "personas": [{"role": "string", "companySize": "string", "sentiment": "positive"|"negative"|"neutral", "mainPainPoints": ["string"], "frequency": number}],
  "risks": [{"name": "string", "severity": "low"|"medium"|"high", "description": "string", "confidence": number}],
  "recommendations": [{"action": "string", "priority": "low"|"medium"|"high", "businessImpact": "string", "customerImpact": "string", "effort": "low"|"medium"|"high", "supportingQuotes": ["string"]}],
  "sentiment": {"overall": "positive"|"negative"|"neutral", "positivePercent": number, "neutralPercent": number, "negativePercent": number},
  "confidence_score": number
}

Customer Feedback:
${textToAnalyze}`;

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that analyzes customer feedback and returns strictly formatted JSON data.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.1,
        response_format: { type: "json_object" }
      });

      const rawResponse = completion.choices[0]?.message?.content || '{}';
      
      // Clean and parse JSON (removes markdown wrappers if Groq adds them)
      const cleanJson = rawResponse.replace(/^```json\n?|\n?```$/g, '').trim();
      const insights = JSON.parse(cleanJson);

      return NextResponse.json({
        success: true,
        filename: file.name,
        size: file.size,
        type: file.type,
        metadata: parsed.metadata,
        textPreview: parsed.text.substring(0, 300),
        insights,
        analyticsMetrics: isCSV ? { dropOffRate: 15, conversionRate: 45 } : null, // Mock fallback for CSV
        insightsCount:
          (insights.painPoints?.length || 0) +
          (insights.themes?.length || 0) +
          (insights.personas?.length || 0) +
          (insights.risks?.length || 0) +
          (insights.recommendations?.length || 0),
      });

    } catch (aiError) {
      console.error('Groq AI processing error:', aiError);
      const aiErrorMessage = aiError instanceof Error ? aiError.message : 'AI processing failed';

      return NextResponse.json({
        success: false,
        error: `File was parsed successfully but AI analysis failed: ${aiErrorMessage}`,
        filename: file.name,
        size: file.size,
        metadata: parsed.metadata,
        textPreview: parsed.text.substring(0, 300),
      }, { status: 422 });
    }
  } catch (error) {
    console.error('Upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';