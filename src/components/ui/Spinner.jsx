import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-10 h-10',
  xl: 'w-12 h-12',
};

/**
 * Inline spinner — use inside buttons or small UI areas.
 * Usage: <Spinner size="sm" />
 */
export function Spinner({ size = 'md', className }) {
  return (
    <Loader2
      className={cn('animate-spin text-pink-600', sizeMap[size], className)}
    />
  );
}

/**
 * Full-area page spinner — centered in a min-h-64 container with an optional label.
 * Usage: <PageSpinner label="Loading applications..." />
 */
export function PageSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <Loader2 className="w-10 h-10 animate-spin text-pink-600" />
      {label && <p className="text-sm text-slate-500">{label}</p>}
    </div>
  );
}
