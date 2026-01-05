const taskModel = require("../models/task.model");
const { HTTP_STATUS } = require("../config/constants");

const getAll = (req, res) => {
    const tasks = taskModel.findAll();
    res.success(tasks);
};

const getOne = (req, res) => {
    const task = taskModel.findOne(+req.params.id);
    res.success(task);
};

const create = async (req, res, next) => {
    try {
        const newTask = await taskModel.create({
            title: req.body.title,
        });
        res.success(newTask, HTTP_STATUS.CREATED);
    } catch (error) {
        next(error);
    }
};

const toggle = (req, res) => {
    res.send("Toggle task isCompleted");
};

module.exports = { getAll, getOne, create, toggle };
