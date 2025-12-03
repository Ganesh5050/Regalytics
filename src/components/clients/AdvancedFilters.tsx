import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Filter, X, Calendar, Search } from "lucide-react";

interface FilterState {
  riskScore: { min: string; max: string };
  kycStatus: string[];
  dateRange: { from: string; to: string };
  searchTerm: string;
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}

export function AdvancedFilters({ onFiltersChange, onClearFilters }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    riskScore: { min: '', max: '' },
    kycStatus: [],
    dateRange: { from: '', to: '' },
    searchTerm: ''
  });

  const kycStatusOptions = ['Complete', 'Pending', 'Incomplete', 'Under Review'];
  const riskScoreRanges = [
    { label: 'Low Risk (0-69)', min: '0', max: '69' },
    { label: 'Medium Risk (70-89)', min: '70', max: '89' },
    { label: 'High Risk (90-100)', min: '90', max: '100' }
  ];

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleKYCStatusToggle = (status: string) => {
    const newStatus = filters.kycStatus.includes(status)
      ? filters.kycStatus.filter(s => s !== status)
      : [...filters.kycStatus, status];
    handleFilterChange('kycStatus', newStatus);
  };

  const handleRiskRangeSelect = (range: { min: string; max: string }) => {
    handleFilterChange('riskScore', range);
  };

  const clearFilters = () => {
    const clearedFilters = {
      riskScore: { min: '', max: '' },
      kycStatus: [],
      dateRange: { from: '', to: '' },
      searchTerm: ''
    };
    setFilters(clearedFilters);
    onClearFilters();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.riskScore.min || filters.riskScore.max) count++;
    if (filters.kycStatus.length > 0) count++;
    if (filters.dateRange.from || filters.dateRange.to) count++;
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
            <h4 className="font-semibold">Advanced Filters</h4>
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
                placeholder="Search clients..."
                className="pl-9"
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              />
            </div>
          </div>

          {/* Risk Score Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Risk Score Range</label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Min"
                type="number"
                min="0"
                max="100"
                value={filters.riskScore.min}
                onChange={(e) => handleFilterChange('riskScore', { ...filters.riskScore, min: e.target.value })}
              />
              <Input
                placeholder="Max"
                type="number"
                min="0"
                max="100"
                value={filters.riskScore.max}
                onChange={(e) => handleFilterChange('riskScore', { ...filters.riskScore, max: e.target.value })}
              />
            </div>
            <div className="flex flex-wrap gap-1">
              {riskScoreRanges.map((range, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => handleRiskRangeSelect(range)}
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </div>

          {/* KYC Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium">KYC Status</label>
            <div className="flex flex-wrap gap-2">
              {kycStatusOptions.map((status) => (
                <Button
                  key={status}
                  variant={filters.kycStatus.includes(status) ? "default" : "outline"}
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => handleKYCStatusToggle(status)}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Last Updated</label>
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

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Active Filters</label>
              <div className="flex flex-wrap gap-2">
                {filters.riskScore.min && filters.riskScore.max && (
                  <Badge variant="secondary" className="text-xs">
                    Risk: {filters.riskScore.min}-{filters.riskScore.max}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => handleFilterChange('riskScore', { min: '', max: '' })}
                    />
                  </Badge>
                )}
                {filters.kycStatus.map((status) => (
                  <Badge key={status} variant="secondary" className="text-xs">
                    {status}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => handleKYCStatusToggle(status)}
                    />
                  </Badge>
                ))}
                {filters.dateRange.from && (
                  <Badge variant="secondary" className="text-xs">
                    From: {filters.dateRange.from}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => handleFilterChange('dateRange', { ...filters.dateRange, from: '' })}
                    />
                  </Badge>
                )}
                {filters.dateRange.to && (
                  <Badge variant="secondary" className="text-xs">
                    To: {filters.dateRange.to}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => handleFilterChange('dateRange', { ...filters.dateRange, to: '' })}
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
