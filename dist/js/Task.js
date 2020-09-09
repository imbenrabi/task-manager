TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjE2Y2I4NTdjMWM2YTM4MjRjZWVmMjYiLCJpYXQiOjE1OTkwNTY5Njl9.J56rCWjChs-azwc21VE2meo1VmhlGOw5Ad40rL1rArg'

class Task {
    constructor() {
        this.tasks = [];
    }

    async getTasksFromDB() {
        const config = {
            headers: { Authorization: `Bearer ${TOKEN}` } // will need to set up token management for the client - probably instance specific (in the constructor)
        };

        try {
            const resp = await axios.get('/tasks', config);

            this.tasks = resp.data;
        }
        catch (error) {
            console.log(error);
        }

    }

    async createTask(description) {
        const config = {
            headers: { Authorization: `Bearer ${TOKEN}` }
        };

        try {
            const resp = await axios.post('/tasks', description, config);

            this.tasks.push(resp.data);
            return resp.status;
        } catch (error) {
            return error;
        }
    }

    async deleteTask(id) {
        const config = {
            headers: { Authorization: `Bearer ${TOKEN}` }
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
            return error;
        }
    }

    async updateTask(id, updates) {
        const config = {
            headers: { Authorization: `Bearer ${TOKEN}` }
        };

        try {
            const resp = await axios.patch(`/tasks/${id}`, updates, config);

            console.log(resp.data);
            if (resp.status === 200 && resp.data._id === id) {
                const index = this.tasks.findIndex(t => t._id === id);

                this.tasks.splice(index, 1);
                this.tasks.push(resp.data);
            } else {

                throw new Error('Mismatch between data-id and server response id!')
            }

        } catch (error) {
            return error;
        }
    }
}

// const t = new Task()
// t.getTasksFromDB()
// console.log(t);