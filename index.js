// Add Third-Party Packages

const mysql = require("mysql");
const cTable = require("console.table");
const inquirer = require("inquirer");



// Establish Connection to Database

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
});



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



// View Functions

function view() {

    console.log(" ");
    console.log(" ");
    console.log(`You selected view`);
    console.log(" ");
    console.log(" ");

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


function viewDepartments() {

    const queryDepartments = `SELECT * FROM departments`

    connection.query(queryDepartments, function(error, response) {
        if (error) throw error;
        console.log(" ");
        console.log(" ");
        console.log(" ");
        console.log("********** DEPARTMENTS **********");
        console.log(" ");
        console.table(response);

        task()
    });
}

function viewRoles() {

    const queryRoles = `SELECT * FROM roles`

    connection.query(queryRoles, function(error, response) {
        if (error) throw error;
        console.log(" ");
        console.log(" ");
        console.log(" ");
        console.log("********** ROLES **********");
        console.log(" ");
        console.table(response);
    
        task()
    });

}

function viewEmployees() {

    const queryEmployees =
    `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
        FROM employees e
        LEFT JOIN roles r
            ON e.role_id = r.id
        LEFT JOIN departments d
            ON d.id = r.department_id
        LEFT JOIN employees m
            ON m.id = e.manager_id`

    connection.query(queryEmployees, function (error, response) {
        if (error) throw error;
        console.log(" ");
        console.log(" ");
        console.log(" ");
        console.log("********** EMPLOYEES **********");
        console.log(" ");
        console.table(response);

        task();
    });
}



// Add Functions

function add() {

    console.log(" ");
    console.log(" ");
    console.log(`You selected add`)
    console.log(" ");
    console.log(" ");

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

function addDepartment() {
    
    console.log(" ");
    console.log(" ");
    console.log(`You selected Add Department`);
    console.log(" ");
    console.log(" ");

    inquirer
        .prompt({
            type: "input",
            name: "newDepartment",
            message: "What is the name of the department you want to add?",
        })
        .then (function({ newDepartment }) {
            console.log(" ");
            console.log(" ");
            console.log(`You added ${newDepartment} to the departments table`);
            console.log(" ");
            console.log(" ");

            const insertDepartment = `INSERT INTO departments (name) VALUES ('${newDepartment}')`;
            connection.query(insertDepartment, function(error, result) {
                if(error) throw error;
                console.log(`One record added: ${newDepartment}`);
            });
        });
};

function addRole() {
    console.log(" ");
    console.log(" ");
    console.log(`You selected Add Role`);
    console.log(" ");
    console.log(" ");
}

function addEmployee() {
    console.log(" ");
    console.log(" ");
    console.log(`You selected Add Employee`);
    console.log(" ");
    console.log(" ");
}



// Update Functions

function update() {

    console.log(" ");
    console.log(" ");
    console.log(`You selected update`)
    console.log(" ");
    console.log(" ");

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

function updateDepartment() {
    
    console.log(" ");
    console.log(" ");
    console.log(`You selected Update Department`);
    console.log(" ");
    console.log(" ");
}

function updateRole() {
    console.log(" ");
    console.log(" ");
    console.log(`You selected Update Role`);
    console.log(" ");
    console.log(" ");
}

function updateEmployee() {
    
    console.log(" ");
    console.log(" ");
    console.log(`You selected Update Employee`);
    console.log(" ");
    console.log(" ");
}



// Exit Function

function exit() {

    console.log(" ");
    console.log(" ");
    console.log(`You selected Exit`)
    console.log(" ");
    console.log(" ");

    connection.end();
}