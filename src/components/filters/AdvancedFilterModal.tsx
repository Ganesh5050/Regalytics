import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useNotifications } from '@/hooks/useNotifications';
import { Filter, Calendar, DollarSign, Users, AlertTriangle } from 'lucide-react';

interface AdvancedFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FilterData {
  dateRange: {
    from: string;
    to: string;
  };
  amountRange: {
    min: string;
    max: string;
  };
  riskLevels: string[];
  kycStatuses: string[];
  transactionTypes: string[];
  clientTypes: string[];
  alertTypes: string[];
  searchTerm: string;
}

export function AdvancedFilterModal({ isOpen, onClose }: AdvancedFilterModalProps) {
  const { addNotification } = useNotifications();
  const [filterData, setFilterData] = useState<FilterData>({
    dateRange: { from: '', to: '' },
    amountRange: { min: '', max: '' },
    riskLevels: [],
    kycStatuses: [],
    transactionTypes: [],
    clientTypes: [],
    alertTypes: [],
    searchTerm: ''
  });
  const [isApplying, setIsApplying] = useState(false);

  const handleInputChange = (field: keyof FilterData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedInputChange = (parentField: keyof FilterData, childField: string, value: string) => {
    setFilterData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField] as any,
        [childField]: value
      }
    }));
  };

  const handleArrayToggle = (field: keyof FilterData, value: string) => {
    setFilterData(prev => {
      const currentArray = prev[field] as string[];
      const updatedArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return { ...prev, [field]: updatedArray };
    });
  };

  const handleApplyFilters = async () => {
    setIsApplying(true);
    
    try {
      // Simulate filter application
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const activeFilters = Object.entries(filterData).filter(([key, value]) => {
        if (typeof value === 'string') return value.trim() !== '';
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === 'object' && value !== null) {
          return Object.values(value).some(v => v !== '');
        }
        return false;
      }).length;
      
      addNotification({
        type: 'success',
        title: 'Filters Applied',
        message: `${activeFilters} filter(s) have been applied successfully`
      });
      
      onClose();
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Filter Application Failed',
        message: 'Failed to apply filters. Please try again.'
      });
    } finally {
      setIsApplying(false);
    }
  };

  const handleClearAll = () => {
    setFilterData({
      dateRange: { from: '', to: '' },
      amountRange: { min: '', max: '' },
      riskLevels: [],
      kycStatuses: [],
      transactionTypes: [],
      clientTypes: [],
      alertTypes: [],
      searchTerm: ''
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filterData.searchTerm.trim()) count++;
    if (filterData.dateRange.from || filterData.dateRange.to) count++;
    if (filterData.amountRange.min || filterData.amountRange.max) count++;
    if (filterData.riskLevels.length > 0) count++;
    if (filterData.kycStatuses.length > 0) count++;
    if (filterData.transactionTypes.length > 0) count++;
    if (filterData.clientTypes.length > 0) count++;
    if (filterData.alertTypes.length > 0) count++;
    return count;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Advanced Filters
          </DialogTitle>
          <DialogDescription>
            Apply complex filters to refine your data view across all modules.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Global Search</CardTitle>
              <CardDescription>Search across all data fields</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="searchTerm">Search Term</Label>
                <Input
                  id="searchTerm"
                  value={filterData.searchTerm}
                  onChange={(e) => handleInputChange('searchTerm', e.target.value)}
                  placeholder="Search clients, transactions, alerts..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Date Range */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date Range
              </CardTitle>
              <CardDescription>Filter by date ranges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateFrom">From Date</Label>
                  <Input
                    id="dateFrom"
                    type="date"
                    value={filterData.dateRange.from}
                    onChange={(e) => handleNestedInputChange('dateRange', 'from', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateTo">To Date</Label>
                  <Input
                    id="dateTo"
                    type="date"
                    value={filterData.dateRange.to}
                    onChange={(e) => handleNestedInputChange('dateRange', 'to', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amount Range */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Amount Range
              </CardTitle>
              <CardDescription>Filter by transaction amounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amountMin">Minimum Amount (₹)</Label>
                  <Input
                    id="amountMin"
                    type="number"
                    value={filterData.amountRange.min}
                    onChange={(e) => handleNestedInputChange('amountRange', 'min', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amountMax">Maximum Amount (₹)</Label>
                  <Input
                    id="amountMax"
                    type="number"
                    value={filterData.amountRange.max}
                    onChange={(e) => handleNestedInputChange('amountRange', 'max', e.target.value)}
                    placeholder="1000000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Levels */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Risk Levels
              </CardTitle>
              <CardDescription>Filter by client risk levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Low', 'Medium', 'High', 'Critical'].map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <Checkbox
                      id={`risk-${level.toLowerCase()}`}
                      checked={filterData.riskLevels.includes(level.toLowerCase())}
                      onCheckedChange={() => handleArrayToggle('riskLevels', level.toLowerCase())}
                    />
                    <Label htmlFor={`risk-${level.toLowerCase()}`} className="text-sm">
                      {level}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* KYC Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-4 w-4" />
                KYC Status
              </CardTitle>
              <CardDescription>Filter by KYC completion status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Pending', 'Incomplete', 'Complete'].map((status) => (
                  <div key={status} className="flex items-center space-x-2">
                    <Checkbox
                      id={`kyc-${status.toLowerCase()}`}
                      checked={filterData.kycStatuses.includes(status.toLowerCase())}
                      onCheckedChange={() => handleArrayToggle('kycStatuses', status.toLowerCase())}
                    />
                    <Label htmlFor={`kyc-${status.toLowerCase()}`} className="text-sm">
                      {status}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Transaction Types */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Transaction Types</CardTitle>
              <CardDescription>Filter by transaction categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Credit', 'Debit', 'Transfer', 'Deposit', 'Withdrawal', 'Payment'].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`txn-${type.toLowerCase()}`}
                      checked={filterData.transactionTypes.includes(type.toLowerCase())}
                      onCheckedChange={() => handleArrayToggle('transactionTypes', type.toLowerCase())}
                    />
                    <Label htmlFor={`txn-${type.toLowerCase()}`} className="text-sm">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Client Types */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Client Types</CardTitle>
              <CardDescription>Filter by client categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Individual', 'Corporate', 'SME', 'NRI', 'PEP'].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`client-${type.toLowerCase()}`}
                      checked={filterData.clientTypes.includes(type.toLowerCase())}
                      onCheckedChange={() => handleArrayToggle('clientTypes', type.toLowerCase())}
                    />
                    <Label htmlFor={`client-${type.toLowerCase()}`} className="text-sm">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alert Types */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Alert Types</CardTitle>
              <CardDescription>Filter by alert categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Compliance', 'Transaction', 'KYC', 'Risk', 'Suspicious'].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`alert-${type.toLowerCase()}`}
                      checked={filterData.alertTypes.includes(type.toLowerCase())}
                      onCheckedChange={() => handleArrayToggle('alertTypes', type.toLowerCase())}
                    />
                    <Label htmlFor={`alert-${type.toLowerCase()}`} className="text-sm">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filter Summary</CardTitle>
              <CardDescription>Active filters overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {getActiveFilterCount()} Active Filters
                  </Badge>
                  {getActiveFilterCount() > 0 && (
                    <Button variant="ghost" size="sm" onClick={handleClearAll}>
                      Clear All
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleApplyFilters} disabled={isApplying}>
              {isApplying ? 'Applying...' : 'Apply Filters'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
