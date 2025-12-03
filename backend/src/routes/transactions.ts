import express from 'express';
import { allQuery, getQuery, runQuery } from '../database/init';

const router = express.Router();

// Get all transactions
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, clientId = '', status = '', type = '' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    
    let whereClause = '';
    let params: any[] = [];
    
    if (clientId) {
      whereClause += ' WHERE clientId = ?';
      params.push(clientId);
    }
    
    if (status) {
      whereClause += whereClause ? ' AND status = ?' : ' WHERE status = ?';
      params.push(status);
    }
    
    if (type) {
      whereClause += whereClause ? ' AND type = ?' : ' WHERE type = ?';
      params.push(type);
    }
    
    const transactions = await allQuery(
      `SELECT t.*, c.name as clientName, c.email as clientEmail 
       FROM transactions t 
       LEFT JOIN clients c ON t.clientId = c.id 
       ${whereClause} 
       ORDER BY t.createdAt DESC 
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), offset]
    );
    
    const totalCount = await getQuery(
      `SELECT COUNT(*) as count FROM transactions t ${whereClause}`,
      params
    );
    
    res.json({
      transactions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: totalCount.count,
        pages: Math.ceil(totalCount.count / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get transaction by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await getQuery(
      `SELECT t.*, c.name as clientName, c.email as clientEmail 
       FROM transactions t 
       LEFT JOIN clients c ON t.clientId = c.id 
       WHERE t.id = ?`,
      [id]
    );
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json(transaction);
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new transaction
router.post('/', async (req, res) => {
  try {
    const { clientId, amount, type, description, status = 'pending' } = req.body;
    
    if (!clientId || !amount || !type) {
      return res.status(400).json({ error: 'Client ID, amount, and type are required' });
    }
    
    const result = await runQuery(
      'INSERT INTO transactions (clientId, amount, type, description, status) VALUES (?, ?, ?, ?, ?)',
      [clientId, amount, type, description, status]
    );
    
    const newTransaction = await getQuery(
      `SELECT t.*, c.name as clientName, c.email as clientEmail 
       FROM transactions t 
       LEFT JOIN clients c ON t.clientId = c.id 
       WHERE t.id = ?`,
      [result.id]
    );
    
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update transaction
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { clientId, amount, type, description, status } = req.body;
    
    const result = await runQuery(
      'UPDATE transactions SET clientId = ?, amount = ?, type = ?, description = ?, status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [clientId, amount, type, description, status, id]
    );
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    const updatedTransaction = await getQuery(
      `SELECT t.*, c.name as clientName, c.email as clientEmail 
       FROM transactions t 
       LEFT JOIN clients c ON t.clientId = c.id 
       WHERE t.id = ?`,
      [id]
    );
    
    res.json(updatedTransaction);
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete transaction
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await runQuery('DELETE FROM transactions WHERE id = ?', [id]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json({ success: true, message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
