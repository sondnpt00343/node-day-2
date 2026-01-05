const pool = require("../config/database");

class User {
    async findAll(limit, offset) {
        const [rows] = await pool.query(
            `select * from users limit ${limit} offset ${offset};`
        );
        return rows;
    }

    async count() {
        const [rows] = await pool.query("select count(*) as count from users;");
        return rows[0].count;
    }

    async findOne(id) {
        const [rows] = await pool.query(
            `select id, email, first_name, last_name, created_at from users where id = ${id};`
        );
        return rows[0];
    }

    async findByEmail(email) {
        const query = `select id, email, first_name, last_name, password from users where email = ?;`;
        const [rows] = await pool.query(query, [email]);
        return rows[0];
    }

    async create(email, password) {
        const [{ insertId }] = await pool.query(
            `insert into users (email, password) values ("${email}", "${password}")`
        );
        return insertId;
    }
}

module.exports = new User();
