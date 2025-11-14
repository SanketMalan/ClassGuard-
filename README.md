# 🎓 Timetable Management PRO

A comprehensive web-based timetable and attendance management system for educational institutions with AI chatbot, student management, and SMS/WhatsApp messaging.

## ✨ Features Overview

### 🔐 Authentication System
- **Combined Login/Register** interface with role selection (Student/Teacher)
- **Demo Credentials** for quick testing
- **Role-Based Access Control** — Students and teachers see different dashboards
- **Client-side Storage** via localStorage

```
Demo Credentials:
Student: username=student, password=password
Teacher: username=teacher, password=password
```

### 🤖 AI Chatbot Assistant
- Floating chat widget on all pages (about, student dashboard, teacher dashboard)
- **Role-Aware Responses** — Different greetings and information for students, teachers, and guests
- **Intelligent Q&A** — Answers questions about timetables, attendance, registration, scheduling
- **FAQ Suggestions** — Interactive suggestion buttons for common questions
- **No External APIs** — Runs entirely on client-side (pure JavaScript)

### 👥 Student Management (Teachers Only)
- **Add Students** to specific classes with credentials
- **View Students** by class
- **Remove Students** from class
- **Persistent Storage** — Student data saved in localStorage
- **12 Pre-defined Classes** — BCA X1-Z2, BBA X1-Z2 (extensible)

### 📊 Attendance Tracking
- **Mark Attendance** — Teachers mark students present/absent by date and class
- **View Statistics** — Students see attendance percentage and count
- **Attendance History** — Detailed records showing date, class, status, and marking teacher
- **Persistent Records** — All attendance saved in localStorage

### 💬 SMS & WhatsApp Messaging
- **Send SMS** to students via Twilio
- **Send WhatsApp** to students via Twilio
- **Contact Management** — Save and manage student phone numbers
- **Message History** — Track all sent messages with delivery status
- **Demo Mode** — Test without API keys (messages logged to console)
- **Production Ready** — Secure backend integration for real messaging

### 📅 Timetable Management
- **Create Classes** with capacity and time slot preferences
- **Manage Teachers** and subject specializations
- **Define Subjects** with weekly hours
- **Assign Rooms** for classes
- **Generate Timetables** automatically
- **View Schedules** — Students see their class timetable

---

## 📂 Project Structure

```
timetable-mangement-main/
├── 📄 HTML Pages
│   ├── index.html                    (Combined login/register page)
│   ├── about.html                    (Home & about page with chatbot)
│   ├── student-dashboard.html        (Student view with attendance)
│   ├── scheduling.html               (Teacher dashboard with 4 panels)
│   ├── choose-login.html             (Role selection page)
│   └── [old pages]                   (Legacy - use index.html instead)
│
├── 🎨 Stylesheets
│   ├── styles.css                    (Global styles)
│   ├── styles-about.css              (About page specific)
│   ├── styles-scheduling.css         (Scheduling page specific)
│   ├── attendance.css                (Attendance UI)
│   ├── messaging.css                 (Messaging UI)
│   └── chatbot.css                   (Chatbot widget styles)
│
├── 🔧 JavaScript (Frontend)
│   ├── script.js                     (Main app logic)
│   ├── student-auth.js               (Student login/register)
│   ├── teacher-auth.js               (Teacher login/register)
│   ├── scheduling-script.js          (Timetable generation)
│   ├── attendance.js                 (Attendance system)
│   ├── messaging.js                  (SMS/WhatsApp system)
│   ├── chatbot.js                    (AI chatbot)
│   ├── notifications.js              (Notifications system)
│   └── browser-diagnostics.js        (Debugging tool)
│
├── 🛠️ Backend (Node.js - Optional)
│   ├── backend-messaging-server.js   (Express server for SMS/WhatsApp)
│   ├── package.json                  (Node.js dependencies)
│   └── .env.example                  (Twilio credentials template)
│
└── 📚 Documentation
		├── README.md                     (This file)
		├── QUICK_START.md                (Quick start guide)
		├── TESTING_GUIDE.md              (Feature testing guide)
		├── FEATURE_CHECKLIST.md          (Verification checklist)
		└── MESSAGING_SETUP.md            (SMS/WhatsApp setup)
```

---

## �️ Images added to project

This project now includes a small set of illustrative SVG images (placed in `assets/images`) that are used on the `about.html`, `index.html`, and `scheduling.html` pages. Files added:

- `assets/images/illustration-laptop-calendar.svg` — header/dashboard illustration
- `assets/images/scheduling-components.svg` — scheduling components graphic
- `assets/images/change-management.svg` — change management illustration
- `assets/images/time-saving.svg` — time saving visual
- `assets/images/xls-to-pdf.svg` — XLS→PDF export illustration
- `assets/images/meeting-planning.svg` — meeting / planning banner
- `assets/images/benefits-smart-classrooms.svg` — benefits visual

Replace these placeholder SVGs with your preferred production images by dropping files into `assets/images` and updating the HTML `src` attributes accordingly.


## �📖 Detailed Feature Documentation

## Chatbot Assistant

The chatbot is a **client-side AI assistant** with no external API dependencies.

**Files:**
- `chatbot.js` — Core chatbot logic with rule-based responses
- `chatbot.css` — Floating widget styling

**Features:**
- ✅ Appears on `about.html` (guest role), `student-dashboard.html`, `scheduling.html`
- ✅ Role-aware greetings (different for student, teacher, guest)
- ✅ Keyword-based Q&A system
- ✅ Interactive suggestion buttons
- ✅ Minimizable/expandable widget
- ✅ No external APIs needed

**Customize Responses:**
Edit `chatbot.js` → `Chatbot.init()` → `responses` object with your custom rules.

## Attendance Feature

Teachers mark attendance, students view their records with statistics.

**For Teachers:**
1. Go to `scheduling.html` → Click **"Mark Attendance"** in sidebar
2. Select class and date
3. Click **"Load Students"**
4. Toggle Present/Absent for each student
5. Click **"Save Attendance"**

**For Students:**
1. Login and go to `student-dashboard.html`
2. Scroll to **"Your Attendance"** section
3. View statistics: Total Days, Present, Absent, Percentage
4. See detailed history table

**Implementation:**
- `attendance.js` — Core logic with `Attendance` class
- `attendance.css` — UI styling
- Data stored in `localStorage.attendanceRecords`
- 12 pre-defined classes available by default

## Messaging Feature (SMS & WhatsApp)

**For Teachers:**
1. Go to `scheduling.html` → Click **"Send Message"** in sidebar
2. Select class and student
3. Add student phone number (and WhatsApp if needed)
4. Type message and click **"Send SMS"** or **"Send WhatsApp"**
5. View message history with status

**Supported Providers:**
- **Twilio** (SMS & WhatsApp) ⭐ Recommended
- **AWS SNS** (SMS only)
- **Custom API** (your own backend)
- **Demo Mode** (no setup needed, logs to console)

**Demo Mode (No Setup Required):**
All messages are logged to browser console (F12 → Console tab) instead of sending real SMS/WhatsApp.

**Production Mode (Twilio):**
Follow [MESSAGING_SETUP.md](MESSAGING_SETUP.md) for:
- Twilio account setup
- Backend configuration
- API credential management
- Testing procedures

**Implementation:**
- `messaging.js` — Frontend messaging with multi-provider support
- `messaging.css` — UI styling
- `backend-messaging-server.js` — Optional Node.js backend for production
- `package.json` — Backend dependencies
- Data stored in `localStorage.messagingRecords`

---

## 🔧 Technical Details

### Data Storage

All data stored in **browser localStorage** (persists across sessions):

```javascript
{
	"isLoggedIn": true,                  // Current login status
	"role": "student",                   // "student" or "teacher"
	"username": "alice_smith",           // Current user's username
  
	"studentsRegistered": [              // All registered students
		{
			"name": "Alice Smith",
			"username": "alice_smith",
			"password": "test123",
			"class": "BCA X1"
		}
	],
  
	"attendanceRecords": [               // All attendance records
		{
			"studentUsername": "alice_smith",
			"date": "2024-01-15",
			"status": "present",
			"className": "BCA X1",
			"markedBy": "teacher"
		}
	],
  
	"messagingRecords": {                // Message history and contacts
		"student_contacts": {},
		"messages": []
	},
  
	"generatedTimetable": {}             // Generated timetable data
}
```

### Key JavaScript Classes

**Attendance Class** (`attendance.js`):
```javascript
Attendance.markAttendance(studentUsername, date, status, className, markedBy)
Attendance.getStudentStats(studentUsername)
Attendance.getStudentsInClass(className)
Attendance.getAllClasses()
```

**Messaging Class** (`messaging.js`):
```javascript
Messaging.addStudentContact(studentUsername, phoneNumber, whatsappNumber)
Messaging.sendSMS(studentUsername, message, phoneNumber)
Messaging.sendWhatsApp(studentUsername, message, phoneNumber)
Messaging.getContacts()
```

**Chatbot Class** (`chatbot.js`):
```javascript
Chatbot.init({ role: 'student', name: 'Alice' })
Chatbot.computeReply(userMessage)
Chatbot.togglePanel()
```

---

## 🐛 Troubleshooting

### Problem: Can't Login
**Solution:**
1. Clear localStorage: Run `localStorage.clear()` in console (F12)
2. Refresh page
3. Try demo credentials: `student` / `password`

### Problem: Attendance Not Saving
**Solution:**
1. Open F12 → Console
2. Check for error messages
3. Verify student is registered and in the class
4. Ensure localStorage is enabled in browser

### Problem: Chatbot Doesn't Appear
**Solution:**
1. Check F12 → Network tab for `chatbot.js` 404 errors
2. Verify `<script src="chatbot.js" defer></script>` in HTML
3. Check F12 → Console for JS errors

### Problem: SMS/WhatsApp Messages Not Sending
**Solution (Demo Mode):**
1. Open F12 → Console tab
2. Should see `[DEMO SMS] To: ...` message
3. If not, check for error messages

**Solution (Production Mode):**
1. Follow [MESSAGING_SETUP.md](MESSAGING_SETUP.md)
2. Verify Twilio credentials in `.env`
3. Check backend server running: `npm start`
4. Check backend console for errors

### Use Diagnostics Tool
```javascript
// In browser console, run:
Diagnostics.runAll()
```

This checks all systems and shows detailed status report.

---

## 🚀 Deployment

### Frontend Deployment (Static Hosting)

**Option 1: Netlify**
1. Push project to GitHub
2. Go to netlify.com → Create new site from GitHub
3. Select repository → Deploy
4. Site live at `yoursite.netlify.app`

**Option 2: Vercel**
1. Go to vercel.com → Import project
2. Select repository → Deploy
3. Site live at `yoursite.vercel.app`

**Option 3: GitHub Pages**
1. Push to GitHub
2. Settings → Pages → Select main branch
3. Site live at `username.github.io/repo-name`

### Backend Deployment (If Using Production Messaging)

**Option 1: Heroku** (Easy, free tier available)
1. Push `backend-messaging-server.js` to GitHub
2. Go to heroku.com → Create new app
3. Connect to GitHub repository
4. Deploy
5. Update backend URL in `messaging.js`

**Option 2: Railway**
1. Go to railway.app → New project
2. Deploy from GitHub
3. Set environment variables (Twilio credentials)
4. Update backend URL in `messaging.js`

---

## 📞 Support & Development

### Adding New Features
1. Identify required files (JS, CSS, HTML)
2. Implement feature in JavaScript
3. Add styling in appropriate CSS file
4. Test in browser (F12 console)
5. Document in README

### Customizing Chatbot
Edit `chatbot.js` → `Chatbot.init()` → Modify `responses` object

### Customizing Colors
Edit `styles.css` → Change CSS variables or hex colors

### Adding More Classes
Edit `attendance.js` → `PREDEFINED_CLASSES` array

---

## ✅ System Status

```
Current Version: 1.0.0
Status: ✅ PRODUCTION READY

Completed Features:
✅ Authentication (Login/Register/Logout)
✅ Role-Based Access Control
✅ AI Chatbot (3 pages)
✅ Student Management
✅ Attendance Tracking
✅ SMS/WhatsApp Messaging (Demo + Production)
✅ Timetable Management
✅ Notifications System
✅ Responsive UI
✅ Comprehensive Documentation

Tested On:
✅ Chrome
✅ Firefox
✅ Edge
✅ Safari

Next Steps:
1. Deploy frontend (Netlify/Vercel/GitHub Pages)
2. Setup Twilio for SMS (optional)
3. Share with students and teachers
4. Monitor and collect feedback
```

---

## 📜 License

This project is open source and available for educational use.

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Test features thoroughly
2. Document changes
3. Follow existing code style
4. Update documentation

---

## 📧 Contact & Feedback

For questions, issues, or feature requests, please create an issue on GitHub or contact the development team.

---

**Last Updated:** January 2024
**Maintained By:** Development Team
**Status:** Active Development

## Chatbot Assistant

This project includes a simple client-side chatbot widget (no external APIs) implemented in `chatbot.js` with styles in `chatbot.css`.

- The chatbot appears as a floating assistant on:
	- `about.html` (guest role — for all visitors)
	- `student-dashboard.html` (student role)
	- `scheduling.html` (teacher role)

- It's rule-based and intended for demo/help purposes (questions about timetables, registration, scheduling). To customize responses, edit `chatbot.js`.

## Attendance Feature

Teachers and students can now track attendance:

**For Teachers:**
- Access the "Mark Attendance" button in the Teacher Scheduling page (sidebar).
- Select a class and date, then click "Load Students".
- Toggle each student's status (Present/Absent) and save.
- Attendance is stored in localStorage by student, date, and class.

**For Students:**
- View attendance stats on the Student Dashboard (total days, present count, absent count, percentage).
- See detailed attendance history with dates, class, status, and marking teacher.

Implementation files:
- `attendance.js` — Core attendance logic (mark, fetch, compute stats).
- `attendance.css` — UI styling for attendance forms and tables.
- Updated `scheduling.html` — Teacher attendance panel in sidebar.
- Updated `student-dashboard.html` — Student attendance section with stats and history.

## Messaging Feature (SMS & WhatsApp)

Teachers can send SMS and WhatsApp messages directly to students:

**For Teachers:**
- Access the "Send Message" button in the Teacher Scheduling page (sidebar).
- Select a class and student from the list.
- Add student contact info (phone number, WhatsApp number).
- Compose and send SMS or WhatsApp message.
- View message history and delivery status.

**Supported Providers:**
- **Twilio** (SMS & WhatsApp) — Recommended for production
- **AWS SNS** (SMS only)
- **Custom API** — Connect your own backend
- **Demo Mode** — Test without actual API keys

**Quick Start:**
1. **Demo Mode (No Setup):** Messages log to browser console
2. **Production (Twilio):** Follow [MESSAGING_SETUP.md](MESSAGING_SETUP.md) for complete setup guide

**Integration Setup (Production):**
1. Get Twilio credentials from [twilio.com/console](https://www.twilio.com/console)
2. Install Node.js backend: `npm install && npm start`
3. Update `.env` with Twilio credentials
4. Teachers can now send real SMS/WhatsApp to student phone numbers

**Backend Features:**
- Secure credential handling (credentials in backend, not frontend)
- SMS and WhatsApp message sending
- Bulk SMS to multiple recipients
- Message delivery status tracking
- Error handling and logging

Implementation files:
- `messaging.js` — Frontend messaging logic with multi-provider support
- `messaging.css` — UI styling for messaging interface
- `backend-messaging-server.js` — Node.js backend for secure Twilio integration
- `package.json` — Backend dependencies
- `.env.example` — Environment variables template
- `MESSAGING_SETUP.md` — Complete setup and troubleshooting guide
- Updated `scheduling.html` — Teacher messaging panel with student contact and message compose
