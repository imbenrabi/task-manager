(async function () {
    const loginService = new LoginManager();
    const task = new Task();
    const renderer = new Renderer();

    const $createTaskBtn = $('#create-task');
    const $addTaskBtn = $('#add-task-btn');
    const $taskDecriptionInput = $('#task-description-input');
    const $toDoList = $('#to-do-list');
    const $allFilter = $('#all-filter');
    const $toDoFilter = $('#todo-filter');
    const $doneFilter = $('#done-filter');
    const $logoutBtn = $('#logout-btn');

    let token;

    const handleAddTask = async () => {
        const description = $taskDecriptionInput.val();

        try {
            if (!token) {
                alert('Please repeat th login process');
                location.replace('/login');

            }
            await task.createTask({ "description": description }, token);
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
            await task.deleteTask(id, token);
            renderer.renderTasks(task.tasks);

        } catch (error) {
            console.log(error);

            alert('Something went wrong...');
        }


    }

    const handleDoneTask = async function () {
        const id = $(this).closest('.task').data().id;

        try {
            await task.updateTask(id, { completed: true }, token);
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

    const handleLogoutClick = () => {
        location.replace('/login');
        loginService.logout();

    }

    if (!loginService.isLoggedIn()) {
        location.replace('/login');
    }

    try {
        token = loginService.getToken();
        await task.getTasksFromDB(token);
        renderer.renderTasks(task.tasks);

    } catch (error) {
        location.replace('/login');

    }

    $createTaskBtn.on('click', renderer.handleCreateTaskClick);
    $taskModalCloseBtn.on('click', renderer.handleTaskModalClose);
    window.onclick = renderer.handleClickOffModal;

    $addTaskBtn.on('click', handleAddTask);

    $toDoList.on('click', '.delete-btn', handleDeleteTask);
    $toDoList.on('click', '.done-btn', handleDoneTask);

    $allFilter.on('click', handleAllFilter);
    $toDoFilter.on('click', handleToDoFilter);
    $doneFilter.on('click', handleDoneFilter);

    $logoutBtn.on('click', handleLogoutClick);

})();


