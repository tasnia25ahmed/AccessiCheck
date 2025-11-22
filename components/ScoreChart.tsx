import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

interface ScoreChartProps {
  scoreString: string;
}

export const ScoreChart: React.FC<ScoreChartProps> = ({ scoreString }) => {
  const scoreValue = parseInt(scoreString.replace('%', ''), 10);
  const data = [{ name: 'Score', value: scoreValue, fill: scoreValue > 80 ? '#16a34a' : scoreValue > 50 ? '#ea580c' : '#dc2626' }];

  return (
    <div className="w-full h-64 relative flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart 
          innerRadius="70%" 
          outerRadius="100%" 
          barSize={20} 
          data={data} 
          startAngle={90} 
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar
            background
            dataKey="value"
            cornerRadius={30}
            label={false}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <span className="text-4xl font-bold text-gray-900">{scoreValue}%</span>
        <span className="text-sm text-gray-500 font-medium">Compliance</span>
      </div>
    </div>
  );
};
