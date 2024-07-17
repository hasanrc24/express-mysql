const { createPool } = require("mysql2/promise");

const pool = createPool({
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "test",
    connectionLimit: 10
})

module.exports = pool;