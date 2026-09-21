import React from 'react';
import { ForensicAnalysisResult } from '../../types/forensic';
import { ScanSearch, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '../common/Badge';

interface TamperingResultsProps {
  forensic?: ForensicAnalysisResult;
}

export const TamperingResults: React.FC<TamperingResultsProps> = ({ forensic }) => {
  if (!forensic) return null;

  return (
    <div className="glass-panel p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <ScanSearch className="w-4 h-4 text-blue-400" />
          <h3 className="font-bold text-slate-100 text-sm tracking-wide">Forensic Image Tampering Analysis</h3>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Suspicious Regions: {forensic.suspicious_regions_count}
        </span>
      </div>

      <div className="space-y-2.5">
        {forensic.findings.map((f, idx) => {
          const isSuspicious = f.score >= 0.35;
          const variant = f.severity.toLowerCase() as 'low' | 'medium' | 'high';

          return (
            <div
              key={idx}
              className={`p-3 rounded-lg border text-xs flex items-start justify-between gap-3 ${
                isSuspicious
                  ? 'bg-amber-500/10 border-amber-500/20 text-slate-200'
                  : 'bg-navy-950/40 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {isSuspicious ? (
                  <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200 uppercase font-mono text-[11px]">
                      {f.detector.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">
                      (Score: {f.score})
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs mt-0.5 font-sans leading-relaxed">{f.explanation}</p>
                </div>
              </div>

              <Badge label={f.status.replace(/_/g, ' ')} variant={isSuspicious ? variant : 'low'} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
