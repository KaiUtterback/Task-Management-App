// Load tasks from local storage
function loadTasks() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

// Save tasks to local storage
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Delete a task by ID
function deleteTask(taskId) {
    const tasks = loadTasks();
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    saveTasks(updatedTasks);
}

// Update task status
function updateTaskStatus(taskId, newStatus) {
    const tasks = loadTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex > -1) {
        tasks[taskIndex].status = newStatus;
        saveTasks(tasks);
        alert('Task status updated!');
        renderTasks(); // Re-render tasks to update the UI
    }
}

// Render tasks on the dashboard
function renderTasks() {
    const tasks = loadTasks();
    const taskContainer = document.getElementById('taskContainer');
    taskContainer.innerHTML = ''; // Clear existing tasks

    tasks.forEach(task => {
        const taskCard = document.createElement('div');
        taskCard.className = 'col-md-4 mb-4';
        taskCard.innerHTML = `
            <div class="card text-center bg-warning dashboard-card" data-task-id="${task.id}">
                <div class="card-body">
                    <h5 class="card-title">${task.title}</h5>
                    <p class="card-text">${task.description}</p>
                </div>
            </div>
            <div class="text-center mt-2">
                <a href="details.html?taskId=${task.id}" class="btn btn-primary edit-task-btn">Edit</a>
                <button class="btn btn-danger delete-task-btn">Delete</button>
                <div class="badge-container mt-2">
                    <span class="badge badge-primary">${task.priority || 'No priority'}</span>
                    <span class="badge badge-secondary">${task.status || 'No status'}</span>
                </div>
                <div class="form-group mt-2">
                    <label for="taskStatus-${task.id}">Change Status:</label>
                    <select class="form-control task-status-dropdown" id="taskStatus-${task.id}" data-task-id="${task.id}">
                        <option value="To Do" ${task.status === 'To Do' ? 'selected' : ''}>To Do</option>
                        <option value="In Progress" ${task.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                        <option value="Completed" ${task.status === 'Completed' ? 'selected' : ''}>Completed</option>
                    </select>
                </div>
            </div>
        `;
        taskContainer.appendChild(taskCard);
    });

    document.querySelectorAll('.task-status-dropdown').forEach(dropdown => {
        dropdown.addEventListener('change', function() {
            const taskId = parseInt(this.getAttribute('data-task-id'), 10);
            const newStatus = this.value;
            updateTaskStatus(taskId, newStatus);
        });
    });

    document.querySelectorAll('.delete-task-btn').forEach(button => {
        button.addEventListener('click', function() {
            const taskId = parseInt(this.closest('.col-md-4').querySelector('.dashboard-card').getAttribute('data-task-id'), 10);
            deleteTask(taskId);
            alert('Task deleted!');
            renderTasks(); // Re-render the tasks after deletion
        });
    });
}

// Event listener for document load
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('taskContainer')) {
        renderTasks();
    }

    if (document.getElementById('createTaskForm')) {
        document.getElementById('createTaskForm').addEventListener('submit', function(event) {
            event.preventDefault();
            const tasks = loadTasks();

            const newTask = {
                id: Date.now(),
                title: document.getElementById('taskTitle').value,
                description: document.getElementById('taskDescription').value,
                priority: document.getElementById('taskPriority').value,
                status: document.getElementById('taskStatus').value
            };

            tasks.push(newTask);
            saveTasks(tasks);
            alert('Task created!');
            window.location.href = 'dashboard.html';
        });
    }

    if (document.getElementById('taskDetailsForm')) {
        const urlParams = new URLSearchParams(window.location.search);
        const taskId = parseInt(urlParams.get('taskId'), 10);
        const tasks = loadTasks();
        const task = tasks.find(t => t.id === taskId);

        if (task) {
            document.getElementById('taskTitle').value = task.title;
            document.getElementById('taskDescription').value = task.description;
            document.getElementById('taskPriority').value = task.priority;
            document.getElementById('taskStatus').value = task.status;
        }

        document.getElementById('taskDetailsForm').addEventListener('submit', function(event) {
            event.preventDefault();
            task.title = document.getElementById('taskTitle').value;
            task.description = document.getElementById('taskDescription').value;
            task.priority = document.getElementById('taskPriority').value;
            task.status = document.getElementById('taskStatus').value;

            saveTasks(tasks);
            alert('Task updated!');
            window.location.href = 'dashboard.html';
        });

        document.getElementById('deleteTaskButton').addEventListener('click', function() {
            deleteTask(taskId);
            alert('Task deleted!');
            window.location.href = 'dashboard.html';
        });
    }

    if (document.querySelector('.add-task-btn')) {
        document.querySelector('.add-task-btn').addEventListener('click', function() {
            window.location.href = 'create.html';
        });
    }
});
