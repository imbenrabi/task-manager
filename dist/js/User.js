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
            const request = axios.create({
                baseURL: "http://localhost:3000/users/logout"
            });

            request.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const resp = await request.post();

            if (resp.status !== 200) {

                throw new Error('Unable to logout');
            }


        } catch (err) {
            throw error;
        }

    }

    async getUserData() {
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const resp = await axios.post('/users/me', config);

            if (resp.status !== 200) {

                throw new Error('Unable to fetch data, reauthenticate.');
            }

            this.data = resp.data;

        } catch (error) {
            throw error;

        }
    }
}