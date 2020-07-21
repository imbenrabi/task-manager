const express = require('express');
require('./db/mongoose');
const tasksRouter = require('./routers/tasks');
const usersRouter = require('./routers/users');

const app = express();

app.use(express.json());
app.use(tasksRouter);
app.use(usersRouter);

module.exports = app;

