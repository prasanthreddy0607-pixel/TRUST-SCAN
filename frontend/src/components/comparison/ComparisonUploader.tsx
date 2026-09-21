import React, { useState } from 'react';
import { UploadCloud, GitCompare, File, X } from 'lucide-react';
import { Button } from '../common/Button';

interface ComparisonUploaderProps {
  onCompare: (original: File, presented: File) => void;
  isLoading: boolean;
}

export const ComparisonUploader: React.FC<ComparisonUploaderProps> = ({ onCompare, isLoading }) => {
  const [origFile, setOrigFile] = useState<File | null>(null);
  const [presFile, setPresFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (origFile && presFile) {
      onCompare(origFile, presFile);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original File */}
        <div className="glass-panel p-6 border-dashed border-2 border-slate-700 hover:border-blue-500/50 transition-colors text-center flex flex-col items-center justify-center">
          <input
            type="file"
            id="origInput"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={(e) => e.target.files?.[0] && setOrigFile(e.target.files[0])}
            className="hidden"
          />
          {origFile ? (
            <div className="space-y-2">
              <File className="w-8 h-8 text-blue-400 mx-auto" />
              <p className="font-semibold text-slate-100 text-xs truncate max-w-xs">{origFile.name}</p>
              <button
                type="button"
                onClick={() => setOrigFile(null)}
                className="text-xs text-red-400 font-medium inline-flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Change Original
              </button>
            </div>
          ) : (
            <label htmlFor="origInput" className="cursor-pointer space-y-2">
              <UploadCloud className="w-8 h-8 text-blue-400 mx-auto" />
              <p className="font-bold text-slate-200 text-sm">Upload Original Baseline Document</p>
              <p className="text-xs text-slate-400">Authentic reference copy</p>
            </label>
          )}
        </div>

        {/* Presented File */}
        <div className="glass-panel p-6 border-dashed border-2 border-slate-700 hover:border-blue-500/50 transition-colors text-center flex flex-col items-center justify-center">
          <input
            type="file"
            id="presInput"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={(e) => e.target.files?.[0] && setPresFile(e.target.files[0])}
            className="hidden"
          />
          {presFile ? (
            <div className="space-y-2">
              <File className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="font-semibold text-slate-100 text-xs truncate max-w-xs">{presFile.name}</p>
              <button
                type="button"
                onClick={() => setPresFile(null)}
                className="text-xs text-red-400 font-medium inline-flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Change Presented
              </button>
            </div>
          ) : (
            <label htmlFor="presInput" className="cursor-pointer space-y-2">
              <UploadCloud className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="font-bold text-slate-200 text-sm">Upload Presented Document</p>
              <p className="text-xs text-slate-400">Document presented at border checkpoint</p>
            </label>
          )}
        </div>
      </div>

      <div className="text-center">
        <Button
          type="submit"
          disabled={!origFile || !presFile || isLoading}
          size="lg"
          className="gap-2"
        >
          <GitCompare className="w-4 h-4" />
          <span>{isLoading ? 'Aligning & Computing Differences...' : 'Run Side-by-Side Comparison'}</span>
        </Button>
      </div>
    </form>
  );
};
