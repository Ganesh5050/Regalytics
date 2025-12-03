// Fallback API Service with automatic Railway → Render failover
import { apiService, ApiError } from './ApiService';

export interface BackendConfig {
  name: string;
  baseUrl: string;
  priority: number;
  isHealthy: boolean;
  lastChecked: number;
}

class FallbackApiService {
  private backends: BackendConfig[] = [
    {
      name: 'Railway',
      baseUrl: 'https://regalytics-production.up.railway.app/api',
      priority: 1,
      isHealthy: true,
      lastChecked: 0
    },
    {
      name: 'Render',
      baseUrl: 'https://regalytics-backend.onrender.com/api',
      priority: 2,
      isHealthy: true,
      lastChecked: 0
    }
  ];

  private currentBackend: BackendConfig;
  private healthCheckInterval = 30000; // 30 seconds
  private healthCheckTimeout: NodeJS.Timeout | null = null;

  constructor() {
    // Start with Railway as primary
    this.currentBackend = this.backends[0];
    this.startHealthChecks();
  }

  private async checkHealth(backend: BackendConfig): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(`${backend.baseUrl}/health`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      clearTimeout(timeoutId);
      const isHealthy = response.ok;
      
      console.log(`🔍 ${backend.name} health check: ${isHealthy ? '✅ Healthy' : '❌ Unhealthy'}`);
      return isHealthy;
    } catch (error) {
      console.log(`🔍 ${backend.name} health check: ❌ Unhealthy (${error instanceof Error ? error.message : 'Unknown error'})`);
      return false;
    }
  }

  private async startHealthChecks() {
    // Initial health check
    await this.performHealthChecks();
    
    // Periodic health checks
    this.healthCheckInterval = setInterval(async () => {
      await this.performHealthChecks();
    }, this.healthCheckInterval);
  }

  private async performHealthChecks() {
    const now = Date.now();
    
    for (const backend of this.backends) {
      // Check health if not checked recently or if marked unhealthy
      if (now - backend.lastChecked > this.healthCheckInterval || !backend.isHealthy) {
        backend.isHealthy = await this.checkHealth(backend);
        backend.lastChecked = now;
      }
    }

    // Switch to best available backend
    this.switchToBestBackend();
  }

  private switchToBestBackend() {
    const healthyBackends = this.backends
      .filter(b => b.isHealthy)
      .sort((a, b) => a.priority - b.priority);

    if (healthyBackends.length > 0) {
      const bestBackend = healthyBackends[0];
      if (bestBackend.name !== this.currentBackend.name) {
        console.log(`🔄 Switching from ${this.currentBackend.name} to ${bestBackend.name}`);
        this.currentBackend = bestBackend;
        
        // Show user notification about backend switch
        this.showBackendSwitchNotification(bestBackend.name);
      }
    } else {
      console.error('❌ All backends are unhealthy!');
      this.showAllBackendsDownNotification();
    }
  }

  private showBackendSwitchNotification(backendName: string) {
    // Create a subtle notification for backend switch
    if (typeof window !== 'undefined') {
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm';
      notification.innerHTML = `🔄 Switched to ${backendName} backend`;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 3000);
    }
  }

  private showAllBackendsDownNotification() {
    if (typeof window !== 'undefined') {
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm';
      notification.innerHTML = '❌ All backends are down. Please try again later.';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 5000);
    }
  }

  private async makeRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    endpoint: string,
    data?: any,
    maxRetries: number = 2
  ): Promise<T> {
    let lastError: Error | null = null;
    let attemptedBackends: string[] = [];

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      // Get current healthy backend
      await this.performHealthChecks();
      
      if (!this.currentBackend.isHealthy) {
        this.switchToBestBackend();
      }

      if (!this.currentBackend.isHealthy) {
        throw new Error('All backends are currently unavailable');
      }

      // Don't retry the same backend
      if (attemptedBackends.includes(this.currentBackend.name)) {
        // Force switch to next available backend
        const nextBackend = this.backends
          .filter(b => b.isHealthy && !attemptedBackends.includes(b.name))
          .sort((a, b) => a.priority - b.priority)[0];
        
        if (nextBackend) {
          this.currentBackend = nextBackend;
        } else {
          break; // No more backends to try
        }
      }

      attemptedBackends.push(this.currentBackend.name);

      try {
        const url = `${this.currentBackend.baseUrl}${endpoint}`;
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        // Add auth token if available
        const token = localStorage.getItem('auth_token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, {
          method,
          headers,
          body: data ? JSON.stringify(data) : undefined,
        });

        if (!response.ok) {
          // If it's a rate limit error (429), mark backend as unhealthy temporarily
          if (response.status === 429) {
            console.log(`🚫 ${this.currentBackend.name} rate limited, marking as unhealthy`);
            this.currentBackend.isHealthy = false;
            this.currentBackend.lastChecked = Date.now();
            throw new Error('Rate limited, switching backend...');
          }
          
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        return response.json();

      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        console.log(`❌ ${this.currentBackend.name} request failed: ${lastError.message}`);
        
        // Mark backend as unhealthy if it's a connection error
        if (lastError.message.includes('fetch') || lastError.message.includes('network') || lastError.message.includes('rate limit')) {
          this.currentBackend.isHealthy = false;
          this.currentBackend.lastChecked = Date.now();
        }
        
        // Try next backend on retry
        continue;
      }
    }

    throw lastError || new Error('All backend attempts failed');
  }

  // Public API methods
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    let url = endpoint;
    if (params) {
      const queryString = new URLSearchParams(params).toString();
      url = `${endpoint}?${queryString}`;
    }
    return this.makeRequest<T>('GET', url);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.makeRequest<T>('POST', endpoint, data);
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.makeRequest<T>('PUT', endpoint, data);
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.makeRequest<T>('PATCH', endpoint, data);
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.makeRequest<T>('DELETE', endpoint);
  }

  // Get current backend info
  getCurrentBackend(): BackendConfig {
    return { ...this.currentBackend };
  }

  // Get all backends status
  getBackendsStatus(): BackendConfig[] {
    return this.backends.map(b => ({ ...b }));
  }

  // Force health check
  async forceHealthCheck(): Promise<void> {
    await this.performHealthChecks();
  }

  // Cleanup
  destroy() {
    if (this.healthCheckTimeout) {
      clearInterval(this.healthCheckTimeout);
    }
  }
}

export const fallbackApiService = new FallbackApiService();
export default fallbackApiService;
