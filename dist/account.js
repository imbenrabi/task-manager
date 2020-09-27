(async function () {
    const authService = new AuthService();
    const task = new Task();
    const renderer = new Renderer();
    const user = new User();

    const $allFilter = $('.all-filter');
    const $toDoFilter = $('.todo-filter');
    const $doneFilter = $('.done-filter');
    const $accountBtn = $('.account-btn');
    const $logoutBtn = $('.logout-btn');

    let token;

    const handleFilterClick = () => {
        console.log('here');
        if (!authService.isLoggedIn()) {
            return location.replace('/login');
        }

        location.replace('/')
    }

    const handleAccountClick = async () => {

        if (!authService.isLoggedIn()) {
            return location.replace('/login');
        }

        location.replace('/account')

    }

    const handleLogoutClick = async () => {
        try {
            await user.logoutUser(authService.getToken());
            authService.logout();
            location.replace('/login');

        } catch (error) {
            alert(error);
        }

    }

    if (!authService.isLoggedIn()) {
        return location.replace('/login');
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

    $allFilter.on('click', handleFilterClick);
    $toDoFilter.on('click', handleFilterClick);
    $doneFilter.on('click', handleFilterClick);

    $accountBtn.on('click', handleAccountClick);
    $logoutBtn.on('click', handleLogoutClick);

})();