const mysql = require('mysql2');

// connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'bRLGUc-ly$t4?Yu0E#!U',
        database: 'employee_tracker'
    },
    console.log('Connected to the employee tracker database.')
);

module.exports = db;