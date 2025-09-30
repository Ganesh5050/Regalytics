import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Star, 
  Phone, 
  Mail, 
  Calendar,
  TrendingUp,
  Users,
  Target,
  Clock
} from "lucide-react";
import { LeadFormModal } from "@/components/leads/LeadFormModal";
import { LeadDetailsModal } from "@/components/leads/LeadDetailsModal";
import { LeadPipeline } from "@/components/leads/LeadPipeline";
import { LeadAnalytics } from "@/components/leads/LeadAnalytics";

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

const mockLeads: Lead[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@techcorp.com",
    phone: "+1-555-0123",
    company: "TechCorp Solutions",
    title: "CTO",
    source: "Website",
    status: "qualified",
    score: 85,
    value: 50000,
    assignedTo: "Sarah Johnson",
    createdAt: "2024-01-15",
    lastContact: "2024-01-20",
    notes: "Interested in enterprise compliance solution",
    tags: ["enterprise", "high-value"]
  },
  {
    id: "2",
    name: "Emily Davis",
    email: "emily.davis@finance.com",
    phone: "+1-555-0456",
    company: "FinanceFirst",
    title: "Compliance Manager",
    source: "Referral",
    status: "proposal",
    score: 92,
    value: 75000,
    assignedTo: "Mike Chen",
    createdAt: "2024-01-10",
    lastContact: "2024-01-22",
    notes: "Ready for proposal presentation",
    tags: ["finance", "urgent"]
  },
  {
    id: "3",
    name: "Robert Wilson",
    email: "r.wilson@banking.com",
    phone: "+1-555-0789",
    company: "MetroBank",
    title: "Risk Director",
    source: "LinkedIn",
    status: "contacted",
    score: 78,
    value: 120000,
    assignedTo: "Sarah Johnson",
    createdAt: "2024-01-18",
    lastContact: "2024-01-21",
    notes: "Initial call completed, scheduling demo",
    tags: ["banking", "enterprise"]
  }
];

const statusColors = {
  'new': 'bg-blue-100 text-blue-800',
  'contacted': 'bg-yellow-100 text-yellow-800',
  'qualified': 'bg-green-100 text-green-800',
  'proposal': 'bg-purple-100 text-purple-800',
  'negotiation': 'bg-orange-100 text-orange-800',
  'closed-won': 'bg-emerald-100 text-emerald-800',
  'closed-lost': 'bg-red-100 text-red-800'
};

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>(mockLeads);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filter leads based on search and filters
  useEffect(() => {
    let filtered = leads;

    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    if (sourceFilter !== "all") {
      filtered = filtered.filter(lead => lead.source === sourceFilter);
    }

    setFilteredLeads(filtered);
  }, [leads, searchTerm, statusFilter, sourceFilter]);

  const handleAddLead = (newLead: Omit<Lead, 'id'>) => {
    const lead: Lead = {
      ...newLead,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setLeads([...leads, lead]);
  };

  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads(leads.map(lead => lead.id === updatedLead.id ? updatedLead : lead));
  };

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailsOpen(true);
  };

  const getStatusCount = (status: string) => {
    return leads.filter(lead => lead.status === status).length;
  };

  const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0);
  const avgScore = leads.reduce((sum, lead) => sum + lead.score, 0) / leads.length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Lead Management</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage and track your sales leads through the entire pipeline
          </p>
        </div>
        <Button onClick={() => setIsLeadFormOpen(true)} size="sm" className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Lead
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads.length}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Lead Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(avgScore)}</div>
            <p className="text-xs text-muted-foreground">
              +5 points from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24%</div>
            <p className="text-xs text-muted-foreground">
              +3% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pipeline" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pipeline" className="text-xs sm:text-sm">Pipeline</TabsTrigger>
          <TabsTrigger value="list" className="text-xs sm:text-sm">List</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-4 sm:space-y-6">
          <LeadPipeline leads={leads} onUpdateLead={handleUpdateLead} onViewLead={handleViewLead} />
        </TabsContent>

        <TabsContent value="list" className="space-y-4 sm:space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 min-w-[200px]">
                  <Input
                    placeholder="Search leads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="negotiation">Negotiation</SelectItem>
                    <SelectItem value="closed-won">Closed Won</SelectItem>
                    <SelectItem value="closed-lost">Closed Lost</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Phone">Phone</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  <Download className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Leads Table */}
          <Card>
            <CardHeader>
              <CardTitle>Leads ({filteredLeads.length})</CardTitle>
              <CardDescription>
                Manage your sales leads and track their progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleViewLead(lead)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col">
                        <div className="font-medium">{lead.name}</div>
                        <div className="text-sm text-muted-foreground">{lead.company}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={statusColors[lead.status]}>
                          {lead.status.replace('-', ' ')}
                        </Badge>
                        <Badge variant="outline">{lead.source}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-medium">${lead.value.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Score: {lead.score}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="ghost">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Calendar className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <LeadAnalytics leads={leads} />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <LeadFormModal
        isOpen={isLeadFormOpen}
        onClose={() => setIsLeadFormOpen(false)}
        onSave={handleAddLead}
      />

      <LeadDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        lead={selectedLead}
        onUpdate={handleUpdateLead}
      />
    </div>
  );
}
