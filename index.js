// Contents

// 1. Add third-party packages (line 15)
// 2. Establish database connection (line 23)
// 3. Launch inquirer (line 44)
// 4. View functions (lines 83-357)
// 5. Add functions (lines 361-572)
// 6. Update functions (lines 575-)
// 7. Delete functions (lines -)
// 8. Exit functions (lines -)




// Add Third-Party Packages

const mysql = require("mysql");
const cTable = require("console.table");
const inquirer = require("inquirer");




// Establish Database Connection

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
                        "Delete",
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
                case "Delete":
                    remove();
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

    const queryEmployees = `SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name AS department, e.is_manager, CONCAT(m.first_name, ' ', m.last_name) AS manager
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
        console.log("********** ALL EMPLOYEES **********");
        console.log(" ");
        console.table(response);

        task()
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

    const queryDepartments = `SELECT * FROM departments`

    connection.query(queryDepartments, function(error, response) {
        if (error) throw error;

        const departments = response.map(departments => ({
            name: departments.name,
            value: {name: departments.name, id: departments.id}
          }));

        inquirer
            .prompt(
                [
                    {
                        type: "input",
                        name: "newRole",
                        message: "What is the name of the new role?"
                    },
                    {
                        type: "input",
                        name: "newSalary",
                        message: "What is the salary for the new role?"
                    },
                    {
                        type: "list",
                        name: "department",
                        message: "What would you like to view?",
                        choices: departments
                    }
                ]
            )
            .then (function({ newRole, newSalary, department }) {

                const insertRole = `INSERT INTO roles (title, salary, department_id) VALUES ("${newRole}", "${newSalary}", "${department.id}")`;

                connection.query(insertRole, function(error, response) {
                    if (error) throw error;
                    console.log(" ");
                    console.log(" ");
                    console.log(" ");
                    console.log("One record inserted into the roles table");
                    console.log(" ");
                    console.log(" ");
                
                    viewRoles()
                    task()
                });
            });
    });
}

function addEmployee() {
    
    const queryRoles = `SELECT * FROM roles`

    connection.query(queryRoles, function(error, response) {
        if (error) throw error;

        const roles = response.map(roles => ({
            name: roles.title,
            value: {title: roles.title, id: roles.id}
          }));

        const queryManagers = `SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS name, e.is_manager
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
                            type: "input",
                            name: "employeeFirstName",
                            message: "What is the new employee's first name?"
                        },
                        {
                            type: "input",
                            name: "employeeLastName",
                            message: "What is the new employee's last name?"
                        },
                        {
                            type: "list",
                            name: "role",
                            message: "What is the employee's role?",
                            choices: roles
                        },
                        {
                            type: "confirm",
                            name: "employeeManagerStatus",
                            message: "Is the new employee a manager?",
                        },
                        {
                            type: "list",
                            name: "manager",
                            message: "Who is the employee's manager?",
                            choices: managers
                        }
                    ]
                )
                .then (function({ employeeFirstName, employeeLastName, role, employeeManagerStatus, manager }) {

                    if (employeeManagerStatus === true) {
                        managerStatus = 1
                    } else {
                        managerStatus = 0
                    }

                    console.log(`You inserted ${employeeFirstName} ${employeeLastName} as a ${role.title}: ${employeeManagerStatus} whose manager is ${manager.name}`);

                    const insertEmployee = `INSERT INTO employees (first_name, last_name, role_id, is_manager, manager_id)
                        VALUES ("${employeeFirstName}", "${employeeLastName}", "${role.id}", "${managerStatus}", "${manager.id}")`;

                    connection.query(insertEmployee, function(error, response) {
                        if (error) throw error;
                        console.log(" ");
                        console.log(" ");
                        console.log(" ");
                        console.log("One record inserted into the roles table");
                        console.log(" ");
                        console.log(" ");
                    
                        viewAllEmployees()
                        task()
                    });
            });

        });
    });
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
            name: "update",
            message: "What would you like to update?",
            choices: [
                "Department",
                "Role",
                "Employee",
                "< Go Back",
                "* Exit"
            ]
        })
        .then (function({ update }) {
            switch (update) {
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
    console.log(`The update department feature is in development`);
    console.log(" ");
    console.log(" ");
    task()
}

function updateRole() {
    console.log(" ");
    console.log(" ");
    console.log(`The update department feature is in development`);
    console.log(" ");
    console.log(" ");
    task()
}

function updateEmployee() {
    
    console.log(" ");
    console.log(" ");
    console.log(`You selected Update Employee`);
    console.log(" ");
    console.log(" ");

    inquirer
        .prompt({
            type: "list",
            name: "update",
            message: "What would you like to update?",
            choices: [
                "Employee's First Name",
                "Employee's Last Name",
                "Employee's Role",
                "Employee's Manager Status",
                "Employee's Manager",
                "< Go Back",
                "* Exit"
            ]
        })
        .then (function({ update }) {
            switch (update) {
                case "Employee's First Name":
                    updateEmployeeFirstName();
                    break;
                case "Employee's Last Name":
                    updateEmployeeLastName();
                    break;
                case "Employee's Role":
                    updateEmployeeRole();
                    break;
                case "Employee's Manager Status":
                    updateEmployeeManagerStatus();
                    break;
                case "Employee's Manager":
                    updateEmployeeManager();
                    break;
                case "< Go Back":
                    task();
                    break;
                default:
                    exit();
            }
        });
}

function updateEmployeeFirstName() {

    const queryEmployees = `SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name AS department, e.is_manager, CONCAT(m.first_name, ' ', m.last_name) AS manager
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
        console.log("********** ALL EMPLOYEES **********");
        console.log(" ");
        console.table(response);

        const queryEmployees = `SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS name FROM employees e`

        connection.query(queryEmployees, function(error, response) {
            if (error) throw error;

            const employees = response.map(employees => ({
                name: employees.name,
                value: {name: employees.name, id: employees.id}
            }));

            inquirer
                .prompt(
                    [
                        {
                            type: "list",
                            name: "employee",
                            message: "Whose first name do you want to update?",
                            choices: employees
                        },
                        {
                            type: "input",
                            name: "newFirstName",
                            message: "What do you want to update their first name to?",
                        }
                    ]
                )
                .then (function({ employee, newFirstName }) {

                    console.log(`You are changing ${employee.name}'s first name to ${newFirstName}"`);

                    const updateFirstName = `UPDATE employees
                        SET first_name = "${newFirstName}"
                        WHERE id = "${employee.id}"`;

                    connection.query(updateFirstName, function(error, response) {
                        if (error) throw error;
                        console.log(" ");
                        console.log(" ");
                        console.log("You updated one record in the employees table");
                        console.log(" ");
                        console.log(" ");

                        viewAllEmployees()
                        updateEmployee()
                    });
                });
        });
    });
}

function updateEmployeeLastName() {
    
    const queryEmployees = `SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name AS department, e.is_manager, CONCAT(m.first_name, ' ', m.last_name) AS manager
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
        console.log("********** ALL EMPLOYEES **********");
        console.log(" ");
        console.table(response);

        const queryEmployees = `SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS name FROM employees e`

        connection.query(queryEmployees, function(error, response) {
            if (error) throw error;

            const employees = response.map(employees => ({
                name: employees.name,
                value: {name: employees.name, id: employees.id}
            }));

            inquirer
                .prompt(
                    [
                        {
                            type: "list",
                            name: "employee",
                            message: "Whose last name do you want to update?",
                            choices: employees
                        },
                        {
                            type: "input",
                            name: "newLastName",
                            message: "What do you want to update their last name to?",
                        }
                    ]
                )
                .then (function({ employee, newLastName }) {

                    console.log(`You are changing ${employee.name}'s last name to ${newLastName}"`);

                    const updateLastName = `UPDATE employees
                        SET last_name = "${newLastName}"
                        WHERE id = "${employee.id}"`;

                    connection.query(updateLastName, function(error, response) {
                        if (error) throw error;
                        console.log(" ");
                        console.log(" ");
                        console.log("You updated one record in the employees table");
                        console.log(" ");
                        console.log(" ");

                        viewAllEmployees()
                        updateEmployee()
                    });
                });
        });
    });
}

function updateEmployeeRole() {
    
    const queryRoles = `SELECT * FROM roles`

    connection.query(queryRoles, function(error, response) {
        if (error) throw error;

        const roles = response.map(roles => ({
            name: roles.title,
            value: {title: roles.title, id: roles.id}
          }));

            const queryEmployees = `SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name AS department, e.is_manager, CONCAT(m.first_name, ' ', m.last_name) AS manager
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
                console.log("********** ALL EMPLOYEES **********");
                console.log(" ");
                console.table(response);

                const queryEmployees = `SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS name FROM employees e`

                connection.query(queryEmployees, function(error, response) {
                    if (error) throw error;

                    const employees = response.map(employees => ({
                        name: employees.name,
                        value: {name: employees.name, id: employees.id}
                    }));

                    inquirer
            
                        .prompt(
                            [
                                {
                                    type: "list",
                                    name: "employee",
                                    message: "Whose role do you want to update?",
                                    choices: employees
                                },
                                {
                                    type: "list",
                                    name: "newRole",
                                    message: "What is the employee's new role?",
                                    choices: roles
                                },
                            ]
                        )
                        .then (function({ employee, newRole }) {

                            console.log(`You are changing ${employee.name}'s role name to ${newRole}`);

                            const updateLastName = `UPDATE employees
                                SET role_id = "${newRole.id}"
                                WHERE id = "${employee.id}"`;

                            connection.query(updateLastName, function(error, response) {
                                if (error) throw error;
                                console.log(" ");
                                console.log(" ");
                                console.log("You updated one record in the employees table");
                                console.log(" ");
                                console.log(" ");

                                viewAllEmployees()
                                updateEmployee()
                            });
                        });
                });
            });
    });
}

function updateEmployeeManagerStatus() {
    
    const queryEmployees = `SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name AS department, e.is_manager, CONCAT(m.first_name, ' ', m.last_name) AS manager
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
        console.log("********** ALL EMPLOYEES **********");
        console.log(" ");
        console.table(response);

        const queryEmployees = `SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS name FROM employees e`

        connection.query(queryEmployees, function(error, response) {
            if (error) throw error;

            const employees = response.map(employees => ({
                name: employees.name,
                value: {name: employees.name, id: employees.id}
            }));

            inquirer
                .prompt(
                    [
                        {
                            type: "list",
                            name: "employee",
                            message: "Whose manager status do you want to update?",
                            choices: employees
                        },
                        {
                            type: "confirm",
                            name: "newManagerStatus",
                            message: "Is the employee a manager now?",
                        }
                    ]
                )
                .then (function({ employee, newManagerStatus }) {

                    if (newManagerStatus === true) {
                        managerStatus = 1
                    } else {
                        managerStatus = 0
                    }

                    console.log(`You are changing ${employee.name}'s manager status to ${managerStatus}`);

                    const updateManagerStatus = `UPDATE employees
                        SET is_manager = "${managerStatus}"
                        WHERE id = "${employee.id}"`;

                    connection.query(updateManagerStatus, function(error, response) {
                        if (error) throw error;
                        console.log(" ");
                        console.log(" ");
                        console.log("You updated one record in the employees table");
                        console.log(" ");
                        console.log(" ");

                        viewAllEmployees()
                        updateEmployee()
                    });
                });
        });
    });
}

function updateEmployeeManager() {
    
    const queryManagers = `SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS name, e.is_manager
            FROM employees e
            WHERE is_manager = 1`

        connection.query(queryManagers, function(error, response) {
            if (error) throw error;

            const managers = response.map(managers => ({
                name: managers.name,
                value: {name: managers.name, id: managers.id}
            }));

            const queryEmployees = `SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name AS department, e.is_manager, CONCAT(m.first_name, ' ', m.last_name) AS manager
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
                console.log("********** ALL EMPLOYEES **********");
                console.log(" ");
                console.table(response);

                const queryEmployees = `SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS name FROM employees e`

                connection.query(queryEmployees, function(error, response) {
                    if (error) throw error;

                    const employees = response.map(employees => ({
                        name: employees.name,
                        value: {name: employees.name, id: employees.id}
                    }));

                    inquirer
            
                        .prompt(
                            [
                                {
                                    type: "list",
                                    name: "employee",
                                    message: "Whose manager do you want to update?",
                                    choices: employees
                                },
                                {
                                    type: "list",
                                    name: "newManager",
                                    message: "What is the employee's new manager?",
                                    choices: managers
                                },
                            ]
                        )
                        .then (function({ employee, newManager }) {

                            console.log(`You are changing ${employee.name}'s manager to ${newManager}`);

                            const updateLastName = `UPDATE employees
                                SET manager_id = "${newManager.id}"
                                WHERE id = "${employee.id}"`;

                            connection.query(updateLastName, function(error, response) {
                                if (error) throw error;
                                console.log(" ");
                                console.log(" ");
                                console.log("You updated one record in the employees table");
                                console.log(" ");
                                console.log(" ");

                                viewAllEmployees()
                                updateEmployee()
                            });
                        });
                });
            });
    });
}




// Remove functions

function remove() {

    inquirer
        .prompt(
            [
                {
                    type: "list",
                    name: "remove",
                    message: "What would you like to delete?",
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
        .then (function({ remove }) {
            switch (remove) {
                case "Department":
                    removeDepartment();
                    break;
                case "Role":
                    removeRole();
                    break;
                case "Employee":
                    removeEmployee();
                    break;
                case "< Go Back":
                    task();
                    break;
                default:
                    exit();
            }
        });
}

function removeDepartment() {
    
    console.log(" ");
    console.log(" ");
    console.log(`The delete department feature is in development`);
    console.log(" ");
    console.log(" ");
    task()
}

function removeRole() {
    
    console.log(" ");
    console.log(" ");
    console.log(`The delete role feature is in development`);
    console.log(" ");
    console.log(" ");
    task()
}

function removeEmployee() {
    
    const queryEmployees = `SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS name FROM employees e`

    connection.query(queryEmployees, function(error, response) {
        if (error) throw error;

        const employees = response.map(employees => ({
            name: employees.name,
            value: {name: employees.name, id: employees.id}
          }));

        inquirer
            .prompt(
                [
                    {
                        type: "list",
                        name: "employee",
                        message: "Which employee do you want to delete?",
                        choices: employees
                    }
                ]
            )
            .then (function({ employee }) {

                const deleteEmployee = `DELETE FROM employees WHERE id = "${employee.id}"`;

                connection.query(deleteEmployee, function(error, response) {
                    if (error) throw error;
                    console.log(" ");
                    console.log(" ");
                    console.log("One record deleted from employees table");
                    console.log(" ");
                    console.log(" ");
                
                    viewAllEmployees()
                    task()
                });
            });
    });

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