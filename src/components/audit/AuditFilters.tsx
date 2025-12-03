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
  user: string[];
  action: string[];
  status: string[];
  severity: string[];
  dateRange: { from: string; to: string };
  searchTerm: string;
}

interface AuditFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}

export function AuditFilters({ onFiltersChange, onClearFilters }: AuditFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    user: [],
    action: [],
    status: [],
    severity: [],
    dateRange: { from: '', to: '' },
    searchTerm: ''
  });

  const userOptions = ['Sarah Johnson', 'Mike Wilson', 'Emily Davis', 'David Chen', 'Lisa Rodriguez', 'System'];
  const actionOptions = [
    'Client KYC Updated', 
    'Alert Investigation Closed', 
    'Automated Risk Assessment',
    'Report Generated',
    'Failed Login Attempt',
    'Transaction Flagged',
    'User Login',
    'Data Export',
    'System Configuration'
  ];
  const statusOptions = ['Success', 'Failed', 'Pending'];
  const severityOptions = ['High', 'Medium', 'Low'];

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleArrayToggle = (key: 'user' | 'action' | 'status' | 'severity', value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    handleFilterChange(key, newArray);
  };

  const clearFilters = () => {
    const clearedFilters = {
      user: [],
      action: [],
      status: [],
      severity: [],
      dateRange: { from: '', to: '' },
      searchTerm: ''
    };
    setFilters(clearedFilters);
    onClearFilters();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.user.length > 0) count++;
    if (filters.action.length > 0) count++;
    if (filters.status.length > 0) count++;
    if (filters.severity.length > 0) count++;
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
            <h4 className="font-semibold">Audit Filters</h4>
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
                placeholder="Search audit logs..."
                className="pl-9"
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              />
            </div>
          </div>

          {/* User Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">User</label>
            <div className="flex flex-wrap gap-2">
              {userOptions.map((user) => (
                <Button
                  key={user}
                  variant={filters.user.includes(user) ? "default" : "outline"}
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => handleArrayToggle('user', user)}
                >
                  {user}
                </Button>
              ))}
            </div>
          </div>

          {/* Action Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Action Type</label>
            <div className="flex flex-wrap gap-2">
              {actionOptions.map((action) => (
                <Button
                  key={action}
                  variant={filters.action.includes(action) ? "default" : "outline"}
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => handleArrayToggle('action', action)}
                >
                  {action}
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
                {filters.user.map((user) => (
                  <Badge key={user} variant="secondary" className="text-xs">
                    {user}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => handleArrayToggle('user', user)}
                    />
                  </Badge>
                ))}
                {filters.action.map((action) => (
                  <Badge key={action} variant="secondary" className="text-xs">
                    {action}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => handleArrayToggle('action', action)}
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
                {filters.severity.map((severity) => (
                  <Badge key={severity} variant="secondary" className="text-xs">
                    {severity}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => handleArrayToggle('severity', severity)}
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
