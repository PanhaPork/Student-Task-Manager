"use strict";

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const taskCountLabel = document.getElementById("taskCountLabel");
const emptyState = document.getElementById("emptyState");
const formMessage = document.getElementById("formMessage");
const progressText = document.getElementById("progressText");

/** Each task has an id, text, and completion state. */
let tasks = [];
let nextTaskId = 1;

function showMessage(message, type = "error") {
  formMessage.textContent = message;
  formMessage.classList.toggle("success", type === "success");
}

function updateSummary() {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;

  taskCount.textContent = String(total);
  taskCountLabel.textContent = total === 1 ? "task" : "tasks";
  emptyState.hidden = total > 0;

  if (total === 0) {
    progressText.textContent = "Ready when you are.";
  } else if (completed === total) {
    progressText.textContent = `All done! You completed all ${total} ${total === 1 ? "task" : "tasks"}.`;
  } else {
    progressText.textContent = `${completed} of ${total} ${total === 1 ? "task" : "tasks"} completed.`;
  }
}

function renderTasks() {
  taskList.replaceChildren();

  for (const task of tasks) {
    const item = document.createElement("li");
    item.className = `task-item${task.completed ? " completed" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.className = "task-checkbox";
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.id = `task-${task.id}`;
    checkbox.setAttribute("aria-label", `Mark ${task.text} as ${task.completed ? "not completed" : "completed"}`);
    checkbox.addEventListener("change", () => {
      toggleTask(task.id);
    });

    const textWrap = document.createElement("label");
    textWrap.className = "task-text";
    textWrap.htmlFor = checkbox.id;
    textWrap.append(document.createTextNode(task.text));

    if (task.completed) {
      const status = document.createElement("span");
      status.className = "task-status";
      status.textContent = "Completed";
      textWrap.append(status);
    }

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete task: ${task.text}`);
    deleteButton.addEventListener("click", () => {
      deleteTask(task.id);
    });

    item.append(checkbox, textWrap, deleteButton);
    taskList.append(item);
  }

  updateSummary();
}

function addTask(text) {
  tasks.push({ id: nextTaskId++, text, completed: false });
  renderTasks();
}

function toggleTask(taskId) {
  tasks = tasks.map((task) =>
    task.id === taskId ? { ...task, completed: !task.completed } : task
  );
  renderTasks();
}

function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  renderTasks();
  showMessage("Task deleted.", "success");
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = taskInput.value.trim();

  if (!text) {
    showMessage("Please enter a task before adding it.");
    taskInput.focus();
    return;
  }

  addTask(text);
  taskInput.value = "";
  showMessage("Task added successfully.", "success");
  taskInput.focus();
});

taskInput.addEventListener("input", () => {
  if (formMessage.textContent) {
    formMessage.textContent = "";
    formMessage.classList.remove("success");
  }
});

renderTasks();
