/* DATE */

function getDateKey(date) {
  return `planner-${date.toISOString().split("T")[0]}`;
}

function loadData() {
  return JSON.parse(localStorage.getItem(getDateKey(currentDate))) || {
    goal: "",
    tasks: Array(15).fill(""),
    timeline: Array(20).fill(null).map(() => Array(6).fill(null))
  };
}

function saveData(data) {
  localStorage.setItem(getDateKey(currentDate), JSON.stringify(data));
}

const goalInput = document.querySelector(".goal-input");

let currentDate = new Date();
const dateEl = document.getElementById("currentDate");

function renderDate() {
  dateEl.textContent = currentDate.toDateString();
}
renderDate();

function loadGoal() {
  const data = loadData();
  if (goalInput) goalInput.textContent = data.goal;
}

if (goalInput) {
  goalInput.addEventListener("input", () => {
    const data = loadData();
    data.goal = goalInput.textContent;
    saveData(data);
  });
}


document.getElementById("prevDay").onclick = () => {
  currentDate.setDate(currentDate.getDate() - 1);
  renderDate();
  loadGoal();
  renderTasks();
  renderTimeline();
};

document.getElementById("nextDay").onclick = () => {
  currentDate.setDate(currentDate.getDate() + 1);
  renderDate();
  loadGoal();
  renderTasks();
  renderTimeline();
};


/* COLORS */
const pastelColors = [
  "#fde2e4", "#e2ece9", "#e4eaf1", "#fff1c1", "#f0efeb",
  "#edf6f9", "#faedcd", "#f8edeb", "#eae4e9", "#e9f5db",
  "#fcefe3", "#e3f2fd", "#f6eac2", "#f1faee", "#e8e8e4"
];

/* TASKS */
const taskList = document.getElementById("taskList");
let activeColor = pastelColors[0];


/* TIMELINE */
const body = document.getElementById("timelineBody");
const hours = [
  "5 AM","6 AM","7 AM","8 AM","9 AM","10 AM",
  "11 AM","12 PM","1 PM","2 PM","3 PM","4 PM",
  "5 PM","6 PM","7 PM","8 PM","9 PM","10 PM","11 PM","12 AM"
];

function renderTimeline() {
  body.innerHTML = "";
  const data = loadData();

  hours.forEach((h, r) => {
    const row = document.createElement("div");
    row.className = "time-row";

    const label = document.createElement("div");
    label.className = "time-label";
    label.textContent = h;
    row.appendChild(label);

    for (let c = 0; c < 6; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";

      if (data.timeline[r][c]) {
        cell.style.background = data.timeline[r][c];
        cell.classList.add("active");
      }

      cell.onclick = () => {
        const updated = loadData();
        updated.timeline[r][c] = activeColor;
        saveData(updated);

        cell.style.background = activeColor;
        cell.classList.add("active");
      };

      row.appendChild(cell);
    }

    body.appendChild(row);
  });
}


/* TASKS */


function renderTasks() {
  taskList.innerHTML = "";
  const data = loadData();

  pastelColors.forEach((color, i) => {
    const row = document.createElement("div");
    row.className = "task";

    const name = document.createElement("div");
    name.className = "task-name";
    function isMobile() {
      return window.innerWidth <= 600;
    }

    name.textContent = isMobile() ? (i + 1) : `Task ${i + 1}`;

    name.style.background = color;
    name.onclick = () => {
    activeColor = color;

    // remove selection from all tasks
    document.querySelectorAll(".task-name").forEach(t =>
        t.classList.remove("selected")
    );

    // mark current as selected
    name.classList.add("selected");
    };


    const desc = document.createElement("div");
    desc.className = "task-desc";
    desc.contentEditable = true;
    desc.textContent = data.tasks[i] || "";

    desc.addEventListener("input", () => {
      const updated = loadData();
      updated.tasks[i] = desc.textContent;
      saveData(updated);
    });

    row.appendChild(name);
    row.appendChild(desc);
    taskList.appendChild(row);
  });
}

const firstTask = document.querySelector(".task-name");
if (firstTask) firstTask.classList.add("selected");

document.addEventListener("keydown", (e) => {
  if (e.target.classList.contains("task-desc") && e.key === "Enter") {
    e.preventDefault();
  }
});

loadGoal();
renderTasks();
renderTimeline();

