const postModel = require("../models/post.model");

const getAll = async (req, res) => {
    const tasks = await postModel.findAll();
    res.success(tasks);
};

const getOne = async (req, res) => {
    const task = await postModel.findOne(req.params.id);
    if (!task) return res.error("Not found", 404);

    res.success(task);
};

const create = (req, res) => {};

module.exports = { getAll, getOne, create };
