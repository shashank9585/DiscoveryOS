'use client';

import { useState, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { UploadZone } from '@/components/UploadZone';
import { CheckCircle2, AlertCircle, Loader, Sparkles, Download } from 'lucide-react';
import Link from 'next/link';

export default function UploadPage() {
  const {
    addDocument,
    updateDocument,
    addInsightsFromAI,
    addAnalyticsMetrics,
    setProcessing,
    documents,
  } = useAppStore();

  const [currentProcessing, setCurrentProcessing] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'direct' | 'platforms'>('direct');
  const [authenticatingPlatform, setAuthenticatingPlatform] = useState<string | null>(null);
  const [connectedPlatforms, setConnectedPlatforms] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const platformFileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  // Platform authentication handler (2-second mock)
  const handlePlatformConnect = async (platformName: string) => {
    setAuthenticatingPlatform(platformName);
    
    // Mock 2-second authentication
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setAuthenticatingPlatform(null);
    setConnectedPlatforms(prev => new Set([...prev, platformName]));
  };

  // Download sample data handler
  const handleDownloadSample = (filename: string) => {
    const link = document.createElement('a');
    link.href = `/sample-data/${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle platform export file selection
  const handlePlatformFileSelect = async (platformName: string) => {
    setSelectedPlatform(platformName);
    platformFileInputRef.current?.click();
  };

  // Process platform export file
  const handlePlatformFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files || !selectedPlatform) return;

    const file = files[0];
    const docId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    addDocument({
      id: docId,
      filename: `${selectedPlatform} - ${file.name}`,
      fileType: file.name.split('.').pop() || 'unknown',
      size: file.size,
      status: 'uploading',
      uploadedAt: new Date().toISOString(),
    });

    setCurrentProcessing(`${selectedPlatform} - ${file.name}`);
    setProcessing(true, `${selectedPlatform} - ${file.name}`);

    try {
      updateDocument(docId, { status: 'processing' });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('source', selectedPlatform);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || `Upload failed: ${response.statusText}`);
      }

      if (result.insights) {
        addInsightsFromAI({
          documentId: docId,
          painPoints: (result.insights.painPoints || []).map((p: any) => ({
            ...p,
            documentId: docId,
          })),
          themes: (result.insights.themes || []).map((t: any) => ({
            ...t,
            documentId: docId,
          })),
          personas: (result.insights.personas || []).map((p: any) => ({
            ...p,
            documentId: docId,
            companySize: p.companySize || p.company_size || 'unknown',
            mainPainPoints: p.mainPainPoints || p.main_pain_points || p.pain_points || [],
          })),
          sentiment: {
            documentId: docId,
            overall: result.insights.sentiment?.overall || 'neutral',
            positivePercent: result.insights.sentiment?.positivePercent || 0,
            neutralPercent: result.insights.sentiment?.neutralPercent || 0,
            negativePercent: result.insights.sentiment?.negativePercent || 0,
          },
          risks: (result.insights.risks || []).map((r: any) => ({
            ...r,
            documentId: docId,
          })),
          recommendations: (result.insights.recommendations || []).map((r: any) => ({
            ...r,
            documentId: docId,
          })),
        });
      }

      if (result.analyticsMetrics && result.analyticsMetrics.length > 0) {
        addAnalyticsMetrics(
          result.analyticsMetrics.map((m: any) => ({
            ...m,
            documentId: docId,
          }))
        );
      }

      updateDocument(docId, {
        status: 'completed',
        insightsCount: result.insightsCount || 0,
        extractedText: result.textPreview || '',
      });

      // Show success toast
      if (typeof window !== 'undefined') {
        const toastDiv = document.createElement('div');
        toastDiv.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse';
        toastDiv.textContent = `Successfully processed ${selectedPlatform} export. ${result.insightsCount || 0} new insights added.`;
        document.body.appendChild(toastDiv);
        setTimeout(() => toastDiv.remove(), 3000);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      updateDocument(docId, {
        status: 'error',
        errorMessage,
      });
    }

    setProcessing(false);
    setCurrentProcessing(null);
    setSelectedPlatform(null);
    if (platformFileInputRef.current) platformFileInputRef.current.value = '';
  };

  const platforms = [
    { id: 'gmail', name: 'Gmail', icon: '📧', sampleFile: 'sample_gmail_export.csv', description: 'Import customer emails' },
    { id: 'sheets', name: 'Google Sheets', icon: '📊', sampleFile: 'sample_monday_export.json', description: 'Import sheet data' },
    { id: 'monday', name: 'Monday.com', icon: '📅', sampleFile: 'sample_monday_export.json', description: 'Import project tasks' },
    { id: 'jira', name: 'Jira', icon: '🐛', sampleFile: 'sample_jira_export.csv', description: 'Import issues & tickets' },
    { id: 'zendesk', name: 'Zendesk', icon: '🎫', sampleFile: 'sample_support_tickets.csv', description: 'Import support tickets' },
    { id: 'crm', name: 'Custom CRM', icon: '💼', sampleFile: 'sample_support_tickets.csv', description: 'Import CRM data' },
  ];

  const handleDirectUpload = async (files: File[]) => {
    for (const file of files) {
      const docId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      addDocument({
        id: docId,
        filename: file.name,
        fileType: file.name.split('.').pop() || 'unknown',
        size: file.size,
        status: 'uploading',
        uploadedAt: new Date().toISOString(),
      });

      setCurrentProcessing(file.name);
      setProcessing(true, file.name);

      try {
        updateDocument(docId, { status: 'processing' });

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || `Upload failed: ${response.statusText}`);
        }

        if (result.insights) {
          addInsightsFromAI({
            documentId: docId,
            painPoints: (result.insights.painPoints || []).map((p: any) => ({
              ...p,
              documentId: docId,
            })),
            themes: (result.insights.themes || []).map((t: any) => ({
              ...t,
              documentId: docId,
            })),
            personas: (result.insights.personas || []).map((p: any) => ({
              ...p,
              documentId: docId,
              companySize: p.companySize || p.company_size || 'unknown',
              mainPainPoints: p.mainPainPoints || p.main_pain_points || p.pain_points || [],
            })),
            sentiment: {
              documentId: docId,
              overall: result.insights.sentiment?.overall || 'neutral',
              positivePercent: result.insights.sentiment?.positivePercent || 0,
              neutralPercent: result.insights.sentiment?.neutralPercent || 0,
              negativePercent: result.insights.sentiment?.negativePercent || 0,
            },
            risks: (result.insights.risks || []).map((r: any) => ({
              ...r,
              documentId: docId,
            })),
            recommendations: (result.insights.recommendations || []).map((r: any) => ({
              ...r,
              documentId: docId,
            })),
          });
        }

        if (result.analyticsMetrics && result.analyticsMetrics.length > 0) {
          addAnalyticsMetrics(
            result.analyticsMetrics.map((m: any) => ({
              ...m,
              documentId: docId,
            }))
          );
        }

        updateDocument(docId, {
          status: 'completed',
          insightsCount: result.insightsCount || 0,
          extractedText: result.textPreview || '',
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        updateDocument(docId, {
          status: 'error',
          errorMessage,
        });
      }
    }

    setProcessing(false);
    setCurrentProcessing(null);
  };

  const sortedDocs = documents
    .slice()
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

  return (
    <main className="flex-1 overflow-auto bg-background">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">📤 Upload Research</h1>
          <p className="text-muted-foreground">
            Upload customer feedback, interviews, surveys, and analytics — AI will extract real insights
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab('direct')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'direct'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            📄 Direct File Upload
          </button>
          <button
            onClick={() => setActiveTab('platforms')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'platforms'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            🔗 Platform Exports
          </button>
        </div>

        {/* SECTION A: Direct File Upload */}
        {activeTab === 'direct' && (
          <div className="space-y-8">
            <UploadZone onFilesSelected={handleDirectUpload} />

            {currentProcessing && (
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Loader className="w-5 h-5 text-blue-600 animate-spin" />
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-200">
                      AI is processing: {currentProcessing}
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      Extracting pain points, themes, personas, and sentiment...
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-card border rounded-lg p-4 text-center">
                <p className="text-2xl mb-2">📄</p>
                <p className="font-medium">PDF Files</p>
                <p className="text-xs text-muted-foreground mt-1">Interview transcripts, research PDFs</p>
              </div>
              <div className="bg-card border rounded-lg p-4 text-center">
                <p className="text-2xl mb-2">📋</p>
                <p className="font-medium">CSV Files</p>
                <p className="text-xs text-muted-foreground mt-1">Survey responses, analytics data</p>
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
          </div>
        )}

        {/* SECTION B: Platform Exports */}
        {activeTab === 'platforms' && (
          <div className="space-y-8">
            <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <p className="text-sm text-amber-900 dark:text-amber-200">
                💡 <strong>Don't have live API access?</strong> Download the sample CSV/JSON export for any platform below, then upload it here for instant AI analysis.
              </p>
            </div>

            {currentProcessing && (
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Loader className="w-5 h-5 text-blue-600 animate-spin" />
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-200">
                      AI is processing: {currentProcessing}
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      Extracting insights from platform data...
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {platforms.map((platform) => {
                const isConnected = connectedPlatforms.has(platform.id);
                const isAuthenticating = authenticatingPlatform === platform.id;

                return (
                  <div key={platform.id} className="bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{platform.icon}</span>
                          <div>
                            <h3 className="font-semibold">{platform.name}</h3>
                            <p className="text-xs text-muted-foreground">{platform.description}</p>
                          </div>
                        </div>
                      </div>

                      {isAuthenticating && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                          <div className="bg-white dark:bg-slate-900 rounded-lg p-8 shadow-xl max-w-sm mx-4">
                            <div className="flex flex-col items-center gap-4">
                              <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                              <p className="font-semibold text-center">Authenticating {platform.name}...</p>
                              <p className="text-sm text-muted-foreground text-center">This won't take long</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-3">
                        {!isConnected ? (
                          <button
                            onClick={() => handlePlatformConnect(platform.id)}
                            disabled={isAuthenticating}
                            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
                          >
                            Connect {platform.name}
                          </button>
                        ) : (
                          <div className="space-y-2">
                            <div className="w-full px-4 py-2 bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200 rounded-lg text-center font-medium flex items-center justify-center gap-2">
                              <CheckCircle2 className="w-4 h-4" />
                              Connected ✅
                            </div>
                            <button
                              onClick={() => handlePlatformFileSelect(platform.id)}
                              className="w-full px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors font-medium"
                            >
                              Upload Export
                            </button>
                          </div>
                        )}

                        <button
                          onClick={() => handleDownloadSample(platform.sampleFile)}
                          className="w-full px-4 py-2 text-sm text-muted-foreground border rounded-lg hover:bg-muted transition-colors flex items-center justify-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download Sample
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {sortedDocs.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-6">Upload History</h2>
            <div className="space-y-3">
              {sortedDocs.map((doc) => (
                <div key={doc.id} className="bg-card border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      {doc.status === 'uploading' && (
                        <Loader className="w-5 h-5 animate-spin text-blue-500" />
                      )}
                      {doc.status === 'processing' && (
                        <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />
                      )}
                      {doc.status === 'completed' && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                      {doc.status === 'error' && (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                      <div>
                        <p className="font-medium">{doc.filename}</p>
                        <p className="text-xs text-muted-foreground">
                          {(doc.size / 1024).toFixed(1)} KB • {new Date(doc.uploadedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {doc.status === 'completed'
                          ? `${doc.insightsCount || 0} insights extracted`
                          : doc.status === 'processing'
                          ? 'AI analyzing...'
                          : doc.status === 'uploading'
                          ? 'Uploading...'
                          : 'Failed'}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">{doc.status}</p>
                    </div>
                  </div>

                  {doc.status === 'error' && doc.errorMessage && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-2 p-2 bg-red-50 dark:bg-red-950 rounded">
                      Error: {doc.errorMessage}
                    </p>
                  )}

                  {doc.status === 'completed' && (
                    <div className="flex gap-2">
                      <Link href="/insights" className="text-xs px-3 py-1 border rounded hover:bg-muted transition">
                        View Insights
                      </Link>
                      <Link href="/" className="text-xs px-3 py-1 border rounded hover:bg-muted transition">
                        Go to Dashboard
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {sortedDocs.length === 0 && (
          <div className="mt-12 text-center py-12 bg-card border border-dashed rounded-lg">
            <p className="text-muted-foreground">No uploads yet. Start by uploading a file or connecting a platform!</p>
          </div>
        )}
      </div>

      <input
        ref={platformFileInputRef}
        type="file"
        accept=".csv,.json"
        onChange={handlePlatformFileUpload}
        className="hidden"
      />
    </main>
  );
}

