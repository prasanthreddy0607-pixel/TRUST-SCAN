import React from 'react';
import { CheckCircle2, Loader2, Circle } from 'lucide-react';

interface TimelineStep {
  label: string;
  status: 'completed' | 'in_progress' | 'pending';
}

interface UploadProgressProps {
  currentStepIndex: number;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({ currentStepIndex }) => {
  const steps: string[] = [
    'Uploading Document File',
    'Preprocessing & Deskewing',
    'OCR Character Extraction',
    'MRZ Checksum Analysis',
    'Document Rules Engine',
    'Forensic Tampering Suite',
    'Face Verification & Matching',
    'Weighted Risk & Evidence Engine',
    'PDF Report Generation'
  ];

  return (
    <div className="glass-panel p-6 max-w-xl mx-auto space-y-6">
      <div className="text-center">
        <h3 className="font-bold text-slate-100 text-sm tracking-wide">Executing Evidence Screening Pipeline</h3>
        <p className="text-xs text-slate-400 mt-1 font-mono">Running automated inspection engines...</p>
      </div>

      <div className="space-y-3">
        {steps.map((stepLabel, idx) => {
          let status: 'completed' | 'in_progress' | 'pending' = 'pending';
          if (idx < currentStepIndex) status = 'completed';
          else if (idx === currentStepIndex) status = 'in_progress';

          return (
            <div
              key={stepLabel}
              className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-mono transition-all ${
                status === 'completed'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : status === 'in_progress'
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-md shadow-blue-500/5'
                  : 'bg-navy-950/40 border-slate-800 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-3">
                {status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {status === 'in_progress' && <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />}
                {status === 'pending' && <Circle className="w-4 h-4 text-slate-600" />}
                <span className="font-sans">{stepLabel}</span>
              </div>
              <span className="text-[10px] uppercase tracking-wider font-semibold">
                {status === 'completed' ? 'DONE' : status === 'in_progress' ? 'RUNNING' : 'WAITING'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
