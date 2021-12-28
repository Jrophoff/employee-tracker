DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS employee_role;
DROP TABLE IF EXISTS employee;

CREATE TABLE department (
    department_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(30) NOT NULL
);

CREATE TABLE employee_role (
    employee_role_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL
);   

CREATE TABLE employee (
    employee_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER
);