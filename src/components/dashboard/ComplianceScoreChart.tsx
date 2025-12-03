import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartCard } from './ChartCard';

const complianceData = [
  { month: 'Jan', score: 98.2, target: 95 },
  { month: 'Feb', score: 97.8, target: 95 },
  { month: 'Mar', score: 98.5, target: 95 },
  { month: 'Apr', score: 99.1, target: 95 },
  { month: 'May', score: 98.7, target: 95 },
  { month: 'Jun', score: 99.3, target: 95 },
];

export function ComplianceScoreChart() {
  const formatScore = (value: number) => {
    return `${value}%`;
  };

  return (
    <ChartCard
      title="Compliance Score Trend"
      description="Monthly compliance performance vs target"
      trend={{ value: "1.1%", isPositive: true }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={complianceData}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="month" 
            className="text-xs"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            className="text-xs"
            tick={{ fontSize: 12 }}
            tickFormatter={formatScore}
            domain={[90, 100]}
          />
          <Tooltip 
            formatter={(value, name) => [
              formatScore(Number(value)), 
              name === 'score' ? 'Actual Score' : 'Target'
            ]}
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--foreground))'
            }}
          />
          <Bar 
            dataKey="target" 
            fill="hsl(var(--muted))" 
            radius={[2, 2, 0, 0]}
            opacity={0.6}
          />
          <Bar 
            dataKey="score" 
            fill="hsl(var(--success))" 
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
