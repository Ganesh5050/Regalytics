import express from 'express';
import { allQuery, getQuery, runQuery } from '../database/init';

const router = express.Router();

// Get all audit logs (both / and /logs for compatibility)
router.get('/logs', async (req, res) => {
  try {
    const { page = 1, limit = 10, userId = '', action = '', resource = '' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    
    let whereClause = '';
    let params: any[] = [];
    
    if (userId) {
      whereClause += ' WHERE userId = ?';
      params.push(userId);
    }
    
    if (action) {
      whereClause += whereClause ? ' AND action = ?' : ' WHERE action = ?';
      params.push(action);
    }
    
    if (resource) {
      whereClause += whereClause ? ' AND resource = ?' : ' WHERE resource = ?';
      params.push(resource);
    }
    
    const query = `
      SELECT al.*, u.firstName, u.lastName, u.email 
      FROM audit_logs al 
      LEFT JOIN users u ON al.userId = u.id 
      ${whereClause}
      ORDER BY al.createdAt DESC 
      LIMIT ? OFFSET ?
    `;
    
    const logs = await allQuery(query, [...params, Number(limit), offset]);
    
    const countQuery = `SELECT COUNT(*) as total FROM audit_logs ${whereClause}`;
    const countResult = await getQuery(countQuery, params);
    const total = countResult.total;
    
    res.json({
      data: logs,
      total,
      page: Number(page),
      limit: Number(limit),
      hasMore: offset + logs.length < total
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// Get all audit logs
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, userId = '', action = '', resource = '' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    
    let whereClause = '';
    let params: any[] = [];
    
    if (userId) {
      whereClause += ' WHERE userId = ?';
      params.push(userId);
    }
    
    if (action) {
      whereClause += whereClause ? ' AND action = ?' : ' WHERE action = ?';
      params.push(action);
    }
    
    if (resource) {
      whereClause += whereClause ? ' AND resource = ?' : ' WHERE resource = ?';
      params.push(resource);
    }
    
    const auditLogs = await allQuery(
      `SELECT a.*, u.firstName, u.lastName, u.email 
       FROM audit_logs a 
       LEFT JOIN users u ON a.userId = u.id 
       ${whereClause} 
       ORDER BY a.createdAt DESC 
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), offset]
    );
    
    const totalCount = await getQuery(
      `SELECT COUNT(*) as count FROM audit_logs a ${whereClause}`,
      params
    );
    
    res.json({
      auditLogs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: totalCount.count,
        pages: Math.ceil(totalCount.count / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get audit log by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const auditLog = await getQuery(
      `SELECT a.*, u.firstName, u.lastName, u.email 
       FROM audit_logs a 
       LEFT JOIN users u ON a.userId = u.id 
       WHERE a.id = ?`,
      [id]
    );
    
    if (!auditLog) {
      return res.status(404).json({ error: 'Audit log not found' });
    }
    
    res.json(auditLog);
  } catch (error) {
    console.error('Get audit log error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get audit statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    
    const stats = await allQuery(`
      SELECT 
        action,
        COUNT(*) as count,
        DATE(createdAt) as date
      FROM audit_logs 
      WHERE createdAt >= datetime('now', '-${days} days')
      GROUP BY action, DATE(createdAt)
      ORDER BY date DESC
    `);
    
    const totalActions = await getQuery(`
      SELECT COUNT(*) as total 
      FROM audit_logs 
      WHERE createdAt >= datetime('now', '-${days} days')
    `);
    
    const uniqueUsers = await getQuery(`
      SELECT COUNT(DISTINCT userId) as uniqueUsers 
      FROM audit_logs 
      WHERE createdAt >= datetime('now', '-${days} days')
    `);
    
    res.json({
      stats,
      summary: {
        totalActions: totalActions.total,
        uniqueUsers: uniqueUsers.uniqueUsers,
        period: `${days} days`
      }
    });
  } catch (error) {
    console.error('Get audit stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export audit logs
router.get('/export/csv', async (req, res) => {
  try {
    const { startDate = '', endDate = '' } = req.query;
    
    let whereClause = '';
    let params: any[] = [];
    
    if (startDate && endDate) {
      whereClause = ' WHERE DATE(a.createdAt) BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }
    
    const auditLogs = await allQuery(`
      SELECT 
        a.id,
        a.action,
        a.resource,
        a.resourceId,
        a.details,
        a.ipAddress,
        a.userAgent,
        a.createdAt,
        u.firstName,
        u.lastName,
        u.email
      FROM audit_logs a 
      LEFT JOIN users u ON a.userId = u.id 
      ${whereClause} 
      ORDER BY a.createdAt DESC
    `, params);
    
    // Convert to CSV format
    const csvHeader = 'ID,Action,Resource,Resource ID,Details,IP Address,User Agent,Created At,User Name,User Email\n';
    const csvRows = auditLogs.map(log => 
      `${log.id},"${log.action}","${log.resource}","${log.resourceId || ''}","${log.details || ''}","${log.ipAddress || ''}","${log.userAgent || ''}","${log.createdAt}","${log.firstName} ${log.lastName}","${log.email}"`
    ).join('\n');
    
    const csvContent = csvHeader + csvRows;
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=audit_logs.csv');
    res.send(csvContent);
  } catch (error) {
    console.error('Export audit logs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
