const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const { clientDateFormat, clientTaskStatusFormat } = require('../utils/DataFormatter.service')
const log = console.log;

const router = new express.Router();

const { format, parseISO } = require('date-fns');


router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save();
        res.status(201).send(task)

    } catch (error) {
        res.status(400).send(error);

    }
})

//GET /tasks?completed=<true/false>
// limit skip //GET /tasks?limit=10&skip=10(for 2nd page)
// sort //GET /tasks?sortBy=createdAt:<asc/desc>
router.get('/tasks', auth, async (req, res) => {
    try {
        const match = { owner: req.user._id };
        const options = {
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
            sort: {}
        };

        if (req.query.completed) {
            match.completed = req.query.completed === 'true';
        }

        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':');
            options.sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        }

        req.user.tasks = await Task.find(match, null, options);

        /**using mongoose virtuals */
        // await req.user.populate({path: 'tasks', match, options}).exec();
        const tasks = [];

        req.user.tasks.forEach((task) => {
            const taskObject = task.toObject();

            taskObject.createdAt = clientDateFormat(Date.parse(taskObject.createdAt));
            taskObject.updatedAt = clientDateFormat(Date.parse(taskObject.updatedAt));
            taskObject.completed = clientTaskStatusFormat(taskObject.completed);
            tasks.push(taskObject)
        })

        res.send(tasks);

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) {
            return res.status(404).send(error)
        }

        res.send(task);
    } catch (error) {
        res.status(500).send(error);

    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const allowedUpdates = ['completed', 'description'];
    const updates = Object.keys(req.body);
    const isAllowed = updates.every((update) => allowedUpdates.includes(update));

    if (!isAllowed) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

        if (!task) {
            return res.status(404).send({ error: 'Task not found' });
        }

        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();
        res.send(task);
    } catch (error) {
        log(error);
        res.status(500).send(error);
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            return res.status(404).send({ error: 'Task not found' });
        }

        res.send(task);
    } catch (error) {
        log(error);
        res.status(500).send(error);
    }
})

module.exports = router;