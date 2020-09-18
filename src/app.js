const express = require('express');
const path = require('path');
const hbs = require('hbs');

require('./db/mongoose');

const tasksRouter = require('./routers/tasks');
const usersRouter = require('./routers/users');
const renderRouter = require('./routers/render')

const distPath = path.join(__dirname, '../dist');
const nodeModulesPath = path.join(__dirname, '../node_modules');
const viewsPath = path.join(__dirname, './templates/views');
const partialsPath = path.join(__dirname, './templates/partials')

const app = express();

app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.static(distPath));
app.use(express.static(nodeModulesPath))
app.use(express.json());
app.use(tasksRouter);
app.use(usersRouter);
app.use(renderRouter);

module.exports = app;

