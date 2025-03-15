let minutes = 25;
let seconds = 0; 
let timer;
let isRunning = false;
let completedPomodoros = 0;
let totalTimeWorked = 0;
let taskCounter = 1;

const minutesDisplay = document.getElementById("minutes");
const secondsDisplay = document.getElementById("seconds");
const startButton = document.getElementById("start");
const resetButton = document.getElementById("reset");
const completedDisplay = document.getElementById("completed");
const totalTimeDisplay = document.getElementById("totalTime");
const taskInput = document.getElementById("task");
const addTaskButton = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const addTimeButton = document.getElementById("addTime");
const subtractTimeButton = document.getElementById("subtractTime");

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalTimerDisplay = document.getElementById("modal-timer");

addTimeButton.addEventListener("click", () => {
  if (!isRunning) {
      minutes += 5;
      updateDisplay();
  }
});

subtractTimeButton.addEventListener("click", () => {
  if (!isRunning && minutes >= 5) {
      minutes -= 5;
      updateDisplay();
  }
});

function updateDisplay() {
  minutesDisplay.textContent = String(minutes).padStart(2, "0");
  secondsDisplay.textContent = String(seconds).padStart(2, "0");
}

function startTimer() {
  if (!isRunning) {
      addTask(); // Automatically add a task when the timer starts

      isRunning = true;
      startButton.textContent = "Pause";
      timer = setInterval(() => {
          if (seconds === 0) {
              if (minutes === 0) {
                  clearInterval(timer);
                  isRunning = false;
                  startButton.textContent = "Start";
                  completedPomodoros++;
                  totalTimeWorked += 25;
                  completedDisplay.textContent = completedPomodoros;
                  totalTimeDisplay.textContent = totalTimeWorked;
                  startBreakTimer();
                  return;
              } else {
                  minutes--;
                  seconds = 59;
              }
          } else {
              seconds--;
          }
          updateDisplay();
      }, 1000);
  } else {
      clearInterval(timer);
      isRunning = false;
      startButton.textContent = "Start";
  }
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  minutes = 25;
  seconds = 0;
  updateDisplay();
  startButton.textContent = "Start";
}

function addTask() {
  let taskText = taskInput.value.trim();
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  if (taskText === "") {
      taskText = `Task ${taskCounter}`;
  }

  const listItem = document.createElement("li");
  listItem.innerHTML = `${taskText} <span class="timestamp">${timeString}</span>`;
  taskList.appendChild(listItem);
  taskCounter++;
  taskInput.value = "";

  saveTasks(); // Save to local storage
  taskList.scrollTop = taskList.scrollHeight; // Auto-scroll to latest task
}


// Modal functions
function showModal(title, minutes, seconds) {
  modalTitle.textContent = title;
  modalTimerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  modal.style.display = "block";
}

function updateModalTimer(minutes, seconds) {
  modalTimerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function hideModal() {
  modal.style.display = "none";
}

function playBreakSound() {
    const audio = new Audio('audio/break_sound.wav'); // Ensure the file path is correct
    audio.volume = 0.5; // Adjust volume (0.0 - 1.0) for a soft sound
    audio.play();
  }
  
function startBreakTimer() {
    let breakMinutes = 5;
    let breakSeconds = 0;
    modal.style.display = "flex";

    playBreakSound();

    const breakInterval = setInterval(() => {
        if (breakSeconds === 0) {
            if (breakMinutes === 0) {
                clearInterval(breakInterval);

                // Play Break End Sound
                playBreakSound();

                // Hide Modal & Allow User to Interact Again
                modal.style.display = "none";

                resetTimer(); // Prepare for next Pomodoro
                return;
            } else {
                breakMinutes--;
                breakSeconds = 59;
            }
        } else {
            breakSeconds--;
        }
        updateModalTimer(breakMinutes, breakSeconds);
    }, 1000);
}

// Disable Interaction During Break
document.addEventListener("DOMContentLoaded", () => {
    modal.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent Closing Modal
    });
});

startButton.addEventListener("click", startTimer);
resetButton.addEventListener("click", resetTimer);
addTaskButton.addEventListener("click", addTask);

updateDisplay();

function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach((task) => {
      tasks.push(task.innerHTML); // Save task content
  });

  localStorage.setItem("taskHistory", JSON.stringify(tasks)); // Store in local storage
}

function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem("taskHistory")) || [];

  savedTasks.forEach((taskText) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = taskText;
      taskList.appendChild(listItem);
  });

  taskCounter = savedTasks.length + 1; // Ensure correct numbering
}

// Load tasks when the page loads
document.addEventListener("DOMContentLoaded", loadTasks);

function clearTaskHistory() {
  if (confirm("Are you sure you want to clear the task history?")) {
      document.getElementById("taskList").innerHTML = ""; // Clear UI
      localStorage.removeItem("taskHistory"); // Clear saved data
      taskCounter = 1; // Restart task numbering
  }
}

document.getElementById("clearHistoryIcon").addEventListener("click", clearTaskHistory);
