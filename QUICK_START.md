# 🚀 Quick Start Guide

## Installation & Setup (60 seconds)

### Option 1: Using Live Server (Recommended for Testing)
1. Open VS Code
2. Install "Live Server" extension (5 Minute Server)
3. Right-click `index.html` → "Open with Live Server"
4. Browser opens automatically to http://localhost:5500

### Option 2: Using Python HTTP Server
```powershell
cd "c:\Users\bhave\Downloads\timetable-mangement-main"
python -m http.server 8000
```
Then open: http://localhost:8000

### Option 3: Using Node.js HTTP Server
```powershell
npm install -g http-server
cd "c:\Users\bhave\Downloads\timetable-mangement-main"
http-server
```
Then open: http://localhost:8080

---

## 📋 Demo Credentials

Use these to test immediately (no signup needed):

### Student Login
- **Username:** `student`
- **Password:** `password`
- **Class:** Any (defaults to demo class)

### Teacher Login
- **Username:** `teacher`
- **Password:** `password`
- **Subject:** Any (defaults to demo subject)

---

## 🎯 First-Time User Workflow

### Step 1: Access the Application
1. Go to `about.html` (homepage)
2. See "Timetable Management PRO" header
3. Click **Login** button in navbar

### Step 2: Choose Your Role
1. You're now on `choose-login.html`
2. Click either:
   - **"Teacher Login"** → Goes to `index.html#login-teacher`
   - **"Student Login"** → Goes to `index.html#login-student`

### Step 3: Login with Demo Credentials
1. Enter username: `student` (or `teacher`)
2. Enter password: `password`
3. Click **Login**
4. ✅ Auto-redirects to your dashboard

### Step 4: Explore Dashboard Features
**If Student:**
- View your timetable
- Check attendance records
- See attendance percentage

**If Teacher:**
- Mark student attendance
- Manage students
- Send SMS/WhatsApp messages
- Generate timetables

### Step 5: Test Chatbot
1. Look bottom-right corner for **💬 chat bubble**
2. Click it to open chat
3. Type a question like "What is attendance?"
4. Get AI-powered responses

---

## ✨ Key Features to Try

### 1️⃣ Student Registration (3 minutes)
```
1. Go to about.html → Login → Student Registration
   OR directly: index.html#register-student
2. Fill form:
   - Name: Alice Smith
   - Username: alice_smith
   - Password: test123
   - Class: BCA X1
3. Click Register
4. Login with alice_smith / test123
```

### 2️⃣ Mark Attendance (2 minutes)
```
1. Login as teacher (teacher / password)
2. Click "Mark Attendance" in sidebar
3. Select Class: BCA X1
4. Select Today's Date
5. Click "Load Students"
6. Toggle Present/Absent for each student
7. Click "Save Attendance"
```

### 3️⃣ Send SMS (1 minute)
```
1. Login as teacher
2. Click "Send Message" in sidebar
3. Select Student: Alice Smith
4. Add Phone: +919876543210
5. Type message: "Hello Alice"
6. Click "Send SMS"
✅ Message logged in browser console
```

### 4️⃣ View Attendance Stats (1 minute)
```
1. Login as student (alice_smith / test123)
2. Go to Student Dashboard
3. Scroll to "Your Attendance" section
4. ✅ See:
   - Total Days: X
   - Present: Y
   - Absent: Z
   - Percentage: 75%
```

---

## 🛠️ Troubleshooting

### ❌ "Cannot find element" errors
**Solution:** Clear browser cache
```
Ctrl + Shift + Delete → Select "Cached images and files" → Clear
```

### ❌ Styles not loading (buttons look plain)
**Solution:** Verify CSS files exist:
- styles.css ✅
- styles-about.css ✅
- styles-scheduling.css ✅
- attendance.css ✅
- messaging.css ✅
- chatbot.css ✅

### ❌ Can't login with demo credentials
**Solution:** 
```javascript
// Run in browser console (F12):
localStorage.clear()
// Then refresh page and try again
```

### ❌ Chatbot doesn't appear
**Solution:** Open F12 console and check for red errors
- Most likely: chatbot.js not loaded
- Fix: Verify file exists and HTML has `<script src="chatbot.js"></script>`

### ❌ SMS "Send" button does nothing
**Solution:**
- Check browser console (F12 → Console tab)
- Should see: `[DEMO SMS] To: +919876543210, Message: ...`
- If not, check phone number format

---

## 📁 Important File Locations

| File | Purpose | Access |
|------|---------|--------|
| `index.html` | Combined login/register | Direct link or from navbar |
| `about.html` | Homepage & intro | Start here |
| `student-dashboard.html` | Student view (after login) | Auto-redirect after login |
| `scheduling.html` | Teacher dashboard (after login) | Auto-redirect after login |
| `chatbot.js` | AI chatbot logic | Auto-loaded on all pages |
| `attendance.js` | Attendance system | Auto-loaded in dashboards |
| `messaging.js` | SMS/WhatsApp system | Auto-loaded in scheduling |

---

## 🎓 Learning Path (30 minutes)

1. **(5 min)** Read this file (you're doing it! ✅)
2. **(5 min)** Open `about.html`, explore UI, test chatbot
3. **(5 min)** Login as `teacher / password`, view scheduling page
4. **(5 min)** Mark attendance for a test class
5. **(5 min)** Send a demo SMS message
6. **(5 min)** Login as `student / password`, view your attendance

---

## 🚀 Production Deployment

### For SMS/WhatsApp Production Use:
1. Read `MESSAGING_SETUP.md` for Twilio setup
2. Get free Twilio account: https://twilio.com/console
3. Get your Twilio credentials
4. Create `.env` file with your keys
5. Run backend: `npm install && npm start`
6. Update `messaging.js` to use `http://localhost:3000` backend

### Deploy to Web:
- Use Netlify, Vercel, or GitHub Pages (static only)
- For messaging: Deploy backend to Heroku, Railway, or similar
- Update backend URL in `messaging.js`

---

## ❓ FAQ

**Q: Is this production-ready?**
A: The frontend is. SMS/messaging needs Twilio setup for production.

**Q: Can I customize the theme?**
A: Yes! Edit `styles.css`, `styles-about.css`, `styles-scheduling.css`

**Q: How do I add more students?**
A: Login as teacher → "Manage Students" → Add Student

**Q: Where is data stored?**
A: Browser's localStorage (disappears if you clear cache)

**Q: Can I export data?**
A: Open browser console and run:
```javascript
console.log(localStorage.getItem("attendanceRecords"))
console.log(localStorage.getItem("studentsRegistered"))
```

**Q: Is there a password requirement?**
A: No, password can be anything (demo purposes). Add validation in production.

---

## 🎯 Next Steps

1. ✅ **Test all features** using TESTING_GUIDE.md
2. ✅ **Customize colors** in CSS files
3. ✅ **Setup Twilio** for real SMS (optional)
4. ✅ **Deploy** to web server
5. ✅ **Share with students/teachers**

---

## 📞 Support

If you encounter issues:
1. Open **F12** (Developer Tools)
2. Go to **Console** tab
3. Look for red error messages
4. Share the error in your issue report

---

**Happy scheduling! 🎓**
