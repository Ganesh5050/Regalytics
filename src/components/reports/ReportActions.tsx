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
  Download, 
  Eye, 
  Trash2, 
  RefreshCw,
  Calendar,
  FileText,
  Share,
  Archive
} from "lucide-react";

interface Report {
  id: string;
  name: string;
  description: string;
  type: string;
  format: string;
  size: string;
  generated: string;
  status: string;
  downloads: number;
}

interface ReportActionsProps {
  report: Report;
  onDownload: (reportId: string) => void;
  onView: (report: Report) => void;
  onRegenerate: (reportId: string) => void;
  onDelete: (reportId: string) => void;
  onSchedule: (report: Report) => void;
  onShare: (report: Report) => void;
}

export function ReportActions({ 
  report, 
  onDownload, 
  onView, 
  onRegenerate, 
  onDelete, 
  onSchedule,
  onShare 
}: ReportActionsProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleAction = (action: string) => {
    switch (action) {
      case 'download':
        onDownload(report.id);
        break;
      case 'view':
        onView(report);
        break;
      case 'regenerate':
        onRegenerate(report.id);
        break;
      case 'delete':
        onDelete(report.id);
        break;
      case 'schedule':
        onSchedule(report);
        break;
      case 'share':
        onShare(report);
        break;
    }
    setIsDropdownOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready': return 'success';
      case 'Generating': return 'warning';
      case 'Failed': return 'destructive';
      case 'Scheduled': return 'secondary';
      default: return 'outline';
    }
  };

  const statusColor = getStatusColor(report.status);

  return (
    <div className="flex items-center gap-2">
      {/* Quick Actions */}
      <div className="flex gap-1">
        {report.status === 'Ready' && (
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 p-0 border-border/50 hover:bg-accent/50"
            onClick={() => handleAction('download')}
            title="Download Report"
          >
            <Download className="h-3 w-3" />
          </Button>
        )}
        
        <Button
          variant="outline"
          size="sm"
          className="h-7 w-7 p-0 border-border/50 hover:bg-accent/50"
          onClick={() => handleAction('view')}
          title="View Report"
        >
          <Eye className="h-3 w-3" />
        </Button>

        {report.status === 'Failed' && (
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 p-0 border-border/50 hover:bg-accent/50"
            onClick={() => handleAction('regenerate')}
            title="Regenerate Report"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        )}
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
            onClick={() => handleAction('view')}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </DropdownMenuItem>
          
          {report.status === 'Ready' && (
            <DropdownMenuItem 
              className="hover:bg-accent/50 transition-micro"
              onClick={() => handleAction('download')}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem 
            className="hover:bg-accent/50 transition-micro"
            onClick={() => handleAction('share')}
          >
            <Share className="h-4 w-4 mr-2" />
            Share Report
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            className="hover:bg-accent/50 transition-micro"
            onClick={() => handleAction('schedule')}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Report
          </DropdownMenuItem>
          
          {report.status === 'Failed' && (
            <DropdownMenuItem 
              className="hover:bg-accent/50 transition-micro"
              onClick={() => handleAction('regenerate')}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem 
            className="hover:bg-accent/50 transition-micro"
            onClick={() => handleAction('archive')}
          >
            <Archive className="h-4 w-4 mr-2" />
            Archive
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            className="hover:bg-accent/50 transition-micro text-destructive focus:text-destructive"
            onClick={() => handleAction('delete')}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Status Badge */}
      <Badge variant={statusColor as any} className="text-xs">
        {report.status}
      </Badge>
    </div>
  );
}
