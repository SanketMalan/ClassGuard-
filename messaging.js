// messaging.js
// Manages student phone numbers and sends SMS/WhatsApp messages
// Supports integration with Twilio (SMS), Twilio WhatsApp, or custom APIs

const Messaging = {
  // API Configuration (set these in production)
  // To override in runtime, set `window.__MESSAGING_CONFIG__ = { ... }` before including this script.
  API_CONFIG: Object.assign(
    {
      SMS_PROVIDER: 'demo', // default to 'demo' for safety: 'twilio', 'aws-sns', 'custom', or 'demo'
      WHATSAPP_PROVIDER: 'demo', // default 'demo'
      TWILIO_ACCOUNT_SID: 'YOUR_TWILIO_ACCOUNT_SID',
      TWILIO_AUTH_TOKEN: 'YOUR_TWILIO_AUTH_TOKEN',
      TWILIO_PHONE_NUMBER: '+14155552671', // Twilio trial number or your purchased number
      TWILIO_WHATSAPP_NUMBER: 'whatsapp:+14155552671', // WhatsApp enabled number
      BACKEND_URL: 'http://localhost:3000/api', // Your backend endpoint for sending
      USE_BROWSER_FETCH: true, // Set to false if using Node.js backend only
    },
    // allow inline overrides from window
    (typeof window !== 'undefined' && window.__MESSAGING_CONFIG__) ? window.__MESSAGING_CONFIG__ : {}
  ),

  getMessagingDB() {
    try {
      return JSON.parse(localStorage.getItem('messagingRecords') || '{"contacts": [], "messages": []}');
    } catch (e) {
      return { contacts: [], messages: [] };
    }
  },

  saveMessagingDB(db) {
    localStorage.setItem('messagingRecords', JSON.stringify(db));
  },

  // Add or update student phone number
  addStudentContact(studentUsername, phoneNumber, whatsappNumber = null) {
    const db = this.getMessagingDB();
    const existing = db.contacts.find((c) => c.studentUsername === studentUsername);

    if (existing) {
      existing.phoneNumber = phoneNumber;
      existing.whatsappNumber = whatsappNumber || phoneNumber;
      existing.updatedAt = new Date().toISOString();
    } else {
      db.contacts.push({
        studentUsername,
        phoneNumber,
        whatsappNumber: whatsappNumber || phoneNumber,
        addedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    this.saveMessagingDB(db);
  },

  // Get student phone contact
  getStudentContact(studentUsername) {
    const db = this.getMessagingDB();
    return db.contacts.find((c) => c.studentUsername === studentUsername);
  },

  // Send SMS to student
  async sendSMS(studentUsername, message, senderName = 'School') {
    const contact = this.getStudentContact(studentUsername);
    if (!contact || !contact.phoneNumber) {
      return {
        success: false,
        error: 'No phone number found for this student',
      };
    }

    const messageRecord = {
      id: 'msg_' + Date.now(),
      to: studentUsername,
      toPhone: contact.phoneNumber,
      message,
      type: 'sms',
      status: 'pending',
      sentAt: new Date().toISOString(),
    };

    // Call SMS API
    try {
      const result = await this._callSMSAPI(contact.phoneNumber, message, senderName);
      // Normalize status: prefer explicit success flag, then provider status, else mark pending
      messageRecord.providerResponse = result;

      if (result && typeof result.success === 'boolean') {
        if (result.success === true) {
          // If provider gives a status field (e.g., queued/accepted/delivered), map it
          const providerStatus = (result.status || '').toLowerCase();
          if (providerStatus === 'delivered') messageRecord.status = 'delivered';
          else messageRecord.status = 'pending';
        } else {
          messageRecord.status = 'failed';
          messageRecord.error = result.error || 'Provider reported failure';
        }
      } else if (result && result.messageId) {
        // Provider returned a message id (likely Twilio) - mark as pending
        messageRecord.status = 'pending';
      } else {
        messageRecord.status = 'failed';
        messageRecord.error = (result && result.error) || 'Unknown provider response';
      }
    } catch (err) {
      messageRecord.status = 'error';
      messageRecord.error = err.message;
    }

    // Store message record
    const db = this.getMessagingDB();
    db.messages.push(messageRecord);
    this.saveMessagingDB(db);

    return messageRecord;
  },

  // Send WhatsApp message to student
  async sendWhatsApp(studentUsername, message, senderName = 'School') {
    const contact = this.getStudentContact(studentUsername);
    if (!contact || !contact.whatsappNumber) {
      return {
        success: false,
        error: 'No WhatsApp number found for this student',
      };
    }

    const messageRecord = {
      id: 'msg_' + Date.now(),
      to: studentUsername,
      toPhone: contact.whatsappNumber,
      message,
      type: 'whatsapp',
      status: 'pending',
      sentAt: new Date().toISOString(),
    };

    // Call WhatsApp API
    try {
      const result = await this._callWhatsAppAPI(contact.whatsappNumber, message, senderName);
      messageRecord.providerResponse = result;

      if (result && typeof result.success === 'boolean') {
        if (result.success === true) {
          const providerStatus = (result.status || '').toLowerCase();
          if (providerStatus === 'delivered') messageRecord.status = 'delivered';
          else messageRecord.status = 'pending';
        } else {
          messageRecord.status = 'failed';
          messageRecord.error = result.error || 'Provider reported failure';
        }
      } else if (result && result.messageId) {
        messageRecord.status = 'pending';
      } else {
        messageRecord.status = 'failed';
        messageRecord.error = (result && result.error) || 'Unknown provider response';
      }
    } catch (err) {
      messageRecord.status = 'error';
      messageRecord.error = err.message;
    }

    // Store message record
    const db = this.getMessagingDB();
    db.messages.push(messageRecord);
    this.saveMessagingDB(db);

    return messageRecord;
  },

  // Internal: Call SMS API (Twilio, AWS SNS, or custom)
  async _callSMSAPI(phoneNumber, message, senderName) {
    const provider = this.API_CONFIG.SMS_PROVIDER;

    if (provider === 'demo') {
      // Demo mode: just log and return success
      console.log(`[DEMO SMS] To: ${phoneNumber}, Message: ${message}`);
      return { success: true, message: 'SMS sent successfully (demo mode)' };
    }

    if (provider === 'twilio') {
      return await this._sendViaTwilio(phoneNumber, message, 'sms');
    }

    if (provider === 'aws-sns') {
      return await this._sendViaAWSSNS(phoneNumber, message);
    }

    if (provider === 'custom') {
      return await this._sendViaCustomAPI(phoneNumber, message, 'sms');
    }

    return { success: false, error: 'Unknown SMS provider' };
  },

  // Internal: Call WhatsApp API (Twilio or custom)
  async _callWhatsAppAPI(phoneNumber, message, senderName) {
    const provider = this.API_CONFIG.WHATSAPP_PROVIDER;

    if (provider === 'demo') {
      // Demo mode: just log and return success
      console.log(`[DEMO WhatsApp] To: ${phoneNumber}, Message: ${message}`);
      return { success: true, message: 'WhatsApp sent successfully (demo mode)' };
    }

    if (provider === 'twilio') {
      return await this._sendViaTwilio(phoneNumber, message, 'whatsapp');
    }

    if (provider === 'custom') {
      return await this._sendViaCustomAPI(phoneNumber, message, 'whatsapp');
    }

    return { success: false, error: 'Unknown WhatsApp provider' };
  },

  // Twilio integration (requires backend to handle credentials safely)
  async _sendViaTwilio(phoneNumber, message, type) {
    try {
      // Option 1: Send via your Node.js backend (recommended for production)
      const response = await fetch(`${this.API_CONFIG.BACKEND_URL}/send-${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: phoneNumber,
          message: message,
          from: type === 'whatsapp' ? this.API_CONFIG.TWILIO_WHATSAPP_NUMBER : this.API_CONFIG.TWILIO_PHONE_NUMBER,
        }),
      });

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Backend not available, trying direct Twilio API...');
      // Option 2: Direct Twilio API call (for demo/development)
      return await this._sendViaTwilioDirect(phoneNumber, message, type);
    }
  },

  // Direct Twilio API (for development/demo - use backend in production!)
  async _sendViaTwilioDirect(phoneNumber, message, type) {
    try {
      const accountSid = this.API_CONFIG.TWILIO_ACCOUNT_SID;
      const authToken = this.API_CONFIG.TWILIO_AUTH_TOKEN;
      const fromNumber = type === 'whatsapp' ? this.API_CONFIG.TWILIO_WHATSAPP_NUMBER : this.API_CONFIG.TWILIO_PHONE_NUMBER;

      // Create basic auth header
      const auth = btoa(`${accountSid}:${authToken}`);

      const body = new URLSearchParams();
      body.append('To', type === 'whatsapp' ? `whatsapp:${phoneNumber}` : phoneNumber);
      body.append('From', fromNumber);
      body.append('Body', message);

      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body,
      });

      const data = await response.json();

      if (response.ok && data.sid) {
        console.log(`✓ Message sent! SID: ${data.sid}`);
        return { success: true, messageId: data.sid, message: 'Message sent successfully!' };
      } else {
        console.error('Twilio error:', data);
        return { success: false, error: data.message || 'Failed to send message' };
      }
    } catch (err) {
      console.error('Twilio API error:', err);
      return { success: false, error: err.message };
    }
  },

  // AWS SNS integration (requires backend)
  async _sendViaAWSSNS(phoneNumber, message) {
    try {
      const response = await fetch(`${this.API_CONFIG.BACKEND_URL}/send-sms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          message,
        }),
      });

      const data = await response.json();
      return data;
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // Custom API integration
  async _sendViaCustomAPI(phoneNumber, message, type) {
    try {
      const response = await fetch(`${this.API_CONFIG.BACKEND_URL}/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: phoneNumber,
          message,
          type, // 'sms' or 'whatsapp'
        }),
      });

      const data = await response.json();
      return data;
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // Get message history for a student
  getMessageHistory(studentUsername) {
    const db = this.getMessagingDB();
    return db.messages.filter((m) => m.to === studentUsername);
  },

  // Send bulk SMS to multiple recipients (recipients: [{ to: '+123...', name: 'Name' }, ...])
  async sendBulkSMS(classNameOrRecipients, message, senderName = 'School') {
    // classNameOrRecipients can be a className string or an array of recipient objects
    let recipients = [];

    if (Array.isArray(classNameOrRecipients)) {
      recipients = classNameOrRecipients;
    } else {
      // assume it's a class name - gather students in class
      if (typeof Attendance === 'undefined') {
        return { success: false, error: 'Attendance module not available' };
      }

      const students = Attendance.getStudentsInClass(classNameOrRecipients || '');
      recipients = students.map((s) => ({ to: null, username: s.username, name: s.name }));

      // attach phone numbers from contacts
      recipients = recipients.map((r) => {
        const c = this.getStudentContact(r.username) || {};
        return { to: c.phoneNumber || null, name: r.name, username: r.username };
      }).filter((r) => r.to);
    }

    if (recipients.length === 0) {
      return { success: false, error: 'No recipients with phone numbers found' };
    }

    const provider = this.API_CONFIG.SMS_PROVIDER;

    // Demo mode: log and store records
    if (provider === 'demo') {
      const db = this.getMessagingDB();
      const results = [];
      for (const r of recipients) {
        console.log(`[DEMO BULK SMS] To: ${r.to}, Message: ${message}`);
        const record = {
          id: 'msg_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
          to: r.username || r.to,
          toPhone: r.to,
          message,
          type: 'sms',
          status: 'delivered',
          sentAt: new Date().toISOString(),
          providerResponse: { demo: true },
        };
        db.messages.push(record);
        results.push({ to: r.to, username: r.username, success: true, status: record.status });
      }
      this.saveMessagingDB(db);
      return { success: true, summary: { total: recipients.length, sent: recipients.length }, results };
    }

    // Production: use backend bulk endpoint when available
    try {
      // prefer backend bulk endpoint
      const response = await fetch(`${this.API_CONFIG.BACKEND_URL}/send-sms-bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipients: recipients.map((r) => ({ to: r.to, name: r.name })), message }),
      });

      const data = await response.json();

      // Persist message records per recipient
      const db = this.getMessagingDB();
      const results = [];

      if (data && Array.isArray(data.results)) {
        for (const res of data.results) {
          const rec = {
            id: 'msg_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
            to: res.to,
            toPhone: res.to,
            message,
            type: 'sms',
            status: res.status || (res.success ? 'pending' : 'failed'),
            sentAt: new Date().toISOString(),
            providerResponse: res,
          };
          db.messages.push(rec);
          results.push({ to: res.to, success: !!res.success, status: rec.status, messageId: res.messageId });
        }
      }

      this.saveMessagingDB(db);
      return { success: true, summary: data.summary || { total: results.length }, results };
    } catch (err) {
      // Fallback: attempt individual sends (may be slower)
      const results = [];
      for (const r of recipients) {
        try {
          const res = await this._callSMSAPI(r.to, message, senderName);
          results.push({ to: r.to, success: !!res.success, status: res.status || (res.messageId ? 'pending' : 'failed'), providerResponse: res });
          // store record
          const db = this.getMessagingDB();
          db.messages.push({ id: 'msg_' + Date.now() + '_' + Math.floor(Math.random() * 1000), to: r.username || r.to, toPhone: r.to, message, type: 'sms', status: res.success ? 'pending' : 'failed', sentAt: new Date().toISOString(), providerResponse: res });
          this.saveMessagingDB(db);
        } catch (e) {
          results.push({ to: r.to, success: false, error: e.message });
        }
      }

      return { success: true, summary: { total: results.length }, results };
    }
  },

  // Send bulk WhatsApp by iterating each recipient (backend doesn't provide bulk WhatsApp endpoint)
  async sendBulkWhatsApp(classNameOrRecipients, message, senderName = 'School') {
    let recipients = [];

    if (Array.isArray(classNameOrRecipients)) {
      recipients = classNameOrRecipients;
    } else {
      if (typeof Attendance === 'undefined') return { success: false, error: 'Attendance module not available' };
      const students = Attendance.getStudentsInClass(classNameOrRecipients || '');
      recipients = students.map((s) => ({ to: null, username: s.username, name: s.name }));
      recipients = recipients.map((r) => {
        const c = this.getStudentContact(r.username) || {};
        return { to: c.whatsappNumber || c.phoneNumber || null, name: r.name, username: r.username };
      }).filter((r) => r.to);
    }

    if (recipients.length === 0) return { success: false, error: 'No WhatsApp-capable recipients found' };

    const provider = this.API_CONFIG.WHATSAPP_PROVIDER;
    const results = [];

    if (provider === 'demo') {
      const db = this.getMessagingDB();
      for (const r of recipients) {
        console.log(`[DEMO BULK WhatsApp] To: ${r.to}, Message: ${message}`);
        const rec = { id: 'msg_' + Date.now() + '_' + Math.floor(Math.random() * 1000), to: r.username || r.to, toPhone: r.to, message, type: 'whatsapp', status: 'delivered', sentAt: new Date().toISOString(), providerResponse: { demo: true } };
        db.messages.push(rec);
        results.push({ to: r.to, success: true, status: 'delivered' });
      }
      this.saveMessagingDB(db);
      return { success: true, summary: { total: recipients.length, sent: recipients.length }, results };
    }

    // Production: call backend per recipient (parallel)
    const promises = recipients.map(async (r) => {
      try {
        const resp = await fetch(`${this.API_CONFIG.BACKEND_URL}/send-whatsapp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: r.to, message }),
        });
        const data = await resp.json();
        const status = data.status || (data.success ? 'pending' : 'failed');
        // store
        const db = this.getMessagingDB();
        db.messages.push({ id: 'msg_' + Date.now() + '_' + Math.floor(Math.random() * 1000), to: r.username || r.to, toPhone: r.to, message, type: 'whatsapp', status, sentAt: new Date().toISOString(), providerResponse: data });
        this.saveMessagingDB(db);
        return { to: r.to, success: !!data.success, status, messageId: data.messageId };
      } catch (err) {
        return { to: r.to, success: false, error: err.message };
      }
    });

    const resultsArr = await Promise.all(promises);
    return { success: true, summary: { total: resultsArr.length }, results: resultsArr };
  },

  // Get all messages (for admin view)
  getAllMessages() {
    const db = this.getMessagingDB();
    return db.messages;
  },

  // Get message stats
  getMessageStats() {
    const db = this.getMessagingDB();
    const messages = db.messages;

    const stats = {
      total: messages.length,
      delivered: messages.filter((m) => m.status === 'delivered').length,
      failed: messages.filter((m) => m.status === 'failed').length,
      pending: messages.filter((m) => m.status === 'pending').length,
      sms: messages.filter((m) => m.type === 'sms').length,
      whatsapp: messages.filter((m) => m.type === 'whatsapp').length,
    };

    return stats;
  },
};
