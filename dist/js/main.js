(async function () {
    const task = new Task();

    await task.getTasksFromDB();
    console.log(task.tasks);
})();


