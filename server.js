require("dotenv").config();

const express = require("express");
const appRoute = require("./src/routes");
const json = require("./src/middlewares/json");
const response = require("./src/middlewares/response");
const errorHandler = require("./src/middlewares/errorHandler");
const notFound = require("./src/middlewares/notFound");

require("./src/config/database");

const app = express();
const { DEFAULT_PORT } = require("./src/config/constants");
const port = process.env.PORT || DEFAULT_PORT;

app.use(json);
app.use(response);

app.use("/api", appRoute);
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log("Running on localhost:" + port);
});

/**
 Bài tập trên lớp:
 - Viết middleware tên "taskCreateValidator" để validate dữ liệu
 khi tạo 1 task mới, cấu trúc task { title: "ABC..." }
 - "title": minLength = 2, maxLength 50
 - Nếu hợp lệ, đi tiếp vào controller để tạo task mới, status 201, {
        status: "success",
        data: newTask
    }
 - Nếu không hợp lệ, trả về status 422, {
        status: "error",
        error: {
            title: "[Error message]"
        }
    }
- Xử lý đồng nhất response format cho cả tình huống 404 & exception
 */
