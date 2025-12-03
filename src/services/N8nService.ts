import axios, { AxiosInstance } from 'axios';

export interface N8nWorkflow {
  id: string;
  name: string;
  active: boolean;
  nodes: any[];
  connections: any;
  settings: any;
  createdAt: string;
  updatedAt: string;
}

export interface N8nExecution {
  id: string;
  finished: boolean;
  mode: 'manual' | 'trigger' | 'webhook';
  retryOf?: string;
  retrySuccessId?: string;
  startedAt: string;
  stoppedAt?: string;
  workflowData: N8nWorkflow;
  data: any;
}

export interface N8nWebhookResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface N8nCredentials {
  id: string;
  name: string;
  type: string;
  data: any;
}

class N8nService {
  private api: AxiosInstance;
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_N8N_URL || 'https://your-n8n-instance.app.n8n.cloud';
    this.apiKey = import.meta.env.VITE_N8N_API_KEY || '';
    
    this.api = axios.create({
      baseURL: `${this.baseUrl}/api/v1`,
      headers: {
        'X-N8N-API-KEY': this.apiKey,
        'Content-Type': 'application/json',
      },
    });
  }

  // Workflow Management
  async getWorkflows(): Promise<N8nWorkflow[]> {
    try {
      const response = await this.api.get('/workflows');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching workflows:', error);
      return [];
    }
  }

  async getWorkflow(id: string): Promise<N8nWorkflow | null> {
    try {
      const response = await this.api.get(`/workflows/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching workflow ${id}:`, error);
      return null;
    }
  }

  async createWorkflow(workflow: Partial<N8nWorkflow>): Promise<N8nWorkflow | null> {
    try {
      const response = await this.api.post('/workflows', workflow);
      return response.data.data;
    } catch (error) {
      console.error('Error creating workflow:', error);
      return null;
    }
  }

  async updateWorkflow(id: string, workflow: Partial<N8nWorkflow>): Promise<N8nWorkflow | null> {
    try {
      const response = await this.api.put(`/workflows/${id}`, workflow);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating workflow ${id}:`, error);
      return null;
    }
  }

  async deleteWorkflow(id: string): Promise<boolean> {
    try {
      await this.api.delete(`/workflows/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting workflow ${id}:`, error);
      return false;
    }
  }

  async activateWorkflow(id: string): Promise<boolean> {
    try {
      await this.api.post(`/workflows/${id}/activate`);
      return true;
    } catch (error) {
      console.error(`Error activating workflow ${id}:`, error);
      return false;
    }
  }

  async deactivateWorkflow(id: string): Promise<boolean> {
    try {
      await this.api.post(`/workflows/${id}/deactivate`);
      return true;
    } catch (error) {
      console.error(`Error deactivating workflow ${id}:`, error);
      return false;
    }
  }

  // Execution Management
  async getExecutions(workflowId?: string, limit: number = 20): Promise<N8nExecution[]> {
    try {
      const params: any = { limit };
      if (workflowId) params.workflowId = workflowId;
      
      const response = await this.api.get('/executions', { params });
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching executions:', error);
      return [];
    }
  }

  async getExecution(id: string): Promise<N8nExecution | null> {
    try {
      const response = await this.api.get(`/executions/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching execution ${id}:`, error);
      return null;
    }
  }

  async executeWorkflow(id: string, data?: any): Promise<N8nExecution | null> {
    try {
      const response = await this.api.post(`/workflows/${id}/execute`, data);
      return response.data.data;
    } catch (error) {
      console.error(`Error executing workflow ${id}:`, error);
      return null;
    }
  }

  // Webhook Triggers
  async triggerWebhook(webhookUrl: string, data: any): Promise<N8nWebhookResponse> {
    try {
      const response = await axios.post(webhookUrl, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Error triggering webhook:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Credentials Management
  async getCredentials(): Promise<N8nCredentials[]> {
    try {
      const response = await this.api.get('/credentials');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching credentials:', error);
      return [];
    }
  }

  // Health Check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.api.get('/health');
      return response.status === 200;
    } catch (error) {
      console.error('N8n health check failed:', error);
      return false;
    }
  }

  // Mock Data for Development (when n8n is not available)
  getMockWorkflows(): N8nWorkflow[] {
    return [
      {
        id: '1',
        name: 'KYC Verification Workflow',
        active: true,
        nodes: [],
        connections: {},
        settings: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Transaction Monitoring',
        active: true,
        nodes: [],
        connections: {},
        settings: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Compliance Reporting',
        active: false,
        nodes: [],
        connections: {},
        settings: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  getMockExecutions(): N8nExecution[] {
    return [
      {
        id: '1',
        finished: true,
        mode: 'trigger',
        startedAt: new Date(Date.now() - 60000).toISOString(),
        stoppedAt: new Date().toISOString(),
        workflowData: this.getMockWorkflows()[0],
        data: { success: true },
      },
      {
        id: '2',
        finished: false,
        mode: 'manual',
        startedAt: new Date(Date.now() - 30000).toISOString(),
        workflowData: this.getMockWorkflows()[1],
        data: { running: true },
      },
    ];
  }
}

export default new N8nService();
