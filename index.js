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

function viewDepartments() {
    db.query('SELECT * FROM department', function (err, results) {
        console.table(results);
    });
};

function viewRoles() {
    db.query('SELECT * FROM role', function (err, results) {
        console.table(results);
    });
};

function viewEmployees() {
    db.query('SELECT * FROM employee', function (err, results) {
        console.table(results);
    });
};

inquirer
    .prompt([
        {
            type:'list',
            name: 'mainmenu',
            message:'What would you like to do?',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role'],
        }
    ])
    .then((data) => {
        if (data.mainmenu == "View all departments") {
            viewDepartments();
        } else if (data.mainmenu == "View all roles") {
            viewRoles();
        } else if (data.mainmenu == "View all employees") {
            viewEmployees();
        } else if (data.mainmenu == "Add a department") {
            console.log("You have chosen to add a department");
        } else if (data.mainmenu == "Add a role") {
            console.log("You have chosen to add a role");
        } else if (data.mainmenu == "Add an employee") {
            console.log("You have chosen to add an employee");
        } else if (data.mainmenu == "Update an employee role") {
            console.log("You have chosen to update an employee role");
        }
    });