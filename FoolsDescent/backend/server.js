// Developed with assistance from Claude Code (Anthropic)
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

    if (!fullName || !username || !password || !age || !gender) {
        return res.json({ success: false });
    }

    try {
        await db.query("CALL sp_register_player(?, ?, ?, ?, ?)", [fullName, username, password, age, gender]);
        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }

});

app.post("/login", async (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.json({ success: false });
    }

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
    if (!userId) { return res.json({ success: false }); }
    const mapData = JSON.stringify(req.body.mapData);

    try {
        await db.query("CALL sp_new_descent(?, ?)", [userId, mapData]);
        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }

});

app.post("/save-progress", async (req, res) => {

    const userId = req.body.userId;
    if (!userId) { return res.json({ success: false }); }
    const currentMapPosition = req.body.currentMapPosition || 0;
    const mapData = JSON.stringify(req.body.mapData);

    try {
        await db.query("CALL sp_save_progress(?, ?, ?)", [userId, currentMapPosition, mapData]);
        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }

});

app.post("/load-game", async (req, res) => {

    const userId = req.body.userId;

    try {
        const [data] = await db.query("CALL sp_load_game(?)", [userId]);
        const rows = data[0];
        if (rows.length > 0) {
            res.json({
                success: true,
                saveData: {
                    currentCoins: rows[0].current_coins,
                    currentMapPosition: rows[0].current_map_position,
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

    try {
        await db.query("CALL sp_delete_save(?)", [userId]);
        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }

});

app.post("/duel-result", async (req, res) => {

    const userId = req.body.userId;
    if (!userId) { return res.json({ success: false }); }
    const won = req.body.won;
    const enemyTier = typeof req.body.enemyTier === 'string' ? req.body.enemyTier.toLowerCase() : '';
    const enemyName = req.body.enemyName;
    const coinsGained = req.body.coinsGained;
    const kingOfPentaclesActive = req.body.kingOfPentaclesActive || false;
    const cardsPlayed = req.body.cardsPlayed;
    const durationSec = req.body.durationSec;
    const greatDeck = req.body.greatDeck || null;

    if (!enemyName) { return res.json({ success: false }); }

    try {
        await db.query(
            "CALL sp_duel_result(?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [userId, won ? 1 : 0, enemyName, enemyTier, coinsGained, kingOfPentaclesActive ? 1 : 0, cardsPlayed, durationSec, greatDeck]
        );
        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }

});

app.post("/stats/personal", async (req, res) => {

    const userId = req.body.userId;
    if (!userId) { return res.json({ success: false }); }

    try {
        const [data] = await db.query("CALL sp_player_report(?)", [userId]);
        const rows = data[0];
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
        if (rows.length === 0) {
            return res.json({ success: true, stats: {} });
        }
        res.json({ success: true, stats: rows[0] });
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }

});

app.post("/duel-checkpoint", async (req, res) => {

    const userId = req.body.userId;
    if (!userId) { return res.json({ success: false }); }
    const duelData = JSON.stringify(req.body.duelData);

    try {
        await db.query("CALL sp_set_duel_checkpoint(?, ?)", [userId, duelData]);
        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }

});

app.get("/duel-checkpoint/:userId", async (req, res) => {

    const userId = req.params.userId;

    try {
        const [data] = await db.query("CALL sp_get_duel_checkpoint(?)", [userId]);
        const rows = data[0];
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

    try {
        await db.query("CALL sp_clear_duel_checkpoint(?)", [userId]);
        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }

});

app.get("/player-deck/:userId", async (req, res) => {

    const userId = req.params.userId;

    try {
        const [data] = await db.query("CALL sp_get_player_deck(?)", [userId]);
        const rows = data[0];
        // card_id in DB is 1-based; JS card indices are 0-based
        // expand card_num so duplicates are returned as separate entries
        const cards = [];
        for (const row of rows) {
            for (let i = 0; i < row.card_num; i++) {
                cards.push(row.card_id - 1);
            }
        }
        res.json({ success: true, cards });
    } catch (err) {
        console.log(err);
        res.json({ success: false, cards: [] });
    }

});

app.post("/player-upgrade", async (req, res) => {

    const { userId, upgradeId } = req.body;
    if (!userId || !upgradeId) { return res.json({ success: false }); }

    try {
        await db.query("CALL sp_buy_upgrade(?, ?)", [userId, upgradeId]);
        res.json({ success: true });
    } catch (err) {
        console.log(err);
        if (err.sqlMessage === 'Not enough coins') {
            return res.json({ success: false, reason: "not enough coins" });
        }
        res.json({ success: false });
    }

});

app.get("/player-upgrades/:userId", async (req, res) => {

    const userId = req.params.userId;

    try {
        const [data] = await db.query("CALL sp_get_player_upgrades(?)", [userId]);
        const rows = data[0];
        res.json({ success: true, upgrades: rows });
    } catch (err) {
        console.log(err);
        res.json({ success: false, upgrades: [] });
    }

});

app.post("/reset-deck", async (req, res) => {

    const userId = req.body.userId;
    if (!userId) { return res.json({ success: false }); }

    try {
        await db.query("DELETE FROM Player_Deck WHERE user_id = ? AND is_bound = FALSE", [userId]);
        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }

});

app.post("/bind-card", async (req, res) => {

    const { userId, cardIndex } = req.body;
    if (!userId || cardIndex === undefined) return res.json({ success: false });

    try {
        await db.query("CALL sp_bind_card(?, ?)", [userId, cardIndex]);
        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }

});

app.post("/player-deck", async (req, res) => {

    const { userId, cards } = req.body;
    if (!userId) { return res.json({ success: false }); }

    try {
        const cardsJson = cards && cards.length > 0 ? JSON.stringify(cards) : null;
        await db.query("CALL sp_save_deck(?, ?)", [userId, cardsJson]);
        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }

});

app.post("/stats/current-run", async (req, res) => {

    const userId = req.body.userId;
    if (!userId) { return res.json({ success: false }); }

    try {
        const [rows] = await db.query(
            `SELECT * FROM v_current_run_stats
             WHERE user_id = ?
             ORDER BY run_id DESC LIMIT 1`,
            [userId]
        );
        if (rows.length === 0) return res.json({ success: false });
        res.json({ success: true, stats: rows[0] });
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }

});

app.get("/stats/leaderboard/victories", async (req, res) => {

    try {
        const [rows] = await db.query(`SELECT * FROM v_leaderboard_victories`);
        res.json({ success: true, leaderboard: rows });
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }

});

app.get("/stats/leaderboard/coins", async (req, res) => {

    try {
        const [rows] = await db.query(`SELECT * FROM v_leaderboard_coins`);
        res.json({ success: true, leaderboard: rows });
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }

});

app.get("/stats/enemy-winrate", async (req, res) => {
    try {
        const [rows] = await db.query(`SELECT * FROM v_enemy_winrate ORDER BY win_rate_pct DESC`);
        res.json({ success: true, data: rows });
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }
});

app.get("/stats/difficulty-winrate", async (req, res) => {
    try {
        const [rows] = await db.query(`SELECT * FROM v_difficulty_winrate ORDER BY win_rate_pct DESC`);
        res.json({ success: true, data: rows });
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }
});

app.get("/stats/card-popularity", async (req, res) => {
    try {
        const [rows] = await db.query(`SELECT * FROM v_card_popularity ORDER BY owners DESC`);
        res.json({ success: true, data: rows });
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }
});

app.get("/stats/upgrade-popularity", async (req, res) => {
    try {
        const [rows] = await db.query(`SELECT * FROM v_upgrade_popularity ORDER BY times_bought DESC`);
        res.json({ success: true, data: rows });
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }
});

// deck detail using view (name, rarity, copies)
app.post("/stats/my-deck", async (req, res) => {
    const userId = req.body.userId;
    if (!userId) return res.json({ success: false });
    try {
        const [rows] = await db.query(
            `SELECT card_name, rarity, card_num, is_bound
             FROM v_player_deck_detail
             WHERE username = (SELECT username FROM Player WHERE user_id = ?)
             ORDER BY FIELD(rarity,'Legendary','Rare','Common'), card_name ASC`,
            [userId]
        );
        res.json({ success: true, data: rows });
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }
});

// upgrades this player has purchased
app.post("/stats/my-upgrades", async (req, res) => {
    const userId = req.body.userId;
    if (!userId) return res.json({ success: false });
    try {
        const [rows] = await db.query(
            `SELECT upgrade_name, cost, date_acquired
             FROM v_player_upgrades
             WHERE username = (SELECT username FROM Player WHERE user_id = ?)
             ORDER BY date_acquired DESC`,
            [userId]
        );
        res.json({ success: true, data: rows });
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }
});

app.post("/debug/set-coins", async (req, res) => {
    const { userId, amount } = req.body;
    if (!userId || amount === undefined) return res.json({ success: false });
    try {
        await db.query("UPDATE Game_saveState SET current_coins = ? WHERE user_id = ?", [amount, userId]);
        res.json({ success: true, coins: amount });
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
