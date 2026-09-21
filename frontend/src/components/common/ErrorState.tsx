import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'An unexpected error occurred during processing.',
  onRetry
}) => {
  return (
    <div className="glass-panel p-8 text-center border-red-500/30 bg-red-500/5 max-w-lg mx-auto my-6 space-y-4">
      <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/40 mx-auto flex items-center justify-center text-red-400">
        <AlertTriangle className="w-6 h-6 text-red-400" />
      </div>
      <div>
        <h4 className="font-semibold text-slate-200 text-sm">Processing Error</h4>
        <p className="text-xs text-red-300 mt-1 font-mono">{message}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="secondary" size="sm" className="gap-2">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Operation</span>
        </Button>
      )}
    </div>
  );
};
