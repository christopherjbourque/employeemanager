-- Select database

USE emDB;



-- Seed department table with department data

INSERT INTO department (department_id, name)
VALUES (1, "Agency Management");

INSERT INTO department (department_id, name)
VALUES (2, "Account Services");

INSERT INTO department (department_id, name)
VALUES (3, "Account Planning");

INSERT INTO department (department_id, name)
VALUES (4, "Media");

INSERT INTO department (department_id, name)
VALUES (5, "Creative Services");

INSERT INTO department (department_id, name)
VALUES (6, "Production");



-- Seed role table with role data

  -- Role 1
INSERT INTO role (role_id, title, salary, department_id)
VALUES (1, "CEO", 150000, 1);

  -- Role 2
INSERT INTO role (role_id, title, salary, department_id)
VALUES (2, "VP, Account Services", 100000, 2);

  -- Role 3
INSERT INTO role (role_id, title, salary, department_id)
VALUES (3, "Account Manager", 75000, 2);

  -- Role 4
INSERT INTO role (role_id, title, salary, department_id)
VALUES (4, "VP, Media", 100000, 3);

  -- Role 5
INSERT INTO role (role_id, title, salary, department_id)
VALUES (5, "Media Director", 75000, 3);

  -- Role 6
INSERT INTO role (role_id, title, salary, department_id)
VALUES (6, "VP, Creative Services", 100000, 4);

  -- Role 7
INSERT INTO role (role_id, title, salary, department_id)
VALUES (7, "Writer", 70000, 4);

  -- Role 8
INSERT INTO role (role_id, title, salary, department_id)
VALUES (8, "VP, Production", 100000, 5);

  -- Role 9
INSERT INTO role (role_id, title, salary, department_id)
VALUES (9, "Photography Director", 70000, 5);




INSERT INTO employee (employee_id, first_name, last_name, role_id, department_id, manager_id)
VALUES (1, "Richard", "Hendricks", 1, null);

INSERT INTO employee (employee_id, first_name, last_name, role_id, manager_id)
VALUES (2, "Erlich", "Bachman", 2, 1);

INSERT INTO employee (employee_id, first_name, last_name, role_id, manager_id)
VALUES (3, "Jian", "Yang", 2, 2);

INSERT INTO employee (employee_id, first_name, last_name, role_id, manager_id)
VALUES (4, "Bertram", "Gilfoyle", 3, 1);

INSERT INTO employee (employee_id, first_name, last_name, role_id, manager_id)
VALUES (5, "Dinesh", "Chugtai", 3, 3);

INSERT INTO employee (employee_id, first_name, last_name, role_id, manager_id)
VALUES (6, "Peter", "Gregory", 4, 1);

INSERT INTO employee (employee_id, first_name, last_name, role_id, manager_id)
VALUES (7, "Monica", "Hall", 4, 4);

INSERT INTO employee (employee_id, first_name, last_name, role_id, manager_id)
VALUES (8, "Gavin", "Belson", 5, 1);

INSERT INTO employee (employee_id, first_name, last_name, role_id, manager_id)
VALUES (9, "Jared", "Dunn", 5, 5);