import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ChartCard } from './ChartCard';

const riskData = [
  { name: 'Low Risk', value: 45, color: 'hsl(var(--success))' },
  { name: 'Medium Risk', value: 35, color: 'hsl(var(--warning))' },
  { name: 'High Risk', value: 20, color: 'hsl(var(--destructive))' },
];

export function RiskDistributionChart() {
  const formatTooltip = (value: number, name: string) => {
    return [`${value}%`, name];
  };

  return (
    <ChartCard
      title="Risk Distribution"
      description="Client risk profile breakdown"
      trend={{ value: "3%", isPositive: false }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={riskData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {riskData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={formatTooltip}
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--foreground))'
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => <span className="text-sm">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
