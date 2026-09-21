import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Layers } from 'lucide-react';
import { TamperingFinding } from '../../types/forensic';
import { reportApi } from '../../services/reportApi';

interface ForensicViewerProps {
  originalImageUrl: string;
  annotatedImageUrl?: string;
  findings: TamperingFinding[];
  onSelectFinding?: (finding: TamperingFinding) => void;
}

export const ForensicViewer: React.FC<ForensicViewerProps> = ({
  originalImageUrl,
  annotatedImageUrl,
  findings,
  onSelectFinding
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [showAnnotated, setShowAnnotated] = useState<boolean>(true);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoom(1);

  const activeImage = showAnnotated && annotatedImageUrl ? annotatedImageUrl : originalImageUrl;
  const fullUrl = reportApi.getFileUrl(activeImage);

  return (
    <div className="glass-panel overflow-hidden flex flex-col h-full">
      {/* Control Bar */}
      <div className="p-3 bg-navy-950/80 border-b border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-slate-400 font-semibold">Forensic Document Inspector</span>
          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
            {Math.round(zoom * 100)}% Zoom
          </span>
        </div>

        <div className="flex items-center gap-2">
          {annotatedImageUrl && (
            <button
              onClick={() => setShowAnnotated(!showAnnotated)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1.5 ${
                showAnnotated
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{showAnnotated ? 'Annotated Regions' : 'Original Raw'}</span>
            </button>
          )}

          <div className="h-4 w-px bg-slate-800"></div>

          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Fit Canvas"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Document Display Area */}
      <div className="flex-1 p-4 overflow-auto flex items-center justify-center bg-navy-950/90 relative min-h-[360px]">
        <div
          className="transition-transform duration-200 relative shadow-2xl rounded-lg overflow-hidden border border-slate-700 max-w-full"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
        >
          <img
            src={fullUrl}
            alt="Document Forensic Canvas"
            className="max-h-[500px] object-contain rounded"
          />
        </div>
      </div>

      {/* Interactive Suspicious Region Quick Picker */}
      {findings.length > 0 && (
        <div className="p-3 border-t border-slate-800 bg-navy-900/60 overflow-x-auto flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400 uppercase whitespace-nowrap">
            Interactive Regions:
          </span>
          {findings.map((f, idx) => (
            <button
              key={idx}
              onClick={() => onSelectFinding && onSelectFinding(f)}
              className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 whitespace-nowrap transition-all"
            >
              {f.detector.replace(/_/g, ' ')} ({f.score})
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
