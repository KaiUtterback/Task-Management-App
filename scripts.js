function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
}

function getTaskById(taskId) {
    const tasks = loadTasks();
    return tasks.find(task => task.id === taskId);
}

function updateTask(updatedTask) {
    let tasks = loadTasks();
    tasks = tasks.map(task => task.id === updatedTask.id ? updatedTask : task);
    saveTasks(tasks);
}

function deleteTask(taskId) {
    let tasks = loadTasks();
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks(tasks);
}
