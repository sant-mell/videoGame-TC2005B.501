# The Fool's Descent

![Logo Juego](/assets/images/Gemini_Generated_Image_om4mquom4mquom4m.png)

**© 2026 Arcana Studios. All rights reserved.**

Santiago Aguilar Mello · Miguel Eduardo Vega Bisonó · Regina Fernanda Portela Palacios

---

## Game Overview

The Fool's Descent is a roguelike card game where you navigate a map, fight enemies, and manage your hand to survive until you reach The Dealer.

---

## How to Run the Game

##You can simply click on the [link](https://foolsdescent.netlify.app/web/menu) to play online or play it locally

### 1. Clone the repository

```bash
git clone https://github.com/sant-mell/videoGame-TC2005B.501.git
cd videoGame-TC2005B.501
```

### 2. Open the prototype (duel scene)

Open `prototipo/prototipo.html` in your browser:

```bash
# Brave
brave-browser prototipo/prototipo.html

# Chrome
google-chrome prototipo/prototipo.html

# Firefox
firefox prototipo/prototipo.html
```

### 3. (Optional) Open the map scene

```bash
# Brave
brave-browser map/map.html

# Chrome
google-chrome map/map.html

# Firefox
firefox map/map.html
```

### 4. (Optional) Open the main menu

```bash
# Brave
brave-browser "The Fools Descent Web/menu.html"

# Chrome
google-chrome "The Fools Descent Web/menu.html"

# Firefox
firefox "The Fools Descent Web/menu.html"
```

---

## Starting Scene

The prototype starts at the duel scene (`prototipo/prototipo.html`). Click the **Start** button to begin. The game will show the Great Deck contents for a few seconds, then the duel against the Mad Monarch begins.

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
- All 15 character cards:
  - *Common:* The Magician, The Chariot, Page of Pentacles, The Star, Strength, Two of Pentacles
  - *Rare:* The High Priestess, The Hermit, Justice, Wheel of Fortune, King of Pentacles
  - *Epic/Legendary:* The Lovers, The Tower, The Hanged Man, The Devil
- Hovering a card shows its name and effect
- Candle health system with animations
- Enemy AI that plays cards and draws automatically
- Cards animate when played or discarded
- Sound effects and background music
- Win/lose detection with a defeated enemy sprite
- Coin tracking
- Map scene with The Fool walking between nodes
- Web frontend pages (menu, login, create account, tutorial, statistics) with a working MySQL Workbench connection

### In Progress

- Map and duel are not connected yet, they run as separate scenes
- Players start with cards in their hand, but it is not yet connected to game progression.
- Only the Mad Monarch is active; other enemies are not yet selectable
- Map generation is not procedural yet
- Upgrade and rest nodes on the map are not implemented
- Login and account creation pages are functional, but dependent on a local MySQL Workbench database
- Save state and statistics database are not functional yet
- The Fool legendary card is not in rotation yet
- Statistics page does not pull data yet
- *Page of Pentacles* gives a coin bonus when you draw a Sun after playing it, and *King of Pentacles* doubles that bonus. Both cards are in the game, but since coins are not persistent yet, no coins are actually given

---

## Project Structure

```
prototipo/ # Duel prototype (main playable scene)
map/ # Map scene
The Fools Descent Web/ # Web frontend
assets/ # Images and audio
GDD/ # Game Design Document
```
