const { HTTP_STATUS } = require("../config/constants");

const response = (_, res, next) => {
    res.success = (data, status = HTTP_STATUS.OK, passProps = {}) => {
        res.status(status).json({
            status: "success",
            data,
            ...passProps,
        });
    };

    res.paginate = ({ rows, pagination }) => {
        res.success(rows, HTTP_STATUS.OK, { pagination });
    };

    res.error = (error, status = HTTP_STATUS.INTERNAL_SERVER_ERROR) => {
        res.status(status).json({
            status: "error",
            error,
        });
    };

    next();
};

module.exports = response;
