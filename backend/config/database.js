const mariadb = require('mariadb');
require('dotenv').config();

const pool = mariadb.createPool({
    host: process.env.HOST, 
    port: process.env.PORT,
    user: process.env.USER, 
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

module.exports = pool