const $addTaskModal = $('#add-task-modal');
const $taskModalCloseBtn = $('#task-modal-close');

class Renderer {
    constructor() {
    }

    renderTasks(tasks) { //add option object to handle task filtering and sorting
        $("#to-do-list").empty()
        const source = $('#tasks-template').html();
        const template = Handlebars.compile(source);
        const newHTML = template({ tasks })

        $('#to-do-list').append(newHTML);

    }

    handleCreateTaskClick() {
        $addTaskModal.css('display', 'block');

    }

    handleTaskModalClose() {
        $addTaskModal.css('display', 'none');

    }

    handleClickOffModal(e) {
        const modal = document.getElementById('add-task-modal')

        if (e.target == modal) {
            $addTaskModal.css('display', 'none');
        }
    }
}
