const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "..")));

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "fools_descent",
    waitForConnections: true,
    connectionLimit: 10
});

const db = pool.promise();

pool.getConnection((err, connection) => {
    if (err) {
        console.log("MySQL connection failed:", err.message);
        return;
    }
    console.log("Connected to MySQL");
    connection.release();
});

app.post("/register", async (req, res) => {

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

    try {
        await db.query(sql, [fullName, username, password, age, gender]);
        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }

});

app.post("/login", async (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    const sql = `
        SELECT user_id FROM Player
        WHERE username = ? AND password = ?
    `;

    try {
        const [rows] = await db.query(sql, [username, password]);
        if (rows.length > 0) {
            res.json({ success: true, userId: rows[0].user_id });
        } else {
            res.json({ success: false });
        }
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }

});

app.post("/new-descent", async (req, res) => {

    const userId = req.body.userId;
    const mapData = JSON.stringify(req.body.mapData);

    // a new descent resets the saved coins to 0
    const sql = `
        INSERT INTO Game_saveState (user_id, current_coins, map_data)
        VALUES (?, 0, ?)
        ON DUPLICATE KEY UPDATE
            current_coins = 0,
            map_data = VALUES(map_data),
            saved_time = CURRENT_TIMESTAMP
    `;

    try {
        await db.query(sql, [userId, mapData]);
        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }

});

app.post("/save-progress", async (req, res) => {

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

    try {
        await db.query(sql, [userId, currentCoins, mapData]);
        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }

});

app.post("/load-game", async (req, res) => {

    const userId = req.body.userId;

    const sql = `
        SELECT current_coins, map_data
        FROM Game_saveState
        WHERE user_id = ?
    `;

    try {
        const [rows] = await db.query(sql, [userId]);
        if (rows.length > 0) {
            res.json({
                success: true,
                saveData: {
                    currentCoins: rows[0].current_coins,
                    mapData: rows[0].map_data
                }
            });
        } else {
            res.json({ success: false });
        }
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }

});

app.post("/delete-save", async (req, res) => {

    const userId = req.body.userId;

    const sql = `
        DELETE FROM Game_saveState
        WHERE user_id = ?
    `;

    try {
        await db.query(sql, [userId]);
        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }

});

app.post("/duel-result", async (req, res) => {

    const userId = req.body.userId;
    const won = req.body.won;
    const enemyTier = req.body.enemyTier;
    const coinsGained = req.body.coinsGained;
    const cardsPlayed = req.body.cardsPlayed;
    const durationSec = req.body.durationSec;

    const tier = enemyTier === "boss" ? "legendary" : enemyTier;

    try {
        const [runs] = await db.query(
            `SELECT run_id FROM Current_Run
             WHERE user_id = ? AND result = 'ongoing'
             ORDER BY run_id DESC LIMIT 1`,
            [userId]
        );

        let runId;
        if (runs.length > 0) {
            runId = runs[0].run_id;
        } else {
            const [run] = await db.query(
                `INSERT INTO Current_Run (user_id, result) VALUES (?, 'ongoing')`,
                [userId]
            );
            runId = run.insertId;
        }

        const [enemies] = await db.query(
            `SELECT enemy_id FROM Enemy WHERE difficulty_tier = ? ORDER BY enemy_id LIMIT 1`,
            [tier]
        );
        const enemyId = enemies[0].enemy_id;

        await db.query(
            `INSERT INTO Run_Enemy_Encounters
             (run_id, enemy_id, defeated_successfully, coins_gained, cards_played, duration_sec)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [runId, enemyId, won ? 1 : 0, coinsGained, cardsPlayed, durationSec]
        );

        if (!won) {
            await db.query(
                `UPDATE Current_Run SET result = 'defeat', end_time = CURRENT_TIMESTAMP
                 WHERE run_id = ?`,
                [runId]
            );
        }

        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }

});

app.post("/stats/personal", async (req, res) => {

    const userId = req.body.userId;

    const sql = `
        SELECT * FROM v_personal_stats
        WHERE user_id = ?
    `;

    try {
        const [rows] = await db.query(sql, [userId]);
        if (rows.length > 0) {
            res.json({ success: true, stats: rows[0] });
        } else {
            res.json({ success: false });
        }
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }

});

app.get("/stats/global", async (req, res) => {

    const sql = `SELECT * FROM v_global_stats`;

    try {
        const [rows] = await db.query(sql);
        res.json({ success: true, stats: rows[0] });
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }

});

app.post("/duel-checkpoint", async (req, res) => {

    const userId = req.body.userId;
    const duelData = JSON.stringify(req.body.duelData);

    const sql = `
        INSERT INTO Game_saveState (user_id, current_coins, duel_data)
        VALUES (?, 0, ?)
        ON DUPLICATE KEY UPDATE
            duel_data = VALUES(duel_data),
            saved_time = CURRENT_TIMESTAMP
    `;

    try {
        await db.query(sql, [userId, duelData]);
        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }

});

app.get("/duel-checkpoint/:userId", async (req, res) => {

    const userId = req.params.userId;

    const sql = `
        SELECT duel_data FROM Game_saveState
        WHERE user_id = ?
    `;

    try {
        const [rows] = await db.query(sql, [userId]);
        if (rows.length > 0 && rows[0].duel_data) {
            res.json({ success: true, duelData: rows[0].duel_data });
        } else {
            res.json({ success: false });
        }
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }

});

app.post("/clear-duel-checkpoint", async (req, res) => {

    const userId = req.body.userId;

    const sql = `
        UPDATE Game_saveState
        SET duel_data = NULL
        WHERE user_id = ?
    `;

    try {
        await db.query(sql, [userId]);
        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }

});

app.get("/player-deck/:userId", async (req, res) => {

    const userId = req.params.userId;

    const sql = `SELECT card_id FROM Player_Deck WHERE user_id = ?`;

    try {
        const [rows] = await db.query(sql, [userId]);
        // card_id in DB is 1-based; JS card indices are 0-based
        res.json({ success: true, cards: rows.map(r => r.card_id - 1) });
    } catch (err) {
        console.log(err);
        res.json({ success: false, cards: [] });
    }

});

app.post("/player-deck", async (req, res) => {

    const { userId, cards } = req.body;

    try {
        await db.query(`DELETE FROM Player_Deck WHERE user_id = ?`, [userId]);
        if (cards && cards.length > 0) {
            const values = cards.map(c => [userId, c + 1]); // JS 0-based → DB 1-based
            await db.query(`INSERT INTO Player_Deck (user_id, card_id) VALUES ?`, [values]);
        }
        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }

});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
