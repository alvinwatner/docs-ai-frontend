'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0';
import { AuthGuard, UserMenu } from '@/components/auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Stepper, DOCUMENT_GENERATION_STEPS } from '@/components/ui/stepper';
import { ArrowRight, Plus, Trash2, Hash, List, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { trackDocumentEvent } from '@/lib/hotjar';
import { managementApi } from '@/lib/management-api';
import { snakeToTitle } from '@/lib/utils';
import useSWR from 'swr';

// Helper function to generate contextual placeholder examples
const getPlaceholderExample = (variable: string): string => {
  const lowerVar = variable.toLowerCase();

  // Common variable patterns with example values
  if (lowerVar.includes('name') && lowerVar.includes('company')) return 'Acme Corporation';
  if (lowerVar.includes('name') && lowerVar.includes('client')) return 'John Smith';
  if (lowerVar.includes('name') && lowerVar.includes('first')) return 'John';
  if (lowerVar.includes('name') && lowerVar.includes('last')) return 'Smith';
  if (lowerVar.includes('name')) return 'John Smith';
  if (lowerVar.includes('email')) return 'john@example.com';
  if (lowerVar.includes('phone')) return '+1 (555) 123-4567';
  if (lowerVar.includes('address')) return '123 Main Street';
  if (lowerVar.includes('city')) return 'San Francisco';
  if (lowerVar.includes('state')) return 'California';
  if (lowerVar.includes('zip') || lowerVar.includes('postal')) return '94102';
  if (lowerVar.includes('country')) return 'United States';
  if (lowerVar.includes('date')) return 'January 15, 2025';
  if (lowerVar.includes('amount') || lowerVar.includes('price') || lowerVar.includes('total')) return '$1,500.00';
  if (lowerVar.includes('number') || lowerVar.includes('id')) return '12345';
  if (lowerVar.includes('title')) return 'Senior Manager';
  if (lowerVar.includes('description')) return 'Brief description here...';

  // Default: generate a generic example based on the variable name
  return snakeToTitle(variable);
};

interface TableRow {
  key: string;
  value: string;
}

interface SectionData {
  title: string;
  table_rows: TableRow[];
}

interface VariableValues {
  [key: string]: string | SectionData[];
}

// Custom hook for template fetching with SWR
const useTemplate = (templateId: string | null) => {
  return useSWR(
    templateId ? `/api/management/templates/${templateId}` : null,
    () => managementApi.templates.get(templateId!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000, // 30 seconds
      shouldRetryOnError: true,
      errorRetryCount: 3,
      errorRetryInterval: 2000
    }
  );
};

// Error handling strategy
const handleTemplateError = (error: Error, templateId: string, router: ReturnType<typeof useRouter>) => {
  trackDocumentEvent('UPLOAD_ERROR', {
    templateId,
    error: error.message,
    context: 'template_load'
  });

  console.error('Template loading error:', error);

  // Graceful fallback options
  if (error.message.includes('404') || error.message.includes('not found')) {
    router.push('/templates?error=not-found');
  } else if (error.message.includes('Network')) {
    // Network errors are handled by SWR retry mechanism
    return;
  } else {
    router.push('/templates?error=load-failed');
  }
};

export default function FillPage() {
  return (
    <AuthGuard>
      <FillContent />
    </AuthGuard>
  );
}

function FillContent() {
  const { } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template');

  // Use SWR for template fetching
  const { data: template, error, isLoading, mutate } = useTemplate(templateId);

  const [variableValues, setVariableValues] = useState<VariableValues>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isPerformingMerge, setIsPerformingMerge] = useState(false);

  // Handle template loading errors
  useEffect(() => {
    if (error && templateId) {
      handleTemplateError(error, templateId, router);
    }
  }, [error, templateId, router]);

  // Redirect if no template ID provided
  useEffect(() => {
    if (!templateId) {
      router.push('/generate/upload');
      return;
    }
  }, [templateId, router]);

  // Initialize variable values when template loads
  useEffect(() => {
    if (template) {
      const initialValues: VariableValues = {};

      // Initialize simple variables with empty strings
      template.variables_detected.simple.forEach((variable: string) => {
        initialValues[variable] = '';
      });

      // Initialize section variables with empty array
      template.variables_detected.sections.forEach((variable: string) => {
        initialValues[variable] = [{
          title: '',
          table_rows: [{ key: '', value: '' }]
        }];
      });

      setVariableValues(initialValues);

      // Track successful template load
      trackDocumentEvent('VARIABLES_DETECTED', {
        templateId: template.id,
        variableCount: template.variables_detected.total_count,
        context: 'template_reuse'
      });
    }
  }, [template]);

  const handleSimpleVariableChange = (variable: string, value: string) => {
    setVariableValues(prev => ({
      ...prev,
      [variable]: value
    }));
    
    // Clear error for this field
    if (errors[variable]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[variable];
        return newErrors;
      });
    }
  };

  const handleSectionChange = (sectionVariable: string, sectionIndex: number, field: keyof SectionData, value: string) => {
    setVariableValues(prev => {
      const sections = prev[sectionVariable] as SectionData[];
      const updatedSections = [...sections];
      
      if (field === 'title') {
        updatedSections[sectionIndex] = {
          ...updatedSections[sectionIndex],
          title: value
        };
      }
      
      return {
        ...prev,
        [sectionVariable]: updatedSections
      };
    });
  };

  const handleTableRowChange = (sectionVariable: string, sectionIndex: number, rowIndex: number, field: keyof TableRow, value: string) => {
    setVariableValues(prev => {
      const sections = prev[sectionVariable] as SectionData[];
      const updatedSections = [...sections];
      const updatedRows = [...updatedSections[sectionIndex].table_rows];
      
      updatedRows[rowIndex] = {
        ...updatedRows[rowIndex],
        [field]: value
      };
      
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        table_rows: updatedRows
      };
      
      return {
        ...prev,
        [sectionVariable]: updatedSections
      };
    });
  };

  const addTableRow = (sectionVariable: string, sectionIndex: number) => {
    setVariableValues(prev => {
      const sections = prev[sectionVariable] as SectionData[];
      const updatedSections = [...sections];
      
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        table_rows: [
          ...updatedSections[sectionIndex].table_rows,
          { key: '', value: '' }
        ]
      };
      
      return {
        ...prev,
        [sectionVariable]: updatedSections
      };
    });
  };

  const removeTableRow = (sectionVariable: string, sectionIndex: number, rowIndex: number) => {
    setVariableValues(prev => {
      const sections = prev[sectionVariable] as SectionData[];
      const updatedSections = [...sections];
      
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        table_rows: updatedSections[sectionIndex].table_rows.filter((_, i) => i !== rowIndex)
      };
      
      return {
        ...prev,
        [sectionVariable]: updatedSections
      };
    });
  };

  const addSection = (sectionVariable: string) => {
    setVariableValues(prev => {
      const sections = prev[sectionVariable] as SectionData[];
      return {
        ...prev,
        [sectionVariable]: [
          ...sections,
          {
            title: '',
            table_rows: [{ key: '', value: '' }]
          }
        ]
      };
    });
  };

  const removeSection = (sectionVariable: string, sectionIndex: number) => {
    setVariableValues(prev => {
      const sections = prev[sectionVariable] as SectionData[];
      return {
        ...prev,
        [sectionVariable]: sections.filter((_, i) => i !== sectionIndex)
      };
    });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Validate simple variables
    if (template) {
      template.variables_detected.simple.forEach(variable => {
        const value = variableValues[variable] as string;
        if (!value || value.trim() === '') {
          newErrors[variable] = 'This field is required';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (!validateForm()) {
      return;
    }

    setIsPerformingMerge(true);

    try {
      // Track variables filled
      trackDocumentEvent('VARIABLES_FILLED', {
        totalVariables: template?.variables_detected.total_count || 0,
        filledCount: Object.keys(variableValues).length,
        templateId: template?.id
      });

      // Track merge start
      trackDocumentEvent('MERGE_STARTED');

      // Perform merge and get document ID
      const documentId = await performMerge();

      // Track successful merge
      trackDocumentEvent('MERGE_COMPLETED');

      // Navigate with URL parameters instead of sessionStorage
      router.push(`/generate/export?template=${template?.id}&document=${documentId}`);
    } catch (error) {
      console.error('Error during merge:', error);

      // Track merge error
      trackDocumentEvent('MERGE_ERROR', {
        error: error instanceof Error ? error.message : 'Unknown merge error'
      });

      // Navigate to export page even if merge fails (for error handling)
      router.push(`/generate/export?template=${template?.id}`);
    } finally {
      setIsPerformingMerge(false);
    }
  };


  const performMerge = async (): Promise<string> => {
    if (!template || !variableValues) {
      throw new Error('Template or variable values not available');
    }

    // Store data for export page
    sessionStorage.setItem('variable-values', JSON.stringify(variableValues));
    sessionStorage.setItem('detected-variables', JSON.stringify(template.variables_detected));
    sessionStorage.setItem('uploaded-file', JSON.stringify({
      name: template.original_filename,
      size: template.file_size_bytes,
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    }));

    // Prepare form data for merge API with template reference
    const mergeFormData = new FormData();
    mergeFormData.append('variables', JSON.stringify(variableValues));
    mergeFormData.append('template_id', template.id);

    // Call merge API via Next.js API route
    const mergeResponse = await fetch('/api/documents/merge-variables', {
      method: 'POST',
      body: mergeFormData,
    });

    if (!mergeResponse.ok) {
      throw new Error(`Merge failed: ${mergeResponse.statusText}`);
    }

    // Extract document ID from response headers
    const documentId = mergeResponse.headers.get('X-Document-ID');
    if (!documentId) {
      throw new Error('Document ID not returned from merge API');
    }

    // Store merged document blob for preview
    const mergedBlob = await mergeResponse.blob();
    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result as string;
      sessionStorage.setItem('merged-document', JSON.stringify({ data: base64Data }));
      console.log('Successfully stored merged document for preview');
    };
    reader.readAsDataURL(mergedBlob);

    console.log('Successfully merged variables and created document:', documentId);
    return documentId;
  };


  // Enhanced loading state with skeletons
  if (isLoading || !template) {
    return (
      <div className="bg-background min-h-screen">
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
                  <Skeleton className="h-4 w-16" />
                  <span>/</span>
                  <span>Fill Variables</span>
                </div>
              </div>

              <UserMenu />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Stepper skeleton */}
          <div className="mb-8">
            <Skeleton className="h-16 w-full max-w-2xl mx-auto" />
          </div>

          <div className="mb-8">
            <Skeleton className="h-6 w-32 mb-4" /> {/* Back button */}
            <Skeleton className="h-8 w-64 mb-2" /> {/* Template name */}
            <Skeleton className="h-4 w-96" /> {/* Description */}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Form skeletons - Takes 3 columns */}
            <div className="lg:col-span-3 space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" /> {/* Variables title */}
                </CardHeader>
                <CardContent className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-32" /> {/* Variable label */}
                      <Skeleton className="h-10 w-full" /> {/* Input field */}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Continue button skeleton */}
              <div className="flex justify-center pt-6">
                <Skeleton className="h-12 w-48" />
              </div>
            </div>

            {/* Sidebar skeleton */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-20" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show error state if template failed to load
  if (error) {
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
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
              <h3 className="text-lg font-medium mb-2">Failed to Load Template</h3>
              <p className="text-muted-foreground mb-6">
                We couldn&apos;t load the template data. Please try again or contact support if the problem persists.
              </p>
              <div className="flex justify-center gap-4">
                <Button onClick={() => mutate()} variant="outline">
                  Retry
                </Button>
                <Button onClick={() => router.push('/templates')}>
                  Back to Templates
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
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
                <Link href="/templates" className="hover:text-foreground transition-colors">
                  Templates
                </Link>
                <span>/</span>
                <span>Fill Variables</span>
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
            currentStep={2}
            steps={DOCUMENT_GENERATION_STEPS}
            className="max-w-2xl mx-auto"
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
       
          
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Fill Variables: {template.name}
          </h1>
          <p className="text-muted-foreground">
            Enter values for the {template.variables_detected.total_count} variable{template.variables_detected.total_count !== 1 ? 's' : ''} found in your template.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Form - Takes 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            {/* Simple Variables */}
            {template.variables_detected.simple.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="h-5 w-5" />
                    Simple Variables ({template.variables_detected.simple.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {template.variables_detected.simple.map((variable, index) => (
                    <div key={index} className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        {snakeToTitle(variable)}
                      </label>
                      <Input
                        type="text"
                        value={(variableValues[variable] as string) || ''}
                        onChange={(e) => handleSimpleVariableChange(variable, e.target.value)}
                        placeholder={`e.g., ${getPlaceholderExample(variable)}`}
                        className={errors[variable] ? 'border-destructive' : ''}
                      />
                      {errors[variable] && (
                        <p className="text-sm text-destructive">{errors[variable]}</p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Section Variables */}
            {template.variables_detected.sections.map((sectionVariable, sectionVarIndex) => (
              <Card key={sectionVarIndex}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <List className="h-5 w-5" />
                    {snakeToTitle(sectionVariable)}
                    <span className="text-sm font-normal text-muted-foreground">(Repeating Section)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {variableValues[sectionVariable] && Array.isArray(variableValues[sectionVariable]) ? (
                    (variableValues[sectionVariable] as SectionData[]).map((section, sectionIndex) => (
                    <div key={sectionIndex} className="space-y-4 p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Section {sectionIndex + 1}</h4>
                        {variableValues[sectionVariable] && (variableValues[sectionVariable] as SectionData[]).length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSection(sectionVariable, sectionIndex)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Section Title</label>
                        <Input
                          type="text"
                          value={section.title}
                          onChange={(e) => handleSectionChange(sectionVariable, sectionIndex, 'title', e.target.value)}
                          placeholder="Enter section title"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium text-foreground">Table Rows</label>
                        {section.table_rows.map((row, rowIndex) => (
                          <div key={rowIndex} className="flex items-center gap-2">
                            <Input
                              type="text"
                              value={row.key}
                              onChange={(e) => handleTableRowChange(sectionVariable, sectionIndex, rowIndex, 'key', e.target.value)}
                              placeholder="Key"
                              className="flex-1"
                            />
                            <Input
                              type="text"
                              value={row.value}
                              onChange={(e) => handleTableRowChange(sectionVariable, sectionIndex, rowIndex, 'value', e.target.value)}
                              placeholder="Value"
                              className="flex-1"
                            />
                            {section.table_rows.length > 1 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeTableRow(sectionVariable, sectionIndex, rowIndex)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addTableRow(sectionVariable, sectionIndex)}
                          className="flex items-center gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add Row
                        </Button>
                      </div>
                    </div>
                  ))
                  ) : (
                    // Loading state for section variables
                    <div className="text-center py-4">
                      <p className="text-muted-foreground text-sm">Initializing section variables...</p>
                    </div>
                  )}

                  {variableValues[sectionVariable] && (
                  <Button
                    variant="outline"
                    onClick={() => addSection(sectionVariable)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Section
                  </Button>
                  )}
                </CardContent>
              </Card>
            ))}

            {/* Continue Button */}
            <div className="flex justify-center pt-6">
              <Button
                onClick={handleContinue}
                disabled={isPerformingMerge}
                size="lg"
                className="flex items-center gap-2"
              >
                {isPerformingMerge ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    Merging & Preparing Preview...
                  </>
                ) : (
                  <>
                    Continue to Export
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs font-medium text-green-700">
                    ✓
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Upload & Review</p>
                    <p className="text-xs text-muted-foreground">Template uploaded</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Fill Variables</p>
                    <p className="text-xs text-muted-foreground">
                      {template.variables_detected.total_count} variable{template.variables_detected.total_count !== 1 ? 's' : ''} to fill
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                    3
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Export Document</p>
                    <p className="text-xs text-muted-foreground">Download final document</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}