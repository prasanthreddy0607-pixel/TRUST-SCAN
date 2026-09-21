import React from 'react';
import { ScreeningRecord } from '../../types/screening';
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';

interface VerificationStatusProps {
  record: ScreeningRecord;
}

export const VerificationStatus: React.FC<VerificationStatusProps> = ({ record }) => {
  const ocrPassed = !!record.ocr_result;
  const valPassed = record.validation_result ? record.validation_result.valid : true;
  const tampClean = record.forensic_result ? record.forensic_result.overall_tampering_score < 0.35 : true;
  const faceMatched = record.face_result ? record.face_result.status === 'MATCH' : null;
  const dbClean = record.watchlist_result ? !record.watchlist_result.matched : true;

  const renderBadge = (passed: boolean | null, labelPassed: string, labelFailed: string) => {
    if (passed === null) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700 font-mono">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          N/A
        </span>
      );
    }
    if (passed) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          {labelPassed}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 font-mono">
        <XCircle className="w-3.5 h-3.5 text-red-400" />
        {labelFailed}
      </span>
    );
  };

  const modules = [
    { title: 'OCR Extraction', badge: renderBadge(ocrPassed, 'EXTRACTED', 'FAILED') },
    { title: 'Document Rules', badge: renderBadge(valPassed, 'VALIDATED', 'RULE VIOLATION') },
    { title: 'Tampering Suite', badge: renderBadge(tampClean, 'PASSED', 'ANOMALY DETECTED') },
    { title: 'Face Matching', badge: renderBadge(faceMatched, 'MATCHED', 'REVIEW NEEDED') },
    { title: 'Demo Watchlist', badge: renderBadge(dbClean, 'CLEAN', 'MATCH FOUND') },
  ];

  return (
    <div className="glass-panel p-5 space-y-3">
      <h3 className="font-bold text-slate-100 text-sm tracking-wide border-b border-slate-800 pb-2">
        Verification Checks Matrix
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
        {modules.map((m) => (
          <div key={m.title} className="bg-navy-950/60 p-3 rounded-lg border border-slate-800 space-y-1.5 text-center">
            <p className="text-[11px] font-mono text-slate-400 truncate">{m.title}</p>
            <div>{m.badge}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
