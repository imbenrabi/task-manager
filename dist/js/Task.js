// TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjE2Y2I4NTdjMWM2YTM4MjRjZWVmMjYiLCJpYXQiOjE1OTkwNTY5Njl9.J56rCWjChs-azwc21VE2meo1VmhlGOw5Ad40rL1rArg'

class Task {
    constructor() {
        this.tasks = [];
    }

    async getTasksFromDB(token) {
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        try {
            const resp = await axios.get('/tasks', config);

            this.tasks = resp.data;
        }
        catch (error) {
            throw error;
        }

    }

    async createTask(description, token) {
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        try {
            const resp = await axios.post('/tasks', description, config);

            this.tasks.push(resp.data);
            return resp.status;
        } catch (error) {
            throw error;
        }
    }

    async deleteTask(id, token) {
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        try {
            const resp = await axios.delete(`/tasks/${id}`, config);

            if (resp.status === 200 && resp.data._id === id) {
                const index = this.tasks.findIndex(t => t._id === id);
                this.tasks.splice(index, 1);
            } else {

                throw new Error('Mismatch between data-id and server response id!')
            }

        } catch (error) {
            throw error;
        }
    }

    async updateTask(id, updates, token) {
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        if (this.tasks.find(t => t._id === id).completed === true) {
            return;
        }

        try {
            const resp = await axios.patch(`/tasks/${id}`, updates, config);

            if (resp.status === 200 && resp.data._id === id) {
                const index = this.tasks.findIndex(t => t._id === id);

                this.tasks.splice(index, 1);
                this.tasks.push(resp.data);
            } else {

                throw new Error('Mismatch between data-id and server response id!')
            }

        } catch (error) {
            throw error;
        }
    }
}
