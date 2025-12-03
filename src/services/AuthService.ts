// Authentication service with automatic Railway → Render failover
import { fallbackApiService } from './FallbackApiService';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'compliance_officer' | 'analyst' | 'viewer';
    permissions: string[];
    avatar?: string;
    lastLogin?: string;
  };
  token: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('🔐 Attempting login with fallback API...');
      
      const data = await fallbackApiService.post<any>('/auth/login', credentials);
      
      if (data.success) {
        // Store auth token
        localStorage.setItem('auth_token', data.token);
        
        // Transform backend user data to frontend format
        const user = {
          id: data.user.id.toString(),
          email: data.user.email,
          name: `${data.user.firstName} ${data.user.lastName}`,
          role: data.user.role === 'admin' ? 'admin' : 
                data.user.role === 'compliance_officer' ? 'compliance_officer' :
                data.user.role === 'analyst' ? 'analyst' : 'viewer',
          permissions: this.getPermissionsForRole(data.user.role),
          avatar: undefined,
          lastLogin: new Date().toISOString()
        };

        // Store user data
        localStorage.setItem('user', JSON.stringify(user));

        console.log('✅ Login successful via', fallbackApiService.getCurrentBackend().name);
        return { user, token: data.token };
      }
      
      throw new Error(data.error || 'Login failed');
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  }

  private getPermissionsForRole(role: string): string[] {
    const permissions = {
      admin: [
        'view_clients', 'edit_clients', 'delete_clients',
        'view_transactions', 'edit_transactions', 'delete_transactions',
        'view_alerts', 'edit_alerts', 'delete_alerts',
        'view_reports', 'generate_reports', 'export_reports',
        'view_audit', 'manage_users', 'system_settings',
        'view_leads', 'edit_leads', 'delete_leads',
        'view_sales', 'edit_sales', 'delete_sales',
        'view_contacts', 'edit_contacts', 'delete_contacts',
        'view_tasks', 'edit_tasks', 'delete_tasks',
        'view_email', 'edit_email', 'delete_email',
        'view_documents', 'edit_documents', 'delete_documents',
        'view_calendar', 'edit_calendar', 'delete_calendar',
        'view_analytics', 'edit_analytics'
      ],
      compliance_officer: [
        'view_clients', 'edit_clients',
        'view_transactions', 'edit_transactions',
        'view_alerts', 'edit_alerts', 'delete_alerts',
        'view_reports', 'generate_reports', 'export_reports',
        'view_audit',
        'view_leads', 'edit_leads',
        'view_sales', 'edit_sales',
        'view_contacts', 'edit_contacts',
        'view_tasks', 'edit_tasks',
        'view_email', 'edit_email',
        'view_documents', 'edit_documents',
        'view_calendar', 'edit_calendar',
        'view_analytics'
      ],
      analyst: [
        'view_clients', 'edit_clients',
        'view_transactions', 'edit_transactions',
        'view_alerts', 'edit_alerts',
        'view_reports', 'generate_reports', 'export_reports',
        'view_leads', 'edit_leads',
        'view_sales', 'edit_sales',
        'view_contacts', 'edit_contacts',
        'view_tasks', 'edit_tasks',
        'view_email', 'edit_email',
        'view_documents', 'edit_documents',
        'view_calendar', 'edit_calendar',
        'view_analytics'
      ],
      user: [
        'view_clients', 'edit_clients',
        'view_transactions', 'edit_transactions',
        'view_alerts', 'edit_alerts',
        'view_reports', 'generate_reports', 'export_reports',
        'view_leads', 'edit_leads',
        'view_sales', 'edit_sales',
        'view_contacts', 'edit_contacts',
        'view_tasks', 'edit_tasks',
        'view_email', 'edit_email',
        'view_documents', 'edit_documents',
        'view_calendar', 'edit_calendar',
        'view_analytics'
      ],
      viewer: [
        'view_clients',
        'view_transactions',
        'view_alerts',
        'view_reports',
        'view_leads',
        'view_sales',
        'view_contacts',
        'view_tasks',
        'view_email',
        'view_documents',
        'view_calendar',
        'view_analytics'
      ]
    };
    
    return permissions[role as keyof typeof permissions] || permissions.viewer;
  }

  async validateToken(token: string): Promise<AuthResponse['user']> {
    try {
      console.log('🔍 Validating token with fallback API...');
      
      const data = await fallbackApiService.get<any>('/auth/verify');
      
      if (data.success) {
        // Transform backend user data to frontend format
        const user = {
          id: data.user.id.toString(),
          email: data.user.email,
          name: `${data.user.firstName} ${data.user.lastName}`,
          role: data.user.role === 'admin' ? 'admin' : 
                data.user.role === 'compliance_officer' ? 'compliance_officer' :
                data.user.role === 'analyst' ? 'analyst' : 'viewer',
          permissions: this.getPermissionsForRole(data.user.role),
          avatar: undefined,
          lastLogin: new Date().toISOString()
        };

        console.log('✅ Token validation successful via', fallbackApiService.getCurrentBackend().name);
        return user;
      }
      
      throw new Error('Token validation failed');
    } catch (error) {
      console.error('❌ Token validation error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      console.log('🚪 Logging out with fallback API...');
      
      await fallbackApiService.post<any>('/auth/logout');
      
      console.log('✅ Logout successful via', fallbackApiService.getCurrentBackend().name);
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Continue with local cleanup even if API call fails
    } finally {
      // Always clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  }

  async refreshToken(token: string): Promise<{ token: string }> {
    try {
      console.log('🔄 Refreshing token with fallback API...');
      
      const data = await fallbackApiService.post<any>('/auth/refresh', { token });
      
      console.log('✅ Token refresh successful via', fallbackApiService.getCurrentBackend().name);
      return { token: data.token };
    } catch (error) {
      console.error('❌ Token refresh error:', error);
      throw error;
    }
  }

  // Get current backend status
  getBackendStatus() {
    return fallbackApiService.getBackendsStatus();
  }

  // Force health check of all backends
  async forceHealthCheck() {
    await fallbackApiService.forceHealthCheck();
  }
}

export const authService = new AuthService();
