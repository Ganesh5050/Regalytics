import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Phone, 
  Mail, 
  Calendar, 
  Star,
  DollarSign,
  User,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  score: number;
  value: number;
  assignedTo: string;
  createdAt: string;
  lastContact: string;
  notes: string;
  tags: string[];
}

interface LeadPipelineProps {
  leads: Lead[];
  onUpdateLead: (lead: Lead) => void;
  onViewLead: (lead: Lead) => void;
}

const pipelineStages = [
  { id: 'new', name: 'New', color: 'bg-blue-100 text-blue-800' },
  { id: 'contacted', name: 'Contacted', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'qualified', name: 'Qualified', color: 'bg-green-100 text-green-800' },
  { id: 'proposal', name: 'Proposal', color: 'bg-purple-100 text-purple-800' },
  { id: 'negotiation', name: 'Negotiation', color: 'bg-orange-100 text-orange-800' },
  { id: 'closed-won', name: 'Closed Won', color: 'bg-emerald-100 text-emerald-800' },
  { id: 'closed-lost', name: 'Closed Lost', color: 'bg-red-100 text-red-800' }
];

export function LeadPipeline({ leads, onUpdateLead, onViewLead }: LeadPipelineProps) {
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);

  const getLeadsByStatus = (status: string) => {
    return leads.filter(lead => lead.status === status);
  };

  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
    setDraggedLead(lead);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (draggedLead && draggedLead.status !== newStatus) {
      const updatedLead = { ...draggedLead, status: newStatus as any };
      onUpdateLead(updatedLead);
    }
    setDraggedLead(null);
  };

  const getStageValue = (status: string) => {
    return getLeadsByStatus(status).reduce((sum, lead) => sum + lead.value, 0);
  };

  const getStageCount = (status: string) => {
    return getLeadsByStatus(status).length;
  };

  return (
    <div className="space-y-6">
      {/* Pipeline Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Pipeline Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {pipelineStages.map((stage) => (
              <div key={stage.id} className="text-center">
                <div className="text-2xl font-bold">{getStageCount(stage.id)}</div>
                <div className="text-sm text-muted-foreground">{stage.name}</div>
                <div className="text-xs text-muted-foreground">
                  ${getStageValue(stage.id).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Stages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {pipelineStages.map((stage) => (
          <Card key={stage.id} className="min-h-[400px]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{stage.name}</CardTitle>
                <Badge className={stage.color}>
                  {getStageCount(stage.id)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent
              className="space-y-3"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              {getLeadsByStatus(stage.id).map((lead) => (
                <div
                  key={lead.id}
                  className="p-3 border rounded-lg bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  draggable
                  onDragStart={(e) => handleDragStart(e, lead)}
                  onClick={() => onViewLead(lead)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{lead.name}</h4>
                      <p className="text-xs text-muted-foreground">{lead.company}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewLead(lead)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" />
                        <span>{lead.score}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-3 w-3 text-green-500 mr-1" />
                        <span>${lead.value.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-xs text-muted-foreground">
                      <User className="h-3 w-3 mr-1" />
                      <span>{lead.assignedTo}</span>
                    </div>
                    
                    {lead.tags && lead.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {lead.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                            {tag}
                          </Badge>
                        ))}
                        {lead.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            +{lead.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {getLeadsByStatus(stage.id).length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-8">
                  No leads in this stage
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pipeline Instructions */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>💡 <strong>Tip:</strong> Drag and drop leads between stages to update their status</p>
            <p>Click on any lead card to view detailed information</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
