import { apiService, PaginatedResponse } from './ApiService';

export interface Alert {
  id: string;
  type: 'Transaction' | 'KYC' | 'Compliance' | 'Risk' | 'System';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  status: 'Open' | 'Investigating' | 'Resolved' | 'False Positive' | 'Escalated';
  priority: number;
  clientId?: string;
  clientName?: string;
  transactionId?: string;
  amount?: number;
  currency?: string;
  riskScore: number;
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  };
  assignedAt?: string;
  dueDate?: string;
  tags: string[];
  evidence: {
    id: string;
    type: 'Document' | 'Transaction' | 'Screenshot' | 'Log';
    url: string;
    description: string;
    uploadedAt: string;
  }[];
  notes: {
    id: string;
    content: string;
    author: {
      id: string;
      name: string;
    };
    createdAt: string;
  }[];
  resolution?: {
    resolution: string;
    resolvedBy: {
      id: string;
      name: string;
    };
    resolvedAt: string;
    notes?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AlertFilters {
  search?: string;
  type?: string[];
  severity?: string[];
  status?: string[];
  assignedTo?: string[];
  dateRange?: {
    from?: string;
    to?: string;
  };
  riskScore?: {
    min?: number;
    max?: number;
  };
  tags?: string[];
  priority?: {
    min?: number;
    max?: number;
  };
}

export interface CreateAlertData {
  type: Alert['type'];
  severity: Alert['severity'];
  title: string;
  description: string;
  clientId?: string;
  transactionId?: string;
  amount?: number;
  currency?: string;
  riskScore: number;
  tags?: string[];
  dueDate?: string;
}

export interface UpdateAlertData {
  status?: Alert['status'];
  assignedTo?: string;
  priority?: number;
  dueDate?: string;
  tags?: string[];
}

export interface AlertAnalytics {
  totalAlerts: number;
  openAlerts: number;
  resolvedAlerts: number;
  averageResolutionTime: number;
  severityDistribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  statusDistribution: {
    open: number;
    investigating: number;
    resolved: number;
    falsePositive: number;
    escalated: number;
  };
  typeDistribution: {
    transaction: number;
    kyc: number;
    compliance: number;
    risk: number;
    system: number;
  };
  monthlyTrends: {
    month: string;
    created: number;
    resolved: number;
    averageResolutionTime: number;
  }[];
  topTags: {
    tag: string;
    count: number;
  }[];
  performanceMetrics: {
    averageResponseTime: number;
    resolutionRate: number;
    escalationRate: number;
  };
}

class AlertService {
  async getAlerts(
    page: number = 1,
    limit: number = 10,
    filters?: AlertFilters
  ): Promise<PaginatedResponse<Alert>> {
    const params = {
      page,
      limit,
      ...filters,
    };

    return apiService.get<PaginatedResponse<Alert>>('/alerts', params);
  }

  async getAlert(id: string): Promise<Alert> {
    return apiService.get<Alert>(`/alerts/${id}`);
  }

  async createAlert(data: CreateAlertData): Promise<Alert> {
    return apiService.post<Alert>('/alerts', data);
  }

  async updateAlert(id: string, data: UpdateAlertData): Promise<Alert> {
    return apiService.put<Alert>(`/alerts/${id}`, data);
  }

  async deleteAlert(id: string): Promise<void> {
    return apiService.delete<void>(`/alerts/${id}`);
  }

  async assignAlert(id: string, userId: string, dueDate?: string): Promise<Alert> {
    return apiService.post<Alert>(`/alerts/${id}/assign`, {
      userId,
      dueDate,
    });
  }

  async unassignAlert(id: string): Promise<Alert> {
    return apiService.post<Alert>(`/alerts/${id}/unassign`);
  }

  async updateAlertStatus(
    id: string,
    status: Alert['status'],
    notes?: string
  ): Promise<Alert> {
    return apiService.post<Alert>(`/alerts/${id}/status`, {
      status,
      notes,
    });
  }

  async resolveAlert(
    id: string,
    resolution: string,
    notes?: string
  ): Promise<Alert> {
    return apiService.post<Alert>(`/alerts/${id}/resolve`, {
      resolution,
      notes,
    });
  }

  async escalateAlert(id: string, reason: string, escalateTo?: string): Promise<Alert> {
    return apiService.post<Alert>(`/alerts/${id}/escalate`, {
      reason,
      escalateTo,
    });
  }

  async addAlertNote(id: string, content: string): Promise<Alert> {
    return apiService.post<Alert>(`/alerts/${id}/notes`, { content });
  }

  async uploadAlertEvidence(
    id: string,
    file: File,
    type: Alert['evidence'][0]['type'],
    description: string
  ): Promise<Alert['evidence'][0]> {
    return apiService.uploadFile<Alert['evidence'][0]>(
      `/alerts/${id}/evidence`,
      file,
      { type, description }
    );
  }

  async downloadAlertEvidence(
    id: string,
    evidenceId: string,
    filename?: string
  ): Promise<void> {
    return apiService.downloadFile(`/alerts/${id}/evidence/${evidenceId}`, filename);
  }

  async bulkUpdateAlerts(
    ids: string[],
    updates: UpdateAlertData
  ): Promise<Alert[]> {
    return apiService.post<Alert[]>('/alerts/bulk-update', { ids, updates });
  }

  async bulkAssignAlerts(
    ids: string[],
    userId: string,
    dueDate?: string
  ): Promise<Alert[]> {
    return apiService.post<Alert[]>('/alerts/bulk-assign', {
      ids,
      userId,
      dueDate,
    });
  }

  async getAlertAnalytics(filters?: AlertFilters): Promise<AlertAnalytics> {
    return apiService.get('/alerts/analytics', filters);
  }

  async getMyAlerts(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Alert>> {
    return apiService.get<PaginatedResponse<Alert>>('/alerts/my-alerts', {
      page,
      limit,
    });
  }

  async getOverdueAlerts(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Alert>> {
    return apiService.get<PaginatedResponse<Alert>>('/alerts/overdue', {
      page,
      limit,
    });
  }

  async getHighPriorityAlerts(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Alert>> {
    return apiService.get<PaginatedResponse<Alert>>('/alerts/high-priority', {
      page,
      limit,
    });
  }

  async exportAlerts(
    filters?: AlertFilters,
    format: 'csv' | 'excel' = 'csv'
  ): Promise<void> {
    const params = {
      ...filters,
      format,
    };
    
    return apiService.downloadFile('/alerts/export', `alerts_export.${format}`);
  }

  async getAlertTrends(
    period: 'daily' | 'weekly' | 'monthly' = 'daily',
    days: number = 30
  ): Promise<{
    period: string;
    data: {
      date: string;
      created: number;
      resolved: number;
      open: number;
      averageResolutionTime: number;
    }[];
  }> {
    return apiService.get('/alerts/trends', { period, days });
  }
}

export const alertService = new AlertService();
