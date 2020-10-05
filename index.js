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

connection.connect((error) => {
    if (error) throw error;
    console.log(`Connected as ${connection.threadId}`);
});