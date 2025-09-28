import { Check, X, Star } from 'lucide-react';

interface PlanFeature {
  name: string;
  free: boolean | string;
  pro: boolean | string;
}

interface PlanComparisonProps {
  currentPlan: string;
  onUpgrade: () => void;
  canUpgrade: boolean;
}

const features: PlanFeature[] = [
  {
    name: 'Documents per month',
    free: '5',
    pro: 'Unlimited'
  },
  {
    name: 'Template uploads',
    free: '3',
    pro: 'Unlimited'
  },
  {
    name: 'Storage space',
    free: '1 GB',
    pro: '10 GB'
  },
  {
    name: 'Export formats',
    free: 'DOCX only',
    pro: 'DOCX & PDF'
  },
  {
    name: 'Priority support',
    free: false,
    pro: true
  },
  {
    name: 'Advanced formatting',
    free: false,
    pro: true
  }
];

export default function PlanComparison({ currentPlan, onUpgrade, canUpgrade }: PlanComparisonProps) {
  const renderFeatureValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-green-500" />
      ) : (
        <X className="w-5 h-5 text-gray-300" />
      );
    }
    return <span className="text-sm text-gray-900">{value}</span>;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Choose Your Plan</h2>
        <p className="text-gray-600 mt-1">
          Select the plan that best fits your document generation needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Free Plan */}
        <div className={`rounded-lg border-2 p-6 ${
          currentPlan === 'free'
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 bg-white'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Free</h3>
            {currentPlan === 'free' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Current Plan
              </span>
            )}
          </div>

          <div className="mb-6">
            <span className="text-3xl font-bold text-gray-900">$0</span>
            <span className="text-gray-600 ml-1">/month</span>
          </div>

          <ul className="space-y-3 mb-6">
            {features.map((feature) => (
              <li key={feature.name} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{feature.name}</span>
                {renderFeatureValue(feature.free)}
              </li>
            ))}
          </ul>

          <button
            disabled={currentPlan === 'free'}
            className="w-full py-2 px-4 rounded-md text-sm font-medium bg-gray-100 text-gray-400 cursor-not-allowed"
          >
            Current Plan
          </button>
        </div>

        {/* Pro Plan */}
        <div className={`rounded-lg border-2 p-6 relative ${
          currentPlan === 'pro'
            ? 'border-purple-500 bg-purple-50'
            : 'border-purple-200 bg-white'
        }`}>
          {/* Popular badge */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
              <Star className="w-3 h-3 mr-1" />
              Most Popular
            </span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Pro</h3>
            {currentPlan === 'pro' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Current Plan
              </span>
            )}
          </div>

          <div className="mb-6">
            <span className="text-3xl font-bold text-gray-900">Free</span>
            <span className="text-gray-600 ml-1">for 3 months</span>
            <div className="text-sm text-gray-500 mt-1">
              via social media share
            </div>
          </div>

          <ul className="space-y-3 mb-6">
            {features.map((feature) => (
              <li key={feature.name} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{feature.name}</span>
                {renderFeatureValue(feature.pro)}
              </li>
            ))}
          </ul>

          <button
            onClick={onUpgrade}
            disabled={!canUpgrade || currentPlan === 'pro'}
            className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              canUpgrade && currentPlan !== 'pro'
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {currentPlan === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
          </button>
        </div>
      </div>
    </div>
  );
}