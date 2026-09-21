import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ScreeningRecord } from '../../types/screening';
import { Badge } from '../common/Badge';
import { ArrowRight, Eye, FileText } from 'lucide-react';
import { reportApi } from '../../services/reportApi';

interface RecentScreeningsProps {
  screenings: ScreeningRecord[];
}

export const RecentScreenings: React.FC<RecentScreeningsProps> = ({ screenings }) => {
  const navigate = useNavigate();

  return (
    <div className="glass-panel overflow-hidden">
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm tracking-wide">Recent Screening Inspection Operations</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Live border checkpoint audit queue</p>
        </div>
        <button
          onClick={() => navigate('/history')}
          className="text-xs text-[#34A99D] hover:text-[#2c9389] font-medium flex items-center gap-1 transition-colors"
        >
          <span>View All History</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-navy-950/60 font-mono text-slate-500 dark:text-slate-400 text-[11px] uppercase">
              <th className="p-3.5 pl-5">Screening ID</th>
              <th className="p-3.5">Document Type</th>
              <th className="p-3.5">Filename</th>
              <th className="p-3.5">Timestamp</th>
              <th className="p-3.5">Risk Score</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right pr-5">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
            {screenings.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500 font-mono text-xs">
                  No screening records logged. Upload a document or try Demo Mode.
                </td>
              </tr>
            ) : (
              screenings.slice(0, 7).map((item) => {
                const score = item.risk_assessment?.risk_score ?? 0;
                const level = item.risk_assessment?.risk_level ?? 'LOW';
                const variant = level.toLowerCase() as 'low' | 'medium' | 'high';

                return (
                  <tr key={item.screening_id} className="hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 pl-5 font-mono font-medium text-slate-800 dark:text-slate-200">{item.screening_id}</td>
                    <td className="p-3.5 text-slate-700 dark:text-slate-300 font-semibold uppercase">{item.document_type}</td>
                    <td className="p-3.5 text-slate-400 max-w-[180px] truncate">{item.filename}</td>
                    <td className="p-3.5 text-slate-400 font-mono text-[11px]">{item.created_at}</td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100 font-mono">{score}/100</span>
                        <Badge label={level} variant={variant} />
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right pr-5 space-x-2">
                      <button
                        onClick={() => navigate(`/screening/${item.screening_id}`)}
                        className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 transition-colors inline-flex items-center gap-1 text-[11px] font-medium"
                        title="View Screening Result"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                      <a
                        href={reportApi.getReportPdfUrl(item.screening_id)}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors inline-flex items-center gap-1 text-[11px] font-medium"
                        title="Download PDF Report"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </a>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
