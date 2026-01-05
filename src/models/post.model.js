const pool = require("../config/database");

class Post {
    async findAll(limit, offset, filters = {}) {
        let query = "select * from posts";
        const conditions = [];
        const values = [];

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) {
                conditions.push(`${key} = ?`);
                values.push(value);
            }
        });

        if (conditions.length > 0) {
            query += ` where ${conditions.join(" and ")}`;
        }

        query += " limit ? offset ?";
        values.push(limit, offset);

        const [rows] = await pool.query(query, values);
        return rows;
    }

    async findUserPosts(userId) {
        const query = `select * from posts where id in (select post_id from user_post where user_id = ?);`;
        const [rows] = await pool.query(query, [userId]);
        return rows;
    }

    async count() {
        const [rows] = await pool.query("select count(*) as count from posts;");
        return rows[0].count;
    }

    async findOne(id) {
        const [rows] = await pool.query(
            `select * from posts where id = ?;`,
            [id]
        );
        return rows[0];
    }
}

module.exports = new Post();
