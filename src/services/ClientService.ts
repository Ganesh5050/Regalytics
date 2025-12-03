import { apiService, PaginatedResponse } from './ApiService';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  pan: string;
  aadhaar: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  riskScore: number;
  kycStatus: 'Complete' | 'Pending' | 'Incomplete' | 'Rejected';
  documents: {
    id: string;
    type: string;
    url: string;
    status: 'Verified' | 'Pending' | 'Rejected';
    uploadedAt: string;
  }[];
  complianceFlags: string[];
  lastUpdate: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientFilters {
  search?: string;
  riskScore?: {
    min?: number;
    max?: number;
  };
  kycStatus?: string[];
  dateRange?: {
    from?: string;
    to?: string;
  };
  complianceFlags?: string[];
}

export interface CreateClientData {
  name: string;
  email: string;
  phone?: string;
  pan: string;
  aadhaar: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
}

export interface UpdateClientData extends Partial<CreateClientData> {
  riskScore?: number;
  kycStatus?: Client['kycStatus'];
  complianceFlags?: string[];
}

class ClientService {
  async getClients(
    page: number = 1,
    limit: number = 10,
    filters?: ClientFilters
  ): Promise<PaginatedResponse<Client>> {
    const params = {
      page,
      limit,
      ...filters,
    };

    return apiService.get<PaginatedResponse<Client>>('/clients', params);
  }

  async getClient(id: string): Promise<Client> {
    return apiService.get<Client>(`/clients/${id}`);
  }

  async createClient(data: CreateClientData): Promise<Client> {
    return apiService.post<Client>('/clients', data);
  }

  async updateClient(id: string, data: UpdateClientData): Promise<Client> {
    return apiService.put<Client>(`/clients/${id}`, data);
  }

  async deleteClient(id: string): Promise<void> {
    return apiService.delete<void>(`/clients/${id}`);
  }

  async bulkUpdateClients(ids: string[], data: UpdateClientData): Promise<Client[]> {
    return apiService.post<Client[]>('/clients/bulk-update', { ids, data });
  }

  async bulkDeleteClients(ids: string[]): Promise<void> {
    return apiService.post<void>('/clients/bulk-delete', { ids });
  }

  async uploadDocument(clientId: string, file: File, type: string): Promise<Client['documents'][0]> {
    return apiService.uploadFile<Client['documents'][0]>(
      `/clients/${clientId}/documents`,
      file,
      { type }
    );
  }

  async downloadDocument(clientId: string, documentId: string, filename?: string): Promise<void> {
    return apiService.downloadFile(`/clients/${clientId}/documents/${documentId}`, filename);
  }

  async updateRiskScore(clientId: string, riskScore: number, reason?: string): Promise<Client> {
    return apiService.post<Client>(`/clients/${clientId}/risk-score`, {
      riskScore,
      reason,
    });
  }

  async updateKYCStatus(clientId: string, status: Client['kycStatus'], notes?: string): Promise<Client> {
    return apiService.post<Client>(`/clients/${clientId}/kyc-status`, {
      status,
      notes,
    });
  }

  async getClientAnalytics(): Promise<{
    totalClients: number;
    riskDistribution: {
      low: number;
      medium: number;
      high: number;
    };
    kycStatusDistribution: {
      complete: number;
      pending: number;
      incomplete: number;
      rejected: number;
    };
    monthlyTrends: {
      month: string;
      newClients: number;
      completedKYC: number;
    }[];
  }> {
    return apiService.get('/clients/analytics');
  }

  async exportClients(filters?: ClientFilters, format: 'csv' | 'excel' = 'csv'): Promise<void> {
    const params = {
      ...filters,
      format,
    };
    
    return apiService.downloadFile('/clients/export', `clients_export.${format}`);
  }
}

export const clientService = new ClientService();
