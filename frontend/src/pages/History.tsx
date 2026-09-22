import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { screeningApi } from '../services/screeningApi';
import { reportApi } from '../services/reportApi';
import { ScreeningRecord } from '../types/screening';
import { Badge } from '../components/common/Badge';
import { Loading } from '../components/common/Loading';
import { History as HistoryIcon, Eye, FileText, Trash2 } from 'lucide-react';

export const History: React.FC = () => {
  const navigate = useNavigate();
  const [screenings, setScreenings] = useState<ScreeningRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await screeningApi.listHistory(100);
      setScreenings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm(`Are you sure you want to delete screening record ${id}?`)) {
      await screeningApi.deleteScreening(id);
      fetchHistory();
    }
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2C1A0E] dark:text-[#F9EBD5] tracking-tight flex items-center gap-2">
            <HistoryIcon className="w-6 h-6 text-[#8B5320] dark:text-[#D39F67]" />
            <span>Screening Audit History Log</span>
          </h1>
          <p className="text-xs text-[#8A715C] dark:text-[#C8A889] font-mono mt-0.5">
            Historical database of all border checkpoint document screenings
          </p>
        </div>

        {loading ? (
          <Loading message="Loading screening history records..." />
        ) : (
          <div className="glass-panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E8D6BD] dark:border-[#4A3324] bg-[#F4EAD9]/70 dark:bg-[#1C110A]/80 font-mono text-[#8A715C] dark:text-[#C8A889] text-[11px] uppercase">
                    <th className="p-3.5 pl-5">Screening ID</th>
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Filename</th>
                    <th className="p-3.5">Timestamp</th>
                    <th className="p-3.5">Risk Score</th>
                    <th className="p-3.5">Recommendation</th>
                    <th className="p-3.5 text-right pr-5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8D6BD] dark:divide-[#4A3324]">
                  {screenings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-[#8A715C] dark:text-[#C8A889] font-mono text-xs">
                        No historical screening logs found.
                      </td>
                    </tr>
                  ) : (
                    screenings.map((item) => {
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
                          <td className="p-3.5 font-mono text-[#392210] dark:text-[#F9EBD5] uppercase text-[11px]">
                            {item.risk_assessment?.recommendation.replace(/_/g, ' ') || 'N/A'}
                          </td>
                          <td className="p-3.5 text-right pr-5 space-x-2">
                            <button
                              onClick={() => navigate(`/screening/${item.screening_id}`)}
                              className="p-1.5 rounded bg-[#F4EAD9] dark:bg-[#382619] hover:bg-[#E8D6BD] dark:hover:bg-[#4A3324] text-[#8B5320] dark:text-[#D39F67] border border-[#D6BB9B] dark:border-[#6B3E16] transition-colors inline-flex items-center gap-1 text-[11px] font-semibold"
                            >
                              <Eye className="w-3.5 h-3.5" /> Inspect
                            </button>
                            <a
                              href={reportApi.getReportPdfUrl(item.screening_id)}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded bg-[#F4EAD9] dark:bg-[#382619] hover:bg-[#E8D6BD] dark:hover:bg-[#4A3324] text-[#6E5745] dark:text-[#C8A889] border border-[#D6BB9B] dark:border-[#6B3E16] transition-colors inline-flex items-center gap-1 text-[11px] font-semibold"
                            >
                              <FileText className="w-3.5 h-3.5" /> PDF
                            </a>
                            <button
                              onClick={() => handleDelete(item.screening_id)}
                              className="p-1.5 rounded bg-[#F4EAD9] dark:bg-[#382619] hover:bg-[#FDE8E8] dark:hover:bg-[#3E1A17] text-[#C0392B] border border-[#D6BB9B] dark:border-[#6B3E16] transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};
