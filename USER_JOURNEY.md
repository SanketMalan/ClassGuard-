# 🗺️ ClassGraud User Journey Map

## 🎯 Entry Points

```
┌─────────────────────────────────────────────────────────┐
│                   ENTRY POINTS                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🏠 Landing Page ──────────→ register-landing.html      │
│                                                         │
│  📖 About Page ────────────→ about.html                 │
│                                                         │
│  🔐 Choose Login ──────────→ choose-login.html          │
│                                                         │
│  🚀 Quick Register ────────→ quick-register.html        │
│                                                         │
│  📝 Main Auth ─────────────→ index.html                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 👨‍🎓 STUDENT JOURNEY

### Option 1: Quick Register (FASTEST ⚡)

```
START
  ↓
quick-register.html
  ├─ Fill Name, Username, Password, Class
  │
  ↓
[Register Button Click]
  │
  ↓
Validation Check
  ├─ Valid? → Continue
  ├─ Invalid? → Show Error
  │
  ↓
Success Message
  │ "✅ Registration successful! Redirecting..."
  │
  ↓
AUTO REDIRECT to student-login.html (1.5 sec)
  │
  ↓
Login Page
  ├─ Enter: Username & Password
  │
  ↓
[Login Button Click]
  │
  ↓
✅ SUCCESS
  │
  ↓
student-dashboard.html
  └─ View Timetable, Attendance, Chat
```

### Option 2: Unified Auth

```
START
  ↓
index.html
  ├─ Click "Register" tab
  │
  ↓
Select "Student" from dropdown
  │
  ↓
Fill Form
  ├─ Full Name
  ├─ Username
  ├─ Password
  ├─ Class / Roll
  │
  ↓
[Register Student Button]
  │
  ↓
Validation & Storage
  │
  ↓
Success Message
  │
  ↓
AUTO REDIRECT to student-login.html (1.5 sec)
  │
  ↓
Enter Credentials & Login
  │
  ↓
✅ student-dashboard.html
```

### Option 3: Traditional

```
START
  ↓
student-register.html
  │
  ↓
Fill & Register
  │
  ↓
Redirect to student-login.html
  │
  ↓
Login
  │
  ↓
✅ student-dashboard.html
```

---

## 👨‍🏫 TEACHER JOURNEY

### Option 1: Quick Register (FASTEST ⚡)

```
START
  ↓
quick-register.html
  ├─ Fill Name, Username, Password, Subject
  │
  ↓
[Register Button Click]
  │
  ↓
Validation Check
  │
  ↓
Success Message
  │ "✅ Registration successful! Redirecting..."
  │
  ↓
AUTO REDIRECT to teacher-login.html (1.5 sec)
  │
  ↓
Login Page
  ├─ Enter: Username & Password
  │
  ↓
[Login Button Click]
  │
  ↓
✅ SUCCESS
  │
  ↓
scheduling.html
  └─ Create Schedules, Mark Attendance
```

### Option 2: Unified Auth

```
START
  ↓
index.html
  ├─ Click "Register" tab
  │
  ↓
Select "Teacher" from dropdown
  │
  ↓
Fill Form
  ├─ Full Name
  ├─ Username
  ├─ Password
  ├─ Subject Specialization
  │
  ↓
[Register Teacher Button]
  │
  ↓
Validation & Storage
  │
  ↓
Success Message
  │
  ↓
AUTO REDIRECT to teacher-login.html (1.5 sec)
  │
  ↓
Enter Credentials & Login
  │
  ↓
✅ scheduling.html
```

### Option 3: Traditional

```
START
  ↓
teacher-register.html
  │
  ↓
Fill & Register
  │
  ↓
Redirect to teacher-login.html
  │
  ↓
Login
  │
  ↓
✅ scheduling.html
```

---

## 🔐 LOGIN JOURNEY (Existing Users)

```
START
  ↓
Login Entry Point
  ├─ Option A: choose-login.html
  ├─ Option B: index.html#login-student
  ├─ Option C: index.html#login-teacher
  ├─ Option D: student-login.html
  └─ Option E: teacher-login.html
  │
  ↓
Select Role (if not already selected)
  │
  ├─ Student → student-login.html
  └─ Teacher → teacher-login.html
  │
  ↓
Enter Credentials
  ├─ Username
  └─ Password
  │
  ↓
[Login Button Click]
  │
  ↓
Validation Against localStorage
  │
  ├─ Valid? → Continue
  ├─ Invalid? → Show Error
  └─ Demo user? → Allow access
  │
  ↓
Set Session
  ├─ isLoggedIn = true
  ├─ username = [entered username]
  └─ role = [student/teacher]
  │
  ↓
Dashboard Redirect
  │
  ├─ Student → student-dashboard.html
  └─ Teacher → scheduling.html
  │
  ↓
✅ LOGGED IN
```

---

## 📊 REGISTRATION FLOW DETAILS

### Student Registration

```
quick-register.html (Or alternative)
  ↓
Input Validation
  ├─ Name: Required
  ├─ Username: Required, 3+ chars, unique
  ├─ Password: Required, 3+ chars
  └─ Class: Required
  ↓
Error Handling
  ├─ Missing fields → "Please fill all fields"
  ├─ Username exists → "Username already taken"
  ├─ Password too short → "Password must be 3+ chars"
  └─ Other error → Show specific message
  ↓
Success
  ├─ Store in localStorage under "studentsRegistered"
  ├─ Show "✅ Registration successful!"
  ├─ Wait 1.5 seconds
  └─ Auto-redirect to login
```

### Teacher Registration

```
quick-register.html (Or alternative)
  ↓
Input Validation
  ├─ Name: Required
  ├─ Username: Required, 3+ chars, unique
  ├─ Password: Required, 3+ chars
  └─ Subject: Required
  ↓
Error Handling
  ├─ Missing fields → "Please fill all fields"
  ├─ Username exists → "Username already taken"
  ├─ Password too short → "Password must be 3+ chars"
  └─ Other error → Show specific message
  ↓
Success
  ├─ Store in localStorage under "teachersRegistered"
  ├─ Show "✅ Registration successful!"
  ├─ Wait 1.5 seconds
  └─ Auto-redirect to login
```

---

## 🔄 LOGOUT JOURNEY

```
Dashboard Page (Student or Teacher)
  │
  ├─ student-dashboard.html → Click "Logout"
  └─ scheduling.html → Click "Logout"
  │
  ↓
logout() Function Called
  │
  ↓
Clear Session Data
  ├─ Remove "isLoggedIn"
  ├─ Remove "username"
  └─ Remove "role"
  │
  ↓
Redirect to choose-login.html
  │
  ↓
✅ Ready for Next Login
```

---

## 📱 PAGES STRUCTURE

```
ClassGraud
├── Entry Points
│   ├── register-landing.html (Beautiful landing with 3 options)
│   ├── about.html (Features + registration links)
│   ├── choose-login.html (Role selector)
│   └── index.html (Unified auth)
│
├── Student Registration
│   ├── quick-register.html (RECOMMENDED)
│   └── student-register.html (Traditional)
│
├── Teacher Registration
│   ├── quick-register.html (RECOMMENDED)
│   └── teacher-register.html (Traditional)
│
├── Student Login
│   ├── index.html#login-student
│   └── student-login.html (Traditional)
│
├── Teacher Login
│   ├── index.html#login-teacher
│   └── teacher-login.html (Traditional)
│
├── Dashboards
│   ├── student-dashboard.html (After student login)
│   ├── scheduling.html (After teacher login)
│   └── student-login.html (Used for auth)
│
├── Support
│   ├── EASY_REGISTRATION.md (Guide)
│   ├── QUICK_REFERENCE.md (Reference card)
│   ├── REGISTRATION_IMPROVEMENTS.md (Details)
│   └── USER_JOURNEY.md (This file)
│
└── Styling
    └── Various CSS files
```

---

## 🎯 RECOMMENDED PATHS

### For New Students

```
register-landing.html
  → (See "Quick Start" button)
  → quick-register.html
  → Register in <1 min
  → Login
  → student-dashboard.html
```

### For New Teachers

```
register-landing.html
  → (See "Quick Start" button)
  → quick-register.html
  → Register in <1 min
  → Login
  → scheduling.html
```

### For Existing Students

```
choose-login.html
  → Select "Student"
  → Login
  → student-dashboard.html
```

### For Existing Teachers

```
choose-login.html
  → Select "Teacher"
  → Login
  → scheduling.html
```

### For Testing/Demo

```
index.html
  → Don't register
  → Use demo credentials:
     • Student: student / password
     • Teacher: teacher / password
  → View dashboards
```

---

## ⏱️ TIME ESTIMATES

| Journey          | Method      | Time    | Effort    |
| ---------------- | ----------- | ------- | --------- |
| Student Register | Quick       | <1 min  | Very Easy |
| Teacher Register | Quick       | <1 min  | Very Easy |
| Student Register | Unified     | 1-2 min | Easy      |
| Teacher Register | Unified     | 1-2 min | Easy      |
| Student Register | Traditional | 1-2 min | Easy      |
| Teacher Register | Traditional | 1-2 min | Easy      |
| Student Login    | Any         | <30 sec | Very Easy |
| Teacher Login    | Any         | <30 sec | Very Easy |
| Demo Access      | -           | Instant | One Click |

---

## 💾 DATA FLOW

```
User Registration
  ↓
Form Submission
  ↓
Validation
  ↓
localStorage Storage
  ├─ studentsRegistered (array)
  └─ teachersRegistered (array)
  │
  ↓
Session Creation (on login)
  ├─ isLoggedIn = "true"
  ├─ username = [username]
  └─ role = [student/teacher]
  │
  ↓
Dashboard Access
  ├─ Check session variables
  ├─ Load user data
  └─ Render dashboard
  │
  ↓
Logout
  └─ Clear session variables
```

---

## 🎓 SUMMARY

**ClassGraud provides multiple easy paths for users to:**

1. ✅ Discover the system
2. ✅ Register quickly (in any role)
3. ✅ Login securely
4. ✅ Access their dashboards
5. ✅ Logout and return anytime

**Best path for first-time users:** `register-landing.html` → `quick-register.html` → Login → Dashboard

---

Created: 2025-11-14
Last Updated: 2025-11-14
