const bcrypt = require("bcrypt");

const { secret } = require("../config/jwt");
const { 
    BCRYPT_SALT_ROUNDS, 
    ACCESS_TOKEN_TTL_SECONDS, 
    REFRESH_TOKEN_TTL_DAYS,
    ERROR_MESSAGES,
    HTTP_STATUS 
} = require("../config/constants");
const userModel = require("../models/user.model");
const jwt = require("../utils/jwt");
const strings = require("../utils/strings");

const register = async (req, res) => {
    const { email, password } = req.body;
    const hash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    const insertId = await userModel.create(email, hash);
    const newUser = {
        id: insertId,
        email,
    };

    res.success(newUser, HTTP_STATUS.CREATED);
};

const responseWithTokens = async (user) => {
    const accessTokenTtlMs = ACCESS_TOKEN_TTL_SECONDS * 1000;
    const refreshTokenTtlMs = REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000;
    
    const payload = {
        sub: user.id,
        exp: Date.now() + accessTokenTtlMs,
    };
    const accessToken = jwt.sign(payload, secret);
    const refreshToken = strings.createRandomString(32);
    const refreshTtl = new Date(Date.now() + refreshTokenTtlMs);

    await userModel.updateRefreshToken(user.id, refreshToken, refreshTtl);

    const response = {
        access_token: accessToken,
        access_token_ttl: ACCESS_TOKEN_TTL_SECONDS,
        refresh_token: refreshToken,
        refresh_token_ttl: REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60,
    };

    return response;
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findByEmail(email);

    if (!user) {
        return res.error(ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        return res.error(ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
    }

    const tokens = await responseWithTokens(user);
    res.success(user, HTTP_STATUS.OK, tokens);
};

const getCurrentUser = async (req, res) => {
    res.success(req.user);
};

const refreshToken = async (req, res) => {
    const refreshToken = req.body.refresh_token;
    const user = await userModel.findByRefreshToken(refreshToken);

    if (!user) {
        return res.error(ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
    }

    const tokens = await responseWithTokens(user);
    res.success(tokens);
};

module.exports = { register, login, getCurrentUser, refreshToken };
