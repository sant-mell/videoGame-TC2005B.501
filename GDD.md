
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
- *The Star:* When you reach 0 lives it revives you with a singular extra life.  
- *Page of Pentacles:* If you win in the next round it gives you a coin bonus. 
- *Strength:* During the next round you cannot die.
- *Two of Pentacles:* Draw two cards from the Great Deck, choose one to use, the other is thrown away.  

![Common cards](https://github.com/sant-mell/videoGame-TC2005B.501/blob/main/Common%20Cards.png?raw=true)

#### Rare Cards
- *The High Priestess:* Can see the next card from the Great Deck.  
- *The Hermit:* Skips your next draw phase entirely.   
- *Justice:* If you lose a life during your next turn, your opponent loses one too.
- *Wheel of Fortune:* Shuffles the Great Deck. 
- *King of Pentacles:* If you win the award money doubles, but if you lose the loss money does too. 

![Rare cards](https://github.com/sant-mell/videoGame-TC2005B.501/blob/main/Rare%20Cards.png?raw=true)

#### Epic Cards
- *The Lovers:* Permanently remove one moon card from the Great Deck.
- *The Tower:* Randomly destroys 50% of your enemy Characters Deck.  
- *The Devil:* You gain two lives BUT It adds one additional moon card to the Great Deck.   
- *The Hanged Man:* Blocks the other player from using their Characters Deck cards during their next turn.   

![Epic cards](https://github.com/sant-mell/videoGame-TC2005B.501/blob/main/Legendary%20Cards.png?raw=true)

#### Legendary Cards
- *The Fool:* Randomly applies any of the existing cards, even if they are not in your Characters Deck.  

![Legendary cards](https://github.com/sant-mell/videoGame-TC2005B.501/blob/main/Epic%20Cards.png?raw=true)
---

# Progression

### Questions


### Resources
- Lives: 3 lives player and enemy. The lives are represented by a candle.
- Coins: Coins can be used at certain points in the map to buy power ups or cards. Th eplayer will have the choice of buying it or not. The player wins coins by winning against enemies or by selling cards. Coins are kept after each reincarnation or replay.
- Cards: 15 cards that help the player manage the risk of moon and sun cards in the main deck.

The only resource that has any value is the coins, player can farm these coins by playing the "King of Pentacles" and then eventually losing against another enemy. Epic and legendary cards are really expensive to buy, so getting them won't be easy, but are not needed to win, therefore there is no imbalance since getting legendary or epic cards does not necesarily mean that the player will win.

# Opponents

### Questions
- How many enemy types?
- Do they behave differently?
- Are bosses unique?

There are 6 possible enemies and 1 final boss:

### Easy enemies:

"Drunk" 
![Easy Enemies](Drunk.png)

"Peseant"
![Easy Enemies](Peseant.png)

These enemies, only use one of their cards every second turn, and their cards are common.

### Mid difficulty enemies:

"Crazy Jester"
![Mid difficulty enemies](Jester.png)

"Bounded Knight"
![Mid difficulty enemies](Knight.png)

These enemies will not use one of their cards every 3rd turn, and their cards have a few rares.

### High difficulty enemies:

"Killer Queen" 
![High difficulty enemies](Killer_Queen.png)

"The Big King"
![High difficulty enemies](The_king.png)

These enemies use their cards every turn and have some epic cards.

### Final Boss:

 "The Dealer"
 ![Final Boss](Dealer.png)

This enemy will use two cards every turn and has the legendary card.

## Mindset

What kind of mindset do you want to provoke?

- Tension  
- Uncertainty  
- Dark humor  

The mindset this game should evoke on the players should be uncertainty and adventure, with a hint of dark humour. This mindset will be created by the medieval/magical visuals and the eerie and mysterious music. The style and story add to the ambiance that will make the game memorable from the start

The player should at first feel helpless as thier cards will do little against the enemies, but as the game progresses the player's character deck will get better and the battles easier. Completing the game in one run would be near impossible and would requiere an impessive ammount of luck. Failure should be frustrating as that means you have to start again, but with more money and better cards.

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
