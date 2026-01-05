const userModel = require("../models/user.model");
const postModel = require("../models/post.model");
const userService = require("../services/user.service");
const { ERROR_MESSAGES, HTTP_STATUS } = require("../config/constants");

const getAll = async (req, res) => {
    const page = +req.query.page || 1;
    const result = await userService.pagination(page);
    res.paginate(result);
};

const getUserPosts = async (req, res) => {
    const userPosts = await postModel.findUserPosts(req.params.id);
    res.success(userPosts);
};

const getOne = async (req, res) => {
    const user = await userModel.findOne(req.params.id);
    if (!user) return res.error(ERROR_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);

    res.success(user);
};

const create = (req, res) => {};

module.exports = { getAll, getOne, create, getUserPosts };
