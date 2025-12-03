import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/hooks/useNotifications';
import { CheckCircle, XCircle, Loader2, Server, Database, Users, AlertTriangle } from 'lucide-react';

export function BackendConnectionTest() {
  const { addNotification } = useNotifications();
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [backendData, setBackendData] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    testBackendConnection();
  }, []);

  const testBackendConnection = async () => {
    try {
      setConnectionStatus('checking');
      setError('');

      // Test basic connectivity
      const response = await fetch('http://localhost:3001/api/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setBackendData(data);
      setConnectionStatus('connected');

      addNotification({
        type: 'success',
        title: 'Backend Connected',
        message: 'Successfully connected to backend API'
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setConnectionStatus('error');

      addNotification({
        type: 'error',
        title: 'Backend Connection Failed',
        message: `Failed to connect to backend: ${errorMessage}`
      });
    }
  };

  const testAuthEndpoint = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@regalytics.com',
          password: 'admin123'
        }),
      });

      if (!response.ok) {
        throw new Error(`Auth test failed: ${response.status}`);
      }

      const authData = await response.json();
      
      addNotification({
        type: 'success',
        title: 'Auth Endpoint Working',
        message: 'Authentication endpoint is responding correctly'
      });

    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Auth Test Failed',
        message: 'Authentication endpoint test failed'
      });
    }
  };

  const testClientsEndpoint = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/clients', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Clients test failed: ${response.status}`);
      }

      const clientsData = await response.json();
      
      addNotification({
        type: 'success',
        title: 'Clients Endpoint Working',
        message: `Retrieved ${clientsData.length || 0} clients from backend`
      });

    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Clients Test Failed',
        message: 'Clients endpoint test failed'
      });
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'checking':
        return <Loader2 className="h-5 w-5 animate-spin" />;
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'checking':
        return <Badge variant="secondary">Checking...</Badge>;
      case 'connected':
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
    }
  };

  return (
    <Card className="glass-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          Backend Connection Test
        </CardTitle>
        <CardDescription>
          Test connectivity to the backend API server
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="font-medium">Backend Status</span>
          </div>
          {getStatusBadge()}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}

        {/* Backend Data */}
        {backendData && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Response:</strong> {JSON.stringify(backendData, null, 2)}
            </p>
          </div>
        )}

        {/* Test Buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button 
            onClick={testBackendConnection}
            variant="outline"
            size="sm"
          >
            <Server className="h-4 w-4 mr-2" />
            Test Connection
          </Button>
          
          <Button 
            onClick={testAuthEndpoint}
            variant="outline"
            size="sm"
          >
            <Users className="h-4 w-4 mr-2" />
            Test Auth
          </Button>
          
          <Button 
            onClick={testClientsEndpoint}
            variant="outline"
            size="sm"
          >
            <Database className="h-4 w-4 mr-2" />
            Test Clients
          </Button>
        </div>

        {/* Connection Info */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Backend URL:</strong> http://localhost:3001/api</p>
          <p><strong>WebSocket URL:</strong> ws://localhost:3001/ws</p>
          <p><strong>Status:</strong> {connectionStatus}</p>
        </div>
      </CardContent>
    </Card>
  );
}
