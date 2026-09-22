import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/common/Button';
import { Loading } from '../components/common/Loading';
import { ErrorState } from '../components/common/ErrorState';
import { screeningApi } from '../services/screeningApi';
import { DemoScenario } from '../types/screening';
import { Sparkles, Play, ShieldAlert, FileText, ArrowRight } from 'lucide-react';

export const DemoMode: React.FC = () => {
  const navigate = useNavigate();
  const [scenarios, setScenarios] = useState<DemoScenario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const loadDemos = async () => {
      try {
        const data = await screeningApi.getDemoScenarios();
        setScenarios(data);
      } catch (err: any) {
        setErrorMsg('Failed to load demo scenarios.');
      } finally {
        setLoading(false);
      }
    };
    loadDemos();
  }, []);

  const handleRunDemo = async (id: string) => {
    setRunningId(id);
    setErrorMsg(null);
    try {
      const record = await screeningApi.runDemoScenario(id);
      navigate(`/screening/${record.screening_id}`);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Demo execution failed.');
    } finally {
      setRunningId(null);
    }
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#2C1A0E] dark:text-[#F9EBD5] tracking-tight flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#8B5320] dark:text-[#D39F67]" />
              <span>Hackathon Demo Mode — Preset Test Scenarios</span>
            </h1>
            <p className="text-xs text-[#8A715C] dark:text-[#C8A889] font-mono mt-0.5">
              Deterministic pre-generated synthetic identity documents for judge presentation
            </p>
          </div>
        </div>

        {errorMsg && <ErrorState message={errorMsg} />}

        {loading ? (
          <Loading message="Loading demo scenarios..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scenarios.map((s) => (
              <div
                key={s.id}
                className="glass-panel p-6 flex flex-col justify-between glass-panel-hover space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#F4EAD9] dark:bg-[#382619] text-[#8B5320] dark:text-[#D39F67] border border-[#D6BB9B] dark:border-[#6B3E16] uppercase">
                      {s.badge}
                    </span>
                    <span className="text-[11px] font-mono text-[#8A715C] dark:text-[#C8A889]">{s.expected_risk}</span>
                  </div>
                  <h3 className="font-bold text-[#2C1A0E] dark:text-[#F9EBD5] text-sm tracking-wide">{s.title}</h3>
                  <p className="text-xs text-[#6E5745] dark:text-[#C8A889] leading-relaxed font-sans">{s.description}</p>
                </div>

                <Button
                  onClick={() => handleRunDemo(s.id)}
                  disabled={!!runningId}
                  className="w-full gap-2 text-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{runningId === s.id ? 'Running Demo Pipeline...' : `Run ${s.title}`}</span>
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
};
