// Mock authentication service - replace with real API calls
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
  private baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      
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

        return { success: true, user, token: data.token };
      }
      
      throw new Error('Login failed');
    } catch (error) {
      console.error('Login error:', error);
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
      const response = await fetch(`${this.baseUrl}/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Invalid token');
      }

      const data = await response.json();
      
      if (data.success) {
        // Transform backend user data to frontend format
        return {
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
      }
      
      throw new Error('Token validation failed');
    } catch (error) {
      console.error('Token validation error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        await fetch(`${this.baseUrl}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local storage even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  async refreshToken(token: string): Promise<{ token: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // In a real app, this would refresh the token
    const newToken = `mock_token_${token.split('_')[2]}_${Date.now()}`;
    
    return { token: newToken };
  }
}

export const authService = new AuthService();
