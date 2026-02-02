"use strict";

/* ---------------------------
   Example 1: Tip Calculator
---------------------------- */
const calcTipBtn = document.getElementById("calcTipBtn");
const billAmountEl = document.getElementById("billAmount");
const tipPercentEl = document.getElementById("tipPercent");
const tipOutputEl = document.getElementById("tipOutput");
const totalOutputEl = document.getElementById("totalOutput");

function formatMoney(value) {
  return `$${value.toFixed(2)}`;
}

function calculateTip() {
  const bill = Number(billAmountEl.value);
  const tipPercent = Number(tipPercentEl.value);

  if (!Number.isFinite(bill) || bill < 0 || !Number.isFinite(tipPercent) || tipPercent < 0) {
    tipOutputEl.textContent = "$0.00";
    totalOutputEl.textContent = "$0.00";
    return;
  }

  const tip = bill * (tipPercent / 100);
  const total = bill + tip;

  tipOutputEl.textContent = formatMoney(tip);
  totalOutputEl.textContent = formatMoney(total);
}

if (calcTipBtn) {
  calcTipBtn.addEventListener("click", calculateTip);
}

/* ----------------------------------------
   Example 2: Mini Task List (localStorage)
----------------------------------------- */
const taskInputEl = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const clearTasksBtn = document.getElementById("clearTasksBtn");
const taskListEl = document.getElementById("taskList");

const STORAGE_KEY = "sscoville_tasks_v1";

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function renderTasks(tasks) {
  taskListEl.innerHTML = "";

  if (tasks.length === 0) {
    const li = document.createElement("li");
    li.className = "task-empty";
    li.textContent = "No tasks yet.";
    taskListEl.appendChild(li);
    return;
  }

  tasks.forEach((taskText, index) => {
    const li = document.createElement("li");
    li.className = "task-item";
    li.textContent = taskText;

    // Click to remove
    li.addEventListener("click", () => {
      const updated = loadTasks().filter((_, i) => i !== index);
      saveTasks(updated);
      renderTasks(updated);
    });

    taskListEl.appendChild(li);
  });
}

function addTask() {
  const text = (taskInputEl.value || "").trim();
  if (text.length === 0) return;

  const tasks = loadTasks();
  tasks.push(text);
  saveTasks(tasks);
  renderTasks(tasks);

  taskInputEl.value = "";
  taskInputEl.focus();
}

if (addTaskBtn) {
  addTaskBtn.addEventListener("click", addTask);
}

if (taskInputEl) {
  taskInputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTask();
  });
}

if (clearTasksBtn) {
  clearTasksBtn.addEventListener("click", () => {
    saveTasks([]);
    renderTasks([]);
  });
}

if (taskListEl) {
  renderTasks(loadTasks());
}

/* -----------------------------------------
   Example 3: Click-to-Move Heart (animation)
------------------------------------------ */
const playArea = document.getElementById("playArea");
const heart = document.getElementById("heart");

let timerId = null;

function startAnimation(targetX, targetY) {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }

  timerId = setInterval(() => moveHeart(targetX, targetY), 10);
}

function moveHeart(targetX, targetY) {
  const currentLeft = parseInt(heart.style.left || "20", 10);
  const currentTop = parseInt(heart.style.top || "20", 10);

  const dx = targetX - currentLeft;
  const dy = targetY - currentTop;

  // Stop when close enough
  if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) {
    heart.style.left = `${targetX}px`;
    heart.style.top = `${targetY}px`;
    clearInterval(timerId);
    timerId = null;
    return;
  }

  const stepX = dx === 0 ? 0 : dx / Math.abs(dx);
  const stepY = dy === 0 ? 0 : dy / Math.abs(dy);

  heart.style.left = `${currentLeft + stepX}px`;
  heart.style.top = `${currentTop + stepY}px`;
}

if (playArea && heart) {
  // Initial position
  heart.style.left = "20px";
  heart.style.top = "20px";

  playArea.addEventListener("click", (e) => {
    const rect = playArea.getBoundingClientRect();

    // Coordinates relative to play area
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    // Keep heart inside box (roughly)
    x = Math.max(0, Math.min(x, rect.width - 30));
    y = Math.max(0, Math.min(y, rect.height - 30));

    startAnimation(Math.round(x), Math.round(y));
  });
}
