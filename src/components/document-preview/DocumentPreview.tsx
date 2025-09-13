'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  FileText,
  Loader2,
  AlertCircle
} from 'lucide-react';
import * as docx from 'docx-preview';

interface DocumentPreviewProps {
  documentBlob: Blob | null;
  fileName?: string;
  className?: string;
}

export default function DocumentPreview({
  documentBlob,
  fileName = 'document.docx',
  className = ''
}: DocumentPreviewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [zoom, setZoom] = useState(100);
  const [isConverted, setIsConverted] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const convertDocxToHtml = async (blob: Blob) => {
    if (!containerRef.current) return;

    setIsLoading(true);
    setError('');

    try {
      // Convert Blob to ArrayBuffer for docx-preview
      const arrayBuffer = await blob.arrayBuffer();

      // Find the docx-preview-container div inside the ref
      const previewContainer = containerRef.current.querySelector('.docx-preview-container');
      if (!previewContainer) {
        setError('Preview container not found');
        return;
      }

      // Clear container before rendering
      previewContainer.innerHTML = '';

      // Convert DOCX to HTML using docx-preview
      await docx.renderAsync(arrayBuffer, previewContainer as HTMLElement, undefined, {
        className: 'docx-preview',
        inWrapper: false,
        ignoreWidth: false,
        ignoreHeight: false,
        ignoreFonts: false,
        breakPages: true,
        ignoreLastRenderedPageBreak: true,
        experimental: false,
        trimXmlDeclaration: true,
        useBase64URL: true,
        renderChanges: false,
        renderComments: false,
        renderEndnotes: true,
        renderFootnotes: true,
        renderHeaders: true,
        renderFooters: true
      });

      setIsConverted(true);
    } catch (err) {
      console.error('Error converting DOCX to HTML:', err);
      setError('Failed to convert document for preview. The document may be corrupted or in an unsupported format.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleResetZoom = () => {
    setZoom(100);
  };


  // Auto-convert when document changes
  useEffect(() => {
    if (documentBlob) {
      // Clear previous content
      if (containerRef.current) {
        const previewContainer = containerRef.current.querySelector('.docx-preview-container');
        if (previewContainer) {
          previewContainer.innerHTML = '';
        }
      }
      setIsConverted(false);
      setError('');

      // Add a small delay to ensure the container is rendered
      setTimeout(() => {
        convertDocxToHtml(documentBlob);
      }, 100);
    }
  }, [documentBlob]);

  if (!documentBlob) {
    return (
      <Card className={`h-full ${className}`}>
        <CardContent className="flex items-center justify-center h-full min-h-[400px]">
          <div className="text-center text-muted-foreground">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No document to preview</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`h-full flex flex-col ${className}`}>
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Document Preview
          </CardTitle>

          {isConverted && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoom <= 50}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>

              <span className="text-sm text-muted-foreground min-w-[4rem] text-center">
                {zoom}%
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoom >= 200}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleResetZoom}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {fileName && (
          <p className="text-sm text-muted-foreground">{fileName}</p>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col min-h-0">
        {error && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}


        {/* Always render container so ref is available */}
        <div
          className="flex-1 overflow-auto bg-gray-50 rounded-lg p-4 relative"
          style={{ maxHeight: 'none' }}
        >
          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Converting document for preview...</p>
              </div>
            </div>
          )}

          {/* No document state */}
          {!documentBlob ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No document to preview</p>
              </div>
            </div>
          ) : (
            <div
              ref={containerRef}
              className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-visible"
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center',
                width: 'fit-content',
                height: 'auto'
              }}
            >
              <div
                className="docx-preview-container"
                style={{
                  background: 'white',
                  padding: '2rem',
                  width: '8.5in',
                  minWidth: '8.5in',
                  height: 'auto',
                  overflow: 'visible'
                }}
              />
            </div>
          )}
        </div>


      </CardContent>
    </Card>
  );
}