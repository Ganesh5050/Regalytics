// Enhanced data service with real API integration
import { apiService } from './ApiService';
import { clientService } from './ClientService';
import { transactionService } from './TransactionService';
import { alertService } from './AlertService';
import { reportService } from './ReportService';
import { auditService } from './AuditService';

export interface DataResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

class EnhancedDataService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes
  private subscribers = new Map<string, Set<(data: any) => void>>();
  private useRealAPI = true; // Always use real API now that backend is ready

  constructor(config?: { cacheTimeout?: number; useRealAPI?: boolean }) {
    if (config?.cacheTimeout) {
      this.cacheTimeout = config.cacheTimeout;
    }
    if (config?.useRealAPI !== undefined) {
      this.useRealAPI = config.useRealAPI;
    }
  }

  private getCacheKey(endpoint: string, params?: any): string {
    return `${endpoint}_${JSON.stringify(params || {})}`;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  private getCache(key: string): any {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  async fetch<T>(
    endpoint: string,
    params?: any,
    options?: RequestInit
  ): Promise<T> {
    const cacheKey = this.getCacheKey(endpoint, params);
    const cached = this.getCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    let data: T;

    if (this.useRealAPI) {
      // Use real API services
      data = await this.fetchFromRealAPI<T>(endpoint, params);
    } else {
      // Use mock data with simulated delay
      await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));
      data = await this.simulateApiCall<T>(endpoint, params);
    }

    this.setCache(cacheKey, data);
    return data;
  }

  private async fetchFromRealAPI<T>(endpoint: string, params?: any): Promise<T> {
    // Route to appropriate service based on endpoint
    if (endpoint.startsWith('/clients')) {
      return this.handleClientAPI<T>(endpoint, params);
    } else if (endpoint.startsWith('/transactions')) {
      return this.handleTransactionAPI<T>(endpoint, params);
    } else if (endpoint.startsWith('/alerts')) {
      return this.handleAlertAPI<T>(endpoint, params);
    } else if (endpoint.startsWith('/reports')) {
      return this.handleReportAPI<T>(endpoint, params);
    } else if (endpoint.startsWith('/audit')) {
      return this.handleAuditAPI<T>(endpoint, params);
    } else {
      // Fallback to generic API service
      return apiService.get<T>(endpoint, params);
    }
  }

  private async handleClientAPI<T>(endpoint: string, params?: any): Promise<T> {
    if (endpoint === '/clients') {
      return clientService.getClients(
        params?.page || 1,
        params?.limit || 10,
        params
      ) as Promise<T>;
    } else if (endpoint.startsWith('/clients/') && endpoint !== '/clients') {
      const id = endpoint.split('/')[2];
      if (endpoint.endsWith('/analytics')) {
        return clientService.getClientAnalytics() as Promise<T>;
      } else {
        return clientService.getClient(id) as Promise<T>;
      }
    }
    throw new Error(`Unknown client endpoint: ${endpoint}`);
  }

  private async handleTransactionAPI<T>(endpoint: string, params?: any): Promise<T> {
    if (endpoint === '/transactions') {
      return transactionService.getTransactions(
        params?.page || 1,
        params?.limit || 10,
        params
      ) as Promise<T>;
    } else if (endpoint.startsWith('/transactions/')) {
      const id = endpoint.split('/')[2];
      if (endpoint.endsWith('/analytics')) {
        return transactionService.getTransactionAnalytics(params) as Promise<T>;
      } else if (endpoint.endsWith('/suspicious')) {
        return transactionService.getSuspiciousTransactions(
          params?.page || 1,
          params?.limit || 10
        ) as Promise<T>;
      } else if (endpoint.endsWith('/high-risk')) {
        return transactionService.getHighRiskTransactions(
          params?.page || 1,
          params?.limit || 10
        ) as Promise<T>;
      } else {
        return transactionService.getTransaction(id) as Promise<T>;
      }
    }
    throw new Error(`Unknown transaction endpoint: ${endpoint}`);
  }

  private async handleAlertAPI<T>(endpoint: string, params?: any): Promise<T> {
    if (endpoint === '/alerts') {
      return alertService.getAlerts(
        params?.page || 1,
        params?.limit || 10,
        params
      ) as Promise<T>;
    } else if (endpoint.startsWith('/alerts/')) {
      const id = endpoint.split('/')[2];
      if (endpoint.endsWith('/analytics')) {
        return alertService.getAlertAnalytics(params) as Promise<T>;
      } else if (endpoint.endsWith('/my-alerts')) {
        return alertService.getMyAlerts(
          params?.page || 1,
          params?.limit || 10
        ) as Promise<T>;
      } else if (endpoint.endsWith('/overdue')) {
        return alertService.getOverdueAlerts(
          params?.page || 1,
          params?.limit || 10
        ) as Promise<T>;
      } else if (endpoint.endsWith('/high-priority')) {
        return alertService.getHighPriorityAlerts(
          params?.page || 1,
          params?.limit || 10
        ) as Promise<T>;
      } else {
        return alertService.getAlert(id) as Promise<T>;
      }
    }
    throw new Error(`Unknown alert endpoint: ${endpoint}`);
  }

  private async handleReportAPI<T>(endpoint: string, params?: any): Promise<T> {
    if (endpoint === '/reports') {
      return reportService.getReports(
        params?.page || 1,
        params?.limit || 10,
        params
      ) as Promise<T>;
    } else if (endpoint.startsWith('/reports/')) {
      const id = endpoint.split('/')[2];
      if (endpoint.endsWith('/analytics')) {
        return reportService.getReportAnalytics(params) as Promise<T>;
      } else if (endpoint.endsWith('/my-reports')) {
        return reportService.getMyReports(
          params?.page || 1,
          params?.limit || 10
        ) as Promise<T>;
      } else if (endpoint.endsWith('/scheduled')) {
        return reportService.getScheduledReports() as Promise<T>;
      } else {
        return reportService.getReport(id) as Promise<T>;
      }
    }
    throw new Error(`Unknown report endpoint: ${endpoint}`);
  }

  private async handleAuditAPI<T>(endpoint: string, params?: any): Promise<T> {
    if (endpoint === '/audit/logs') {
      return auditService.getAuditLogs(
        params?.page || 1,
        params?.limit || 10,
        params
      ) as Promise<T>;
    } else if (endpoint.startsWith('/audit/')) {
      if (endpoint.endsWith('/analytics')) {
        return auditService.getAuditAnalytics(params) as Promise<T>;
      } else if (endpoint.endsWith('/security-events')) {
        return auditService.getSecurityEvents(
          params?.page || 1,
          params?.limit || 10
        ) as Promise<T>;
      } else if (endpoint.endsWith('/failed-actions')) {
        return auditService.getFailedActions(
          params?.page || 1,
          params?.limit || 10
        ) as Promise<T>;
      } else if (endpoint.endsWith('/data-access')) {
        return auditService.getDataAccessLogs(
          params?.page || 1,
          params?.limit || 10
        ) as Promise<T>;
      } else if (endpoint.endsWith('/login-logs')) {
        return auditService.getLoginLogs(
          params?.page || 1,
          params?.limit || 10
        ) as Promise<T>;
      } else if (endpoint.endsWith('/export-logs')) {
        return auditService.getExportLogs(
          params?.page || 1,
          params?.limit || 10
        ) as Promise<T>;
      } else {
        const id = endpoint.split('/').pop();
        return auditService.getAuditLog(id!) as Promise<T>;
      }
    }
    throw new Error(`Unknown audit endpoint: ${endpoint}`);
  }

  private async simulateApiCall<T>(endpoint: string, params?: any): Promise<T> {
    // Mock data simulation - this would be replaced by the existing mock data
    // For now, return a basic structure
    return {
      data: [],
      total: 0,
      page: params?.page || 1,
      limit: params?.limit || 10,
      hasMore: false
    } as T;
  }

  // Real-time subscription methods
  subscribe(endpoint: string, callback: (data: any) => void): () => void {
    if (!this.subscribers.has(endpoint)) {
      this.subscribers.set(endpoint, new Set());
    }
    
    this.subscribers.get(endpoint)!.add(callback);
    
    return () => {
      const subscribers = this.subscribers.get(endpoint);
      if (subscribers) {
        subscribers.delete(callback);
        if (subscribers.size === 0) {
          this.subscribers.delete(endpoint);
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

  // Cache management
  clearCache(endpoint?: string): void {
    if (endpoint) {
      const keysToDelete = Array.from(this.cache.keys()).filter(key => 
        key.startsWith(endpoint)
      );
      keysToDelete.forEach(key => this.cache.delete(key));
    } else {
      this.cache.clear();
    }
  }

  // Utility methods
  async refresh(endpoint: string, params?: any): Promise<any> {
    const cacheKey = this.getCacheKey(endpoint, params);
    this.cache.delete(cacheKey);
    return this.fetch(endpoint, params);
  }

  // Health check
  async healthCheck(): Promise<{ status: string; services: { [key: string]: boolean } }> {
    const services = {
      api: false,
      clients: false,
      transactions: false,
      alerts: false,
      reports: false,
      audit: false
    };

    try {
      // Test basic API connectivity
      await apiService.get('/health');
      services.api = true;
    } catch (error) {
      console.warn('API health check failed:', error);
    }

    // Test individual services
    try {
      await clientService.getClients(1, 1);
      services.clients = true;
    } catch (error) {
      console.warn('Client service health check failed:', error);
    }

    try {
      await transactionService.getTransactions(1, 1);
      services.transactions = true;
    } catch (error) {
      console.warn('Transaction service health check failed:', error);
    }

    try {
      await alertService.getAlerts(1, 1);
      services.alerts = true;
    } catch (error) {
      console.warn('Alert service health check failed:', error);
    }

    try {
      await reportService.getReports(1, 1);
      services.reports = true;
    } catch (error) {
      console.warn('Report service health check failed:', error);
    }

    try {
      await auditService.getAuditLogs(1, 1);
      services.audit = true;
    } catch (error) {
      console.warn('Audit service health check failed:', error);
    }

    const allHealthy = Object.values(services).every(status => status);
    
    return {
      status: allHealthy ? 'healthy' : 'degraded',
      services
    };
  }
}

export const enhancedDataService = new EnhancedDataService();
