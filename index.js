// Add third-part packages

const mysql = require("mysql");
const cTable = require("console.table");
const inquirer = require("inquirer");



// Establish connection to database

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "DBpassword",
    database: "emDB"
});

connection.connect(function(error) {
    if (error) throw error;

    console.log(`State: ${connection.state}`);
    console.log(`Thread: ${connection.threadId}`);
    task()

    // connection.query(`SELECT * FROM employees`, function(error, rows) {
    //     if (error) throw error;
    //     console.log(rows);        
    // });
});




function viewDepartments() {
    console.log(`You selected View Departments`)
}

function viewRoles() {
    console.log(`You selected View Roles`)
}

function viewEmployees() {
    console.log(`You selected View Employees`)
}

function addDepartment() {
    console.log(`You selected Add Department`)
}

function addRole() {
    console.log(`You selected Add Role`)
}

function addEmployee() {
    console.log(`You selected Add Employee`)
}

function updateDepartment() {
    console.log(`You selected Update Department`)
}

function updateRole() {
    console.log(`You selected Update Role`)
}

function updateEmployee() {
    console.log(`You selected Update Employee`)
}


function view() {

    console.log(`You selected view`)

    inquirer
        .prompt({
            type: "list",
            name: "taskView",
            message: "What would you like to view?",
            choices: [
                "Departments",
                "Roles",
                "Employees",
                "< Go Back",
                "* Exit"
            ]
        })
        .then (function({ taskView }) {
            switch (taskView) {
                case "Departments":
                    viewDepartments();
                    break;
                case "Roles":
                    viewRoles();
                    break;
                case "Employees":
                    viewEmployees();
                    break;
                case "< Go Back":
                    task();
                    break;
                default:
                    exit();
            }
        });
}

function add() {

    console.log(`You selected add`)

    inquirer
        .prompt({
            type: "list",
            name: "taskAdd",
            message: "What would you like to add?",
            choices: [
                "Department",
                "Role",
                "Employee",
                "< Go Back",
                "* Exit"
            ]
        })
        .then (function({ taskAdd }) {
            switch (taskAdd) {
                case "Department":
                    addDepartment();
                    break;
                case "Role":
                    addRole();
                    break;
                case "Employee":
                    addEmployee();
                    break;
                case "< Go Back":
                    task();
                    break;
                default:
                    exit();
            }
        });
}

function update() {

    console.log(`You selected update`)

    inquirer
        .prompt({
            type: "list",
            name: "taskUpdate",
            message: "What would you like to update?",
            choices: [
                "Department",
                "Role",
                "Employee",
                "< Go Back",
                "* Exit"
            ]
        })
        .then (function({ taskUpdate }) {
            switch (taskUpdate) {
                case "Department":
                    updateDepartment();
                    break;
                case "Role":
                    updateRole();
                    break;
                case "Employee":
                    updateEmployee();
                    break;
                case "< Go Back":
                    task();
                    break;
                default:
                    exit();
            }
        });
}

function exit() {
    console.log(`You selected Exit`)
    connection.end();
}


// Launch Inquirer

function task() {
    
    inquirer
        .prompt({
            type: "list",
            name: "task",
            message: "What task would you like to perform?",
            choices: [
                "View",
                "Add",
                "Update",
                "* Exit"
            ]
        })
        .then (function({ task }) {
            switch (task) {
                case "View":
                    view();
                    break;
                case "Add":
                    add();
                    break;
                case "Update":
                    update();
                    break;
                default:
                    exit();
            }
        });
}