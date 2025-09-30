import { useState, useMemo } from 'react';

export interface FilterOptions {
  searchTerm: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  status?: string[];
  severity?: string[];
  riskScore?: {
    min: number;
    max: number;
  };
  amountRange?: {
    min: number;
    max: number;
  };
}

export function useAdvancedSearch<T>(
  data: T[],
  searchFields: (keyof T)[],
  filterOptions: FilterOptions
) {
  const [searchTerm, setSearchTerm] = useState(filterOptions.searchTerm || '');
  const [filters, setFilters] = useState(filterOptions);

  const filteredData = useMemo(() => {
    let result = data;

    // Text search
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(item =>
        searchFields.some(field => {
          const value = item[field];
          return value && String(value).toLowerCase().includes(lowerSearchTerm);
        })
      );
    }

    // Status filter
    if (filters.status && filters.status.length > 0) {
      result = result.filter(item => {
        const statusField = item as any;
        return filters.status!.includes(statusField.status);
      });
    }

    // Severity filter
    if (filters.severity && filters.severity.length > 0) {
      result = result.filter(item => {
        const severityField = item as any;
        return filters.severity!.includes(severityField.severity);
      });
    }

    // Risk score filter
    if (filters.riskScore) {
      result = result.filter(item => {
        const riskField = item as any;
        return riskField.riskScore >= filters.riskScore!.min && 
               riskField.riskScore <= filters.riskScore!.max;
      });
    }

    // Amount range filter
    if (filters.amountRange) {
      result = result.filter(item => {
        const amountField = item as any;
        return amountField.amount >= filters.amountRange!.min && 
               amountField.amount <= filters.amountRange!.max;
      });
    }

    // Date range filter
    if (filters.dateRange) {
      result = result.filter(item => {
        const dateField = item as any;
        const itemDate = new Date(dateField.date || dateField.timestamp);
        return itemDate >= filters.dateRange!.start && itemDate <= filters.dateRange!.end;
      });
    }

    return result;
  }, [data, searchTerm, filters, searchFields]);

  const updateSearchTerm = (term: string) => {
    setSearchTerm(term);
  };

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      searchTerm: '',
    });
  };

  return {
    filteredData,
    searchTerm,
    filters,
    updateSearchTerm,
    updateFilters,
    clearFilters,
  };
}

// Specific hooks for different data types
export function useClientSearch(clients: any[]) {
  return useAdvancedSearch(
    clients,
    ['name', 'pan', 'id', 'email'],
    { searchTerm: '' }
  );
}

export function useTransactionSearch(transactions: any[]) {
  return useAdvancedSearch(
    transactions,
    ['id', 'client', 'description'],
    { searchTerm: '' }
  );
}

export function useAlertSearch(alerts: any[]) {
  return useAdvancedSearch(
    alerts,
    ['id', 'title', 'description', 'client'],
    { searchTerm: '' }
  );
}
