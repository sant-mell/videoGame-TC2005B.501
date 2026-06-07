const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// serve the whole project so all scenes work over http
app.use(express.static(path.join(__dirname, ".."))); // makes the parent directory be available for localhost

// run with "pm2 start server.js" to auto-restart on crash
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "fools_descent",
    waitForConnections: true,
    connectionLimit: 10
});

db.getConnection((err, connection) => {
    if (err) {
        console.log("MySQL connection failed:", err.message);
        return;
    }
    console.log("Connected to MySQL");
    connection.release();
});

app.post("/register", (req, res) => {

    const fullName = req.body.fullName;
    const username = req.body.username;
    const password = req.body.password;
    const age = req.body.age;
    const gender = req.body.gender;

    const sql = `
        INSERT INTO Player
        (full_name, username, password, age, gender)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(

        sql,

        [fullName, username, password, age, gender],

        (err, result) => {

            if (err) {

                console.log(err);

                res.json({
                    success: false
                });

            } else {

                res.json({
                    success: true
                });

            }

        }

    );

});

app.post("/login", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    const sql = `
        SELECT * FROM Player
        WHERE username = ? AND password = ?
    `;

    db.query(sql, [username, password], (err, result) => {

        if (err) {

            console.log(err);

            res.json({
                success: false
            });

            return;

        }

        if (result.length > 0) {

            res.json({
                success: true,
                userId: result[0].user_id
            });

        } else {

            res.json({
                success: false
            });

        }

    });

});

app.post("/new-descent", (req, res) => {

    const userId = req.body.userId;
    const mapData = JSON.stringify(req.body.mapData);

    const sql = `
        INSERT INTO Game_saveState (user_id, current_coins, map_data)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE
            map_data = VALUES(map_data),
            saved_time = CURRENT_TIMESTAMP
    `;

    db.query(sql, [userId, 0, mapData], (err, result) => {

        if (err) {

            console.log(err);

            res.json({
                success: false
            });

            return;

        }

        res.json({
            success: true
        });

    });

});

app.post("/save-progress", (req, res) => {

    const userId = req.body.userId;
    const currentCoins = req.body.currentCoins;
    const mapData = JSON.stringify(req.body.mapData);

    const sql = `
        INSERT INTO Game_saveState (user_id, current_coins, map_data)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE
            current_coins = VALUES(current_coins),
            map_data = VALUES(map_data),
            saved_time = CURRENT_TIMESTAMP
    `;

    db.query(sql, [userId, currentCoins, mapData], (err, result) => {

        if (err) {

            console.log(err);

            res.json({
                success: false
            });

            return;

        }

        res.json({
            success: true
        });

    });

});

app.post("/load-game", (req, res) => {

    const userId = req.body.userId;

    const sql = `
        SELECT *
        FROM Game_saveState
        WHERE user_id = ?
    `;

    db.query(sql, [userId], (err, result) => {

        if (err) {

            console.log(err);

            res.json({
                success: false
            });

            return;

        }

        if (result.length > 0) {

            res.json({
                success: true,
                saveData: {
                    currentCoins: result[0].current_coins,
                    mapData: result[0].map_data
                }
            });

        } else {

            res.json({
                success: false
            });

        }

    });

});

app.post("/delete-save", (req, res) => {

    const userId = req.body.userId;

    const sql = `
        DELETE FROM Game_saveState
        WHERE user_id = ?
    `;

    db.query(sql, [userId], (err, result) => {

        if (err) {

            console.log(err);

            res.json({
                success: false
            });

            return;

        }

        res.json({
            success: true
        });

    });

});

app.listen(3000, () => {

    console.log("Server running on port 3000");

});