import React from 'react';
import { DocumentComparisonResult } from '../../types/screening';
import { reportApi } from '../../services/reportApi';
import { Badge } from '../common/Badge';

interface SideBySideViewerProps {
  comparison: DocumentComparisonResult;
}

export const SideBySideViewer: React.FC<SideBySideViewerProps> = ({ comparison }) => {
  const origUrl = reportApi.getFileUrl(comparison.original_image_url);
  const presUrl = reportApi.getFileUrl(comparison.presented_image_url);
  const diffUrl = reportApi.getFileUrl(comparison.annotated_diff_image_url);

  return (
    <div className="space-y-6">
      {/* Comparison Summary Banner */}
      <div className="glass-panel p-5 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-100 text-base font-mono">{comparison.comparison_id}</h3>
          <p className="text-xs text-slate-400">Image alignment & spatial pixel difference inspection</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-mono text-slate-400 uppercase">Difference Score</p>
            <p className="text-xl font-bold font-mono text-red-400">{comparison.difference_score}/100</p>
          </div>
          <Badge
            label={`${comparison.changed_regions_count} Modifications`}
            variant={comparison.changed_regions_count > 0 ? 'high' : 'low'}
          />
        </div>
      </div>

      {/* 3-Column Image Alignment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Original */}
        <div className="glass-panel p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-mono text-xs font-semibold text-blue-400 uppercase">1. Baseline Original</span>
            <span className="text-[10px] text-slate-500 font-mono">Reference</span>
          </div>
          <div className="bg-navy-950 p-2 rounded-lg border border-slate-800 flex items-center justify-center min-h-[260px]">
            <img src={origUrl} alt="Baseline Original" className="max-h-[320px] object-contain rounded" />
          </div>
        </div>

        {/* Presented */}
        <div className="glass-panel p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-mono text-xs font-semibold text-emerald-400 uppercase">2. Presented Document</span>
            <span className="text-[10px] text-slate-500 font-mono">Screened</span>
          </div>
          <div className="bg-navy-950 p-2 rounded-lg border border-slate-800 flex items-center justify-center min-h-[260px]">
            <img src={presUrl} alt="Presented Document" className="max-h-[320px] object-contain rounded" />
          </div>
        </div>

        {/* Difference Map */}
        <div className="glass-panel p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-mono text-xs font-semibold text-red-400 uppercase">3. Difference Heatmap</span>
            <span className="text-[10px] text-slate-500 font-mono">Highlights</span>
          </div>
          <div className="bg-navy-950 p-2 rounded-lg border border-slate-800 flex items-center justify-center min-h-[260px]">
            <img src={diffUrl} alt="Difference Heatmap" className="max-h-[320px] object-contain rounded" />
          </div>
        </div>
      </div>

      {/* List of Detected Regional Changes */}
      <div className="glass-panel p-5 space-y-3">
        <h4 className="font-bold text-slate-100 text-sm tracking-wide">
          Detected Regional Alterations ({comparison.changed_regions.length})
        </h4>
        <div className="space-y-2">
          {comparison.changed_regions.length === 0 ? (
            <p className="text-xs font-mono text-slate-500">No spatial region differences detected between images.</p>
          ) : (
            comparison.changed_regions.map((reg) => (
              <div key={reg.id} className="p-3 rounded-lg bg-navy-950/60 border border-slate-800 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="font-bold text-slate-200">{reg.label}</span>
                  <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                    Bounding Box: ({reg.region.x}, {reg.region.y}) • Area: {reg.area_pixels} px
                  </p>
                </div>
                <Badge label={reg.severity} variant={reg.severity.toLowerCase() as 'low' | 'medium' | 'high'} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
