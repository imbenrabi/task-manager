(async function () {
    const task = new Task();
    const renderer = new Renderer()

    await task.getTasksFromDB();
    renderer.renderTasks(task.tasks);

})();


