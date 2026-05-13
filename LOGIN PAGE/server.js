const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

// parsers basicos para poder leer datos si luego se ocupan
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

// abrir la base de datos del proyecto
const db = new sqlite3.Database(path.join(__dirname, 'users.db'));

db.serialize(() => {
  // crear tabla si no existe
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
});

// pagina principal del login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'mainmenu.html'));
});

// pagina del menu despues de entrar
app.get('/menu', (req, res) => {
  res.sendFile(path.join(__dirname, 'menu.html'));
});

// revisar si el usuario existe y la contraseña es igual
app.get('/api/login', (req, res) => {
  const { username, password } = req.query || {};
  if (!username || !password) return res.json({ success: false, message: 'Missing credentials' });
  const stmt = `SELECT username FROM users WHERE username = ? AND password = ? LIMIT 1`;
  db.get(stmt, [username, password], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: 'DB error' });
    if (!row) return res.json({ success: false, message: 'Invalid username or password' });
    return res.json({ success: true, username: row.username });
  });
});

// guardar un usuario nuevo en la db
app.get('/api/create-account', (req, res) => {
  const { username, password, age, name, gender } = req.query || {};
  if (!username || !password) return res.json({ success: false, message: 'Missing username or password' });
  const stmt = `INSERT INTO users (username, password, age, name, gender) VALUES (?, ?, ?, ?, ?)`;
  db.run(stmt, [username, password, age || null, name || null, gender || null], function(err) {
    if (err) {
      if (err.code === 'SQLITE_CONSTRAINT') return res.json({ success: false, message: 'Username already exists' });
      return res.status(500).json({ success: false, message: err.message });
    }
    return res.json({ success: true, username });
  });
});

// sacar datos publicos del usuario sin password
app.get('/api/user', (req, res) => {
  const { username } = req.query || {};
  if (!username) return res.json({ success: false, message: 'Missing username' });

  const stmt = `SELECT id, username, age, name, gender FROM users WHERE username = ? LIMIT 1`;
  db.get(stmt, [username], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: 'DB error' });
    if (!row) return res.json({ success: false, message: 'User not found' });
    return res.json({ success: true, user: row });
  });
});

// prender el server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
