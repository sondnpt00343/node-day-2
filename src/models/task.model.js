const { readDB, writeDB } = require("../utils/jsonDB");

let taskId = 1;
let db = {};

readDB().then((result) => {
    db = result;
});

const taskModel = {
    findAll() {
        return db.tasks || [];
    },
    findOne(id) {
        return db.tasks?.find((task) => task.id === id);
    },
    async create(task) {
        if (!db.tasks) {
            db.tasks = [];
        }
        
        const newTask = {
            id: taskId++,
            ...task,
            isCompleted: false,
        };
        db.tasks.push(newTask);

        try {
            await writeDB(db);
        } catch (error) {
            console.error("Failed to save task to database:", error);
            throw new Error("Failed to create task");
        }

        return newTask;
    },
};

module.exports = taskModel;
