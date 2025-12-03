// Simple local authentication - no backend needed
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
    // Simple local authentication
    if (credentials.email === 'admin@regalytics.com' && credentials.password === 'admin123') {
      const user = {
        id: '1',
        email: 'admin@regalytics.com',
        name: 'Admin User',
        role: 'admin' as const,
        permissions: [
          'view_clients', 'edit_clients', 'delete_clients',
          'view_transactions', 'edit_transactions', 'delete_transactions',
          'view_alerts', 'edit_alerts', 'delete_alerts',
          'view_reports', 'generate_reports', 'export_reports',
          'view_audit', 'manage_users', 'system_settings'
        ],
        avatar: undefined,
        lastLogin: new Date().toISOString()
      };

      const token = `local-token-${Date.now()}`;
      
      return { user, token };
    }
    
    throw new Error('Invalid credentials');
  }

  async validateToken(token: string): Promise<AuthResponse['user']> {
    if (token.startsWith('local-token-')) {
      return {
        id: '1',
        email: 'admin@regalytics.com',
        name: 'Admin User',
        role: 'admin' as const,
        permissions: [
          'view_clients', 'edit_clients', 'delete_clients',
          'view_transactions', 'edit_transactions', 'delete_transactions',
          'view_alerts', 'edit_alerts', 'delete_alerts',
          'view_reports', 'generate_reports', 'export_reports',
          'view_audit', 'manage_users', 'system_settings'
        ],
        avatar: undefined,
        lastLogin: new Date().toISOString()
      };
    }
    throw new Error('Invalid token');
  }

  async logout(): Promise<void> {
    // Simple logout - just clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  async refreshToken(token: string): Promise<{ token: string }> {
    return { token: `local-token-${Date.now()}` };
  }
}

export const authService = new AuthService();

