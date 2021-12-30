// dependencies
const inquirer = require('inquirer');
var Table = require('easy-table')
const db = require('./db/connection')

// inquire prompt
const beginPrompt = () => {

    console.log(`

    ______   ______   ______   ______   ______   ______   ______   ______   ______ 
   |______| |______| |______| |______| |______| |______| |______| |______| |______|
    _         ______                       _                                     _ 
   | |       |  ____|                     | |                                   | |
   | |       | |__     _ __ ___    _ __   | |   ___    _   _    ___    ___      | |
   | |       |  __|   | '_ ' _ |  | '_ |  | |  / _ |  | | | |  / _ |  / _ |     | |
   | |       | |____  | | | | | | | |_) | | | | (_) | | |_| | |  __/ |  __/     | |
   | |       |______| |_| |_| |_| | .__/  |_|  |___/   |__, |  |___|  |___|     | |
   | |                            | |                   __/ |                   | |
   |_|                            |_|                  |___/                    |_|
    _         __  __                                                             _ 
   | |       |  |/  |                                                           | |
   | |       | |  / |   __ _   _ __     __ _    __ _    ___   _ __              | |
   | |       | ||/| |  / _' | | '_ |   / _' |  / _' |  / _ | | '__|             | |
   | |       | |  | | | (_| | | | | | | (_| | | (_| | |  __/ | |                | |
   | |       |_|  |_|  |__,_| |_| |_|  |__,_|  |__, |  |___| |_|                | |
   | |                                          __/ |                           | |
   |_|                                         |___/                            |_|
    ______   ______   ______   ______   ______   ______   ______   ______   ______ 
   |______| |______| |______| |______| |______| |______| |______| |______| |______|
                                                                                                                                                          
   
   
   
   `);
    return inquirer.prompt([
        {
            type: 'list',
            name: 'option',
            message: 'What would you like to do?',
            choices: [
                'View All Employees',
                'Add Employee',
                'Update Employee Role',
                'View All Roles',
                'Add Role',
                'View All Departments',
                'Add Department',
                'Quit'
            ]
        },
    ]).then(answer => {
        var option = answer.option;
        switch (option) {
            case 'View All Employees':
                viewAllEmployees();
                break;
            // case 'Add Employee':
            //     addEmployee();
            //     break;
            // case 'Update Employee Role':
            //     updateEmployeeRole();
            //     break;
            case 'View All Roles':
                viewAllRoles();
                break;
            // case 'Add Role':
            //     addRole();
            //     break;
            case 'View All Departments':
                viewAllDepartments();
                break;
            // case 'Add Department':
            //     addDepartment();
            //     break            
            // case 'Quit':
            //     quit();
            //     break;
        }
    })
}

// view all employees
function viewAllEmployees() {
    db.query('SELECT * FROM employee', function (err, data) {
        if (err) throw err;
        var t = new Table
        data.forEach(function (employee) {
            t.cell('ID', employee.id)
            t.cell('First name', employee.first_name)
            t.cell('Last name', employee.last_name)
            t.newRow()
        })
        console.log(t.toString());
    })

}

// view all departments
function viewAllDepartments() {
    db.query('SELECT * FROM department', function (err, data) {
        if (err) throw err;
        var t = new Table
        data.forEach(function (department) {
            t.cell('ID', department.id)
            t.cell('Department Branch', department.branch)
            t.newRow()
        })
        console.log(t.toString())
    })
}

// view all roles
function viewAllRoles() {
    db.query(`SELECT employee_role.*, department.branch 
                FROM employee_role 
                JOIN department 
                ON employee_role.department_id = department.id`, 
                function (err, data) {
        if (err) throw err;
        var t = new Table
        data.forEach(function (employee_role) {
            t.cell('ID', employee_role.id)
            t.cell('Title', employee_role.title)
            t.cell('Department', employee_role.branch)
            t.cell('Salary', employee_role.salary)
            t.newRow()
        })
        console.log(t.toString())
    })
}
beginPrompt();




