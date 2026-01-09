require("dotenv").config();

const cors = require("cors");
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

app.use(
    cors({
        origin: "http://localhost:5173",
    })
);
app.use(json);
app.use(response);

app.use("/api", appRoute);
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log("Running on localhost:" + port);
});

// Verify email
// Queue
// Schedule
