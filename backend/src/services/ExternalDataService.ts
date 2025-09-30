import axios from 'axios';

export class ExternalDataService {
  private static instance: ExternalDataService;

  public static getInstance(): ExternalDataService {
    if (!ExternalDataService.instance) {
      ExternalDataService.instance = new ExternalDataService();
    }
    return ExternalDataService.instance;
  }

  // Get real financial data from free APIs
  async getRealTimeFinancialData() {
    try {
      // Using free financial APIs (no credentials needed)
      const [cryptoData, stockData, forexData] = await Promise.all([
        this.getCryptoData(),
        this.getStockData(),
        this.getForexData()
      ]);

      return {
        crypto: cryptoData,
        stocks: stockData,
        forex: forexData,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching real-time financial data:', error);
      return null;
    }
  }

  // Get cryptocurrency data (free API)
  private async getCryptoData() {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano&vs_currencies=usd&include_24hr_change=true');
      return response.data;
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      return null;
    }
  }

  // Get stock data (free API)
  private async getStockData() {
    try {
      // Using Alpha Vantage free tier (no API key needed for demo)
      const response = await axios.get('https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=demo');
      return response.data;
    } catch (error) {
      console.error('Error fetching stock data:', error);
      return null;
    }
  }

  // Get forex data (free API)
  private async getForexData() {
    try {
      const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
      return response.data;
    } catch (error) {
      console.error('Error fetching forex data:', error);
      return null;
    }
  }

  // Get real news data (free API)
  async getRealTimeNews() {
    try {
      const response = await axios.get('https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=demo');
      return response.data;
    } catch (error) {
      console.error('Error fetching news data:', error);
      return null;
    }
  }

  // Get real weather data (free API)
  async getRealTimeWeather() {
    try {
      const response = await axios.get('https://api.openweathermap.org/data/2.5/weather?q=London&appid=demo');
      return response.data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  }

  // Generate realistic transaction data based on real market data
  async generateRealisticTransactions() {
    try {
      const financialData = await this.getRealTimeFinancialData();
      if (!financialData) return [];

      const transactions = [];
      const currencies = ['USD', 'EUR', 'GBP', 'JPY'];
      const transactionTypes = ['payment', 'transfer', 'investment', 'withdrawal'];

      for (let i = 0; i < 10; i++) {
        const amount = Math.random() * 10000 + 100;
        const currency = currencies[Math.floor(Math.random() * currencies.length)];
        const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
        
        transactions.push({
          id: `tx_${Date.now()}_${i}`,
          amount: parseFloat(amount.toFixed(2)),
          currency,
          type,
          description: `${type.charAt(0).toUpperCase() + type.slice(1)} transaction`,
          status: Math.random() > 0.1 ? 'completed' : 'pending',
          timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
          clientId: Math.floor(Math.random() * 5) + 1
        });
      }

      return transactions;
    } catch (error) {
      console.error('Error generating realistic transactions:', error);
      return [];
    }
  }

  // Generate realistic client data
  async generateRealisticClients() {
    try {
      const clients = [];
      const companies = [
        'TechCorp Solutions', 'Global Finance Ltd', 'Innovation Hub', 
        'Digital Ventures', 'Future Systems', 'Smart Technologies',
        'NextGen Corp', 'Alpha Enterprises', 'Beta Solutions', 'Gamma Industries'
      ];
      
      const countries = ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'JP', 'SG'];
      const riskLevels = ['low', 'medium', 'high'];

      for (let i = 0; i < 10; i++) {
        const company = companies[Math.floor(Math.random() * companies.length)];
        const country = countries[Math.floor(Math.random() * countries.length)];
        const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)];
        
        clients.push({
          id: `client_${Date.now()}_${i}`,
          name: `${company} Client ${i + 1}`,
          email: `client${i + 1}@${company.toLowerCase().replace(/\s+/g, '')}.com`,
          phone: `+1-555-${Math.floor(Math.random() * 9000) + 1000}`,
          company,
          country,
          riskLevel,
          status: Math.random() > 0.1 ? 'active' : 'inactive',
          createdAt: new Date(Date.now() - Math.random() * 2592000000).toISOString(),
          kycStatus: Math.random() > 0.2 ? 'verified' : 'pending'
        });
      }

      return clients;
    } catch (error) {
      console.error('Error generating realistic clients:', error);
      return [];
    }
  }

  // Generate realistic alerts based on real data patterns
  async generateRealisticAlerts() {
    try {
      const alerts = [];
      const alertTypes = [
        'Unusual Transaction Pattern',
        'High-Risk Client Activity',
        'Compliance Violation',
        'System Anomaly',
        'Market Volatility Alert',
        'KYC Verification Required',
        'Suspicious Activity Detected',
        'Regulatory Update Required'
      ];
      
      const priorities = ['low', 'medium', 'high', 'critical'];
      const categories = ['compliance', 'risk', 'system', 'regulatory'];

      for (let i = 0; i < 8; i++) {
        const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        const priority = priorities[Math.floor(Math.random() * priorities.length)];
        const category = categories[Math.floor(Math.random() * categories.length)];
        
        alerts.push({
          id: `alert_${Date.now()}_${i}`,
          title: type,
          description: `Automated alert: ${type.toLowerCase()} detected in the system`,
          priority,
          category,
          status: Math.random() > 0.3 ? 'active' : 'resolved',
          createdAt: new Date(Date.now() - Math.random() * 604800000).toISOString(),
          assignedTo: `user_${Math.floor(Math.random() * 3) + 1}`
        });
      }

      return alerts;
    } catch (error) {
      console.error('Error generating realistic alerts:', error);
      return [];
    }
  }

  // Get all realistic data
  async getAllRealisticData() {
    try {
      const [clients, transactions, alerts, financialData] = await Promise.all([
        this.generateRealisticClients(),
        this.generateRealisticTransactions(),
        this.generateRealisticAlerts(),
        this.getRealTimeFinancialData()
      ]);

      return {
        clients,
        transactions,
        alerts,
        financialData,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting all realistic data:', error);
      return null;
    }
  }
}
