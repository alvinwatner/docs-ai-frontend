'use client';

import { useState } from 'react';
import { Upload, ExternalLink } from 'lucide-react';

interface UpgradeFormProps {
  onSubmit: (platform: string, screenshot?: File) => Promise<void>;
  isLoading: boolean;
}

const platforms = [
  {
    id: 'twitter',
    name: 'Twitter',
    shareText: 'Just discovered @Docko - an amazing tool for automating document generation! 🚀 Perfect for streamlining my workflow. #productivity #automation',
    color: 'bg-blue-500'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    shareText: 'Excited to share my discovery of Docko - a powerful document automation platform that&apos;s revolutionizing how I handle document generation. Great for professional workflows! #DocumentAutomation #Productivity',
    color: 'bg-blue-700'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    shareText: 'Found this cool tool called Docko that automates document creation. Really helpful for anyone dealing with repetitive document tasks!',
    color: 'bg-blue-600'
  }
];

export default function UpgradeForm({ onSubmit, isLoading }: UpgradeFormProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlatform) return;

    await onSubmit(selectedPlatform, screenshot || undefined);
  };

  const handleFileSelect = (file: File) => {
    setScreenshot(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));

    if (imageFile) {
      handleFileSelect(imageFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const selectedPlatformData = platforms.find(p => p.id === selectedPlatform);

  return (
    <div className="p-6 border-t border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Upgrade to Pro</h3>
        <p className="text-gray-600 mt-1">
          Share Docko on social media and get 3 months of Pro access for free!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Platform Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Choose a platform to share on:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                type="button"
                onClick={() => setSelectedPlatform(platform.id)}
                className={`p-4 rounded-lg border-2 transition-colors text-left ${
                  selectedPlatform === platform.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-8 h-8 ${platform.color} rounded mb-2`} />
                <div className="font-medium text-gray-900">{platform.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Share Text Preview */}
        {selectedPlatformData && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Suggested post text:</h4>
              <a
                href={`https://${selectedPlatformData.id === 'twitter' ? 'twitter.com/intent/tweet?text=' :
                  selectedPlatformData.id === 'linkedin' ? 'linkedin.com/sharing/share-offsite/?url=' :
                  'facebook.com/sharer/sharer.php?u='}${encodeURIComponent(selectedPlatformData.shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-purple-600 hover:text-purple-700"
              >
                Share now
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
            <p className="text-sm text-gray-700 italic">
              &ldquo;{selectedPlatformData.shareText}&rdquo;
            </p>
          </div>
        )}

        {/* Screenshot Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Upload a screenshot of your post (optional):
          </label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragOver
                ? 'border-purple-400 bg-purple-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            {screenshot ? (
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {screenshot.name}
                </p>
                <button
                  type="button"
                  onClick={() => setScreenshot(null)}
                  className="text-sm text-purple-600 hover:text-purple-700 mt-1"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Drag and drop an image here, or{' '}
                  <label className="text-purple-600 hover:text-purple-700 cursor-pointer">
                    browse
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, or GIF up to 10MB
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!selectedPlatform || isLoading}
          className={`w-full py-3 px-4 rounded-md text-sm font-medium transition-colors ${
            selectedPlatform && !isLoading
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? 'Upgrading...' : 'Upgrade to Pro'}
        </button>

        <p className="text-xs text-gray-500 text-center">
          Your Pro access will be activated immediately after submission.
        </p>
      </form>
    </div>
  );
}