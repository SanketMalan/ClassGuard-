// attendance.js
// Manages attendance records in localStorage
// Format: { records: [ {studentUsername, date, status, classname, teacherUsername }, ... ] }

const Attendance = {
  // Pre-defined classes
  PREDEFINED_CLASSES: [
    "BCA X1",
    "BCA X2",
    "BCA Y1",
    "BCA Y2",
    "BCA Z1",
    "BCA Z2",
    "BBA X1",
    "BBA X2",
    "BBA Y1",
    "BBA Y2",
    "BBA Z1",
    "BBA Z2",
  ],

  getAttendanceDB() {
    try {
      return JSON.parse(localStorage.getItem("attendanceRecords") || '{"records":[]}');
    } catch (e) {
      return { records: [] };
    }
  },

  saveAttendanceDB(db) {
    localStorage.setItem("attendanceRecords", JSON.stringify(db));
  },

  // Mark attendance for a student on a date
  markAttendance(studentUsername, date, status, classname, teacherUsername) {
    const db = this.getAttendanceDB();
    // status = 'present' or 'absent'
    // check if already recorded for this date
    const existing = db.records.find(
      (r) => r.studentUsername === studentUsername && r.date === date && r.classname === classname
    );
    if (existing) {
      existing.status = status;
      existing.teacherUsername = teacherUsername;
    } else {
      db.records.push({
        studentUsername,
        date,
        status,
        classname,
        teacherUsername,
      });
    }
    this.saveAttendanceDB(db);
  },

  // Get all attendance for a student
  getStudentAttendance(studentUsername) {
    const db = this.getAttendanceDB();
    return db.records.filter((r) => r.studentUsername === studentUsername);
  },

  // Get attendance for a class on a specific date
  getClassAttendanceByDate(classname, date) {
    const db = this.getAttendanceDB();
    return db.records.filter((r) => r.classname === classname && r.date === date);
  },

  // Get all students in a class (from student records)
  getStudentsInClass(classname) {
    const students = JSON.parse(
      localStorage.getItem("studentsRegistered") || "[]"
    );
    return students.filter((s) => s.class === classname);
  },

  // Calculate attendance stats for a student
  getStudentStats(studentUsername) {
    const records = this.getStudentAttendance(studentUsername);
    const present = records.filter((r) => r.status === "present").length;
    const absent = records.filter((r) => r.status === "absent").length;
    const total = present + absent;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    return { total, present, absent, percentage };
  },

  // Get all classes from registered students + predefined classes
  getAllClasses() {
    const students = JSON.parse(
      localStorage.getItem("studentsRegistered") || "[]"
    );
    const studentClasses = new Set(students.map((s) => s.class).filter(Boolean));
    // Combine with predefined classes
    const allClasses = new Set([
      ...this.PREDEFINED_CLASSES,
      ...Array.from(studentClasses),
    ]);
    return Array.from(allClasses).sort();
  },
};
