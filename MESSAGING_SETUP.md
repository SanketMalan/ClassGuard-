# SMS & WhatsApp Messaging Setup Guide

This guide will help you set up real SMS and WhatsApp messaging in the Timetable Management system.

## Quick Start (Demo Mode - No Setup Required)

By default, the system runs in **demo mode** where messages are logged to the console without actual API calls. This is perfect for testing and demos.

### To use Demo Mode:
1. Open the Timetable Management app in your browser
2. Log in as a teacher
3. Go to Scheduling → "Send Message"
4. Add student contact info and send a message
5. Check your browser console (F12 → Console) to see the demo message logged

---

## Production Setup (Real SMS/WhatsApp)

To send actual SMS and WhatsApp messages to student phones, follow these steps:

### Step 1: Create Twilio Account

1. Go to [twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. Sign up for a free account
3. Verify your phone number
4. Go to [twilio.com/console](https://www.twilio.com/console)
5. Copy your:
   - **Account SID** (starts with `AC`)
   - **Auth Token** (keep this secret!)

### Step 2: Get a Phone Number for SMS

1. In Twilio Console, go to **Phone Numbers** → **Buy a Number**
2. Select your country and get a phone number
3. This number will be used to send SMS messages
4. Example: `+12025551234`

### Step 3: Enable WhatsApp (Optional)

#### Option A: Use Twilio WhatsApp Sandbox (Free)
1. In Twilio Console, go to **Messaging** → **Try it Out** → **Send an SMS**
2. Click on **WhatsApp** tab
3. You'll see a sandbox number like `+14155552671`
4. Customers must opt-in to your sandbox first

#### Option B: Use Your Phone Number for WhatsApp (Requires Business Account)
1. Request WhatsApp Business API access in Twilio Console
2. Use your purchased phone number for WhatsApp

### Step 4: Set Up Backend Server

#### Option A: Use Node.js Backend (Recommended)

1. **Install Node.js** from [nodejs.org](https://nodejs.org/)

2. **Navigate to project directory:**
   ```bash
   cd c:\Users\bhave\Downloads\timetable-mangement-main\timetable-mangement-main
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Create `.env` file** in the project root:
   ```bash
   cp .env.example .env
   ```

5. **Edit `.env` with your Twilio credentials:**
   ```
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_PHONE_NUMBER=+12025551234
   TWILIO_WHATSAPP_NUMBER=whatsapp:+14155552671
   PORT=3000
   ```

6. **Start the backend server:**
   ```bash
   npm start
   ```

   You should see:
   ```
   ✓ Backend messaging server running on http://localhost:3000
   ✓ SMS endpoint: POST /api/send-sms
   ✓ WhatsApp endpoint: POST /api/send-whatsapp
   ```

7. **Update messaging.js frontend configuration:**
   ```javascript
   // In messaging.js, line ~5
   API_CONFIG: {
     SMS_PROVIDER: 'twilio',
     WHATSAPP_PROVIDER: 'twilio',
     BACKEND_URL: 'http://localhost:3000/api', // ← Make sure this matches
   }
   ```

#### Option B: Use Backend Only (Headless)

If you prefer not to run a Node.js server on the frontend:

1. Deploy `backend-messaging-server.js` to a cloud server (Heroku, AWS, Vercel, etc.)
2. Update `BACKEND_URL` in `messaging.js` to your deployed server URL
3. Frontend will call your backend API

---

## Testing

### Test SMS Sending

1. **Start Backend Server** (if using Node.js):
   ```bash
   npm start
   ```

2. **Open Timetable Management** in your browser

3. **Go to Scheduling → "Send Message"**

4. **Select a class and student**

5. **Add phone number** (use your own number to test):
   ```
   +1 (555) 123-4567  →  +15551234567
   ```

6. **Type a test message:**
   ```
   Hello! This is a test message from Timetable Management.
   ```

7. **Click "Send SMS"**

8. **Expected Results:**
   - You should receive the SMS on your phone within a few seconds
   - Status shows "delivered" in the UI
   - Check backend console for confirmation: `✓ SMS sent to +15551234567. SID: SMxxxxxxxx`

### Test WhatsApp Sending

#### Using Twilio WhatsApp Sandbox:

1. **First time only:** Send a WhatsApp message to the sandbox number with text: `join <your-sandbox-code>`
   - Sandbox number: `+14155552671`
   - You'll receive a confirmation

2. **Then:** Follow same steps as SMS test above
   - Click "Send WhatsApp" instead
   - Message will be sent via WhatsApp

---

## API Endpoints

When backend server is running at `http://localhost:3000`:

### Send SMS
```bash
POST /api/send-sms
Content-Type: application/json

{
  "to": "+15551234567",
  "message": "Hello, this is a test SMS!"
}

Response:
{
  "success": true,
  "messageId": "SMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "message": "SMS sent successfully!",
  "to": "+15551234567",
  "sentAt": "2025-11-12T10:30:00.000Z"
}
```

### Send WhatsApp
```bash
POST /api/send-whatsapp
Content-Type: application/json

{
  "to": "+15551234567",
  "message": "Hello, this is a test WhatsApp!"
}

Response:
{
  "success": true,
  "messageId": "SMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "message": "WhatsApp message sent successfully!",
  "to": "+15551234567",
  "sentAt": "2025-11-12T10:30:00.000Z"
}
```

### Send Bulk SMS
```bash
POST /api/send-sms-bulk
Content-Type: application/json

{
  "recipients": [
    { "to": "+15551234567", "name": "John Doe" },
    { "to": "+15559876543", "name": "Jane Smith" }
  ],
  "message": "Class reminder: Assembly at 10 AM"
}

Response:
{
  "success": true,
  "summary": {
    "total": 2,
    "sent": 2,
    "failed": 0
  },
  "results": [
    { "to": "+15551234567", "name": "John Doe", "success": true, "messageId": "SMxxxx" },
    { "to": "+15559876543", "name": "Jane Smith", "success": true, "messageId": "SMxxxx" }
  ]
}
```

---

## Troubleshooting

### "Backend not available" Error

**Problem:** Messages fail with "Backend not available" error

**Solution:**
1. Make sure backend server is running: `npm start`
2. Check backend is on correct port (default: 3000)
3. Verify `BACKEND_URL` in messaging.js matches backend server URL
4. Check browser console for detailed error messages

### "Invalid phone number format"

**Problem:** Error says "Invalid phone number format"

**Solution:**
- Use international format with country code
- ✅ Correct: `+15551234567`, `+441234567890`, `+919876543210`
- ❌ Wrong: `555-1234567`, `(555) 123-4567`, `9876543210`

### "Invalid Twilio credentials"

**Problem:** Error says "Invalid Twilio credentials"

**Solution:**
1. Check your `.env` file has correct credentials
2. Copy credentials again from [twilio.com/console](https://www.twilio.com/console)
3. Make sure no extra spaces or quotes in `.env` file
4. Restart backend server after updating credentials

### WhatsApp Message Not Received

**Problem:** WhatsApp message shows as sent but not received

**Solution:**
1. **Using Sandbox:** Customer must first send "join" command to sandbox number
   - Send WhatsApp message to `+14155552671`
   - Message text: `join <your-sandbox-code>` (code shown in Twilio console)
2. **Using Business Account:** Verify customer is in your approved contacts list
3. **Check Status:** Use message SID to check delivery status

---

## Switching Between Providers

### To Use Demo Mode (Default)
```javascript
// In messaging.js
API_CONFIG: {
  SMS_PROVIDER: 'demo',
  WHATSAPP_PROVIDER: 'demo',
  // ... rest of config
}
```

### To Use Twilio (Production)
```javascript
// In messaging.js
API_CONFIG: {
  SMS_PROVIDER: 'twilio',
  WHATSAPP_PROVIDER: 'twilio',
  TWILIO_ACCOUNT_SID: 'your_sid',
  TWILIO_AUTH_TOKEN: 'your_token',
  TWILIO_PHONE_NUMBER: '+your_number',
  TWILIO_WHATSAPP_NUMBER: 'whatsapp:+your_number',
  BACKEND_URL: 'http://localhost:3000/api',
}
```

---

## Security Best Practices

1. **Never commit `.env` file** to version control
2. **Use `.env.example`** as template for developers
3. **Keep Auth Token secret** — regenerate if exposed
4. **Use HTTPS** in production (not just HTTP)
5. **Validate phone numbers** before sending
6. **Rate limit API** to prevent abuse
7. **Log messages** for audit trail

---

## Deployment

### Deploy Backend to Heroku

1. **Create Heroku account** at [heroku.com](https://www.heroku.com)

2. **Install Heroku CLI:** [heroku.com/articles/heroku-cli](https://devcenter.heroku.com/articles/heroku-cli)

3. **Deploy:**
   ```bash
   heroku create your-app-name
   heroku config:set TWILIO_ACCOUNT_SID=your_sid
   heroku config:set TWILIO_AUTH_TOKEN=your_token
   heroku config:set TWILIO_PHONE_NUMBER=+your_number
   heroku config:set TWILIO_WHATSAPP_NUMBER=whatsapp:+your_number
   git push heroku main
   ```

4. **Update Frontend:**
   - Change `BACKEND_URL` in messaging.js to: `https://your-app-name.herokuapp.com/api`

---

## Support

- **Twilio Docs:** [twilio.com/docs/sms](https://www.twilio.com/docs/sms)
- **WhatsApp API:** [twilio.com/docs/whatsapp](https://www.twilio.com/docs/whatsapp)
- **Twilio Support:** [twilio.com/help](https://www.twilio.com/help)
