const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({

    host: "localhost",
    user: "root",
    password: "1234",
    database: "fools_descent"

});

db.connect((err) => {

    if (err) {

        console.log(err);
        return;

    }

    console.log("Connected to MySQL");

});

app.post("/register", (req, res) => {

    const fullName = req.body.fullName;
    const username = req.body.username;
    const password = req.body.password;
    const age = req.body.age;
    const gender = req.body.gender;

    const sql = `
        INSERT INTO users
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
        SELECT * FROM users
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
                success: true
            });

        } else {

            res.json({
                success: false
            });

        }

    });

});

app.listen(3000, () => {

    console.log("Server running on port 3000");

});