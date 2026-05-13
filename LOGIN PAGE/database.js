const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// abrir el archivo de la base de datos
const db = new sqlite3.Database(path.join(__dirname, 'users.db'));

db.serialize(() => {
    // crear tabla si no esta hecha aun
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            age INT,
            name TEXT,
            gender TEXT
        )
    `);

    // usuario de prueba para entrar rapido
    db.run(`
        INSERT INTO users (username, password, age, name, gender)
        VALUES ('admin', '1234', 25, 'Pepe', 'Male')
    `, (err) => {
        if (err && err.code !== 'SQLITE_CONSTRAINT') {
            console.error(err.message);
        }
    });
});

db.close();