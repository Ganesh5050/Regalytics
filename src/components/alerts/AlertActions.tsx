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
  MoreHorizontal, 
  CheckCircle, 
  Clock, 
  User, 
  Flag,
  Archive,
  Edit,
  Eye,
  AlertTriangle
} from "lucide-react";

interface Alert {
  id: string;
  severity: string;
  title: string;
  description: string;
  client: string;
  amount: string;
  timestamp: string;
  status: string;
  assignedTo: string;
  riskScore: number;
}

interface AlertActionsProps {
  alert: Alert;
  onStatusChange: (alertId: string, newStatus: string) => void;
  onAssign: (alertId: string, assignee: string) => void;
  onView: (alert: Alert) => void;
  onEdit: (alert: Alert) => void;
}

export function AlertActions({ alert, onStatusChange, onAssign, onView, onEdit }: AlertActionsProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleStatusChange = (newStatus: string) => {
    onStatusChange(alert.id, newStatus);
    setIsDropdownOpen(false);
  };

  const handleAssign = (assignee: string) => {
    onAssign(alert.id, assignee);
    setIsDropdownOpen(false);
  };

  const statusOptions = [
    { value: 'Open', label: 'Mark as Open', icon: AlertTriangle, color: 'destructive' },
    { value: 'Investigating', label: 'Start Investigation', icon: Clock, color: 'warning' },
    { value: 'Resolved', label: 'Mark as Resolved', icon: CheckCircle, color: 'success' },
    { value: 'Closed', label: 'Close Alert', icon: Archive, color: 'secondary' }
  ];

  const assigneeOptions = [
    'Sarah Johnson',
    'Mike Wilson', 
    'Emily Davis',
    'David Chen',
    'Lisa Rodriguez',
    'Unassigned'
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open': return AlertTriangle;
      case 'Investigating': return Clock;
      case 'Resolved': return CheckCircle;
      case 'Closed': return Archive;
      default: return Flag;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'destructive';
      case 'Investigating': return 'warning';
      case 'Resolved': return 'success';
      case 'Closed': return 'secondary';
      default: return 'outline';
    }
  };

  const StatusIcon = getStatusIcon(alert.status);
  const statusColor = getStatusColor(alert.status);

  return (
    <div className="flex items-center gap-2">
      {/* Quick Status Actions */}
      <div className="flex gap-1">
        {statusOptions.map((option) => {
          const OptionIcon = option.icon;
          const isCurrentStatus = alert.status === option.value;
          
          return (
            <Button
              key={option.value}
              variant={isCurrentStatus ? "default" : "outline"}
              size="sm"
              className={`h-7 w-7 p-0 ${
                isCurrentStatus 
                  ? `bg-${option.color} hover:bg-${option.color}/90 text-${option.color}-foreground`
                  : 'border-border/50 hover:bg-accent/50'
              }`}
              onClick={() => handleStatusChange(option.value)}
              title={option.label}
            >
              <OptionIcon className="h-3 w-3" />
            </Button>
          );
        })}
      </div>

      {/* More Actions Dropdown */}
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-7 w-7 p-0 border-border/50">
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="glass-card w-48">
          <DropdownMenuItem 
            className="hover:bg-accent/50 transition-micro"
            onClick={() => onView(alert)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="hover:bg-accent/50 transition-micro"
            onClick={() => onEdit(alert)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Alert
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <div className="px-2 py-1">
            <div className="text-xs font-medium text-muted-foreground mb-1">Assign To</div>
            {assigneeOptions.map((assignee) => (
              <DropdownMenuItem
                key={assignee}
                className="hover:bg-accent/50 transition-micro text-xs"
                onClick={() => handleAssign(assignee)}
              >
                <User className="h-3 w-3 mr-2" />
                {assignee}
              </DropdownMenuItem>
            ))}
          </div>
          
          <DropdownMenuSeparator />
          
          <div className="px-2 py-1">
            <div className="text-xs font-medium text-muted-foreground mb-1">Change Status</div>
            {statusOptions.map((option) => {
              const OptionIcon = option.icon;
              const isCurrentStatus = alert.status === option.value;
              
              return (
                <DropdownMenuItem
                  key={option.value}
                  className={`hover:bg-accent/50 transition-micro text-xs ${
                    isCurrentStatus ? 'bg-accent/20' : ''
                  }`}
                  onClick={() => handleStatusChange(option.value)}
                >
                  <OptionIcon className="h-3 w-3 mr-2" />
                  {option.label}
                  {isCurrentStatus && (
                    <Badge variant="outline" className="ml-auto text-xs">
                      Current
                    </Badge>
                  )}
                </DropdownMenuItem>
              );
            })}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
