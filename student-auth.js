// student-auth.js
// Handles student registration and login (simple client-side storage for demo)

function getStoredStudents() {
  try {
    return JSON.parse(localStorage.getItem("studentsRegistered") || "[]");
  } catch (e) {
    console.error("Error parsing studentsRegistered:", e);
    return [];
  }
}

function saveStoredStudents(list) {
  try {
    localStorage.setItem("studentsRegistered", JSON.stringify(list));
  } catch (e) {
    console.error("Error saving students:", e);
    alert("Error saving data. Please check browser storage settings.");
  }
}

function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  window.location.href = "about.html";
}

// Registration
const studentRegisterForm = document.getElementById("student-register-form");
if (studentRegisterForm) {
  studentRegisterForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("s-name").value.trim();
    const username = document.getElementById("s-username").value.trim();
    const password = document.getElementById("s-password").value;
    const studentClass = document.getElementById("s-class").value.trim();

    if (!name || !username || !password || !studentClass) {
      alert("Please fill all required fields");
      return;
    }

    if (password.length < 3) {
      alert("Password must be at least 3 characters");
      return;
    }

    const list = getStoredStudents();
    if (list.find((s) => s.username === username)) {
      alert("Username already exists. Please choose a different username.");
      return;
    }

    list.push({ name, username, password, class: studentClass });
    saveStoredStudents(list);
    alert("Registration successful! You can now login.");
    window.location.href = "student-login.html";
  });
}

// Login
const studentLoginForm = document.getElementById("student-login-form");
if (studentLoginForm) {
  studentLoginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("s-username").value.trim();
    const password = document.getElementById("s-password").value;

    if (!username || !password) {
      alert("Please enter both username and password");
      return;
    }

    const list = getStoredStudents();
    const found = list.find(
      (s) => s.username === username && s.password === password
    );

    // demo fallback: allow demo student if none registered
    if (
      !found &&
      list.length === 0 &&
      username === "student" &&
      password === "password"
    ) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username);
      localStorage.setItem("role", "student");
      window.location.href = "student-dashboard.html";
      return;
    }

    if (found) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username);
      localStorage.setItem("role", "student");
      window.location.href = "student-dashboard.html";
    } else {
      alert("Invalid username or password. Please try again.");
    }
  });
}
