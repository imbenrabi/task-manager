class User {
    constructor() {
        this.data = []
    }

    async createUser(user) {
        try {
            const resp = await axios.post('/users', user);

            this.data = resp.data.user;
            return resp.data.token;

        } catch (error) {
            throw error;

        }
    }

    async loginUser(userCredentials) {
        try {
            const resp = await axios.post('/users/login', userCredentials);

            if (resp.status > 399) {

                throw new Error('Unable to login');
            }

            this.data = resp.data.user;
            return resp.data.token;

        } catch (error) {
            throw error;

        }
    }

    async logoutUser(token) {
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const resp = await axios.post('/users/logout', config);

            if (resp.status !== 200) {

                throw new Error('Unable to logout');
            }

        } catch (error) {
            throw error;

        }
    }

    async getUserData() {

    }
}