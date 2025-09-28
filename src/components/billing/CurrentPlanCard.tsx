import { Calendar, Shield, Star } from 'lucide-react';

interface CurrentPlanCardProps {
  plan: string;
  status: string;
  expiresAt?: string | null;
}

export default function CurrentPlanCard({ plan, status, expiresAt }: CurrentPlanCardProps) {
  const formatExpiryDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const isPro = plan === 'pro';
  const isActive = status === 'active';

  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Current Plan</h2>
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          isActive
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          <Shield className="w-4 h-4 mr-1" />
          {isActive ? 'Active' : 'Inactive'}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
          isPro ? 'bg-purple-100' : 'bg-gray-100'
        }`}>
          {isPro ? (
            <Star className="w-6 h-6 text-purple-600" />
          ) : (
            <Shield className="w-6 h-6 text-gray-600" />
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 capitalize">
            {plan} Plan
          </h3>
          {isPro && expiresAt && (
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <Calendar className="w-4 h-4 mr-1" />
              Expires on {formatExpiryDate(expiresAt)}
            </div>
          )}
          {!isPro && (
            <p className="text-sm text-gray-600 mt-1">
              Basic access with limited features
            </p>
          )}
        </div>
      </div>

      {isPro && (
        <div className="mt-4 p-3 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-700">
            🎉 You&apos;re enjoying Pro benefits! Thanks for sharing Docko with your network.
          </p>
        </div>
      )}
    </div>
  );
}