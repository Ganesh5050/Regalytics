import { Users, Receipt, AlertTriangle, Shield, TrendingUp, Clock, RefreshCw } from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { useRealTimeData } from "@/hooks/useRealTimeData";
import { RealTimeIndicator } from "@/components/common/RealTimeIndicator";
import { TransactionChart } from "@/components/dashboard/TransactionChart";
import { RiskDistributionChart } from "@/components/dashboard/RiskDistributionChart";
import { ComplianceScoreChart } from "@/components/dashboard/ComplianceScoreChart";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { AdvancedCharts } from "@/components/dashboard/AdvancedCharts";
import { InteractiveDashboard } from "@/components/dashboard/InteractiveDashboard";
import { DataExplorer } from "@/components/dashboard/DataExplorer";
import { BackendConnectionTest } from "@/components/common/BackendConnectionTest";

const kpiData = [
  {
    title: "Total Clients",
    value: "2,847",
    subtitle: "Active KYC Records", 
    trend: { value: "12%", isPositive: true },
    icon: Users,
    color: "primary" as const
  },
  {
    title: "Transactions Today",
    value: "₹45.2M",
    subtitle: "1,234 transactions",
    trend: { value: "8%", isPositive: true },
    icon: Receipt,
    color: "success" as const
  },
  {
    title: "Active Alerts",
    value: "23",
    subtitle: "Requiring attention",
    trend: { value: "5%", isPositive: false },
    icon: AlertTriangle,
    color: "warning" as const
  },
  {
    title: "Compliance Score", 
    value: "98.2%",
    subtitle: "Above industry avg.",
    trend: { value: "2%", isPositive: true },
    icon: Shield,
    color: "success" as const
  }
];

const recentAlerts = [
  {
    id: "1",
    type: "HIGH",
    title: "Large Cash Deposit",
    client: "ABC Corp Limited",
    amount: "₹15,00,000",
    time: "2 mins ago",
    status: "pending"
  },
  {
    id: "2", 
    type: "MEDIUM",
    title: "Multiple Small Transactions",
    client: "John Smith",
    amount: "₹2,45,000",
    time: "15 mins ago",
    status: "investigating"
  },
  {
    id: "3",
    type: "LOW",
    title: "Incomplete KYC Documentation", 
    client: "Tech Solutions Pvt",
    amount: "-",
    time: "1 hour ago",
    status: "pending"
  }
];

const recentTransactions = [
  {
    id: "TXN001",
    client: "Rajesh Industries",
    type: "Credit",
    amount: "₹8,50,000",
    time: "10:30 AM",
    status: "cleared"
  },
  {
    id: "TXN002", 
    client: "Mumbai Traders",
    type: "Debit", 
    amount: "₹3,20,000",
    time: "10:15 AM", 
    status: "pending"
  },
  {
    id: "TXN003",
    client: "Global Exports Ltd",
    type: "Credit",
    amount: "₹12,00,000",
    time: "9:45 AM",
    status: "cleared"
  }
];

export default function Dashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const { addNotification } = useNotifications();
  const { isConnected, lastUpdate } = useRealTimeData();

  // Add a test notification on component mount
  useEffect(() => {
    addNotification({
      type: 'info',
      title: 'Dashboard Loaded',
      message: 'Welcome to the Compliance Dashboard'
    });
  }, [addNotification]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdated(new Date());
    setIsRefreshing(false);
    
    // Add a success notification
    addNotification({
      type: 'success',
      title: 'Data Refreshed',
      message: 'Dashboard data has been successfully updated'
    });
  };
  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
            Compliance Dashboard
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
            Monitor transactions, manage risk, and ensure regulatory compliance
          </p>
          <div className="flex items-center gap-2">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
            <RealTimeIndicator isConnected={isConnected} lastUpdate={lastUpdate} />
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-medium"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isRefreshing ? 'Refreshing...' : 'Refresh Data'}</span>
            <span className="sm:hidden">{isRefreshing ? '...' : 'Refresh'}</span>
          </Button>
              <Button 
                onClick={() => addNotification({
                  type: 'warning',
                  title: 'Test Alert',
                  message: 'This is a test notification to verify the system is working'
                })}
                className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-medium"
              >
            Test Notification
          </Button>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="advanced" className="text-xs sm:text-sm">Advanced</TabsTrigger>
          <TabsTrigger value="interactive" className="text-xs sm:text-sm">Interactive</TabsTrigger>
          <TabsTrigger value="explorer" className="text-xs sm:text-sm">Explorer</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {kpiData.map((kpi, index) => (
              <KPICard
                key={index}
                title={kpi.title}
                value={kpi.value}
                subtitle={kpi.subtitle}
                trend={kpi.trend}
                icon={kpi.icon}
                color={kpi.color}
                className="animate-fade-in"
              />
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            <TransactionChart />
            <RiskDistributionChart />
          </div>

          {/* Additional Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            <ComplianceScoreChart />
            <QuickActions />
          </div>

          {/* Backend Connection Test */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            <BackendConnectionTest />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Recent Alerts */}
            <Card className="glass-card border-border/50">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Recent Alerts
                </CardTitle>
                <CardDescription>
                  High-priority compliance notifications
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="border-border/50">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-micro">
                <div className="flex items-start gap-3">
                  <Badge 
                    variant={alert.type === "HIGH" ? "destructive" : alert.type === "MEDIUM" ? "secondary" : "outline"}
                    className="mt-1"
                  >
                    {alert.type}
                  </Badge>
                  <div className="space-y-1">
                    <p className="font-medium text-sm text-foreground">{alert.title}</p>
                    <p className="text-sm text-muted-foreground">{alert.client}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{alert.amount}</span>
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{alert.time}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {alert.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Recent Transactions
                </CardTitle>
                <CardDescription>
                  Latest transaction activity
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="border-border/50">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-micro">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm text-foreground">{transaction.client}</p>
                    <Badge variant="outline" className="text-xs">
                      {transaction.id}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={transaction.type === "Credit" ? "text-success" : "text-foreground"}>
                      {transaction.type}
                    </span>
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">{transaction.time}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm text-foreground">{transaction.amount}</p>
                  <Badge 
                    variant={transaction.status === "cleared" ? "outline" : "secondary"}
                    className="text-xs"
                  >
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
          </div>
        </TabsContent>

        <TabsContent value="advanced">
          <AdvancedCharts />
        </TabsContent>

        <TabsContent value="interactive">
          <InteractiveDashboard />
        </TabsContent>

        <TabsContent value="explorer">
          <DataExplorer />
        </TabsContent>
      </Tabs>
    </div>
  );
}