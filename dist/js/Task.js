TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjE2Y2I4NTdjMWM2YTM4MjRjZWVmMjYiLCJpYXQiOjE1OTkwNTY5Njl9.J56rCWjChs-azwc21VE2meo1VmhlGOw5Ad40rL1rArg'

class Task {
    constructor() {
        this.tasks = [];
    }

    async getTasksFromDB() {
        const config = {
            headers: { Authorization: `Bearer ${TOKEN}` } // will need to set up token management for the client
        };
        try {
            const resp = await axios.get('/tasks', config);

            console.log(resp.data);
            this.tasks = resp.data;

        }
        catch (error) {
            console.log(error);
        }

    }

    createTask(description) {
        //send POST request to ('/tsaks')
    }
}

// const t = new Task()
// t.getTasksFromDB()
// console.log(t);