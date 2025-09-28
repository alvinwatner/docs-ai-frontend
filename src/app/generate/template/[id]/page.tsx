'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthGuard, UserMenu } from '@/components/auth';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { managementApi } from '@/lib/management-api';
import { trackDocumentEvent } from '@/lib/hotjar';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TemplateUsePage({ params }: PageProps) {
  return (
    <AuthGuard>
      <TemplateUseContent params={params} />
    </AuthGuard>
  );
}

function TemplateUseContent({ params }: PageProps) {
  const router = useRouter();

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        const { id } = await params;

        // Validate template exists and user has access
        await managementApi.templates.get(id);

        // Track template usage
        trackDocumentEvent('VARIABLES_DETECTED', {
          templateId: id,
          source: 'template_library',
          context: 'template_selection'
        });

        // Navigate to fill page with template ID
        router.push(`/generate/fill?template=${id}`);
      } catch (error) {
        console.error('Failed to load template:', error);

        // Track error
        trackDocumentEvent('UPLOAD_ERROR', {
          error: error instanceof Error ? error.message : 'Unknown error',
          source: 'template_library',
          context: 'template_selection'
        });

        // Handle different error types
        if (error instanceof Error && error.message.includes('404')) {
          router.push('/templates?error=not-found');
        } else {
          router.push('/templates?error=access-denied');
        }
      }
    };

    loadTemplate();
  }, [params, router]);

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="border-border bg-card border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link
                href="/dashboard"
                className="text-card-foreground text-xl font-semibold hover:text-primary transition-colors"
              >
                Docko
              </Link>

              {/* Breadcrumb */}
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
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
                <span>Use Template</span>
              </div>
            </div>

            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/templates"
            className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Templates
          </Link>
        </div>

        {/* Loading State */}
        <Card>
          <CardContent className="py-12 text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-medium mb-2">Loading Template</h3>
            <p className="text-muted-foreground">
              Preparing your template for document generation...
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}