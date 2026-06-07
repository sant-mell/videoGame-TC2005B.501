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
│   │   ├── duel/                    # duel scene
│   │   │   ├── duel.html / duel.js  # entry point and Game class
│   │   │   ├── player_turn.js / enemy_turn.js   # turn logic
│   │   │   ├── game_cards.js / game_update.js   # card definitions and update loop
│   │   │   ├── render.js / layout.js / input.js # drawing, UI, keyboard
│   │   │   ├── duel_stats.js        # posts result to /duel-result on win or loss
│   │   │   └── duel_checkpoint.js   # saves mid-duel state to /duel-checkpoint
│   │   └── map/                     # map scene
│   │       ├── map.html / map.js    # entry point and node graph traversal
│   │       ├── saving_system.js     # calls /save-progress and /load-game
│   │       └── map_upgrade.js       # upgrade node logic
│   └── scripts/                     # JS for the web frontend pages
│       ├── createaccount.js         # calls /register
│       ├── mainmenu.js              # calls /login
│       ├── menu.js                  # handles menu navigation
│       └── statistics.js            # calls /stats/personal and /stats/global
├── database/
│   ├── schema.sql                   # tables, views, triggers, stored procedures
│   ├── data.sql                     # seed data
│   └── gen_data.sql                 # larger generated seed dataset
└── docs/
    ├── GDD/                         # Game Design Document
    └── Databases/                   # ER diagrams and DB documentation
```

---

## Game Overview

The Fool's Descent is a roguelike card game where you navigate a map, fight enemies, and manage your hand to survive until you reach The Dealer.

---

## How to Run the Game

### 1. Clone the repository

```bash
git clone https://github.com/sant-mell/videoGame-TC2005B.501.git
cd videoGame-TC2005B.501
```

### 2. Start the server

```bash
node FoolsDescent/backend/server.js
```

### 3. Open the main menu

```bash
# Brave
brave-browser FoolsDescent/client/frontend/menu.html

# Chrome
google-chrome FoolsDescent/client/frontend/menu.html

# Firefox
firefox FoolsDescent/client/frontend/menu.html
```

Log in or create an account and play from there.

---

## Starting Scene

Run `server.js` locally first, then open `FoolsDescent/client/frontend/menu.html`. Log in and the game will take you through the rest.

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

- Duel: player and enemy take turns drawing from the Great Deck and picking a target
- Great Deck with randomized Sun/Moon cards, shown at the start of each round
- All 16 character cards:
  - *Common:* The Magician, The Chariot, Page of Pentacles, The Star, Strength, Two of Pentacles
  - *Rare:* The High Priestess, The Hermit, Justice, Wheel of Fortune, King of Pentacles
  - *Epic:* The Lovers, The Tower, The Hanged Man, The Devil
  - *Legendary:* The Fool
- Hovering a card shows its name and effect
- Candle health system with animations
- Enemy AI that plays cards and draws automatically
- Cards animate when played or discarded
- Sound effects and background music
- Win/lose detection with a defeated enemy sprite
- Coin tracking
- Map scene with The Fool walking between nodes
- Map generates differently every run (node types and paths are randomized)
- Three duel difficulties on the map: easy (Drunk and Peasant), intermediate (Jester and Knight), and The Dealer as the final boss
- Login and account creation working with a local MySQL Workbench database
- Save and load working, map position carries over between sessions
- Web pages (menu, login, create account, tutorial, statistics) connected to MySQL

### In Progress

- Cards in hand are not tied to game progression yet
- Cards don't save between sessions yet
- Upgrade and rest nodes on the map are not implemented
- Statistics page does not pull data yet
- *Page of Pentacles* and *King of Pentacles* give coin bonuses but coins don't persist yet so nothing actually saves

