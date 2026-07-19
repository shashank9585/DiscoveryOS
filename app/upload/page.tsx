'use client';

import { useState, useRef } from 'react';
import { UploadZone } from '@/components/UploadZone';
import { Cloud, CheckCircle2, AlertCircle, Loader } from 'lucide-react';

export default function UploadPage() {
  const [uploads, setUploads] = useState<any[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleUpload = async (files: File[]) => {
    setProcessing(true);

    // Simulate file upload and processing
    for (const file of files) {
      const uploadRecord = {
        id: Date.now(),
        filename: file.name,
        size: file.size,
        status: 'processing',
        progress: 0,
        insightsExtracted: 0,
      };

      setUploads((prev) => [...prev, uploadRecord]);

      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);

          setUploads((prev) =>
            prev.map((u) =>
              u.id === uploadRecord.id
                ? {
                    ...u,
                    status: 'success',
                    progress: 100,
                    insightsExtracted: Math.floor(Math.random() * 20) + 10,
                  }
                : u
            )
          );
        } else {
          setUploads((prev) =>
            prev.map((u) => (u.id === uploadRecord.id ? { ...u, progress } : u))
          );
        }
      }, 300);
    }

    setTimeout(() => {
      setProcessing(false);
    }, 3000);
  };

  return (
      <main className="flex-1 overflow-auto bg-background">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">📤 Upload Research</h1>
            <p className="text-muted-foreground">Upload customer feedback, interviews, surveys, and analytics</p>
          </div>

          {/* Upload Zone */}
          <UploadZone onFilesSelected={handleUpload} />

          {/* Supported Formats */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-card border rounded-lg p-4 text-center">
              <p className="text-2xl mb-2">📄</p>
              <p className="font-medium">PDF Files</p>
              <p className="text-xs text-muted-foreground mt-1">Interview transcripts, research PDFs</p>
            </div>
            <div className="bg-card border rounded-lg p-4 text-center">
              <p className="text-2xl mb-2">📋</p>
              <p className="font-medium">CSV & Excel</p>
              <p className="text-xs text-muted-foreground mt-1">Survey responses, support tickets</p>
            </div>
            <div className="bg-card border rounded-lg p-4 text-center">
              <p className="text-2xl mb-2">📝</p>
              <p className="font-medium">Text Files</p>
              <p className="text-xs text-muted-foreground mt-1">Meeting notes, transcripts</p>
            </div>
            <div className="bg-card border rounded-lg p-4 text-center">
              <p className="text-2xl mb-2">📊</p>
              <p className="font-medium">DOCX</p>
              <p className="text-xs text-muted-foreground mt-1">Word documents, reports</p>
            </div>
          </div>

          {/* Upload History */}
          {uploads.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-semibold mb-6">Recent Uploads</h2>
              <div className="space-y-3">
                {uploads.map((upload) => (
                  <div key={upload.id} className="bg-card border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1">
                        {upload.status === 'processing' && (
                          <Loader className="w-5 h-5 animate-spin text-primary" />
                        )}
                        {upload.status === 'success' && (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        )}
                        {upload.status === 'error' && (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        )}
                        <div>
                          <p className="font-medium">{upload.filename}</p>
                          <p className="text-xs text-muted-foreground">
                            {(upload.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {upload.status === 'processing'
                            ? `${Math.round(upload.progress)}%`
                            : `${upload.insightsExtracted} insights`}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {upload.status}
                        </p>
                      </div>
                    </div>

                    {upload.status === 'processing' && (
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${upload.progress}%` }}
                        />
                      </div>
                    )}

                    {upload.status === 'success' && (
                      <div className="flex gap-2">
                        <button className="text-xs px-3 py-1 border rounded hover:bg-muted">
                          View Insights
                        </button>
                        <button className="text-xs px-3 py-1 border rounded hover:bg-muted">
                          Download Report
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">💡 Tips for Best Results</h3>
            <ul className="space-y-2 text-sm text-blue-900">
              <li>• Upload multiple files together for better theme clustering</li>
              <li>• Include diverse sources (interviews, surveys, support tickets) for balanced insights</li>
              <li>• Ensure files are in English for optimal AI processing</li>
              <li>• Files up to 50MB are supported</li>
              <li>• Processing typically takes 1-2 minutes per file</li>
            </ul>
          </div>
        </div>
      </main>
    );
}

