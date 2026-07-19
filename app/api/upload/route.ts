import { NextRequest, NextResponse } from 'next/server';
import { parseFile, validateFile } from '@/lib/fileParser';

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

    // Parse file
    const parsed = await parseFile(buffer, file.name);

    // Return structured response
    return NextResponse.json({
      success: true,
      filename: file.name,
      size: file.size,
      type: file.type,
      metadata: parsed.metadata,
      textPreview: parsed.text.substring(0, 500),
      chunksCount: parsed.chunks.length,
      // In a real app, you'd save chunks to database or vector store
      // For now, we return metadata for testing
    });
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
