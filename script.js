
// SELECTING HTML ELEMENTS

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

const taskCount = document.getElementById("taskCount");
const completedCount = document.getElementById("completedCount");
const emptyMessage = document.getElementById("emptyMessage");


// LOCAL STORAGE

function loadTasks() {
    try {
        const savedTasks = JSON.parse(localStorage.getItem("tasks"));
        return Array.isArray(savedTasks) ? savedTasks : [];
    } catch (error) {
        return [];
    }
}

let tasks = loadTasks();


// SAVE TASKS

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// READ OPERATION - DISPLAY TASKS

function displayTasks() {

    taskList.innerHTML = "";

    tasks.forEach(function(task) {

        const li = document.createElement("li");

        li.dataset.id = task.id;

        // Task text
        const span = document.createElement("span");

        span.textContent = task.text;

        if (task.completed) {
            span.classList.add("completed");
        }

        // Button container
        const buttonDiv = document.createElement("div");

        // Edit button
        const editBtn = document.createElement("button");

        editBtn.textContent = "Edit";
        editBtn.className = "edit-btn";
        editBtn.dataset.action = "edit";
        editBtn.type = "button";

        // Delete button
        const deleteBtn = document.createElement("button");

        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.dataset.action = "delete";
        deleteBtn.type = "button";

        // Append buttons
        buttonDiv.appendChild(editBtn);
        buttonDiv.appendChild(deleteBtn);

        li.appendChild(span);
        li.appendChild(buttonDiv);

        taskList.appendChild(li);

    });

    // Update task counts
    const completed = tasks.filter(function(task) {
        return task.completed;
    }).length;

    const remaining = tasks.length - completed;

    taskCount.textContent = `${remaining} tasks remaining`;

    completedCount.textContent = `${completed} completed`;

    // Show empty message
    emptyMessage.style.display =
        tasks.length === 0 ? "block" : "none";

}


// CREATE OPERATION - ADD TASK

function addTask() {

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    const newTask = {
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    displayTasks();

    taskInput.value = "";

    taskInput.focus();

}


// ADD BUTTON EVENT

addBtn.addEventListener("click", addTask);


// ENTER KEY EVENT

taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        addTask();
    }

});


// UPDATE AND DELETE OPERATIONS
// EVENT DELEGATION

taskList.addEventListener("click", function(event) {

    const li = event.target.closest("li");

    if (!li) return;

    const taskId = li.dataset.id;

    const task = tasks.find(function(item) {
        return item.id === taskId;
    });

    if (!task) return;


    // UPDATE OPERATION - EDIT TASK

    if (event.target.dataset.action === "edit") {

        const updatedTask = prompt(
            "Edit your task:",
            task.text
        );

        if (updatedTask === null) return;

        if (updatedTask.trim() === "") {
            alert("Task cannot be empty!");
            return;
        }

        task.text = updatedTask.trim();

        saveTasks();

        displayTasks();

    }


    // DELETE OPERATION - DELETE TASK

    else if (event.target.dataset.action === "delete") {

        const confirmDelete = confirm(
            "Are you sure you want to delete this task?"
        );

        if (confirmDelete) {

            tasks = tasks.filter(function(item) {
                return item.id !== taskId;
            });

            saveTasks();

            displayTasks();

        }

    }


    // MARK TASK AS COMPLETED

    else if (event.target.tagName === "SPAN") {

        task.completed = !task.completed;

        saveTasks();

        displayTasks();

    }

});


// DISPLAY SAVED TASKS WHEN PAGE LOADS

displayTasks();
