// backend-messaging-server.js
// Simple Node.js backend server to send SMS/WhatsApp via Twilio
// This keeps your Twilio credentials safe (not exposed in frontend)
//
// Installation:
// npm install express twilio dotenv cors body-parser
//
// Environment Setup (.env file):
// TWILIO_ACCOUNT_SID=your_account_sid
// TWILIO_AUTH_TOKEN=your_auth_token
// TWILIO_PHONE_NUMBER=+1234567890
// TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890
// PORT=3000

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER;

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend server is running' });
});

// Send SMS
app.post('/api/send-sms', async (req, res) => {
  try {
    const { to, message } = req.body;

    // Validate input
    if (!to || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing "to" or "message" field',
      });
    }

    // Validate phone number format
    if (!to.match(/^\+?[1-9]\d{1,14}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid phone number format. Use international format: +1234567890',
      });
    }

    // Send SMS via Twilio
    const result = await client.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to: to,
    });

    console.log(`✓ SMS sent to ${to}. SID: ${result.sid} STATUS: ${result.status}`);

    res.json({
      success: true,
      messageId: result.sid,
      status: result.status || 'queued',
      message: 'SMS sent successfully!',
      to: to,
      sentAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('SMS sending error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send SMS',
    });
  }
});

// Send WhatsApp
app.post('/api/send-whatsapp', async (req, res) => {
  try {
    const { to, message } = req.body;

    // Validate input
    if (!to || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing "to" or "message" field',
      });
    }

    // Validate phone number format
    if (!to.match(/^\+?[1-9]\d{1,14}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid phone number format. Use international format: +1234567890',
      });
    }

    // Format WhatsApp number
    const whatsappNumber = `whatsapp:${to.startsWith('+') ? to : '+' + to}`;

    // Send WhatsApp via Twilio
    const result = await client.messages.create({
      body: message,
      from: TWILIO_WHATSAPP_NUMBER,
      to: whatsappNumber,
    });

    console.log(`✓ WhatsApp sent to ${to}. SID: ${result.sid} STATUS: ${result.status}`);

    res.json({
      success: true,
      messageId: result.sid,
      status: result.status || 'queued',
      message: 'WhatsApp message sent successfully!',
      to: to,
      sentAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('WhatsApp sending error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send WhatsApp',
    });
  }
});

// Send bulk SMS to multiple recipients
app.post('/api/send-sms-bulk', async (req, res) => {
  try {
    const { recipients, message } = req.body; // recipients = [{ to: '+1234567890', name: 'John' }, ...]

    if (!Array.isArray(recipients) || recipients.length === 0 || !message) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request. Provide "recipients" array and "message"',
      });
    }

    const results = [];

    for (const recipient of recipients) {
      try {
        const result = await client.messages.create({
          body: message,
          from: TWILIO_PHONE_NUMBER,
          to: recipient.to,
        });

        results.push({
          to: recipient.to,
          name: recipient.name,
          success: true,
          messageId: result.sid,
          status: result.status || 'queued',
        });
      } catch (err) {
        results.push({
          to: recipient.to,
          name: recipient.name,
          success: false,
          error: err.message,
        });
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.filter((r) => !r.success).length;

    console.log(`✓ Bulk SMS: ${successCount} sent, ${failureCount} failed`);

    res.json({
      success: true,
      summary: {
        total: results.length,
        sent: successCount,
        failed: failureCount,
      },
      results: results,
    });
  } catch (error) {
    console.error('Bulk SMS sending error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send bulk SMS',
    });
  }
});

// Get message status
app.get('/api/message/:sid', async (req, res) => {
  try {
    const { sid } = req.params;

    const message = await client.messages(sid).fetch();

    res.json({
      success: true,
      messageId: message.sid,
      status: message.status,
      to: message.to,
      from: message.from,
      body: message.body,
      sentAt: message.dateCreated,
      errorMessage: message.errorMessage,
    });
  } catch (error) {
    console.error('Get message status error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get message status',
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✓ Backend messaging server running on http://localhost:${PORT}`);
  console.log(`✓ SMS endpoint: POST /api/send-sms`);
  console.log(`✓ WhatsApp endpoint: POST /api/send-whatsapp`);
  console.log(`✓ Bulk SMS endpoint: POST /api/send-sms-bulk`);
  console.log(`✓ Message status endpoint: GET /api/message/:sid`);
});
