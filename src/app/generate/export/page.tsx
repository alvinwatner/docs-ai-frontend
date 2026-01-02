'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0';
import { AuthGuard, UserMenu } from '@/components/auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button, buttonVariants } from '@/components/ui/button';
import { Stepper, DOCUMENT_GENERATION_STEPS } from '@/components/ui/stepper';
import { DocumentPreview } from '@/components/document-preview';
import {
  Download,
  CheckCircle2,
  RotateCcw,
  AlertCircle,
  Sparkles,
  FileText,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { trackDocumentEvent } from '@/lib/hotjar';

interface DetectedVariables {
  simple: string[];
  sections: string[];
  total_count: number;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  base64?: string;
}

interface VariableValues {
  [key: string]: string | SectionData[];
}

interface SectionData {
  title: string;
  table_rows: Array<{ key: string; value: string }>;
}

export default function ExportPage() {
  return (
    <AuthGuard>
      <ExportContent />
    </AuthGuard>
  );
}

function ExportContent() {
  const {} = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get URL parameters for validation
  const templateId = searchParams.get('template');
  const documentId = searchParams.get('document');

  const [variables, setVariables] = useState<DetectedVariables | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [variableValues, setVariableValues] = useState<VariableValues>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState('');
  const [exportSuccess, setExportSuccess] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [mergedDocumentBlob, setMergedDocumentBlob] = useState<Blob | null>(
    null
  );
  const [previewError, setPreviewError] = useState<string>('');

  useEffect(() => {
    // Validate URL parameters first
    if (!templateId) {
      router.push('/templates?error=template-required');
      return;
    }

    // Retrieve stored data from previous steps
    const storedVariables = sessionStorage.getItem('detected-variables');
    const storedFile = sessionStorage.getItem('uploaded-file');
    const storedValues = sessionStorage.getItem('variable-values');
    const storedMergedDoc = sessionStorage.getItem('merged-document');

    if (!storedVariables || !storedFile || !storedValues) {
      // Redirect back to fill if no sessionStorage data found
      router.push(`/generate/fill?template=${templateId}`);
      return;
    }

    try {
      setVariables(JSON.parse(storedVariables));
      setUploadedFile(JSON.parse(storedFile));
      setVariableValues(JSON.parse(storedValues));

      // Load merged document if available (from merge in fill page)
      if (storedMergedDoc) {
        try {
          const mergedDocData = JSON.parse(storedMergedDoc);
          // Convert base64 back to Blob for preview
          const byteCharacters = atob(mergedDocData.data.split(',')[1]);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], {
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          });
          setMergedDocumentBlob(blob);
          setPreviewError(''); // Clear any previous preview errors
        } catch (error) {
          console.error('Error loading merged document for preview:', error);
          setPreviewError(
            'Failed to load document preview. The merged document may be corrupted.'
          );
        }
      }
    } catch (error) {
      console.error('Error parsing stored data:', error);
      router.push(`/generate/fill?template=${templateId}`);
      return;
    } finally {
      setIsLoading(false);
    }
  }, [router, templateId]);

  const handleExport = async () => {
    if (!variableValues || !documentId) return;

    setIsExporting(true);
    setExportError('');

    // Track export start
    trackDocumentEvent('EXPORT_STARTED', {
      format: 'docx',
      autoFormatEnabled: true,
    });

    try {
      let finalBlob: Blob;
      const finalFilename = uploadedFile?.name
        ? `${uploadedFile.name.replace('.docx', '')}_filled`
        : 'document_filled';

      if (documentId && mergedDocumentBlob) {
        // Step 1: Start advanced formatting with live preview

        // Create form data with the merged document
        const formatFormData = new FormData();
        formatFormData.append(
          'file',
          mergedDocumentBlob,
          uploadedFile?.name || 'document.docx'
        );

        const formatResponse = await fetch('/api/documents/format-advanced', {
          method: 'POST',
          body: formatFormData,
        });

        if (!formatResponse.ok) {
          const errorData = await formatResponse.json();
          throw new Error(
            `Formatting failed: ${errorData.error || formatResponse.statusText}`
          );
        }

        const data = await formatResponse.json();
        const sessionId = data.session_id;

        if (!sessionId) {
          throw new Error('No session ID returned from formatting service');
        }

        // Redirect to live preview page with session ID and template ID
        router.push(
          `/generate/format-live?session=${sessionId}&template=${templateId}`
        );
        return; // Exit early, no download here
      } else {
        // Use the existing merged document
        if (!mergedDocumentBlob) {
          throw new Error(
            'No document available for download. Please try regenerating the document.'
          );
        }
        finalBlob = mergedDocumentBlob;
      }

      // Step 2: Prepare download
      const url = window.URL.createObjectURL(finalBlob);
      setDownloadUrl(url);
      setExportSuccess(true);

      // Track successful export
      trackDocumentEvent('EXPORT_COMPLETED', {
        format: 'docx',
        autoFormatted: true,
        filename: finalFilename,
      });

      // Track download
      trackDocumentEvent('DOWNLOAD_INITIATED', {
        format: 'docx',
        filename: finalFilename,
      });

      // Auto-download the file
      const link = document.createElement('a');
      link.href = url;
      link.download = `${finalFilename}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Export failed';
      setExportError(errorMessage);

      // Track export error
      trackDocumentEvent('EXPORT_ERROR', {
        error: errorMessage,
        format: 'docx',
        autoFormatted: true,
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!mergedDocumentBlob) {
      setExportError('No document available for download');
      return;
    }

    setIsExporting(true);
    setExportError('');

    try {
      // Create form data with the merged document
      const formData = new FormData();
      formData.append(
        'file',
        mergedDocumentBlob,
        uploadedFile?.name || 'document.docx'
      );

      // Call format endpoint to get PDF
      const response = await fetch('/api/documents/format', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Get the blob and download
      const pdfBlob = await response.blob();
      const filename = uploadedFile?.name
        ? `${uploadedFile.name.replace('.docx', '')}_merged.pdf`
        : 'document_merged.pdf';

      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Track download
      trackDocumentEvent('DOWNLOAD_INITIATED', {
        format: 'pdf',
        filename: filename,
        formatted: false,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to download PDF';
      setExportError(errorMessage);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadDocx = () => {
    if (!mergedDocumentBlob) {
      setExportError('No document available for download');
      return;
    }

    try {
      const filename = uploadedFile?.name
        ? `${uploadedFile.name.replace('.docx', '')}_merged.docx`
        : 'document_merged.docx';

      const url = window.URL.createObjectURL(mergedDocumentBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Track download
      trackDocumentEvent('DOWNLOAD_INITIATED', {
        format: 'docx',
        filename: filename,
        formatted: false,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to download DOCX';
      setExportError(errorMessage);
    }
  };

  const handleStartNew = () => {
    // Clear all sessionStorage data
    sessionStorage.removeItem('uploaded-file');
    sessionStorage.removeItem('detected-variables');
    sessionStorage.removeItem('variable-values');
    sessionStorage.removeItem('merged-document');

    // Redirect to dashboard
    router.push('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen">
        <header className="border-border bg-card border-b">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-8">
                <Link
                  href="/dashboard"
                  className="text-card-foreground hover:text-primary text-xl font-semibold transition-colors"
                >
                  Docko
                </Link>
              </div>
              <UserMenu />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Stepper Skeleton */}
          <div className="mb-8">
            <div className="mx-auto flex max-w-2xl justify-between">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </div>

          {/* Header Skeleton */}
          <div className="mb-8">
            <Skeleton className="mb-4 h-9 w-40" />
            <Skeleton className="mb-2 h-9 w-64" />
            <Skeleton className="h-5 w-96" />
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Export Options - 2 columns */}
            <div className="space-y-6 lg:col-span-2">
              {/* Document Preview Skeleton */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-[500px] w-full" />
                </CardContent>
              </Card>

              {/* Export Options Cards Skeleton */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-3">
                    <Skeleton className="h-6 w-32" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <div className="grid grid-cols-2 gap-2">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pt-6 pb-3">
                    <Skeleton className="h-6 w-44" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Summary Sidebar Skeleton */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i}>
                      <Skeleton className="mb-1 h-4 w-24" />
                      <Skeleton className="h-4 w-36" />
                    </div>
                  ))}
                  <div className="border-t pt-4">
                    <Skeleton className="h-9 w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!variables || !uploadedFile || !variableValues) {
    return null;
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="border-border bg-card border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link
                href="/dashboard"
                className="text-card-foreground hover:text-primary text-xl font-semibold transition-colors"
              >
                Docko
              </Link>

              <div className="text-muted-foreground hidden items-center gap-2 text-sm md:flex">
                <Link
                  href="/dashboard"
                  className="hover:text-foreground transition-colors"
                >
                  Dashboard
                </Link>
                <span>/</span>
                <Link
                  href="/templates"
                  className="hover:text-foreground transition-colors"
                >
                  Templates
                </Link>
                <span>/</span>
                <Link
                  href={`/generate/fill?template=${templateId}`}
                  className="hover:text-foreground transition-colors"
                >
                  Fill Variables
                </Link>
                <span>/</span>
                <span>Export Document</span>
              </div>
            </div>

            <UserMenu />
          </div>
        </div>
      </header>

      {/* Sticky Stepper */}
      <div className="sticky top-0 z-50 bg-background border-b border-border py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Stepper
            currentStep={3}
            steps={DOCUMENT_GENERATION_STEPS}
            className="mx-auto max-w-2xl"
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-foreground mb-2 text-3xl font-semibold">
            Export Your Document
          </h1>
          <p className="text-muted-foreground">
            Review your document settings and download your personalized file.
          </p>
        </div>

        {exportSuccess ? (
          // Success State
          <div className="mx-auto max-w-2xl">
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle2 className="mx-auto mb-6 h-16 w-16 text-green-600" />
                <h2 className="text-foreground mb-4 text-2xl font-semibold">
                  Document Generated Successfully!
                </h2>
                <p className="text-muted-foreground mb-8">
                  Your personalized document has been generated and downloaded.
                </p>

                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  {downloadUrl && (
                    <a
                      href={downloadUrl}
                      download={`${uploadedFile.name.replace('.docx', '')}_filled.docx`}
                      className={cn(
                        buttonVariants(),
                        'flex items-center gap-2'
                      )}
                    >
                      <Download className="h-4 w-4" />
                      Download Again
                    </a>
                  )}

                  <Button variant="outline" onClick={handleStartNew}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Create Another Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Export Options - Takes 2 columns */}
            <div className="space-y-6 lg:col-span-2">
              {/* Document Preview */}
              <DocumentPreview
                documentBlob={mergedDocumentBlob}
                fileName={
                  uploadedFile?.name
                    ? uploadedFile.name.replace('.docx', '_merged.docx')
                    : 'merged_document.docx'
                }
                className="h-[600px]"
              />

              {/* Preview Error Display */}
              {previewError && (
                <Card className="border-destructive/20 bg-destructive/10">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="text-destructive mt-0.5 h-5 w-5" />
                      <div>
                        <h4 className="text-destructive font-medium">
                          Preview Error
                        </h4>
                        <p className="text-destructive/80 text-sm">
                          {previewError}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Error Message */}
              {exportError && (
                <Card className="border-destructive/20 bg-destructive/10">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="text-destructive mt-0.5 h-5 w-5" />
                      <div>
                        <h4 className="text-destructive font-medium">
                          Export Error
                        </h4>
                        <p className="text-destructive/80 text-sm">
                          {exportError}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Export Options - Two Card Layout */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Quick Download Card */}
                <Card className="relative flex flex-col">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileText className="h-5 w-5" />
                      Quick Download
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col space-y-4">
                    <p className="text-muted-foreground text-sm">
                      Download your merged document as-is, without additional
                      formatting.
                    </p>
                    <div className="mt-auto grid grid-cols-2 gap-2">
                      <Button
                        onClick={handleDownloadDocx}
                        disabled={isExporting || !mergedDocumentBlob}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        DOCX
                      </Button>
                      <Button
                        onClick={handleDownloadPdf}
                        disabled={isExporting || !mergedDocumentBlob}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Auto Formatting Card - Recommended */}
                <Card className="border-primary/50 bg-primary/5 relative flex flex-col">
                  {/* Recommended Badge */}
                  <div className="absolute -top-3 left-4">
                    <span className="bg-primary text-primary-foreground inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium">
                      <Sparkles className="h-3 w-3" />
                      Recommended
                    </span>
                  </div>
                  <CardHeader className="pt-6 pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Zap className="text-primary h-5 w-5" />
                      Apply Auto Formatting
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm">
                      Fix layout issues, align tables, and normalize spacing
                      automatically.
                    </p>
                    <ul className="text-muted-foreground space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="text-primary h-4 w-4" />
                        Fix table alignment
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="text-primary h-4 w-4" />
                        Normalize spacing
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="text-primary h-4 w-4" />
                        Live preview
                      </li>
                    </ul>
                    <Button
                      onClick={handleExport}
                      disabled={isExporting || !mergedDocumentBlob}
                      className="flex w-full items-center gap-2"
                    >
                      {isExporting ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Starting...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Continue with Formatting
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Document Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-foreground text-sm font-medium">
                      Template
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {uploadedFile.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-foreground text-sm font-medium">
                      Variables Filled
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {variables.total_count} variable
                      {variables.total_count !== 1 ? 's' : ''}
                    </p>
                  </div>

                  <div>
                    <p className="text-foreground text-sm font-medium">
                      Export Format
                    </p>
                    <p className="text-muted-foreground text-sm">
                      DOCX (Editable)
                    </p>
                  </div>

                  <div>
                    <p className="text-foreground text-sm font-medium">
                      Formatting
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Auto-formatting enabled
                    </p>
                  </div>

                  {documentId && (
                    <div>
                      <p className="text-foreground text-sm font-medium">
                        Document ID
                      </p>
                      <p className="text-muted-foreground font-mono text-xs">
                        {documentId}
                      </p>
                    </div>
                  )}

                  <div className="border-border border-t pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleStartNew}
                      className="w-full"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Start New Document
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
