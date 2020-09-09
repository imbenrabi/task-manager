(async function () {
    const task = new Task();
    const renderer = new Renderer();

    const $createTaskBtn = $('#create-task');
    const $addTaskBtn = $('#add-task-btn');
    const $taskDecriptionInput = $('#task-description-input');
    const $toDoList = $('#to-do-list');


    const handleAddTask = async () => {
        const description = $taskDecriptionInput.val();

        try {
            await task.createTask({ "description": description });
            $taskDecriptionInput.val('');
            renderer.handleTaskModalClose();

            renderer.renderTasks(task.tasks);

        } catch (error) {
            $taskDecriptionInput.val('');
            renderer.handleTaskModalClose();
            console.log(error);

            alert('Something went wrong...')
        }

    }

    const handleDeleteTask = async function () {
        const id = $(this).closest('.task').data().id;

        try {
            await task.deleteTask(id);
            renderer.renderTasks(task.tasks);

        } catch (error) {
            console.log(error);

            alert('Something went wrong...');
        }


    }

    const handleDoneTask = async function () {
        const id = $(this).closest('.task').data().id;
        console.log(id);
        try {
            await task.updateTask(id, { completed: true });
            renderer.renderTasks(task.tasks);
        } catch (error) {
            console.log(error);

            alert('Something went wrong...');
        }
    }

    await task.getTasksFromDB();
    renderer.renderTasks(task.tasks);

    $createTaskBtn.click(renderer.handleCreateTaskClick);
    $taskModalCloseBtn.click(renderer.handleTaskModalClose);
    window.onclick = renderer.handleClickOffModal;

    $addTaskBtn.click(handleAddTask);

    $toDoList.on('click', '.delete-btn', handleDeleteTask);
    $toDoList.on('click', '.done-btn', handleDoneTask);

})();


