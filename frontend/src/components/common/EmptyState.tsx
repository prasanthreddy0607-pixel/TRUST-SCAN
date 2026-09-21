import React from 'react';
import { ShieldQuestion } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Data Found',
  description = 'There are no document screening records available yet.',
  actionText,
  onAction
}) => {
  return (
    <div className="glass-panel p-12 text-center flex flex-col items-center justify-center space-y-4 max-w-md mx-auto my-8">
      <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400">
        <ShieldQuestion className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="font-semibold text-slate-200 text-base">{title}</h3>
      <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
};
