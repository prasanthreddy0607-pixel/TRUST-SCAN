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
      <div className="p-5 border-b border-[#E8D6BD] dark:border-[#4A3324] flex items-center justify-between">
        <div>
          <h3 className="font-bold text-[#2C1A0E] dark:text-[#F9EBD5] text-sm tracking-wide">Recent Screening Inspection Operations</h3>
          <p className="text-xs text-[#8A715C] dark:text-[#C8A889]">Live border checkpoint audit queue</p>
        </div>
        <button
          onClick={() => navigate('/history')}
          className="text-xs text-[#8B5320] dark:text-[#D39F67] hover:text-[#6B3E16] dark:hover:text-[#F9EBD5] font-medium flex items-center gap-1 transition-colors"
        >
          <span>View All History</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#E8D6BD] dark:border-[#4A3324] bg-[#F4EAD9]/70 dark:bg-[#1C110A]/80 font-mono text-[#8A715C] dark:text-[#C8A889] text-[11px] uppercase">
              <th className="p-3.5 pl-5">Screening ID</th>
              <th className="p-3.5">Document Type</th>
              <th className="p-3.5">Filename</th>
              <th className="p-3.5">Timestamp</th>
              <th className="p-3.5">Risk Score</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right pr-5">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8D6BD] dark:divide-[#4A3324]">
            {screenings.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-[#8A715C] dark:text-[#C8A889] font-mono text-xs">
                  No screening records logged. Upload a document or try Demo Mode.
                </td>
              </tr>
            ) : (
              screenings.slice(0, 7).map((item) => {
                const score = item.risk_assessment?.risk_score ?? 0;
                const level = item.risk_assessment?.risk_level ?? 'LOW';
                const variant = level.toLowerCase() as 'low' | 'medium' | 'high';

                return (
                  <tr key={item.screening_id} className="hover:bg-[#F4EAD9]/60 dark:hover:bg-[#382619]/60 transition-colors">
                    <td className="p-3.5 pl-5 font-mono font-medium text-[#2C1A0E] dark:text-[#F9EBD5]">{item.screening_id}</td>
                    <td className="p-3.5 text-[#392210] dark:text-[#F9EBD5] font-semibold uppercase">{item.document_type}</td>
                    <td className="p-3.5 text-[#6E5745] dark:text-[#C8A889] max-w-[180px] truncate">{item.filename}</td>
                    <td className="p-3.5 text-[#8A715C] dark:text-[#C8A889] font-mono text-[11px]">{item.created_at}</td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#2C1A0E] dark:text-[#F9EBD5] font-mono">{score}/100</span>
                        <Badge label={level} variant={variant} />
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="text-[11px] font-mono text-[#2E7D5E] dark:text-[#A8E6CF] bg-[#E8F5EE] dark:bg-[#1B382B] px-2 py-0.5 rounded border border-[#A3D9C3] dark:border-[#2E7D5E]/40">
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right pr-5 space-x-2">
                      <button
                        onClick={() => navigate(`/screening/${item.screening_id}`)}
                        className="p-1.5 rounded bg-[#F4EAD9] dark:bg-[#382619] hover:bg-[#E8D6BD] dark:hover:bg-[#4A3324] text-[#8B5320] dark:text-[#D39F67] border border-[#D6BB9B] dark:border-[#6B3E16] transition-colors inline-flex items-center gap-1 text-[11px] font-medium"
                        title="View Screening Result"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                      <a
                        href={reportApi.getReportPdfUrl(item.screening_id)}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded bg-[#F4EAD9] dark:bg-[#382619] hover:bg-[#E8D6BD] dark:hover:bg-[#4A3324] text-[#6E5745] dark:text-[#C8A889] border border-[#D6BB9B] dark:border-[#6B3E16] transition-colors inline-flex items-center gap-1 text-[11px] font-medium"
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
