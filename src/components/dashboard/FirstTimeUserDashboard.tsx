'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FileText, Upload, BookOpen, HelpCircle, ArrowRight, Target, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function FirstTimeUserDashboard() {
  return (
    <div className="bg-background min-h-screen">
      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Welcome to Docko! 🎉
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your document creation workflow. Upload templates with variables,
            fill them with your data, and generate professional documents instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/generate/upload"
              className={cn(buttonVariants({ size: "lg" }), "flex items-center gap-2")}
            >
              <Upload className="h-5 w-5" />
              Upload Your First Template
            </Link>
            <Link
              href="/help/getting-started"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "flex items-center gap-2")}
            >
              <BookOpen className="h-5 w-5" />
              Learn More
            </Link>
          </div>
        </div>

        {/* How It Works Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Target className="h-6 w-6 text-primary" />
              How Docko Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full text-xl font-bold mb-4">
                  1
                </div>
                <h3 className="font-semibold text-lg mb-2">Upload Template</h3>
                <p className="text-muted-foreground">
                  Upload your DOCX template with {`{{variable}}`} placeholders where you want dynamic content.
                </p>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center justify-center">
                <ArrowRight className="h-6 w-6 text-muted-foreground" />
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full text-xl font-bold mb-4">
                  2
                </div>
                <h3 className="font-semibold text-lg mb-2">Fill Variables</h3>
                <p className="text-muted-foreground">
                  Fill in your custom values for each variable detected in your template.
                </p>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center justify-center">
                <ArrowRight className="h-6 w-6 text-muted-foreground" />
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full text-xl font-bold mb-4">
                  3
                </div>
                <h3 className="font-semibold text-lg mb-2">Download Document</h3>
                <p className="text-muted-foreground">
                  Download your personalized document in DOCX or PDF format.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Benefits Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Why Choose Docko?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Save Time:</span> Reuse templates instead of recreating documents
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Stay Consistent:</span> Maintain brand and formatting standards
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Scale Easily:</span> Generate hundreds of documents from one template
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Multiple Formats:</span> Export as DOCX or PDF
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Example Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Popular Use Cases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium mb-1">Business Documents</h4>
                  <p className="text-sm text-muted-foreground">Invoices, contracts, proposals, reports</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium mb-1">Personal Letters</h4>
                  <p className="text-sm text-muted-foreground">Cover letters, recommendations, invitations</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium mb-1">Educational Content</h4>
                  <p className="text-sm text-muted-foreground">Certificates, course materials, assessments</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium mb-1">Marketing Materials</h4>
                  <p className="text-sm text-muted-foreground">Brochures, newsletters, presentations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="text-center bg-primary/5 border-primary/20">
          <CardContent className="py-8">
            <h2 className="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Create your first template and experience the power of automated document generation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/generate/upload"
                className={cn(buttonVariants({ size: "lg" }), "flex items-center gap-2")}
              >
                <Upload className="h-5 w-5" />
                Upload Your First Template
              </Link>
              <Link
                href="/help"
                className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "flex items-center gap-2")}
              >
                <HelpCircle className="h-5 w-5" />
                Get Help
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}