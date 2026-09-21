import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { RiskScore } from '../components/screening/RiskScore';
import { VerificationStatus } from '../components/screening/VerificationStatus';
import { EvidenceList } from '../components/screening/EvidenceList';
import { OCRTable } from '../components/screening/OCRTable';
import { ValidationResults } from '../components/screening/ValidationResults';
import { TamperingResults } from '../components/screening/TamperingResults';
import { FaceMatchCard } from '../components/screening/FaceMatchCard';
import { ForensicViewer } from '../components/forensic/ForensicViewer';
import { Modal } from '../components/common/Modal';
import { Loading } from '../components/common/Loading';
import { ErrorState } from '../components/common/ErrorState';
import { Button } from '../components/common/Button';
import { screeningApi } from '../services/screeningApi';
import { reportApi } from '../services/reportApi';
import { ScreeningRecord } from '../types/screening';
import { TamperingFinding } from '../types/forensic';
import { FileText, ArrowLeft, Sparkles, ShieldAlert } from 'lucide-react';

export const ScreeningResult: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<ScreeningRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedFinding, setSelectedFinding] = useState<TamperingFinding | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchRecord = async () => {
      try {
        setLoading(true);
        const data = await screeningApi.getScreening(id);
        setRecord(data);
      } catch (err: any) {
        setErrorMsg(err.response?.data?.detail || 'Screening record not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecord();
  }, [id]);

  if (loading) return <PageContainer><Loading message="Loading screening inspection payload..." /></PageContainer>;
  if (errorMsg || !record) return <PageContainer><ErrorState message={errorMsg || 'Screening not found'} onRetry={() => navigate('/history')} /></PageContainer>;

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Navigation & Header Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold font-mono text-slate-100">{record.screening_id}</h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30 uppercase font-mono">
                  {record.document_type}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Filename: {record.filename} • Processed: {record.created_at}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={reportApi.getReportPdfUrl(record.screening_id)}
              target="_blank"
              rel="noreferrer"
            >
              <Button size="sm" className="gap-2">
                <FileText className="w-4 h-4" />
                <span>Export PDF Report</span>
              </Button>
            </a>
          </div>
        </div>

        {/* Top Module Verification Status Matrix */}
        <VerificationStatus record={record} />

        {/* 2-Column Core Layout: LEFT (Document & Forensics) | RIGHT (Risk & Evidence) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: Forensic Document Viewer & Analysis Tables (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            <ForensicViewer
              originalImageUrl={record.original_image_url}
              annotatedImageUrl={record.annotated_image_url}
              findings={record.forensic_result?.findings || []}
              onSelectFinding={(f) => setSelectedFinding(f)}
            />

            <OCRTable ocr={record.ocr_result} mrz={record.mrz_result} />
            <ValidationResults validation={record.validation_result} />
            <TamperingResults forensic={record.forensic_result} />
            <FaceMatchCard face={record.face_result} />
          </div>

          {/* RIGHT COLUMN: Risk Engine, Evidence List & AI Summary (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            <RiskScore assessment={record.risk_assessment} />

            <EvidenceList
              evidence={record.risk_assessment?.evidence || []}
              onSelectEvidence={(item) => {
                const match = record.forensic_result?.findings.find(f => f.detector.toLowerCase().includes(item.title.toLowerCase().split(' ')[0]));
                if (match) setSelectedFinding(match);
              }}
            />

            {/* AI Summary Card */}
            {record.ai_summary && (
              <div className="glass-panel p-5 space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h3 className="font-bold text-slate-100 text-sm tracking-wide">Gemini AI Screening Summary</h3>
                </div>
                <div className="text-xs text-slate-300 leading-relaxed font-sans prose prose-invert max-w-none space-y-2">
                  <div dangerouslySetInnerHTML={{ __html: record.ai_summary.replace(/## /g, '<h4 class="font-bold text-slate-200 mt-2 mb-1">').replace(/\n/g, '<br/>') }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Region Details Modal */}
      <Modal
        isOpen={!!selectedFinding}
        onClose={() => setSelectedFinding(null)}
        title={`Forensic Detector Finding: ${selectedFinding?.detector.replace(/_/g, ' ').toUpperCase()}`}
      >
        {selectedFinding && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-navy-950 p-3 rounded-lg border border-slate-800 font-mono text-xs">
              <span className="text-slate-400">Anomaly Severity:</span>
              <span className={`font-bold ${selectedFinding.severity === 'HIGH' ? 'text-red-400' : 'text-amber-400'}`}>
                {selectedFinding.severity} (Score: {selectedFinding.score})
              </span>
            </div>

            <div>
              <h4 className="font-semibold text-slate-200 text-xs font-mono uppercase mb-1">Detailed Explanation</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-800/40 p-3 rounded-lg border border-slate-800">
                "{selectedFinding.explanation}"
              </p>
            </div>

            {selectedFinding.region && (
              <div className="bg-navy-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-400 space-y-1">
                <p className="text-slate-300 font-bold">Bounding Region Coordinates:</p>
                <p>X: {selectedFinding.region.x} px • Y: {selectedFinding.region.y} px</p>
                <p>Width: {selectedFinding.region.width} px • Height: {selectedFinding.region.height} px</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </PageContainer>
  );
};
