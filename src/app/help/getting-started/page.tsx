'use client';

import React, { useState } from 'react';
import { AuthGuard } from '@/components/auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft,
  ArrowRight,
  Book,
  Upload,
  Edit3,
  Download,
  FileText,
  CheckCircle,
  Info,
  Copy,
  ChevronRight,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function GettingStartedPage() {
  return (
    <AuthGuard>
      <GettingStartedContent />
    </AuthGuard>
  );
}

function GettingStartedContent() {
  const [copiedExample, setCopiedExample] = useState<string | null>(null);

  const handleCopyExample = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedExample(id);
    setTimeout(() => setCopiedExample(null), 2000);
  };

  const sections = [
    {
      id: 'overview',
      title: 'How Docko Works',
      icon: Book,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Docko transforms your Word documents into powerful templates using a
            simple variable system. Create once, use forever – with perfect
            formatting every time.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="mb-1 font-semibold">1. Design Your Template</h4>
              <p className="text-muted-foreground text-sm">
                Create a Word document with variables using double curly braces
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                <Edit3 className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="mb-1 font-semibold">2. Fill In Variables</h4>
              <p className="text-muted-foreground text-sm">
                Our system detects variables and creates an easy form for you
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Download className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="mb-1 font-semibold">
                3. Export Perfect Documents
              </h4>
              <p className="text-muted-foreground text-sm">
                Download professionally formatted DOCX or PDF files instantly
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'first-template',
      title: 'Creating Your First Template',
      icon: FileText,
      content: (
        <div className="space-y-6">
          <Alert className="flex items-center border-blue-200 bg-blue-50">
            <Info className="mr-2 h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Templates are regular Word documents with special placeholders
              called variables.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h4 className="font-semibold">Step 1: Open Microsoft Word</h4>
            <p className="text-muted-foreground">
              Create a new document or open an existing one you want to convert
              into a template.
            </p>

            <h4 className="font-semibold">Step 2: Add Variables</h4>
            <p className="text-muted-foreground">
              Replace specific text with variables using double curly braces:
            </p>

            <div className="bg-muted rounded-lg p-4 font-mono text-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p>Dear {'{{client_name}}'},</p>
                  <p className="mt-2">
                    Thank you for your order #{'{{order_number}}'}.
                  </p>
                  <p className="mt-2">Total Amount: ${'{{total_amount}}'}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    handleCopyExample(
                      'Dear {{client_name}},\n\nThank you for your order #{{order_number}}.\n\nTotal Amount: ${{total_amount}}',
                      'simple'
                    )
                  }
                >
                  {copiedExample === 'simple' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <h4 className="font-semibold">Step 3: Save as DOCX</h4>
            <p className="text-muted-foreground">
              Save your template as a .docx file (not .doc or other formats).
            </p>

            <h4 className="font-semibold">Step 4: Upload to Docko</h4>
            <p className="text-muted-foreground">
              Upload your template and watch Docko automatically detect all
              variables!
            </p>
          </div>

          <div className="mt-6">
            <Link href="/generate/upload">
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload Your First Template
              </Button>
            </Link>
          </div>
        </div>
      ),
    },
    {
      id: 'variable-types',
      title: 'Understanding Variables',
      icon: Zap,
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <h4 className="mb-2 font-semibold">Simple Variables</h4>
              <p className="text-muted-foreground mb-3">
                Basic text replacement for names, dates, numbers, and more.
              </p>
              <div className="bg-muted rounded-lg p-4 font-mono text-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p>{'{{company_name}}'}</p>
                    <p>{'{{invoice_date}}'}</p>
                    <p>{'{{customer_email}}'}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleCopyExample(
                        '{{company_name}}\n{{invoice_date}}\n{{customer_email}}',
                        'variables'
                      )
                    }
                  >
                    {copiedExample === 'variables' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <h4 className="mb-2 font-semibold">
                Section Variables (Advanced)
              </h4>
              <p className="text-muted-foreground mb-3">
                Create repeating sections with dynamic tables and content.
              </p>
              <div className="bg-muted rounded-lg p-4 font-mono text-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p>{'{{section_table}}'}</p>
                    <p className="text-muted-foreground mt-2 text-xs">
                      Creates a repeating section with title and table
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleCopyExample('{{section_table}}', 'section')
                    }
                  >
                    {copiedExample === 'section' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <Alert className="mt-3">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Section variables let you add multiple instances of content
                  blocks with tables. Perfect for invoices with multiple line
                  items or contracts with multiple sections.
                </AlertDescription>
              </Alert>
            </div>

            <div>
              <h4 className="mb-2 font-semibold">Variable Naming Rules</h4>
              <ul className="text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 text-green-600" />
                  <span>Use lowercase letters, numbers, and underscores</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 text-green-600" />
                  <span>Start with a letter (not a number)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 text-green-600" />
                  <span>Make names descriptive (client_name not cn)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 text-green-600" />
                  <span>Avoid spaces and special characters</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'auto-formatting',
      title: 'Auto-Formatting Magic',
      icon: Zap,
      content: (
        <div className="space-y-6">
          <p className="text-muted-foreground">
            Docko automatically ensures your documents look professional with
            intelligent formatting.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Smart Content Grouping
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-2 text-sm">
                <p>✓ Headers stay with their paragraphs</p>
                <p>✓ Tables don&apos;t break awkwardly</p>
                <p>✓ Lists remain intact</p>
                <p>✓ No orphaned headings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Perfect Line Spacing
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-2 text-sm">
                <p>✓ Exactly one line break after paragraphs</p>
                <p>✓ Consistent spacing throughout</p>
                <p>✓ No extra blank pages</p>
                <p>✓ Professional appearance</p>
              </CardContent>
            </Card>
          </div>

          <Alert className="border-green-200 bg-green-50 items-center flex">
            <Zap className="h-4 w-4 text-green-600 mr-3" />
            <AlertDescription className="text-green-800">
              <strong>Lightning Fast:</strong> All formatting happens in under
              100ms with 100% consistent results!
            </AlertDescription>
          </Alert>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/help">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Help Center
                </Button>
              </Link>
              <div className="bg-border h-6 w-px" />
              <div>
                <h1 className="text-2xl font-bold">Getting Started Guide</h1>
                <p className="text-muted-foreground text-sm">
                  Everything you need to start using Docko
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {sections.map((section, index) => (
              <React.Fragment key={section.id}>
                <div className="flex flex-col items-center">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                    <section.icon className="text-primary h-5 w-5" />
                  </div>
                  <span className="mt-2 hidden text-center text-xs md:block">
                    {section.title.split(' ').slice(0, 2).join(' ')}
                  </span>
                </div>
                {index < sections.length - 1 && (
                  <div className="bg-border mx-2 h-0.5 flex-1" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                      <section.icon className="text-primary h-5 w-5" />
                    </div>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>{section.content}</CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Next Steps */}
        <Card className="from-primary/5 to-primary/10 border-primary/20 mt-8 bg-gradient-to-br">
          <CardHeader>
            <CardTitle>Ready to Create?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You now have everything you need to start creating amazing
              documents with Docko!
            </p>
            <div className="flex gap-3">
              <Link href="/generate/upload">
                <Button>
                  Start Creating
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/help">
                <Button variant="outline">Explore More Topics</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
