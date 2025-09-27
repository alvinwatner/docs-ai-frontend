import { FileText, FileSpreadsheet, Image, Film, Music, Archive, FileCode } from 'lucide-react';

/**
 * Smart truncation for filenames - shows beginning and end
 */
export function truncateFilename(filename: string, maxLength: number = 30): string {
  if (filename.length <= maxLength) return filename;

  const extension = filename.split('.').pop() || '';
  const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));

  if (nameWithoutExt.length <= maxLength - extension.length - 3) {
    return filename;
  }

  const frontChars = Math.floor((maxLength - extension.length - 3) / 2);
  const backChars = Math.ceil((maxLength - extension.length - 3) / 2);

  return `${nameWithoutExt.substring(0, frontChars)}...${nameWithoutExt.substring(nameWithoutExt.length - backChars)}.${extension}`;
}

/**
 * Get appropriate icon for file type
 */
export function getFileTypeIcon(format: string) {
  switch (format.toLowerCase()) {
    case 'docx':
    case 'doc':
    case 'txt':
    case 'rtf':
      return FileText;
    case 'xlsx':
    case 'xls':
    case 'csv':
      return FileSpreadsheet;
    case 'pdf':
      return FileText; // Could use a PDF-specific icon
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
      return Image;
    case 'mp4':
    case 'avi':
    case 'mov':
      return Film;
    case 'mp3':
    case 'wav':
    case 'flac':
      return Music;
    case 'zip':
    case 'rar':
    case '7z':
      return Archive;
    case 'js':
    case 'ts':
    case 'html':
    case 'css':
    case 'json':
      return FileCode;
    default:
      return FileText;
  }
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }

  return 'Just now';
}

/**
 * Get status configuration (color, icon, label)
 */
export function getStatusConfig(status: string) {
  switch (status.toLowerCase()) {
    case 'completed':
      return {
        label: 'Completed',
        className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        dotColor: 'bg-green-500'
      };
    case 'processing':
      return {
        label: 'Processing',
        className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        dotColor: 'bg-yellow-500'
      };
    case 'failed':
      return {
        label: 'Failed',
        className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        dotColor: 'bg-red-500'
      };
    case 'queued':
      return {
        label: 'Queued',
        className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        dotColor: 'bg-blue-500'
      };
    case 'uploading':
      return {
        label: 'Uploading',
        className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
        dotColor: 'bg-purple-500'
      };
    default:
      return {
        label: status,
        className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
        dotColor: 'bg-gray-500'
      };
  }
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}