(async function () {
    const authService = new AuthService();
    const task = new Task();
    const renderer = new Renderer();
    const user = new User();

    const $createTaskBtn = $('#create-task');
    const $addTaskBtn = $('#add-task-btn');
    const $taskDecriptionInput = $('#icon_prefix');
    const $toDoList = $('#to-do-list');
    const $allFilter = $('.all-filter');
    const $toDoFilter = $('.todo-filter');
    const $doneFilter = $('.done-filter');
    const $logoutBtn = $('.logout-btn');

    let token;

    const handleAddTask = async () => {
        const description = $taskDecriptionInput.val();

        try {
            if (!token) {
                alert('Please repeat the login process');
                location.replace('/login');

            }
            await task.createTask({ "description": description }, token);
            $taskDecriptionInput.val('');
            renderer.handleTaskModalClose();

            await task.getTasksFromDB(token);
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
        renderer.renderTasks(task.tasks.filter(t => t.completed === 'To Do'));
    }

    const handleDoneFilter = () => {
        renderer.renderTasks(task.tasks.filter(t => t.completed === 'Done'));
    }

    const handleAllFilter = () => {
        renderer.renderTasks(task.tasks);
    }

    const handleLogoutClick = async () => {
        console.log('here');
        try {
            await user.logoutUser(authService.getToken());
            authService.logout();
            location.replace('/login');

        } catch (error) {
            alert(error);
        }

    }

    if (!authService.isLoggedIn()) {
        location.replace('/login');
    }

    try {
        token = authService.getToken();
        await task.getTasksFromDB(token);
        renderer.renderTasks(task.tasks);

    } catch (error) {
        location.replace('/login');

    }

    $(document).ready(function () {
        $('.sidenav').sidenav();
    });


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


