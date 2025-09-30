import express from 'express';
import { allQuery, getQuery, runQuery } from '../database/init';

const router = express.Router();

// Get all clients
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    
    let whereClause = '';
    let params: any[] = [];
    
    if (search) {
      whereClause += ' WHERE (name LIKE ? OR email LIKE ? OR company LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    if (status) {
      whereClause += whereClause ? ' AND status = ?' : ' WHERE status = ?';
      params.push(status);
    }
    
    const clients = await allQuery(
      `SELECT * FROM clients ${whereClause} ORDER BY createdAt DESC LIMIT ? OFFSET ?`,
      [...params, Number(limit), offset]
    );
    
    const totalCount = await getQuery(
      `SELECT COUNT(*) as count FROM clients ${whereClause}`,
      params
    );
    
    res.json({
      clients,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: totalCount.count,
        pages: Math.ceil(totalCount.count / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get client by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const client = await getQuery('SELECT * FROM clients WHERE id = ?', [id]);
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    res.json(client);
  } catch (error) {
    console.error('Get client error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new client
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, company, status = 'active' } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    
    const result = await runQuery(
      'INSERT INTO clients (name, email, phone, company, status) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, company, status]
    );
    
    const newClient = await getQuery('SELECT * FROM clients WHERE id = ?', [result.id]);
    
    res.status(201).json(newClient);
  } catch (error) {
    console.error('Create client error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update client
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, company, status } = req.body;
    
    const result = await runQuery(
      'UPDATE clients SET name = ?, email = ?, phone = ?, company = ?, status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [name, email, phone, company, status, id]
    );
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    const updatedClient = await getQuery('SELECT * FROM clients WHERE id = ?', [id]);
    res.json(updatedClient);
  } catch (error) {
    console.error('Update client error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete client
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await runQuery('DELETE FROM clients WHERE id = ?', [id]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    res.json({ success: true, message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Delete client error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
