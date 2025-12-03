import { useState, useEffect, useCallback, useRef } from 'react';
import { dataService, DataResponse, PaginationParams, FilterParams } from '@/services/DataService';

interface UseDataServiceOptions {
  endpoint: string;
  params?: any;
  autoFetch?: boolean;
  refreshInterval?: number;
  enableRealTime?: boolean;
}

interface UseDataServiceReturn<T> {
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
  setFilters: (filters: FilterParams) => void;
  clearCache: () => void;
}

export function useDataService<T>({
  endpoint,
  params = {},
  autoFetch = true,
  refreshInterval,
  enableRealTime = true
}: UseDataServiceOptions): UseDataServiceReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [hasMore, setHasMore] = useState(false);
  
  const paramsRef = useRef(params);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Update params ref when params change
  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  // Fetch data function
  const fetchData = useCallback(async (newParams?: any) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    
    try {
      setLoading(true);
      setError(null);

      const currentParams = newParams || paramsRef.current;
      const response: DataResponse<T> = await dataService.fetch<DataResponse<T>>(
        endpoint,
        {
          ...currentParams,
          page,
          limit
        }
      );

      if (!abortControllerRef.current.signal.aborted) {
        setData(response.data);
        setTotal(response.total);
        setHasMore(response.hasMore);
      }
    } catch (err) {
      if (!abortControllerRef.current?.signal.aborted) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setLoading(false);
      }
    }
  }, [endpoint, page, limit]);

  // Refetch function
  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  // Set params function
  const setParams = useCallback((newParams: any) => {
    paramsRef.current = { ...paramsRef.current, ...newParams };
    fetchData(newParams);
  }, [fetchData]);

  // Set page function
  const setPageNumber = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  // Set limit function
  const setLimitNumber = useCallback((newLimit: number) => {
    setLimit(newLimit);
  }, []);

  // Set filters function
  const setFilters = useCallback((filters: FilterParams) => {
    setParams({ filters });
  }, [setParams]);

  // Clear cache function
  const clearCache = useCallback(() => {
    dataService.clearCache(endpoint);
  }, [endpoint]);

  // Auto-fetch on mount and when dependencies change
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  // Set up real-time updates
  useEffect(() => {
    if (!enableRealTime) return;

    const unsubscribe = dataService.subscribe(endpoint, (newData: DataResponse<T>) => {
      setData(newData.data);
      setTotal(newData.total);
      setHasMore(newData.hasMore);
    });

    return unsubscribe;
  }, [endpoint, enableRealTime]);

  // Set up refresh interval
  useEffect(() => {
    if (!refreshInterval) return;

    const interval = setInterval(() => {
      fetchData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, fetchData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

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
    setPage: setPageNumber,
    setLimit: setLimitNumber,
    setFilters,
    clearCache
  };
}

// Specialized hooks for different data types
export function useClients(params?: any) {
  return useDataService({
    endpoint: 'clients',
    params,
    enableRealTime: true
  });
}

export function useTransactions(params?: any) {
  return useDataService({
    endpoint: 'transactions',
    params,
    enableRealTime: true,
    refreshInterval: 10000 // Refresh every 10 seconds
  });
}

export function useAlerts(params?: any) {
  return useDataService({
    endpoint: 'alerts',
    params,
    enableRealTime: true,
    refreshInterval: 5000 // Refresh every 5 seconds
  });
}

export function useReports(params?: any) {
  return useDataService({
    endpoint: 'reports',
    params,
    enableRealTime: false
  });
}

export function useAuditLogs(params?: any) {
  return useDataService({
    endpoint: 'audit-logs',
    params,
    enableRealTime: false
  });
}
