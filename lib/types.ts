// lib/types.ts
export interface Project {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Feedback {
  id: string;
  project_id: string;
  content: string;
  type: 'interview' | 'survey' | 'ticket' | 'transcript' | 'note' | 'document';
  source?: string;
  created_at: string;
}

export interface Insight {
  id: string;
  project_id: string;
  category: 'pain_point' | 'feature_request' | 'theme' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  feedback_ids: string[];
  created_at: string;
}

export interface UploadedFile {
  id: string;
  project_id: string;
  filename: string;
  file_type: string;
  size: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  extracted_text?: string;
  created_at: string;
}
