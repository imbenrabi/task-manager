(async function () {
    const authService = new AuthService();
    const task = new Task();
    const renderer = new Renderer();
    const user = new User();

    const $toDoList = $('#to-do-list');
    const $allFilter = $('.all-filter');
    const $toDoFilter = $('.todo-filter');
    const $doneFilter = $('.done-filter');
    const $accountBtn = $('.account-btn');
    const $logoutBtn = $('.logout-btn');

    let token;

    if (!authService.isLoggedIn()) {
        location.replace('/login');
    }


    try {
        token = authService.getToken();
        await user.getUserData(token);

        console.log(user);

    } catch (error) {
        console.log(error);
        // location.replace('/login');

    }

    $(document).ready(function () {
        $('.sidenav').sidenav();
    });

})