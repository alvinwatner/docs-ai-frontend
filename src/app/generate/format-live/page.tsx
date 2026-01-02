'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthGuard, UserMenu } from '@/components/auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Loader2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface FormattingProgress {
  current_action: string;
  latest_pdf_url?: string;
  document_id?: string;
  history: Array<{
    action: string;
    timestamp: string;
  }>;
  last_updated: unknown;
}

// Helper function to parse history and extract issues summary
interface IssuesSummary {
  totalFixed: number;
  categories: string[];
}

const parseIssuesSummary = (history: FormattingProgress['history']): IssuesSummary => {
  const fixKeywords = ['fixed', 'aligned', 'adjusted', 'corrected', 'normalized', 'formatted', 'resolved'];
  const categoryKeywords: Record<string, string> = {
    'table': 'Tables aligned',
    'spacing': 'Spacing normalized',
    'margin': 'Margins adjusted',
    'font': 'Fonts standardized',
    'paragraph': 'Paragraphs formatted',
    'layout': 'Layout optimized',
    'alignment': 'Alignment fixed',
    'border': 'Borders corrected',
  };

  let totalFixed = 0;
  const foundCategories = new Set<string>();

  history.forEach(entry => {
    const actionLower = entry.action.toLowerCase();

    // Count fixes
    if (fixKeywords.some(keyword => actionLower.includes(keyword))) {
      totalFixed++;
    }

    // Categorize by type
    Object.entries(categoryKeywords).forEach(([keyword, label]) => {
      if (actionLower.includes(keyword)) {
        foundCategories.add(label);
      }
    });
  });

  return {
    totalFixed,
    categories: Array.from(foundCategories).slice(0, 3), // Max 3 categories shown
  };
};

export default function FormatLivePage() {
  return (
    <AuthGuard>
      <FormatLiveContent />
    </AuthGuard>
  );
}

function FormatLiveContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const sessionId = searchParams.get('session');
  const templateId = searchParams.get('template');

  const [progress, setProgress] = useState<FormattingProgress | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [latestPdfUrl, setLatestPdfUrl] = useState<string>(''); // Persists after Firestore cleanup
  const [documentId, setDocumentId] = useState<string>(''); // For downloading DOCX
  const [isComplete, setIsComplete] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!sessionId) {
      router.push('/generate/export');
      return;
    }

    // Subscribe to Firestore updates
    const docRef = doc(db, 'document_formatting_progress', sessionId);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as FormattingProgress;
          setProgress(data);

          // Update PDF URL if available
          if (data.latest_pdf_url) {
            setPdfUrl(data.latest_pdf_url);
            setLatestPdfUrl(data.latest_pdf_url); // Persist for download after Firestore cleanup
          }

          // Update document_id if available
          if (data.document_id) {
            setDocumentId(data.document_id);
          }

          // Check if formatting is complete or failed
          if (data.current_action?.includes('ready for download')) {
            setIsComplete(true);
          } else if (
            data.current_action?.toLowerCase().includes('error') ||
            data.current_action?.toLowerCase().includes('failed')
          ) {
            setHasError(true);
            setErrorMessage(data.current_action);
          }
        }
      },
      (error) => {
        console.error('Firestore listener error:', error);
        setHasError(true);
        setErrorMessage('Failed to connect to real-time updates');
      }
    );

    unsubscribeRef.current = unsubscribe;

    // Cleanup on unmount
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [sessionId, router]);

  const handleDownloadPdf = () => {
    if (latestPdfUrl) {
      // Open PDF URL in new tab (pre-signed S3 URL)
      window.open(latestPdfUrl, '_blank');
    }
  };

  const handleDownloadDocx = async () => {
    if (!documentId) {
      console.error('No document ID available');
      return;
    }

    try {
      // Call backend API to download DOCX
      const response = await fetch(`/api/documents/${documentId}/download`);

      if (!response.ok) {
        throw new Error('Failed to download document');
      }

      // Get filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'formatted_document.docx';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading DOCX:', error);
    }
  };

  const handleStartOver = () => {
    router.push(`/generate/fill?template=${templateId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/generate/export"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">
              Live Formatting Preview
            </h1>
          </div>
          <UserMenu />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* PDF Preview - Left/Main Column (2/3 width) */}
          <div className="lg:col-span-2">
            <Card className="h-[calc(100vh-12rem)]">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center justify-between">
                  <span>Document Preview</span>
                  {pdfUrl && !isComplete && (
                    <span className="flex items-center gap-2 text-sm font-normal text-blue-600">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating...
                    </span>
                  )}
                  {isComplete && (
                    <span className="flex items-center gap-2 text-sm font-normal text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      Complete
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-4rem)] p-0">
                {pdfUrl ? (
                  <iframe
                    key={pdfUrl} // Force refresh when URL changes
                    src={pdfUrl}
                    className="h-full w-full"
                    title="PDF Preview"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-500" />
                      <p className="mt-4 text-gray-600">
                        Generating first preview...
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Progress Log - Right Column (1/3 width) */}
          <div className="lg:col-span-1">
            <Card className="h-[calc(100vh-12rem)]">
              <CardHeader className="border-b">
                <CardTitle>Formatting Progress</CardTitle>
              </CardHeader>
              <CardContent className="flex h-[calc(100%-4rem)] flex-col p-4">
                {/* Current Action - Large and Prominent */}
                {progress?.current_action && (
                  <div className="mb-4 rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4">
                    <p className="text-sm font-medium text-blue-900">
                      Current Status
                    </p>
                    <p className="mt-1 text-lg font-semibold text-blue-700">
                      {progress.current_action}
                    </p>
                  </div>
                )}

                {/* Error Display */}
                {hasError && (
                  <div className="mb-4 rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />
                      <div>
                        <p className="text-sm font-medium text-red-900">
                          Error
                        </p>
                        <p className="mt-1 text-sm text-red-700">
                          {errorMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Success Display */}
                {isComplete && !hasError && (
                  <div className="mb-4 rounded-lg border-l-4 border-green-500 bg-green-50 p-4">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-900">
                          Complete!
                        </p>
                        <p className="mt-1 text-sm text-green-700">
                          Your document is ready for download.
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 space-y-2">
                      <Button
                        onClick={handleDownloadPdf}
                        className="w-full"
                        size="sm"
                        variant="primary"
                        disabled={!latestPdfUrl}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </Button>
                      <Button
                        onClick={handleDownloadDocx}
                        className="w-full"
                        size="sm"
                        variant="outline"
                        disabled={!documentId}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download DOCX
                      </Button>
                    </div>
                  </div>
                )}

                {/* Issues Summary Card - Show when there's history */}
                {progress?.history && progress.history.length > 0 && (() => {
                  const summary = parseIssuesSummary(progress.history);
                  if (summary.totalFixed > 0 || summary.categories.length > 0) {
                    return (
                      <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <p className="text-sm font-medium text-foreground">
                            {summary.totalFixed > 0
                              ? `${summary.totalFixed} issue${summary.totalFixed !== 1 ? 's' : ''} fixed`
                              : 'Formatting applied'}
                          </p>
                        </div>
                        {summary.categories.length > 0 && (
                          <ul className="space-y-1">
                            {summary.categories.map((category, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CheckCircle2 className="h-3 w-3 text-primary" />
                                {category}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* History Log - Scrollable */}
                <div className="flex-1 overflow-hidden">
                  <p className="mb-2 text-sm font-medium text-gray-700">
                    Activity Log
                  </p>
                  <div className="h-full overflow-y-auto rounded-lg border bg-gray-50 p-3">
                    {progress?.history && progress.history.length > 0 ? (
                      <div className="space-y-2">
                        {progress.history.map((entry, index) => (
                          <div
                            key={index}
                            className="border-l-2 border-gray-300 pl-3 text-sm"
                          >
                            <p className="text-gray-900">{entry.action}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(entry.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Starting formatting process...
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 space-y-2">
                  {hasError && (
                    <Button
                      onClick={handleStartOver}
                      variant="outline"
                      className="w-full"
                      size="sm"
                    >
                      Start Over
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
