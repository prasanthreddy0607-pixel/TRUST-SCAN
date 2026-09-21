import React from 'react';
import { FaceVerificationResult } from '../../types/screening';
import { UserCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Badge } from '../common/Badge';

interface FaceMatchCardProps {
  face?: FaceVerificationResult;
}

export const FaceMatchCard: React.FC<FaceMatchCardProps> = ({ face }) => {
  if (!face) return null;

  const isMatched = face.status === 'MATCH';
  const variant = isMatched ? 'low' : (face.status === 'UNABLE_TO_VERIFY' ? 'info' : 'high');

  return (
    <div className="glass-panel p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-[#34A99D]" />
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm tracking-wide">Face Verification Module</h3>
        </div>
        <Badge label={face.status.replace(/_/g, ' ')} variant={variant} />
      </div>

      <div className="flex items-center justify-between bg-slate-50 dark:bg-navy-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div>
          <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400 uppercase">Cosine Similarity Score</p>
          <p className={`text-2xl font-bold font-mono mt-0.5 ${isMatched ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
            {(face.similarity * 100).toFixed(0)}% <span className="text-xs text-slate-500 font-normal">Match</span>
          </p>
        </div>
        <div>
          <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400 uppercase">Detection Status</p>
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 font-mono">
            {face.detected_in_document && face.detected_in_reference ? 'Both Faces Detected' : 'Partial Detection'}
          </p>
        </div>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans bg-slate-100/60 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
        {face.details}
      </p>
    </div>
  );
};
