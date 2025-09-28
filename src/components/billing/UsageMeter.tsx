interface UsageMeterProps {
  label: string;
  current: number;
  limit: number;
  unit?: string;
  formatValue?: (value: number) => string;
}

export default function UsageMeter({
  label,
  current,
  limit,
  unit = '',
  formatValue
}: UsageMeterProps) {
  const percentage = limit > 0 ? Math.min((current / limit) * 100, 100) : 0;
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  const formatDisplay = (value: number) => {
    if (formatValue) {
      return formatValue(value);
    }
    return `${value}${unit}`;
  };

  const getProgressColor = () => {
    if (isAtLimit) return 'bg-red-500';
    if (isNearLimit) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const getProgressBgColor = () => {
    if (isAtLimit) return 'bg-red-100';
    if (isNearLimit) return 'bg-yellow-100';
    return 'bg-blue-100';
  };

  const getLimitText = () => {
    if (limit >= 999999) return 'Unlimited';
    return formatDisplay(limit);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-600">
          {formatDisplay(current)} / {getLimitText()}
        </span>
      </div>

      <div className={`w-full h-2 ${getProgressBgColor()} rounded-full overflow-hidden`}>
        <div
          className={`h-full ${getProgressColor()} transition-all duration-300 ease-out rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {isAtLimit && (
        <p className="text-xs text-red-600">
          You&apos;ve reached your limit. Upgrade to Pro for unlimited access.
        </p>
      )}

      {isNearLimit && !isAtLimit && (
        <p className="text-xs text-yellow-600">
          You&apos;re approaching your limit. Consider upgrading to Pro.
        </p>
      )}
    </div>
  );
}