import { io } from '../server';
import { allQuery, runQuery } from '../database/init';
import { ExternalDataService } from './ExternalDataService';

export class RealTimeDataService {
  private static instance: RealTimeDataService;
  private updateInterval: NodeJS.Timeout | null = null;
  private externalDataService: ExternalDataService;

  private constructor() {
    this.externalDataService = ExternalDataService.getInstance();
  }

  public static getInstance(): RealTimeDataService {
    if (!RealTimeDataService.instance) {
      RealTimeDataService.instance = new RealTimeDataService();
    }
    return RealTimeDataService.instance;
  }

  public startRealTimeUpdates(): void {
    // Update every 30 seconds
    this.updateInterval = setInterval(async () => {
      await this.broadcastUpdates();
    }, 30000);

    console.log('🔄 Real-time data updates started');
  }

  public stopRealTimeUpdates(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    console.log('⏹️ Real-time data updates stopped');
  }

  private async broadcastUpdates(): Promise<void> {
    try {
      // Get both database data and external real-time data
      const [dbClients, dbTransactions, dbAlerts, dbReports, externalData] = await Promise.all([
        this.getLatestClients(),
        this.getLatestTransactions(),
        this.getLatestAlerts(),
        this.getLatestReports(),
        this.externalDataService.getAllRealisticData()
      ]);

      // Combine database data with real-time external data
      const combinedData = {
        timestamp: new Date().toISOString(),
        clients: dbClients,
        transactions: dbTransactions,
        alerts: dbAlerts,
        reports: dbReports,
        realTimeData: externalData,
        marketData: externalData?.financialData || null
      };

      // Broadcast to all connected clients
      io.emit('data-update', combinedData);

      console.log('📡 Real-time data with external APIs broadcasted to clients');
    } catch (error) {
      console.error('❌ Error broadcasting real-time data:', error);
    }
  }

  private async getLatestClients(): Promise<any[]> {
    return await allQuery(`
      SELECT id, name, email, phone, company, status, createdAt, updatedAt
      FROM clients 
      ORDER BY updatedAt DESC 
      LIMIT 10
    `);
  }

  private async getLatestTransactions(): Promise<any[]> {
    return await allQuery(`
      SELECT t.id, t.amount, t.type, t.description, t.status, t.createdAt,
             c.name as clientName, c.email as clientEmail
      FROM transactions t
      LEFT JOIN clients c ON t.clientId = c.id
      ORDER BY t.createdAt DESC 
      LIMIT 10
    `);
  }

  private async getLatestAlerts(): Promise<any[]> {
    return await allQuery(`
      SELECT id, title, description, priority, category, status, createdAt
      FROM alerts 
      WHERE status = 'active'
      ORDER BY createdAt DESC 
      LIMIT 10
    `);
  }

  private async getLatestReports(): Promise<any[]> {
    return await allQuery(`
      SELECT id, title, type, userId, createdAt
      FROM reports 
      ORDER BY createdAt DESC 
      LIMIT 5
    `);
  }

  // Method to trigger immediate update
  public async triggerUpdate(): Promise<void> {
    await this.broadcastUpdates();
  }

  // Method to add new client and broadcast
  public async addClientAndBroadcast(clientData: any): Promise<void> {
    try {
      const result = await runQuery(
        'INSERT INTO clients (name, email, phone, company, status) VALUES (?, ?, ?, ?, ?)',
        [clientData.name, clientData.email, clientData.phone, clientData.company, 'active']
      );

      // Broadcast new client to all connected clients
      io.emit('new-client', {
        id: result.id,
        ...clientData,
        status: 'active',
        createdAt: new Date().toISOString()
      });

      console.log('📢 New client broadcasted:', result.id);
    } catch (error) {
      console.error('❌ Error adding and broadcasting client:', error);
    }
  }

  // Method to add new transaction and broadcast
  public async addTransactionAndBroadcast(transactionData: any): Promise<void> {
    try {
      const result = await runQuery(
        'INSERT INTO transactions (clientId, amount, type, description, status) VALUES (?, ?, ?, ?, ?)',
        [transactionData.clientId, transactionData.amount, transactionData.type, transactionData.description, 'pending']
      );

      // Get client info for broadcast
      const client = await allQuery('SELECT name, email FROM clients WHERE id = ?', [transactionData.clientId]);

      // Broadcast new transaction to all connected clients
      io.emit('new-transaction', {
        id: result.id,
        ...transactionData,
        status: 'pending',
        clientName: client[0]?.name || 'Unknown',
        clientEmail: client[0]?.email || 'Unknown',
        createdAt: new Date().toISOString()
      });

      console.log('📢 New transaction broadcasted:', result.id);
    } catch (error) {
      console.error('❌ Error adding and broadcasting transaction:', error);
    }
  }

  // Method to add new alert and broadcast
  public async addAlertAndBroadcast(alertData: any): Promise<void> {
    try {
      const result = await runQuery(
        'INSERT INTO alerts (title, description, priority, category, status) VALUES (?, ?, ?, ?, ?)',
        [alertData.title, alertData.description, alertData.priority || 'medium', alertData.category || 'compliance', 'active']
      );

      // Broadcast new alert to all connected clients
      io.emit('new-alert', {
        id: result.id,
        ...alertData,
        status: 'active',
        createdAt: new Date().toISOString()
      });

      console.log('📢 New alert broadcasted:', result.id);
    } catch (error) {
      console.error('❌ Error adding and broadcasting alert:', error);
    }
  }
}
