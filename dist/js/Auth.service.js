class AuthService {
    login(token) {
        localStorage.setItem('userToken', token);

    }

    getToken() {
        return localStorage.getItem('userToken');
    }

    logout() {
        localStorage.setItem('userToken', null);
    }

    isLoggedIn() {
        if (this.getToken() === null || !this.getToken()) {
            return false;
        } else {
            return true;
        }
    }
}
