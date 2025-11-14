// teacher-auth.js
// Handles teacher registration and login (simple client-side storage for demo)

function getStoredTeachers() {
  try {
    return JSON.parse(localStorage.getItem("teachersRegistered") || "[]");
  } catch (e) {
    console.error("Error parsing teachersRegistered:", e);
    return [];
  }
}

function saveStoredTeachers(list) {
  try {
    localStorage.setItem("teachersRegistered", JSON.stringify(list));
  } catch (e) {
    console.error("Error saving teachers:", e);
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
const teacherRegisterForm = document.getElementById("teacher-register-form");
if (teacherRegisterForm) {
  teacherRegisterForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("t-name").value.trim();
    const username = document.getElementById("t-username").value.trim();
    const password = document.getElementById("t-password").value;
    const subject = document.getElementById("t-subject").value.trim();

    if (!name || !username || !password || !subject) {
      alert("Please fill all required fields");
      return;
    }

    if (password.length < 3) {
      alert("Password must be at least 3 characters");
      return;
    }

    const list = getStoredTeachers();
    if (list.find((t) => t.username === username)) {
      alert("Username already exists. Please choose a different username.");
      return;
    }

    list.push({ name, username, password, subject });
    saveStoredTeachers(list);
    alert("Registration successful! You can now login.");
    window.location.href = "teacher-login.html";
  });
}

// Login
const teacherLoginForm = document.getElementById("teacher-login-form");
if (teacherLoginForm) {
  teacherLoginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("t-username").value.trim();
    const password = document.getElementById("t-password").value;

    if (!username || !password) {
      alert("Please enter both username and password");
      return;
    }

    const list = getStoredTeachers();
    const found = list.find(
      (t) => t.username === username && t.password === password
    );

    // demo fallback: allow demo teacher if none registered
    if (
      !found &&
      list.length === 0 &&
      username === "teacher" &&
      password === "password"
    ) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username);
      localStorage.setItem("role", "teacher");
      window.location.href = "scheduling.html";
      return;
    }

    if (found) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username);
      localStorage.setItem("role", "teacher");
      window.location.href = "scheduling.html";
    } else {
      alert("Invalid username or password. Please try again.");
    }
  });
}
