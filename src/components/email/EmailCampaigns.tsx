import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  Play, 
  Pause, 
  Square, 
  Edit, 
  Copy, 
  Trash2, 
  Send,
  Mail,
  Users,
  Calendar,
  BarChart3,
  MoreHorizontal,
  Eye,
  Target
} from "lucide-react";
import { CampaignFormModal } from "@/components/email/CampaignFormModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  templateId: string;
  status: 'draft' | 'scheduled' | 'running' | 'paused' | 'completed' | 'cancelled';
  type: 'newsletter' | 'promotional' | 'follow-up' | 'announcement' | 'other';
  targetAudience: string[];
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  openedCount: number;
  clickedCount: number;
  bouncedCount: number;
  unsubscribedCount: number;
}

const mockCampaigns: EmailCampaign[] = [
  {
    id: "1",
    name: "Q1 2024 Compliance Update",
    subject: "Important Compliance Updates for Q1 2024",
    templateId: "1",
    status: "completed",
    type: "announcement",
    targetAudience: ["all_clients", "enterprise_clients"],
    scheduledAt: "2024-01-15T09:00:00Z",
    startedAt: "2024-01-15T09:00:00Z",
    completedAt: "2024-01-15T10:30:00Z",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-15",
    createdBy: "Sarah Johnson",
    totalRecipients: 150,
    sentCount: 150,
    deliveredCount: 148,
    openedCount: 89,
    clickedCount: 23,
    bouncedCount: 2,
    unsubscribedCount: 1
  },
  {
    id: "2",
    name: "New Feature Launch - Risk Assessment",
    subject: "Introducing Our New Risk Assessment Tool",
    templateId: "2",
    status: "running",
    type: "promotional",
    targetAudience: ["prospects", "leads"],
    scheduledAt: "2024-01-20T10:00:00Z",
    startedAt: "2024-01-20T10:00:00Z",
    createdAt: "2024-01-18",
    updatedAt: "2024-01-20",
    createdBy: "Mike Chen",
    totalRecipients: 75,
    sentCount: 45,
    deliveredCount: 43,
    openedCount: 28,
    clickedCount: 8,
    bouncedCount: 2,
    unsubscribedCount: 0
  },
  {
    id: "3",
    name: "Monthly Newsletter - January",
    subject: "Regalytics Monthly Newsletter - January 2024",
    templateId: "3",
    status: "scheduled",
    type: "newsletter",
    targetAudience: ["all_subscribers"],
    scheduledAt: "2024-01-25T08:00:00Z",
    createdAt: "2024-01-22",
    updatedAt: "2024-01-22",
    createdBy: "Sarah Johnson",
    totalRecipients: 200,
    sentCount: 0,
    deliveredCount: 0,
    openedCount: 0,
    clickedCount: 0,
    bouncedCount: 0,
    unsubscribedCount: 0
  }
];

const statusColors = {
  'draft': 'bg-gray-100 text-gray-800',
  'scheduled': 'bg-blue-100 text-blue-800',
  'running': 'bg-green-100 text-green-800',
  'paused': 'bg-yellow-100 text-yellow-800',
  'completed': 'bg-emerald-100 text-emerald-800',
  'cancelled': 'bg-red-100 text-red-800'
};

const typeColors = {
  'newsletter': 'bg-blue-100 text-blue-800',
  'promotional': 'bg-purple-100 text-purple-800',
  'follow-up': 'bg-orange-100 text-orange-800',
  'announcement': 'bg-green-100 text-green-800',
  'other': 'bg-gray-100 text-gray-800'
};

export function EmailCampaigns() {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>(mockCampaigns);
  const [filteredCampaigns, setFilteredCampaigns] = useState<EmailCampaign[]>(mockCampaigns);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isCampaignFormOpen, setIsCampaignFormOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null);

  // Filter campaigns
  const filterCampaigns = () => {
    let filtered = campaigns;

    if (searchTerm) {
      filtered = filtered.filter(campaign =>
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(campaign => campaign.status === statusFilter);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(campaign => campaign.type === typeFilter);
    }

    setFilteredCampaigns(filtered);
  };

  // Apply filters when dependencies change
  React.useEffect(() => {
    filterCampaigns();
  }, [searchTerm, statusFilter, typeFilter, campaigns]);

  const handleAddCampaign = (newCampaign: Omit<EmailCampaign, 'id'>) => {
    const campaign: EmailCampaign = {
      ...newCampaign,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      sentCount: 0,
      deliveredCount: 0,
      openedCount: 0,
      clickedCount: 0,
      bouncedCount: 0,
      unsubscribedCount: 0
    };
    setCampaigns([...campaigns, campaign]);
  };

  const handleUpdateCampaign = (updatedCampaign: EmailCampaign) => {
    setCampaigns(campaigns.map(campaign => 
      campaign.id === updatedCampaign.id 
        ? { ...updatedCampaign, updatedAt: new Date().toISOString().split('T')[0] }
        : campaign
    ));
  };

  const handleEditCampaign = (campaign: EmailCampaign) => {
    setSelectedCampaign(campaign);
    setIsCampaignFormOpen(true);
  };

  const handleDuplicateCampaign = (campaign: EmailCampaign) => {
    const duplicatedCampaign: EmailCampaign = {
      ...campaign,
      id: Date.now().toString(),
      name: `${campaign.name} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      sentCount: 0,
      deliveredCount: 0,
      openedCount: 0,
      clickedCount: 0,
      bouncedCount: 0,
      unsubscribedCount: 0
    };
    setCampaigns([...campaigns, duplicatedCampaign]);
  };

  const handleDeleteCampaign = (campaignId: string) => {
    setCampaigns(campaigns.filter(campaign => campaign.id !== campaignId));
  };

  const handleStartCampaign = (campaign: EmailCampaign) => {
    handleUpdateCampaign({
      ...campaign,
      status: 'running',
      startedAt: new Date().toISOString()
    });
  };

  const handlePauseCampaign = (campaign: EmailCampaign) => {
    handleUpdateCampaign({
      ...campaign,
      status: 'paused'
    });
  };

  const handleStopCampaign = (campaign: EmailCampaign) => {
    handleUpdateCampaign({
      ...campaign,
      status: 'cancelled'
    });
  };

  const getStatusCount = (status: string) => {
    return campaigns.filter(campaign => campaign.status === status).length;
  };

  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter(campaign => ['running', 'scheduled'].includes(campaign.status)).length;
  const totalRecipients = campaigns.reduce((sum, campaign) => sum + campaign.totalRecipients, 0);
  const totalSent = campaigns.reduce((sum, campaign) => sum + campaign.sentCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Email Campaigns</h2>
          <p className="text-muted-foreground">
            Create and manage email marketing campaigns
          </p>
        </div>
        <Button onClick={() => setIsCampaignFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCampaigns}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCampaigns}</div>
            <p className="text-xs text-muted-foreground">
              {((activeCampaigns / totalCampaigns) * 100).toFixed(0)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recipients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRecipients}</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSent}</div>
            <p className="text-xs text-muted-foreground">
              +22% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Campaigns</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="running">Running</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <Input
                    placeholder="Search campaigns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="running">Running</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                    <SelectItem value="promotional">Promotional</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Campaigns List */}
          <Card>
            <CardHeader>
              <CardTitle>Campaigns ({filteredCampaigns.length})</CardTitle>
              <CardDescription>
                Manage your email marketing campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="p-4 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium">{campaign.name}</h4>
                          <Badge className={statusColors[campaign.status]}>
                            {campaign.status}
                          </Badge>
                          <Badge className={typeColors[campaign.type]}>
                            {campaign.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{campaign.subject}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-muted-foreground mb-3">
                          <div>
                            <span className="font-medium">Recipients:</span> {campaign.totalRecipients}
                          </div>
                          <div>
                            <span className="font-medium">Sent:</span> {campaign.sentCount}
                          </div>
                          <div>
                            <span className="font-medium">Opened:</span> {campaign.openedCount}
                          </div>
                          <div>
                            <span className="font-medium">Clicked:</span> {campaign.clickedCount}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {campaign.createdBy}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {campaign.createdAt}
                          </div>
                          {campaign.scheduledAt && (
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              Scheduled: {new Date(campaign.scheduledAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {campaign.status === 'draft' && (
                          <Button
                            size="sm"
                            onClick={() => handleStartCampaign(campaign)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        {campaign.status === 'running' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePauseCampaign(campaign)}
                          >
                            <Pause className="h-4 w-4" />
                          </Button>
                        )}
                        {campaign.status === 'paused' && (
                          <Button
                            size="sm"
                            onClick={() => handleStartCampaign(campaign)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditCampaign(campaign)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditCampaign(campaign)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicateCampaign(campaign)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Analytics
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <BarChart3 className="h-4 w-4 mr-2" />
                              View Report
                            </DropdownMenuItem>
                            {campaign.status === 'running' && (
                              <DropdownMenuItem 
                                onClick={() => handleStopCampaign(campaign)}
                                className="text-red-600"
                              >
                                <Square className="h-4 w-4 mr-2" />
                                Stop Campaign
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => handleDeleteCampaign(campaign.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Status-specific tabs */}
        {['draft', 'scheduled', 'running', 'completed'].map((status) => (
          <TabsContent key={status} value={status} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {status.charAt(0).toUpperCase() + status.slice(1)} Campaigns 
                  ({getStatusCount(status)})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredCampaigns
                    .filter(campaign => campaign.status === status)
                    .map((campaign) => (
                    <div
                      key={campaign.id}
                      className="p-4 border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium">{campaign.name}</h4>
                            <Badge className={typeColors[campaign.type]}>
                              {campaign.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{campaign.subject}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-muted-foreground">
                            <div>
                              <span className="font-medium">Recipients:</span> {campaign.totalRecipients}
                            </div>
                            <div>
                              <span className="font-medium">Sent:</span> {campaign.sentCount}
                            </div>
                            <div>
                              <span className="font-medium">Opened:</span> {campaign.openedCount}
                            </div>
                            <div>
                              <span className="font-medium">Clicked:</span> {campaign.clickedCount}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditCampaign(campaign)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDuplicateCampaign(campaign)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Campaign Form Modal */}
      <CampaignFormModal
        isOpen={isCampaignFormOpen}
        onClose={() => {
          setIsCampaignFormOpen(false);
          setSelectedCampaign(null);
        }}
        onSave={selectedCampaign ? handleUpdateCampaign : handleAddCampaign}
        campaign={selectedCampaign}
      />
    </div>
  );
}
