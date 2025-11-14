// Create a WebSocket connection for real-time updates (in a real application, replace with your WebSocket server URL)
let ws;
try {
  ws = new WebSocket("ws://localhost:8080");
} catch (e) {
  console.log("WebSocket connection not available, using simulation mode");
}

// Notifications System
const notifications = {
  items: [],
  unreadCount: 0,
};

// Initialize Notification System
function initializeNotifications() {
  // Load existing notifications from localStorage
  const savedNotifications = localStorage.getItem("notifications");
  if (savedNotifications) {
    const parsed = JSON.parse(savedNotifications);
    notifications.items = parsed.items;
    notifications.unreadCount = parsed.unreadCount;
    updateNotificationBadge();
    renderNotifications();
  }

  // For demo purposes, simulate incoming notifications
  setInterval(simulateNewNotification, 30000); // New notification every 30 seconds
}

// Toggle Notification Panel
function toggleNotifications() {
  const panel = document.getElementById("notification-panel");
  panel.classList.toggle("show");
}

// Add New Notification
function addNotification(title, message, type = "info") {
  const notification = {
    id: Date.now(),
    title,
    message,
    type,
    timestamp: new Date(),
    read: false,
  };

  notifications.items.unshift(notification);
  notifications.unreadCount++;

  // Save to localStorage
  saveNotifications();

  // Update UI
  updateNotificationBadge();
  renderNotifications();

  // Show toast notification
  showToast(title, message);
}

// Mark All Notifications as Read
function markAllRead() {
  notifications.items.forEach((item) => (item.read = true));
  notifications.unreadCount = 0;
  saveNotifications();
  updateNotificationBadge();
  renderNotifications();
}

// Mark Single Notification as Read
function markAsRead(id) {
  const notification = notifications.items.find((item) => item.id === id);
  if (notification && !notification.read) {
    notification.read = true;
    notifications.unreadCount--;
    saveNotifications();
    updateNotificationBadge();
    renderNotifications();
  }
}

// Update Notification Badge
function updateNotificationBadge() {
  const badge = document.getElementById("notification-count");
  badge.textContent = notifications.unreadCount;
  badge.style.display = notifications.unreadCount > 0 ? "block" : "none";
}

// Render Notifications in Panel
function renderNotifications() {
  const list = document.getElementById("notification-list");
  list.innerHTML =
    notifications.items.length > 0
      ? notifications.items
          .map(
            (notification) => `
            <div class="notification-item ${notification.read ? "" : "unread"}" 
                 onclick="markAsRead(${notification.id})">
                <div class="notification-title">${notification.title}</div>
                <div class="notification-message">${notification.message}</div>
                <div class="notification-time">${formatTime(
                  notification.timestamp
                )}</div>
            </div>
        `
          )
          .join("")
      : '<div class="notification-item">No notifications</div>';
}

// Save Notifications to localStorage
function saveNotifications() {
  localStorage.setItem(
    "notifications",
    JSON.stringify({
      items: notifications.items,
      unreadCount: notifications.unreadCount,
    })
  );
}

// Format Timestamp
function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;

  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
  return date.toLocaleDateString();
}

// Show Toast Notification
function showToast(title, message) {
  // Create toast element
  const toast = document.createElement("div");
  toast.className = "toast-notification";
  toast.innerHTML = `
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
    `;

  document.body.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add("show"), 100);

  // Remove after 5 seconds
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

// Simulate New Notifications (for demo purposes)
function simulateNewNotification() {
  const notifications = [
    {
      title: "Schedule Update",
      message: "Class 10A Mathematics class has been moved to Room 201",
    },
    {
      title: "Teacher Availability",
      message: "Mr. Johnson will be unavailable this Friday",
    },
    {
      title: "Room Change Alert",
      message: "Chemistry Lab is under maintenance, classes moved to Room 301",
    },
    {
      title: "New Schedule Generated",
      message: "New timetable has been generated for the upcoming week",
    },
  ];

  const randomNotification =
    notifications[Math.floor(Math.random() * notifications.length)];
  addNotification(randomNotification.title, randomNotification.message);
}

// Add Real-time Update Handlers
function handleScheduleChange(change) {
  addNotification(
    "Schedule Update",
    `${change.className}: ${change.subject} has been ${change.action}`
  );
}

// Event Listeners for Real-time Updates
if (ws) {
  ws.addEventListener("message", (event) => {
    const change = JSON.parse(event.data);
    handleScheduleChange(change);
  });
}

// Initialize notifications when page loads
document.addEventListener("DOMContentLoaded", initializeNotifications);

// Add notification triggers to existing functionality
const originalGenerateTimetable = window.generateTimetable;
window.generateTimetable = function () {
  originalGenerateTimetable();
  addNotification(
    "New Timetable Generated",
    "A new timetable has been generated successfully. Click to view the changes."
  );
};
