INSERT INTO department (department_name)
VALUES ("ENGINEERING"), 
       ("LEGAL"), 
       ("FINANCE"), 
       ("SALES");

INSERT INTO role (id, title, salary, department_id)
VALUES (1, "Sales Lead", 100000, 4),
       (2, "Salesperson", 80000, 4),
       (3, "Lead Engineer", 150000, 1),
       (4, "Software Engineer", 120000, 1),
       (5, "Account Manager", 160000, 3),
       (6, "Accountant", 125000, 3),
       (7, "Legal Team Lead", 250000, 2),
       (8, "Lawyer", 190000, 2);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, "John", "Doe", 1, NULL),
       (2, "Mike", "Chan", 2, 1),
       (3, "Ashley", "Rodriguez", 3, NULL),
       (4, "Kevin", "Tupik", 4, 3),
       (5, "Kunal", "Singh", 5, NULL),
       (6, "Malia", "Brown", 6, 5),
       (7, "Sarah", "Lourd", 7, NULL),
       (8, "Tom", "Allen", 8, 7);