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
        viewMenu();
    });
};

function viewRoles() {
    db.query('SELECT role.id, role.title, role.salary, department.department_name FROM role INNER JOIN department ON role.department_id=department.id', function (err, results) {
        console.table(results);
        viewMenu();
    });
};

function viewEmployees() {
    db.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name, role.salary, employee.manager_id FROM employee LEFT JOIN role ON employee.role_id=role.id INNER JOIN department ON role.department_id=department.id', function (err, results) {
        console.table(results);
    });
    viewMenu();
};

function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'newDepartment',
                message: 'What is the name of the new department?',
            }
        ])
        .then((data) => {
            var newDepartment = data.newDepartment;
            db.query(`INSERT INTO department (department_name) VALUES ("${newDepartment}")`);
            viewMenu();
        })
};

function addRole() {
    db.query('SELECT * FROM department', function (err, results) {
        var departmentName = [];
        var departmentID;
        for (i=0; i<results.length; i++) {
            departmentName.push(results[i].department_name);
        }
        inquirer
        .prompt([
            {
                type: 'input',
                name: 'newRole',
                message: 'What is the name of the new role?',
            },
            {
                type: 'input',
                name: 'newSalary',
                message: 'What is the salary of the new role?',
            },
            {
                type:'list',
                name: 'newDepartmentID',
                message: 'What is the new department?',
                choices: departmentName,
            }
        ])
        .then((data) => {
            for (i=0; i<departmentName.length; i++) {
                if (departmentName[i] == data.newDepartmentID) {
                    departmentID = i+1;
                }
            }
            db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${data.newRole}", "${data.newSalary}", ${departmentID})`);
            viewMenu();
        })
    })    
};

function addEmployee() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'newEmployee',
                message: 'What is the name of the new employee?',
            }
        ])
        .then((data) => {
            console.log(data.newEmployee);
        })
};

function updateRole() {

};

function viewMenu () {
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
            addDepartment();
        } else if (data.mainmenu == "Add a role") {
            addRole();
        } else if (data.mainmenu == "Add an employee") {
            addEmployee();
        } else if (data.mainmenu == "Update an employee role") {
            updateRole();
        }
    })
};

viewMenu();