# Messaging Manual Verification

This document lists quick manual tests to verify SMS and WhatsApp send flows (demo and production with Twilio backend).

## 1) Quick Demo Test (no backend)
- Purpose: Verify frontend flows and localStorage message records without real SMS.

Steps:
1. Open `about.html` in your browser (or use Live Server) and login as teacher (`teacher` / `password`).
2. Go to **Send Message** panel in `scheduling.html`.
3. Select a class and click a student to populate the contact form.
4. Enter a phone number (any format) into **Phone Number** (for demo this is only stored).
5. Click **Save Contact Info**.
6. Type a message in the compose box and click **Send SMS**.
7. Open browser developer console (F12 → Console) and verify you see a log like:
   ```
   [DEMO SMS] To: +919876543210, Message: Hello Bob...
   ```
8. In the UI you should see a success alert "SMS request accepted for ..." and the message appears in **Message History**.
9. Inspect `localStorage.getItem('messagingRecords')` in console to verify a message record with `type: 'sms'` and `status: 'pending'` or `delivered` exists.

## 2) Quick WhatsApp Demo Test (no backend)
- Follow the same steps but click **Send WhatsApp**. Console will show:
  ```
  [DEMO WhatsApp] To: +919876543210, Message: Hello Bob...
  ```
- Message will be stored in `messagingRecords` with `type: 'whatsapp'`.

## 3) Production Test (Twilio backend)
> Requires Node.js backend running (`backend-messaging-server.js`) and valid Twilio credentials.

### a) Prepare backend
1. Create a `.env` file in the project root with:
   ```env
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1415...    # Twilio SMS capable number
   TWILIO_WHATSAPP_NUMBER=whatsapp:+1415...  # Twilio WhatsApp-enabled number
   PORT=3000
   ```
2. Install dependencies and start the server (PowerShell):
   ```powershell
   cd "c:\Users\bhave\Downloads\timetable-mangement-main"
   npm install express twilio dotenv cors body-parser
   node backend-messaging-server.js
   ```
3. Confirm backend logs: `Backend messaging server running on http://localhost:3000` and endpoints listed.

### b) Configure frontend to use backend
- Option A: Edit `messaging.js` in the `API_CONFIG.BACKEND_URL` to point to `http://localhost:3000/api` (default).
- Option B (runtime override): In the page that includes `messaging.js` (e.g., in `scheduling.html` before the script), set:
  ```html
  <script>
  window.__MESSAGING_CONFIG__ = { SMS_PROVIDER: 'twilio', WHATSAPP_PROVIDER: 'twilio', BACKEND_URL: 'http://localhost:3000/api' };
  </script>
  <script src="messaging.js"></script>
  ```

### c) Run production send
1. In `scheduling.html` UI, select a student and ensure contact phone number is in international format (e.g., +919876543210).
2. Compose message and click **Send SMS**.
3. Monitor backend console — you should see logs like `✓ SMS sent to +919876543210. SID: SMxxx STATUS: queued`.
4. The frontend should display a success alert: "SMS request accepted for +919876543210." and message stored in `messagingRecords` with `providerResponse` including `messageId` and `status`.
5. Optionally check message status via:
   ```powershell
   curl http://localhost:3000/api/message/<MESSAGE_SID>
   ```
   or open the browser to the endpoint.

## 4) Bulk and Edge Cases
- Test invalid phone number formats — backend should return 400 with helpful message.
- Test offline backend — frontend falls back to direct Twilio attempt (only if TWILIO creds are set in client which is not recommended). In general, run backend for production.

## 5) Verification Checklist (quick)
- [ ] Contact saved in localStorage
- [ ] Demo logs shown in browser console for demo mode
- [ ] Message record created in `messagingRecords` with correct `type` and `status`
- [ ] Backend returns `success: true` and `status` when Twilio is used
- [ ] Frontend shows request accepted alert
- [ ] Message history displays new message

---

If you'd like, I can:
- Run an automated headless test that fires the frontend send functions (requires a headless browser environment).
- Help you set up Twilio credentials and run the backend locally (I can add `.env.example` instructions and a simple PowerShell script).

