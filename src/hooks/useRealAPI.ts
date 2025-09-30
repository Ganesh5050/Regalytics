import { useState, useEffect, useCallback } from 'react';
import { clientService, Client, ClientFilters } from '@/services/ClientService';
import { transactionService, Transaction, TransactionFilters } from '@/services/TransactionService';
import { alertService, Alert, AlertFilters } from '@/services/AlertService';
import { reportService, Report, ReportFilters } from '@/services/ReportService';
import { auditService, AuditLog, AuditFilters } from '@/services/AuditService';
import { enhancedDataService } from '@/services/EnhancedDataService';

export interface UseRealAPIOptions {
  endpoint: string;
  params?: any;
  autoFetch?: boolean;
  refreshInterval?: number;
  enableRealTime?: boolean;
}

export interface UseRealAPIReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  refetch: () => Promise<void>;
  setParams: (params: any) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  clearCache: () => void;
}

export function useRealAPI<T>({
  endpoint,
  params = {},
  autoFetch = true,
  refreshInterval,
  enableRealTime = true
}: UseRealAPIOptions): UseRealAPIReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [hasMore, setHasMore] = useState(false);
  const [currentParams, setCurrentParams] = useState(params);

  const fetchData = useCallback(async (newParams?: any) => {
    try {
      setLoading(true);
      setError(null);

      const paramsToUse = newParams || currentParams;
      const response = await enhancedDataService.fetch<any>(
        endpoint,
        {
          ...paramsToUse,
          page,
          limit
        }
      );

      setData(response.data || []);
      setTotal(response.total || 0);
      setHasMore(response.hasMore || false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [endpoint, page, limit, currentParams]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const setParams = useCallback((newParams: any) => {
    setCurrentParams(newParams);
    setPage(1); // Reset to first page when params change
  }, []);

  const clearCache = useCallback(() => {
    enhancedDataService.clearCache(endpoint);
  }, [endpoint]);

  // Auto-fetch on mount and when dependencies change
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  // Set up refresh interval
  useEffect(() => {
    if (!refreshInterval) return;

    const interval = setInterval(() => {
      fetchData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, fetchData]);

  // Set up real-time updates
  useEffect(() => {
    if (!enableRealTime) return;

    const unsubscribe = enhancedDataService.subscribe(endpoint, (newData: any) => {
      setData(newData.data || []);
      setTotal(newData.total || 0);
      setHasMore(newData.hasMore || false);
    });

    return unsubscribe;
  }, [endpoint, enableRealTime]);

  return {
    data,
    loading,
    error,
    total,
    page,
    limit,
    hasMore,
    refetch,
    setParams,
    setPage,
    setLimit,
    clearCache
  };
}

// Specialized hooks for different data types
export function useClientsAPI(filters?: ClientFilters) {
  return useRealAPI<Client>({
    endpoint: '/clients',
    params: filters,
    autoFetch: true,
    refreshInterval: 30000, // 30 seconds
    enableRealTime: true
  });
}

export function useTransactionsAPI(filters?: TransactionFilters) {
  return useRealAPI<Transaction>({
    endpoint: '/transactions',
    params: filters,
    autoFetch: true,
    refreshInterval: 15000, // 15 seconds for more frequent updates
    enableRealTime: true
  });
}

export function useAlertsAPI(filters?: AlertFilters) {
  return useRealAPI<Alert>({
    endpoint: '/alerts',
    params: filters,
    autoFetch: true,
    refreshInterval: 10000, // 10 seconds for critical alerts
    enableRealTime: true
  });
}

export function useReportsAPI(filters?: ReportFilters) {
  return useRealAPI<Report>({
    endpoint: '/reports',
    params: filters,
    autoFetch: true,
    refreshInterval: 60000, // 1 minute for reports
    enableRealTime: false // Reports don't need real-time updates
  });
}

export function useAuditLogsAPI(filters?: AuditFilters) {
  return useRealAPI<AuditLog>({
    endpoint: '/audit/logs',
    params: filters,
    autoFetch: true,
    refreshInterval: 30000, // 30 seconds
    enableRealTime: false // Audit logs are typically not real-time
  });
}

// Health check hook
export function useAPIHealth() {
  const [health, setHealth] = useState<{
    status: string;
    services: { [key: string]: boolean };
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const healthStatus = await enhancedDataService.healthCheck();
      setHealth(healthStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Health check failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
    
    // Check health every 5 minutes
    const interval = setInterval(checkHealth, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [checkHealth]);

  return {
    health,
    loading,
    error,
    refetch: checkHealth
  };
}
