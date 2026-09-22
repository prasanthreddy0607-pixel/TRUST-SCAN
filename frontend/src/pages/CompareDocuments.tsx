import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { ComparisonUploader } from '../components/comparison/ComparisonUploader';
import { SideBySideViewer } from '../components/comparison/SideBySideViewer';
import { ErrorState } from '../components/common/ErrorState';
import { comparisonApi } from '../services/comparisonApi';
import { DocumentComparisonResult } from '../types/screening';
import { GitCompare } from 'lucide-react';

export const CompareDocuments: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [comparison, setComparison] = useState<DocumentComparisonResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCompare = async (original: File, presented: File) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await comparisonApi.compareDocuments(original, presented);
      setComparison(res);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Document comparison failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2C1A0E] dark:text-[#F9EBD5] tracking-tight flex items-center gap-2">
            <GitCompare className="w-6 h-6 text-[#8B5320] dark:text-[#D39F67]" />
            <span>Document Comparison & Difference Detection</span>
          </h1>
          <p className="text-xs text-[#8A715C] dark:text-[#C8A889] font-mono mt-0.5">
            Compare baseline original document against presented sample to isolate image modifications
          </p>
        </div>

        {errorMsg && <ErrorState message={errorMsg} onRetry={() => setErrorMsg(null)} />}

        <ComparisonUploader onCompare={handleCompare} isLoading={isLoading} />

        {comparison && <SideBySideViewer comparison={comparison} />}
      </div>
    </PageContainer>
  );
};
