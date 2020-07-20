const express = require('express');
require('./db/mongoose');
const tasksRouter = require('./routers/tasks');
const usersRouter = require('./routers/users');

log = console.log;

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(tasksRouter);
app.use(usersRouter);

app.listen(port, () => {
    log(`Server is up on port ${port}`);
})