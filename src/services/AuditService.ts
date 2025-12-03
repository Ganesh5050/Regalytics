import { apiService, PaginatedResponse } from './ApiService';

export interface AuditLog {
  id: string;
  action: string;
  resource: string;
  resourceId: string;
  resourceType: 'Client' | 'Transaction' | 'Alert' | 'Report' | 'User' | 'System';
  operation: 'Create' | 'Read' | 'Update' | 'Delete' | 'Login' | 'Logout' | 'Export' | 'Import';
  performedBy: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  performedAt: string;
  ipAddress: string;
  userAgent: string;
  location?: {
    country: string;
    city: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  metadata: {
    [key: string]: any;
  };
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Success' | 'Failed' | 'Partial';
  errorMessage?: string;
  sessionId: string;
  requestId: string;
}

export interface AuditFilters {
  search?: string;
  action?: string[];
  resourceType?: string[];
  operation?: string[];
  performedBy?: string[];
  severity?: string[];
  status?: string[];
  dateRange?: {
    from?: string;
    to?: string;
  };
  ipAddress?: string;
  sessionId?: string;
}

export interface AuditAnalytics {
  totalLogs: number;
  logsByAction: {
    action: string;
    count: number;
  }[];
  logsByResourceType: {
    resourceType: string;
    count: number;
  }[];
  logsByOperation: {
    operation: string;
    count: number;
  }[];
  logsBySeverity: {
    severity: string;
    count: number;
  }[];
  logsByStatus: {
    status: string;
    count: number;
  }[];
  dailyTrends: {
    date: string;
    count: number;
    uniqueUsers: number;
    failedActions: number;
  }[];
  topUsers: {
    user: string;
    actionCount: number;
  }[];
  topResources: {
    resource: string;
    accessCount: number;
  }[];
  securityMetrics: {
    failedLogins: number;
    suspiciousActivities: number;
    dataExports: number;
    privilegeEscalations: number;
  };
}

class AuditService {
  async getAuditLogs(
    page: number = 1,
    limit: number = 10,
    filters?: AuditFilters
  ): Promise<PaginatedResponse<AuditLog>> {
    const params = {
      page,
      limit,
      ...filters,
    };

    return apiService.get<PaginatedResponse<AuditLog>>('/audit/logs', params);
  }

  async getAuditLog(id: string): Promise<AuditLog> {
    return apiService.get<AuditLog>(`/audit/logs/${id}`);
  }

  async getAuditLogsByResource(
    resourceType: string,
    resourceId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<AuditLog>> {
    return apiService.get<PaginatedResponse<AuditLog>>(
      `/audit/logs/resource/${resourceType}/${resourceId}`,
      { page, limit }
    );
  }

  async getAuditLogsByUser(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<AuditLog>> {
    return apiService.get<PaginatedResponse<AuditLog>>(
      `/audit/logs/user/${userId}`,
      { page, limit }
    );
  }

  async getAuditLogsBySession(
    sessionId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<AuditLog>> {
    return apiService.get<PaginatedResponse<AuditLog>>(
      `/audit/logs/session/${sessionId}`,
      { page, limit }
    );
  }

  async getAuditAnalytics(filters?: AuditFilters): Promise<AuditAnalytics> {
    return apiService.get('/audit/analytics', filters);
  }

  async getSecurityEvents(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<AuditLog>> {
    return apiService.get<PaginatedResponse<AuditLog>>('/audit/security-events', {
      page,
      limit,
    });
  }

  async getFailedActions(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<AuditLog>> {
    return apiService.get<PaginatedResponse<AuditLog>>('/audit/failed-actions', {
      page,
      limit,
    });
  }

  async getDataAccessLogs(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<AuditLog>> {
    return apiService.get<PaginatedResponse<AuditLog>>('/audit/data-access', {
      page,
      limit,
    });
  }

  async getLoginLogs(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<AuditLog>> {
    return apiService.get<PaginatedResponse<AuditLog>>('/audit/login-logs', {
      page,
      limit,
    });
  }

  async getExportLogs(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<AuditLog>> {
    return apiService.get<PaginatedResponse<AuditLog>>('/audit/export-logs', {
      page,
      limit,
    });
  }

  async exportAuditLogs(
    filters?: AuditFilters,
    format: 'csv' | 'excel' | 'json' = 'csv'
  ): Promise<void> {
    const params = {
      ...filters,
      format,
    };
    
    return apiService.downloadFile('/audit/export', `audit_logs_export.${format}`);
  }

  async getAuditTrends(
    period: 'daily' | 'weekly' | 'monthly' = 'daily',
    days: number = 30
  ): Promise<{
    period: string;
    data: {
      date: string;
      totalActions: number;
      uniqueUsers: number;
      failedActions: number;
      securityEvents: number;
    }[];
  }> {
    return apiService.get('/audit/trends', { period, days });
  }

  async getAuditSummary(
    dateRange?: {
      from: string;
      to: string;
    }
  ): Promise<{
    totalActions: number;
    uniqueUsers: number;
    failedActions: number;
    securityEvents: number;
    topActions: {
      action: string;
      count: number;
    }[];
    topUsers: {
      user: string;
      actionCount: number;
    }[];
    recentActivities: AuditLog[];
  }> {
    return apiService.get('/audit/summary', dateRange);
  }

  async searchAuditLogs(
    query: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<AuditLog>> {
    return apiService.get<PaginatedResponse<AuditLog>>('/audit/search', {
      q: query,
      page,
      limit,
    });
  }

  async getAuditLogDetails(id: string): Promise<{
    log: AuditLog;
    relatedLogs: AuditLog[];
    userProfile: {
      id: string;
      name: string;
      email: string;
      role: string;
      lastLogin: string;
      totalActions: number;
    };
    resourceDetails?: any;
  }> {
    return apiService.get(`/audit/logs/${id}/details`);
  }

  async createAuditLog(data: {
    action: string;
    resource: string;
    resourceId: string;
    resourceType: AuditLog['resourceType'];
    operation: AuditLog['operation'];
    changes?: AuditLog['changes'];
    metadata?: { [key: string]: any };
    severity?: AuditLog['severity'];
  }): Promise<AuditLog> {
    return apiService.post<AuditLog>('/audit/logs', data);
  }
}

export const auditService = new AuditService();
