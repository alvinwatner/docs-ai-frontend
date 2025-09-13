'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0';
import { AuthGuard, UserMenu } from '@/components/auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Stepper, DOCUMENT_GENERATION_STEPS } from '@/components/ui/stepper';
import { DocumentPreview } from '@/components/document-preview';
import { ArrowLeft, Download, CheckCircle2, RotateCcw, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

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
  const { } = useUser();
  const router = useRouter();
  const [variables, setVariables] = useState<DetectedVariables | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [variableValues, setVariableValues] = useState<VariableValues>({});
  const [isLoading, setIsLoading] = useState(true);
  const [exportFormat, setExportFormat] = useState<'docx' | 'pdf'>('docx');
  const [autoFormat, setAutoFormat] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState('');
  const [exportSuccess, setExportSuccess] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [exportStep, setExportStep] = useState<'idle' | 'merging' | 'formatting' | 'downloading'>('idle');
  const [mergedDocumentBlob, setMergedDocumentBlob] = useState<Blob | null>(null);
  const [previewError, setPreviewError] = useState<string>('');

  useEffect(() => {
    // Retrieve stored data from previous steps
    const storedVariables = sessionStorage.getItem('detected-variables');
    const storedFile = sessionStorage.getItem('uploaded-file');
    const storedValues = sessionStorage.getItem('variable-values');
    const storedMergedDoc = sessionStorage.getItem('merged-document');

    if (!storedVariables || !storedFile || !storedValues) {
      // Redirect back to upload if no data found
      router.push('/generate/upload');
      return;
    }

    try {
      setVariables(JSON.parse(storedVariables));
      setUploadedFile(JSON.parse(storedFile));
      setVariableValues(JSON.parse(storedValues));

      // Load merged document if available (from early merge in fill page)
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
          const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
          setMergedDocumentBlob(blob);
          setPreviewError(''); // Clear any previous preview errors
        } catch (error) {
          console.error('Error loading merged document for preview:', error);
          setPreviewError('Failed to load document preview. The merged document may be corrupted.');
        }
      }
    } catch (error) {
      console.error('Error parsing stored data:', error);
      router.push('/generate/upload');
      return;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Helper function to convert base64 to File object
  const base64ToFile = (base64String: string, filename: string): File => {
    const arr = base64String.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleExport = async () => {
    const storedFile = sessionStorage.getItem('uploaded-file');
    if (!storedFile || !variableValues) return;

    let parsedFileInfo: UploadedFile & { base64?: string };
    try {
      parsedFileInfo = JSON.parse(storedFile);
    } catch {
      setExportError('Unable to retrieve uploaded file. Please start over.');
      return;
    }

    if (!parsedFileInfo.base64) {
      setExportError('File data not found. Please re-upload your template.');
      return;
    }

    setIsExporting(true);
    setExportError('');
    setExportStep('merging');

    try {
      // Step 1: Merge variables
      const originalFile = base64ToFile(parsedFileInfo.base64, parsedFileInfo.name);
      const mergeFormData = new FormData();
      mergeFormData.append('file', originalFile);
      mergeFormData.append('variables', JSON.stringify(variableValues));

      const mergeResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/documents/merge-variables`, {
        method: 'POST',
        body: mergeFormData,
      });

      if (!mergeResponse.ok) {
        throw new Error(`Merge failed: ${mergeResponse.statusText}`);
      }

      let finalBlob = await mergeResponse.blob();
      let finalFilename = `${parsedFileInfo.name.replace('.docx', '')}_filled`;

      // Step 2: Format document if auto-formatting is enabled
      if (autoFormat) {
        setExportStep('formatting');

        const formatFormData = new FormData();
        const mergedFile = new File([finalBlob], `${finalFilename}.docx`, {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });
        formatFormData.append('file', mergedFile);

        const formatResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/documents/format`, {
          method: 'POST',
          body: formatFormData,
        });

        if (!formatResponse.ok) {
          throw new Error(`Formatting failed: ${formatResponse.statusText}`);
        }

        finalBlob = await formatResponse.blob();
        finalFilename += '_formatted';
      }

      // Step 3: Prepare download
      setExportStep('downloading');
      const url = window.URL.createObjectURL(finalBlob);
      setDownloadUrl(url);
      setExportSuccess(true);

      // Auto-download the file
      const link = document.createElement('a');
      link.href = url;
      link.download = `${finalFilename}.${exportFormat === 'pdf' ? 'pdf' : 'docx'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      setExportError(error instanceof Error ? error.message : 'Export failed');
    } finally {
      setIsExporting(false);
      setExportStep('idle');
    }
  };

  const handleStartNew = () => {
    // Clear all sessionStorage data
    sessionStorage.removeItem('uploaded-file');
    sessionStorage.removeItem('detected-variables');
    sessionStorage.removeItem('variable-values');
    
    // Redirect to dashboard
    router.push('/dashboard');
  };

  const handleGoBack = () => {
    router.push('/generate/fill');
  };

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen">
        <header className="border-border bg-card border-b">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-8">
                <Link href="/dashboard" className="text-card-foreground text-xl font-semibold hover:text-primary transition-colors">
                  Docko
                </Link>
              </div>
              <UserMenu />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading export options...</p>
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
              <Link href="/dashboard" className="text-card-foreground text-xl font-semibold hover:text-primary transition-colors">
                Docko
              </Link>
              
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/dashboard" className="hover:text-foreground transition-colors">
                  Dashboard
                </Link>
                <span>/</span>
                <Link href="/generate/upload" className="hover:text-foreground transition-colors">
                  Upload
                </Link>
                <span>/</span>
                <Link href="/generate/fill" className="hover:text-foreground transition-colors">
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

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stepper */}
        <div className="mb-8">
          <Stepper 
            currentStep={3} 
            steps={DOCUMENT_GENERATION_STEPS}
            className="max-w-2xl mx-auto"
          />
        </div>

        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={handleGoBack}
            className="mb-4"
            disabled={isExporting}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Fill Variables
          </Button>
          
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Export Your Document
          </h1>
          <p className="text-muted-foreground">
            Review your document settings and download your personalized file.
          </p>
        </div>

        {exportSuccess ? (
          // Success State
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle2 className="mx-auto h-16 w-16 text-green-600 mb-6" />
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Document Generated Successfully!
                </h2>
                <p className="text-muted-foreground mb-8">
                  Your personalized document has been generated and downloaded.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  {downloadUrl && (
                    <a
                      href={downloadUrl}
                      download={`${uploadedFile.name.replace('.docx', '')}_filled.${exportFormat}`}
                      className={cn(buttonVariants(), "flex items-center gap-2")}
                    >
                      <Download className="h-4 w-4" />
                      Download Again
                    </a>
                  )}
                  
                  <Button variant="outline" onClick={handleStartNew}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Create Another Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Export Options - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Document Preview */}
              <DocumentPreview
                documentBlob={mergedDocumentBlob}
                fileName={uploadedFile?.name ? uploadedFile.name.replace('.docx', '_merged.docx') : 'merged_document.docx'}
                className="h-[600px]"
              />

              {/* Preview Error Display */}
              {previewError && (
                <Card className="border-destructive/20 bg-destructive/10">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                      <div>
                        <h4 className="font-medium text-destructive">Preview Error</h4>
                        <p className="text-sm text-destructive/80">{previewError}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Export Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Export Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Format Selection */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">Export Format</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="format"
                          value="docx"
                          checked={exportFormat === 'docx'}
                          onChange={(e) => setExportFormat(e.target.value as 'docx' | 'pdf')}
                          className="text-primary focus:ring-primary"
                        />
                        <span className="text-sm">DOCX (Editable)</span>
                      </label>
                      
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="format"
                          value="pdf"
                          checked={exportFormat === 'pdf'}
                          onChange={(e) => setExportFormat(e.target.value as 'docx' | 'pdf')}
                          className="text-primary focus:ring-primary"
                        />
                        <span className="text-sm">PDF (Read-only)</span>
                      </label>
                    </div>
                  </div>

                  {/* Auto-formatting Option */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="auto-format"
                        checked={autoFormat}
                        onChange={(e) => setAutoFormat(e.target.checked)}
                        className="mt-1"
                      />
                      <div>
                        <label htmlFor="auto-format" className="text-sm font-medium text-foreground cursor-pointer">
                          Apply automatic formatting
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Improve spacing, fonts, and layout for better readability
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Error Message */}
                  {exportError && (
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                      <div>
                        <h4 className="font-medium text-destructive">Export Error</h4>
                        <p className="text-sm text-destructive/80">{exportError}</p>
                      </div>
                    </div>
                  )}

                  {/* Generate Button with Progress States */}
                  <div className="pt-4">
                    <Button 
                      onClick={handleExport}
                      disabled={isExporting}
                      size="lg"
                      className="w-full flex items-center gap-2"
                    >
                      {isExporting ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                          {exportStep === 'formatting' && 'Formatting Content...'}
                          {exportStep === 'downloading' && 'Preparing Download...'}
                          {exportStep === 'idle' && 'Preparing Export...'}
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" />
                          Generate & Download Document
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Progress Indicator */}
                  {isExporting && (
                    <div className="mt-4 text-center">
                      <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                        
                        {autoFormat && (
                          <>
                            <div className="h-px w-8 bg-border" />
                            <div className={`flex items-center gap-2 ${exportStep === 'formatting' ? 'text-primary font-medium' : exportStep === 'downloading' ? 'text-green-600' : 'text-muted-foreground'}`}>
                              {exportStep === 'formatting' ? (
                                <div className="animate-spin h-3 w-3 border border-current border-t-transparent rounded-full" />
                              ) : exportStep === 'downloading' ? (
                                <CheckCircle2 className="h-3 w-3" />
                              ) : (
                                <div className="h-3 w-3 border border-muted rounded-full" />
                              )}
                              <span>Formatting Content</span>
                            </div>
                          </>
                        )}
                        
                        <div className="h-px w-8 bg-border" />
                        <div className={`flex items-center gap-2 ${exportStep === 'downloading' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                          {exportStep === 'downloading' ? (
                            <div className="animate-spin h-3 w-3 border border-current border-t-transparent rounded-full" />
                          ) : (
                            <div className="h-3 w-3 border border-muted rounded-full" />
                          )}
                          <span>Download Ready</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Document Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">Template</p>
                    <p className="text-sm text-muted-foreground">{uploadedFile.name}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-foreground">Variables Filled</p>
                    <p className="text-sm text-muted-foreground">
                      {variables.total_count} variable{variables.total_count !== 1 ? 's' : ''}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-foreground">Export Format</p>
                    <p className="text-sm text-muted-foreground">
                      {exportFormat.toUpperCase()} {exportFormat === 'docx' ? '(Editable)' : '(Read-only)'}
                    </p>
                  </div>

                  {autoFormat && (
                    <div>
                      <p className="text-sm font-medium text-foreground">Formatting</p>
                      <p className="text-sm text-muted-foreground">Auto-formatting enabled</p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-border">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleStartNew}
                      className="w-full"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
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