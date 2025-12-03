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
  TrendingUp,
  DollarSign,
  Target,
  Calendar,
  Users,
  BarChart3,
  PieChart
} from "lucide-react";
import { DealFormModal } from "@/components/sales/DealFormModal";
import { DealDetailsModal } from "@/components/sales/DealDetailsModal";
import { PipelineView } from "@/components/sales/PipelineView";
import { SalesAnalytics } from "@/components/sales/SalesAnalytics";

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

const mockDeals: Deal[] = [
  {
    id: "1",
    name: "Enterprise Compliance Suite",
    company: "TechCorp Solutions",
    contact: "John Smith",
    email: "john.smith@techcorp.com",
    phone: "+1-555-0123",
    value: 125000,
    stage: "proposal",
    probability: 75,
    expectedCloseDate: "2024-02-15",
    assignedTo: "Sarah Johnson",
    source: "Website",
    createdAt: "2024-01-15",
    lastActivity: "2024-01-22",
    notes: "Ready for proposal presentation",
    tags: ["enterprise", "high-value"],
    products: ["Compliance Suite", "Risk Management"]
  },
  {
    id: "2",
    name: "Banking Risk Assessment",
    company: "MetroBank",
    contact: "Emily Davis",
    email: "emily.davis@metrobank.com",
    phone: "+1-555-0456",
    value: 85000,
    stage: "negotiation",
    probability: 60,
    expectedCloseDate: "2024-02-28",
    assignedTo: "Mike Chen",
    source: "Referral",
    createdAt: "2024-01-10",
    lastActivity: "2024-01-21",
    notes: "Price negotiation in progress",
    tags: ["banking", "risk"],
    products: ["Risk Assessment", "Compliance Monitoring"]
  },
  {
    id: "3",
    name: "SME Compliance Package",
    company: "FinanceFirst",
    contact: "Robert Wilson",
    email: "r.wilson@financefirst.com",
    phone: "+1-555-0789",
    value: 45000,
    stage: "qualification",
    probability: 40,
    expectedCloseDate: "2024-03-15",
    assignedTo: "Sarah Johnson",
    source: "LinkedIn",
    createdAt: "2024-01-18",
    lastActivity: "2024-01-20",
    notes: "Initial qualification completed",
    tags: ["sme", "compliance"],
    products: ["Basic Compliance", "Reporting"]
  }
];

const stageColors = {
  'prospecting': 'bg-blue-100 text-blue-800',
  'qualification': 'bg-yellow-100 text-yellow-800',
  'proposal': 'bg-green-100 text-green-800',
  'negotiation': 'bg-orange-100 text-orange-800',
  'closed-won': 'bg-emerald-100 text-emerald-800',
  'closed-lost': 'bg-red-100 text-red-800'
};

export default function SalesPipeline() {
  const [deals, setDeals] = useState<Deal[]>(mockDeals);
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>(mockDeals);
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [assignedFilter, setAssignedFilter] = useState<string>("all");
  const [isDealFormOpen, setIsDealFormOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filter deals based on search and filters
  useEffect(() => {
    let filtered = deals;

    if (searchTerm) {
      filtered = filtered.filter(deal =>
        deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.contact.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (stageFilter !== "all") {
      filtered = filtered.filter(deal => deal.stage === stageFilter);
    }

    if (assignedFilter !== "all") {
      filtered = filtered.filter(deal => deal.assignedTo === assignedFilter);
    }

    setFilteredDeals(filtered);
  }, [deals, searchTerm, stageFilter, assignedFilter]);

  const handleAddDeal = (newDeal: Omit<Deal, 'id'>) => {
    const deal: Deal = {
      ...newDeal,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setDeals([...deals, deal]);
  };

  const handleUpdateDeal = (updatedDeal: Deal) => {
    setDeals(deals.map(deal => deal.id === updatedDeal.id ? updatedDeal : deal));
  };

  const handleViewDeal = (deal: Deal) => {
    setSelectedDeal(deal);
    setIsDetailsOpen(true);
  };

  const getStageCount = (stage: string) => {
    return deals.filter(deal => deal.stage === stage).length;
  };

  const getStageValue = (stage: string) => {
    return deals.filter(deal => deal.stage === stage).reduce((sum, deal) => sum + deal.value, 0);
  };

  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const weightedValue = deals.reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0);
  const winRate = (deals.filter(deal => deal.stage === 'closed-won').length / deals.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Pipeline</h1>
          <p className="text-muted-foreground">
            Track and manage your sales opportunities through the entire sales process
          </p>
        </div>
        <Button onClick={() => setIsDealFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Deal
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pipeline</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weighted Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Math.round(weightedValue).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{winRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deals.length}</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pipeline" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pipeline">Pipeline View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-6">
          <PipelineView deals={deals} onUpdateDeal={handleUpdateDeal} onViewDeal={handleViewDeal} />
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <Input
                    placeholder="Search deals..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={stageFilter} onValueChange={setStageFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    <SelectItem value="prospecting">Prospecting</SelectItem>
                    <SelectItem value="qualification">Qualification</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="negotiation">Negotiation</SelectItem>
                    <SelectItem value="closed-won">Closed Won</SelectItem>
                    <SelectItem value="closed-lost">Closed Lost</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={assignedFilter} onValueChange={setAssignedFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Assigned To" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                    <SelectItem value="Mike Chen">Mike Chen</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Deals Table */}
          <Card>
            <CardHeader>
              <CardTitle>Deals ({filteredDeals.length})</CardTitle>
              <CardDescription>
                Manage your sales opportunities and track their progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredDeals.map((deal) => (
                  <div
                    key={deal.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleViewDeal(deal)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col">
                        <div className="font-medium">{deal.name}</div>
                        <div className="text-sm text-muted-foreground">{deal.company} • {deal.contact}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={stageColors[deal.stage]}>
                          {deal.stage.replace('-', ' ')}
                        </Badge>
                        <Badge variant="outline">{deal.probability}%</Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-medium">${deal.value.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Close: {deal.expectedCloseDate}</div>
                      </div>
                      <div className="flex items-center space-x-2">
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
          <SalesAnalytics deals={deals} />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <DealFormModal
        isOpen={isDealFormOpen}
        onClose={() => setIsDealFormOpen(false)}
        onSave={handleAddDeal}
      />

      <DealDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        deal={selectedDeal}
        onUpdate={handleUpdateDeal}
      />
    </div>
  );
}
