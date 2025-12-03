import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartCard } from './ChartCard';

const transactionData = [
  { name: 'Mon', amount: 2400000, count: 45 },
  { name: 'Tue', amount: 3200000, count: 62 },
  { name: 'Wed', amount: 2800000, count: 58 },
  { name: 'Thu', amount: 4100000, count: 78 },
  { name: 'Fri', amount: 3600000, count: 71 },
  { name: 'Sat', amount: 1900000, count: 35 },
  { name: 'Sun', amount: 1500000, count: 28 },
];

export function TransactionChart() {
  const formatCurrency = (value: number) => {
    return `₹${(value / 100000).toFixed(1)}L`;
  };

  const formatTooltip = (value: number, name: string) => {
    if (name === 'amount') {
      return [formatCurrency(value), 'Amount'];
    }
    return [value, 'Count'];
  };

  return (
    <ChartCard
      title="Transaction Trends"
      description="Daily transaction volume and count over the past week"
      trend={{ value: "12%", isPositive: true }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={transactionData}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="name" 
            className="text-xs"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            yAxisId="amount"
            orientation="left"
            className="text-xs"
            tick={{ fontSize: 12 }}
            tickFormatter={formatCurrency}
          />
          <YAxis 
            yAxisId="count"
            orientation="right"
            className="text-xs"
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={formatTooltip}
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--foreground))'
            }}
          />
          <Line 
            yAxisId="amount"
            type="monotone" 
            dataKey="amount" 
            stroke="hsl(var(--primary))" 
            strokeWidth={3}
            dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
          />
          <Line 
            yAxisId="count"
            type="monotone" 
            dataKey="count" 
            stroke="hsl(var(--success))" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, stroke: 'hsl(var(--success))', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
