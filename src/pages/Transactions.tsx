import { Receipt, Search, Filter, AlertTriangle, Calendar, RefreshCw, Eye } from "lucide-react";
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
import { useState, useEffect } from "react";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { TransactionDetailModal } from "@/components/transactions/TransactionDetailModal";
import { TransactionStats } from "@/components/transactions/TransactionStats";
import { useNotifications } from "@/hooks/useNotifications";
import { useRealTimeData } from "@/hooks/useRealTimeData";
import { RealTimeIndicator } from "@/components/common/RealTimeIndicator";

const transactionsData = [
  {
    id: "TXN20240115001",
    client: "Rajesh Industries Pvt Ltd",
    type: "Credit",
    amount: 850000,
    currency: "INR",
    date: "2024-01-15",
    time: "10:30 AM",
    status: "Cleared",
    suspicious: false,
    method: "NEFT"
  },
  {
    id: "TXN20240115002", 
    client: "Mumbai Trading Co.",
    type: "Debit",
    amount: 1500000,
    currency: "INR", 
    date: "2024-01-15",
    time: "11:15 AM",
    status: "Flagged",
    suspicious: true,
    method: "Cash Deposit"
  },
  {
    id: "TXN20240114001",
    client: "Tech Solutions Pvt Ltd",
    type: "Credit", 
    amount: 320000,
    currency: "INR",
    date: "2024-01-14",
    time: "2:45 PM", 
    status: "Cleared",
    suspicious: false,
    method: "RTGS"
  },
  {
    id: "TXN20240114002",
    client: "Global Exports Limited",
    type: "Credit",
    amount: 1200000,
    currency: "INR",
    date: "2024-01-14",
    time: "9:20 AM",
    status: "Under Review",
    suspicious: true,
    method: "Wire Transfer"
  }
];

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedTransaction, setSelectedTransaction] = useState<typeof transactionsData[0] | null>(null);
  const [filters, setFilters] = useState({
    status: [] as string[],
    type: [] as string[],
    method: [] as string[],
    amountRange: { min: '', max: '' },
    dateRange: { from: '', to: '' },
    suspicious: '',
    searchTerm: ''
  });
  const { addNotification } = useNotifications();
  const { isConnected, lastUpdate } = useRealTimeData();

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string, suspicious: boolean) => {
    if (suspicious) return { variant: "destructive" as const, label: "Suspicious" };
    if (status === "Cleared") return { variant: "outline" as const, label: "Cleared" };
    if (status === "Flagged") return { variant: "destructive" as const, label: "Flagged" };
    return { variant: "secondary" as const, label: status };
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  const filteredTransactions = transactionsData.filter(transaction => {
    // Basic search filter
    const matchesSearch = transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.method.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Advanced filters
    const matchesStatus = filters.status.length === 0 || filters.status.includes(transaction.status);
    const matchesType = filters.type.length === 0 || filters.type.includes(transaction.type);
    const matchesMethod = filters.method.length === 0 || filters.method.includes(transaction.method);
    
    const matchesAmountRange = (!filters.amountRange.min || transaction.amount >= parseInt(filters.amountRange.min)) &&
      (!filters.amountRange.max || transaction.amount <= parseInt(filters.amountRange.max));
    
    const matchesSuspicious = !filters.suspicious || 
      (filters.suspicious === 'Suspicious Only' && transaction.suspicious) ||
      (filters.suspicious === 'Non-Suspicious Only' && !transaction.suspicious);
    
    return matchesSearch && matchesStatus && matchesType && matchesMethod && matchesAmountRange && matchesSuspicious;
  });

  const handleViewTransaction = (transaction: typeof transactionsData[0]) => {
    setSelectedTransaction(transaction);
  };

  const handleTransactionUpdate = (transactionId: string, updates: Partial<typeof transactionsData[0]>) => {
    addNotification({
      type: 'success',
      title: 'Transaction Updated',
      message: `Transaction ${transactionId} has been updated successfully`
    });
    setSelectedTransaction(null);
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      status: [],
      type: [],
      method: [],
      amountRange: { min: '', max: '' },
      dateRange: { from: '', to: '' },
      suspicious: '',
      searchTerm: ''
    });
  };

  return (
    <div className="space-y-8 p-8 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground tracking-tight flex items-center gap-3">
            <Receipt className="h-8 w-8 text-primary" />
            Transaction Monitoring
          </h1>
          <p className="text-muted-foreground text-lg">
            Real-time transaction analysis and suspicious activity detection
          </p>
                 <div className="flex items-center gap-2">
                   <p className="text-sm text-muted-foreground">
                     Last updated: {lastUpdated.toLocaleTimeString()}
                   </p>
                   <RealTimeIndicator isConnected={isConnected} lastUpdate={lastUpdate} />
                 </div>
        </div>
        <Button 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-medium"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>

      {/* Stats Cards */}
      <TransactionStats transactions={transactionsData} />

      {/* Search and Filters */}
      <Card className="glass-card border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search by transaction ID, client, or amount..."
                className="pl-9 bg-muted/30 border-border/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <TransactionFilters 
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Transaction History</CardTitle>
          <CardDescription>
            All transactions with real-time monitoring and fraud detection • {filteredTransactions.length} transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Transaction ID</TableHead>
                <TableHead className="font-semibold">Client</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Amount</TableHead>
                <TableHead className="font-semibold">Method</TableHead>
                <TableHead className="font-semibold">Date & Time</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => {
                const statusBadge = getStatusBadge(transaction.status, transaction.suspicious);
                
                return (
                  <TableRow 
                    key={transaction.id} 
                    className={`hover:bg-muted/20 transition-micro ${
                      transaction.suspicious ? 'bg-destructive/5 border-l-4 border-destructive' : ''
                    }`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {transaction.suspicious && (
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                        )}
                        <code className="text-sm bg-muted/50 px-2 py-1 rounded text-foreground">
                          {transaction.id}
                        </code>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-foreground">{transaction.client}</p>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={transaction.type === "Credit" ? "outline" : "secondary"}
                        className="text-xs"
                      >
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="font-semibold text-foreground">
                        {formatAmount(transaction.amount)}
                      </p>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{transaction.method}</span>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm text-foreground">{transaction.date}</p>
                        <p className="text-xs text-muted-foreground">{transaction.time}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusBadge.variant} className="text-xs">
                        {statusBadge.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-border/50">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="glass-card">
                          <DropdownMenuItem 
                            className="hover:bg-accent/50 transition-micro"
                            onClick={() => handleViewTransaction(transaction)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="hover:bg-accent/50 transition-micro"
                            onClick={() => addNotification({
                              type: 'info',
                              title: 'Transaction Action',
                              message: `Action performed on transaction ${transaction.id}`
                            })}
                          >
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Flag for Review
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          onUpdate={handleTransactionUpdate}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
}