// Add third-part packages
const mysql = require("mysql");
// const inquirer = require("inquirer");
// const cTable = require("console.table");



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

    connection.query(`SELECT * FROM employees`, function(error, rows) {
        if (error) throw error;
        console.log(rows);        
    });
});