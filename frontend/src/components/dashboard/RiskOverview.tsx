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
    { name: 'Low Risk', value: lowCount, color: '#2E7D5E' },
    { name: 'Medium Risk', value: mediumCount, color: '#B87322' },
    { name: 'High Risk', value: highCount, color: '#C0392B' },
  ];

  return (
    <div className="glass-panel p-5 flex flex-col h-full">
      <h3 className="font-bold text-[#2C1A0E] dark:text-[#F9EBD5] text-sm tracking-wide">Risk Assessment Distribution</h3>
      <p className="text-xs text-[#8A715C] dark:text-[#C8A889] mb-4">Inspection breakdown by evidence severity level</p>

      <div className="flex-1 min-h-[220px] w-full flex items-center justify-center">
        {screenings.length === 0 ? (
          <p className="text-xs font-mono text-[#8A715C] dark:text-[#C8A889]">No data available for chart visualization</p>
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
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#281B12" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#281B12', borderColor: '#4A3324', borderRadius: '8px', fontSize: '12px' }}
                itemStyle={{ color: '#F9EBD5' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#C8A889' }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
