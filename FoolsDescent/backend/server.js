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

    // a new descent resets the saved coins to 0
    const sql = `
        INSERT INTO Game_saveState (user_id, current_coins, map_data)
        VALUES (?, 0, ?)
        ON DUPLICATE KEY UPDATE
            current_coins = 0,
            current_map_position = 0,
            map_data = VALUES(map_data),
            saved_time = CURRENT_TIMESTAMP
    `;

    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        await conn.query(sql, [userId, mapData]);
        await conn.query(`DELETE FROM Player_Deck WHERE user_id = ? AND is_bound = FALSE`, [userId]);
        await conn.query(
            `UPDATE Current_Run SET result = 'defeat', end_time = CURRENT_TIMESTAMP
             WHERE user_id = ? AND result = 'ongoing'`,
            [userId]
        );
        await conn.query(
            `INSERT INTO Current_Run (user_id, result) VALUES (?, 'ongoing')`,
            [userId]
        );
        await conn.commit();
        res.json({ success: true });
    } catch (err) {
        await conn.rollback();
        console.log(err);
        res.json({ success: false });
    } finally {
        conn.release();
    }

});

app.post("/save-progress", async (req, res) => {

    const userId = req.body.userId;
    if (!userId) { return res.json({ success: false }); }
    const currentMapPosition = req.body.currentMapPosition || 0;
    const mapData = JSON.stringify(req.body.mapData);

    // coins only change through /duel-result, not here
    const sql = `
        INSERT INTO Game_saveState (user_id, current_map_position, map_data)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE
            current_map_position = VALUES(current_map_position),
            map_data = VALUES(map_data),
            saved_time = CURRENT_TIMESTAMP
    `;

    try {
        await db.query(sql, [userId, currentMapPosition, mapData]);
        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }

});

app.post("/load-game", async (req, res) => {

    const userId = req.body.userId;

    const sql = `
        SELECT current_coins, current_map_position, map_data
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
    if (!userId) { return res.json({ success: false }); }
    const won = req.body.won;
    const enemyTier = typeof req.body.enemyTier === 'string' ? req.body.enemyTier.toLowerCase() : '';
    const enemyName = req.body.enemyName;
    const coinsGained = req.body.coinsGained;
    const kingOfPentaclesActive = req.body.kingOfPentaclesActive || false;
    const cardsPlayed = req.body.cardsPlayed;
    const durationSec = req.body.durationSec;
    const greatDeck = req.body.greatDeck;

    if (!enemyName) { return res.json({ success: false }); }

    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const [runs] = await conn.query(
            `SELECT run_id FROM Current_Run
             WHERE user_id = ? AND result = 'ongoing'
             ORDER BY run_id DESC LIMIT 1`,
            [userId]
        );

        let runId;
        if (runs.length > 0) {
            runId = runs[0].run_id;
        } else {
            const [run] = await conn.query(
                `INSERT INTO Current_Run (user_id, result) VALUES (?, 'ongoing')`,
                [userId]
            );
            runId = run.insertId;
        }

        // name lookup instead of tier so we don't grab the wrong enemy
        const [enemies] = await conn.query(
            `SELECT enemy_id FROM Enemy WHERE enemy_name = ?`,
            [enemyName]
        );
        if (!enemies.length) throw new Error("unknown enemy: " + enemyName);
        const enemyId = enemies[0].enemy_id;

        const [encounter] = await conn.query(
            `INSERT INTO Run_Enemy_Encounters
             (run_id, enemy_id, defeated_successfully, coins_gained, cards_played, duration_sec)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [runId, enemyId, won ? 1 : 0, coinsGained, cardsPlayed, durationSec]
        );
        const encounterId = encounter.insertId;

        if (greatDeck) {
            const [deck] = await conn.query(
                `INSERT INTO Great_Deck (encounter_id, deckCards) VALUES (?, ?)`,
                [encounterId, greatDeck]
            );
            await conn.query(
                `UPDATE Run_Enemy_Encounters SET greatDeck_id = ? WHERE encounter_id = ?`,
                [deck.insertId, encounterId]
            );
        }

        if (won) {
            await conn.query(
                `UPDATE Game_saveState SET current_coins = current_coins + ?, duel_data = NULL WHERE user_id = ?`,
                [coinsGained, userId]
            );
            if (enemyTier === 'boss') {
                const [[save]] = await conn.query(
                    `SELECT current_coins FROM Game_saveState WHERE user_id = ?`, [userId]
                );
                await conn.query(
                    `UPDATE Current_Run SET result = 'victory', end_time = CURRENT_TIMESTAMP, coins_kept = ?
                     WHERE run_id = ?`,
                    [save ? save.current_coins : 0, runId]
                );
            }
        } else {
            // king of pentacles doubles the loss: instead of half, lose everything
            const lossQuery = kingOfPentaclesActive
                ? `UPDATE Game_saveState SET duel_data = NULL, current_coins = 0 WHERE user_id = ?`
                : `UPDATE Game_saveState SET duel_data = NULL, current_coins = FLOOR(current_coins / 2) WHERE user_id = ?`;
            await conn.query(lossQuery, [userId]);
            const [[save]] = await conn.query(
                `SELECT current_coins FROM Game_saveState WHERE user_id = ?`, [userId]
            );
            await conn.query(
                `UPDATE Current_Run SET result = 'defeat', end_time = CURRENT_TIMESTAMP, coins_kept = ?
                 WHERE run_id = ?`,
                [save ? save.current_coins : 0, runId]
            );
        }

        await conn.commit();
        res.json({ success: true });
    } catch (err) {
        await conn.rollback();
        console.log(err);
        res.json({ success: false });
    } finally {
        conn.release();
    }

});

app.post("/stats/personal", async (req, res) => {

    const userId = req.body.userId;
    if (!userId) { return res.json({ success: false }); }

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

    const sql = `
        UPDATE Game_saveState
        SET duel_data = ?, saved_time = CURRENT_TIMESTAMP
        WHERE user_id = ?
    `;

    try {
        const [result] = await db.query(sql, [duelData, userId]);
        res.json({ success: result.affectedRows > 0 });
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

    const sql = `SELECT card_id, card_num FROM Player_Deck WHERE user_id = ?`;

    try {
        const [rows] = await db.query(sql, [userId]);
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

    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const [upgrades] = await conn.query(
            `SELECT cost FROM Upgrades WHERE upgrade_id = ?`, [upgradeId]
        );
        if (!upgrades.length) throw new Error("unknown upgrade");
        const cost = upgrades[0].cost;

        const [saves] = await conn.query(
            `SELECT gameSave_id, current_coins FROM Game_saveState WHERE user_id = ?`, [userId]
        );
        if (!saves.length) throw new Error("no save");
        if (saves[0].current_coins < cost) {
            await conn.rollback();
            return res.json({ success: false, reason: "not enough coins" });
        }

        await conn.query(
            `UPDATE Game_saveState SET current_coins = current_coins - ? WHERE user_id = ?`,
            [cost, userId]
        );
        await conn.query(
            `INSERT INTO PlayerUpgrade (gameSave_id, upgrade_id) VALUES (?, ?)`,
            [saves[0].gameSave_id, upgradeId]
        );

        await conn.commit();
        res.json({ success: true });
    } catch (err) {
        await conn.rollback();
        console.log(err);
        res.json({ success: false });
    } finally {
        conn.release();
    }

});

app.post("/player-deck", async (req, res) => {

    const { userId, cards } = req.body;
    if (!userId) { return res.json({ success: false }); }

    try {
        // keep bound cards (Binding upgrade) across wins and new descents
        await db.query(`DELETE FROM Player_Deck WHERE user_id = ? AND is_bound = FALSE`, [userId]);
        if (cards && cards.length > 0) {
            const [boundRows] = await db.query(
                `SELECT card_id FROM Player_Deck WHERE user_id = ? AND is_bound = TRUE`,
                [userId]
            );
            const boundIds = new Set(boundRows.map(r => r.card_id));
            // group copies into card_num; skip IDs already covered by a bound row
            const counts = {};
            for (const c of cards) {
                const id = c + 1; // JS 0-based → DB 1-based
                if (!boundIds.has(id)) {
                    counts[id] = (counts[id] || 0) + 1;
                }
            }
            const values = Object.entries(counts).map(([id, num]) => [userId, Number(id), num]);
            if (values.length > 0) {
                await db.query(
                    `INSERT INTO Player_Deck (user_id, card_id, card_num) VALUES ?`,
                    [values]
                );
            }
        }
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

app.listen(3000, () => {
    console.log("Server running on port 3000");
});