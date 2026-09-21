import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { DocumentUploader } from '../components/upload/DocumentUploader';
import { UploadProgress } from '../components/upload/UploadProgress';
import { ErrorState } from '../components/common/ErrorState';
import { screeningApi } from '../services/screeningApi';
import { ShieldCheck } from 'lucide-react';

export const NewScreening: React.FC = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleUpload = async (docFile: File, refFile: File | null, docTypeHint: string) => {
    setIsProcessing(true);
    setErrorMsg(null);
    setCurrentStepIndex(0);

    // Simulated progress steps animation during API call
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < 8 ? prev + 1 : prev));
    }, 600);

    try {
      const record = await screeningApi.screenDocument(docFile, refFile, docTypeHint);
      clearInterval(stepInterval);
      setCurrentStepIndex(9); // Complete
      setTimeout(() => {
        navigate(`/screening/${record.screening_id}`);
      }, 500);
    } catch (err: any) {
      clearInterval(stepInterval);
      setIsProcessing(false);
      const detail = err.response?.data?.detail || err.message || 'Failed to complete screening inspection.';
      setErrorMsg(detail);
    }
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
            <span>New Document Screening Inspection</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Upload synthetic identity or travel document for multi-layer evidence screening
          </p>
        </div>

        {errorMsg && <ErrorState message={errorMsg} onRetry={() => setErrorMsg(null)} />}

        {isProcessing ? (
          <UploadProgress currentStepIndex={currentStepIndex} />
        ) : (
          <DocumentUploader onUpload={handleUpload} isProcessing={isProcessing} />
        )}
      </div>
    </PageContainer>
  );
};
