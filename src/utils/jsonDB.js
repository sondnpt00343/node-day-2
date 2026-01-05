const { readFile, writeFile } = require("node:fs/promises");

const DB_FILE = "./db.json";

const readDB = async () => {
    try {
        const result = await readFile(DB_FILE, "utf-8");
        return JSON.parse(result);
    } catch (error) {
        if (error.code === "ENOENT") {
            await writeDB({});
            return {};
        }
        if (error instanceof SyntaxError) {
            console.error("Invalid JSON format in db.json, initializing empty database");
            await writeDB({});
            return {};
        }
        throw error;
    }
};

const writeDB = async (data) => {
    try {
        await writeFile(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch (error) {
        console.error("Error writing to database:", error);
        throw error;
    }
};

module.exports = { readDB, writeDB };
