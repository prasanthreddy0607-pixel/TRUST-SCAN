import React, { useState, useRef } from 'react';
import { UploadCloud, File, Camera, X, ShieldAlert } from 'lucide-react';
import { Button } from '../common/Button';

interface DocumentUploaderProps {
  onUpload: (documentFile: File, referencePhoto: File | null, docTypeHint: string) => void;
  isProcessing: boolean;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onUpload, isProcessing }) => {
  const [docFile, setDocFile] = useState<File | null>(null);
  const [refFile, setRefFile] = useState<File | null>(null);
  const [docTypeHint, setDocTypeHint] = useState<string>('passport');

  const docInputRef = useRef<HTMLInputElement>(null);
  const refInputRef = useRef<HTMLInputElement>(null);

  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocFile(e.target.files[0]);
    }
  };

  const handleRefChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setRefFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (docFile) {
      onUpload(docFile, refFile, docTypeHint);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Document File Uploader Card */}
        <div className="glass-panel p-6 border-dashed border-2 border-slate-700 hover:border-blue-500/50 transition-colors flex flex-col items-center justify-center text-center">
          <input
            ref={docInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleDocChange}
            className="hidden"
          />
          {docFile ? (
            <div className="w-full space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto">
                <File className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-slate-100 text-sm truncate max-w-xs mx-auto">{docFile.name}</p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  {(docFile.size / (1024 * 1024)).toFixed(2)} MB • {docFile.type}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDocFile(null)}
                className="text-xs text-red-400 hover:text-red-300 font-medium inline-flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Remove Document
              </button>
            </div>
          ) : (
            <div className="space-y-3 cursor-pointer" onClick={() => docInputRef.current?.click()}>
              <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-blue-400 mx-auto shadow-inner">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div>
                <p className="font-bold text-slate-200 text-sm">Select Primary Document File</p>
                <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG, or PDF format (Max 10MB)</p>
              </div>
              <Button type="button" size="sm" variant="outline" className="pointer-events-none">
                Browse Document File
              </Button>
            </div>
          )}
        </div>

        {/* Reference Identity Photo Uploader Card */}
        <div className="glass-panel p-6 border-dashed border-2 border-slate-700 hover:border-blue-500/50 transition-colors flex flex-col items-center justify-center text-center">
          <input
            ref={refInputRef}
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleRefChange}
            className="hidden"
          />
          {refFile ? (
            <div className="w-full space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-slate-100 text-sm truncate max-w-xs mx-auto">{refFile.name}</p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">Reference Live Identity Photo</p>
              </div>
              <button
                type="button"
                onClick={() => setRefFile(null)}
                className="text-xs text-red-400 hover:text-red-300 font-medium inline-flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Remove Photo
              </button>
            </div>
          ) : (
            <div className="space-y-3 cursor-pointer" onClick={() => refInputRef.current?.click()}>
              <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-emerald-400 mx-auto shadow-inner">
                <Camera className="w-8 h-8" />
              </div>
              <div>
                <p className="font-bold text-slate-200 text-sm">Reference Photo (Optional)</p>
                <p className="text-xs text-slate-400 mt-1">Upload live candidate photo for facial verification</p>
              </div>
              <Button type="button" size="sm" variant="outline" className="pointer-events-none">
                Browse Reference Image
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Configuration Selection & Submit Action */}
      <div className="glass-panel p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-xs font-mono font-medium text-slate-400 whitespace-nowrap">
            Document Type Hint:
          </label>
          <select
            value={docTypeHint}
            onChange={(e) => setDocTypeHint(e.target.value)}
            className="bg-navy-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 font-sans"
          >
            <option value="passport">Passport / Travel Document</option>
            <option value="visa">Entry Visa Permit</option>
            <option value="national_id">National Identity Card</option>
            <option value="driving_license">Driving License</option>
            <option value="permit">Residence / Work Permit</option>
            <option value="auto">Auto Detect Classification</option>
          </select>
        </div>

        <Button
          type="submit"
          disabled={!docFile || isProcessing}
          size="lg"
          className="w-full sm:w-auto gap-2 text-sm"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>{isProcessing ? 'Processing Pipeline...' : 'Run Evidence Screening'}</span>
        </Button>
      </div>
    </form>
  );
};
