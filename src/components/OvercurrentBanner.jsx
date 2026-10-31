/**
 * OvercurrentBanner.jsx
 * Animated alert banner shown when current exceeds the configured threshold
 */
import { AlertTriangle, X } from 'lucide-react';

export default function OvercurrentBanner({ current, limit, onDismiss }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 shadow-md shadow-rose-100 animate-pulse">
      {/* Icon */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-100 border border-rose-200">
        <AlertTriangle size={18} className="text-rose-600" strokeWidth={2.5} />
      </div>

      {/* Message */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-rose-700">Overcurrent Alert!</p>
        <p className="mt-0.5 text-xs text-rose-600">
          Total draw of{' '}
          <span className="font-mono font-bold">{current} A</span> has reached or exceeded
          the threshold of{' '}
          <span className="font-mono font-bold">{limit} A</span>.
          Check connected loads immediately.
        </p>
      </div>

      {/* Dismiss */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="shrink-0 rounded-lg p-1 text-rose-400 hover:bg-rose-100 hover:text-rose-600 transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
