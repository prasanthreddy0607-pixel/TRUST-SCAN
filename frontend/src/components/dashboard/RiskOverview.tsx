import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ScreeningRecord } from '../../types/screening';

interface RiskOverviewProps {
  screenings: ScreeningRecord[];
}

export const RiskOverview: React.FC<RiskOverviewProps> = ({ screenings }) => {
  let lowCount = 0;
  let mediumCount = 0;
  let highCount = 0;

  screenings.forEach(s => {
    const level = s.risk_assessment?.risk_level || 'LOW';
    if (level === 'HIGH') highCount++;
    else if (level === 'MEDIUM') mediumCount++;
    else lowCount++;
  });

  const data = [
    { name: 'Low Risk', value: lowCount, color: '#10b981' },
    { name: 'Medium Risk', value: mediumCount, color: '#f59e0b' },
    { name: 'High Risk', value: highCount, color: '#ef4444' },
  ];

  return (
    <div className="glass-panel p-5 flex flex-col h-full">
      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm tracking-wide">Risk Assessment Distribution</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Inspection breakdown by evidence severity level</p>

      <div className="flex-1 min-h-[220px] w-full flex items-center justify-center">
        {screenings.length === 0 ? (
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400">No data available for chart visualization</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
