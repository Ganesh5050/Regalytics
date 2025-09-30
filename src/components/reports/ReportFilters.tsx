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
import { Filter, X, Search, Calendar, FileText } from "lucide-react";

interface FilterState {
  type: string[];
  status: string[];
  format: string[];
  dateRange: { from: string; to: string };
  searchTerm: string;
}

interface ReportFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}

export function ReportFilters({ onFiltersChange, onClearFilters }: ReportFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    type: [],
    status: [],
    format: [],
    dateRange: { from: '', to: '' },
    searchTerm: ''
  });

  const typeOptions = ['Compliance', 'Suspicious Activity', 'KYC', 'Risk Analysis', 'Audit'];
  const statusOptions = ['Ready', 'Generating', 'Failed', 'Scheduled'];
  const formatOptions = ['PDF', 'Excel', 'CSV'];

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleArrayToggle = (key: 'type' | 'status' | 'format', value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    handleFilterChange(key, newArray);
  };

  const clearFilters = () => {
    const clearedFilters = {
      type: [],
      status: [],
      format: [],
      dateRange: { from: '', to: '' },
      searchTerm: ''
    };
    setFilters(clearedFilters);
    onClearFilters();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.type.length > 0) count++;
    if (filters.status.length > 0) count++;
    if (filters.format.length > 0) count++;
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
            <h4 className="font-semibold">Report Filters</h4>
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
                placeholder="Search reports..."
                className="pl-9"
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              />
            </div>
          </div>

          {/* Type Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Report Type</label>
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

          {/* Format Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Format</label>
            <div className="flex flex-wrap gap-2">
              {formatOptions.map((format) => (
                <Button
                  key={format}
                  variant={filters.format.includes(format) ? "default" : "outline"}
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => handleArrayToggle('format', format)}
                >
                  {format}
                </Button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Generated Date</label>
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
                {filters.type.map((type) => (
                  <Badge key={type} variant="secondary" className="text-xs">
                    {type}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => handleArrayToggle('type', type)}
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
                {filters.format.map((format) => (
                  <Badge key={format} variant="secondary" className="text-xs">
                    {format}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => handleArrayToggle('format', format)}
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
