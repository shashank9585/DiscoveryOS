import Papa from 'papaparse';
import mammoth from 'mammoth';


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
 * Parse PDF file and extract text
/**
 * Parse PDF file and extract text
 * For MVP, we'll treat PDFs as plain text or skip PDF parsing
 */
export async function parsePDF(buffer: Buffer): Promise<string> {
  try {
    // For MVP, we just convert to string (in production, use pdf-parse)
    const text = buffer.toString('utf-8');
    if (text) return text;
    
    // Fallback: return generic message
    return 'PDF file uploaded successfully. (Full PDF parsing requires pdf-parse library)';
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file');
  }
}

/**
 * Parse text file
 */
export async function parseText(buffer: Buffer): Promise<string> {
  try {
    // Try UTF-8 first
    let text = buffer.toString('utf-8');

    // If that fails, try latin1
    if (!text) {
      text = buffer.toString('latin1');
    }

    return text;
  } catch (error) {
    console.error('Error parsing text file:', error);
    throw new Error('Failed to parse text file');
  }
}

/**
 * Parse DOCX file and extract text
 */
export async function parseDOCX(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error('Error parsing DOCX:', error);
    throw new Error('Failed to parse DOCX file');
  }
}

/**
 * Parse CSV file and extract text
 */
export async function parseCSV(buffer: Buffer): Promise<CSVData> {
  try {
    const csvText = buffer.toString('utf-8');

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results: any) => {
          const headers = results.meta.fields || [];
          const rows = results.data || [];

          // Convert CSV to readable text format
          let text = '';

          // Add headers
          if (headers.length > 0) {
            text += headers.join(' | ') + '\n';
            text += '─'.repeat(50) + '\n';
          }

          // Add rows
          for (const row of rows) {
            const rowValues = headers.map((h: string) => (row[h] ? String(row[h]).trim() : ''));
            text += rowValues.join(' | ') + '\n';
          }

          resolve({
            headers,
            rows,
            text,
          });
        },
        error: (error: any) => {
          reject(new Error(`CSV parsing error: ${error.message}`));
        },
      });
    });
  } catch (error) {
    console.error('Error parsing CSV:', error);
    throw new Error('Failed to parse CSV file');
  }
}

/**
 * Chunk text into segments with overlap
 * @param text - Text to chunk
 * @param chunkSize - Size of each chunk in characters (default: 2000)
 * @param overlap - Number of overlapping characters between chunks (default: 200)
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

    // Move start position forward, accounting for overlap
    start = end - overlap;

    // Prevent infinite loops
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
  } catch (error) {
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
