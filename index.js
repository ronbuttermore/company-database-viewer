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
        viewMenu();
    });
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
    db.query('SELECT * FROM role', function (err, results) {
        var roleName = [];
        for (i=0; i<results.length; i++) {
            roleName.push(results[i].title);
        }
        db.query('SELECT * FROM employee', function (err, results) {
            var employeeName = [];
            for (i=0; i<results.length; i++) {
                employeeName.push(results[i].first_name + " " + results[i].last_name);
            } 
            inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'first_name',
                    message: 'What is the first name of the new employee?',
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: 'What is the last name of the new employee?',
                },
                {
                    type: 'list',
                    name: 'role',
                    message: `What is the employee's role?`,
                    choices: roleName,
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: `Who is the employee's manager?`,
                    choices: employeeName,
                }
            ])
            .then((data) => {
                var roleID;
                var employeeID;
                for (i=0; i<roleName.length; i++) {
                    if (roleName[i] == data.role) {
                        roleID = i+1;
                    }
                }
                for (i=0; i<employeeName.length; i++) {
                    if (employeeName[i] == data.manager) {
                        employeeID = i+1;
                    }
                }
                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${data.first_name}", "${data.last_name}", ${roleID}, ${employeeID})`);
                viewMenu();
                })
        })                      
    })
};

function updateRole() {
    db.query('SELECT * FROM employee', function (err, results) {
        var employeeList = [];
        for (i=0; i<results.length; i++) {
            employeeList.push(`${results[i].first_name} ${results[i].last_name}`)
        }
        inquirer
            .prompt([
                {
                    type:'list',
                    name: 'employees',
                    message: 'Which employee would you like to update?',
                    choices: employeeList,
                }
            ])
            .then((data) => {
                var employeeid;
                for (i=0; i<employeeList.length; i++) {
                    if (employeeList[i] == data.employees){
                    employeeid = i+1;
                    }
                }
                db.query('SELECT * FROM role', function (err, results) {
                    var employeerole = [];
                    for (i=0; i<results.length; i++){
                        employeerole.push(results[i].title);
                    }
                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                name: 'role',
                                message: 'What role would you like to assign to the selected employee?',
                                choices: employeerole,
                            }
                        ])
                        .then((data) => {
                            var roleid;
                            for (i=0; i<employeerole.length; i++){
                                if (employeerole[i] == data.role) {
                                    roleid = i+1;
                                }
                            }
                            db.query(`UPDATE employee SET role_id = ${roleid} WHERE id = ${employeeid}`);
                            viewMenu();
                        })
                })
            })
    })
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