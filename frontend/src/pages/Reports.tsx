import React, { useEffect, useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { screeningApi } from '../services/screeningApi';
import { reportApi } from '../services/reportApi';
import { ScreeningRecord } from '../types/screening';
import { Loading } from '../components/common/Loading';
import { FileText, Download, Eye, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Reports: React.FC = () => {
  const navigate = useNavigate();
  const [screenings, setScreenings] = useState<ScreeningRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await screeningApi.listHistory(50);
        setScreenings(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-400" />
            <span>Generated Audit PDF Reports Archive</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Download generated executive document screening inspection PDF reports
          </p>
        </div>

        {loading ? (
          <Loading message="Loading generated PDF report files..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {screenings.length === 0 ? (
              <div className="col-span-full text-center p-12 text-slate-500 font-mono text-xs glass-panel">
                No PDF reports generated yet. Run a document screening to auto-generate PDF reports.
              </div>
            ) : (
              screenings.map((item) => (
                <div key={item.screening_id} className="glass-panel p-5 space-y-4 glass-panel-hover border-slate-800">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      PDF Document
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-100 text-sm font-mono">{item.screening_id} Report</h3>
                    <p className="text-xs text-slate-400 mt-1 truncate">Document: {item.filename}</p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">Created: {item.created_at}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                    <a
                      href={reportApi.getReportPdfUrl(item.screening_id)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2 px-3 rounded-lg text-center flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </a>
                    <button
                      onClick={() => navigate(`/screening/${item.screening_id}`)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                      title="Inspect Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </PageContainer>
  );
};
