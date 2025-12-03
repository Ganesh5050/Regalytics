import express from 'express';
import { db } from '../database/init';

const router = express.Router();

// Get all alerts
router.get('/', (req, res) => {
  const { page = 1, limit = 10, status, priority, category } = req.query;
  
  let query = 'SELECT * FROM alerts WHERE 1=1';
  const params: any[] = [];
  
  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }
  
  if (priority) {
    query += ' AND priority = ?';
    params.push(priority);
  }
  
  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  
  query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit as string), (parseInt(page as string) - 1) * parseInt(limit as string));
  
  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Error fetching alerts:', err);
      return res.status(500).json({ error: 'Failed to fetch alerts' });
    }
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM alerts WHERE 1=1';
    const countParams: any[] = [];
    
    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }
    
    if (priority) {
      countQuery += ' AND priority = ?';
      countParams.push(priority);
    }
    
    if (category) {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }
    
    db.get(countQuery, countParams, (err, countRow: any) => {
      if (err) {
        console.error('Error counting alerts:', err);
        return res.status(500).json({ error: 'Failed to count alerts' });
      }
      
      res.json({
        data: rows,
        total: countRow.total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        hasMore: (parseInt(page as string) * parseInt(limit as string)) < countRow.total
      });
    });
  });
});

// Get alert by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM alerts WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error fetching alert:', err);
      return res.status(500).json({ error: 'Failed to fetch alert' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    
    res.json(row);
  });
});

// Create new alert
router.post('/', (req, res) => {
  const {
    title,
    description,
    priority = 'medium',
    category = 'compliance',
    assignedTo,
    dueDate,
    clientId,
    transactionId,
    notes,
    status = 'active'
  } = req.body;
  
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }
  
  const query = `
    INSERT INTO alerts (
      title, description, priority, category, assignedTo, 
      dueDate, clientId, transactionId, notes, status, 
      createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `;
  
  const params = [
    title, description, priority, category, assignedTo,
    dueDate, clientId, transactionId, notes, status
  ];
  
  db.run(query, params, function(err) {
    if (err) {
      console.error('Error creating alert:', err);
      return res.status(500).json({ error: 'Failed to create alert' });
    }
    
    res.status(201).json({
      id: this.lastID,
      title,
      description,
      priority,
      category,
      assignedTo,
      dueDate,
      clientId,
      transactionId,
      notes,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  });
});

// Update alert
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    priority,
    category,
    assignedTo,
    dueDate,
    clientId,
    transactionId,
    notes,
    status
  } = req.body;
  
  const updateFields = [];
  const params = [];
  
  if (title !== undefined) {
    updateFields.push('title = ?');
    params.push(title);
  }
  if (description !== undefined) {
    updateFields.push('description = ?');
    params.push(description);
  }
  if (priority !== undefined) {
    updateFields.push('priority = ?');
    params.push(priority);
  }
  if (category !== undefined) {
    updateFields.push('category = ?');
    params.push(category);
  }
  if (assignedTo !== undefined) {
    updateFields.push('assignedTo = ?');
    params.push(assignedTo);
  }
  if (dueDate !== undefined) {
    updateFields.push('dueDate = ?');
    params.push(dueDate);
  }
  if (clientId !== undefined) {
    updateFields.push('clientId = ?');
    params.push(clientId);
  }
  if (transactionId !== undefined) {
    updateFields.push('transactionId = ?');
    params.push(transactionId);
  }
  if (notes !== undefined) {
    updateFields.push('notes = ?');
    params.push(notes);
  }
  if (status !== undefined) {
    updateFields.push('status = ?');
    params.push(status);
  }
  
  if (updateFields.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }
  
  updateFields.push('updatedAt = datetime("now")');
  params.push(id);
  
  const query = `UPDATE alerts SET ${updateFields.join(', ')} WHERE id = ?`;
  
  db.run(query, params, function(err) {
    if (err) {
      console.error('Error updating alert:', err);
      return res.status(500).json({ error: 'Failed to update alert' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    
    res.json({
      id: parseInt(id),
      message: 'Alert updated successfully',
      updatedAt: new Date().toISOString()
    });
  });
});

// Delete alert
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM alerts WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Error deleting alert:', err);
      return res.status(500).json({ error: 'Failed to delete alert' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    
    res.json({ message: 'Alert deleted successfully' });
  });
});

export default router;
