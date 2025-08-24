'use client';

import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoginButton } from '@/components/auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { FileText, Settings, Zap } from 'lucide-react';

export default function HomePage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" label="Loading..." />
      </div>
    );
  }

  // Show landing page for unauthenticated users
  if (!user) {
    return <LandingPage />;
  }

  // This shouldn't render, but just in case
  return null;
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-card-foreground">Docko</h1>
            </div>
            <LoginButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-20 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl mb-6">
            Document Automation
            <br />
            <span className="text-primary">Made Simple</span>
          </h1>
          <div className="mx-auto max-w-2xl mb-10">
            <p className="text-lg leading-relaxed text-muted-foreground break-words">
              Use the DOCX templates you already know. No complex tools to learn. 
              Just upload your template, fill in the variables, and generate professional documents instantly.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <LoginButton size="lg" />
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Why Choose Docko?
          </h2>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Feature 1 */}
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Familiar Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Use Microsoft Word (.docx) files you already have. No need to learn new template designers.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Simple & Complex Variables</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Handle basic text replacement and complex repeating sections with tables - something no other tool can do.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>No Learning Curve</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Built for professionals who want results, not complexity. Clean interface designed for efficiency.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20 text-center border-t border-border">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to automate your documents?
          </h2>
          <p className="text-muted-foreground mb-8">
            Start with our free plan. No credit card required.
          </p>
          <LoginButton size="xl" />
        </div>
      </main>
    </div>
  );
}
