const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
    console.log('Connected to the employee_db database.')
);

db.query('SELECT * FROM department', function (err, results) {
    console.log(results);
});

db.query('SELECT * FROM role', function (err, results) {
    console.log(results);
});

db.query('SELECT * FROM employee', function (err, results) {
    console.log(results);
});

/*
inquirer
    .prompt([
        {
            type:'list',
            name: 'mainmenu',
            message:'What would you like to do?',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role'],
        }
    ])
*/