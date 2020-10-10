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
        .prompt(
            [
                {
                    type: "list",
                    name: "task",
                    message: "What task would you like to perform?",
                    choices: [
                        "View",
                        "Add",
                        "Update",
                        "* Exit"
                    ]
                }
            ]
        )
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

    inquirer
        .prompt(
            [
                {
                    type: "list",
                    name: "view",
                    message: "What would you like to view?",
                    choices: [
                        "Departments",
                        "Roles",
                        "Employees",
                        "Managers",
                        "< Go Back",
                        "* Exit"
                    ]
                }
            ]
        )
        .then (function({ view }) {
            switch (view) {
                case "Departments":
                    viewDepartments();
                    break;
                case "Roles":
                    viewRoles();
                    break;
                case "Employees":
                    viewEmployees();
                    break;
                case "Managers":
                    viewManagers();
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

    const queryRoles = `SELECT r.id, r.title, r.salary, d.name AS department
        FROM roles r
        LEFT JOIN departments d
            ON d.id = r.department_id`

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

    inquirer
        .prompt(
            [
                {
                    type: "list",
                    name: "view",
                    message: "What would you like to view?",
                    choices: [
                        "All Employees",
                        "Employees by Department",
                        "Employees by Manager",
                        "< Go Back",
                        "* Exit"
                    ]
                }
            ]
        )
        .then (function({ view }) {
            switch (view) {
                case "All Employees":
                    viewAllEmployees();
                    break;
                case "Employees by Department":
                    viewEmployeesByDepartment();
                    break;
                case "Employees by Manager":
                    viewEmployeesByManager();
                    break;
                case "< Go Back":
                    viewEmployees();
                    break;
                default:
                    exit();
            }
        });
}

function viewAllEmployees() {

    const queryEmployees = `SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name AS department, CONCAT(m.first_name, ' ', m.last_name) AS manager
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
        console.log("********** ALL EMPLOYEES **********");
        console.log(" ");
        console.table(response);

        task();
    });
}

function viewEmployeesByDepartment() {

    const queryDepartments = `SELECT * FROM departments`

    connection.query(queryDepartments, function(error, response) {
        if (error) throw error;

        const departments = response.map(departments => ({
            name: departments.name,
            value: {name: departments.name, id: departments.id}
          }));

        console.log(departments);

        inquirer
            .prompt(
                [
                    {
                        type: "list",
                        name: "department",
                        message: "What would you like to view?",
                        choices: departments
                    }
                ]
            )
            .then (function({ department }) {

                const queryManagerEmployees = `SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name AS department, CONCAT(m.first_name, ' ', m.last_name) AS manager
                    FROM employees e
                    LEFT JOIN roles r
                        ON e.role_id = r.id
                    LEFT JOIN departments d
                        ON d.id = r.department_id
                    LEFT JOIN employees m
                        ON m.id = e.manager_id
                    WHERE d.id = ${department.id}`

                connection.query(queryManagerEmployees, function (error, response) {
                    if (error) throw error;
                    console.log(" ");
                    console.log(" ");
                    console.log(" ");
                    console.log(`********** ${department.name}'s EMPLOYEES **********`);
                    console.log(" ");
                    console.table(response);

                    task();
                });
            });

    });
}

function viewEmployeesByManager() {

    const queryManagers = `SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS name
        FROM employees e
        WHERE is_manager = 1`

    connection.query(queryManagers, function(error, response) {
        if (error) throw error;

        const managers = response.map(managers => ({
            name: managers.name,
            value: {name: managers.name, id: managers.id}
          }));

        inquirer
            .prompt(
                [
                    {
                        type: "list",
                        name: "manager",
                        message: "What would you like to view?",
                        choices: managers
                    }
                ]
            )
            .then (function({ manager }) {

                const queryManagerEmployees = `SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name AS department, CONCAT(m.first_name, ' ', m.last_name) AS manager
                    FROM employees e
                    LEFT JOIN roles r
                        ON e.role_id = r.id
                    LEFT JOIN departments d
                        ON d.id = r.department_id
                    LEFT JOIN employees m
                        ON m.id = e.manager_id
                    WHERE e.manager_id = ${manager.id}`

                connection.query(queryManagerEmployees, function (error, response) {
                    if (error) throw error;
                    console.log(" ");
                    console.log(" ");
                    console.log(" ");
                    console.log(`********** ${manager.name}.toUpperCase()'s EMPLOYEES **********`);
                    console.log(" ");
                    console.table(response);

                    task();
                });
            });

    });
}

function viewManagers() {

    const queryManagers = `SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS name, r.title, d.name AS department, e.is_manager
        FROM employees e
        LEFT JOIN roles r
            ON e.role_id = r.id
        LEFT JOIN departments d
            ON d.id = r.department_id
        WHERE is_manager = 1`

    connection.query(queryManagers, function(error, response) {
        if (error) throw error;
        console.log(" ");
        console.log(" ");
        console.log(" ");
        console.log("********** MANAGERS **********");
        console.log(" ");
        console.table(response);
    
        task()
    });
}


// Add Functions

function add() {

    inquirer
        .prompt(
            [
                {
                    type: "list",
                    name: "add",
                    message: "What would you like to add?",
                    choices: [
                        "Department",
                        "Role",
                        "Employee",
                        "< Go Back",
                        "* Exit"
                    ]
                }
            ]
        )
        .then (function({ add }) {
            switch (add) {
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

    inquirer
        .prompt(
            [
                {
                    type: "input",
                    name: "newDepartment",
                    message: "What is the name of the department you want to add?",
                }
            ]
        )
        .then (function({ newDepartment }) {
            console.log(" ");
            console.log(" ");
            console.log(`You added ${newDepartment} to the departments table`);
            console.log(" ");
            console.log(" ");

            const insertDepartment = `INSERT INTO departments (name) VALUES ('${newDepartment}')`;

            connection.query(insertDepartment, function(error, result) {
                if(error) throw error;
                console.log(`You added one record to the departments table: ${newDepartment}`);

                viewDepartments()
            });
        });
};

function addRole() {
    console.log(" ");
    console.log(" ");
    console.log(`You selected Add Role`);
    console.log(" ");
    console.log(" ");

    const queryDepartmentNames = `SELECT name FROM departments`

    console.log(queryDepartmentNames);

    inquirer

        .prompt(
            [
                {
                    type: "input",
                    name: "newRole",
                    message: "What is the title of the new role?"
                },
                {
                    type: "input",
                    name: "newSalary",
                    message: "What is the salary of the new role?",
                },
                {
                    type: "list",
                    name: "associatedDepartment",
                    message: "What departments is the role in?",
                    choices: [queryDepartmentNames]
                }
            ]
        )
        .then (function({ newRole, associatedDepartment }) {
            console.log(`You added one record to the roles table: ${newRole} with department ID ${associatedDepartment}`);
        });
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