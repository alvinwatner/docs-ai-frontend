'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  FileText,
  Upload,
  Clock,
  Download,
  Star,
  ExternalLink,
  Rocket,
  FolderOpen,
  BookOpen
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Template, Document, managementApi } from '@/lib/management-api';
import { Tooltip } from '@/components/ui/tooltip';
import {
  truncateFilename,
  getFileTypeIcon,
  formatRelativeTime
} from '@/lib/document-utils';

interface ReturningUserDashboardProps {
  user: {
    name: string;
  };
  stats: {
    documents_created: number;
    templates_uploaded: number;
    storage_used_bytes: number;
    storage_quota_bytes: number;
    storage_percentage: number;
  };
  recentTemplates: Template[];
  recentDocuments: Document[];
}

export default function ReturningUserDashboard({
  user,
  stats,
  recentTemplates,
  recentDocuments
}: ReturningUserDashboardProps) {
  const [loadingDocuments, setLoadingDocuments] = useState<Record<string, boolean>>({});

  const handleUseTemplate = (templateId: string) => {
    // Navigate to generation flow with template pre-selected
    window.location.href = `/generate/template/${templateId}`;
  };

  const handleDownloadDocument = async (docId: string) => {
    setLoadingDocuments(prev => ({ ...prev, [docId]: true }));
    try {
      const { download_url } = await managementApi.documents.downloadUrl(docId);
      window.open(download_url, '_blank');
    } catch (error) {
      console.error('Failed to download document:', error);
    } finally {
      setLoadingDocuments(prev => ({ ...prev, [docId]: false }));
    }
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Welcome back, {user.name?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p className="text-muted-foreground mb-6">
            Ready to generate your next document? Choose from your templates below.
          </p>

          {/* Primary Actions - Conditional based on template count */}
          <div className="flex flex-col sm:flex-row gap-4">
            {recentTemplates.length === 0 ? (
              <>
                <Link
                  href="/generate/upload"
                  className={cn(buttonVariants({ size: "lg" }), "flex items-center gap-2")}
                >
                  <Upload className="h-5 w-5" />
                  Upload Template
                </Link>
                <Link
                  href="/help/getting-started"
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }), "flex items-center gap-2")}
                >
                  <BookOpen className="h-5 w-5" />
                  View Guide
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/templates"
                  className={cn(buttonVariants({ size: "lg" }), "flex items-center gap-2")}
                >
                  <Rocket className="h-5 w-5" />
                  Generate from Template
                </Link>
                <Link
                  href="/generate/upload"
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }), "flex items-center gap-2")}
                >
                  <Upload className="h-5 w-5" />
                  Upload New Template
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Templates Section - Takes 2 columns */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen className="h-5 w-5" />
                    My Templates
                    {stats.templates_uploaded > 0 && (
                      <span className="text-sm font-normal text-muted-foreground">
                        (Showing {Math.min(recentTemplates.length, 5)} of {stats.templates_uploaded})
                      </span>
                    )}
                  </CardTitle>
                  {recentTemplates.length > 0 && (
                    <Link
                      href="/templates"
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                    >
                      View All
                    </Link>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {recentTemplates.length === 0 ? (
                  <div className="text-center py-8">
                    <FolderOpen className="mx-auto mb-4 h-12 w-12 opacity-50" />
                    <p className="text-muted-foreground mb-4">No templates yet</p>
                    <Link
                      href="/generate/upload"
                      className={cn(buttonVariants())}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Your First Template
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recentTemplates.map((template) => {
                      const FileIcon = getFileTypeIcon('docx');

                      return (
                        <Card key={template.id} className="group hover:shadow-md hover:scale-[1.02] transition-all duration-200">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <Tooltip content={template.name}>
                                  <h4 className="font-medium text-sm truncate cursor-default">
                                    {truncateFilename(template.name, 25)}
                                  </h4>
                                </Tooltip>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                  <FileIcon className="h-3 w-3" />
                                  <span>{template.usage_count} docs generated</span>
                                  {template.is_favorite && (
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleUseTemplate(template.id)}
                                className="flex-1"
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                Generate
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}

                {recentTemplates.length >= 5 && (
                  <div className="mt-4 pt-4 border-t">
                    <Link
                      href="/templates"
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full")}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View All Templates ({stats.templates_uploaded})
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5" />
                  Recent Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentDocuments.length === 0 ? (
                  <div className="text-center py-6">
                    <FileText className="mx-auto mb-3 h-8 w-8 opacity-50" />
                    <p className="text-sm text-muted-foreground">
                      No documents yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentDocuments.slice(0, 3).map((doc) => {
                      const FileIcon = getFileTypeIcon(doc.export_format);
                      const isLoading = loadingDocuments[doc.id];

                      return (
                        <div key={doc.id} className="flex items-center gap-3 p-2 hover:bg-accent rounded-md transition-colors group">
                          <FileIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <Tooltip content={doc.name}>
                              <p className="text-sm font-medium truncate cursor-default">
                                {truncateFilename(doc.name, 20)}
                              </p>
                            </Tooltip>
                            <p className="text-xs text-muted-foreground">
                              {formatRelativeTime(doc.created_at)}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDownloadDocument(doc.id)}
                            disabled={doc.status !== 'completed' || isLoading}
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                          >
                            {isLoading ? (
                              <div className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full" />
                            ) : (
                              <Download className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      );
                    })}

                    {recentDocuments.length > 0 && (
                      <div className="pt-2">
                        <Link
                          href="/documents"
                          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full")}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View All Documents
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Usage Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Documents Created</span>
                    <span className="font-medium">{stats.documents_created}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Templates Saved</span>
                    <span className="font-medium">{stats.templates_uploaded}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Storage Used</span>
                    <span className="font-medium">{stats.storage_percentage.toFixed(1)}%</span>
                  </div>
                  <div className="pt-2">
                    <Link
                      href="/settings/billing"
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full")}
                    >
                      View Usage Details
                    </Link>
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