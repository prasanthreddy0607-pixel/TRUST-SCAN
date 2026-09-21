import React from 'react';
import { EvidenceItem } from '../../types/risk';
import { AlertCircle, FileSearch, ShieldAlert } from 'lucide-react';
import { Badge } from '../common/Badge';

interface EvidenceListProps {
  evidence: EvidenceItem[];
  onSelectEvidence?: (item: EvidenceItem) => void;
}

export const EvidenceList: React.FC<EvidenceListProps> = ({ evidence, onSelectEvidence }) => {
  return (
    <div className="glass-panel p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <FileSearch className="w-4 h-4 text-blue-400" />
          <h3 className="font-bold text-slate-100 text-sm tracking-wide">Extracted Evidence Signals ({evidence.length})</h3>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">Traceable Findings</span>
      </div>

      {evidence.length === 0 ? (
        <div className="p-6 text-center text-slate-500 font-mono text-xs border border-dashed border-slate-800 rounded-lg">
          No anomalous risk evidence recorded. Document parameters pass baseline checks.
        </div>
      ) : (
        <div className="space-y-3">
          {evidence.map((item, idx) => {
            const variant = item.severity.toLowerCase() as 'low' | 'medium' | 'high';
            return (
              <div
                key={idx}
                onClick={() => onSelectEvidence && onSelectEvidence(item)}
                className="p-3.5 rounded-lg border border-slate-800 bg-navy-950/60 hover:bg-slate-800/60 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className={`w-4 h-4 ${item.severity === 'HIGH' ? 'text-red-400' : 'text-amber-400'}`} />
                    <h4 className="font-semibold text-slate-200 text-xs group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400">
                      {Math.round(item.confidence * 100)}% Conf
                    </span>
                    <Badge label={item.severity} variant={variant} />
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed font-sans pl-6">
                  {item.description}
                </p>

                <div className="pl-6 flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-800/60 pt-2 mt-1">
                  <span>Source: {item.source}</span>
                  <span className="text-blue-400 group-hover:underline">Click region detail →</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
