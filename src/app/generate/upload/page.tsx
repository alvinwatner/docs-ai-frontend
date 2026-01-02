'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0';
import { AuthGuard, UserMenu } from '@/components/auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Stepper, DOCUMENT_GENERATION_STEPS } from '@/components/ui/stepper';
import { cn } from '@/lib/utils';
import {
  Upload,
  FileText,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Hash,
  List,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { trackDocumentEvent } from '@/lib/hotjar';

// TypeScript interfaces matching backend API response
interface VariableDetectionResponse {
  simple: string[];
  sections: string[];
  total_count: number;
  template_id?: string;
}


export default function UploadPage() {
  return (
    <AuthGuard>
      <UploadContent />
    </AuthGuard>
  );
}

function UploadContent() {
  const { user, error: userError, isLoading: userLoading } = useUser();
  const router = useRouter();
  
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [detectedVariables, setDetectedVariables] =
    useState<VariableDetectionResponse | null>(null);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return;

    if (
      file.type !==
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      setUploadError('Please upload a valid DOCX file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      setUploadError('File size must be less than 10MB.');
      return;
    }

    // Warn about large files that may cause storage issues
    if (file.size > 8 * 1024 * 1024) {
      // 8MB warning
      console.warn('Large file detected. May cause sessionStorage issues.');
    }

    // Check user authentication first
    if (userLoading) {
      setUploadError('Please wait, authentication is loading...');
      return;
    }

    if (userError) {
      setUploadError(`Authentication error: ${userError.message}`);
      return;
    }

    if (!user) {
      setUploadError('Please log in to upload files');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {


      // Make direct API call (with or without token for testing)
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/documents/detect-variables', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const variables: VariableDetectionResponse = await response.json();

      if (!variables.template_id) {
        throw new Error('Template was not saved properly. Please try again.');
      }

      // Set local state to show variables inline
      setUploadedFile(file);
      setDetectedVariables(variables);
      setUploadSuccess(true);

      // Track successful upload and variable detection
      trackDocumentEvent('DOCUMENT_UPLOADED', {
        fileName: file.name,
        fileSize: file.size,
        variableCount: variables.total_count,
        simpleVariables: variables.simple.length,
        sectionVariables: variables.sections.length,
      });
      trackDocumentEvent('VARIABLES_DETECTED', {
        totalCount: variables.total_count,
      });
    } catch (error) {
      setUploadError(
        error instanceof Error
          ? error.message
          : 'An error occurred while processing the file.'
      );

      // Track upload error
      trackDocumentEvent('UPLOAD_ERROR', {
        fileName: file.name,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsUploading(false);
    }
  }, [user, userError, userLoading]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileUpload(files[0]);
      }
    },
    [handleFileUpload]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileUpload(files[0]);
      }
    },
    [handleFileUpload]
  );

  // Removed separate success screen - show variables inline instead

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

              {/* Breadcrumb */}
              <div className="text-muted-foreground hidden items-center gap-2 text-sm md:flex">
                <Link
                  href="/dashboard"
                  className="hover:text-foreground transition-colors"
                >
                  Dashboard
                </Link>
                <span>/</span>
                <span>Upload Template</span>
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
            currentStep={1}
            steps={DOCUMENT_GENERATION_STEPS}
            className="mx-auto max-w-2xl"
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <h1 className="text-foreground mb-2 text-3xl font-semibold">
            Upload Document Template
          </h1>
          <p className="text-muted-foreground">
            Upload your DOCX template with variable placeholders like{' '}
            {`{{variable_name}}`}.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Upload Area - Takes 2 columns */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-8">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
                    isDragOver
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-muted/20'
                  } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
                      <div>
                        <h3 className="text-foreground mb-2 text-lg font-medium">
                          Processing Document...
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Analyzing your template and detecting variables
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                      <h3 className="text-foreground mb-2 text-lg font-medium">
                        Drop your DOCX file here
                      </h3>
                      <p className="text-muted-foreground mb-6 text-sm">
                        or click to browse from your computer
                      </p>

                      <input
                        type="file"
                        accept=".docx"
                        onChange={handleFileInput}
                        className="hidden"
                        id="file-input"
                        disabled={isUploading}
                      />
                      <label htmlFor="file-input" className="cursor-pointer">
                        <Button
                          type="button"
                          onClick={() =>
                            document.getElementById('file-input')?.click()
                          }
                        >
                          Browse Files
                        </Button>
                      </label>
                    </>
                  )}
                </div>

                {/* Error Message */}
                {uploadError && (
                  <div className="bg-destructive/10 border-destructive/20 mt-4 flex items-start gap-3 rounded-lg border p-4">
                    <AlertCircle className="text-destructive mt-0.5 h-5 w-5" />
                    <div>
                      <h4 className="text-destructive font-medium">
                        Upload Error
                      </h4>
                      <p className="text-destructive/80 text-sm">
                        {uploadError}
                      </p>
                    </div>
                  </div>
                )}

                {/* Variables Display - Show after successful upload */}
                {uploadSuccess && detectedVariables && uploadedFile && (
                  <div className="mt-6 space-y-4">
                    {/* File Info */}
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <div className="flex-1">
                          <h4 className="font-medium text-green-900">
                            {uploadedFile.name}
                          </h4>
                          <p className="text-sm text-green-700">
                            Found {detectedVariables.total_count} variable
                            {detectedVariables.total_count !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          {detectedVariables.total_count} variable
                          {detectedVariables.total_count !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </div>

                    {/* Simple Variables */}
                    {detectedVariables.simple.length > 0 && (
                      <div className="border-border rounded-lg border p-4">
                        <h4 className="text-foreground mb-3 flex items-center gap-2 font-medium">
                          <Hash className="h-4 w-4" />
                          Simple Variables ({detectedVariables.simple.length})
                        </h4>
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                          {detectedVariables.simple.map((variable, index) => (
                            <code
                              key={index}
                              className="bg-muted rounded px-2 py-1 font-mono text-sm"
                            >
                              {`{{${variable}}}`}
                            </code>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section Variables */}
                    {detectedVariables.sections.length > 0 && (
                      <div className="border-border rounded-lg border p-4">
                        <h4 className="text-foreground mb-3 flex items-center gap-2 font-medium">
                          <List className="h-4 w-4" />
                          Section Variables ({detectedVariables.sections.length}
                          )
                        </h4>
                        <div className="space-y-2">
                          {detectedVariables.sections.map((variable, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <code className="bg-muted rounded px-2 py-1 font-mono text-sm">
                                {`{{${variable}}}`}
                              </code>
                              <Badge variant="outline" className="text-xs">
                                Repeating Section
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* No Variables Found */}
                    {detectedVariables.total_count === 0 && (
                      <div className="flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4">
                        <AlertCircle className="mt-0.5 h-5 w-5 text-orange-600" />
                        <div>
                          <h4 className="font-medium text-orange-900">
                            No Variables Detected
                          </h4>
                          <p className="text-sm text-orange-700">
                            We couldn&apos;t find any variables in your
                            template. Variables should be formatted as{' '}
                            {`{{variable_name}}`}.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Continue Button */}
                    <div className="flex justify-center pt-4">
                      <Button
                        onClick={() => router.push(`/generate/fill?template=${detectedVariables.template_id}`)}
                        size="lg"
                        className="flex items-center gap-2"
                      >
                        {detectedVariables.total_count > 0
                          ? 'Continue to Fill Variables'
                          : 'Continue Anyway'}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Requirements - Only show when no variables detected yet */}
                {!uploadSuccess && (
                  <div className="text-muted-foreground mt-6 text-xs">
                    <p>
                      <strong>Requirements:</strong> DOCX files only, maximum
                      10MB
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Instructions Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5" />
                  Template Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-foreground mb-2 font-medium">
                    Variable Format
                  </h4>
                  <p className="text-muted-foreground mb-2 text-sm">
                    Use double curly braces to create variables:
                  </p>
                  <code className="bg-muted rounded px-2 py-1 text-xs">
                    {`{{client_name}}`}
                  </code>
                </div>

                <div>
                  <h4 className="text-foreground mb-2 font-medium">
                    Section Variables
                  </h4>
                  <p className="text-muted-foreground mb-2 text-sm">
                    For repeating sections like tables:
                  </p>
                  <code className="bg-muted rounded px-2 py-1 text-xs">
                    {`{{section_tables}}`}
                  </code>
                </div>

                <div>
                  <h4 className="text-foreground mb-2 font-medium">Examples</h4>
                  <ul className="text-muted-foreground space-y-1 text-sm">
                    <li>• {`{{company_name}}`}</li>
                    <li>• {`{{invoice_number}}`}</li>
                    <li>• {`{{client_address}}`}</li>
                    <li>• {`{{section_items}}`}</li>
                  </ul>
                </div>

                <div className="border-border border-t pt-4">
                  <Link
                    href="/help/getting-started"
                    className={cn(
                      buttonVariants({ variant: 'ghost', size: 'sm' }),
                      'w-full'
                    )}
                  >
                    View Complete Guide
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
