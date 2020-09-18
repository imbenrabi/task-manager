(async function () {
    const task = new Task();
    const renderer = new Renderer();

    const $createTaskBtn = $('#create-task');
    const $addTaskBtn = $('#add-task-btn');
    const $taskDecriptionInput = $('#task-description-input');
    const $toDoList = $('#to-do-list');
    const $allFilter = $('#all-filter');
    const $toDoFilter = $('#todo-filter');
    const $doneFilter = $('#done-filter');

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

        try {
            await task.updateTask(id, { completed: true });
            renderer.renderTasks(task.tasks);
        } catch (error) {
            console.log(error);

            alert('Something went wrong...');
        }
    }

    const handleToDoFilter = () => {
        renderer.renderTasks(task.tasks.filter(t => t.completed === false));
    }

    const handleDoneFilter = () => {
        renderer.renderTasks(task.tasks.filter(t => t.completed === true));
    }

    const handleAllFilter = () => {
        renderer.renderTasks(task.tasks);
    }

    await task.getTasksFromDB();
    renderer.renderTasks(task.tasks);

    $createTaskBtn.on('click', renderer.handleCreateTaskClick);
    $taskModalCloseBtn.on('click', renderer.handleTaskModalClose);
    window.onclick = renderer.handleClickOffModal;

    $addTaskBtn.on('click', handleAddTask);

    $toDoList.on('click', '.delete-btn', handleDeleteTask);
    $toDoList.on('click', '.done-btn', handleDoneTask);

    $allFilter.on('click', handleAllFilter);
    $toDoFilter.on('click', handleToDoFilter);
    $doneFilter.on('click', handleDoneFilter);

})();


