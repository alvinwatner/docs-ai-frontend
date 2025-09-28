'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthGuard, UserMenu } from '@/components/auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  FileText,
  Download,
  Trash2,
  Search,
  Star,
  Filter,
  Upload,
  FolderOpen,
  Hash,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { managementApi, type Template } from '@/lib/management-api';
import { Tooltip } from '@/components/ui/tooltip';
import {
  truncateFilename,
  formatRelativeTime,
  formatFileSize
} from '@/lib/document-utils';

export default function TemplatesPage() {
  return (
    <AuthGuard>
      <TemplatesContent />
    </AuthGuard>
  );
}

function TemplatesContent() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'usage' | 'recent'>('created');
  const [loadingStates, setLoadingStates] = useState<Record<string, 'download' | 'delete' | 'favorite' | 'use' | null>>({});

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await managementApi.templates.list({ limit: 100 });
      setTemplates(data);
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUseTemplate = async (templateId: string) => {
    setLoadingStates(prev => ({ ...prev, [templateId]: 'use' }));
    try {
      // Navigate to generation flow with template pre-selected
      router.push(`/generate/template/${templateId}`);
    } catch (error) {
      console.error('Failed to use template:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [templateId]: null }));
    }
  };

  const handleDownload = async (templateId: string) => {
    setLoadingStates(prev => ({ ...prev, [templateId]: 'download' }));
    try {
      const { download_url } = await managementApi.templates.downloadUrl(templateId);
      window.open(download_url, '_blank');
    } catch (error) {
      console.error('Failed to download template:', error);
      alert('Failed to download template. Please try again.');
    } finally {
      setLoadingStates(prev => ({ ...prev, [templateId]: null }));
    }
  };

  const handleDelete = async (templateId: string, templateName: string) => {
    if (!confirm(`Are you sure you want to delete "${templateName}"? This action cannot be undone.`)) {
      return;
    }

    setLoadingStates(prev => ({ ...prev, [templateId]: 'delete' }));
    try {
      await managementApi.templates.delete(templateId);
      // Remove from local state
      setTemplates(temps => temps.filter(temp => temp.id !== templateId));
    } catch (error) {
      console.error('Failed to delete template:', error);
      alert('Failed to delete template. Please try again.');
    } finally {
      setLoadingStates(prev => ({ ...prev, [templateId]: null }));
    }
  };

  const handleToggleFavorite = async (templateId: string) => {
    setLoadingStates(prev => ({ ...prev, [templateId]: 'favorite' }));
    try {
      const { is_favorite } = await managementApi.templates.toggleFavorite(templateId);
      // Update local state
      setTemplates(temps =>
        temps.map(temp =>
          temp.id === templateId ? { ...temp, is_favorite } : temp
        )
      );
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [templateId]: null }));
    }
  };

  // Filter and sort templates
  const filteredAndSortedTemplates = templates
    .filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (template.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'usage':
          return b.usage_count - a.usage_count;
        case 'recent':
          return new Date(b.last_used_at || b.created_at).getTime() - new Date(a.last_used_at || a.created_at).getTime();
        case 'created':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  // Get unique categories for filter
  const categories = Array.from(new Set(templates.map(t => t.category).filter(Boolean)));

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
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Documents
                </Link>
                <Link
                  href="/templates"
                  className="text-foreground hover:text-primary transition-colors flex items-center gap-2 font-medium"
                >
                  <FolderOpen className="h-4 w-4" />
                  Templates
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/generate/upload"
                className={cn(buttonVariants(), "flex items-center gap-2")}
              >
                <Upload className="h-4 w-4" />
                Upload Template
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
            My Templates
          </h1>
          <p className="text-muted-foreground">
            Manage and organize your document templates.
          </p>
        </div>

        {/* Search, Filters and Sort */}
        <div className="mb-6 flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category || 'Uncategorized'}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'created' | 'usage' | 'recent')}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
            >
              <option value="created">Sort by Created</option>
              <option value="name">Sort by Name</option>
              <option value="usage">Sort by Usage</option>
              <option value="recent">Sort by Recent</option>
            </select>
          </div>
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your templates...</p>
          </div>
        ) : filteredAndSortedTemplates.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FolderOpen className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <h3 className="text-lg font-medium mb-2">
                {searchQuery || filterCategory !== 'all' ? 'No templates found' : 'No templates yet'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || filterCategory !== 'all'
                  ? 'Try adjusting your search or filters.'
                  : 'Upload your first template to get started.'
                }
              </p>
              {!searchQuery && filterCategory === 'all' && (
                <Link
                  href="/generate/upload"
                  className={cn(buttonVariants())}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Your First Template
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedTemplates.map((template) => {
              const isLoading = loadingStates[template.id];

              return (
                <Card key={template.id} className="group hover:shadow-lg hover:scale-[1.02] transition-all duration-200 hover:border-primary/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <Tooltip content={template.name}>
                        <CardTitle className="text-base flex-1 mr-2 cursor-default">
                          {truncateFilename(template.name, 25)}
                        </CardTitle>
                      </Tooltip>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleFavorite(template.id)}
                          disabled={isLoading === 'favorite'}
                          className="h-8 w-8 p-0 hover:scale-110 transition-transform"
                        >
                          {isLoading === 'favorite' ? (
                            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                          ) : (
                            <Star
                              className={cn(
                                "h-5 w-5 transition-all duration-200",
                                template.is_favorite
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
                        <Hash className="h-3 w-3" />
                        <span>{template.variables_detected.total_count} variables</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        <span>{template.usage_count} docs generated</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <Tooltip content={new Date(template.created_at).toLocaleString()}>
                          <span className="cursor-default">{formatRelativeTime(template.created_at)}</span>
                        </Tooltip>
                      </div>
                      <span>•</span>
                      <span>{formatFileSize(template.file_size_bytes)}</span>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">
                        {template.description ? (
                          <Tooltip content={template.description}>
                            <p className="cursor-default">{truncateFilename(template.description, 35)}</p>
                          </Tooltip>
                        ) : (
                          <p className="italic opacity-50">No description</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleUseTemplate(template.id)}
                          disabled={isLoading === 'use'}
                          className="flex-1 group-hover:shadow-sm transition-shadow"
                        >
                          {isLoading === 'use' ? (
                            <>
                              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                              Using...
                            </>
                          ) : (
                            <>
                              <FileText className="h-4 w-4 mr-2" />
                              Use
                            </>
                          )}
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(template.id)}
                          disabled={isLoading === 'download'}
                          className="hover:bg-accent"
                        >
                          {isLoading === 'download' ? (
                            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(template.id, template.name)}
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
        {!loading && templates.length > 0 && (
          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground text-center">
              Showing {filteredAndSortedTemplates.length} of {templates.length} templates
              {searchQuery && ` matching "${searchQuery}"`}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}