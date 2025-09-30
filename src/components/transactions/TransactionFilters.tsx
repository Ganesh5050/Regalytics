import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter, X, Search, Calendar, DollarSign } from "lucide-react";

interface FilterState {
  status: string[];
  type: string[];
  method: string[];
  amountRange: { min: string; max: string };
  dateRange: { from: string; to: string };
  suspicious: string;
  searchTerm: string;
}

interface TransactionFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}

export function TransactionFilters({ onFiltersChange, onClearFilters }: TransactionFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    type: [],
    method: [],
    amountRange: { min: '', max: '' },
    dateRange: { from: '', to: '' },
    suspicious: '',
    searchTerm: ''
  });

  const statusOptions = ['Cleared', 'Flagged', 'Under Review', 'Pending'];
  const typeOptions = ['Credit', 'Debit'];
  const methodOptions = ['NEFT', 'RTGS', 'Cash Deposit', 'Wire Transfer', 'UPI', 'Cheque'];
  const suspiciousOptions = ['All', 'Suspicious Only', 'Non-Suspicious Only'];

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleArrayToggle = (key: 'status' | 'type' | 'method', value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    handleFilterChange(key, newArray);
  };

  const clearFilters = () => {
    const clearedFilters = {
      status: [],
      type: [],
      method: [],
      amountRange: { min: '', max: '' },
      dateRange: { from: '', to: '' },
      suspicious: '',
      searchTerm: ''
    };
    setFilters(clearedFilters);
    onClearFilters();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.status.length > 0) count++;
    if (filters.type.length > 0) count++;
    if (filters.method.length > 0) count++;
    if (filters.amountRange.min || filters.amountRange.max) count++;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    if (filters.suspicious && filters.suspicious !== 'All') count++;
    if (filters.searchTerm) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="h-4 w-4 mr-2" />
          Advanced Filters
          {activeFiltersCount > 0 && (
            <Badge className="ml-2 h-5 w-5 p-0 text-xs bg-primary text-primary-foreground border-0 flex items-center justify-center">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 glass-card" align="start">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Transaction Filters</h4>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>

          {/* Search Term */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-9"
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <Button
                  key={status}
                  variant={filters.status.includes(status) ? "default" : "outline"}
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => handleArrayToggle('status', status)}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Transaction Type</label>
            <div className="flex flex-wrap gap-2">
              {typeOptions.map((type) => (
                <Button
                  key={type}
                  variant={filters.type.includes(type) ? "default" : "outline"}
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => handleArrayToggle('type', type)}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Method Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Method</label>
            <div className="flex flex-wrap gap-2">
              {methodOptions.map((method) => (
                <Button
                  key={method}
                  variant={filters.method.includes(method) ? "default" : "outline"}
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => handleArrayToggle('method', method)}
                >
                  {method}
                </Button>
              ))}
            </div>
          </div>

          {/* Amount Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount Range (₹)</label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Min Amount"
                type="number"
                value={filters.amountRange.min}
                onChange={(e) => handleFilterChange('amountRange', { ...filters.amountRange, min: e.target.value })}
              />
              <Input
                placeholder="Max Amount"
                type="number"
                value={filters.amountRange.max}
                onChange={(e) => handleFilterChange('amountRange', { ...filters.amountRange, max: e.target.value })}
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Date Range</label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                value={filters.dateRange.from}
                onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, from: e.target.value })}
              />
              <Input
                type="date"
                value={filters.dateRange.to}
                onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, to: e.target.value })}
              />
            </div>
          </div>

          {/* Suspicious Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Suspicious Activity</label>
            <Select value={filters.suspicious} onValueChange={(value) => handleFilterChange('suspicious', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select filter" />
              </SelectTrigger>
              <SelectContent>
                {suspiciousOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Active Filters</label>
              <div className="flex flex-wrap gap-2">
                {filters.status.map((status) => (
                  <Badge key={status} variant="secondary" className="text-xs">
                    {status}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => handleArrayToggle('status', status)}
                    />
                  </Badge>
                ))}
                {filters.type.map((type) => (
                  <Badge key={type} variant="secondary" className="text-xs">
                    {type}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => handleArrayToggle('type', type)}
                    />
                  </Badge>
                ))}
                {filters.method.map((method) => (
                  <Badge key={method} variant="secondary" className="text-xs">
                    {method}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => handleArrayToggle('method', method)}
                    />
                  </Badge>
                ))}
                {filters.amountRange.min && filters.amountRange.max && (
                  <Badge variant="secondary" className="text-xs">
                    ₹{filters.amountRange.min}-{filters.amountRange.max}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => handleFilterChange('amountRange', { min: '', max: '' })}
                    />
                  </Badge>
                )}
                {filters.suspicious && filters.suspicious !== 'All' && (
                  <Badge variant="secondary" className="text-xs">
                    {filters.suspicious}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => handleFilterChange('suspicious', '')}
                    />
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
