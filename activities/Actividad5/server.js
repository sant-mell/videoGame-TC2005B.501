const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.static("."));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "catcafe"
});

db.connect((err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log("Connected to MySQL");
    }
});

app.get("/menu/:dia", (req, res) => {
    const dia = req.params.dia;
    const sql = `
        SELECT menu.*
        FROM menu
        JOIN dias
        ON menu.dia_id = dias.id
        WHERE dias.nombre = ?
    `;
    db.query(sql, [dia], (err, results) => {
        if(err){
            res.send(err);
        }
        else{
            res.json(results);
        }
    });
});

app.get("/gatos", (req, res) => {
    db.query(
        "SELECT * FROM gatos",
        (err, results) => {
            if(err){
                res.send(err);
            }
            else{
                res.json(results);
            }
        }
    );
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});