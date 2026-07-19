'use client';

import React, { useState, useCallback } from 'react';
import { Upload, X, AlertCircle, CheckCircle, Loader } from 'lucide-react';

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

interface UploadZoneProps {
  onFilesSelected?: (files: File[]) => void;
  onUploadProgress?: (fileId: string, progress: number) => void;
  onUploadComplete?: (fileId: string, result: any) => void;
  onUploadError?: (fileId: string, error: string) => void;
}

const ACCEPTED_TYPES = ['application/pdf', 'text/plain', 'text/csv', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const ACCEPTED_EXTENSIONS = ['.pdf', '.txt', '.csv', '.docx'];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function UploadZone({
  onFilesSelected,
  onUploadProgress,
  onUploadComplete,
  onUploadError,
}: UploadZoneProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!ACCEPTED_TYPES.includes(file.type) && !ACCEPTED_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext))) {
      return `File type not supported. Accepted: PDF, TXT, CSV, DOCX`;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds 50MB limit. Your file: ${(file.size / (1024 * 1024)).toFixed(2)}MB`;
    }

    return null;
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  }, []);

  const processFiles = (fileList: File[]) => {
    const newErrors: string[] = [];
    const validFiles: UploadFile[] = [];
    const validFileObjects: File[] = [];

    for (const file of fileList) {
      const error = validateFile(file);
      if (error) {
        newErrors.push(`${file.name}: ${error}`);
      } else {
        const uploadFile: UploadFile = {
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          file,
          progress: 0,
          status: 'pending',
        };
        validFiles.push(uploadFile);
        validFileObjects.push(file);
      }
    }

    setValidationErrors(newErrors);
    setFiles(prev => [...prev, ...validFiles]);

    if (validFileObjects.length > 0 && onFilesSelected) {
      onFilesSelected(validFileObjects);
      // Simulate upload for now
      uploadFiles(validFiles);
    }
  };

  const uploadFiles = async (filesToUpload: UploadFile[]) => {
    for (const uploadFile of filesToUpload) {
      try {
        // Update status to uploading
        setFiles(prev =>
          prev.map(f =>
            f.id === uploadFile.id ? { ...f, status: 'uploading' } : f
          )
        );

        // Create FormData
        const formData = new FormData();
        formData.append('file', uploadFile.file);

        // Simulate progress
        let progress = 0;
        const progressInterval = setInterval(() => {
          progress += Math.random() * 30;
          if (progress > 90) progress = 90;
          
          setFiles(prev =>
            prev.map(f =>
              f.id === uploadFile.id ? { ...f, progress: Math.min(progress, 100) } : f
            )
          );

          if (onUploadProgress) {
            onUploadProgress(uploadFile.id, Math.min(progress, 100));
          }
        }, 200);

        // Upload file
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        clearInterval(progressInterval);

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }

        const result = await response.json();

        // Mark as complete
        setFiles(prev =>
          prev.map(f =>
            f.id === uploadFile.id ? { ...f, status: 'completed', progress: 100 } : f
          )
        );

        if (onUploadComplete) {
          onUploadComplete(uploadFile.id, result);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        setFiles(prev =>
          prev.map(f =>
            f.id === uploadFile.id
              ? { ...f, status: 'error', error: errorMessage }
              : f
          )
        );

        if (onUploadError) {
          onUploadError(uploadFile.id, errorMessage);
        }
      }
    }
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const clearErrors = () => {
    setValidationErrors([]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    processFiles(selectedFiles);
    // Reset input
    e.target.value = '';
  };

  return (
    <div className="w-full space-y-6">
      {/* Drag-Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-lg border-2 border-dashed transition-all p-8 ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
            : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900'
        }`}
      >
        <input
          type="file"
          id="file-input"
          multiple
          accept=".pdf,.txt,.csv,.docx"
          onChange={handleFileInput}
          className="hidden"
        />

        <label htmlFor="file-input" className="cursor-pointer">
          <div className="flex flex-col items-center justify-center">
            <Upload className="h-12 w-12 text-slate-400 mb-3" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Drag files here or click to browse
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Supported formats: PDF, TXT, CSV, DOCX (Max 50MB each)
            </p>
          </div>
        </label>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-red-900 dark:text-red-200">
                  Validation Errors
                </h4>
                <ul className="mt-2 space-y-1">
                  {validationErrors.map((error, idx) => (
                    <li key={idx} className="text-sm text-red-800 dark:text-red-300">
                      • {error}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <button
              onClick={clearErrors}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-slate-900 dark:text-white">
            Uploaded Files ({files.length})
          </h4>
          <div className="space-y-2">
            {files.map(uploadFile => (
              <div
                key={uploadFile.id}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {uploadFile.file.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {(uploadFile.file.size / (1024 * 1024)).toFixed(2)}MB
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {uploadFile.status === 'uploading' && (
                      <Loader className="h-5 w-5 text-blue-500 animate-spin" />
                    )}
                    {uploadFile.status === 'completed' && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {uploadFile.status === 'error' && (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}

                    {uploadFile.status !== 'uploading' && uploadFile.status !== 'completed' && (
                      <button
                        onClick={() => removeFile(uploadFile.id)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                {(uploadFile.status === 'uploading' || uploadFile.status === 'pending') && (
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-500 h-full transition-all duration-300"
                      style={{ width: `${uploadFile.progress}%` }}
                    />
                  </div>
                )}

                {/* Status Text */}
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    {uploadFile.status === 'pending' && 'Pending...'}
                    {uploadFile.status === 'uploading' && `Uploading... ${Math.round(uploadFile.progress)}%`}
                    {uploadFile.status === 'completed' && 'Completed'}
                    {uploadFile.status === 'error' && 'Failed'}
                  </span>
                </div>

                {/* Error Message */}
                {uploadFile.error && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                    {uploadFile.error}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
