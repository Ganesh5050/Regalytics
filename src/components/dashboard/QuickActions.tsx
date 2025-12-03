import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Download, 
  AlertTriangle, 
  Users, 
  TrendingUp, 
  Shield,
  Plus,
  Filter
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/hooks/useNotifications";
import { ReportGenerator } from "@/components/reports/ReportGenerator";
import { ClientFormModal } from "@/components/clients/ClientFormModal";
import { AlertFormModal } from "@/components/alerts/AlertFormModal";
import { RiskAssessmentModal } from "@/components/risk/RiskAssessmentModal";
import { AdvancedFilterModal } from "@/components/filters/AdvancedFilterModal";

export function QuickActions() {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [showReportGenerator, setShowReportGenerator] = useState(false);
  const [showClientForm, setShowClientForm] = useState(false);
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [showRiskAssessment, setShowRiskAssessment] = useState(false);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

  const quickActions = [
    {
      title: "Generate Report",
      description: "Create compliance report",
      icon: FileText,
      color: "primary",
      action: () => setShowReportGenerator(true)
    },
    {
      title: "Export Data",
      description: "Download client data",
      icon: Download,
      color: "success",
      action: () => handleExportData()
    },
    {
      title: "New Alert",
      description: "Create manual alert",
      icon: AlertTriangle,
      color: "warning",
      action: () => setShowAlertForm(true)
    },
    {
      title: "Add Client",
      description: "Register new client",
      icon: Plus,
      color: "accent",
      action: () => setShowClientForm(true)
    },
    {
      title: "Risk Assessment",
      description: "Run risk analysis",
      icon: Shield,
      color: "destructive",
      action: () => setShowRiskAssessment(true)
    },
    {
      title: "Advanced Filter",
      description: "Apply complex filters",
      icon: Filter,
      color: "secondary",
      action: () => setShowAdvancedFilter(true)
    }
  ];

  const handleExportData = async () => {
    try {
      // Simulate data export
      const exportData = {
        clients: [
          { id: "CLI001", name: "Rajesh Industries Pvt Ltd", pan: "ABCDE1234F", riskScore: 85 },
          { id: "CLI002", name: "Mumbai Trading Co.", pan: "FGHIJ5678K", riskScore: 92 },
          { id: "CLI003", name: "Tech Solutions Pvt Ltd", pan: "KLMNO9012P", riskScore: 67 },
          { id: "CLI004", name: "Global Exports Limited", pan: "QRSTU3456V", riskScore: 78 }
        ],
        transactions: [
          { id: "TXN001", amount: 50000, type: "Credit", status: "Completed" },
          { id: "TXN002", amount: 25000, type: "Debit", status: "Pending" },
          { id: "TXN003", amount: 75000, type: "Credit", status: "Completed" }
        ],
        alerts: [
          { id: "ALT001", type: "HIGH", message: "Suspicious transaction detected", status: "Active" },
          { id: "ALT002", type: "MEDIUM", message: "KYC document expired", status: "Resolved" }
        ],
        exportedAt: new Date().toISOString(),
        exportedBy: "System Admin"
      };

      // Create and download JSON file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `regalytics-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      addNotification({
        type: "success",
        title: "Export Successful",
        message: "Data has been exported successfully"
      });
    } catch (error) {
      addNotification({
        type: "error",
        title: "Export Failed",
        message: "Failed to export data. Please try again."
      });
    }
  };

  const getButtonVariant = (color: string) => {
    switch (color) {
      case 'primary': return 'default';
      case 'success': return 'default';
      case 'warning': return 'default';
      case 'destructive': return 'destructive';
      case 'secondary': return 'secondary';
      default: return 'outline';
    }
  };

  const getButtonClass = (color: string) => {
    switch (color) {
      case 'primary': return 'bg-primary hover:bg-primary-hover text-primary-foreground';
      case 'success': return 'bg-success hover:bg-success/90 text-success-foreground';
      case 'warning': return 'bg-warning hover:bg-warning/90 text-warning-foreground';
      case 'destructive': return 'bg-destructive hover:bg-destructive/90 text-destructive-foreground';
      case 'secondary': return 'bg-secondary hover:bg-secondary/80 text-secondary-foreground';
      default: return 'bg-accent hover:bg-accent/80 text-accent-foreground';
    }
  };

  return (
    <>
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant={getButtonVariant(action.color)}
                  className={`h-auto p-4 flex flex-col items-center gap-2 ${getButtonClass(action.color)}`}
                  onClick={action.action}
                >
                  <Icon className="h-5 w-5" />
                  <div className="text-center">
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className="text-xs opacity-80">{action.description}</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {showReportGenerator && (
        <ReportGenerator 
          isOpen={showReportGenerator} 
          onClose={() => setShowReportGenerator(false)} 
        />
      )}
      
      {showClientForm && (
        <ClientFormModal 
          isOpen={showClientForm} 
          onClose={() => setShowClientForm(false)} 
        />
      )}
      
      {showAlertForm && (
        <AlertFormModal 
          isOpen={showAlertForm} 
          onClose={() => setShowAlertForm(false)} 
        />
      )}
      
      {showRiskAssessment && (
        <RiskAssessmentModal 
          isOpen={showRiskAssessment} 
          onClose={() => setShowRiskAssessment(false)} 
        />
      )}
      
      {showAdvancedFilter && (
        <AdvancedFilterModal 
          isOpen={showAdvancedFilter} 
          onClose={() => setShowAdvancedFilter(false)} 
        />
      )}
    </>
  );
}
