import React from 'react';
import { Clock, CheckCircle, AlertCircle, Loader } from 'lucide-react';

export interface UploadStatusItem {
  id: string;
  filename: string;
  uploadedAt: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress?: number;
  size?: string;
}

interface UploadStatusProps {
  uploads: UploadStatusItem[];
  maxItems?: number;
  title?: string;
}

export function UploadStatus({
  uploads,
  maxItems = 5,
  title = 'Recent Uploads',
}: UploadStatusProps) {
  const getStatusIcon = (status: string | undefined) => {
    switch (status) {
      case 'uploading':
        return <Loader className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-slate-500" />;
    }
  };


  const getStatusLabel = (status: string | undefined) => {
    if (!status) return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'uploading':
        return 'text-blue-600 dark:text-blue-400';
      case 'processing':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'completed':
        return 'text-green-600 dark:text-green-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-slate-600 dark:text-slate-400';
    }
  };


  const displayedUploads = uploads.slice(0, maxItems);

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          {title}
        </h3>
      </div>

      {displayedUploads.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="h-8 w-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No uploads yet. Start by uploading customer feedback.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedUploads.map(upload => (
            <div
              key={upload.id}
              className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-700 last:border-0"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {getStatusIcon(upload.status)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {upload.filename}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {upload.uploadedAt}
                    </p>
                    {upload.size && (
                      <>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {upload.size}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0">
                {upload.progress !== undefined && upload.status === 'uploading' && (
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-blue-500 h-full transition-all duration-300"
                        style={{ width: `${upload.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium w-8 text-right">
                      {Math.round(upload.progress)}%
                    </span>
                  </div>
                )}
                {upload.progress === undefined && (
                  <span className={`text-xs font-medium ${getStatusColor(upload.status)}`}>
                    {getStatusLabel(upload.status)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {uploads.length > maxItems && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <a
            href="/upload"
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            View all uploads ({uploads.length}) →
          </a>
        </div>
      )}
    </div>
  );
}
