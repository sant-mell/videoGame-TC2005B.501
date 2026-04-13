
# The Fool´s Descent

![Logo Juego](https://raw.githubusercontent.com/sant-mell/myTC2005B/main/Fool/Gemini_Generated_Image_om4mquom4mquom4m.png)

---

## _Game Design Document_

**© 2026 Team 7. All rights reserved.**

The following content is owned by its creators. Use without written permission is strictly prohibited. 

---

## Authors
- Santiago Aguilar Mello  
- Miguel Eduardo Vega Bisonó  
- Regina Fernanda Portela Palacios  

---

## Teachers
- Esteban Castillo Juárez  
- Gilberto Echeverría Furió  
- José Ángel Martínez Navarro  

---

![Logo TEC](https://javier.rodriguez.org.mx/itesm/2014/tecnologico-de-monterrey-blue-med.png)

---

# Index

1. [Index](#index)
2. [Game Design](#game-design)
    1. [Summary](#summary)
    2. [Gameplay](#gameplay)
    3. [Mindset](#mindset)
3. [Technical](#technical)
<!-- Listo hasta aquí / Entrega 1 -->

1. [Screens](#screens)
2. [Controls](#controls)
3. [Mechanics](#mechanics)
4. [Level Design](#level-design)
1. [Themes](#themes)
1. Ambience
2. Objects
1. Ambient
2. Interactive
3. Challenges
2. [Game Flow](#game-flow)
5. [Development](#development)
1. [Abstract Classes](#abstract-classes--components)
2. [Derived Classes](#derived-classes--component-compositions)
6. [Graphics](#graphics)
1. [Style Attributes](#style-attributes)
2. [Graphics Needed](#graphics-needed)
7. [Sounds/Music](#soundsmusic)
1. [Style Attributes](#style-attributes-1)
2. [Sounds Needed](#sounds-needed)
3. [Music Needed](#music-needed)
8. [Schedule](#schedule)

---

# Game Design

## Summary

Not so long ago, there was only The Dealer and the Great Deck. The apparition of the universe, life, love, death and every heartbeat, was shuffled and assigned to the world's spirits and dealt by a wise, expert dealer who knew what was best for the cycle of life.

Due to an unknown change of events, The Dealer has become bored, cynical and has chosen to change things up. He shuffled the Great Deck and threw its cards like autumn leaves across the mortal plane.

You are The Fool, the only born soul without an assigned future in a dying and chaotic world where fate has become anarchic. To save what remains, you must dive into the unknown, face The Dealer at his own table and gamble the right to exist.

- **Genre:** Trading Card Game, Roguelike  
- **Platform:** PC  
- **Target Audience:**  Casual Strategy, Roguelike Players - Ages 13+  
- **Unique Selling Points:**  Decision-Based Fate System, Dark Humor, Tarot Theme

---

## Gameplay

The Fool's Descent is an indie tabletop roguelike card game in which the player navigates a procedurally generated map and confronts opponents through a system built on tension, probability and choice. The gameplay takes place a tarot table, to reinforce the sensation that the player is gambling with their future. On the side lies the Great Deck, the centre of the game, composed of a random number of cards, which include either life or death outcomes, shuffled randomly at the start of each combat. In front of the players we can find their Characters Deck, which functions as their weapons to battle what the Great Deck reveals.

The core loops consists in: Draw card → Manage risk (With your Characters Deck) → Decide target → Resolve effect → Repeat

Managing risk is vital, as the player must choose whether to intervene before deciding the target and commiting to the result, using one of their limited options to alter the future. What sustains engagement is the constant negotiation between fate and control. In this balance, the game ensures that every run feels uncertain, but never unfair, just like life. But remember, each decision contributes meaningfully to the players descent.

### Great Deck

Only two types of cards…

“The Sun changes nothing, The Moon changes everything”

“These are not fortunes, they are futures”

#### The Sun
Nothing happens.

Positive fortunes:

- “The Sun stands upright. Life is restored”
- “Light reveals a path forward”
- “The arcana favors you. You remain”
- “Vitality returns under the Sun’s gaze”
- “The light dispels what sought to end you”
- “Your thread holds beneath the Sun”
- “The card speaks of life. You endure”
- “Clarity guides you away from ruin”
- “The Sun grants renewal”
- “Hope rises and so do you”

#### The Moon
The target loses one life.

Negative fortunes:

- “The Moon reveals your end”
- “The arcana turned against you”
- “Illusion fades. The truth is death”
- “The path is lost beneath the Moon”
- “What was hidden now consumes you”
- “Your thread is severed in shadow”
- “The card speaks of endings. You fall”
- “Darkness claims what remains”
- “The Moon obscures all escapes”
- “Fate is sealed under the night”

### Characters Deck Options

#### Common Cards
- *The Magician:* Repeats the effect of the last card played by the character during this combat.  
- *The Chariot:* Throws away the top card of the Great Deck.   
- *The Star:* When you reach 0 lives it revives you with an extra single one.  
- *Page of Pentacles:* If you win the next round it gives you a coin bonus.   
- *Strength:* During the next round you are immune to death.   
- *Two of Pentacles:* Draw two cards from the Great Deck, choose one to resolve, the other is annulled.  

#### Rare Cards
- *The High Priestess:* Can see the next card from the Great Deck.  
- *The Hermit:* Skips your next draw phase entirely.   
- *Justice:* If you lose a life during your next turn, your opponent loses one too.
- *Wheel of Fortune:* Shuffles the Great Deck. 
- *King of Pentacles:* If you win the award money doubles, but if you lose the loss one does too. 

#### Epic Cards
- *The Lovers:* Gain one life OR Permanently remove one moon card from the Great Deck.
- *The Tower:* Randomly destroys 50% of your enemy Characters Deck.  
- *The Devil:* You gain two lives BUT It adds one additional moon card to the Great Deck.   
- *The Hanged Man:* Blocks the other player from using their Characters Deck cards during their next turn.   

#### Legendary Cards
- *The Fool:* Randomly applies any of the existing cards, even if they are not in your Characters Deck.  

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

## Mindset

What kind of mindset do you want to provoke?

## Expanded

- Tension  
- Uncertainty  
- Dark humor  

### Questions
- Should the player feel in control or helpless?
- Is failure funny or frustrating?
- What should the player feel at the end?
- What makes your game memorable after one run?
- What is the ONE sentence that sells your game?

---

# Technical
<!-- Listo hasta aquí / Entrega 1 -->

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
