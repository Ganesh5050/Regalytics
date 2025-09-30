import { useState } from "react";
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
import { Filter, X, Search, Calendar, User, AlertTriangle } from "lucide-react";

interface FilterState {
  severity: string[];
  status: string[];
  assignedTo: string[];
  dateRange: { from: string; to: string };
  riskScoreRange: { min: string; max: string };
  searchTerm: string;
}

interface AlertFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}

export function AlertFilters({ onFiltersChange, onClearFilters }: AlertFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    severity: [],
    status: [],
    assignedTo: [],
    dateRange: { from: '', to: '' },
    riskScoreRange: { min: '', max: '' },
    searchTerm: ''
  });

  const severityOptions = ['HIGH', 'MEDIUM', 'LOW'];
  const statusOptions = ['Open', 'Investigating', 'Resolved', 'Closed'];
  const assignedToOptions = ['Sarah Johnson', 'Mike Wilson', 'Emily Davis', 'David Chen', 'Lisa Rodriguez', 'Unassigned'];

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleArrayToggle = (key: 'severity' | 'status' | 'assignedTo', value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    handleFilterChange(key, newArray);
  };

  const clearFilters = () => {
    const clearedFilters = {
      severity: [],
      status: [],
      assignedTo: [],
      dateRange: { from: '', to: '' },
      riskScoreRange: { min: '', max: '' },
      searchTerm: ''
    };
    setFilters(clearedFilters);
    onClearFilters();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.severity.length > 0) count++;
    if (filters.status.length > 0) count++;
    if (filters.assignedTo.length > 0) count++;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    if (filters.riskScoreRange.min || filters.riskScoreRange.max) count++;
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
            <h4 className="font-semibold">Alert Filters</h4>
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
                placeholder="Search alerts..."
                className="pl-9"
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              />
            </div>
          </div>

          {/* Severity Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Severity</label>
            <div className="flex flex-wrap gap-2">
              {severityOptions.map((severity) => (
                <Button
                  key={severity}
                  variant={filters.severity.includes(severity) ? "default" : "outline"}
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => handleArrayToggle('severity', severity)}
                >
                  {severity}
                </Button>
              ))}
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

          {/* Assigned To Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Assigned To</label>
            <div className="flex flex-wrap gap-2">
              {assignedToOptions.map((assignee) => (
                <Button
                  key={assignee}
                  variant={filters.assignedTo.includes(assignee) ? "default" : "outline"}
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => handleArrayToggle('assignedTo', assignee)}
                >
                  {assignee}
                </Button>
              ))}
            </div>
          </div>

          {/* Risk Score Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Risk Score Range</label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Min Score"
                type="number"
                min="0"
                max="100"
                value={filters.riskScoreRange.min}
                onChange={(e) => handleFilterChange('riskScoreRange', { ...filters.riskScoreRange, min: e.target.value })}
              />
              <Input
                placeholder="Max Score"
                type="number"
                min="0"
                max="100"
                value={filters.riskScoreRange.max}
                onChange={(e) => handleFilterChange('riskScoreRange', { ...filters.riskScoreRange, max: e.target.value })}
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

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Active Filters</label>
              <div className="flex flex-wrap gap-2">
                {filters.severity.map((severity) => (
                  <Badge key={severity} variant="secondary" className="text-xs">
                    {severity}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => handleArrayToggle('severity', severity)}
                    />
                  </Badge>
                ))}
                {filters.status.map((status) => (
                  <Badge key={status} variant="secondary" className="text-xs">
                    {status}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => handleArrayToggle('status', status)}
                    />
                  </Badge>
                ))}
                {filters.assignedTo.map((assignee) => (
                  <Badge key={assignee} variant="secondary" className="text-xs">
                    {assignee}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => handleArrayToggle('assignedTo', assignee)}
                    />
                  </Badge>
                ))}
                {filters.riskScoreRange.min && filters.riskScoreRange.max && (
                  <Badge variant="secondary" className="text-xs">
                    Risk: {filters.riskScoreRange.min}-{filters.riskScoreRange.max}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => handleFilterChange('riskScoreRange', { min: '', max: '' })}
                    />
                  </Badge>
                )}
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
