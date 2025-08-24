'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0';
import { AuthGuard, UserMenu } from '@/components/auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Stepper, DOCUMENT_GENERATION_STEPS } from '@/components/ui/stepper';
import { ArrowLeft, ArrowRight, Plus, Trash2, Hash, List } from 'lucide-react';
import Link from 'next/link';

interface DetectedVariables {
  simple: string[];
  sections: string[];
  total_count: number;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

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

export default function FillPage() {
  return (
    <AuthGuard>
      <FillContent />
    </AuthGuard>
  );
}

function FillContent() {
  const { user } = useUser();
  const router = useRouter();
  const [variables, setVariables] = useState<DetectedVariables | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [variableValues, setVariableValues] = useState<VariableValues>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Retrieve stored data from previous steps
    const storedVariables = sessionStorage.getItem('detected-variables');
    const storedFile = sessionStorage.getItem('uploaded-file');

    if (!storedVariables || !storedFile) {
      // Redirect back to upload if no data found
      router.push('/generate/upload');
      return;
    }

    try {
      const parsedVariables = JSON.parse(storedVariables);
      const parsedFile = JSON.parse(storedFile);
      
      setVariables(parsedVariables);
      setUploadedFile(parsedFile);
      
      // Initialize variable values
      const initialValues: VariableValues = {};
      
      // Initialize simple variables with empty strings
      parsedVariables.simple.forEach((variable: string) => {
        initialValues[variable] = '';
      });
      
      // Initialize section variables with empty array
      parsedVariables.sections.forEach((variable: string) => {
        initialValues[variable] = [{
          title: '',
          table_rows: [{ key: '', value: '' }]
        }];
      });
      
      setVariableValues(initialValues);
    } catch (error) {
      console.error('Error parsing stored data:', error);
      router.push('/generate/upload');
      return;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

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
    if (variables) {
      variables.simple.forEach(variable => {
        const value = variableValues[variable] as string;
        if (!value || value.trim() === '') {
          newErrors[variable] = 'This field is required';
        }
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validateForm()) {
      return;
    }
    
    // Store filled values for the next step
    sessionStorage.setItem('variable-values', JSON.stringify(variableValues));
    router.push('/generate/export');
  };

  const handleGoBack = () => {
    router.push('/generate/upload');
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
              <p className="text-muted-foreground">Loading variables...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!variables || !uploadedFile) {
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
                <span>Fill Variables</span>
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
            currentStep={2} 
            steps={DOCUMENT_GENERATION_STEPS}
            className="max-w-2xl mx-auto"
          />
        </div>

        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={handleGoBack}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Upload
          </Button>
          
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Fill Variable Values
          </h1>
          <p className="text-muted-foreground">
            Enter values for each variable found in your template.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Form - Takes 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            {/* Simple Variables */}
            {variables.simple.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="h-5 w-5" />
                    Simple Variables ({variables.simple.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {variables.simple.map((variable, index) => (
                    <div key={index} className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        {`{{${variable}}}`}
                      </label>
                      <Input
                        type="text"
                        value={(variableValues[variable] as string) || ''}
                        onChange={(e) => handleSimpleVariableChange(variable, e.target.value)}
                        placeholder={`Enter value for ${variable}`}
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
            {variables.sections.map((sectionVariable, sectionVarIndex) => (
              <Card key={sectionVarIndex}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <List className="h-5 w-5" />
                    {`{{${sectionVariable}}}`}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {(variableValues[sectionVariable] as SectionData[]).map((section, sectionIndex) => (
                    <div key={sectionIndex} className="space-y-4 p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Section {sectionIndex + 1}</h4>
                        {(variableValues[sectionVariable] as SectionData[]).length > 1 && (
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
                  ))}

                  <Button
                    variant="outline"
                    onClick={() => addSection(sectionVariable)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Section
                  </Button>
                </CardContent>
              </Card>
            ))}

            {/* Continue Button */}
            <div className="flex justify-center pt-6">
              <Button 
                onClick={handleContinue}
                size="lg"
                className="flex items-center gap-2"
              >
                Continue to Export
                <ArrowRight className="h-4 w-4" />
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
                      {variables.total_count} variable{variables.total_count !== 1 ? 's' : ''} to fill
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