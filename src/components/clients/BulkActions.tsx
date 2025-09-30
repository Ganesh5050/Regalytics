import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { 
  CheckSquare, 
  Square, 
  MoreHorizontal, 
  Download, 
  Upload, 
  Trash2, 
  Edit,
  AlertTriangle,
  FileText
} from "lucide-react";

interface BulkActionsProps {
  selectedClients: string[];
  onSelectAll: () => void;
  onClearSelection: () => void;
  onBulkAction: (action: string, clientIds: string[]) => void;
  totalClients: number;
}

export function BulkActions({ 
  selectedClients, 
  onSelectAll, 
  onClearSelection, 
  onBulkAction,
  totalClients 
}: BulkActionsProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const selectedCount = selectedClients.length;
  const isAllSelected = selectedCount === totalClients;
  const isPartiallySelected = selectedCount > 0 && selectedCount < totalClients;

  const handleSelectAll = () => {
    if (isAllSelected) {
      onClearSelection();
    } else {
      onSelectAll();
    }
  };

  const handleBulkAction = (action: string) => {
    onBulkAction(action, selectedClients);
    setIsDropdownOpen(false);
  };

  const bulkActions = [
    {
      label: "Export Selected",
      icon: Download,
      action: "export",
      description: "Download client data"
    },
    {
      label: "Update KYC Status",
      icon: Edit,
      action: "update_kyc",
      description: "Bulk KYC updates"
    },
    {
      label: "Risk Assessment",
      icon: AlertTriangle,
      action: "risk_assessment",
      description: "Run risk analysis"
    },
    {
      label: "Generate Reports",
      icon: FileText,
      action: "generate_reports",
      description: "Create client reports"
    },
    {
      label: "Archive Clients",
      icon: Trash2,
      action: "archive",
      description: "Move to archive",
      variant: "destructive" as const
    }
  ];

  if (selectedCount === 0) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSelectAll}
          className="h-8 w-8 p-0"
        >
          {isAllSelected ? (
            <CheckSquare className="h-4 w-4" />
          ) : (
            <Square className="h-4 w-4" />
          )}
        </Button>
        <span className="text-sm text-muted-foreground">
          {isAllSelected ? "All selected" : "Select all"}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSelectAll}
          className="h-8 w-8 p-0"
        >
          {isAllSelected ? (
            <CheckSquare className="h-4 w-4" />
          ) : isPartiallySelected ? (
            <div className="h-4 w-4 border-2 border-primary bg-primary/20 rounded-sm" />
          ) : (
            <Square className="h-4 w-4" />
          )}
        </Button>
        <Badge variant="secondary" className="text-xs">
          {selectedCount} selected
        </Badge>
      </div>

      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4 mr-2" />
            Bulk Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="glass-card w-56">
          {bulkActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <DropdownMenuItem
                key={index}
                className={`hover:bg-accent/50 transition-micro ${
                  action.variant === 'destructive' ? 'text-destructive focus:text-destructive' : ''
                }`}
                onClick={() => handleBulkAction(action.action)}
              >
                <Icon className="h-4 w-4 mr-2" />
                <div className="flex flex-col">
                  <span className="font-medium">{action.label}</span>
                  <span className="text-xs text-muted-foreground">{action.description}</span>
                </div>
              </DropdownMenuItem>
            );
          })}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="hover:bg-accent/50 transition-micro text-muted-foreground"
            onClick={onClearSelection}
          >
            <Square className="h-4 w-4 mr-2" />
            Clear Selection
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
