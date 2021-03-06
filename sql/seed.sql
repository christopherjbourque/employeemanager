-- Select database

USE emDB;



-- Seed department table with department data

INSERT INTO departments (id, name)
VALUES (1, "Agency Management");

INSERT INTO departments (id, name)
VALUES (2, "Account Services");

INSERT INTO departments (id, name)
VALUES (3, "Account Planning");

INSERT INTO departments (id, name)
VALUES (4, "Media");

INSERT INTO departments (id, name)
VALUES (5, "Creative Services");

INSERT INTO departments (id, name)
VALUES (6, "Production");



-- Seed role table with role data

  -- Role 1
INSERT INTO roles (id, title, salary, department_id)
VALUES (1, "CEO", 150000, 1);

  -- Role 2
INSERT INTO roles (id, title, salary, department_id)
VALUES (2, "VP, Account Services", 100000, 2);

  -- Role 3
INSERT INTO roles (id, title, salary, department_id)
VALUES (3, "Account Manager", 75000, 2);

  -- Role 4
INSERT INTO roles (id, title, salary, department_id)
VALUES (4, "VP, Media", 100000, 3);

  -- Role 5
INSERT INTO roles (id, title, salary, department_id)
VALUES (5, "Media Director", 75000, 3);

  -- Role 6
INSERT INTO roles (id, title, salary, department_id)
VALUES (6, "VP, Creative Services", 100000, 4);

  -- Role 7
INSERT INTO roles (id, title, salary, department_id)
VALUES (7, "Writer", 70000, 4);

  -- Role 8
INSERT INTO roles (id, title, salary, department_id)
VALUES (8, "VP, Production", 100000, 5);

  -- Role 9
INSERT INTO roles (id, title, salary, department_id)
VALUES (9, "Photography Director", 70000, 5);




INSERT INTO employees (id, first_name, last_name, role_id, is_manager, manager_id)
VALUES (1, "Richard", "Hendricks", 1, 1, null);

INSERT INTO employees (id, first_name, last_name, role_id, is_manager, manager_id)
VALUES (2, "Erlich", "Bachman", 2, 1, 1);

INSERT INTO employees (id, first_name, last_name, role_id, is_manager, manager_id)
VALUES (3, "Jian", "Yang", 3, 0, 2);

INSERT INTO employees (id, first_name, last_name, role_id, is_manager, manager_id)
VALUES (4, "Bertram", "Gilfoyle", 4, 1, 1);

INSERT INTO employees (id, first_name, last_name, role_id, is_manager, manager_id)
VALUES (5, "Dinesh", "Chugtai", 5, 0, 3);

INSERT INTO employees (id, first_name, last_name, role_id, is_manager, manager_id)
VALUES (6, "Peter", "Gregory", 6, 1, 1);

INSERT INTO employees (id, first_name, last_name, role_id, is_manager, manager_id)
VALUES (7, "Monica", "Hall", 7, 0, 4);

INSERT INTO employees (id, first_name, last_name, role_id, is_manager, manager_id)
VALUES (8, "Gavin", "Belson", 8, 1, 1);

INSERT INTO employees (id, first_name, last_name, role_id, is_manager, manager_id)
VALUES (9, "Jared", "Dunn", 9, 0, 5);