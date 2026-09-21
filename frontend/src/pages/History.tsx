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
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <HistoryIcon className="w-6 h-6 text-[#34A99D]" />
            <span>Screening Audit History Log</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
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
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-navy-950/60 font-mono text-slate-600 dark:text-slate-400 text-[11px] uppercase">
                    <th className="p-3.5 pl-5">Screening ID</th>
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Filename</th>
                    <th className="p-3.5">Timestamp</th>
                    <th className="p-3.5">Risk Score</th>
                    <th className="p-3.5">Recommendation</th>
                    <th className="p-3.5 text-right pr-5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                  {screenings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500 font-mono text-xs">
                        No historical screening logs found.
                      </td>
                    </tr>
                  ) : (
                    screenings.map((item) => {
                      const score = item.risk_assessment?.risk_score ?? 0;
                      const level = item.risk_assessment?.risk_level ?? 'LOW';
                      const variant = level.toLowerCase() as 'low' | 'medium' | 'high';

                      return (
                        <tr key={item.screening_id} className="hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="p-3.5 pl-5 font-mono font-medium text-slate-800 dark:text-slate-200">{item.screening_id}</td>
                          <td className="p-3.5 text-slate-700 dark:text-slate-300 font-semibold uppercase">{item.document_type}</td>
                          <td className="p-3.5 text-slate-600 dark:text-slate-400 max-w-[180px] truncate">{item.filename}</td>
                          <td className="p-3.5 text-slate-600 dark:text-slate-400 font-mono text-[11px]">{item.created_at}</td>
                          <td className="p-3.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-800 dark:text-slate-100 font-mono">{score}/100</span>
                              <Badge label={level} variant={variant} />
                            </div>
                          </td>
                          <td className="p-3.5 font-mono text-slate-700 dark:text-slate-300 uppercase text-[11px]">
                            {item.risk_assessment?.recommendation.replace(/_/g, ' ') || 'N/A'}
                          </td>
                          <td className="p-3.5 text-right pr-5 space-x-2">
                            <button
                              onClick={() => navigate(`/screening/${item.screening_id}`)}
                              className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#34A99D] border border-slate-300 dark:border-slate-700 transition-colors inline-flex items-center gap-1 text-[11px] font-semibold"
                            >
                              <Eye className="w-3.5 h-3.5" /> Inspect
                            </button>
                            <a
                              href={reportApi.getReportPdfUrl(item.screening_id)}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition-colors inline-flex items-center gap-1 text-[11px] font-semibold"
                            >
                              <FileText className="w-3.5 h-3.5" /> PDF
                            </a>
                            <button
                              onClick={() => handleDelete(item.screening_id)}
                              className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 border border-slate-300 dark:border-slate-700 transition-colors"
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
