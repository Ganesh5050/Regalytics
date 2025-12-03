// Data management and API simulation for Regalytics UI
export interface Client {
  id: string;
  name: string;
  pan: string;
  aadhaar: string;
  riskScore: number;
  kycStatus: 'Complete' | 'Pending' | 'Incomplete';
  lastUpdate: string;
  email?: string;
  phone?: string;
  address?: string;
  businessType?: string;
}

export interface Transaction {
  id: string;
  client: string;
  type: 'Credit' | 'Debit';
  amount: number;
  currency: string;
  date: string;
  time: string;
  status: 'Cleared' | 'Pending' | 'Flagged' | 'Under Review';
  suspicious: boolean;
  method: string;
  description?: string;
}

export interface Alert {
  id: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  client: string;
  amount: string;
  timestamp: string;
  status: 'Open' | 'Investigating' | 'Resolved';
  assignedTo: string;
  riskScore: number;
}

export interface Report {
  id: string;
  name: string;
  description: string;
  type: string;
  format: string;
  size: string;
  generated: string;
  status: 'Ready' | 'Generating' | 'Failed';
  downloads: number;
}

// Mock data generators
export const generateMockClients = (count: number = 50): Client[] => {
  const clients: Client[] = [];
  const companies = [
    'Rajesh Industries Pvt Ltd', 'Mumbai Trading Co.', 'Tech Solutions Pvt Ltd',
    'Global Exports Limited', 'ABC Corp Limited', 'Tech Industries Pvt',
    'Export House Pvt Ltd', 'Global Solutions Ltd', 'Digital Services Inc',
    'Financial Services Ltd', 'Manufacturing Corp', 'Retail Solutions Pvt'
  ];
  
  for (let i = 1; i <= count; i++) {
    clients.push({
      id: `CLI${String(i).padStart(3, '0')}`,
      name: companies[Math.floor(Math.random() * companies.length)],
      pan: `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      aadhaar: `****-****-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      riskScore: Math.floor(Math.random() * 100),
      kycStatus: Math.random() > 0.2 ? 'Complete' : 'Pending',
      lastUpdate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      email: `client${i}@example.com`,
      phone: `+91-${Math.floor(Math.random() * 10000000000)}`,
      address: `${Math.floor(Math.random() * 100)} Street, Mumbai, Maharashtra`,
      businessType: ['Manufacturing', 'Trading', 'Services', 'Technology'][Math.floor(Math.random() * 4)]
    });
  }
  
  return clients;
};

export const generateMockTransactions = (count: number = 100): Transaction[] => {
  const transactions: Transaction[] = [];
  const clients = generateMockClients(20);
  const methods = ['NEFT', 'RTGS', 'Cash Deposit', 'Wire Transfer', 'UPI', 'Cheque'];
  
  for (let i = 1; i <= count; i++) {
    const client = clients[Math.floor(Math.random() * clients.length)];
    const amount = Math.floor(Math.random() * 5000000) + 10000;
    const suspicious = amount > 1000000 || Math.random() > 0.8;
    
    transactions.push({
      id: `TXN${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(i).padStart(3, '0')}`,
      client: client.name,
      type: Math.random() > 0.5 ? 'Credit' : 'Debit',
      amount,
      currency: 'INR',
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      status: suspicious ? (Math.random() > 0.5 ? 'Flagged' : 'Under Review') : 'Cleared',
      suspicious,
      method: methods[Math.floor(Math.random() * methods.length)],
      description: `Transaction for ${client.name}`
    });
  }
  
  return transactions.sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime());
};

export const generateMockAlerts = (count: number = 30): Alert[] => {
  const alerts: Alert[] = [];
  const clients = generateMockClients(15);
  const alertTypes = [
    'Large Cash Deposit Detected',
    'Multiple Small Transactions',
    'Unusual Transaction Timing',
    'Incomplete KYC Documentation',
    'Cross-Border Transaction Alert',
    'High-Risk Client Activity',
    'Suspicious Pattern Detected',
    'Compliance Violation'
  ];
  
  const assignees = ['Sarah Johnson', 'Mike Wilson', 'Emily Davis', 'David Chen', 'Lisa Rodriguez'];
  
  for (let i = 1; i <= count; i++) {
    const client = clients[Math.floor(Math.random() * clients.length)];
    const severity = Math.random() > 0.6 ? 'HIGH' : Math.random() > 0.3 ? 'MEDIUM' : 'LOW';
    const amount = severity === 'HIGH' ? `₹${Math.floor(Math.random() * 2000000) + 500000}` : 
                  severity === 'MEDIUM' ? `₹${Math.floor(Math.random() * 500000) + 100000}` : '-';
    
    alerts.push({
      id: `ALT${String(i).padStart(3, '0')}`,
      severity,
      title: alertTypes[Math.floor(Math.random() * alertTypes.length)],
      description: `Alert description for ${client.name}`,
      client: client.name,
      amount,
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: Math.random() > 0.4 ? 'Open' : Math.random() > 0.5 ? 'Investigating' : 'Resolved',
      assignedTo: assignees[Math.floor(Math.random() * assignees.length)],
      riskScore: Math.floor(Math.random() * 100)
    });
  }
  
  return alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Data service class
export class DataService {
  private static instance: DataService;
  private clients: Client[] = [];
  private transactions: Transaction[] = [];
  private alerts: Alert[] = [];

  private constructor() {
    this.clients = generateMockClients(100);
    this.transactions = generateMockTransactions(200);
    this.alerts = generateMockAlerts(50);
  }

  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  // Client methods
  public getClients(): Client[] {
    return this.clients;
  }

  public getClientById(id: string): Client | undefined {
    return this.clients.find(client => client.id === id);
  }

  public searchClients(query: string): Client[] {
    const lowerQuery = query.toLowerCase();
    return this.clients.filter(client =>
      client.name.toLowerCase().includes(lowerQuery) ||
      client.pan.toLowerCase().includes(lowerQuery) ||
      client.id.toLowerCase().includes(lowerQuery) ||
      client.email?.toLowerCase().includes(lowerQuery)
    );
  }

  // Transaction methods
  public getTransactions(): Transaction[] {
    return this.transactions;
  }

  public getTransactionsByClient(clientId: string): Transaction[] {
    const client = this.getClientById(clientId);
    if (!client) return [];
    return this.transactions.filter(txn => txn.client === client.name);
  }

  public getSuspiciousTransactions(): Transaction[] {
    return this.transactions.filter(txn => txn.suspicious);
  }

  // Alert methods
  public getAlerts(): Alert[] {
    return this.alerts;
  }

  public getAlertsBySeverity(severity: 'HIGH' | 'MEDIUM' | 'LOW'): Alert[] {
    return this.alerts.filter(alert => alert.severity === severity);
  }

  public getOpenAlerts(): Alert[] {
    return this.alerts.filter(alert => alert.status === 'Open');
  }

  // Dashboard stats
  public getDashboardStats() {
    const totalClients = this.clients.length;
    const totalTransactions = this.transactions.length;
    const suspiciousTransactions = this.getSuspiciousTransactions().length;
    const openAlerts = this.getOpenAlerts().length;
    
    const todayTransactions = this.transactions.filter(txn => 
      new Date(txn.date).toDateString() === new Date().toDateString()
    );
    
    const todayVolume = todayTransactions.reduce((sum, txn) => sum + txn.amount, 0);
    
    return {
      totalClients,
      totalTransactions,
      suspiciousTransactions,
      openAlerts,
      todayVolume,
      todayTransactionCount: todayTransactions.length,
      avgTransactionAmount: Math.round(this.transactions.reduce((sum, txn) => sum + txn.amount, 0) / totalTransactions)
    };
  }
}
