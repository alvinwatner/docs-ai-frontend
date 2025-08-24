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
import { Upload, FileText, ArrowLeft, AlertCircle, CheckCircle2, Hash, List, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// TypeScript interfaces matching backend API response
interface VariableDetectionResponse {
  simple: string[];
  sections: string[];
  total_count: number;
}

interface UploadedFileInfo {
  name: string;
  size: number;
  type: string;
  base64?: string; // Optional for backward compatibility
}

export default function UploadPage() {
  return (
    <AuthGuard>
      <UploadContent />
    </AuthGuard>
  );
}

function UploadContent() {
  const { user } = useUser();
  const router = useRouter();
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [detectedVariables, setDetectedVariables] = useState<VariableDetectionResponse | null>(null);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return;

    if (file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      setUploadError('Please upload a valid DOCX file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setUploadError('File size must be less than 10MB.');
      return;
    }

    // Warn about large files that may cause storage issues
    if (file.size > 8 * 1024 * 1024) { // 8MB warning
      console.warn('Large file detected. May cause sessionStorage issues.');
    }

    setIsUploading(true);
    setUploadError('');

    try {
      // Convert file to base64 for storage
      const fileBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/documents/detect-variables`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process document');
      }

      const variables: VariableDetectionResponse = await response.json();
      
      // Store the file (with base64 content) and variables in sessionStorage
      const fileInfo: UploadedFileInfo & { base64: string } = {
        name: file.name,
        size: file.size,
        type: file.type,
        base64: fileBase64
      };
      
      try {
        sessionStorage.setItem('uploaded-file', JSON.stringify(fileInfo));
        sessionStorage.setItem('detected-variables', JSON.stringify(variables));
      } catch (storageError) {
        throw new Error('File too large for storage. Please use a smaller file (recommended: under 5MB).');
      }

      // Set local state to show variables inline
      setUploadedFile(file);
      setDetectedVariables(variables);
      setUploadSuccess(true);

    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'An error occurred while processing the file.');
    } finally {
      setIsUploading(false);
    }
  }, [router]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  // Removed separate success screen - show variables inline instead

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="border-border bg-card border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="text-card-foreground text-xl font-semibold hover:text-primary transition-colors">
                Docko
              </Link>
              
              {/* Breadcrumb */}
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/dashboard" className="hover:text-foreground transition-colors">
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

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stepper */}
        <div className="mb-8">
          <Stepper 
            currentStep={1} 
            steps={DOCUMENT_GENERATION_STEPS}
            className="max-w-2xl mx-auto"
          />
        </div>
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Upload Document Template
          </h1>
          <p className="text-muted-foreground">
            Upload your DOCX template with variable placeholders like {`{{variable_name}}`}.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Area - Takes 2 columns */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-8">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                    isDragOver
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-muted/20'
                  } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
                      <div>
                        <h3 className="text-lg font-medium text-foreground mb-2">
                          Processing Document...
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Analyzing your template and detecting variables
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        Drop your DOCX file here
                      </h3>
                      <p className="text-muted-foreground text-sm mb-6">
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
                        <Button type="button" onClick={() => document.getElementById('file-input')?.click()}>
                          Browse Files
                        </Button>
                      </label>
                    </>
                  )}
                </div>

                {/* Error Message */}
                {uploadError && (
                  <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                    <div>
                      <h4 className="font-medium text-destructive">Upload Error</h4>
                      <p className="text-sm text-destructive/80">{uploadError}</p>
                    </div>
                  </div>
                )}

                {/* Variables Display - Show after successful upload */}
                {uploadSuccess && detectedVariables && uploadedFile && (
                  <div className="mt-6 space-y-4">
                    {/* File Info */}
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <div className="flex-1">
                          <h4 className="font-medium text-green-900">{uploadedFile.name}</h4>
                          <p className="text-sm text-green-700">
                            Found {detectedVariables.total_count} variable{detectedVariables.total_count !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          {detectedVariables.total_count} variable{detectedVariables.total_count !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </div>

                    {/* Simple Variables */}
                    {detectedVariables.simple.length > 0 && (
                      <div className="p-4 border border-border rounded-lg">
                        <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                          <Hash className="h-4 w-4" />
                          Simple Variables ({detectedVariables.simple.length})
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {detectedVariables.simple.map((variable, index) => (
                            <code
                              key={index}
                              className="text-sm font-mono bg-muted px-2 py-1 rounded"
                            >
                              {`{{${variable}}}`}
                            </code>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section Variables */}
                    {detectedVariables.sections.length > 0 && (
                      <div className="p-4 border border-border rounded-lg">
                        <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                          <List className="h-4 w-4" />
                          Section Variables ({detectedVariables.sections.length})
                        </h4>
                        <div className="space-y-2">
                          {detectedVariables.sections.map((variable, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
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
                      <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-orange-900">No Variables Detected</h4>
                          <p className="text-sm text-orange-700">
                            We couldn't find any variables in your template. Variables should be formatted as {`{{variable_name}}`}.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Continue Button */}
                    <div className="flex justify-center pt-4">
                      <Button 
                        onClick={() => router.push('/generate/fill')}
                        size="lg"
                        className="flex items-center gap-2"
                      >
                        {detectedVariables.total_count > 0 ? 'Continue to Fill Variables' : 'Continue Anyway'}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Requirements - Only show when no variables detected yet */}
                {!uploadSuccess && (
                  <div className="mt-6 text-xs text-muted-foreground">
                    <p>
                      <strong>Requirements:</strong> DOCX files only, maximum 10MB
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
                  <h4 className="font-medium text-foreground mb-2">Variable Format</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Use double curly braces to create variables:
                  </p>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {`{{client_name}}`}
                  </code>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-2">Section Variables</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    For repeating sections like tables:
                  </p>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {`{{section_tables}}`}
                  </code>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-2">Examples</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• {`{{company_name}}`}</li>
                    <li>• {`{{invoice_number}}`}</li>
                    <li>• {`{{client_address}}`}</li>
                    <li>• {`{{section_items}}`}</li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-border">
                  <Link 
                    href="/help/getting-started"
                    className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "w-full")}
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