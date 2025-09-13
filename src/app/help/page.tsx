'use client';

import React, { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { AuthGuard } from '@/components/auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Book,
  FileText,
  HelpCircle,
  Video,
  Download,
  ArrowLeft,
  ArrowRight,
  Mail,
  Phone,
  Clock,
  Zap,
  Upload,
  Edit3,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Layers,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HelpPage() {
  return (
    <AuthGuard>
      <HelpContent />
    </AuthGuard>
  );
}

function HelpContent() {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const helpCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Book,
      description: 'Learn the basics of Docko',
      color: 'bg-blue-500',
      articles: [
        { title: 'How Docko Works', time: '2 min read', url: '#how-it-works' },
        { title: 'Your First Document', time: '3 min read', url: '#first-document' },
        { title: 'Understanding Variables', time: '4 min read', url: '#variables' },
      ]
    },
    {
      id: 'templates',
      title: 'Template Creation',
      icon: FileText,
      description: 'Master template design',
      color: 'bg-green-500',
      articles: [
        { title: 'Creating Templates', time: '5 min read', url: '#creating-templates' },
        { title: 'Variable Naming Rules', time: '2 min read', url: '#naming' },
        { title: 'Best Practices', time: '3 min read', url: '#best-practices' },
      ]
    },
    {
      id: 'variables',
      title: 'Variable Types',
      icon: Layers,
      description: 'Simple and section variables',
      color: 'bg-purple-500',
      articles: [
        { title: 'Simple Variables', time: '2 min read', url: '#simple-variables' },
        { title: 'Section Tables', time: '5 min read', url: '#section-tables' },
        { title: 'Dynamic Content', time: '4 min read', url: '#dynamic' },
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: AlertCircle,
      description: 'Solve common issues',
      color: 'bg-red-500',
      articles: [
        { title: 'Variables Not Detected', time: '2 min read', url: '#not-detected' },
        { title: 'Formatting Issues', time: '3 min read', url: '#formatting' },
        { title: 'Export Problems', time: '2 min read', url: '#export' },
      ]
    }
  ];

  const quickStartSteps = [
    {
      icon: Upload,
      title: 'Upload Template',
      description: 'Upload your DOCX file with {{variables}}',
    },
    {
      icon: Edit3,
      title: 'Fill Variables',
      description: 'Enter values in the auto-generated form',
    },
    {
      icon: Download,
      title: 'Export Document',
      description: 'Download your formatted DOCX or PDF',
    }
  ];

  const filteredCategories = helpCategories.filter(category =>
    activeCategory === 'all' || category.id === activeCategory
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div>
                <h1 className="text-2xl font-bold">Help Center</h1>
                <p className="text-sm text-muted-foreground">Everything you need to master Docko</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </div>

        {/* Quick Start Guide */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Quick Start Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {quickStartSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <step.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                  {index < quickStartSteps.length - 1 && (
                    <ChevronRight className="h-5 w-5 text-muted-foreground mt-2 hidden md:block" />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <Link href="/generate/upload">
                <Button>
                  Start Creating
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/help/getting-started">
                <Button variant="outline">
                  Detailed Tutorial
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Category Filter Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeCategory === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory('all')}
            >
              All Topics
            </Button>
            {helpCategories.map(category => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory(category.id)}
              >
                <category.icon className="h-4 w-4 mr-2" />
                {category.title}
              </Button>
            ))}
          </div>
        </div>

        {/* Help Categories Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {filteredCategories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${category.color} bg-opacity-10 flex items-center justify-center`}>
                      <category.icon className={`h-5 w-5 ${category.color.replace('bg-', 'text-')}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{category.title}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {category.articles.map((article, index) => (
                      <Link
                        key={index}
                        href={article.url}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors group"
                      >
                        <span className="font-medium group-hover:text-primary transition-colors">
                          {article.title}
                        </span>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {article.time}
                          </Badge>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Video Tutorials Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              Video Tutorials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Getting Started', duration: '2:30', thumbnail: '🚀' },
                { title: 'Creating Templates', duration: '3:45', thumbnail: '📝' },
                { title: 'Section Variables', duration: '4:20', thumbnail: '📊' },
                { title: 'Advanced Tips', duration: '3:15', thumbnail: '💡' },
              ].map((video, index) => (
                <div
                  key={index}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg mb-2 flex items-center justify-center text-4xl hover:from-primary/30 hover:to-primary/20 transition-colors">
                    {video.thumbnail}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                        <Video className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </div>
                  <h4 className="font-medium text-sm">{video.title}</h4>
                  <p className="text-xs text-muted-foreground">{video.duration}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resources & Downloads */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              Resources & Downloads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Invoice Template', type: 'DOCX', size: '245 KB' },
                { name: 'Contract Template', type: 'DOCX', size: '189 KB' },
                { name: 'Variable Reference', type: 'PDF', size: '1.2 MB' },
                { name: 'Best Practices Guide', type: 'PDF', size: '856 KB' },
                { name: 'Proposal Template', type: 'DOCX', size: '312 KB' },
                { name: 'Quick Start Guide', type: 'PDF', size: '2.1 MB' },
              ].map((resource, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{resource.name}</p>
                      <p className="text-xs text-muted-foreground">{resource.type} • {resource.size}</p>
                    </div>
                  </div>
                  <Download className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Still Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Can&apos;t find what you&apos;re looking for? Our support team is here to help you.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Email Support</h4>
                  <p className="text-sm text-muted-foreground">sales@docko.com</p>
                  <p className="text-xs text-muted-foreground">Response within 2 hours</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Phone Support</h4>
                  <p className="text-sm text-muted-foreground">+628 21 3882 3663</p>
                  <p className="text-xs text-muted-foreground">Mon-Fri, 8am-6pm WIB</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Business Hours</h4>
                  <p className="text-sm text-muted-foreground">Monday - Friday</p>
                  <p className="text-xs text-muted-foreground">8:00 AM - 6:00 PM WIB</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Button className="w-full md:w-auto">
                <Mail className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}