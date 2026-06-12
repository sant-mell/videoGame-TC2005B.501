



# The Fool´s Descent




![Logo Juego](../../assets/images/Gemini_Generated_Image_om4mquom4mquom4m.png)




---




## _Game Design Document_




**© 2026 Arcana Studios. All rights reserved.**




The following content is owned by its creators. Use without written permission is strictly prohibited.


![Studio Logo](../../assets/images/Studio%20Logo.png)

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
        1. [Great Deck](#great-deck)
            - [The Sun](#the-sun)
            - [The Moon](#the-moon)
        2. [Characters Deck Options](#characters-deck-options)
            - [Common Cards](#common-cards)
            - [Rare Cards](#rare-cards)
            - [Epic Cards](#epic-cards)
            - [Legendary Cards](#legendary-cards)
    3. [Mindset](#mindset)
3. [Progression](#progression)
    1. [Map](#map)
        - [Upgrades](#upgrades)
4. [Duel](#duel)
5. [Items and Currencies](#items-and-currencies)
6. [Opponents](#opponents)
    1. [Common Enemies](#common-enemies)
    2. [Rare Enemies](#rare-enemies)
    3. [Epic Enemies](#epic-enemies)
    4. [Legendary and Final Enemy](#legendary-and-final-enemy)
7. [Technical](#technical)
    1. [Screens](#screens)
    2. [Controls](#controls)
    3. [Mechanics](#mechanics)
        - [Duel Mechanics](#duel-mechanics)
        - [Prophecy Deck](#prophecy-deck)
        - [Effects](#effects)
        - [Upgrade](#upgrade)
        - [Health System](#health-system)
    4. [UI / UX](#ui--ux)
    5. [Statistics](#statistics)
    6. [Data Collection](#data-collection)
8. [Development](#development)
    1. [Abstract Classes](#abstract-classes--components)
    2. [Derived Classes](#derived-classes--component-compositions)
9. [Art Direction](#art-direction)
    1. [Themes](#themes)
    2. [Visual References](#visual-references)
    3. [Movement](#movement)
    4. [Animation](#animation)
    5. [Colors](#colors)
    6. [Enemy Design](#enemy-design)
    7. [Cards](#cards)
    8. [Sound Design](#sound-design)
    9. [Level Design](#level-design)
    10. [AI Generated Images](#ai-generated-images)
10. [Schedule](#schedule)

---




# Game Design




## Summary




Not so long ago, there was only [The Dealer](#summary) and the [Great Deck](#great-deck). The apparition of the universe, life, love, death and every heartbeat, was shuffled and assigned to the world's spirits and dealt with by a wise, expert who knew what was best for the cycle of life.




Due to an unknown change of events, [The Dealer](#summary) has become bored, cynical and has chosen to change things up. He shuffled the [Great Deck](#great-deck) and threw its cards like autumn leaves across the mortal plane.




You are [The Fool](#summary), the only born soul without an assigned future in a dying and chaotic world where fate has become anarchic. To save what remains, you must dive into the unknown, face [The Dealer](#summary) at his own table and gamble the right to exist.




- **Genre:** Trading Card Game, Roguelike
- **Platform:** PC
- **Target Audience:**  Casual Strategy, Roguelike Players - Ages 13+
- **Unique Selling Points:**  Decision-Based Fate System, Dark Humor, Tarot Theme




---




## Gameplay




The Fool's Descent is an indie tabletop roguelike card game in which the player navigates a procedurally generated [map](#map) and confronts opponents through a system built on tension, gambling, probability and choice. The gameplay takes place at a tarot table, to reinforce the sensation that the player is gambling with their future. On the side lies the [Great Deck](#great-deck), the centre of the game, composed of a random number of cards, which include either life or death outcomes, shuffled randomly at the start of each combat. In front of the players we can find their [Characters Deck](#characters-deck-options), which functions as their weapons to battle what the Great Deck reveals.




The core loops consists in: Draw card → Manage risk (With your [Characters Deck](#characters-deck-options)) → Decide target → Resolve effect → Repeat




Managing risk is vital, as the player must choose whether to intervene before deciding the target and committing to the result, using their limited options to alter the future. What sustains engagement is the constant negotiation between fate and control. In this balance, the game ensures that every run feels uncertain, but never unfair, just like life. But remember, each decision contributes meaningfully to the player's descent.




![GameBoard](../../assets/images/Duel.png)




### Great Deck




Only two types of cards…




“The Sun provides an opportunity, The Moon changes everything”

![Sun and Moon](../../assets/images/Sun%20and%20Moon.png)


“These are not fortunes, they are futures”




#### The Sun
Provides a turn.




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
- *The Magician:* Repeats the effect of the last card played during this combat.
- *The Chariot:* Throws away the top card of the [Great Deck](#great-deck). 
- *The Star:* When you reach 0 lives it revives you with a singular extra life.
- *Page of Pentacles:* If you win this duel it gives you a 50 coin bonus.
- *Strength:* During the next draw you cannot lose a life.
- *Two of Pentacles:* Draw two cards from the [Great Deck](#great-deck), choose one to use, the other is thrown away.




![Common cards](../../assets/images/Common%20Cards.png)




#### Rare Cards
- *The High Priestess:* Can see the next card from the [Great Deck](#great-deck).
- *The Hermit:* Blocks enemy's turn.  
- *Justice:* If you lose a life on the current turn or the following turn after playing this card, your opponent loses one too.
- *Wheel of Fortune:* Shuffles the [Great Deck](#great-deck).
- *King of Pentacles:* If you win this duel, the coin reward doubles, but if you lose it also does.




![Rare cards](../../assets/images/Rare%20Cards.png)




#### Epic Cards
- *The Lovers:* Permanently remove one [moon card](#the-moon) from the [Great Deck](#great-deck).
- *The Tower:* Randomly destroys 50% of your enemy [Characters Deck](#characters-deck-options).
- *The Devil:* You gain two lives BUT It adds one additional [moon card](#the-moon) to the [Great Deck](#great-deck). 
- *The Hanged Man:* Blocks the other player from using their Characters Deck cards during their next turn. 




![Epic cards](../../assets/images/Legendary%20Cards.png)




#### Legendary Cards
- *The Fool:* Randomly applies any of the existing cards, even if they are not in your [Characters Deck](#characters-deck-options).




![Legendary cards](../../assets/images/Epic%20Cards.png)
---




# Progression


The player will start with zero cards and money. They must [duel](#duel) a common enemy first in a match with an empty hand.  After this first battle, a procedurally generated [map](#map) will be shown, where the player must weigh their decisions to what benefits them the most; having a duel or not, facing the boss headfirst or risk a duel beforehand to get more cards and money and prioritize card collection for a next run. If the player dies during a duel, they will lose all of their cards but be able to keep half of their coins.

## Map
The map uses a fixed 4-column grid structure, stylized to match the pixelated tarot style. It has 10 nodes in total: a starting rest node, 8 intermediate nodes (4 enemies and 4 upgrades arranged in 4 columns of 2 in random vertical order), and a final boss node.

1. **Nodes:** Each node will include an enemy, upgrade, or the starting rest site:
    - *Enemy:* Refer to the [enemy specifications](#opponents)
    - *Upgrade:* Refer to the [upgrade specifications](#upgrades)
    - *Rest:* The starting node only. It places the player at the beginning of the map.
2. **Paths:** Each column has exactly one enemy node and one upgrade node. The player starts at the far left and advances toward the boss on the far right.

Enemy difficulty scales by column: column 1 spawns only common enemies; column 2 skews heavily toward rare; column 3 skews toward epic. The boss is always the final node.

![Map](../../assets/images/Final%20Map.png)

#### Upgrades
- *Card Binding* (100 coins): Spend coins to bind a card. A bound card returns to your hand at the start of the next duel even if it was used in the last one.

- *Life Extension* (150 coins): Increase the maximum lives, where the baseline starts at 3.

- *Extra Card* (50 coins): Opens a picker where the player chooses any of the 15 non-Fool character cards to carry into the next duel.

## Duel

The progression as described in [gameplay](#gameplay) is made in the following manner:


1. The [sun](#the-sun) and [moon](#the-moon) cards that will be put on the [main deck](#great-deck) are shown, shuffled and the put face down on the table.
2. The player will be able to choose a card from their [Characters Deck](#characters-deck-options).
3. The player must choose the target of the current card on top of the deck; either themselves or the enemy.
    - If it was a sun card and they chose themselves, they get an extra turn.
    - If it was a sun card and they chose the enemy, nothing happens. This is not purposeful, but rather what the player wants to avoid during the gameplay.
    - If it was a moon card the target loses a life.
5. The enemy repeats the process.
7. Repeat.

The Character Cards for the player are the ones kept from the past duel. No new cards are given at the start of a duel; instead, one card from the difficulty pool is awarded each time the Great Deck runs out and is rebuilt during play. The pool of cards available scales with enemy tier:
- Common enemies: common cards only
- Rare enemies: common and rare cards
- Epic enemies: common, rare, and epic cards (excluding The Fool)
- Boss: all cards including The Fool

Choosing a card from your character deck during your turn in a duel will discard it from your hand.


## Items and Currencies
- *Coins:* Coins are gained at the end of a duel: 100 per victory against common, rare, or epic enemies, and 300 for defeating the boss. They may be used at certain points in the map to buy powerups or cards. The player will have the choice of buying it or not. 50% of the coins are kept after each reincarnation.
- *Cards:* 16 cards that help the player manage the risk of [moon](#the-moon) and [sun](#the-sun) cards in the [main deck](#great-deck) during [duels](#duel).


## Opponents


In order to complete the descent and restore the order of the universe, you must ultimately confront and defeat [The Dealer](#summary). Because the [map](#map) is generated randomly for every attempt, the path ahead is never certain. Each victory you claim along the way serves a vital purpose beyond mere survival, as defeating enemies is the primary way to obtain the more powerful cards and precious coins required to afford life. While it may be tempting to avoid conflict to preserve your health in the short term, doing so will eventually leave you under-equipped, forced to rely solely on your faith in the future.




On the map, one of the enemies of each difficulty will appear, those are also randomly selected, ensuring that no journey is ever the same. The options appear below.




#### Common Enemies


- "Drunk"


![Common Enemies](../../assets/images/Drunk.png)




- "Peasant"
![Common Enemies](../../assets/images/Peseant.png)




These characters lack any real combat training, they only manage to play a basic common card every other turn, giving you plenty of time to find your footing. They have a 60% probability they attack you, 40% they target themselves. 

- **Deck composition:** Magician, Chariot, Star, Strength


#### Rare Enemies:




- "Crazy Jester"
![Rare Enemies](../../assets/images/Jester.png)


- "Bounded Knight"
![Rare Enemies](../../assets/images/Knight.png)

These are a bit more seasoned but still have their openings. While they’ve added some rare cards to their deck, they aren’t perfectly consistent, they’ll skip an action every third turn, offering you a brief window to strike back. They have a 70% probability they attack you, 30% they target themselves. 

- **Deck composition:** Hermit, Justice, Wheel of Fortune, Chariot, Strength, Hanged Man



#### Epic Enemies:




- "Killer Queen"
![Epic Enemies](../../assets/images/Queen.png)


- "Mad Monarch"
![Epic Enemies](../../assets/images/The_king.png)




These are relentless fighters who never miss a beat, playing a card every single turn. Their decks are packed with epic cards, meaning you’ll need to stay sharp just to keep up with their constant pressure. They have an 80% probability they attack you, 20% they target themselves. They will never willingly draw a Moon card onto themselves. 

- **Deck composition:** Lovers, Devil, Hanged Man, Wheel of Fortune, Hermit, Chariot, Magician


#### Legendary and Final Enemy:




- "The Dealer"
![Final Boss](../../assets/images/Dealer.png)






He doesn’t just play the game, he MAKES it. Holding the only Legendary card in existence, he always opens with The Fool as his very first card. Every third turn he plays two character cards back to back, overwhelming you before you can react. When he plays The Fool, it isn’t truly random — he draws from a curated aggressive subset of cards, never wasting it on a coin bonus or a utility draw. To beat him, you’ll have to survive a level of aggression unlike anything else you have seen before. They have a 90% probability they attack you, 10% they target themselves. 

- **Deck composition:** Fool, Lovers, Hanged Man, Justice, Hermit, Magician, Star, Devil


## Mindset


The mindset this game should evoke on the players should be uncertainty and adventure, with a hint of dark humour. This mindset will be created by the medieval/magical visuals and the eerie and mysterious music. The style and story add to the ambiance that will make the game memorable from the beginning.




At first, the sense of chance is big, but after the first round of the first duel, each character card will introduce slowly the idea of planning and thinking before playing their cards to the player. This will let the player slowly understand the slight gambling element, while introducing the ways in which they could save themselves and punish the enemy, and viceversa from the enemy's side.


Since you are "The Fool", the world must feel unknown, amusing and dreadful all at once, where the player does not know all cards, but after every victory and defeat the player will get a lesson about how the character cards, world, and map works.

---

# Technical

The key screens will be carefully selected and designed in order to enhance the user experience, focusing on a clear and understandable visuals, art styles and colors that match the atmosphere of the game, such as the following:

## Screens




### Main Screen
Buttons: 

[New Descent]: Starts a completely fresh run.

[Continue Descent]: Will retrieve all data from the database: Runs, perks, cards saved, position within the node and enemies defeated.

[Statistics]: Will display the statistics collected through the single plays and global plays. For more information, consult the statistics section.

[Tutorial]: It takes you to another page that carefully explains how to play the game.

[Logout]: Takes you back to the welcome page, so you can log in again, in case you want to change accounts or create a new one. 

![MainMenu](../../assets/images/Main%20Menu.png)


### Level Selection

Graph map with nodes: 

-  **Boss**: Will start the duel with an enemy.

-  **Upgrade**: Here the player can buy: Card Binding, Life Extension or an Extra Card. For more info, refer to upgrades.

-  **Rest:** The player will just be given a free node to move more freely. Standing on it will not do anything.



### Controls

- **Card slots for Character Cards:** The player will be able to hover over them to see their info, and click on them to choose the card they are going to use.

- **Shared deck:** Includes sun and moon cards. These will be facing down and the only thing the player will be able to do is click on them.

- **Target screen:** The player will be given a choice whether the current card selected applies to the enemy or themselves.

  
## Mechanics




### Duel Mechanics
Each player starts with 3 lives. When a participant reaches 0 lives, they lose the duel. Before the duel begins, the total number of Sun and Moon cards in the [Great Deck](#great-deck) is briefly shown to both players. The Great Deck is then shuffled and placed face-down on the table. On their turn, the player may first play a character card from their hand (this step is skipped if the hand is empty). They then draw the top card of the Great Deck and choose a target: either themselves or the enemy. The card's effect is revealed after a brief animation over the crystal ball. After the player's turn resolves, the enemy takes their turn following the same sequence. When the Great Deck runs out of cards, a new one is automatically built and shuffled, and play continues, until someone wins.

Steps:

1. Show Great Deck contents (sun/moon counts) briefly at the start.
2. Shuffle the Great Deck and place it face-down on the table.
3. Optionally play a character card from your hand.
4. Draw the top card of the Great Deck and choose a target (self or enemy).
5. Apply the card's effect.
6. Enemy's turn: They follow the same sequence.
7. Repeat until one duelist reaches 0 lives.

### Great Deck
At the start of each duel (or when the deck is rebuilt after being emptied), the Great Deck is generated with a random number of Sun cards (between 1 and 4) and a random number of Moon cards (between 1 and 4). Both counts are shown to the player before the deck is shuffled. This means each round can have anywhere from 2 to 8 cards total, keeping the risk and probability calculations fresh each time.

### Effects
- **Moon:** The targeted player loses one life.
- **Sun:** The player who drew the card gets an extra turn (only meaningful when targeting yourself; sending a Sun at the enemy grants no benefit to either side).

### Upgrade Screen
When the player lands on an upgrade node, a window appears offering an upgrade in exchange for coins:
- **[Exit Upgrade]:** Reject the offer and close the window.
- **[Accept & Pay]:** Spend the listed coin cost to receive the [upgrade](#upgrades).

![UpgradeMenu](../../assets/images/UpgradeMenu.png)

### Health System
Lives are represented visually by candles on the table. Each player starts with 3 lives, shown as a single lit candle with three visible melt states (full, half-melted, nearly gone). When all 3 lives are lost the candle is shown fully extinguished. If a player's lives exceed 3 (for example by playing The Devil card), a second candle appears beside the first to represent the extra lives, using the same three-state visual. The maximum number of lives is capped at 6 (two full candles). Extra lives are consumed first; the original candle only begins to melt once the extra one is gone.

---



## UI / UX
The user interface and experience design is focused on making it simple, intuitive, yet inmersive into the game. This is because our intention is for the player to feel like they are the ones sitting at the fortune table and traveling along this universe. The interface must integrate well with our world building and should also avoid breaking the mystical yet comical atmosphere that is being built.

![GameInProgress](../../assets/images/Gameplay.png)

### Visual Interface
- Duel (The Table): The screen does not have a clear health bar, but rather lives represented by melting candles. This is inspired from *Ghosts of Tsushima*, where game elements like HP, stamina, guidance maps are mixed onto the very atmosphere of the game represented with elements within the game's nature. The cards will be placed in an intuitive manner in front of the player, and the elements such as character cards and the great deck will be highlighted when the mouse hovers them in order to describe the elements efficiently
- Character Deck: Positioned at the bottom of the screen, cards will elevate and show a brief description of their effects as described in [the character deck](#Characters-Deck-Options). The player will be able to click to select the card and then choose the target.
- The Great Deck: Positioned at the center left of the table, it will initially display its contents of sun and moon cards every time a new round is started, then it will be suffled and only display the top card facing down. The player will be able to hover their mouse over it, highlighting but yet not showing its contents in order to higlight the mystical aspect of the game. To choose its target, the player will click the card and choose the target, which will be diisplayed by a simple text asking "Apply to:[Enemy] on the top, and [Yourself] on the bottom".
- Targeting Screen: When the player clicks on the great deck, a simple text asking "Apply to:[Enemy] on the top, and [Yourself] on the bottom".
- Map: The map will be a graph with nodes, within this graph, the player will only be able to click on those nodes adjacent to their current position. Each node will vary as stated in [the map section](#map), and will be represented by a black square for bosses, gears for their upgrades, a portal to represent the rest site, and finally a castle to represent the boss fight.
- Upgrade Screen: A small window over the map will pop with the offer to upgrade in exchange of coins. The player will be able to click on the [Accept & Pay] button to accept the offer and pay the coins, or click on the [Exit Upgrade] button to reject the offer and close the window.
- Statistics Screen: From the main menu, the player will access and view the statistics screen.
![Statistics Screen](../../assets/images/Statistics.png)

---

## Statistics

The game will include a statistics system designed to track both individual player performance and global trends across all players. This system serves two main purposes: first, to give players a sense of progression and reflection over their runs, and second, to provide useful data that can help evaluate balance and player behavior over time. They will be divided into two main categories:

### Personal Statistics

Personal statistics focus on the performance and progression of an individual player across all of their runs. These include:

- Total Play Time
- Deaths
- Enemies Defeated
- Victories
- Coins Earned
- Cards Played

In addition to lifetime statistics, players can also view:

- Victory vs Death ratio
- Summary of their most recent run
- Current deck composition by card rarity
- Cards currently owned
- Purchased upgrades

This information allows players to analyze their playstyle, monitor their progression, and evaluate the effectiveness of their deck building decisions.

![StatisticsMenu](../../assets/images/Statistics.png)

### Global Statistics

Global statistics aggregate data from all registered players and provide insight into overall game trends. These include:

- Total Number of Players
- Average Play Time
- Average Deaths
- Total Enemies Defeated
- Average Victories
- Total Coins Earned
- Total Cards Played

The system also includes several community-wide analytics:

- Global Victories vs Deaths comparison
- Victory leaderboard
- Coins earned leaderboard
- Win rate by difficulty tier
- Most popular cards
- Most purchased upgrades

These metrics help identify balance issues and reveal how the player base interacts with the game's systems.

## Data Collection

The game is going to be developed using HTML, CSS, JavaScript, Node.js, Express, and MySQL. Statistics are collected continuously during gameplay through JavaScript events that track important player actions such as defeating enemies, playing cards, earning coins, purchasing upgrades, completing encounters, winning runs, and dying.

Whenever a relevant event occurs, the corresponding values are updated and sent to the backend through API requests. The server processes this information and stores it in a MySQL database, ensuring that player progress persists between sessions.

To support long term progression, players can create an account and log in. This allows statistics, decks, upgrades, and game progress to be preserved even after leaving the game.

The database structure includes:

- **Users Table:** Stores player accounts and login credentials.
- **Player Statistics Table:** Stores cumulative player data such as play time, victories, deaths, enemies defeated, coins earned, and cards played.
- **Deck and Card Tables:** Store the cards owned by each player and their quantities.
- **Upgrade Tables:** Store upgrades purchased by players.
- **Run Tables:** Store information about completed and ongoing runs.
- **Global Statistics Table:** Stores aggregated statistics generated from all players.
- **Database Views** Generate specialized reports such as enemy win rates, card popularity, upgrade popularity, deck composition, difficulty statistics, and leaderboard rankings.

When new gameplay data is received, the corresponding player records are updated and the aggregated statistics are recalculated to ensure that global metrics remain current.

### Main Menu Integration

The Statistics screen can be accessed directly from the main menu. When selected, the client requests information from the backend through dedicated API endpoints. The server retrieves the necessary information from the database and returns it to the frontend, where it is displayed using HTML, CSS, JavaScript, and Chart.js visualizations.

The interface separates personal and global statistics and presents the information through tables, leaderboards, doughnut charts, and bar charts. This allows players to quickly understand both their own performance and how it compares to the rest of the community.

---
# Development

The tentative classes with the necessary methods to program the game are the following: 

## Abstract Classes 

    class Card {
        String name;
        public Card(String name) {
            this.name = name;
        }
        abstract void applyEffect(Game game, Entity source, Entity target);
    }

    class Entity {
        int lives;
        void loseLife() {
            lives--;
        }
        void gainLife() {
            lives++;
        }
        void revive() {
            lives = 1;
        }
    }

    class Deck {
        Card[] cards;
    }

    class Game {
        MainDeck mainDeck;
        void extraTurn(Entity e) {}
        void repeatEffect() {}
        void discardMainDeck() {}
        void addMoon() {}
        void randomEffect() {}
    }

## Derived Classes

    class MainDeckCard extends Card {
        public MainDeckCard(String name) {
            super(name);
        }
    }

    class Sun extends MainDeckCard {
        public Sun() {
            super("Sun");
        }
        void applyEffect(Game game, Entity source, Entity target) {
            game.extraTurn(source);
        }
    }
// Needs to be repeated for the Moon Card

    class CharacterCard extends Card {
        public CharacterCard(String name) {
            super(name);
        }
    }

    class Magician extends CharacterCard {
        public Magician() {
            super("Magician");
        }
        void applyEffect(Game game, Entity source, Entity target) {
            game.repeatEffect();
        }
    }
// One per character

    class Player extends Entity {
    }
// The same for enemy

    class MainDeck extends Deck {
    }
// Applies to the Characters Deck too

# Art Direction

## Themes
The main art design in this game is Pixel Art. The cards use a cleaner and simpler pixel art style to maintain readability during gameplay, while the map and enemy designs use more detailed pixel art to create stronger atmosphere, personality, and immersion. The whole game will have themes of mystery, medieval ages and mystical and tarot references all over. Some examples include symbols in the map and the backgrounds. 

## Visual References
The visual style of the game takes inspiration from games such as Inscryption for its dark card table atmosphere. Traditional tarot illustrations and medieval themes also serve as artistic references, helping reinforce the mystical and symbolic aesthetic of the world.

## Movement
The main visual movements in the game are designed to reinforce its mystical and ominous tone while keeping interactions clear and satisfying. As the player progresses, The Fool will move smoothly across the map from node to node, emphasizing the sense of journey and descent into the unknown. During duels, cards will respond dynamically to player input by slightly elevating and rotating when selected or hovered over, creating a tactile and responsive feel that highlights their importance in decision making. Additionally, when a Moon card is applied to either the player or the enemy, a dark, magical mist will emerge from the crystal ball at the center of the table, spreading subtly across the scene to visually represent the shift toward danger and the presence of an unfavorable fate.

![FoolsSprite](../../assets/images/Gemini_Generated_Image_9tjvd69tjvd69tjv.png)

## Animation
In addition, each enemy will have a final defeat frame, where they are shown resting their head on the table, visually representing their loss.

![DefeatedEnemy](../../assets/images/DefeatedKing.png)

## Colors
At the beginning of the game, the visual palette uses warmer colors to represent hope, curiosity, and the sense of adventure that comes with starting a new descent. Easy and mid-difficulty enemies are designed with warmer tones and softer backgrounds, creating a feeling of familiarity and false security. During this first half of the game, the music also reflects this atmosphere by being more adventurous, mystical, and slightly optimistic.

As the player progresses deeper into the descent, the tone of the game becomes more serious and unsettling. The second half introduces a darker color palette, with colder shadows, stronger contrasts, and more oppressive environments. High-difficulty enemies and the final boss use darker tones to emphasize danger, tension, and uncertainty. The music also shifts to become more intense, eerie, and suspenseful. This transition helps communicate that the journey is no longer about simple exploration, but about surviving fate itself, creating a stronger sense of pressure without turning the experience into pure horror.

The playing table uses deep purple, dark blue and silver tones to create a mystical and ominous atmosphere, making each duel feel more like a fortune telling ritual than a traditional battle. Elements such as candles, shadows, tarot symbols, and the crystal ball reinforce the idea that the player is not simply playing cards, but confronting fate itself. This darker and more elegant color palette helps build tension and mystery, while also making the brighter Sun cards stand out more clearly whenever moments of hope appear.

## Enemy Design

Each enemy is designed with a clear silhouette and visual personality so that players can immediately recognize their role and difficulty. Easier enemies such as the Drunk and the Peasant have simpler clothing, warmer colors, and more relaxed or clumsy postures, making them feel less threatening. Mid-difficulty enemies like the Crazy Jester and the Bounded Knight have stronger visual contrast, with sharper shapes, exaggerated expressions, and more detailed outfits that reflect instability or discipline.

High-difficulty enemies such as the Killer Queen and the Mad Monarch use darker palettes, stronger posture, and more imposing silhouettes to communicate authority and danger. The Dealer is designed to feel elegant, calm and unsettling. His posture is controlled, and his visual presence should immediately make the player feel that they are facing the creator of fate itself, a force rather than another enemy.

## Cards
The Sun and Moon cards are designed as complete visual opposites, reinforcing their role as the core symbols of fate in the game. Sun cards represent hope, fortune, relief, clarity, and good luck. Their color palette uses warm tones such as gold, yellow, ivory, and soft orange to create a feeling of safety and optimism. These cards are meant to feel inviting and reassuring, giving the player a brief sense of control and comfort.

In contrast, Moon cards represent misfortune, uncertainty, danger, death, and the loss of control. Their visual design is intentionally darker and more ominous, using deep blues, purples, black tones, and silver accents to create a cold and foreboding atmosphere. While Sun cards feel bright and hopeful, Moon cards should immediately communicate tension and fear. This strong visual contrast helps the player instantly recognize whether fate is working in their favor or against them.

The character cards use a more varied color palette, as each one represents a different fate, power, or form of intervention against destiny. Unlike the Sun and Moon cards, which follow strict visual opposites, these cards are designed with greater visual diversity to reflect their unique effects and personalities.

The cards themselves do not include strong visual indicators to distinguish whether they are Common, Rare, or Epic. This is intentional, as the design philosophy is that power should not be immediately obvious through appearance alone. A card may look simple or harmless, but its true value is revealed through its effect during gameplay. Instead of relying on flashy visuals to communicate strength, the power of each card is meant to speak for itself through the decisions it creates and the impact it has on the duel.


---




## Sound Design

The following audio files will be featured all throughout the game, during the specified moments:

### Music

- Home Screen Music: https://drive.google.com/file/d/1urB5jivarNT5OWPFKnxyvBQH10WPmeLW/view

- Map Music: https://drive.google.com/file/d/1MwSLkbPEPxqgpSPwxPaChh18HQwx9kr6/view

- Common Enemy Music: https://drive.google.com/file/d/1jQaZSr_DPYjfQTAnrEwHa09czris5vCH/view

- Rare Enemy Music: https://drive.google.com/file/d/18ZpjLBF9V656dGaQgPunKcfh6cbkQpkr/view

- Epic Enemy Music: https://drive.google.com/file/d/1urB5jivarNT5OWPFKnxyvBQH10WPmeLW/view

- Final Boss Music: https://drive.google.com/file/d/1j0HN8uPZ_J-cHGiEnDhUq5tODtyQQd4B/view

- Final Boss Speech: https://drive.google.com/file/d/1GGLNlT3SoiWu1vCBj7GiiSaMB4mXp3aS/view

### Sound effects

- Grabbing / Placing Card: https://drive.google.com/file/d/1W85aqtEAbrDJ4l1WqGxttxixxZnJmJUO/view

- Candle Burning / Losing the Last Life: https://drive.google.com/file/d/1ou-ub_bsTDPM1OJGACr0HsuA9zkukDk8/view

- Temporary Music when on Last Life (to add tension): https://drive.google.com/file/d/1ST9hems4tOUkqzwvmLZwmD1odB6efiC0/view

- Enemy Defeated: https://drive.google.com/file/d/1KoQGm-IornHsb8N3QEXILYH8KixAg8Zb/view

- Enemy Textbox: https://drive.google.com/file/d/1i8WX0EGKbFcRM_nzs5VeQxpbuPQBxVil/view

- Enemy "Talking": https://drive.google.com/file/d/1YFMdREcwwZ2eImFIjvnNkncWK1T1NlTC/view

---




## Level Design

Each run generates a map with 10 nodes total: a starting rest node, 8 intermediate nodes arranged in 4 columns of 2 (each column contains exactly 1 enemy node and 1 upgrade node in random vertical order), and a final boss node. Guaranteed edges connect each column to the next; each column-pair may also have one extra cross-edge chosen at random. The player starts at the rest node on the far left and moves right toward the boss.

Enemy difficulty is determined by column position using weighted probabilities. 

First Fight:
- Common Chance: 100%
- Rare Chance: 0%
- Epic Chance: 0%
- Boss: 0%

Second Fight:
- Common Chance: 20%
- Rare Chance: 80%
- Epic Chance:  0%
- Boss: 0%

Third Fight:
- Common Chance: 0%
- Rare Chance: 40%
- Epic Chance: 60%
- Boss: 0%

Fourth Fight (Boss Fight):
- Common Chance: 0%
- Rare Chance: 0%
- Epic Chance: 0%
- Boss: 100%

This will guarantee that the game will gradually increase depending on the progress of the player within the game, guaranteeing that it will be adapting to the difficulty and will add fun to the game. 

With these increasing probabilities, the risk increases gradually, prompting the player to prioritize focusing on improving for the next run or facing the boss directly if the player feels ready enough with their upgrades. And will be able to plan ahead their movements and wether they want to keep their cards for the next battle or use it now to manage risks.


## AI Generated Images

To get the art style we wanted for the game without taking too much time, we built our visual pipeline around Gemini as a collaborative tool. Instead of just letting an AI blindly generate random images, we used it as an iterative design partner to quickly prototype UI elements, environmental details, and animation frames while strictly maintaining our retro, pixel-art aesthetic.

Our workflow with Gemini generally followed two approaches:

- **Text-to-Image with Strict Technical Constraints:** We used highly specific prompts to control grid alignment, framing, and pixel density so the output was actually engine-ready.
- **Sketch-to-Image Refinement:** To keep total creative control over the layouts, we uploaded our own hand-drawn sketches and placeholder graphics. Gemini used these images as a structural foundation, allowing us to lock down exact proportions and spatial requirements before rendering the final pixel art.

### Prompt Examples
Here are a few examples of how we structured our prompts for Gemini:

- **Procedural Map Icons:** "A collection of retro pixel-art icons for a game map, displayed side-by-side in a single row. Each icon must be uniform in size, perfectly centered within its own space, and clearly separated with no overlapping elements so they can be easily cropped and sliced for procedural generation."
- **Connecting Paths (Ropes):** "A pixel-art sheet containing only straight, clean vertical and horizontal rope segments. The lines must be perfectly straight and aligned to a grid without any extra decoration, intended to connect nodes on a procedural map."
- **Animated Sprite Sheets:** "A horizontal pixel-art sprite sheet showcasing a candle burning on a wooden table. Each frame must be perfectly centered within a uniform square grid to prevent any clipping or shifting during the animation sequence."
- **Tabletop Scene and Animated Asset:** "Using the attached sketch of the tabletop layout as a strict structural reference, render a final retro pixel-art version of this scene. Keep the exact camera perspective, angle, and tabletop dimensions from the drawing."

---




# Schedule

The idea is to start with a simple but functional prototype and gradually build up complexity, adding systems, content, and polish along the way. Each milestone is meant to represent a stable version that can be tested and improved, so progress stays consistent and manageable. By the end of the five weeks, the goal is to have a complete and polished version ready for delivery.

- **Week 1**
    - Core Sun/Moon mechanics implemented
    - Basic gameplay loop functional in console
    - Initial testing of core interactions

- **Week 2**
    - Basic art implementation
    - Character deck system functional
    - Map integration working
    - Playable but still rough experience

- **Week 3**
    - Refinement of core systems
    - Additional cards and mechanics implemented
    - Improved UI clarity and feedback
    - Early balancing pass

- **Week 4**
    - Sound effects integration
    - Enemy balancing
    - 100% of cards implemented
    - Stable gameplay experience with minor bugs

- **Week 5**
    - Bug fixing and optimization
    - Visual polish and consistency improvements
    - Final testing and adjustments
    - Final delivery version ready

Once this schedule is completed, the next step would be to gather feedback through playtesting and evaluate how the game performs in practice, using those insights to refine mechanics, adjust balance, and decide whether additional content or improvements are needed. At the same time we need to be careful, because the biggest risk lies in the core systems, particularly the card mechanics and overall balance, taking longer to stabilize than expected, since any issues at that stage could delay progress and compress the time available for polish and final testing, ultimately affecting the quality of the final version. 