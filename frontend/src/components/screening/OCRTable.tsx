import React from 'react';
import { OCRResult, MRZResult } from '../../types/document';
import { FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { Badge } from '../common/Badge';

interface OCRTableProps {
  ocr?: OCRResult;
  mrz?: MRZResult;
}

export const OCRTable: React.FC<OCRTableProps> = ({ ocr, mrz }) => {
  if (!ocr) return null;

  return (
    <div className="glass-panel p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#34A99D]" />
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm tracking-wide">OCR & MRZ Extracted Field Data</h3>
        </div>
        <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
          Confidence: {Math.round(ocr.overall_confidence * 100)}%
        </span>
      </div>

      {/* Structured OCR Key-Value Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Object.entries(ocr.fields).map(([key, item]) => {
          const mrzComp = mrz?.field_comparisons?.[key];
          const isConsistent = mrzComp ? mrzComp.consistent : true;

          return (
            <div key={key} className="bg-slate-50 dark:bg-navy-950/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-slate-400">
                <span className="uppercase">{key.replace(/_/g, ' ')}</span>
                <span className="text-slate-500 font-medium">{Math.round(item.confidence * 100)}% Conf</span>
              </div>
              <p className="font-bold text-slate-800 dark:text-slate-100 text-sm font-mono truncate">{item.value || 'N/A'}</p>

              {mrzComp && (
                <div className={`text-[10px] font-mono flex items-center gap-1 mt-1 pt-1 border-t border-slate-200 dark:border-slate-800/60 ${isConsistent ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400 font-bold'}`}>
                  {isConsistent ? (
                    <>
                      <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span>MRZ Consistent ({mrzComp.mrz})</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3 h-3 text-red-600 dark:text-red-400" />
                      <span>MRZ Mismatch (Payload: {mrzComp.mrz})</span>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Raw MRZ Lines Display */}
      {mrz && mrz.detected && mrz.raw_mrz.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-400">
            <span>ICAO Doc 9303 MRZ Payload:</span>
            <Badge label={mrz.check_digits_valid ? 'Checksum Valid' : 'Checksum Error'} variant={mrz.check_digits_valid ? 'low' : 'high'} />
          </div>
          <div className="bg-slate-100 dark:bg-navy-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-xs text-[#458393] dark:text-cyan-400 font-semibold leading-relaxed tracking-wider space-y-1 select-all">
            {mrz.raw_mrz.map((line, idx) => (
              <div key={idx}>{line}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
