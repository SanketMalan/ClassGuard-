// Check authentication (teacher-only access to scheduling)
function checkAuth() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const role = localStorage.getItem("role");
  // require logged in and teacher role
  if (!isLoggedIn || role !== "teacher") {
    // redirect to choose login so users can pick correct login
    window.location.href = "choose-login.html";
  }
}

// Run auth check when page loads
checkAuth();

// Logout function (clear role and go to chooser)
function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  window.location.href = "choose-login.html";
}

// Initialize data storage
const data = {
  classes: [],
  teachers: [],
  subjects: [],
  rooms: [],
  timetable: null,
};

// Panel management
function showPanel(panelName) {
  // Hide all panels
  document.querySelectorAll(".panel").forEach((panel) => {
    panel.classList.add("hidden");
  });

  // Show selected panel
  document.getElementById(`${panelName}-panel`).classList.remove("hidden");
}

// Form submission handlers
document.getElementById("class-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const className = document.getElementById("class-name").value;
  const capacity = document.getElementById("class-capacity").value;
  const periodsPerDayInput = document.getElementById("periods-per-day").value;
  const preferredSlotsInput = document.getElementById(
    "preferred-time-slots"
  ).value;

  // parse periods and time slots
  const periodsPerDay = periodsPerDayInput
    ? parseInt(periodsPerDayInput)
    : null;
  let timeSlots = [];
  if (preferredSlotsInput && preferredSlotsInput.trim() !== "") {
    // split by comma and trim
    timeSlots = preferredSlotsInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  if (className && capacity) {
    data.classes.push({
      name: className,
      capacity: parseInt(capacity),
      periodsPerDay: periodsPerDay,
      timeSlots: timeSlots,
    });
    updateClassesList();
    this.reset();
  }
});

document
  .getElementById("teacher-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const teacherName = document.getElementById("teacher-name").value;
    const subject = document.getElementById("teacher-subject").value;

    if (teacherName && subject) {
      data.teachers.push({ name: teacherName, subject: subject });
      updateTeachersList();
      this.reset();
    }
  });

document
  .getElementById("subject-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const subjectName = document.getElementById("subject-name").value;
    const weeklyHours = document.getElementById("weekly-hours").value;

    if (subjectName && weeklyHours) {
      data.subjects.push({ name: subjectName, hours: parseInt(weeklyHours) });
      updateSubjectsList();
      this.reset();
    }
  });

document.getElementById("room-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const roomNumber = document.getElementById("room-number").value;
  const capacity = document.getElementById("room-capacity").value;
  const type = document.getElementById("room-type").value;

  if (roomNumber && capacity && type) {
    data.rooms.push({
      number: roomNumber,
      capacity: parseInt(capacity),
      type: type,
    });
    updateRoomsList();
    this.reset();
  }
});

// Update list views
function updateClassesList() {
  const list = document.getElementById("classes-list");
  list.innerHTML = data.classes
    .map(
      (cls, index) => `
    <div class="data-item">
      <div>
        <strong>${cls.name}</strong> <span style="color:#666">(Capacity: ${
        cls.capacity
      })</span>
        <div style="font-size:0.9rem;color:#666;margin-top:6px;">${
          cls.periodsPerDay ? cls.periodsPerDay + " periods/day" : ""
        }${
        cls.timeSlots && cls.timeSlots.length > 0
          ? " | Times: " + cls.timeSlots.join(", ")
          : ""
      }</div>
      </div>
      <button onclick="removeClass(${index})">Remove</button>
    </div>
  `
    )
    .join("");
}

function updateTeachersList() {
  const list = document.getElementById("teachers-list");
  list.innerHTML = data.teachers
    .map(
      (teacher, index) => `
        <div class="data-item">
            <span>${teacher.name} (${teacher.subject})</span>
            <button onclick="removeTeacher(${index})">Remove</button>
        </div>
    `
    )
    .join("");
}

function updateSubjectsList() {
  const list = document.getElementById("subjects-list");
  list.innerHTML = data.subjects
    .map(
      (subject, index) => `
        <div class="data-item">
            <span>${subject.name} (${subject.hours} hrs/week)</span>
            <button onclick="removeSubject(${index})">Remove</button>
        </div>
    `
    )
    .join("");
}

function updateRoomsList() {
  const list = document.getElementById("rooms-list");
  list.innerHTML = data.rooms
    .map(
      (room, index) => `
        <div class="data-item">
            <span>${room.number} (${room.type}, Capacity: ${room.capacity})</span>
            <button onclick="removeRoom(${index})">Remove</button>
        </div>
    `
    )
    .join("");
}

// Remove item functions
function removeClass(index) {
  data.classes.splice(index, 1);
  updateClassesList();
}

function removeTeacher(index) {
  data.teachers.splice(index, 1);
  updateTeachersList();
}

function removeSubject(index) {
  data.subjects.splice(index, 1);
  updateSubjectsList();
}

function removeRoom(index) {
  data.rooms.splice(index, 1);
  updateRoomsList();
}

// Timetable generation
function generateTimetable() {
  if (validateData()) {
    // Show timetable panel
    showPanel("timetable");

    // Generate timetable logic
    data.timetable = generateSchedule();

    // Persist generated timetable so students can view it
    try {
      const author = localStorage.getItem("username") || "unknown";
      const meta = {
        generatedBy: author,
        generatedAt: new Date().toISOString(),
        globalPeriods: data.globalPeriods || [],
      };
      localStorage.setItem(
        "generatedTimetable",
        JSON.stringify({ timetable: data.timetable, meta })
      );
    } catch (e) {
      console.warn("Could not save generated timetable to localStorage", e);
    }

    // Update view selector options
    updateViewSelector();

    // Display initial timetable view
    displayTimetable("class", data.classes[0]?.name);
  } else {
    alert(
      "Please ensure you have added at least one of each: class, teacher, subject, and room"
    );
  }
}

function validateData() {
  return (
    data.classes.length > 0 &&
    data.teachers.length > 0 &&
    data.subjects.length > 0 &&
    data.rooms.length > 0
  );
}

function generateSchedule() {
  // This is a simplified timetable generation that respects class time slots
  const schedule = {};
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Build a global list of periods encountered (preserve insertion order)
  const globalPeriods = [];
  function addGlobalPeriod(p) {
    if (!globalPeriods.includes(p)) globalPeriods.push(p);
  }

  data.classes.forEach((cls) => {
    schedule[cls.name] = {};

    // decide periods for this class: prefer explicit timeSlots, else use periodsPerDay, else default 8
    let periodsForClass = [];
    if (cls.timeSlots && cls.timeSlots.length > 0) {
      periodsForClass = cls.timeSlots.slice();
    } else if (
      cls.periodsPerDay &&
      Number.isInteger(cls.periodsPerDay) &&
      cls.periodsPerDay > 0
    ) {
      for (let i = 1; i <= cls.periodsPerDay; i++) {
        periodsForClass.push(ordinal(i));
      }
    } else {
      for (let i = 1; i <= 8; i++) periodsForClass.push(ordinal(i));
    }

    periodsForClass.forEach((p) => addGlobalPeriod(p));

    days.forEach((day) => {
      schedule[cls.name][day] = {};
      periodsForClass.forEach((period) => {
        // Randomly assign subjects and teachers
        const randomSubject =
          data.subjects[Math.floor(Math.random() * data.subjects.length)];
        const availableTeachers = data.teachers.filter(
          (t) => t.subject === randomSubject.name
        );
        const randomTeacher =
          availableTeachers[
            Math.floor(Math.random() * availableTeachers.length)
          ];
        const randomRoom =
          data.rooms[Math.floor(Math.random() * data.rooms.length)];

        schedule[cls.name][day][period] = {
          subject: randomSubject?.name || "Free",
          teacher: randomTeacher?.name || "N/A",
          room: randomRoom?.number || "N/A",
        };
      });
    });
  });

  // save computed global periods for teacher/room views
  data.globalPeriods =
    globalPeriods.length > 0
      ? globalPeriods
      : ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
  return schedule;
}

// ordinal helper (1st, 2nd, 3rd, 4th...)
function ordinal(n) {
  const s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function updateViewSelector() {
  const viewSelector = document.getElementById("view-selector");
  const itemSelector = document.getElementById("item-selector");

  viewSelector.addEventListener("change", () => {
    const view = viewSelector.value;
    updateItemSelector(view);
  });

  // Initial update
  updateItemSelector(viewSelector.value);
}

function updateItemSelector(view) {
  const itemSelector = document.getElementById("item-selector");
  itemSelector.innerHTML = "";

  let items;
  switch (view) {
    case "class":
      items = data.classes.map((c) => c.name);
      break;
    case "teacher":
      items = data.teachers.map((t) => t.name);
      break;
    case "room":
      items = data.rooms.map((r) => r.number);
      break;
  }

  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    itemSelector.appendChild(option);
  });

  itemSelector.addEventListener("change", () => {
    displayTimetable(view, itemSelector.value);
  });

  // Display initial timetable
  if (items.length > 0) {
    displayTimetable(view, items[0]);
  }
}

function displayTimetable(view, item) {
  const timetableElement = document.getElementById("timetable");
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Determine periods for the view
  let periods = [];
  if (view === "class") {
    const classSchedule = data.timetable[item];
    if (classSchedule) {
      // pick the first day's keys as the period order
      const firstDay =
        days.find((d) => Object.keys(classSchedule[d] || {}).length > 0) ||
        days[0];
      periods = Object.keys(classSchedule[firstDay] || {});
    }
  }

  // fallback to global periods if not found
  if (!periods || periods.length === 0) {
    periods =
      data.globalPeriods && data.globalPeriods.length > 0
        ? data.globalPeriods
        : ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
  }

  let html = `
        <tr>
            <th>Time/Day</th>
            ${days.map((day) => `<th>${day}</th>`).join("")}
        </tr>
    `;

  periods.forEach((period) => {
    html += `
            <tr>
                <th>${period}</th>
                ${days
                  .map((day) => {
                    const cell = data.timetable[item]?.[day]?.[period] || {
                      subject: "Free",
                      teacher: "N/A",
                      room: "N/A",
                    };
                    return `
                        <td>
                            <div>${cell.subject}</div>
                            <div class="text-sm">${cell.teacher}</div>
                            <div class="text-sm">Room ${cell.room}</div>
                        </td>
                    `;
                  })
                  .join("")}
            </tr>
        `;
  });

  timetableElement.innerHTML = html;
}

function exportTimetable() {
  const view = document.getElementById("view-selector").value;
  const item = document.getElementById("item-selector").value;

  // Create CSV content
  let csv = "Time/Day,Monday,Tuesday,Wednesday,Thursday,Friday\n";
  const periods =
    data.globalPeriods && data.globalPeriods.length > 0
      ? data.globalPeriods
      : ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  periods.forEach((period) => {
    csv += `${period},`;
    days.forEach((day) => {
      const cell = data.timetable[item]?.[day]?.[period] || {
        subject: "Free",
        teacher: "N/A",
        room: "N/A",
      };
      csv += `${cell.subject} (${cell.teacher}, Room ${cell.room}),`;
    });
    csv += "\n";
  });

  // Create and download file
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `timetable_${view}_${item}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

// Show classes panel by default
showPanel("classes");
