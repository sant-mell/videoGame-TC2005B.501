
# The Fool´s Descent

![Logo Juego](https://raw.githubusercontent.com/sant-mell/myTC2005B/main/Fool/Gemini_Generated_Image_om4mquom4mquom4m.png)

**© 2025 ________ . All rights reserved.**

![Logo TEC](https://javier.rodriguez.org.mx/itesm/2014/tecnologico-de-monterrey-blue-med.png)

## _Game Design Document_

Not so long ago, there was only **The Dealer** and the **Great Deck** was full. The apparition of the universe, life, love, death, and every heartbeat was shuffled and assigned to the world's spirits with an organized Great Deck and dealt by an wise, expert dealer who knew what was best for the order of the universe.

Due to an unknown change of events, the dealer has become bored and cynical, and has chosen to change things up. He shuffled the Great Deck and threw its cards like autumn leaves across the mortal plane.

You are **The Fool**, the only born soul born without an assigned future in a dying and chaotic world where fate has become anarchic. To save what remains, you must dive into the unknown, face **The Dealer** at his own table and gamble the right to exist.

---

## Authors
- Santiago Aguilar Mello  
- Miguel Eduardo Vega Bisonó  
- Regina Fernanda Portela Palacios  

## Teachers
- Esteban Castillo Juarez  
- Gilberto Echeverría Furió  
- Jose Angel Martínez Navarro  

---

# Game Overview

- Genre: Trading Card Game, Roguelike  
- Platform: PC  
- Target Audience:  Strategy, Roguelike Players  
- Unique Selling Points:  Decision-Based fate System, Dark Humor, Tarot theme

## Game Overview (Expanded)

### Target Audience
- Casual or hardcore players?
- Fans of strategy or luck-based games?
- Age range?

### Unique Selling Points
- What makes your mechanic unique?
- What emotional experience is different?

### Questions
- What makes your game memorable after one run?
- What is the ONE sentence that sells your game?

---

# Core Gameplay Loop

Draw card → Decide target → Resolve effect → Manage risk → Repeat

### Questions
- What is the main decision each turn?
- Where does tension peak?
- Why does the player keep playing?

---

# Game Design

## Gameplay

The Fool’s Descent is an indie tabletop roguelike trading card game where the player explores a procedurally generated map and battles opponents using a deck of cards with strategic decision-making and risk management.

The gameplay unfolds on a wooden table. Each participant chooses the target of the next hidden card.

### Gameplay Questions

- Is the game skill-based or luck-based?
- How much control does the player have?
- Can players plan ahead or only react?
- How do you prevent frustration from randomness?

---

## Cards

Main Deck (amount of cards in deck is random)

Only two types of cards…

“The Sun changes nothing.”  
“The Moon changes everything.”

“These are not fortunes.”  
“They are outcomes.”

### The Sun
Nothing happens.

Sun cards give positive fortunes:

- “You can now blink voluntarily”
- “You can remember your past…”
- “You can now read your own thought”
- “You can now see through glass”
- “You can now touch grass”

### The Moon
Lose one life.

Moon cards give negative fortunes:

- “Spontaneous combustion”
- “You will be hit by a car”
- “You are allergic to oxygen”
- “You attract bullets”

---

## Card System Expansion

### Distribution
- What is the probability of Sun vs Moon?
- Does it change over time?

### Balance
- Are Moon cards too punishing?
- Are Sun cards too safe?

### Questions
- Can players manipulate probability?
- Is there a way to predict outcomes?

---

## Characters Deck Options

### Common Cards
- The Magician  
- The Chariot  
- The Star  
- Page of Pentacles  
- Strength  
- Two of Pentacles  

### Rare Cards
- The High Priestess  
- The Hermit  
- Justice  
- Wheel of Fortune  

### Epic Cards
- The Lovers  
- The Tower  
- The Devil  
- The Hanged Man  

### Legendary Cards
- The Fool  
- King of Pentacles  

---

# Mindset

What kind of mindset do you want to provoke?

## Expanded

- Tension  
- Uncertainty  
- Dark humor  

### Questions
- Should the player feel in control or helpless?
- Is failure funny or frustrating?
- What should the player feel at the end?

---

# Progression

### Questions
- What persists between runs?
- How does the player get stronger?
- Why replay?

---

# Game Economy

### Resources
- Lives  
- Coins  
- Cards  
- Risk  

### Questions
- What is the most valuable resource?
- Can players farm resources?
- What prevents imbalance?

---

# Opponents

### Questions
- How many enemy types?
- Do they behave differently?
- Are bosses unique?

---

# Technical

## Screens

### Main Screen
Buttons: [New Descent], [Options], [Exit]

### Level Selection
Graph map with nodes:
- Battle  
- Boss  
- Mystery  
- Merchant  
- Rest  

### Duel
- 10 card slots  
- Shared deck  

### Upgrade
Buttons: [Exit], [Infuse]

---

## UI / UX

### Questions
- Is information clear?
- Can players understand the game instantly?
- Is feedback strong enough?

---

## Controls

Mouse: drag cards  
Keyboard: ESC, SPACE  

---

## Mechanics

### Duel Mechanics
Each player has 3 lives

### Prophecy Deck
- Deck Size: `S = base + random(0,2)`
- Moon cards: random distribution

### Effects
- Moon: damage  
- Sun: extra turn  

### Questions
- Is randomness fair?
- Can players predict outcomes?

---

# Art Direction

### Questions
- What visual style defines the game?
- How do Sun and Moon differ visually?

---

# Sound Design

### Questions
- What sounds signal danger?
- Does music increase tension?

---

# Level Design

### Questions
- Are choices meaningful?
- Can players plan routes?

---

# Schedule

### Milestones
- Prototype  
- Alpha  
- Beta  

### Questions
- What is the next step?
- What is the biggest risk?
