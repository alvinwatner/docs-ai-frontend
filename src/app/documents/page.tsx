'use client';

import { useState, useEffect } from 'react';
import { AuthGuard, UserMenu } from '@/components/auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Plus,
  FileText,
  Download,
  Trash2,
  Search,
  Star,
  Filter,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { managementApi, type Document } from '@/lib/management-api';
import { Tooltip } from '@/components/ui/tooltip';
import {
  truncateFilename,
  getFileTypeIcon,
  formatRelativeTime,
  getStatusConfig,
  formatFileSize
} from '@/lib/document-utils';

export default function DocumentsPage() {
  return (
    <AuthGuard>
      <DocumentsContent />
    </AuthGuard>
  );
}

function DocumentsContent() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'processing'>('all');
  const [loadingStates, setLoadingStates] = useState<Record<string, 'download' | 'delete' | 'favorite' | null>>({});

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const data = await managementApi.documents.list({ limit: 100 });
      setDocuments(data);
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (docId: string) => {
    setLoadingStates(prev => ({ ...prev, [docId]: 'download' }));
    try {
      const { download_url } = await managementApi.documents.downloadUrl(docId);
      window.open(download_url, '_blank');
    } catch (error) {
      console.error('Failed to download document:', error);
      alert('Failed to download document. Please try again.');
    } finally {
      setLoadingStates(prev => ({ ...prev, [docId]: null }));
    }
  };

  const handleDelete = async (docId: string, docName: string) => {
    if (!confirm(`Are you sure you want to delete "${docName}"? This action cannot be undone.`)) {
      return;
    }

    setLoadingStates(prev => ({ ...prev, [docId]: 'delete' }));
    try {
      await managementApi.documents.delete(docId);
      // Remove from local state
      setDocuments(docs => docs.filter(doc => doc.id !== docId));
    } catch (error) {
      console.error('Failed to delete document:', error);
      alert('Failed to delete document. Please try again.');
    } finally {
      setLoadingStates(prev => ({ ...prev, [docId]: null }));
    }
  };

  const handleToggleFavorite = async (docId: string) => {
    setLoadingStates(prev => ({ ...prev, [docId]: 'favorite' }));
    try {
      const { is_favorite } = await managementApi.documents.toggleFavorite(docId);
      // Update local state
      setDocuments(docs =>
        docs.map(doc =>
          doc.id === docId ? { ...doc, is_favorite } : doc
        )
      );
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [docId]: null }));
    }
  };

  // Filter documents based on search and status
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.generated_filename.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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

              {/* Navigation Links */}
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  href="/documents"
                  className="text-foreground hover:text-primary transition-colors flex items-center gap-2 font-medium"
                >
                  <FileText className="h-4 w-4" />
                  Documents
                </Link>
                <Link
                  href="/templates"
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Templates
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/generate/upload"
                className={cn(buttonVariants(), "flex items-center gap-2")}
              >
                <Plus className="h-4 w-4" />
                New Document
              </Link>

              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            My Documents
          </h1>
          <p className="text-muted-foreground">
            View and manage all your generated documents.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'completed' | 'processing')}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
            </select>
          </div>
        </div>

        {/* Documents Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your documents...</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <h3 className="text-lg font-medium mb-2">
                {searchQuery || filterStatus !== 'all' ? 'No documents found' : 'No documents yet'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || filterStatus !== 'all'
                  ? 'Try adjusting your search or filters.'
                  : 'Create your first document to get started.'
                }
              </p>
              {!searchQuery && filterStatus === 'all' && (
                <Link
                  href="/generate/upload"
                  className={cn(buttonVariants())}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Document
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => {
              const FileIcon = getFileTypeIcon(doc.export_format);
              const statusConfig = getStatusConfig(doc.status);
              const isLoading = loadingStates[doc.id];

              return (
                <Card key={doc.id} className="group hover:shadow-lg hover:scale-[1.02] transition-all duration-200 hover:border-primary/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <Tooltip content={doc.name}>
                        <CardTitle className="text-base flex-1 mr-2 cursor-default">
                          {truncateFilename(doc.name, 25)}
                        </CardTitle>
                      </Tooltip>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleFavorite(doc.id)}
                          disabled={isLoading === 'favorite'}
                          className="h-8 w-8 p-0 hover:scale-110 transition-transform"
                        >
                          {isLoading === 'favorite' ? (
                            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                          ) : (
                            <Star
                              className={cn(
                                "h-5 w-5 transition-all duration-200",
                                doc.is_favorite
                                  ? "fill-yellow-400 text-yellow-400 drop-shadow-sm scale-110"
                                  : "text-muted-foreground hover:text-yellow-400 hover:scale-105"
                              )}
                            />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <Tooltip content={new Date(doc.created_at).toLocaleString()}>
                          <span className="cursor-default">{formatRelativeTime(doc.created_at)}</span>
                        </Tooltip>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <FileIcon className="h-3 w-3" />
                        <span className="uppercase font-medium">{doc.export_format}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <div className={cn("w-2 h-2 rounded-full", statusConfig.dotColor)} />
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          statusConfig.className
                        )}>
                          {statusConfig.label}
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">
                        <Tooltip content={doc.generated_filename}>
                          <p className="cursor-default">{truncateFilename(doc.generated_filename, 35)}</p>
                        </Tooltip>
                        <p>{formatFileSize(doc.file_size_bytes)} • Downloaded {doc.download_count} times</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleDownload(doc.id)}
                          disabled={doc.status !== 'completed' || isLoading === 'download'}
                          className="flex-1 group-hover:shadow-sm transition-shadow"
                        >
                          {isLoading === 'download' ? (
                            <>
                              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                              Downloading...
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </>
                          )}
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(doc.id, doc.name)}
                          disabled={isLoading === 'delete'}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          {isLoading === 'delete' ? (
                            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Summary Stats */}
        {!loading && documents.length > 0 && (
          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground text-center">
              Showing {filteredDocuments.length} of {documents.length} documents
              {searchQuery && ` matching "${searchQuery}"`}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}