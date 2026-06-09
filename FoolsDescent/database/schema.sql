-- The Fool's Descent - database schema
-- Arcana Studios TC2005B.501
--
-- runs on the same db as the web backend (server.js) and Activity 5
-- merged database.sql into here so there's only one file to run
--
-- drops and recreates fools_descent

DROP DATABASE IF EXISTS fools_descent;
CREATE DATABASE fools_descent;
USE fools_descent;

-- catalog tables

CREATE TABLE Player (
    user_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    age INT,
    gender ENUM('Male', 'Female', 'Other') NOT NULL DEFAULT 'Other',
    last_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id),
    UNIQUE KEY uq_player_username (username)
);

CREATE TABLE Cards (
    card_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    card_name VARCHAR(255) NOT NULL,
    rarity VARCHAR(50) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    last_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (card_id),
    UNIQUE KEY uq_card_name (card_name)
);

CREATE TABLE Enemy (
    enemy_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    enemy_name VARCHAR(255) NOT NULL,
    difficulty_tier VARCHAR(50) NOT NULL,
    image VARCHAR(255),
    last_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (enemy_id),
    UNIQUE KEY uq_enemy_name (enemy_name)
);

CREATE TABLE Upgrades (
    upgrade_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    upgrade_name VARCHAR(255) NOT NULL,
    cost INT NOT NULL DEFAULT 0,
    effect TEXT,
    last_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (upgrade_id),
    UNIQUE KEY uq_upgrade_name (upgrade_name)
);

-- one row, updated by triggers
CREATE TABLE Global_stats (
    global_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    total_players INT NOT NULL DEFAULT 0,
    total_playtime INT NOT NULL DEFAULT 0,
    avg_playTime DECIMAL(10, 2) NOT NULL DEFAULT 0,
    avg_deaths DECIMAL(5, 2) NOT NULL DEFAULT 0,
    total_enemies_defeated INT NOT NULL DEFAULT 0,
    avg_victories DECIMAL(5, 2) NOT NULL DEFAULT 0,
    total_coins INT NOT NULL DEFAULT 0,
    total_cards_played INT NOT NULL DEFAULT 0,
    last_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (global_id)
);

INSERT INTO Global_stats (global_id) VALUES (1);

-- player tables

CREATE TABLE Player_stats (
    stats_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    total_play_time INT NOT NULL DEFAULT 0,
    deaths INT NOT NULL DEFAULT 0,
    enemies_defeated INT NOT NULL DEFAULT 0,
    victories INT NOT NULL DEFAULT 0,
    coins_earned INT NOT NULL DEFAULT 0,
    cards_played INT NOT NULL DEFAULT 0,
    last_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (stats_id),
    UNIQUE KEY uq_stats_user (user_id),
    CONSTRAINT fk_stats_user
        FOREIGN KEY (user_id) REFERENCES Player(user_id)
        ON DELETE CASCADE
);

CREATE TABLE Current_Run (
    run_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    start_time TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP NULL,
    result VARCHAR(50) NOT NULL DEFAULT 'ongoing',
    coins_kept INT NOT NULL DEFAULT 0,
    last_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (run_id),
    CONSTRAINT fk_run_user
        FOREIGN KEY (user_id) REFERENCES Player(user_id)
        ON DELETE CASCADE
);

-- one save slot per player, map_data and duel_data stored as JSON blobs
CREATE TABLE Game_saveState (
    gameSave_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    current_coins INT NOT NULL DEFAULT 0,
    current_map_position INT NOT NULL DEFAULT 0,
    current_enemy_id INT UNSIGNED,
    map_data JSON,
    duel_data JSON,
    saved_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (gameSave_id),
    UNIQUE KEY uq_save_user (user_id),
    CONSTRAINT fk_save_user
        FOREIGN KEY (user_id) REFERENCES Player(user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_save_enemy
        FOREIGN KEY (current_enemy_id) REFERENCES Enemy(enemy_id)
        ON DELETE SET NULL
);

CREATE TABLE Player_Deck (
    deck_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    card_id INT UNSIGNED NOT NULL,
    card_num INT NOT NULL DEFAULT 1,
    is_bound BOOLEAN NOT NULL DEFAULT FALSE,
    last_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (deck_id),
    UNIQUE KEY uq_deck_user_card (user_id, card_id),
    CONSTRAINT fk_deck_user
        FOREIGN KEY (user_id) REFERENCES Player(user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_deck_card
        FOREIGN KEY (card_id) REFERENCES Cards(card_id)
        ON DELETE CASCADE
);

CREATE TABLE PlayerUpgrade (
    player_upgrade_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    gameSave_id INT UNSIGNED NOT NULL,
    upgrade_id INT UNSIGNED NOT NULL,
    date_acquired TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (player_upgrade_id),
    CONSTRAINT fk_pupgrade_save
        FOREIGN KEY (gameSave_id) REFERENCES Game_saveState(gameSave_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_pupgrade_upgrade
        FOREIGN KEY (upgrade_id) REFERENCES Upgrades(upgrade_id)
        ON DELETE CASCADE
);

-- run history
-- Run_Enemy_Encounters and Great_Deck reference each other,
-- the FK on greatDeck_id gets added after Great_Deck exists

CREATE TABLE Run_Enemy_Encounters (
    encounter_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    run_id INT UNSIGNED NOT NULL,
    enemy_id INT UNSIGNED NOT NULL,
    greatDeck_id INT UNSIGNED,
    defeated_successfully BOOLEAN NOT NULL DEFAULT FALSE,
    coins_gained INT NOT NULL DEFAULT 0,
    cards_played INT NOT NULL DEFAULT 0,
    duration_sec INT NOT NULL DEFAULT 0,
    last_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (encounter_id),
    CONSTRAINT fk_encounter_run
        FOREIGN KEY (run_id) REFERENCES Current_Run(run_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_encounter_enemy
        FOREIGN KEY (enemy_id) REFERENCES Enemy(enemy_id)
        ON DELETE CASCADE
);

CREATE TABLE Great_Deck (
    greatDeck_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    encounter_id INT UNSIGNED NOT NULL,
    deckCards TEXT NOT NULL,
    last_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (greatDeck_id),
    UNIQUE KEY uq_greatdeck_encounter (encounter_id),
    CONSTRAINT fk_greatdeck_encounter
        FOREIGN KEY (encounter_id) REFERENCES Run_Enemy_Encounters(encounter_id)
        ON DELETE CASCADE
);

ALTER TABLE Run_Enemy_Encounters
    ADD CONSTRAINT fk_encounter_greatdeck
        FOREIGN KEY (greatDeck_id) REFERENCES Great_Deck(greatDeck_id)
        ON DELETE SET NULL;

-- views

-- username + lifetime stats
CREATE VIEW v_personal_stats AS
SELECT p.user_id, p.username, ps.total_play_time, ps.deaths,
       ps.enemies_defeated, ps.victories, ps.coins_earned, ps.cards_played
FROM Player p
JOIN Player_stats ps ON p.user_id = ps.user_id;

-- what the stats page shows (column names match statistics.js)
CREATE VIEW v_global_stats AS
SELECT COUNT(*)                          AS total_players,
       IFNULL(SUM(total_play_time), 0)   AS total_playtime,
       IFNULL(AVG(total_play_time), 0)   AS avg_play_time,
       IFNULL(AVG(deaths), 0)            AS avg_deaths,
       IFNULL(SUM(enemies_defeated), 0)  AS total_enemies_defeated,
       IFNULL(AVG(victories), 0)         AS avg_victories,
       IFNULL(SUM(coins_earned), 0)      AS total_coins,
       IFNULL(SUM(cards_played), 0)      AS total_cards_played
FROM Player_stats;

-- top 10 by wins
CREATE VIEW v_leaderboard_victories AS
SELECT p.username, ps.victories, ps.coins_earned
FROM Player p
JOIN Player_stats ps ON p.user_id = ps.user_id
ORDER BY ps.victories DESC, ps.coins_earned DESC
LIMIT 10;

-- top 10 by coins
CREATE VIEW v_leaderboard_coins AS
SELECT p.username, ps.coins_earned, ps.victories
FROM Player p
JOIN Player_stats ps ON p.user_id = ps.user_id
ORDER BY ps.coins_earned DESC
LIMIT 10;

-- run history with duration in seconds
CREATE VIEW v_run_history AS
SELECT r.run_id, p.username, r.result, r.coins_kept,
       r.start_time, r.end_time,
       TIMESTAMPDIFF(SECOND, r.start_time, r.end_time) AS run_seconds
FROM Current_Run r
JOIN Player p ON r.user_id = p.user_id;

-- win rate per enemy
CREATE VIEW v_enemy_winrate AS
SELECT e.enemy_name, e.difficulty_tier,
       COUNT(rec.encounter_id) AS times_fought,
       SUM(rec.defeated_successfully) AS times_defeated,
       ROUND(100 * SUM(rec.defeated_successfully) / NULLIF(COUNT(rec.encounter_id), 0), 1) AS win_rate_pct
FROM Enemy e
LEFT JOIN Run_Enemy_Encounters rec ON e.enemy_id = rec.enemy_id
GROUP BY e.enemy_id, e.enemy_name, e.difficulty_tier;

-- win rate by difficulty
CREATE VIEW v_difficulty_winrate AS
SELECT e.difficulty_tier,
       COUNT(rec.encounter_id) AS times_fought,
       IFNULL(SUM(rec.defeated_successfully), 0) AS times_defeated,
       ROUND(100 * IFNULL(SUM(rec.defeated_successfully), 0) / NULLIF(COUNT(rec.encounter_id), 0), 1) AS win_rate_pct
FROM Enemy e
LEFT JOIN Run_Enemy_Encounters rec ON e.enemy_id = rec.enemy_id
GROUP BY e.difficulty_tier;

-- cards each player owns
CREATE VIEW v_player_deck_detail AS
SELECT p.username, c.card_name, c.rarity, d.card_num, d.is_bound
FROM Player_Deck d
JOIN Player p ON d.user_id = p.user_id
JOIN Cards c  ON d.card_id = c.card_id;

-- how many players own each card
CREATE VIEW v_card_popularity AS
SELECT c.card_name, c.rarity,
       COUNT(DISTINCT d.user_id) AS owners,
       IFNULL(SUM(d.card_num), 0) AS total_copies
FROM Cards c
LEFT JOIN Player_Deck d ON c.card_id = d.card_id
GROUP BY c.card_id, c.card_name, c.rarity;

-- stats for the player's most recent run (current or last completed)
CREATE VIEW v_current_run_stats AS
SELECT cr.user_id, cr.run_id, cr.result,
       COALESCE(SUM(CASE WHEN rec.defeated_successfully = 1 THEN 1 ELSE 0 END), 0) AS enemies_defeated,
       COALESCE(SUM(CASE WHEN rec.defeated_successfully = 0 THEN 1 ELSE 0 END), 0) AS deaths,
       COALESCE(SUM(rec.coins_gained), 0)  AS coins_earned,
       COALESCE(SUM(rec.cards_played), 0)  AS cards_played,
       COALESCE(SUM(rec.duration_sec), 0)  AS total_play_time
FROM Current_Run cr
LEFT JOIN Run_Enemy_Encounters rec ON cr.run_id = rec.run_id
GROUP BY cr.run_id, cr.user_id, cr.result;

-- runs still going
CREATE VIEW v_active_runs AS
SELECT r.run_id, p.username, r.start_time, r.coins_kept
FROM Current_Run r
JOIN Player p ON r.user_id = p.user_id
WHERE r.result = 'ongoing';

-- upgrades each player bought
CREATE VIEW v_player_upgrades AS
SELECT p.username, u.upgrade_name, u.cost, pu.date_acquired
FROM PlayerUpgrade pu
JOIN Game_saveState g ON pu.gameSave_id = g.gameSave_id
JOIN Player p         ON g.user_id = p.user_id
JOIN Upgrades u       ON pu.upgrade_id = u.upgrade_id;

-- how many times each upgrade was bought
CREATE VIEW v_upgrade_popularity AS
SELECT u.upgrade_name, u.cost, COUNT(pu.player_upgrade_id) AS times_bought
FROM Upgrades u
LEFT JOIN PlayerUpgrade pu ON u.upgrade_id = pu.upgrade_id
GROUP BY u.upgrade_id, u.upgrade_name, u.cost;

-- triggers

DELIMITER $$

-- on new player: also create their stats row
CREATE TRIGGER trg_player_after_insert
AFTER INSERT ON Player
FOR EACH ROW
BEGIN
    INSERT INTO Player_stats (user_id) VALUES (NEW.user_id);
    UPDATE Global_stats
       SET total_players = total_players + 1
     WHERE global_id = 1;
END$$

-- on player delete: fix the global count
CREATE TRIGGER trg_player_after_delete
AFTER DELETE ON Player
FOR EACH ROW
BEGIN
    UPDATE Global_stats
       SET total_players = GREATEST(total_players - 1, 0)
     WHERE global_id = 1;
END$$

-- block negative stats
CREATE TRIGGER trg_pstats_before_update
BEFORE UPDATE ON Player_stats
FOR EACH ROW
BEGIN
    IF NEW.total_play_time < 0 OR NEW.deaths < 0 OR NEW.enemies_defeated < 0
       OR NEW.victories < 0 OR NEW.coins_earned < 0 OR NEW.cards_played < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Player_stats values cannot be negative';
    END IF;
END$$

-- when player stats change, update globals too
-- totals use deltas, avgs need a full recalc
CREATE TRIGGER trg_pstats_after_update
AFTER UPDATE ON Player_stats
FOR EACH ROW
BEGIN
    UPDATE Global_stats
       SET total_playtime = total_playtime + (NEW.total_play_time - OLD.total_play_time),
           total_enemies_defeated = total_enemies_defeated + (NEW.enemies_defeated - OLD.enemies_defeated),
           total_coins = total_coins + (NEW.coins_earned - OLD.coins_earned),
           total_cards_played = total_cards_played + (NEW.cards_played - OLD.cards_played),
           avg_playTime = (SELECT ROUND(IFNULL(AVG(total_play_time), 0), 2) FROM Player_stats),
           avg_deaths = (SELECT ROUND(IFNULL(AVG(deaths), 0), 2) FROM Player_stats),
           avg_victories = (SELECT IFNULL(AVG(victories), 0) FROM Player_stats)
     WHERE global_id = 1;
END$$

-- finished duel: update the player's stats (enemy kill = +enemy, loss = +death)
-- victories are counted separately when the full run closes as a victory
CREATE TRIGGER trg_encounter_after_insert
AFTER INSERT ON Run_Enemy_Encounters
FOR EACH ROW
BEGIN
    DECLARE v_user INT UNSIGNED;
    SELECT user_id INTO v_user FROM Current_Run WHERE run_id = NEW.run_id;
    UPDATE Player_stats
       SET total_play_time  = total_play_time  + NEW.duration_sec,
           coins_earned     = coins_earned     + NEW.coins_gained,
           cards_played     = cards_played     + NEW.cards_played,
           enemies_defeated = enemies_defeated + (NEW.defeated_successfully = TRUE),
           deaths           = deaths           + (NEW.defeated_successfully = FALSE)
     WHERE user_id = v_user;
END$$

-- on defeat: halve the coins kept (roguelite death penalty)
CREATE TRIGGER trg_run_before_update
BEFORE UPDATE ON Current_Run
FOR EACH ROW
BEGIN
    IF NEW.result = 'defeat' AND OLD.result <> 'defeat' AND NEW.coins_kept = OLD.coins_kept THEN
        SET NEW.coins_kept = FLOOR(OLD.coins_kept / 2);
    END IF;
END$$

-- on run victory: count it as a completed run in player stats
CREATE TRIGGER trg_run_after_update
AFTER UPDATE ON Current_Run
FOR EACH ROW
BEGIN
    IF NEW.result = 'victory' AND OLD.result <> 'victory' THEN
        UPDATE Player_stats
           SET victories = victories + 1
         WHERE user_id = NEW.user_id;
    END IF;
END$$

DELIMITER ;

-- stored procedures

DELIMITER $$

-- recalculate global_stats from scratch
CREATE PROCEDURE sp_refresh_global_stats()
BEGIN
    UPDATE Global_stats
       SET total_players          = (SELECT COUNT(*) FROM Player_stats),
           total_playtime         = (SELECT IFNULL(SUM(total_play_time), 0) FROM Player_stats),
           avg_playTime           = (SELECT ROUND(IFNULL(AVG(total_play_time), 0), 2) FROM Player_stats),
           avg_deaths             = (SELECT ROUND(IFNULL(AVG(deaths), 0), 2) FROM Player_stats),
           total_enemies_defeated = (SELECT IFNULL(SUM(enemies_defeated), 0) FROM Player_stats),
           avg_victories          = (SELECT IFNULL(AVG(victories), 0) FROM Player_stats),
           total_coins            = (SELECT IFNULL(SUM(coins_earned), 0) FROM Player_stats),
           total_cards_played     = (SELECT IFNULL(SUM(cards_played), 0) FROM Player_stats)
     WHERE global_id = 1;
END$$

-- register a new player
CREATE PROCEDURE sp_register_player(
    IN p_full_name VARCHAR(255),
    IN p_username VARCHAR(255),
    IN p_password VARCHAR(255),
    IN p_age INT,
    IN p_gender VARCHAR(50)
)
BEGIN
    INSERT INTO Player (full_name, username, password, age, gender)
    VALUES (p_full_name, p_username, p_password, p_age, p_gender);
END$$

-- start a run, returns the run_id
CREATE PROCEDURE sp_start_run(
    IN p_user_id INT UNSIGNED,
    OUT p_run_id INT UNSIGNED
)
BEGIN
    INSERT INTO Current_Run (user_id, start_time, result)
    VALUES (p_user_id, CURRENT_TIMESTAMP, 'ongoing');
    SET p_run_id = LAST_INSERT_ID();
END$$

-- log a duel with its great deck (server.js does a simpler insert without the deck)
CREATE PROCEDURE sp_record_encounter(
    IN p_run_id INT UNSIGNED,
    IN p_enemy_id INT UNSIGNED,
    IN p_defeated BOOLEAN,
    IN p_coins INT,
    IN p_cards INT,
    IN p_duration INT,
    IN p_deck_cards TEXT
)
BEGIN
    DECLARE v_encounter INT UNSIGNED;
    DECLARE v_deck INT UNSIGNED;
    INSERT INTO Run_Enemy_Encounters
        (run_id, enemy_id, defeated_successfully, coins_gained, cards_played, duration_sec)
    VALUES (p_run_id, p_enemy_id, p_defeated, p_coins, p_cards, p_duration);
    SET v_encounter = LAST_INSERT_ID();
    INSERT INTO Great_Deck (encounter_id, deckCards) VALUES (v_encounter, p_deck_cards);
    SET v_deck = LAST_INSERT_ID();
    UPDATE Run_Enemy_Encounters SET greatDeck_id = v_deck WHERE encounter_id = v_encounter;
END$$

-- end a run
CREATE PROCEDURE sp_end_run(
    IN p_run_id INT UNSIGNED,
    IN p_result VARCHAR(50),
    IN p_coins_kept INT
)
BEGIN
    UPDATE Current_Run
       SET end_time = CURRENT_TIMESTAMP,
           result = p_result,
           coins_kept = p_coins_kept
     WHERE run_id = p_run_id;
END$$

-- add coins
CREATE PROCEDURE sp_add_coins(
    IN p_user_id INT UNSIGNED,
    IN p_amount INT
)
BEGIN
    UPDATE Player_stats
       SET coins_earned = coins_earned + p_amount
     WHERE user_id = p_user_id;
END$$

-- pull everything for the stats page
CREATE PROCEDURE sp_player_report(
    IN p_user_id INT UNSIGNED
)
BEGIN
    SELECT * FROM v_personal_stats WHERE user_id = p_user_id;
END$$

DELIMITER ;
