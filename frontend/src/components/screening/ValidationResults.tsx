import React from 'react';
import { DocumentValidationResult } from '../../types/screening';
import { CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';
import { Badge } from '../common/Badge';

interface ValidationResultsProps {
  validation?: DocumentValidationResult;
}

export const ValidationResults: React.FC<ValidationResultsProps> = ({ validation }) => {
  if (!validation) return null;

  return (
    <div className="glass-panel p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          <h3 className="font-bold text-slate-100 text-sm tracking-wide">Document Rule Engine Verification</h3>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {validation.passed_checks} / {validation.total_checks} Checks Passed
        </span>
      </div>

      <div className="space-y-2.5">
        {validation.checks.map((check, idx) => {
          const variant = check.severity.toLowerCase() as 'low' | 'medium' | 'high';
          return (
            <div
              key={idx}
              className={`p-3 rounded-lg border text-xs flex items-start justify-between gap-3 ${
                check.passed
                  ? 'bg-navy-950/40 border-slate-800/80 text-slate-300'
                  : 'bg-red-500/10 border-red-500/20 text-red-300 font-medium'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {check.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                )}
                <div>
                  <p className="font-semibold text-slate-200 uppercase font-mono text-[11px]">
                    {check.rule_name.replace(/_/g, ' ')}
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5 font-sans">{check.message}</p>
                </div>
              </div>

              <Badge label={check.passed ? 'PASSED' : check.severity} variant={check.passed ? 'low' : variant} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
