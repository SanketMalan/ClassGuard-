// browser-diagnostics.js
// Run this in browser console to diagnose issues
// Usage: Copy entire file to browser console and run, or include in HTML

const Diagnostics = {
  results: [],

  // ✅ Check if core files are loaded
  checkFilesLoaded() {
    console.log('\n📁 Checking if core files are loaded...');
    
    const checks = [
      { name: 'Attendance.js', check: () => typeof Attendance !== 'undefined' },
      { name: 'Messaging.js', check: () => typeof Messaging !== 'undefined' },
      { name: 'Chatbot.js', check: () => typeof Chatbot !== 'undefined' },
      { name: 'scheduling-script.js', check: () => typeof generateTimetable !== 'undefined' },
      { name: 'notifications.js', check: () => typeof addNotification !== 'undefined' },
    ];

    checks.forEach(({ name, check }) => {
      const loaded = check();
      const status = loaded ? '✅' : '❌';
      console.log(`${status} ${name} - ${loaded ? 'Loaded' : 'NOT LOADED'}`);
      this.results.push({ file: name, loaded });
    });
  },

  // ✅ Check localStorage data
  checkLocalStorage() {
    console.log('\n💾 Checking localStorage...');
    
    const keys = [
      'isLoggedIn',
      'role',
      'username',
      'studentsRegistered',
      'attendanceRecords',
      'messagingRecords',
      'generatedTimetable',
    ];

    keys.forEach((key) => {
      const value = localStorage.getItem(key);
      const hasData = value ? '✅' : '⚠️';
      const size = value ? `(${(value.length / 1024).toFixed(2)} KB)` : '(empty)';
      console.log(`${hasData} ${key}: ${size}`);
    });
  },

  // ✅ Check DOM elements
  checkDOMElements() {
    console.log('\n🎨 Checking DOM elements...');
    
    const elements = [
      { id: 'chatbot-container', name: 'Chatbot Widget' },
      { id: 'attendance-panel', name: 'Attendance Panel' },
      { id: 'students-panel', name: 'Student Management' },
      { id: 'messaging-panel', name: 'Messaging Panel' },
      { id: 'classes-list', name: 'Classes List' },
    ];

    elements.forEach(({ id, name }) => {
      const el = document.getElementById(id);
      const status = el ? '✅' : '⚠️';
      console.log(`${status} ${name} (#${id}) - ${el ? 'Found' : 'NOT FOUND'}`);
    });
  },

  // ✅ Check user session
  checkSession() {
    console.log('\n👤 Checking user session...');
    
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');

    console.log(`Logged in: ${isLoggedIn ? '✅ Yes' : '❌ No'}`);
    console.log(`Role: ${role || '(none)'}`);
    console.log(`Username: ${username || '(none)'}`);
  },

  // ✅ Check Attendance data structure
  checkAttendanceData() {
    console.log('\n📊 Checking attendance data...');
    
    try {
      const records = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
      console.log(`✅ Attendance records: ${records.length} records found`);
      
      if (records.length > 0) {
        console.log('Sample record:', records[0]);
      }
    } catch (e) {
      console.error('❌ Error parsing attendance data:', e.message);
    }
  },

  // ✅ Check Students data
  checkStudentsData() {
    console.log('\n👥 Checking students data...');
    
    try {
      const students = JSON.parse(localStorage.getItem('studentsRegistered') || '[]');
      console.log(`✅ Students registered: ${students.length}`);
      
      if (students.length > 0) {
        console.log('Students:');
        students.forEach((s, i) => {
          console.log(`  ${i + 1}. ${s.name} (@${s.username}) - Class: ${s.class}`);
        });
      }
    } catch (e) {
      console.error('❌ Error parsing students data:', e.message);
    }
  },

  // ✅ Test Attendance API
  testAttendanceAPI() {
    console.log('\n🧪 Testing Attendance API...');
    
    try {
      // Test getting all classes
      const classes = Attendance.getAllClasses();
      console.log(`✅ Attendance.getAllClasses(): ${classes.length} classes`);
      console.log(`   Classes: ${classes.slice(0, 3).join(', ')}${classes.length > 3 ? '...' : ''}`);

      // Test marking attendance
      const testResult = Attendance.markAttendance('test_user', '2024-01-01', 'present', 'Test Class', 'test_teacher');
      console.log(`✅ Attendance.markAttendance(): Success`);

      // Test getting stats
      const stats = Attendance.getStudentStats('test_user');
      console.log(`✅ Attendance.getStudentStats():`, stats);
    } catch (e) {
      console.error('❌ Attendance API error:', e.message);
    }
  },

  // ✅ Test Messaging API
  testMessagingAPI() {
    console.log('\n💬 Testing Messaging API...');
    
    try {
      // Test adding contact
      Messaging.addStudentContact('test_student', '+919876543210', '+919876543210');
      console.log(`✅ Messaging.addStudentContact(): Success`);

      // Test getting contacts
      const contacts = Messaging.getContacts();
      console.log(`✅ Messaging.getContacts(): ${Object.keys(contacts).length} contacts`);

      console.log(`✅ SMS Provider: ${Messaging.API_CONFIG.SMS_PROVIDER}`);
      console.log(`✅ WhatsApp Provider: ${Messaging.API_CONFIG.WHATSAPP_PROVIDER}`);
    } catch (e) {
      console.error('❌ Messaging API error:', e.message);
    }
  },

  // ✅ Test Chatbot
  testChatbot() {
    console.log('\n🤖 Testing Chatbot...');
    
    try {
      const response = Chatbot.computeReply('What is attendance?');
      console.log(`✅ Chatbot.computeReply(): "${response}"`);
    } catch (e) {
      console.error('❌ Chatbot error:', e.message);
    }
  },

  // ✅ Check CSS files
  checkCSSFiles() {
    console.log('\n🎨 Checking CSS files...');
    
    const stylesheets = Array.from(document.styleSheets).map((ss) => {
      try {
        return ss.href || ss.ownerNode.textContent.substring(0, 50);
      } catch {
        return '(inline or restricted)';
      }
    });

    console.log(`✅ Total stylesheets loaded: ${stylesheets.length}`);
    
    const requiredCSS = ['styles.css', 'attendance.css', 'messaging.css', 'chatbot.css'];
    requiredCSS.forEach((css) => {
      const found = stylesheets.some((ss) => ss.includes(css));
      const status = found ? '✅' : '⚠️';
      console.log(`${status} ${css}`);
    });
  },

  // ✅ Main diagnostic run
  runAll() {
    console.clear();
    console.log('═══════════════════════════════════════════');
    console.log('🔍 TIMETABLE MANAGEMENT - SYSTEM DIAGNOSTICS');
    console.log('═══════════════════════════════════════════');

    this.checkFilesLoaded();
    this.checkCSSFiles();
    this.checkLocalStorage();
    this.checkDOMElements();
    this.checkSession();
    this.checkStudentsData();
    this.checkAttendanceData();

    if (typeof Attendance !== 'undefined') {
      this.testAttendanceAPI();
    }
    
    if (typeof Messaging !== 'undefined') {
      this.testMessagingAPI();
    }
    
    if (typeof Chatbot !== 'undefined') {
      this.testChatbot();
    }

    console.log('\n═══════════════════════════════════════════');
    console.log('📋 SUMMARY:');
    console.log('═══════════════════════════════════════════');
    
    const filesLoaded = this.results.filter((r) => r.loaded).length;
    const totalFiles = this.results.length;
    console.log(`Files loaded: ${filesLoaded}/${totalFiles}`);
    
    if (filesLoaded === totalFiles) {
      console.log('✅ All systems operational!');
    } else {
      console.log('⚠️  Some files failed to load. Check network tab in DevTools.');
    }

    console.log('\n💡 TIP: Run commands like:');
    console.log('  - Diagnostics.checkSession() — Check login status');
    console.log('  - localStorage.clear() — Clear all data');
    console.log('  - localStorage.setItem("username", "teacher") — Set username');
    console.log('═══════════════════════════════════════════\n');
  },

  // ✅ Reset all data
  resetAllData() {
    if (confirm('⚠️  This will delete ALL app data. Are you sure?')) {
      localStorage.clear();
      console.log('✅ All data cleared!');
      location.reload();
    }
  },

  // ✅ Create demo data
  createDemoData() {
    console.log('Creating demo data...');

    // Create demo students
    const students = [
      { name: 'Alice Smith', username: 'alice_smith', password: 'password', class: 'BCA X1' },
      { name: 'Bob Johnson', username: 'bob_johnson', password: 'password', class: 'BCA X1' },
      { name: 'Charlie Brown', username: 'charlie_brown', password: 'password', class: 'BCA X2' },
    ];

    localStorage.setItem('studentsRegistered', JSON.stringify(students));

    // Create demo attendance
    const attendance = [
      {
        studentUsername: 'alice_smith',
        date: new Date().toISOString().split('T')[0],
        status: 'present',
        className: 'BCA X1',
        markedBy: 'teacher',
      },
      {
        studentUsername: 'bob_johnson',
        date: new Date().toISOString().split('T')[0],
        status: 'absent',
        className: 'BCA X1',
        markedBy: 'teacher',
      },
    ];

    localStorage.setItem('attendanceRecords', JSON.stringify(attendance));

    console.log('✅ Demo data created!');
    console.log('Students:', students.length);
    console.log('Attendance records:', attendance.length);
  },
};

// Auto-run on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('Run Diagnostics.runAll() to check system status');
  });
} else {
  console.log('Run Diagnostics.runAll() to check system status');
}
