(function () {
    const loginService = new LoginManager();
    const user = new User();

    const $registerPass = $('#pass-register-input');
    const $registerPass2 = $('#pass-register-input-2');
    const $registerEmail = $('#email-register-input');
    const $registerUsername = $('#username-register-input');
    const $registerBtn = $('#register-btn');
    const $loginPass = $('#pass-login-input');
    const $loginEmail = $('#email-login-input');
    const $loginBtn = $('#login-btn');

    const handleRegisterClick = async (e) => {
        e.preventDefault();

        const passA = $registerPass.val();
        const passB = $registerPass2.val();
        const email = $registerEmail.val();
        const name = $registerUsername.val();

        if (passA === passB && validator.isEmail(email)) {
            try {
                const token = await user.createUser({ name, email, password: passA });

                loginService.login(token);
                location.replace('/');
            } catch (error) {
                console.log(error);

            }

        } else {
            alert('Something is wrong with your form, please fill it again');
        }

        $registerPass.val('');
        $registerPass2.val('');
        $registerEmail.val('');

    }

    const handleLoginClick = async (e) => {
        e.preventDefault();

        const email = $loginEmail.val();
        const password = $loginPass.val();

        try {

            const token = await user.loginUser({ email, password });

            if (!token) {
                return alert('Unable to login.');

            } else {
                loginService.login(token);
                location.replace('/');

            }
        } catch (error) {
            $loginEmail.val('');
            $loginPass.val('');

            return alert('Unable to login.');
        }

    }

    $registerBtn.on('click', handleRegisterClick);
    $loginBtn.on('click', handleLoginClick);

})();