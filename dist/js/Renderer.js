// const t = [{
//     "completed": false,
//     "_id": "5f50cdf1949f7c6e5cb7b3a3",
//     "description": "to do 2",
//     "owner": "5f50cdcc949f7c6e5cb7b39f",
//     "createdAt": "2020-09-03T11:05:21.087Z",
//     "updatedAt": "2020-09-03T11:05:21.087Z",
//     "__v": 0
// }, {
//     "completed": false,
//     "_id": "5f50cdf1949f7c6e5cb7b3b4",
//     "description": "to do 3",
//     "owner": "5f50cdcc949f7c6e5cb7b39f",
//     "createdAt": "2020-09-03T11:05:21.087Z",
//     "updatedAt": "2020-09-03T11:05:21.087Z",
//     "__v": 0
// }]
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

// const rend = new Renderer()
// rend.renderTasks(t)