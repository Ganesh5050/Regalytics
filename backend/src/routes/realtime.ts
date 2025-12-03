import express from 'express';
import { ExternalDataService } from '../services/ExternalDataService';

const router = express.Router();

// Get real-time financial data
router.get('/financial', async (req, res) => {
  try {
    const externalDataService = ExternalDataService.getInstance();
    const financialData = await externalDataService.getRealTimeFinancialData();
    
    res.json({
      success: true,
      data: financialData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching real-time financial data:', error);
    res.status(500).json({ error: 'Failed to fetch financial data' });
  }
});

// Get realistic transactions
router.get('/transactions', async (req, res) => {
  try {
    const externalDataService = ExternalDataService.getInstance();
    const transactions = await externalDataService.generateRealisticTransactions();
    
    res.json({
      success: true,
      data: transactions,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating realistic transactions:', error);
    res.status(500).json({ error: 'Failed to generate transactions' });
  }
});

// Get realistic clients
router.get('/clients', async (req, res) => {
  try {
    const externalDataService = ExternalDataService.getInstance();
    const clients = await externalDataService.generateRealisticClients();
    
    res.json({
      success: true,
      data: clients,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating realistic clients:', error);
    res.status(500).json({ error: 'Failed to generate clients' });
  }
});

// Get realistic alerts
router.get('/alerts', async (req, res) => {
  try {
    const externalDataService = ExternalDataService.getInstance();
    const alerts = await externalDataService.generateRealisticAlerts();
    
    res.json({
      success: true,
      data: alerts,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating realistic alerts:', error);
    res.status(500).json({ error: 'Failed to generate alerts' });
  }
});

// Get all real-time data
router.get('/all', async (req, res) => {
  try {
    const externalDataService = ExternalDataService.getInstance();
    const allData = await externalDataService.getAllRealisticData();
    
    res.json({
      success: true,
      data: allData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching all real-time data:', error);
    res.status(500).json({ error: 'Failed to fetch real-time data' });
  }
});

// Get news data
router.get('/news', async (req, res) => {
  try {
    const externalDataService = ExternalDataService.getInstance();
    const news = await externalDataService.getRealTimeNews();
    
    res.json({
      success: true,
      data: news,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching news data:', error);
    res.status(500).json({ error: 'Failed to fetch news data' });
  }
});

export default router;
