const crypto = require("crypto");
const bcrypt = require("bcrypt");

const userModel = require("../models/user.model");
const { secret } = require("../config/jwt");

function base64Encode(str) {
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

const saltRounds = 10;

const register = async (req, res) => {
    const { email, password } = req.body;
    const hash = await bcrypt.hash(password, saltRounds);

    const insertId = await userModel.create(email, hash);
    const newUser = {
        id: insertId,
        email,
    };

    res.success(newUser, 201);
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findByEmail(email);

    if (!user) {
        return res.error("Unauthorized", 401);
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        return res.error("Unauthorized", 401);
    }

    const header = base64Encode(
        JSON.stringify({
            alg: "HS256",
            typ: "JWT",
        })
    );
    const payload = base64Encode(
        JSON.stringify({
            sub: user.id,
            exp: Date.now() + 60 * 60 * 1000,
        })
    );
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(`${header}.${payload}`);

    const signature = hmac.digest("base64url");
    const token = `${header}.${payload}.${signature}`;

    res.success(user, 200, {
        access_token: token,
        access_token_ttl: 3600,
    });
};

const getCurrentUser = async (req, res) => {
    res.success(req.user);
};

module.exports = { register, login, getCurrentUser };
