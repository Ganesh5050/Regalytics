import { Users, Plus, Search, Filter, MoreHorizontal, Eye, Edit, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { AdvancedFilters } from "@/components/clients/AdvancedFilters";
import { BulkActions } from "@/components/clients/BulkActions";
import { ClientDetailModal } from "@/components/clients/ClientDetailModal";
import { useNotifications } from "@/hooks/useNotifications";
import { useClients } from "@/hooks/useDataService";
import { LoadingSkeleton, TableSkeleton } from "@/components/common/LoadingSkeleton";
import { usePerformanceOptimization } from "@/hooks/usePerformanceOptimization";

const clientsData = [
  {
    id: "CLI001",
    name: "Rajesh Industries Pvt Ltd",
    pan: "ABCDE1234F",
    aadhaar: "****-****-1234",
    riskScore: 85,
    kycStatus: "Complete",
    lastUpdate: "2024-01-15"
  },
  {
    id: "CLI002", 
    name: "Mumbai Trading Co.",
    pan: "FGHIJ5678K",
    aadhaar: "****-****-5678",
    riskScore: 92,
    kycStatus: "Complete",
    lastUpdate: "2024-01-14"
  },
  {
    id: "CLI003",
    name: "Tech Solutions Pvt Ltd",
    pan: "KLMNO9012P",
    aadhaar: "****-****-9012", 
    riskScore: 67,
    kycStatus: "Pending",
    lastUpdate: "2024-01-13"
  },
  {
    id: "CLI004",
    name: "Global Exports Limited",
    pan: "QRSTU3456V",
    aadhaar: "****-****-3456",
    riskScore: 78,
    kycStatus: "Complete",
    lastUpdate: "2024-01-12"
  }
];

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [filters, setFilters] = useState({
    riskScore: { min: '', max: '' },
    kycStatus: [] as string[],
    dateRange: { from: '', to: '' },
    searchTerm: ''
  });
  
  const { addNotification } = useNotifications();
  const { useDebounce, createMemoizedSearch } = usePerformanceOptimization();
  
  // Use data service for clients
  const { 
    data: clients, 
    loading, 
    error, 
    total, 
    refetch, 
    setFilters: setDataFilters 
  } = useClients({ filters, search: searchTerm });

  // Debounced search
  const debouncedSearch = useDebounce((term: string) => {
    setSearchTerm(term);
  }, 300);

  // Memoized search function
  const searchClients = createMemoizedSearch(clients, ['name', 'pan', 'id']);

  const getRiskBadge = (score: number) => {
    if (score >= 90) return { variant: "destructive" as const, label: "High Risk" };
    if (score >= 70) return { variant: "secondary" as const, label: "Medium Risk" };
    return { variant: "outline" as const, label: "Low Risk" };
  };

  const getKYCBadge = (status: string) => {
    if (status === "Complete") return { variant: "outline" as const, label: "Complete" };
    return { variant: "secondary" as const, label: "Pending" };
  };

  // Use memoized search for better performance
  const filteredClients = searchTerm ? searchClients(searchTerm) : clients;

  const handleViewClient = (client: any) => {
    setSelectedClient(client);
  };

  const handleUpdateKYC = (clientId: string) => {
    addNotification({
      type: 'info',
      title: 'KYC Update',
      message: `KYC update initiated for client ${clientId}`
    });
  };

  const handleRiskAssessment = (clientId: string) => {
    addNotification({
      type: 'warning',
      title: 'Risk Assessment',
      message: `Risk assessment started for client ${clientId}`
    });
  };

  const handleSelectClient = (clientId: string) => {
    setSelectedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleSelectAll = () => {
    setSelectedClients(filteredClients.map(client => client.id));
  };

  const handleClearSelection = () => {
    setSelectedClients([]);
  };

  const handleBulkAction = (action: string, clientIds: string[]) => {
    addNotification({
      type: 'success',
      title: 'Bulk Action',
      message: `${action} performed on ${clientIds.length} clients`
    });
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      riskScore: { min: '', max: '' },
      kycStatus: [],
      dateRange: { from: '', to: '' },
      searchTerm: ''
    });
  };

  const handleClientUpdate = (clientId: string, updates: Partial<any>) => {
    addNotification({
      type: 'success',
      title: 'Client Updated',
      message: `Client ${clientId} has been updated successfully`
    });
    setSelectedClient(null);
    refetch(); // Refresh data after update
  };

  return (
    <div className="space-y-8 p-8 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground tracking-tight flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            Client Management
          </h1>
          <p className="text-muted-foreground text-lg">
            KYC verification, risk assessment, and client onboarding
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-medium">
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="glass-card border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                     <Input
                       placeholder="Search clients by name, PAN, or ID..."
                       className="pl-9 bg-muted/30 border-border/50"
                       onChange={(e) => debouncedSearch(e.target.value)}
                     />
            </div>
            <AdvancedFilters 
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold">Client Records</CardTitle>
                 <CardDescription>
                   Complete KYC database with risk assessment • {loading ? 'Loading...' : `${total} clients`}
                 </CardDescription>
            </div>
            <BulkActions
              selectedClients={selectedClients}
              onSelectAll={handleSelectAll}
              onClearSelection={handleClearSelection}
              onBulkAction={handleBulkAction}
              totalClients={filteredClients.length}
            />
          </div>
        </CardHeader>
               <CardContent>
                 {loading ? (
                   <TableSkeleton rows={5} columns={7} />
                 ) : error ? (
                   <div className="text-center py-8 text-destructive">
                     Error loading clients: {error}
                   </div>
                 ) : (
                   <Table>
                     <TableHeader>
                       <TableRow>
                         <TableHead className="w-12"></TableHead>
                         <TableHead className="font-semibold">Client</TableHead>
                         <TableHead className="font-semibold">PAN</TableHead>
                         <TableHead className="font-semibold">Aadhaar</TableHead>
                         <TableHead className="font-semibold">Risk Score</TableHead>
                         <TableHead className="font-semibold">KYC Status</TableHead>
                         <TableHead className="font-semibold">Last Updated</TableHead>
                         <TableHead className="w-12"></TableHead>
                       </TableRow>
                     </TableHeader>
                     <TableBody>
                       {filteredClients.map((client) => {
                const riskBadge = getRiskBadge(client.riskScore);
                const kycBadge = getKYCBadge(client.kycStatus);
                
                return (
                  <TableRow key={client.id} className="hover:bg-muted/20 transition-micro">
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedClients.includes(client.id)}
                        onChange={() => handleSelectClient(client.id)}
                        className="rounded border-border"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">{client.name}</p>
                        <p className="text-sm text-muted-foreground">{client.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted/50 px-2 py-1 rounded text-foreground">
                        {client.pan}
                      </code>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted/50 px-2 py-1 rounded text-muted-foreground">
                        {client.aadhaar}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{client.riskScore}</span>
                        <Badge variant={riskBadge.variant} className="text-xs">
                          {riskBadge.label}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={kycBadge.variant} className="text-xs">
                        {kycBadge.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {client.lastUpdate}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-border/50">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="glass-card">
                          <DropdownMenuItem 
                            className="hover:bg-accent/50 transition-micro"
                            onClick={() => handleViewClient(client)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="hover:bg-accent/50 transition-micro"
                            onClick={() => handleUpdateKYC(client.id)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Update KYC
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="hover:bg-accent/50 transition-micro"
                            onClick={() => handleRiskAssessment(client.id)}
                          >
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Risk Assessment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
                       })}
                     </TableBody>
                   </Table>
                 )}
               </CardContent>
      </Card>

      {/* Client Detail Modal */}
      {selectedClient && (
        <ClientDetailModal
          client={selectedClient}
          onUpdate={handleClientUpdate}
          onClose={() => setSelectedClient(null)}
        />
      )}
    </div>
  );
}