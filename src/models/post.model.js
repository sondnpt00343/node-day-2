const pool = require("../config/database");

class Post {
    async findAll() {
        const [rows] = await pool.query("select * from posts;");
        return rows;
    }

    async findOne(id) {
        const [rows] = await pool.query(
            `select * from posts where id = ${id};`
        );
        return rows[0];
    }
}

module.exports = new Post();
