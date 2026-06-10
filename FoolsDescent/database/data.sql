-- The Fool's Descent - test data (Activity 5)
-- cards/enemies/upgrades match the GDD exactly (16/7/3)
-- transactional tables have ~30-50 dummy rows

USE fools_descent;

INSERT INTO Cards (card_name, rarity, description, image) VALUES
('The Magician', 'common', 'Repeats the effect of your last played card', 'cards/the_magician.png'),
('The Chariot', 'common', 'Throws away the top card of the Great Deck', 'cards/the_chariot.png'),
('Page of Pentacles', 'common', 'Gives you a 50 coin bonus if you win', 'cards/page_of_pentacles.png'),
('The Star', 'common', 'If your lives reach 0, you will be revived with one life remaining', 'cards/the_star.png'),
('Strength', 'common', 'Prevents you from dying next round', 'cards/strength.png'),
('Two of Pentacles', 'common', 'Draws two cards, choose one to apply to yourself', 'cards/two_of_pentacles.png'),
('The High Priestess', 'rare', 'Shows you the next card in the Great Deck', 'cards/the_high_priestess.png'),
('The Hermit', 'rare', 'Blocks the enemy''s next turn', 'cards/the_hermit.png'),
('Justice', 'rare', 'Makes your enemy lose a life if you lose a life on this or next turn', 'cards/justice.png'),
('Wheel of Fortune', 'rare', 'Shuffles the Great Deck', 'cards/wheel_of_fortune.png'),
('King of Pentacles', 'rare', 'Doubles your gained coins if you win, but also doubles your lost coins if you lose', 'cards/king_of_pentacles.png'),
('The Lovers', 'epic', 'Removes one Moon card from the Great Deck', 'cards/the_lovers.png'),
('The Hanged Man', 'epic', 'Blocks the enemy from using their Character Deck next turn', 'cards/the_hanged_man.png'),
('The Tower', 'epic', 'Destroys half of your opponent''s character cards', 'cards/the_tower.png'),
('The Devil', 'epic', 'Gain 2 lives, but a new moon card will be added to the Great Deck', 'cards/the_devil.png'),
('The Fool', 'legendary', 'Any card effect is possible, but which one will it be?', 'cards/the_fool.png');

INSERT INTO Enemy (enemy_name, difficulty_tier, image) VALUES
('Drunk', 'common', 'enemies/Drunk.png'),
('Peasant', 'common', 'enemies/Peseant.png'),
('Crazy Jester', 'rare', 'enemies/Jester.png'),
('Bounded Knight', 'rare', 'enemies/Knight.png'),
('Killer Queen', 'epic', 'enemies/Queen.png'),
('Mad Monarch', 'epic', 'enemies/The_king.png'),
('The Dealer', 'legendary', 'enemies/Dealer.png');

INSERT INTO Upgrades (upgrade_name, cost, effect) VALUES
('Card Binding', 100, 'Bind a card so it returns to your hand next duel even after being used'),
('Life Extension', 150, 'Increase your maximum life above the baseline of 3'),
('Extra Card', 50, 'Purchase one random card to use in your next duel');

INSERT INTO Player (full_name, username, password, age, gender) VALUES
('Mateo Aguilar', 'mateo_aguilar1', 'pass1001', 25, 'Female'),
('Sofia Palacios', 'sofia_palacios2', 'pass1002', 27, 'Male'),
('Diego Echeverria', 'diego_echeverria3', 'pass1003', 17, 'Male'),
('Valeria Duarte', 'valeria_duarte4', 'pass1004', 26, 'Male'),
('Luca Pinto', 'luca_pinto5', 'pass1005', 31, 'Female'),
('Camila Ferro', 'camila_ferro6', 'pass1006', 16, 'Male'),
('Tomas Reyna', 'tomas_reyna7', 'pass1007', 28, 'Other'),
('Renata Quintero', 'renata_quintero8', 'pass1008', 17, 'Female'),
('Emiliano Nieto', 'emiliano_nieto9', 'pass1009', 17, 'Other'),
('Isabela Esquivel', 'isabela_esquivel10', 'pass1010', 16, 'Male'),
('Andres Montero', 'andres_montero11', 'pass1011', 22, 'Male'),
('Daniela Carrillo', 'daniela_carrillo12', 'pass1012', 33, 'Other'),
('Sebastian Saavedra', 'sebastian_saavedra13', 'pass1013', 16, 'Female'),
('Lucia Portela', 'lucia_portela14', 'pass1014', 16, 'Female'),
('Bruno Bisono', 'bruno_bisono15', 'pass1015', 24, 'Other'),
('Mariana Navarro', 'mariana_navarro16', 'pass1016', 19, 'Male'),
('Joaquin Cano', 'joaquin_cano17', 'pass1017', 33, 'Other'),
('Regina Bravo', 'regina_bravo18', 'pass1018', 32, 'Female'),
('Maximo Mejia', 'maximo_mejia19', 'pass1019', 18, 'Female'),
('Ximena Salas', 'ximena_salas20', 'pass1020', 26, 'Male'),
('Ivan Tovar', 'ivan_tovar21', 'pass1021', 32, 'Male'),
('Paula Galindo', 'paula_galindo22', 'pass1022', 33, 'Male'),
('Hugo Valdes', 'hugo_valdes23', 'pass1023', 34, 'Female'),
('Elena Carranza', 'elena_carranza24', 'pass1024', 30, 'Other'),
('Gael Bustos', 'gael_bustos25', 'pass1025', 39, 'Other'),
('Antonia Gallardo', 'antonia_gallardo26', 'pass1026', 29, 'Other'),
('Dario Vega', 'dario_vega27', 'pass1027', 26, 'Other'),
('Noa Mello', 'noa_mello28', 'pass1028', 22, 'Female'),
('Felix Rios', 'felix_rios29', 'pass1029', 37, 'Female'),
('Carmen Solis', 'carmen_solis30', 'pass1030', 17, 'Other'),
('Adrian Lozano', 'adrian_lozano31', 'pass1031', 31, 'Other'),
('Frida Cabrera', 'frida_cabrera32', 'pass1032', 25, 'Other'),
('Nicolas Ocampo', 'nicolas_ocampo33', 'pass1033', 24, 'Male'),
('Aitana Cordova', 'aitana_cordova34', 'pass1034', 18, 'Other'),
('Pablo Arce', 'pablo_arce35', 'pass1035', 20, 'Other'),
('Vera Pizarro', 'vera_pizarro36', 'pass1036', 19, 'Other'),
('Ruben Roldan', 'ruben_roldan37', 'pass1037', 28, 'Male'),
('Olivia Zamora', 'olivia_zamora38', 'pass1038', 36, 'Male'),
('Cesar Fuentes', 'cesar_fuentes39', 'pass1039', 39, 'Other'),
('Maia Castillo', 'maia_castillo40', 'pass1040', 25, 'Other');

INSERT INTO Current_Run (user_id, start_time, end_time, result, coins_kept) VALUES
(39, '2026-05-19 14:00:00', '2026-05-19 15:30:00', 'victory', 420),
(6, '2026-05-16 22:00:00', '2026-05-16 23:30:00', 'victory', 380),
(4, '2026-05-23 09:00:00', '2026-05-23 10:30:00', 'defeat', 210),
(29, '2026-05-23 12:00:00', '2026-05-23 13:30:00', 'victory', 420),
(2, '2026-05-12 05:00:00', '2026-05-12 06:30:00', 'victory', 310),
(32, '2026-05-07 09:00:00', NULL, 'ongoing', 180),
(16, '2026-05-13 15:00:00', '2026-05-13 16:30:00', 'victory', 290),
(11, '2026-05-13 17:00:00', '2026-05-13 18:30:00', 'victory', 380),
(9, '2026-05-28 17:00:00', '2026-05-28 18:30:00', 'victory', 510),
(27, '2026-05-22 12:00:00', '2026-05-22 13:30:00', 'victory', 450),
(10, '2026-05-06 04:00:00', NULL, 'ongoing', 120),
(15, '2026-05-16 18:00:00', NULL, 'ongoing', 95),
(17, '2026-05-01 04:00:00', '2026-05-01 05:30:00', 'victory', 620),
(35, '2026-05-20 18:00:00', '2026-05-20 19:30:00', 'victory', 340),
(9, '2026-05-28 16:00:00', '2026-05-28 17:30:00', 'defeat', 130),
(30, '2026-05-26 17:00:00', '2026-05-26 18:30:00', 'defeat', 160),
(26, '2026-05-13 03:00:00', '2026-05-13 04:30:00', 'victory', 720),
(26, '2026-05-07 02:00:00', NULL, 'ongoing', 200),
(29, '2026-05-04 10:00:00', NULL, 'ongoing', 310),
(4, '2026-05-01 18:00:00', NULL, 'ongoing', 150),
(35, '2026-05-12 19:00:00', NULL, 'ongoing', 80),
(5, '2026-05-20 12:00:00', NULL, 'ongoing', 140),
(17, '2026-05-20 11:00:00', '2026-05-20 12:30:00', 'victory', 580),
(8, '2026-05-28 15:00:00', NULL, 'ongoing', 230),
(31, '2026-05-10 02:00:00', '2026-05-10 03:30:00', 'victory', 260),
(7, '2026-05-11 08:00:00', '2026-05-11 09:30:00', 'defeat', 180),
(11, '2026-05-01 06:00:00', '2026-05-01 07:30:00', 'defeat', 210),
(24, '2026-05-23 17:00:00', NULL, 'ongoing', 70),
(34, '2026-05-21 02:00:00', '2026-05-21 03:30:00', 'victory', 390),
(34, '2026-05-06 11:00:00', '2026-05-06 12:30:00', 'victory', 320),
(35, '2026-05-25 16:00:00', '2026-05-25 17:30:00', 'defeat', 140),
(15, '2026-05-26 06:00:00', '2026-05-26 07:30:00', 'defeat', 100),
(26, '2026-05-26 07:00:00', '2026-05-26 08:30:00', 'defeat', 120),
(34, '2026-05-12 00:00:00', '2026-05-12 01:30:00', 'victory', 228),
(18, '2026-05-09 06:00:00', '2026-05-09 07:30:00', 'victory', 680),
(23, '2026-05-26 11:00:00', '2026-05-26 12:30:00', 'victory', 440),
(6, '2026-05-04 07:00:00', NULL, 'ongoing', 270),
(13, '2026-05-07 15:00:00', '2026-05-07 16:30:00', 'victory', 750),
(1, '2026-05-21 11:00:00', '2026-05-21 12:30:00', 'victory', 490),
(8, '2026-05-26 22:00:00', '2026-05-26 23:30:00', 'victory', 380);

INSERT INTO Game_saveState (user_id, current_coins, current_map_position, current_enemy_id) VALUES
(1, 320, 1, NULL),
(2, 180, 6, NULL),
(3, 90, 3, 6),
(4, 450, 1, 2),
(5, 60, 1, NULL),
(6, 580, 1, NULL),
(7, 240, 2, 2),
(8, 30, 0, 7),
(9, 710, 5, NULL),
(10, 200, 6, 7),
(11, 140, 2, NULL),
(12, 490, 1, NULL),
(13, 380, 4, 4),
(14, 80, 5, NULL),
(15, 670, 4, NULL),
(16, 320, 1, 5),
(17, 510, 4, NULL),
(18, 150, 4, 1),
(19, 95, 1, 4),
(20, 620, 0, NULL),
(21, 170, 4, 1),
(22, 45, 2, 1),
(23, 510, 3, 5),
(24, 65, 3, 3),
(25, 730, 2, NULL),
(26, 380, 1, NULL),
(27, 590, 1, NULL),
(28, 120, 3, NULL),
(29, 440, 2, 1),
(30, 270, 0, NULL),
(31, 100, 6, NULL),
(32, 210, 2, NULL),
(33, 350, 5, NULL),
(34, 280, 1, 6),
(35, 190, 5, NULL),
(36, 460, 3, NULL),
(37, 310, 0, NULL),
(38, 65, 2, NULL),
(39, 240, 5, NULL),
(40, 180, 4, NULL);

INSERT INTO Player_Deck (user_id, card_id, card_num, is_bound) VALUES
(33, 3, 1, TRUE),
(7, 3, 2, FALSE),
(3, 6, 2, TRUE),
(28, 9, 2, TRUE),
(35, 16, 3, FALSE),
(6, 9, 3, TRUE),
(28, 3, 2, TRUE),
(5, 9, 1, FALSE),
(1, 11, 3, FALSE),
(18, 5, 1, TRUE),
(8, 6, 2, TRUE),
(12, 7, 2, FALSE),
(34, 7, 2, FALSE),
(33, 6, 2, FALSE),
(2, 9, 1, TRUE),
(2, 7, 3, FALSE),
(16, 15, 1, FALSE),
(32, 13, 4, FALSE),
(14, 8, 5, TRUE),
(9, 13, 2, TRUE),
(9, 1, 1, FALSE),
(28, 6, 1, TRUE),
(25, 10, 3, TRUE),
(19, 2, 5, TRUE),
(11, 9, 2, TRUE),
(17, 12, 2, FALSE),
(16, 2, 2, TRUE),
(23, 6, 1, FALSE),
(25, 3, 2, FALSE),
(33, 7, 1, TRUE),
(26, 2, 2, TRUE),
(20, 10, 3, TRUE),
(6, 5, 3, FALSE),
(21, 16, 1, FALSE),
(40, 5, 1, FALSE),
(33, 5, 3, TRUE),
(38, 8, 1, TRUE),
(3, 5, 3, FALSE),
(7, 13, 2, TRUE),
(2, 8, 2, FALSE),
(1, 15, 1, TRUE),
(34, 3, 3, FALSE),
(17, 3, 2, TRUE),
(5, 5, 2, FALSE),
(20, 5, 1, FALSE);

INSERT INTO PlayerUpgrade (gameSave_id, upgrade_id, date_acquired) VALUES
(4, 2, '2026-05-09 12:00:00'),
(7, 3, '2026-05-07 12:00:00'),
(32, 2, '2026-05-23 12:00:00'),
(34, 2, '2026-05-15 12:00:00'),
(30, 2, '2026-05-25 12:00:00'),
(8, 3, '2026-05-07 12:00:00'),
(20, 1, '2026-05-16 12:00:00'),
(2, 2, '2026-05-15 12:00:00'),
(5, 3, '2026-05-15 12:00:00'),
(18, 2, '2026-05-07 12:00:00'),
(14, 1, '2026-05-19 12:00:00'),
(6, 1, '2026-05-24 12:00:00'),
(34, 2, '2026-05-12 12:00:00'),
(9, 3, '2026-05-27 12:00:00'),
(33, 2, '2026-05-04 12:00:00'),
(24, 1, '2026-05-16 12:00:00'),
(32, 2, '2026-05-01 12:00:00'),
(11, 1, '2026-05-16 12:00:00'),
(29, 2, '2026-05-10 12:00:00'),
(10, 2, '2026-05-12 12:00:00'),
(25, 2, '2026-05-04 12:00:00'),
(22, 1, '2026-05-11 12:00:00'),
(22, 2, '2026-05-04 12:00:00'),
(13, 3, '2026-05-01 12:00:00'),
(19, 2, '2026-05-12 12:00:00'),
(5, 2, '2026-05-13 12:00:00'),
(38, 1, '2026-05-12 12:00:00'),
(28, 2, '2026-05-28 12:00:00'),
(4, 2, '2026-05-04 12:00:00'),
(4, 3, '2026-05-10 12:00:00'),
(10, 1, '2026-05-09 12:00:00'),
(28, 3, '2026-05-11 12:00:00'),
(13, 2, '2026-05-26 12:00:00'),
(28, 1, '2026-05-26 12:00:00'),
(26, 3, '2026-05-18 12:00:00');

INSERT INTO Run_Enemy_Encounters (run_id, enemy_id, defeated_successfully, coins_gained, cards_played, duration_sec) VALUES
(14, 6, TRUE, 50, 11, 450),
(29, 5, TRUE, 180, 4, 527),
(4, 5, TRUE, 120, 7, 454),
(22, 3, FALSE, 140, 11, 296),
(26, 6, TRUE, 160, 7, 600),
(26, 1, TRUE, 200, 2, 106),
(14, 5, FALSE, 150, 3, 493),
(22, 7, FALSE, 170, 2, 590),
(13, 2, TRUE, 110, 5, 599),
(6, 3, TRUE, 150, 4, 236),
(2, 6, FALSE, 160, 6, 566),
(14, 4, FALSE, 140, 12, 93),
(32, 3, FALSE, 80, 10, 545),
(34, 6, TRUE, 70, 4, 284),
(25, 4, FALSE, 160, 4, 52),
(9, 1, FALSE, 200, 12, 514),
(38, 4, TRUE, 60, 6, 570),
(30, 4, TRUE, 80, 3, 188),
(10, 5, TRUE, 210, 11, 498),
(6, 5, TRUE, 30, 12, 158),
(15, 5, TRUE, 190, 11, 341),
(9, 6, FALSE, 160, 10, 477),
(8, 1, TRUE, 130, 8, 226),
(25, 3, TRUE, 180, 0, 40),
(35, 3, FALSE, 120, 5, 278),
(31, 5, TRUE, 170, 3, 59),
(27, 6, FALSE, 50, 0, 228),
(32, 6, FALSE, 65, 4, 263),
(28, 3, TRUE, 150, 0, 376),
(27, 3, FALSE, 110, 0, 329),
(33, 1, TRUE, 160, 3, 349),
(13, 2, FALSE, 100, 4, 332),
(7, 5, FALSE, 190, 2, 258),
(32, 4, TRUE, 180, 2, 432),
(4, 2, TRUE, 180, 2, 455),
(4, 6, TRUE, 100, 6, 490),
(21, 6, TRUE, 65, 2, 367),
(13, 2, FALSE, 35, 4, 417),
(24, 3, FALSE, 90, 1, 32),
(6, 3, TRUE, 140, 6, 156),
(36, 7, TRUE, 150, 5, 346),
(28, 1, TRUE, 200, 7, 230),
(24, 5, FALSE, 100, 5, 402),
(31, 1, FALSE, 110, 12, 444),
(3, 4, TRUE, 150, 1, 93);

INSERT INTO Great_Deck (encounter_id, deckCards) VALUES
(1, 'sun,sun,moon,moon,moon,moon,sun,moon'),
(2, 'moon,moon,sun,sun,sun,sun,sun,moon'),
(3, 'moon,moon,moon,moon,sun,moon,sun,sun,moon'),
(4, 'sun,moon,moon,moon,moon,sun,sun'),
(5, 'sun,sun,moon,sun,sun,moon,moon,sun,moon'),
(6, 'sun,moon,sun,sun,sun,moon'),
(7, 'moon,sun,sun,sun,moon,moon,sun,sun,moon'),
(8, 'moon,moon,moon,moon,moon,sun,moon,sun'),
(9, 'sun,sun,sun,moon,sun,moon,sun'),
(10, 'moon,sun,sun,sun,moon,sun,sun,sun,moon'),
(11, 'moon,moon,sun,moon,sun,sun,sun'),
(12, 'sun,sun,moon,sun,moon,moon,sun'),
(13, 'moon,sun,sun,moon,moon,sun'),
(14, 'sun,moon,sun,sun,sun,moon'),
(15, 'moon,sun,moon,sun,sun,sun,moon,moon,sun'),
(16, 'sun,moon,sun,sun,sun,moon,moon,moon,moon'),
(17, 'moon,sun,moon,moon,moon,moon,sun,moon'),
(18, 'moon,moon,sun,sun,moon,sun,moon'),
(19, 'sun,moon,moon,moon,sun,sun'),
(20, 'sun,sun,moon,sun,moon,sun'),
(21, 'moon,moon,sun,sun,sun,sun,moon'),
(22, 'sun,moon,sun,sun,moon,moon,sun,moon,sun'),
(23, 'sun,sun,moon,sun,moon,sun,sun,sun,moon,sun'),
(24, 'moon,sun,sun,sun,sun,sun,sun,moon,sun'),
(25, 'moon,moon,moon,moon,sun,moon,moon,moon,moon'),
(26, 'moon,sun,sun,sun,moon,moon,sun,moon,moon,sun'),
(27, 'moon,sun,sun,sun,moon,moon,moon,sun,moon'),
(28, 'sun,sun,sun,sun,moon,sun,sun,moon,sun,sun'),
(29, 'sun,sun,sun,moon,moon,sun'),
(30, 'sun,moon,moon,sun,moon,moon,moon'),
(31, 'moon,moon,sun,moon,sun,moon,moon'),
(32, 'sun,sun,moon,sun,moon,moon'),
(33, 'sun,moon,sun,sun,moon,moon,sun,moon,moon'),
(34, 'moon,moon,moon,sun,moon,moon,sun,moon'),
(35, 'sun,sun,moon,moon,moon,moon,sun'),
(36, 'sun,sun,moon,moon,moon,moon'),
(37, 'sun,moon,sun,sun,sun,sun'),
(38, 'moon,moon,sun,moon,sun,moon'),
(39, 'moon,sun,sun,moon,moon,sun,sun,sun,sun,sun'),
(40, 'sun,sun,sun,moon,moon,moon,sun,sun,moon'),
(41, 'moon,moon,sun,sun,sun,sun,sun,sun,moon,sun'),
(42, 'sun,sun,sun,sun,sun,sun,moon'),
(43, 'moon,sun,moon,sun,moon,sun,moon'),
(44, 'sun,moon,moon,moon,sun,moon,sun,sun,sun,moon'),
(45, 'sun,sun,moon,moon,sun,moon,moon');

UPDATE Run_Enemy_Encounters r
JOIN Great_Deck g ON g.encounter_id = r.encounter_id
SET r.greatDeck_id = g.greatDeck_id;

-- overwrite trigger-accumulated values with the intended seeded totals
UPDATE Player_stats SET total_play_time=1820, deaths=4, enemies_defeated=9, victories=2, coins_earned=480, cards_played=42 WHERE user_id=1;
UPDATE Player_stats SET total_play_time=2100, deaths=3, enemies_defeated=7, victories=1, coins_earned=320, cards_played=35 WHERE user_id=2;
UPDATE Player_stats SET total_play_time=950, deaths=2, enemies_defeated=2, victories=0, coins_earned=90, cards_played=18 WHERE user_id=3;
UPDATE Player_stats SET total_play_time=2600, deaths=7, enemies_defeated=20, victories=4, coins_earned=1100, cards_played=120 WHERE user_id=4;
UPDATE Player_stats SET total_play_time=1650, deaths=5, enemies_defeated=14, victories=3, coins_earned=760, cards_played=88 WHERE user_id=5;
UPDATE Player_stats SET total_play_time=2400, deaths=4, enemies_defeated=9, victories=2, coins_earned=530, cards_played=56 WHERE user_id=6;
UPDATE Player_stats SET total_play_time=1100, deaths=2, enemies_defeated=5, victories=1, coins_earned=290, cards_played=24 WHERE user_id=7;
UPDATE Player_stats SET total_play_time=2800, deaths=3, enemies_defeated=3, victories=0, coins_earned=110, cards_played=31 WHERE user_id=8;
UPDATE Player_stats SET total_play_time=1450, deaths=6, enemies_defeated=16, victories=3, coins_earned=840, cards_played=72 WHERE user_id=9;
UPDATE Player_stats SET total_play_time=900, deaths=1, enemies_defeated=1, victories=0, coins_earned=60, cards_played=12 WHERE user_id=10;
UPDATE Player_stats SET total_play_time=3100, deaths=6, enemies_defeated=18, victories=4, coins_earned=1250, cards_played=95 WHERE user_id=11;
UPDATE Player_stats SET total_play_time=1750, deaths=8, enemies_defeated=25, victories=5, coins_earned=1380, cards_played=140 WHERE user_id=12;
UPDATE Player_stats SET total_play_time=2200, deaths=3, enemies_defeated=6, victories=1, coins_earned=340, cards_played=38 WHERE user_id=13;
UPDATE Player_stats SET total_play_time=800, deaths=9, enemies_defeated=33, victories=6, coins_earned=1450, cards_played=165 WHERE user_id=14;
UPDATE Player_stats SET total_play_time=1600, deaths=4, enemies_defeated=4, victories=0, coins_earned=150, cards_played=25 WHERE user_id=15;
UPDATE Player_stats SET total_play_time=2900, deaths=5, enemies_defeated=9, victories=2, coins_earned=620, cards_played=78 WHERE user_id=16;
UPDATE Player_stats SET total_play_time=1300, deaths=2, enemies_defeated=6, victories=1, coins_earned=310, cards_played=30 WHERE user_id=17;
UPDATE Player_stats SET total_play_time=2600, deaths=7, enemies_defeated=16, victories=3, coins_earned=920, cards_played=108 WHERE user_id=18;
UPDATE Player_stats SET total_play_time=1950, deaths=3, enemies_defeated=3, victories=0, coins_earned=130, cards_played=22 WHERE user_id=19;
UPDATE Player_stats SET total_play_time=1400, deaths=4, enemies_defeated=8, victories=2, coins_earned=540, cards_played=64 WHERE user_id=20;
UPDATE Player_stats SET total_play_time=3290, deaths=3, enemies_defeated=6, victories=1, coins_earned=270, cards_played=45 WHERE user_id=21;
UPDATE Player_stats SET total_play_time=700, deaths=2, enemies_defeated=2, victories=0, coins_earned=70, cards_played=19 WHERE user_id=22;
UPDATE Player_stats SET total_play_time=2050, deaths=2, enemies_defeated=5, victories=1, coins_earned=380, cards_played=41 WHERE user_id=23;
UPDATE Player_stats SET total_play_time=1700, deaths=5, enemies_defeated=14, victories=3, coins_earned=870, cards_played=95 WHERE user_id=24;
UPDATE Player_stats SET total_play_time=2300, deaths=4, enemies_defeated=9, victories=2, coins_earned=590, cards_played=67 WHERE user_id=25;
UPDATE Player_stats SET total_play_time=1500, deaths=2, enemies_defeated=5, victories=1, coins_earned=280, cards_played=32 WHERE user_id=26;
UPDATE Player_stats SET total_play_time=3000, deaths=6, enemies_defeated=18, victories=4, coins_earned=1080, cards_played=115 WHERE user_id=27;
UPDATE Player_stats SET total_play_time=1250, deaths=7, enemies_defeated=27, victories=5, coins_earned=1300, cards_played=148 WHERE user_id=28;
UPDATE Player_stats SET total_play_time=2700, deaths=4, enemies_defeated=10, victories=2, coins_earned=580, cards_played=70 WHERE user_id=29;
UPDATE Player_stats SET total_play_time=1850, deaths=5, enemies_defeated=14, victories=3, coins_earned=790, cards_played=89 WHERE user_id=30;
UPDATE Player_stats SET total_play_time=800, deaths=2, enemies_defeated=5, victories=1, coins_earned=290, cards_played=28 WHERE user_id=31;
UPDATE Player_stats SET total_play_time=2150, deaths=6, enemies_defeated=19, victories=4, coins_earned=1150, cards_played=122 WHERE user_id=32;
UPDATE Player_stats SET total_play_time=1600, deaths=5, enemies_defeated=9, victories=2, coins_earned=530, cards_played=62 WHERE user_id=33;
UPDATE Player_stats SET total_play_time=900, deaths=6, enemies_defeated=15, victories=3, coins_earned=870, cards_played=88 WHERE user_id=34;
UPDATE Player_stats SET total_play_time=2500, deaths=4, enemies_defeated=6, victories=1, coins_earned=310, cards_played=45 WHERE user_id=35;
UPDATE Player_stats SET total_play_time=1350, deaths=3, enemies_defeated=8, victories=2, coins_earned=490, cards_played=54 WHERE user_id=36;
UPDATE Player_stats SET total_play_time=1700, deaths=3, enemies_defeated=5, victories=1, coins_earned=350, cards_played=40 WHERE user_id=37;
UPDATE Player_stats SET total_play_time=2800, deaths=4, enemies_defeated=9, victories=2, coins_earned=620, cards_played=72 WHERE user_id=38;
UPDATE Player_stats SET total_play_time=1100, deaths=2, enemies_defeated=2, victories=0, coins_earned=100, cards_played=16 WHERE user_id=39;
UPDATE Player_stats SET total_play_time=2350, deaths=3, enemies_defeated=5, victories=1, coins_earned=280, cards_played=38 WHERE user_id=40;

CALL sp_refresh_global_stats();
