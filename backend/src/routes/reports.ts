import express from 'express';
import { allQuery, getQuery, runQuery } from '../database/init';

const router = express.Router();

// Get all reports
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, type = '' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    
    let whereClause = '';
    let params: any[] = [];
    
    if (type) {
      whereClause = ' WHERE type = ?';
      params.push(type);
    }
    
    const reports = await allQuery(
      `SELECT r.*, u.firstName, u.lastName 
       FROM reports r 
       LEFT JOIN users u ON r.userId = u.id 
       ${whereClause} 
       ORDER BY r.createdAt DESC 
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), offset]
    );
    
    const totalCount = await getQuery(
      `SELECT COUNT(*) as count FROM reports r ${whereClause}`,
      params
    );
    
    res.json({
      reports,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: totalCount.count,
        pages: Math.ceil(totalCount.count / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get report by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const report = await getQuery(
      `SELECT r.*, u.firstName, u.lastName 
       FROM reports r 
       LEFT JOIN users u ON r.userId = u.id 
       WHERE r.id = ?`,
      [id]
    );
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    res.json(report);
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new report
router.post('/', async (req, res) => {
  try {
    const { title, type, data, userId } = req.body;
    
    if (!title || !type || !data || !userId) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const result = await runQuery(
      'INSERT INTO reports (title, type, data, userId) VALUES (?, ?, ?, ?)',
      [title, type, JSON.stringify(data), userId]
    );
    
    const newReport = await getQuery(
      `SELECT r.*, u.firstName, u.lastName 
       FROM reports r 
       LEFT JOIN users u ON r.userId = u.id 
       WHERE r.id = ?`,
      [result.id]
    );
    
    res.status(201).json(newReport);
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Generate sample report data
router.post('/generate-sample', async (req, res) => {
  try {
    const { type, userId } = req.body;
    
    if (!type || !userId) {
      return res.status(400).json({ error: 'Type and user ID are required' });
    }
    
    let reportData: any = {};
    let title = '';
    
    switch (type) {
      case 'clients':
        const clients = await allQuery('SELECT * FROM clients ORDER BY createdAt DESC LIMIT 10');
        reportData = { clients, summary: { total: clients.length } };
        title = 'Client Report';
        break;
        
      case 'transactions':
        const transactions = await allQuery(
          `SELECT t.*, c.name as clientName 
           FROM transactions t 
           LEFT JOIN clients c ON t.clientId = c.id 
           ORDER BY t.createdAt DESC LIMIT 20`
        );
        const totalAmount = transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
        reportData = { 
          transactions, 
          summary: { 
            total: transactions.length, 
            totalAmount: totalAmount.toFixed(2) 
          } 
        };
        title = 'Transaction Report';
        break;
        
      case 'revenue':
        const revenueData = await allQuery(
          `SELECT 
             DATE(createdAt) as date,
             SUM(amount) as dailyRevenue,
             COUNT(*) as transactionCount
           FROM transactions 
           WHERE status = 'completed' 
           GROUP BY DATE(createdAt) 
           ORDER BY date DESC 
           LIMIT 30`
        );
        reportData = { revenueData, summary: { period: 'Last 30 days' } };
        title = 'Revenue Report';
        break;
        
      default:
        return res.status(400).json({ error: 'Invalid report type' });
    }
    
    const result = await runQuery(
      'INSERT INTO reports (title, type, data, userId) VALUES (?, ?, ?, ?)',
      [title, type, JSON.stringify(reportData), userId]
    );
    
    const newReport = await getQuery(
      `SELECT r.*, u.firstName, u.lastName 
       FROM reports r 
       LEFT JOIN users u ON r.userId = u.id 
       WHERE r.id = ?`,
      [result.id]
    );
    
    res.status(201).json(newReport);
  } catch (error) {
    console.error('Generate sample report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
