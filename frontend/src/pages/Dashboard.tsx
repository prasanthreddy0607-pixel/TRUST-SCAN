import React, { useEffect, useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { StatCard } from '../components/dashboard/StatCard';
import { RecentScreenings } from '../components/dashboard/RecentScreenings';
import { RiskOverview } from '../components/dashboard/RiskOverview';
import { screeningApi } from '../services/screeningApi';
import { ScreeningRecord } from '../types/screening';
import { ShieldCheck, ShieldAlert, AlertTriangle, Clock, Plus, Sparkles } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [screenings, setScreenings] = useState<ScreeningRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await screeningApi.listHistory(50);
        setScreenings(data);
      } catch (e) {
        console.error("Failed to load dashboard screenings:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const totalCount = screenings.length;
  const highRiskCount = screenings.filter(s => s.risk_assessment?.risk_level === 'HIGH').length;
  const reviewRequiredCount = screenings.filter(s => s.risk_assessment?.recommendation !== 'ACCEPTABLE').length;
  const avgTimeMs = totalCount > 0 
    ? Math.round(screenings.reduce((acc, curr) => acc + (curr.processing_time_ms || 450), 0) / totalCount)
    : 450;

  return (
    <PageContainer>
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
            Officer Operations Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            Real-time border checkpoint screening statistics & inspection logs
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="secondary" onClick={() => navigate('/demo-mode')} className="gap-2 text-xs">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Preset Demos</span>
          </Button>

          <Button onClick={() => navigate('/screen/new')} className="gap-2 text-xs">
            <Plus className="w-4 h-4" />
            <span>New Screening</span>
          </Button>
        </div>
      </div>

      {/* Metric Stat Cards (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Screened"
          value={totalCount}
          subtitle="Processed inspections"
          icon={ShieldCheck}
          color="blue"
        />
        <StatCard
          title="Review Required"
          value={reviewRequiredCount}
          subtitle="Flagged for manual review"
          icon={AlertTriangle}
          color="amber"
        />
        <StatCard
          title="High Risk Detected"
          value={highRiskCount}
          subtitle="High anomaly findings"
          icon={ShieldAlert}
          color="red"
        />
        <StatCard
          title="Avg Process Time"
          value={`${avgTimeMs} ms`}
          subtitle="Per screening pipeline"
          icon={Clock}
          color="emerald"
        />
      </div>

      {/* Middle Section: Chart & Recent Screenings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <RiskOverview screenings={screenings} />
        </div>
        <div className="lg:col-span-2">
          <RecentScreenings screenings={screenings} />
        </div>
      </div>
    </PageContainer>
  );
};
