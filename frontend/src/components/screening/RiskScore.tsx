import React from 'react';
import { RiskAssessmentResult } from '../../types/risk';
import { ShieldAlert, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Badge } from '../common/Badge';
import { getRiskColor } from '../../utils/risk';

interface RiskScoreProps {
  assessment?: RiskAssessmentResult;
}

export const RiskScore: React.FC<RiskScoreProps> = ({ assessment }) => {
  if (!assessment) return null;

  const { risk_score, risk_level, confidence, recommendation, signal_scores } = assessment;
  const color = getRiskColor(risk_level);

  let icon = <CheckCircle className="w-6 h-6 text-emerald-400" />;
  if (risk_level === 'MEDIUM') icon = <AlertTriangle className="w-6 h-6 text-amber-400" />;
  if (risk_level === 'HIGH') icon = <ShieldAlert className="w-6 h-6 text-red-400" />;

  return (
    <div className="glass-panel p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-navy-950 border border-slate-300 dark:border-slate-800">
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base tracking-wide">Screening Risk Score</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Automated multi-engine risk evaluation</p>
          </div>
        </div>
        <Badge label={`${risk_level} RISK`} variant={risk_level.toLowerCase() as 'low' | 'medium' | 'high'} className="text-sm px-3 py-1" />
      </div>

      {/* Main Score & Recommendation */}
      <div className="grid grid-cols-3 gap-4 text-center bg-slate-50 dark:bg-navy-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80">
        <div>
          <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400 uppercase">Risk Score</p>
          <p className="text-3xl font-extrabold mt-1 font-mono" style={{ color }}>
            {risk_score}<span className="text-sm text-slate-600 dark:text-slate-500 font-normal">/100</span>
          </p>
        </div>
        <div>
          <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400 uppercase">Analysis Confidence</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1.5 font-mono">
            {Math.round(confidence * 100)}%
          </p>
        </div>
        <div>
          <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400 uppercase">Recommendation</p>
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-2 font-mono uppercase bg-slate-200/80 dark:bg-slate-800/80 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 truncate">
            {recommendation.replace(/_/g, ' ')}
          </p>
        </div>
      </div>

      {/* Weighted Signal Score Breakdown */}
      {signal_scores && (
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#34A99D]" />
            <span>Weighted Signal Component Breakdown</span>
          </h4>
          <div className="space-y-2.5 text-xs">
            {Object.entries(signal_scores).map(([key, val]) => {
              const label = key.replace(/_/g, ' ').toUpperCase();
              const percent = Math.min(100, Math.max(0, val));
              let barColor = 'bg-emerald-500';
              if (percent >= 60) barColor = 'bg-red-500';
              else if (percent >= 30) barColor = 'bg-amber-500';

              return (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-slate-700 dark:text-slate-300">{label}</span>
                    <span className="text-slate-600 dark:text-slate-400 font-bold">{val} / 100</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${barColor} transition-all duration-500 rounded-full`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
