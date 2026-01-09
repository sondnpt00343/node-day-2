const crypto = require("crypto");
const { authSecret } = require("../config/jwt");
const { ERROR_MESSAGES, HTTP_STATUS } = require("../config/constants");
const userModel = require("../models/user.model");

const authRequired = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.error(ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
    }

    const accessToken = authHeader.replace("Bearer ", "").trim();
    if (!accessToken) {
        return res.error(ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
    }

    const tokenParts = accessToken.split(".");
    if (tokenParts.length !== 3) {
        return res.error(ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
    }

    const [encodedHeader, encodedPayload, clientSignature] = tokenParts;

    const hmac = crypto.createHmac("sha256", authSecret);
    hmac.update(`${encodedHeader}.${encodedPayload}`);

    const signature = hmac.digest("base64url");

    if (signature !== clientSignature) {
        return res.error(ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
    }

    let payload;
    try {
        payload = JSON.parse(atob(encodedPayload));
    } catch (error) {
        return res.error(ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
    }

    if (!payload.exp || payload.exp < Date.now()) {
        return res.error(ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
    }

    const currentUser = await userModel.findOne(payload.sub);

    if (!currentUser) {
        return res.error(ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
    }

    req.user = currentUser;

    next();
};

module.exports = authRequired;
