import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Receipt, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";

interface TransactionStatsProps {
  transactions: any[];
}

export function TransactionStats({ transactions }: TransactionStatsProps) {
  const totalTransactions = transactions.length;
  const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0);
  const flaggedTransactions = transactions.filter(t => t.suspicious).length;
  const clearedTransactions = transactions.filter(t => t.status === 'Cleared').length;
  const pendingTransactions = transactions.filter(t => t.status === 'Pending').length;
  const averageAmount = totalVolume / totalTransactions;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatShortAmount = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
  };

  const stats = [
    {
      title: "Total Volume",
      value: formatShortAmount(totalVolume),
      subtitle: `${totalTransactions} transactions`,
      icon: DollarSign,
      color: "primary",
      trend: { value: "12%", isPositive: true }
    },
    {
      title: "Total Transactions",
      value: totalTransactions.toString(),
      subtitle: "All time",
      icon: Receipt,
      color: "success",
      trend: { value: "8%", isPositive: true }
    },
    {
      title: "Flagged Transactions",
      value: flaggedTransactions.toString(),
      subtitle: "Requiring review",
      icon: AlertTriangle,
      color: "destructive",
      trend: { value: "5%", isPositive: false }
    },
    {
      title: "Cleared Transactions",
      value: clearedTransactions.toString(),
      subtitle: `${((clearedTransactions / totalTransactions) * 100).toFixed(1)}% success rate`,
      icon: CheckCircle,
      color: "success",
      trend: { value: "2%", isPositive: true }
    },
    {
      title: "Pending Transactions",
      value: pendingTransactions.toString(),
      subtitle: "Awaiting processing",
      icon: Clock,
      color: "warning",
      trend: { value: "3%", isPositive: false }
    },
    {
      title: "Average Amount",
      value: formatShortAmount(averageAmount),
      subtitle: "Per transaction",
      icon: TrendingUp,
      color: "accent",
      trend: { value: "1%", isPositive: true }
    }
  ];

  const getIconColor = (color: string) => {
    switch (color) {
      case 'primary': return 'text-primary';
      case 'success': return 'text-success';
      case 'destructive': return 'text-destructive';
      case 'warning': return 'text-warning';
      case 'accent': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };

  const getBgColor = (color: string) => {
    switch (color) {
      case 'primary': return 'bg-primary/10';
      case 'success': return 'bg-success/10';
      case 'destructive': return 'bg-destructive/10';
      case 'warning': return 'bg-warning/10';
      case 'accent': return 'bg-accent/10';
      default: return 'bg-muted/10';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="glass-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                  {stat.trend && (
                    <div className="flex items-center gap-1">
                      <Badge 
                        variant={stat.trend.isPositive ? "outline" : "secondary"}
                        className="text-xs"
                      >
                        {stat.trend.isPositive ? "+" : ""}{stat.trend.value}
                      </Badge>
                    </div>
                  )}
                </div>
                <div className={`w-12 h-12 ${getBgColor(stat.color)} rounded-lg flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 ${getIconColor(stat.color)}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
