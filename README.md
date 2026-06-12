# The Fool's Descent

![Logo Juego](FoolsDescent/assets/images/Gemini_Generated_Image_om4mquom4mquom4m.png)

**© 2026 Arcana Studios. All rights reserved.**

Santiago Aguilar Mello · Miguel Eduardo Vega Bisonó · Regina Fernanda Portela Palacios

---

## Project Structure

```
FoolsDescent/
├── assets/
│   ├── audio/                       # music and sound effects
│   └── images/                      # sprites and backgrounds
├── backend/
│   ├── server.js                    # Express API: register, login, save, duel-result, stats
│   ├── package.json                 # npm dependencies
│   └── package-lock.json            # locked dependency versions
├── client/
│   ├── frontend/                    # web pages served by Express
│   │   ├── menu.html                # login screen
│   │   ├── mainmenu.html            # main menu after login
│   │   ├── createaccount.html       # account creation form
│   │   ├── statistics.html          # stats display page
│   │   ├── tutorial.html            # how to play
│   │   └── welcome.html             # landing page
│   ├── scenes/
│   │   ├── duel/                    # duel scene (one set of files per enemy tier)
│   │   │   ├── duel.js / duel_easy.js / duel_intermedio.js / duel_dealer.js
│   │   │   │                        # Game class and initObjects for each tier
│   │   │   ├── player_turn.js / easy_player_turn.js / intermedio_player_turn.js / dealer_player_turn.js
│   │   │   │                        # player turn logic per tier
│   │   │   ├── enemy_turn.js / easy_enemy_turn.js / intermedio_enemy_turn.js / dealer_enemy_turn.js
│   │   │   │                        # enemy AI per tier
│   │   │   ├── game_cards.js        # all 16 card definitions and shared card utilities
│   │   │   ├── game_update.js       # shared update loop
│   │   │   ├── render.js / layout.js / input.js  # drawing, UI, keyboard
│   │   │   ├── duel_stats.js        # posts result to /duel-result on win or loss
│   │   │   └── duel_checkpoint.js   # saves mid-duel state to /duel-checkpoint
│   │   └── map/                     # map scene
│   │       ├── map.html / map.js    # entry point and node graph traversal
│   │       ├── saving_system.js     # calls /save-progress and /load-game
│   │       ├── map_upgrade.js       # upgrade node logic
│   │       ├── introduction.js      # intro cutscene
│   │       └── victory.js           # victory screen after defeating The Dealer
│   └── scripts/                     # JS for the web frontend pages
│       ├── createaccount.js         # calls /register
│       ├── mainmenu.js              # calls /login
│       ├── menu.js                  # handles menu navigation
│       └── statistics.js            # calls /stats/personal and /stats/global
├── database/
│   ├── schema.sql                   # tables, views, triggers, stored procedures
│   ├── data.sql                     # seed data
└── docs/
    ├── GDD/                         # Game Design Document
    └── Databases/                   # ER diagrams and DB documentation
```

---

## Game Overview

The Fool's Descent is a roguelike card game where you navigate a map, fight enemies, and manage your hand to survive until you reach The Dealer.

---

## How to Run the Game

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- MySQL 8.x (MySQL Workbench or any MySQL client to run the SQL files)

### 1. Clone the repository

```bash
git clone https://github.com/sant-mell/videoGame-TC2005B.501.git
cd videoGame-TC2005B.501
```

### 2. Set up the database

Open MySQL Workbench (or any MySQL client) connected to `localhost` as `root` and run the two SQL files in order:

```
FoolsDescent/database/schema.sql   ← creates the database, tables, views, triggers
FoolsDescent/database/data.sql     ← seeds cards, enemies, and upgrades
```

The schema file drops and recreates the `fools_descent` database, so running it on a fresh install is safe.

The server connects with `user: root` and `password: 1234`. If your MySQL root password is different, edit those two lines at the top of `FoolsDescent/backend/server.js` before continuing.

### 3. Install backend dependencies

```bash
cd FoolsDescent/backend
npm install
cd ../..
```

### 4. Start the server

```bash
node FoolsDescent/backend/server.js
```

You should see `Connected to MySQL` in the terminal. Leave this running.

### 5. Open the game

Open **`http://localhost:3000/client/frontend/menu.html`** in your browser. Do not open the HTML file directly — it must be served by the Express server or fetch calls will be blocked by the browser's security model.

```bash
# Brave
brave-browser http://localhost:3000/client/frontend/welcome.html

# Chrome
google-chrome http://localhost:3000/client/frontend/welcome.html

# Firefox
firefox http://localhost:3000/client/frontend/welcome.html
```

Create an account and log in — the game will take you through the rest.

---

## Controls

All controls depend on the cursor. For debugging, `y` shows hitboxes.

- **Start the game:** click the Start button at the center of the screen
- **Play a character card:** click a card from your hand at the bottom of the screen
- **Preview a card:** hover over it to see its description
- **Draw from the Great Deck:** click the Great Deck (the stack facing down) on the table
- **Target the enemy:** click on the enemy after drawing
- **Target yourself:** click the Us button after drawing
- **Two of Pentacles choice:** click the left or right card when the choice appears

---

## Functionality

### Done

- Duel with four difficulty tiers:
  - *Easy:* Drunk and Peasant
  - *Intermediate:* Crazy Jester and Bounded Knight
  - *Epic:* Mad Monarch and Killer Queen
  - *Boss:* The Dealer (with intro dialogue and double-card mechanic every third turn)
- Player and enemy take turns drawing from the Great Deck and picking a target
- Great Deck with randomized Sun/Moon counts, shown at the start of each round
- All 16 character cards:
  - *Common:* The Magician, The Chariot, Page of Pentacles, The Star, Strength, Two of Pentacles
  - *Rare:* The High Priestess, The Hermit, Justice, Wheel of Fortune, King of Pentacles
  - *Epic:* The Lovers, The Tower, The Hanged Man, The Devil
  - *Legendary:* The Fool
- Hovering a card shows its name and effect
- Candle health system with animations
- Enemy AI that plays cards and draws automatically, with per-tier behavior and probabilities
- Cards animate when played or discarded
- Sound effects and background music per difficulty tier
- Win/lose detection with a defeated enemy sprite
- Player deck saves to the database after each duel and loads at the start of the next
- Mid-duel state saves to the database each turn and restores on page reload
- Coin tracking: 100 per non-boss victory, 300 for defeating The Dealer; persists via localStorage
- Page of Pentacles and King of Pentacles coin bonuses apply and persist correctly
- Map scene with The Fool walking between nodes
- Upgrade nodes with a full canvas UI:
  - *Card Binding* (100 coins): binds a chosen card so it survives death
  - *Life Extension* (150 coins): increases maximum lives
  - *Extra Card* (50 coins): opens a picker so the player chooses any of the 15 non-Fool cards
- Login and account creation working with a local MySQL Workbench database
- Map position carries over between sessions
- Full statistics page: personal and global stats, leaderboards by victories and coins, charts for win/loss ratio, enemy winrate, difficulty winrate, card popularity, and upgrade popularity
- Introduction cutscene before the map and victory screen after defeating The Dealer
