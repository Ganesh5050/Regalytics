import { apiService, PaginatedResponse } from './ApiService';

export interface Report {
  id: string;
  name: string;
  description: string;
  type: 'Compliance' | 'Risk' | 'Transaction' | 'Client' | 'Alert' | 'Custom';
  category: string;
  format: 'PDF' | 'Excel' | 'CSV' | 'JSON';
  status: 'Draft' | 'Generating' | 'Ready' | 'Failed' | 'Expired';
  template?: {
    id: string;
    name: string;
    version: string;
  };
  parameters: {
    [key: string]: any;
  };
  filters: {
    dateRange?: {
      from: string;
      to: string;
    };
    clients?: string[];
    transactions?: string[];
    alerts?: string[];
    [key: string]: any;
  };
  schedule?: {
    frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly';
    time: string;
    timezone: string;
    recipients: string[];
    enabled: boolean;
  };
  generatedBy: {
    id: string;
    name: string;
    email: string;
  };
  generatedAt?: string;
  expiresAt?: string;
  fileSize?: number;
  downloadCount: number;
  lastDownloadedAt?: string;
  lastDownloadedBy?: {
    id: string;
    name: string;
  };
  metadata: {
    recordCount?: number;
    processingTime?: number;
    version: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: Report['type'];
  category: string;
  version: string;
  parameters: {
    name: string;
    type: 'string' | 'number' | 'date' | 'boolean' | 'select' | 'multiselect';
    required: boolean;
    defaultValue?: any;
    options?: string[];
    label: string;
    description?: string;
  }[];
  filters: {
    name: string;
    type: 'dateRange' | 'select' | 'multiselect' | 'text' | 'number';
    required: boolean;
    options?: string[];
    label: string;
    description?: string;
  }[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReportFilters {
  search?: string;
  type?: string[];
  status?: string[];
  category?: string[];
  generatedBy?: string[];
  dateRange?: {
    from?: string;
    to?: string;
  };
}

export interface CreateReportData {
  name: string;
  description: string;
  type: Report['type'];
  category: string;
  format: Report['format'];
  templateId?: string;
  parameters?: {
    [key: string]: any;
  };
  filters?: Report['filters'];
  schedule?: Report['schedule'];
}

export interface ReportAnalytics {
  totalReports: number;
  reportsByType: {
    type: string;
    count: number;
  }[];
  reportsByStatus: {
    status: string;
    count: number;
  }[];
  reportsByFormat: {
    format: string;
    count: number;
  }[];
  monthlyTrends: {
    month: string;
    generated: number;
    downloaded: number;
    averageSize: number;
  }[];
  topTemplates: {
    template: string;
    usage: number;
  }[];
  performanceMetrics: {
    averageGenerationTime: number;
    successRate: number;
    averageFileSize: number;
  };
}

class ReportService {
  async getReports(
    page: number = 1,
    limit: number = 10,
    filters?: ReportFilters
  ): Promise<PaginatedResponse<Report>> {
    const params = {
      page,
      limit,
      ...filters,
    };

    return apiService.get<PaginatedResponse<Report>>('/reports', params);
  }

  async getReport(id: string): Promise<Report> {
    return apiService.get<Report>(`/reports/${id}`);
  }

  async createReport(data: CreateReportData): Promise<Report> {
    return apiService.post<Report>('/reports', data);
  }

  async updateReport(id: string, data: Partial<CreateReportData>): Promise<Report> {
    return apiService.put<Report>(`/reports/${id}`, data);
  }

  async deleteReport(id: string): Promise<void> {
    return apiService.delete<void>(`/reports/${id}`);
  }

  async generateReport(id: string): Promise<Report> {
    return apiService.post<Report>(`/reports/${id}/generate`);
  }

  async regenerateReport(id: string): Promise<Report> {
    return apiService.post<Report>(`/reports/${id}/regenerate`);
  }

  async downloadReport(id: string, filename?: string): Promise<void> {
    return apiService.downloadFile(`/reports/${id}/download`, filename);
  }

  async shareReport(
    id: string,
    recipients: string[],
    message?: string,
    expiresAt?: string
  ): Promise<{
    shareId: string;
    shareUrl: string;
    expiresAt?: string;
  }> {
    return apiService.post(`/reports/${id}/share`, {
      recipients,
      message,
      expiresAt,
    });
  }

  async getReportTemplates(): Promise<ReportTemplate[]> {
    return apiService.get<ReportTemplate[]>('/reports/templates');
  }

  async getReportTemplate(id: string): Promise<ReportTemplate> {
    return apiService.get<ReportTemplate>(`/reports/templates/${id}`);
  }

  async createReportFromTemplate(
    templateId: string,
    data: {
      name: string;
      description?: string;
      parameters: { [key: string]: any };
      filters: { [key: string]: any };
      format: Report['format'];
      schedule?: Report['schedule'];
    }
  ): Promise<Report> {
    return apiService.post<Report>(`/reports/templates/${templateId}/create`, data);
  }

  async getReportAnalytics(filters?: ReportFilters): Promise<ReportAnalytics> {
    return apiService.get('/reports/analytics', filters);
  }

  async getMyReports(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Report>> {
    return apiService.get<PaginatedResponse<Report>>('/reports/my-reports', {
      page,
      limit,
    });
  }

  async getScheduledReports(): Promise<Report[]> {
    return apiService.get<Report[]>('/reports/scheduled');
  }

  async updateReportSchedule(
    id: string,
    schedule: Report['schedule']
  ): Promise<Report> {
    return apiService.put<Report>(`/reports/${id}/schedule`, { schedule });
  }

  async deleteReportSchedule(id: string): Promise<Report> {
    return apiService.delete<Report>(`/reports/${id}/schedule`);
  }

  async getReportHistory(id: string): Promise<{
    id: string;
    action: string;
    performedBy: {
      id: string;
      name: string;
    };
    performedAt: string;
    details?: any;
  }[]> {
    return apiService.get(`/reports/${id}/history`);
  }

  async exportReports(
    filters?: ReportFilters,
    format: 'csv' | 'excel' = 'csv'
  ): Promise<void> {
    const params = {
      ...filters,
      format,
    };
    
    return apiService.downloadFile('/reports/export', `reports_export.${format}`);
  }

  async getReportTrends(
    period: 'daily' | 'weekly' | 'monthly' = 'daily',
    days: number = 30
  ): Promise<{
    period: string;
    data: {
      date: string;
      generated: number;
      downloaded: number;
      averageGenerationTime: number;
    }[];
  }> {
    return apiService.get('/reports/trends', { period, days });
  }

  async validateReportParameters(
    templateId: string,
    parameters: { [key: string]: any }
  ): Promise<{
    valid: boolean;
    errors: {
      parameter: string;
      message: string;
    }[];
  }> {
    return apiService.post(`/reports/templates/${templateId}/validate`, {
      parameters,
    });
  }
}

export const reportService = new ReportService();
