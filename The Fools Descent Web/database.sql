CREATE DATABASE fools_descent;

USE fools_descent;

CREATE TABLE users (

    id INT AUTO_INCREMENT PRIMARY KEY,

    full_name VARCHAR(100),

    username VARCHAR(50) UNIQUE,

    password VARCHAR(50),

    age INT,

    gender VARCHAR(20)

);

USE fools_descent;
SELECT * FROM users;