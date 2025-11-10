const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filters = document.querySelectorAll(".filter");
const clearCompletedBtn = document.getElementById("clearCompleted");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");
const prioritySelect = document.getElementById("priority");
const dueDateInput = document.getElementById("dueDate");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filterType = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter((t) => {
    if (filterType === "all") return true;
    if (filterType === "pending") return !t.completed;
    if (filterType === "completed") return t.completed;
  });

  if (filteredTasks.length === 0) {
    taskList.innerHTML = `<p style="text-align:center;color:gray;">No tasks here</p>`;
    updateCounts();
    return;
  }

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    const taskInfo = document.createElement("div");
    taskInfo.className = "task-info";
    taskInfo.innerHTML = `
      <strong>${task.text}</strong>
      <div class="task-details">
        Priority: ${task.priority.toUpperCase()} | Due: ${task.dueDate || "—"}
      </div>
    `;

    const actions = document.createElement("div");
    actions.className = "actions";
    actions.innerHTML = `
      <span class="edit">✏️</span>
      <span class="delete">🗑️</span>
    `;

    taskInfo.addEventListener("click", (e) => {
      if (e.target.classList.contains("edit") || e.target.classList.contains("delete")) return;
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    actions.querySelector(".edit").addEventListener("click", () => editTask(task.id));
    actions.querySelector(".delete").addEventListener("click", () => deleteTask(task.id));

    li.appendChild(taskInfo);
    li.appendChild(actions);
    taskList.appendChild(li);
  });

  updateCounts();
}

function updateCounts() {
  const pending = tasks.filter(t => !t.completed).length;
  const completed = tasks.filter(t => t.completed).length;
  pendingCount.textContent = `Pending: ${pending}`;
  completedCount.textContent = `Completed: ${completed}`;
}

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

function addTask() {
  const text = taskInput.value.trim();
  const priority = prioritySelect.value;
  const dueDate = dueDateInput.value;

  if (!text) return alert("Enter a task first!");

  const newTask = {
    id: Date.now(),
    text,
    priority,
    dueDate,
    completed: false,
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  taskInput.value = "";
  dueDateInput.value = "";
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  const newText = prompt("Edit your task:", task.text);
  if (!newText || newText.trim() === "") return;
  task.text = newText.trim();
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    filters.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    filterType = btn.dataset.filter;
    renderTasks();
  });
});

clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  renderTasks();
});

renderTasks();
