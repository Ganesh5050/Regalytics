import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon: LucideIcon;
  color?: "primary" | "success" | "warning" | "destructive";
  className?: string;
}

export function KPICard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  icon: Icon, 
  color = "primary",
  className 
}: KPICardProps) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary border-primary/20",
    success: "bg-success/10 text-success border-success/20", 
    warning: "bg-warning/10 text-warning border-warning/20",
    destructive: "bg-destructive/10 text-destructive border-destructive/20",
  };

  return (
    <Card className={cn("glass-card hover:shadow-medium transition-all duration-300 border-border/50", className)}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1 sm:space-y-2 min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide truncate">
              {title}
            </p>
            <div className="space-y-1">
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                {value}
              </p>
              {subtitle && (
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  {subtitle}
                </p>
              )}
              {trend && (
                <div className="flex items-center gap-1">
                  <span className={cn(
                    "text-xs font-medium",
                    trend.isPositive ? "text-success" : "text-destructive"
                  )}>
                    {trend.isPositive ? "+" : ""}{trend.value}
                  </span>
                  <span className="text-xs text-muted-foreground hidden sm:inline">vs last month</span>
                </div>
              )}
            </div>
          </div>
          <div className={cn(
            "flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl border flex-shrink-0",
            colorClasses[color]
          )}>
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}