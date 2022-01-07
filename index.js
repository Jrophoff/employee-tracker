// dependencies
const inquirer = require('inquirer');
const db = require('./db/connection');

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

// inquire prompt
const beginPrompt = () => {
  return inquirer
    .prompt([
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
        ],
      },
    ])
    .then((answer) => {
      var option = answer.option;
      switch (option) {
        case 'View All Employees':
          viewAllEmployees().then(([data]) => {
            console.table(data);
            beginPrompt();
          });
          break;
        case 'Add Employee':
          addEmployee();
          break;
        case 'Update Employee Role':
          updateEmployeeRole();
          break;
        case 'View All Roles':
          viewAllRoles().then(([data]) => {
            console.table(data);
            beginPrompt();
          });
          break;
        case 'Add Role':
          addRole();
          break;
        case 'View All Departments':
          viewAllDepartments().then(([data]) => {
            console.table(data);
            beginPrompt();
          });
          break;
        case 'Add Department':
          addDepartment();
          break;
      }
    });
};

// view all employees
function viewAllEmployees() {
  return db.promise()
    .query(`SELECT employee.id, employee.first_name, employee.last_name, employee_role.title, employee_role.salary, department.branch, 
                CONCAT (m.first_name, ' ', m.last_name) AS manager
                FROM employee
                JOIN employee_role
                ON employee.role_id = employee_role.id
                JOIN department
                ON department.id = employee_role.dept_id
                LEFT JOIN employee m ON m.id = employee.manager_id`);
}

// view all departments
function viewAllDepartments() {
  return db.promise().query(`SELECT * FROM department`);
}

// view all roles
function viewAllRoles() {
  return db.promise()
    .query(`SELECT employee_role.id, employee_role.title, department.branch, employee_role.salary  
                FROM employee_role 
                JOIN department 
                ON employee_role.dept_id = department.id`);
}

// add department
async function addDepartment() {
  try {
    var answers = await inquirer
      .prompt([
        {
          type: 'input',
          name: 'departmentName',
          message: 'What is the name of the department? (required)',
          validate: (departmentNameInput) => {
            if (departmentNameInput) {
              return true;
            } else {
              console.log('Please enter the department name!');
              return false;
            }
          },
        },
      ])
      .then(function (res) {
        db.query(
          'INSERT INTO department SET ?',
          {
            branch: res.departmentName,
          },
          function (err) {
            if (err) throw err;
            beginPrompt();
          }
        );
      });
  } catch (error) {
    console.log('Department Not Added!');
  }
}

// add role

async function addRole() {
  try {
    const [data] = await viewAllDepartments();

    const object = data.map((data) => data.id + ' ' + data.branch);

    var answers = await inquirer
      .prompt([
        {
          type: 'input',
          name: 'roleName',
          message: 'What is the name of this role? (required)',
          validate: (roleNameInput) => {
            if (roleNameInput) {
              return true;
            } else {
              console.log('Please enter the role name!');
              return false;
            }
          },
        },

        {
          type: 'input',
          name: 'roleSalary',
          message: 'What is the salary for this role? (required)',
          validate: (roleSalaryInput) => {
            if (roleSalaryInput) {
              return true;
            } else {
              console.log('Please enter the role salary!');
              return false;
            }
          },
        },
        {
          type: 'list',
          name: 'deptRole',
          message: 'What department does this role belong to?',
          choices: object,
        },
      ])
      .then(function (res) {
        const deptData = res.deptRole;
        deptId = deptData.split(' ');
        db.query(
          'INSERT INTO employee_role SET ?',
          {
            title: res.roleName,
            salary: res.roleSalary,
            dept_id: deptId[0],
          },

          function (err) {
            if (err) throw err;
            beginPrompt();
          }
        );
      });
  } catch (error) {
    console.log('Error! Role not added!');
  }
}

// update role
async function updateEmployeeRole() {
  try {
    const [employeeData] = await viewAllEmployees();
    const [roleData] = await viewAllRoles();

    const employeeObj = employeeData.map(
      (employeeData) => employeeData.id + ' ' + employeeData.first_name + ' ' + employeeData.last_name
    );
    const roleObj = roleData.map((roleData) => roleData.id + ' ' + roleData.title);
console.log(roleData)
    var answers = await inquirer
      .prompt([
        {
          type: 'list',
          name: 'employee',
          message: "Which employee's role do you want to update?",
          choices: employeeObj,
        },
        {
          type: 'list',
          name: 'role',
          message: 'Which role do you want to assign to the selected employee?',
          choices: roleObj,
        },
      ])
      .then(function (res) {
        const employeeData = res.employee;
        employeeId = employeeData.split(' ');
        const roleData = res.role;
        roleId = roleData.split(' ');
        db.query(
          'UPDATE employee SET ? WHERE ?',
          [
            {
            role_id: roleId[0],
          },
          {
            id: employeeId[0],
          },
        ],

          function (err) {
            if (err) throw err;
            beginPrompt();
          }
        );
      });
  } catch (error) {
    console.log('Error! Role not updated!');
    beginPrompt();
  }
}

// add employee
async function addEmployee() {
  try {
    const [roleData] = await viewAllRoles();
    const [employeeData] = await viewAllEmployees();

    const titleObj = roleData.map((roleData) => roleData.id + ' ' + roleData.title);
    const managerObj = employeeData.map(
      (employeeData) => employeeData.id + ' ' + employeeData.first_name + ' ' + employeeData.last_name
    );
    managerObj.push('0 none');

    var answers = await inquirer
      .prompt([
        {
          type: 'input',
          name: 'firstName',
          message: "What is the employee's first name? (required)",
          validate: (firstNameInput) => {
            if (firstNameInput) {
              return true;
            } else {
              console.log("Please enter the employee's first name!");
              return false;
            }
          },
        },
        {
          type: 'input',
          name: 'lastName',
          message: "What is the employee's last name? (required)",
          validate: (lastNameInput) => {
            if (lastNameInput) {
              return true;
            } else {
              console.log("Please enter the employee's last name!");
              return false;
            }
          },
        },
        {
          type: 'list',
          name: 'deptRole',
          message: 'What title goes with thie role?',
          choices: titleObj,
        },
        {
          type: 'list',
          name: 'manager',
          message: "Who is the employee's manager?",
          choices: managerObj,
        },
      ])
      .then(function (res) {
        const roleData = res.deptRole;
        roleId = roleData.split(' ');
        const managerData = res.manager;
        managerId = managerData.split(' ');

        db.query(
          'INSERT INTO employee SET ?',
          {
            first_name: res.firstName,
            last_name: res.lastName,
            role_id: roleId[0],
            manager_id: managerId[0],
          },
          function (err) {
            if (err) throw err;
            beginPrompt();
          }
        );
      });
  } catch (error) {
    console.log('Error! Employee not added!');
    beginPrompt();
  }
}

beginPrompt();
