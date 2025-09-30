import { Router } from 'express';
import axios from 'axios';

const router = Router();

// n8n webhook URL
const N8N_WEBHOOK_URL = 'https://gpan.app.n8n.cloud/webhook/regalytics-kyc-webhook';

// KYC webhook endpoint
router.post('/kyc', async (req, res) => {
  try {
    const kycData = req.body;
    
    // Send data to n8n webhook
    const response = await axios.post(N8N_WEBHOOK_URL, {
      event: 'kyc_submission',
      timestamp: new Date().toISOString(),
      data: kycData
    });

    console.log('KYC data sent to n8n:', response.status);

    res.json({
      success: true,
      message: 'KYC data sent to workflow',
      webhookResponse: response.data
    });
  } catch (error) {
    console.error('Error sending KYC data to n8n:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send KYC data to workflow'
    });
  }
});

// Transaction monitoring webhook
router.post('/transaction', async (req, res) => {
  try {
    const transactionData = req.body;
    
    // Send data to n8n webhook
    const response = await axios.post(N8N_WEBHOOK_URL, {
      event: 'transaction_monitoring',
      timestamp: new Date().toISOString(),
      data: transactionData
    });

    console.log('Transaction data sent to n8n:', response.status);

    res.json({
      success: true,
      message: 'Transaction data sent to workflow',
      webhookResponse: response.data
    });
  } catch (error) {
    console.error('Error sending transaction data to n8n:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send transaction data to workflow'
    });
  }
});

// Compliance alert webhook
router.post('/compliance', async (req, res) => {
  try {
    const alertData = req.body;
    
    // Send data to n8n webhook
    const response = await axios.post(N8N_WEBHOOK_URL, {
      event: 'compliance_alert',
      timestamp: new Date().toISOString(),
      data: alertData
    });

    console.log('Compliance alert sent to n8n:', response.status);

    res.json({
      success: true,
      message: 'Compliance alert sent to workflow',
      webhookResponse: response.data
    });
  } catch (error) {
    console.error('Error sending compliance alert to n8n:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send compliance alert to workflow'
    });
  }
});

// Test webhook endpoint
router.post('/test', async (req, res) => {
  try {
    const testData = {
      message: 'Test webhook from Regalytics backend',
      timestamp: new Date().toISOString(),
      source: 'regalytics-backend'
    };
    
    // Send test data to n8n webhook
    const response = await axios.post(N8N_WEBHOOK_URL, testData);

    console.log('Test data sent to n8n:', response.status);

    res.json({
      success: true,
      message: 'Test webhook sent successfully',
      webhookResponse: response.data
    });
  } catch (error) {
    console.error('Error sending test webhook to n8n:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test webhook'
    });
  }
});

export default router;
