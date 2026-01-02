'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { useUser } from '@auth0/nextjs-auth0';
import CurrentPlanCard from '@/components/billing/CurrentPlanCard';
import PlanComparison from '@/components/billing/PlanComparison';
import UsageMeter from '@/components/billing/UsageMeter';
import UpgradeForm from '@/components/billing/UpgradeForm';
import { Skeleton } from '@/components/ui/skeleton';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function BillingPage() {
  const { user, isLoading: userLoading } = useUser();
  const [upgradeLoading, setUpgradeLoading] = useState(false);

  const { data: subscriptionData, error, mutate } = useSWR(
    user ? '/api/subscription/status' : null,
    fetcher
  );

  const handleUpgrade = async (platform: string, screenshot?: File) => {
    setUpgradeLoading(true);
    try {
      const formData = new FormData();
      formData.append('platform', platform);
      if (screenshot) {
        formData.append('screenshot', screenshot);
      }

      const response = await fetch('/api/subscription/upgrade', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upgrade failed');
      }

      const result = await response.json();

      if (result.success) {
        // Refresh subscription data
        await mutate();
        alert('Successfully upgraded to Pro! Welcome to your 3-month Pro trial.');
      } else {
        alert('Upgrade failed: ' + result.message);
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('Failed to upgrade. Please try again.');
    } finally {
      setUpgradeLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Skeleton loading for user or subscription data
  if (userLoading || !user || !subscriptionData) {
    if (error) {
      return (
        <div className="p-6 text-center">
          <p className="text-red-600">Failed to load subscription data</p>
        </div>
      );
    }

    return (
      <div className="space-y-0">
        {/* Current Plan Card Skeleton */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-5 w-24 mb-2" />
              <Skeleton className="h-8 w-20" />
            </div>
            <div className="text-right">
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
        </div>

        {/* Usage Statistics Skeleton */}
        <div className="p-6 border-b border-gray-200">
          <Skeleton className="h-6 w-36 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-2 w-full rounded-full" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>
        </div>

        {/* Plan Comparison Skeleton */}
        <div className="p-6 border-b border-gray-200">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-3">
                <Skeleton className="h-6 w-20 mb-2" />
                <Skeleton className="h-8 w-24" />
                <div className="space-y-2 pt-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <Skeleton key={j} className="h-4 w-full" />
                  ))}
                </div>
                <Skeleton className="h-10 w-full mt-4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const { plan, status, expires_at, usage, can_upgrade } = subscriptionData;

  return (
    <div className="space-y-0">
      {/* Current Plan Card */}
      <CurrentPlanCard
        plan={plan}
        status={status}
        expiresAt={expires_at}
      />

      {/* Usage Statistics */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UsageMeter
            label="Documents this month"
            current={usage.documents_this_month}
            limit={usage.documents_limit}
          />
          <UsageMeter
            label="Templates uploaded"
            current={usage.templates_uploaded}
            limit={usage.templates_limit}
          />
          <UsageMeter
            label="Storage used"
            current={usage.storage_used_bytes}
            limit={usage.storage_limit_bytes}
            formatValue={formatBytes}
          />
          <div className="space-y-2">
            <span className="text-sm font-medium text-gray-700">Export formats</span>
            <div className="flex space-x-2">
              {usage.export_formats.map((format: string) => (
                <span
                  key={format}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 uppercase"
                >
                  {format}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Plan Comparison */}
      <PlanComparison
        currentPlan={plan}
        onUpgrade={() => {
          // Scroll to upgrade form
          const upgradeForm = document.getElementById('upgrade-form');
          upgradeForm?.scrollIntoView({ behavior: 'smooth' });
        }}
        canUpgrade={can_upgrade}
      />

      {/* Upgrade Form */}
      {can_upgrade && (
        <div id="upgrade-form">
          <UpgradeForm
            onSubmit={handleUpgrade}
            isLoading={upgradeLoading}
          />
        </div>
      )}
    </div>
  );
}