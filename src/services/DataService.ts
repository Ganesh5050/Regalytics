/**
 * Centralized data service for managing application data
 * Provides caching, pagination, and real-time updates
 */

export interface DataServiceConfig {
  cacheSize?: number;
  refreshInterval?: number;
  enableRealTime?: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  [key: string]: any;
}

export interface DataResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

class DataService {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private subscribers = new Map<string, Set<(data: any) => void>>();
  private refreshIntervals = new Map<string, NodeJS.Timeout>();
  
  private config: DataServiceConfig = {
    cacheSize: 100,
    refreshInterval: 30000, // 30 seconds
    enableRealTime: true
  };

  constructor(config?: DataServiceConfig) {
    this.config = { ...this.config, ...config };
  }

  // Cache management
  private getCacheKey(endpoint: string, params?: any): string {
    return `${endpoint}:${JSON.stringify(params || {})}`;
  }

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    
    const now = Date.now();
    return now - cached.timestamp < cached.ttl;
  }

  private setCache(key: string, data: any, ttl: number = 300000): void {
    // Clean up old cache entries if we exceed the cache size
    if (this.cache.size >= this.config.cacheSize!) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  private getCache(key: string): any {
    const cached = this.cache.get(key);
    return cached ? cached.data : null;
  }

  // Data fetching with caching
  async fetch<T>(
    endpoint: string,
    params?: any,
    options?: RequestInit
  ): Promise<T> {
    const cacheKey = this.getCacheKey(endpoint, params);
    
    // Return cached data if valid
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      // Simulate API call with mock data
      const data = await this.simulateApiCall<T>(endpoint, params);
      
      // Cache the result
      this.setCache(cacheKey, data);
      
      // Notify subscribers
      this.notifySubscribers(endpoint, data);
      
      return data;
    } catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error);
      throw error;
    }
  }

  // Simulate API calls with mock data
  private async simulateApiCall<T>(endpoint: string, params?: any): Promise<T> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100));

    // Return mock data based on endpoint
    switch (endpoint) {
      case 'clients':
        return this.getMockClients(params) as T;
      case 'transactions':
        return this.getMockTransactions(params) as T;
      case 'alerts':
        return this.getMockAlerts(params) as T;
      case 'reports':
        return this.getMockReports(params) as T;
      case 'audit-logs':
        return this.getMockAuditLogs(params) as T;
      default:
        return [] as T;
    }
  }

  // Mock data generators
  private getMockClients(params?: any) {
    const clients = [
      {
        id: "CLI001",
        name: "Rajesh Industries Pvt Ltd",
        pan: "ABCDE1234F",
        aadhaar: "1234-5678-9012",
        riskScore: 85,
        kycStatus: "Complete",
        lastUpdate: "2024-01-15"
      },
      {
        id: "CLI002",
        name: "Sunita Enterprises",
        pan: "FGHIJ5678K",
        aadhaar: "2345-6789-0123",
        riskScore: 45,
        kycStatus: "Pending",
        lastUpdate: "2024-01-14"
      },
      {
        id: "CLI003",
        name: "Amit Trading Co",
        pan: "KLMNO9012P",
        aadhaar: "3456-7890-1234",
        riskScore: 72,
        kycStatus: "Complete",
        lastUpdate: "2024-01-13"
      }
    ];

    return this.applyFiltersAndPagination(clients, params);
  }

  private getMockTransactions(params?: any) {
    const transactions = [
      {
        id: "TXN20240115001",
        client: "Rajesh Industries Pvt Ltd",
        type: "Credit",
        amount: 150000,
        method: "NEFT",
        date: "2024-01-15",
        time: "10:30 AM",
        status: "Cleared",
        suspicious: false
      },
      {
        id: "TXN20240115002",
        client: "Sunita Enterprises",
        type: "Debit",
        amount: 75000,
        method: "RTGS",
        date: "2024-01-15",
        time: "11:15 AM",
        status: "Flagged",
        suspicious: true
      }
    ];

    return this.applyFiltersAndPagination(transactions, params);
  }

  private getMockAlerts(params?: any) {
    const alerts = [
      {
        id: "ALT001",
        severity: "HIGH",
        status: "Open",
        title: "Suspicious Transaction Detected",
        description: "Large transaction from high-risk client",
        client: "Rajesh Industries Pvt Ltd",
        amount: "₹1,50,000",
        timestamp: "2024-01-15T10:30:00Z",
        assignedTo: "John Doe",
        riskScore: 85
      }
    ];

    return this.applyFiltersAndPagination(alerts, params);
  }

  private getMockReports(params?: any) {
    const reports = [
      {
        id: "RPT001",
        name: "Monthly Compliance Report",
        description: "Comprehensive compliance analysis for January 2024",
        type: "Compliance",
        format: "PDF",
        size: "2.4 MB",
        status: "Ready",
        generated: "2024-01-15 10:00 AM"
      }
    ];

    return this.applyFiltersAndPagination(reports, params);
  }

  private getMockAuditLogs(params?: any) {
    const auditLogs = [
      {
        id: "AUD001",
        user: "John Doe",
        action: "Login",
        status: "Success",
        severity: "Low",
        timestamp: "2024-01-15T10:00:00Z",
        details: "User logged in successfully"
      }
    ];

    return this.applyFiltersAndPagination(auditLogs, params);
  }

  // Apply filters and pagination
  private applyFiltersAndPagination<T>(data: T[], params?: any): DataResponse<T> {
    let filteredData = [...data];

    // Apply filters
    if (params?.filters) {
      filteredData = this.applyFilters(filteredData, params.filters);
    }

    // Apply search
    if (params?.search) {
      filteredData = this.applySearch(filteredData, params.search);
    }

    // Apply sorting
    if (params?.sortBy) {
      filteredData = this.applySorting(filteredData, params.sortBy, params.sortOrder);
    }

    // Apply pagination
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      data: filteredData.slice(startIndex, endIndex),
      total: filteredData.length,
      page,
      limit,
      hasMore: endIndex < filteredData.length
    };
  }

  private applyFilters<T>(data: T[], filters: FilterParams): T[] {
    return data.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value || (Array.isArray(value) && value.length === 0)) {
          return true;
        }

        if (Array.isArray(value)) {
          return value.includes(item[key as keyof T]);
        }

        if (typeof value === 'object' && value.min !== undefined && value.max !== undefined) {
          const itemValue = item[key as keyof T] as number;
          return itemValue >= value.min && itemValue <= value.max;
        }

        return item[key as keyof T] === value;
      });
    });
  }

  private applySearch<T>(data: T[], search: string): T[] {
    if (!search.trim()) return data;

    const term = search.toLowerCase();
    return data.filter(item => {
      return Object.values(item).some(value => 
        String(value).toLowerCase().includes(term)
      );
    });
  }

  private applySorting<T>(data: T[], sortBy: string, sortOrder: 'asc' | 'desc' = 'asc'): T[] {
    return [...data].sort((a, b) => {
      const aValue = a[sortBy as keyof T];
      const bValue = b[sortBy as keyof T];

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Real-time updates
  subscribe(endpoint: string, callback: (data: any) => void): () => void {
    if (!this.subscribers.has(endpoint)) {
      this.subscribers.set(endpoint, new Set());
    }

    this.subscribers.get(endpoint)!.add(callback);

    // Set up auto-refresh if enabled
    if (this.config.enableRealTime) {
      this.setupAutoRefresh(endpoint);
    }

    // Return unsubscribe function
    return () => {
      const subscribers = this.subscribers.get(endpoint);
      if (subscribers) {
        subscribers.delete(callback);
        if (subscribers.size === 0) {
          this.subscribers.delete(endpoint);
          this.clearAutoRefresh(endpoint);
        }
      }
    };
  }

  private notifySubscribers(endpoint: string, data: any): void {
    const subscribers = this.subscribers.get(endpoint);
    if (subscribers) {
      subscribers.forEach(callback => callback(data));
    }
  }

  private setupAutoRefresh(endpoint: string): void {
    if (this.refreshIntervals.has(endpoint)) return;

    const interval = setInterval(async () => {
      try {
        const data = await this.fetch(endpoint);
        this.notifySubscribers(endpoint, data);
      } catch (error) {
        console.error(`Auto-refresh failed for ${endpoint}:`, error);
      }
    }, this.config.refreshInterval);

    this.refreshIntervals.set(endpoint, interval);
  }

  private clearAutoRefresh(endpoint: string): void {
    const interval = this.refreshIntervals.get(endpoint);
    if (interval) {
      clearInterval(interval);
      this.refreshIntervals.delete(endpoint);
    }
  }

  // Cache management
  clearCache(endpoint?: string): void {
    if (endpoint) {
      // Clear specific endpoint cache
      const keysToDelete = Array.from(this.cache.keys()).filter(key => 
        key.startsWith(`${endpoint}:`)
      );
      keysToDelete.forEach(key => this.cache.delete(key));
    } else {
      // Clear all cache
      this.cache.clear();
    }
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  // Cleanup
  destroy(): void {
    this.cache.clear();
    this.subscribers.clear();
    this.refreshIntervals.forEach(interval => clearInterval(interval));
    this.refreshIntervals.clear();
  }
}

// Export singleton instance
export const dataService = new DataService();
