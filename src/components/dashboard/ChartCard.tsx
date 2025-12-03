import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface ChartCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export function ChartCard({ title, description, children, trend, className }: ChartCardProps) {
  return (
    <Card className={`glass-card border-border/50 ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-sm ${
              trend.isPositive ? 'text-success' : 'text-destructive'
            }`}>
              {trend.isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span className="font-medium">{trend.value}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
