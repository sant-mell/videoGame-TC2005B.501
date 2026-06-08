-- The Fool's Descent - testing queries
-- Run inside the mysql client with: source test_queries.sql

USE fools_descent;

-- structure overview
SHOW TABLES;
SHOW FULL TABLES WHERE Table_type = 'VIEW';
SELECT TRIGGER_NAME, EVENT_MANIPULATION, EVENT_OBJECT_TABLE, ACTION_TIMING
FROM information_schema.TRIGGERS WHERE TRIGGER_SCHEMA = 'fools_descent';
SHOW PROCEDURE STATUS WHERE Db = 'fools_descent';

-- catalog counts (GDD: 16 cards / 7 enemies / 3 upgrades)
SELECT (SELECT COUNT(*) FROM Cards)      AS cards,
       (SELECT COUNT(*) FROM Enemy)      AS enemies,
       (SELECT COUNT(*) FROM Upgrades)   AS upgrades,
       (SELECT COUNT(*) FROM Player)     AS players,
       (SELECT COUNT(*) FROM Player_stats) AS stats_rows;

-- views
SELECT * FROM v_personal_stats      LIMIT 10;
SELECT * FROM v_global_stats;
SELECT * FROM v_leaderboard_victories;
SELECT * FROM v_leaderboard_coins;
SELECT * FROM v_run_history         LIMIT 10;
SELECT * FROM v_enemy_winrate;
SELECT * FROM v_difficulty_winrate;
SELECT * FROM v_player_deck_detail  LIMIT 10;
SELECT * FROM v_card_popularity;
SELECT * FROM v_active_runs         LIMIT 10;
SELECT * FROM v_player_upgrades     LIMIT 10;
SELECT * FROM v_upgrade_popularity;

-- trigger test (mirrors what the game does on a finished duel)
SELECT 'BEFORE' AS state, * FROM v_personal_stats WHERE user_id = 1;

INSERT INTO Current_Run (user_id, result) VALUES (1, 'ongoing');
SET @run := LAST_INSERT_ID();
INSERT INTO Run_Enemy_Encounters
    (run_id, enemy_id, defeated_successfully, coins_gained, cards_played, duration_sec)
VALUES (@run, 5, TRUE, 150, 3, 75);

SELECT 'AFTER WIN' AS state, * FROM v_personal_stats WHERE user_id = 1;

INSERT INTO Run_Enemy_Encounters
    (run_id, enemy_id, defeated_successfully, coins_gained, cards_played, duration_sec)
VALUES (@run, 7, FALSE, 0, 2, 30);
UPDATE Current_Run SET result = 'defeat', end_time = CURRENT_TIMESTAMP WHERE run_id = @run;

SELECT 'AFTER LOSS' AS state, * FROM v_personal_stats WHERE user_id = 1;

-- the negative-value guard should FAIL with SQLSTATE 45000 (expected error):
-- UPDATE Player_stats SET coins_earned = -5 WHERE user_id = 1;

CALL sp_refresh_global_stats();
SELECT * FROM Global_stats WHERE global_id = 1;

-- NOTE: this test mutates player 1's stats. To restore the seed state:
--   mysql -u root -p1234 < schema.sql ; mysql -u root -p1234 < data.sql
