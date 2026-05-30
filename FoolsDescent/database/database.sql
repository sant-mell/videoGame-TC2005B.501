CREATE DATABASE fools_descent;

USE fools_descent;

CREATE TABLE users (

    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,

    full_name VARCHAR(100),

    username VARCHAR(50) UNIQUE,

    password VARCHAR(50),

    age INT,

    gender VARCHAR(20)

);

CREATE TABLE Game_saveState (

    user_id INT UNSIGNED NOT NULL PRIMARY KEY,

    current_coins INT NOT NULL DEFAULT 0,

    map_data JSON NOT NULL,

    saved_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_game_save_state_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE

);

USE fools_descent;
SELECT * FROM users;