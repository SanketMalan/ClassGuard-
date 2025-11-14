function validateForm() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username.trim() === "") {
    alert("Please enter a username");
    return false;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters long");
    return false;
  }

  // Here you would typically make an API call to your backend
  // For demonstration, we'll redirect to scheduling page
  localStorage.setItem("isLoggedIn", "true"); // Store login state
  localStorage.setItem("username", username); // Store username
  window.location.href = "scheduling.html";
  return false; // Prevent form submission
}
