(async function () {
    const task = new Task();
    const renderer = new Renderer()

    const $addTaskModal = $('#add-task-modal');
    const $createTaskBtn = $('#create-task');
    const $taskModalCloseBtn = $('#task-modal-close');

    const handleCreateTaskClick = () => {
        $addTaskModal.css('display', 'block');

    }

    const handleTaskModalClose = () => {
        $addTaskModal.css('display', 'none');

    }

    window.onclick = function (e) {
        const modal = document.getElementById('add-task-modal')

        if (e.target == modal) {
            $addTaskModal.css('display', 'none');
        }
    }

    await task.getTasksFromDB();
    renderer.renderTasks(task.tasks);

    $createTaskBtn.click(handleCreateTaskClick);

    $taskModalCloseBtn.click(handleTaskModalClose);


})();


