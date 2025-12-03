import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface FilterPanelProps {
  onFiltersChange: (filters: any) => void;
  filterType: 'clients' | 'transactions' | 'alerts';
}

export function FilterPanel({ onFiltersChange, filterType }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: [] as string[],
    severity: [] as string[],
    amountRange: { min: '', max: '' },
    riskScore: { min: '', max: '' },
  });

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      status: [],
      severity: [],
      amountRange: { min: '', max: '' },
      riskScore: { min: '', max: '' },
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getStatusOptions = () => {
    switch (filterType) {
      case 'clients':
        return ['Complete', 'Pending', 'Incomplete'];
      case 'transactions':
        return ['Cleared', 'Pending', 'Flagged', 'Under Review'];
      case 'alerts':
        return ['Open', 'Investigating', 'Resolved'];
      default:
        return [];
    }
  };

  const getSeverityOptions = () => {
    if (filterType === 'alerts') {
      return ['HIGH', 'MEDIUM', 'LOW'];
    }
    return [];
  };

  const hasActiveFilters = () => {
    return (
      filters.status.length > 0 ||
      filters.severity.length > 0 ||
      filters.amountRange.min ||
      filters.amountRange.max ||
      filters.riskScore.min ||
      filters.riskScore.max
    );
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className={cn(
            "border-border/50 hover:bg-accent/50",
            hasActiveFilters() && "border-primary bg-primary/5"
          )}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {hasActiveFilters() && (
            <span className="ml-2 h-2 w-2 bg-primary rounded-full" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Filters</CardTitle>
              {hasActiveFilters() && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-6 px-2 text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Status Filter */}
            {getStatusOptions().length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs font-medium">Status</Label>
                <Input
                  placeholder="Filter by status..."
                  className="h-8"
                  onChange={(e) => 
                    handleFilterChange('status', e.target.value ? [e.target.value] : [])
                  }
                />
              </div>
            )}

            {/* Severity Filter */}
            {getSeverityOptions().length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs font-medium">Severity</Label>
                <Input
                  placeholder="Filter by severity..."
                  className="h-8"
                  onChange={(e) => 
                    handleFilterChange('severity', e.target.value ? [e.target.value] : [])
                  }
                />
              </div>
            )}

            {/* Amount Range Filter */}
            {(filterType === 'transactions' || filterType === 'alerts') && (
              <div className="space-y-2">
                <Label className="text-xs font-medium">Amount Range</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Input
                      placeholder="Min"
                      value={filters.amountRange.min}
                      onChange={(e) => 
                        handleFilterChange('amountRange', {
                          ...filters.amountRange,
                          min: e.target.value
                        })
                      }
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Max"
                      value={filters.amountRange.max}
                      onChange={(e) => 
                        handleFilterChange('amountRange', {
                          ...filters.amountRange,
                          max: e.target.value
                        })
                      }
                      className="h-8"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Risk Score Filter */}
            {filterType === 'clients' && (
              <div className="space-y-2">
                <Label className="text-xs font-medium">Risk Score</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Input
                      placeholder="Min"
                      type="number"
                      min="0"
                      max="100"
                      value={filters.riskScore.min}
                      onChange={(e) => 
                        handleFilterChange('riskScore', {
                          ...filters.riskScore,
                          min: e.target.value
                        })
                      }
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Max"
                      type="number"
                      min="0"
                      max="100"
                      value={filters.riskScore.max}
                      onChange={(e) => 
                        handleFilterChange('riskScore', {
                          ...filters.riskScore,
                          max: e.target.value
                        })
                      }
                      className="h-8"
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
