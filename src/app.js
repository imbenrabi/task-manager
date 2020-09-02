const express = require('express');
require('./db/mongoose');
const path = require('path');

const tasksRouter = require('./routers/tasks');
const usersRouter = require('./routers/users');

const distPath = path.join(__dirname, '../dist');
const nodeModulesPath = path.join(__dirname, '../node_modules');

const app = express();

app.use(express.static(distPath));
app.use(express.static(nodeModulesPath))
app.use(express.json());
app.use(tasksRouter);
app.use(usersRouter);

module.exports = app;

