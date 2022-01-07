DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS employee_role;
DROP TABLE IF EXISTS employee;

CREATE TABLE department (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    branch VARCHAR(30) NOT NULL
);

CREATE TABLE employee_role (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    dept_id INTEGER,
    CONSTRAINT fk_department FOREIGN KEY (dept_id) REFERENCES department(id) ON DELETE CASCADE
);   

CREATE TABLE employee (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER,
    manager_id INTEGER, 
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES employee_role(id) ON DELETE SET NULL
   
    

);