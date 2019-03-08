const express = require('express');
const router = express.Router();
const Task = require('../models/task.js');
const auth = require('../middleware/auth.js');

router.post('/tasks', auth,  async (req, res) => {
    const task = new Task({
        ...req.body,
        owner : req.user._id 
    });
    
    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);
    }
    
})

//GET /tasks?completed=false || true
router.get('/tasks', auth, async (req, res) => {
    const  match = {};
    const sort = {};
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    if (req.query.sortBy) {
        const sortCriteria = req.query.sortBy.split(':');
        sort[sortCriteria[0]] = sortCriteria[1] === 'asc' ? 1 : -1
    }
    try {
        await req.user.populate({
            path : 'tasks',
            match,
            options: {
                limit : parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.send(req.user.tasks);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/tasks/:id', auth,  async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findOne({
            _id,
            owner : req.user._id
        })
        if (!task) {
            res.status(404).send();
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const validFields = ['description', 'completed'];
    const isValidOperation = updates.every((update) => {
        return validFields.includes(update);
    })

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid fields'});
    }

    try {
        const task = await Task.findOne({
            _id : req.params.id,
            owner : req.user._id
        })
        if(!task) {
            return res.status(404).send();
        }

        updates.forEach((update) => task[update] = req.body[update]); //dynamically update with bracket notation
        await task.save();
        res.send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id : req.params.id, owner : req.user._id});
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;