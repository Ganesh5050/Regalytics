import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Phone, 
  Mail, 
  Calendar, 
  DollarSign,
  Target,
  User,
  MoreHorizontal,
  TrendingUp
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Deal {
  id: string;
  name: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  value: number;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability: number;
  expectedCloseDate: string;
  assignedTo: string;
  source: string;
  createdAt: string;
  lastActivity: string;
  notes: string;
  tags: string[];
  products: string[];
}

interface PipelineViewProps {
  deals: Deal[];
  onUpdateDeal: (deal: Deal) => void;
  onViewDeal: (deal: Deal) => void;
}

const pipelineStages = [
  { id: 'prospecting', name: 'Prospecting', color: 'bg-blue-100 text-blue-800' },
  { id: 'qualification', name: 'Qualification', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'proposal', name: 'Proposal', color: 'bg-green-100 text-green-800' },
  { id: 'negotiation', name: 'Negotiation', color: 'bg-orange-100 text-orange-800' },
  { id: 'closed-won', name: 'Closed Won', color: 'bg-emerald-100 text-emerald-800' },
  { id: 'closed-lost', name: 'Closed Lost', color: 'bg-red-100 text-red-800' }
];

export function PipelineView({ deals, onUpdateDeal, onViewDeal }: PipelineViewProps) {
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);

  const getDealsByStage = (stage: string) => {
    return deals.filter(deal => deal.stage === stage);
  };

  const handleDragStart = (e: React.DragEvent, deal: Deal) => {
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, newStage: string) => {
    e.preventDefault();
    if (draggedDeal && draggedDeal.stage !== newStage) {
      const updatedDeal = { ...draggedDeal, stage: newStage as any };
      onUpdateDeal(updatedDeal);
    }
    setDraggedDeal(null);
  };

  const getStageValue = (stage: string) => {
    return getDealsByStage(stage).reduce((sum, deal) => sum + deal.value, 0);
  };

  const getStageCount = (stage: string) => {
    return getDealsByStage(stage).length;
  };

  const getWeightedValue = (stage: string) => {
    return getDealsByStage(stage).reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0);
  };

  return (
    <div className="space-y-6">
      {/* Pipeline Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Pipeline Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {pipelineStages.map((stage) => (
              <div key={stage.id} className="text-center">
                <div className="text-2xl font-bold">{getStageCount(stage.id)}</div>
                <div className="text-sm text-muted-foreground">{stage.name}</div>
                <div className="text-xs text-muted-foreground">
                  ${getStageValue(stage.id).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  Weighted: ${Math.round(getWeightedValue(stage.id)).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Stages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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
              {getDealsByStage(stage.id).map((deal) => (
                <div
                  key={deal.id}
                  className="p-3 border rounded-lg bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  draggable
                  onDragStart={(e) => handleDragStart(e, deal)}
                  onClick={() => onViewDeal(deal)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{deal.name}</h4>
                      <p className="text-xs text-muted-foreground">{deal.company}</p>
                      <p className="text-xs text-muted-foreground">{deal.contact}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewDeal(deal)}>
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
                        <DollarSign className="h-3 w-3 text-green-500 mr-1" />
                        <span>${deal.value.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Target className="h-3 w-3 text-blue-500 mr-1" />
                        <span>{deal.probability}%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-xs text-muted-foreground">
                      <User className="h-3 w-3 mr-1" />
                      <span>{deal.assignedTo}</span>
                    </div>
                    
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>Close: {deal.expectedCloseDate}</span>
                    </div>
                    
                    {deal.tags && deal.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {deal.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                            {tag}
                          </Badge>
                        ))}
                        {deal.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            +{deal.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {getDealsByStage(stage.id).length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-8">
                  No deals in this stage
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
            <p>💡 <strong>Tip:</strong> Drag and drop deals between stages to update their status</p>
            <p>Click on any deal card to view detailed information</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
