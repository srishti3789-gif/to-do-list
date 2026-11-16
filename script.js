
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

// Format date and time
function formatDateTime(date) {
    return new Date(date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });
}

// Save tasks
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update dashboard
function updateDashboard() {

    const total = tasks.length;

    const completed = tasks.filter(function(task) {
        return task.completed;
    }).length;

    const pending = total - completed;

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("pendingTasks").textContent = pending;
}

// Display tasks
function displayTasks() {

    taskList.innerHTML = "";

    updateDashboard();

    // Filter tasks
    let filteredTasks = tasks.filter(function(task) {

        if (currentFilter === "completed") {
            return task.completed;
        }

        if (currentFilter === "pending") {
            return !task.completed;
        }

        return true;
    });

    filteredTasks.forEach(function(task) {

        const li = document.createElement("li");

        li.className = task.completed ? "completed" : "";

        // Checkbox
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", function() {

            task.completed = checkbox.checked;

            task.completedAt = task.completed
                ? new Date().toISOString()
                : null;

            saveTasks();
            displayTasks();
        });

        // Task details
        const details = document.createElement("div");

        details.className = "task-details";

        const taskName = document.createElement("span");

        taskName.textContent = task.text;
        taskName.className = "task-name";

        const status = document.createElement("span");

        status.className = "status";

        status.textContent = task.completed
            ? "Completed"
            : "Pending";

        const addedTime = document.createElement("small");

        addedTime.textContent =
            "Added: " + formatDateTime(task.createdAt);

        details.appendChild(taskName);
        details.appendChild(status);
        details.appendChild(addedTime);

        // Completion time
        if (task.completed && task.completedAt) {

            const completedTime = document.createElement("small");

            completedTime.textContent =
                "Completed: " + formatDateTime(task.completedAt);

            details.appendChild(completedTime);
        }

        // Edit button
        const editBtn = document.createElement("button");

        editBtn.textContent = "Edit";

        editBtn.addEventListener("click", function() {

            const updatedText = prompt(
                "Edit your task:",
                task.text
            );

            if (updatedText !== null && updatedText.trim() !== "") {

                task.text = updatedText.trim();

                saveTasks();
                displayTasks();
            }
        });

        // Delete button
        const deleteBtn = document.createElement("button");

        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", function() {

            tasks = tasks.filter(function(t) {
                return t.id !== task.id;
            });

            saveTasks();
            displayTasks();
        });

        // Action buttons
        const actions = document.createElement("div");

        actions.className = "task-actions";

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        // Add everything to list item
        li.appendChild(checkbox);
        li.appendChild(details);
        li.appendChild(actions);

        taskList.appendChild(li);
    });
}

// Add a new task
function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    const newTask = {

        id: Date.now() + Math.random(),

        text: text,

        completed: false,

        createdAt: new Date().toISOString(),

        completedAt: null
    };

    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";

    displayTasks();
}

// Add button event
addTaskBtn.addEventListener("click", addTask);

// Enter key event
taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        addTask();
    }
});

// Filter buttons
const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        currentFilter = button.dataset.filter;

        filterButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        displayTasks();
    });
});

// Load saved tasks
displayTasks();
