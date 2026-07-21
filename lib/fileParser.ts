/**
 * File Parser - Extracts text from uploaded files
 * Supports PDF, TXT, CSV, DOCX with real parsing libraries.
 * Uses dynamic imports to prevent Turbopack browser/server bundling conflicts.
 */

export interface ParsedFileContent {
  text: string;
  chunks: string[];
  metadata: {
    fileType: string;
    characterCount: number;
    chunkCount: number;
    extractedAt: string;
  };
}

export interface CSVData {
  headers: string[];
  rows: Array<Record<string, any>>;
  text: string;
}

/**
 * Parse PDF file and extract text using pdf-parse
 */
export async function parsePDF(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import prevents Turbopack from bundling browser-specific code
    const pdfParseModule = await import('pdf-parse');
    const pdfParse = pdfParseModule.default || pdfParseModule;
    
    const data = await pdfParse(buffer);
    const text = data.text?.trim();
    if (!text) {
      throw new Error('No text content could be extracted from this PDF. It may be image-based or encrypted.');
    }
    return text;
  } catch (error: any) {
    console.error('Error parsing PDF:', error);
    // Fallback: try to read as plain text
    const fallback = buffer.toString('utf-8').trim();
    if (fallback && fallback.length > 50 && !fallback.includes('\x00')) {
      return fallback;
    }
    throw new Error('Failed to parse PDF file. Ensure the PDF contains selectable text.');
  }
}

/**
 * Parse text file
 */
export async function parseText(buffer: Buffer): Promise<string> {
  let text = buffer.toString('utf-8');
  if (!text) {
    text = buffer.toString('latin1');
  }
  if (!text || text.trim().length === 0) {
    throw new Error('Text file appears to be empty.');
  }
  return text;
}

/**
 * Parse DOCX file and extract text
 */
export async function parseDOCX(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import for mammoth
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value?.trim();
    if (!text) {
      throw new Error('No text content could be extracted from this DOCX file.');
    }
    return text;
  } catch (error: any) {
    console.error('Error parsing DOCX:', error);
    throw new Error('Failed to parse DOCX file');
  }
}

/**
 * Parse CSV file and extract text
 */
export async function parseCSV(buffer: Buffer): Promise<CSVData> {
  try {
    // Dynamic import for papaparse
    const Papa = (await import('papaparse')).default;
    const csvText = buffer.toString('utf-8');

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results: any) => {
          const headers = results.meta.fields || [];
          const rows = results.data || [];

          let text = '';
          if (headers.length > 0) {
            text += headers.join(' | ') + '\n';
            text += '─'.repeat(50) + '\n';
          }

          for (const row of rows) {
            const rowValues = headers.map((h: string) => (row[h] ? String(row[h]).trim() : ''));
            text += rowValues.join(' | ') + '\n';
          }

          resolve({ headers, rows, text });
        },
        error: (error: any) => {
          reject(new Error(`CSV parsing error: ${error.message}`));
        },
      });
    });
  } catch (error: any) {
    console.error('Error parsing CSV:', error);
    throw new Error('Failed to parse CSV file');
  }
}

/**
 * Chunk text into segments with overlap for processing
 */
export function chunkText(
  text: string,
  chunkSize: number = 2000,
  overlap: number = 200
): string[] {
  const chunks: string[] = [];

  if (text.length <= chunkSize) {
    return [text];
  }

  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const chunk = text.substring(start, end);
    chunks.push(chunk.trim());
    start = end - overlap;
    if (start >= text.length) break;
  }

  return chunks;
}

/**
 * Parse file based on type and return structured content
 */
export async function parseFile(
  buffer: Buffer,
  filename: string
): Promise<ParsedFileContent> {
  const fileExtension = filename.toLowerCase().split('.').pop() || '';
  let text = '';

  try {
    switch (fileExtension) {
      case 'pdf':
        text = await parsePDF(buffer);
        break;
      case 'txt':
        text = await parseText(buffer);
        break;
      case 'docx':
        text = await parseDOCX(buffer);
        break;
      case 'csv':
        const csvData = await parseCSV(buffer);
        text = csvData.text;
        break;
      default:
        throw new Error(`Unsupported file type: ${fileExtension}`);
    }

    // Clean up text
    text = text
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n\n');

    // Chunk the text
    const chunks = chunkText(text);

    return {
      text,
      chunks,
      metadata: {
        fileType: fileExtension,
        characterCount: text.length,
        chunkCount: chunks.length,
        extractedAt: new Date().toISOString(),
      },
    };
  } catch (error: any) {
    console.error('Error parsing file:', error);
    throw error;
  }
}

/**
 * Validate file before parsing
 */
export function validateFile(
  filename: string,
  size: number,
  maxSizeMB: number = 50
): { valid: boolean; error?: string } {
  const validExtensions = ['.pdf', '.txt', '.csv', '.docx'];
  const fileExtension = filename.toLowerCase().split('.').pop();
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (!fileExtension || !validExtensions.includes(`.${fileExtension}`)) {
    return {
      valid: false,
      error: `Unsupported file type: .${fileExtension}`,
    };
  }

  if (size > maxSizeBytes) {
    return {
      valid: false,
      error: `File too large: ${(size / (1024 * 1024)).toFixed(2)}MB exceeds ${maxSizeMB}MB limit`,
    };
  }

  if (size === 0) {
    return {
      valid: false,
      error: 'File is empty',
    };
  }

  return { valid: true };
}