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
        <h3 className="font-bold text-[#2C1A0E] dark:text-[#F9EBD5] text-sm tracking-wide">Executing Evidence Screening Pipeline</h3>
        <p className="text-xs text-[#8A715C] dark:text-[#C8A889] mt-1 font-mono">Running automated inspection engines...</p>
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
                  ? 'bg-[#E8F5EE] dark:bg-[#1B382B] border-[#A3D9C3] dark:border-[#2E7D5E]/40 text-[#2E7D5E] dark:text-[#A8E6CF]'
                  : status === 'in_progress'
                  ? 'bg-[#F4EAD9] dark:bg-[#382619] border-[#D6BB9B] dark:border-[#6B3E16] text-[#8B5320] dark:text-[#D39F67] shadow-sm'
                  : 'bg-[#FFFDF9]/40 dark:bg-[#1C110A]/40 border-[#E8D6BD] dark:border-[#4A3324] text-[#8A715C] dark:text-[#C8A889]/60'
              }`}
            >
              <div className="flex items-center gap-3">
                {status === 'completed' && <CheckCircle2 className="w-4 h-4 text-[#2E7D5E] dark:text-[#A8E6CF]" />}
                {status === 'in_progress' && <Loader2 className="w-4 h-4 text-[#8B5320] dark:text-[#D39F67] animate-spin" />}
                {status === 'pending' && <Circle className="w-4 h-4 text-[#8A715C] dark:text-[#C8A889]/40" />}
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
