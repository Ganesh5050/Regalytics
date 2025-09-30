import { apiService, PaginatedResponse } from './ApiService';

export interface Transaction {
  id: string;
  clientId: string;
  clientName: string;
  type: 'Deposit' | 'Withdrawal' | 'Transfer' | 'Payment';
  amount: number;
  currency: string;
  status: 'Cleared' | 'Pending' | 'Flagged' | 'Under Review' | 'Rejected';
  timestamp: string;
  description: string;
  reference: string;
  source: {
    account: string;
    bank: string;
    branch: string;
  };
  destination: {
    account: string;
    bank: string;
    branch: string;
  };
  riskScore: number;
  complianceFlags: string[];
  suspiciousActivity: {
    detected: boolean;
    reasons: string[];
    severity: 'Low' | 'Medium' | 'High';
  };
  metadata: {
    ipAddress?: string;
    userAgent?: string;
    location?: {
      country: string;
      city: string;
      coordinates?: {
        lat: number;
        lng: number;
      };
    };
    device?: {
      type: string;
      os: string;
      browser: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFilters {
  search?: string;
  type?: string[];
  status?: string[];
  amountRange?: {
    min?: number;
    max?: number;
  };
  dateRange?: {
    from?: string;
    to?: string;
  };
  riskScore?: {
    min?: number;
    max?: number;
  };
  complianceFlags?: string[];
  suspiciousActivity?: boolean;
}

export interface TransactionAnalytics {
  totalTransactions: number;
  totalVolume: number;
  averageTransaction: number;
  statusDistribution: {
    cleared: number;
    pending: number;
    flagged: number;
    underReview: number;
    rejected: number;
  };
  typeDistribution: {
    deposit: number;
    withdrawal: number;
    transfer: number;
    payment: number;
  };
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
  dailyTrends: {
    date: string;
    count: number;
    volume: number;
    flagged: number;
  }[];
  monthlyTrends: {
    month: string;
    count: number;
    volume: number;
    averageRisk: number;
  }[];
}

class TransactionService {
  async getTransactions(
    page: number = 1,
    limit: number = 10,
    filters?: TransactionFilters
  ): Promise<PaginatedResponse<Transaction>> {
    const params = {
      page,
      limit,
      ...filters,
    };

    return apiService.get<PaginatedResponse<Transaction>>('/transactions', params);
  }

  async getTransaction(id: string): Promise<Transaction> {
    return apiService.get<Transaction>(`/transactions/${id}`);
  }

  async updateTransactionStatus(
    id: string,
    status: Transaction['status'],
    notes?: string
  ): Promise<Transaction> {
    return apiService.post<Transaction>(`/transactions/${id}/status`, {
      status,
      notes,
    });
  }

  async flagTransaction(
    id: string,
    reasons: string[],
    severity: Transaction['suspiciousActivity']['severity'],
    notes?: string
  ): Promise<Transaction> {
    return apiService.post<Transaction>(`/transactions/${id}/flag`, {
      reasons,
      severity,
      notes,
    });
  }

  async unflagTransaction(id: string, notes?: string): Promise<Transaction> {
    return apiService.post<Transaction>(`/transactions/${id}/unflag`, {
      notes,
    });
  }

  async updateRiskScore(
    id: string,
    riskScore: number,
    reason?: string
  ): Promise<Transaction> {
    return apiService.post<Transaction>(`/transactions/${id}/risk-score`, {
      riskScore,
      reason,
    });
  }

  async bulkUpdateTransactions(
    ids: string[],
    updates: {
      status?: Transaction['status'];
      riskScore?: number;
      complianceFlags?: string[];
    }
  ): Promise<Transaction[]> {
    return apiService.post<Transaction[]>('/transactions/bulk-update', {
      ids,
      updates,
    });
  }

  async getTransactionAnalytics(filters?: TransactionFilters): Promise<TransactionAnalytics> {
    return apiService.get('/transactions/analytics', filters);
  }

  async getSuspiciousTransactions(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Transaction>> {
    return apiService.get<PaginatedResponse<Transaction>>('/transactions/suspicious', {
      page,
      limit,
    });
  }

  async getHighRiskTransactions(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Transaction>> {
    return apiService.get<PaginatedResponse<Transaction>>('/transactions/high-risk', {
      page,
      limit,
    });
  }

  async exportTransactions(
    filters?: TransactionFilters,
    format: 'csv' | 'excel' = 'csv'
  ): Promise<void> {
    const params = {
      ...filters,
      format,
    };
    
    return apiService.downloadFile('/transactions/export', `transactions_export.${format}`);
  }

  async getTransactionTrends(
    period: 'daily' | 'weekly' | 'monthly' = 'daily',
    days: number = 30
  ): Promise<{
    period: string;
    data: {
      date: string;
      count: number;
      volume: number;
      averageRisk: number;
      flagged: number;
    }[];
  }> {
    return apiService.get('/transactions/trends', { period, days });
  }

  async getTransactionHeatmap(): Promise<{
    hour: number;
    day: number;
    count: number;
    volume: number;
  }[]> {
    return apiService.get('/transactions/heatmap');
  }
}

export const transactionService = new TransactionService();
