

**![][image1]**

**Software Requirements Specification Document:**  
**The Fools Descent**

**Software Construction and Decision Making (Gpo 501\)**

**Regina Fernanda Portela Palacios** — A01786698  
**Miguel Eduardo Vega Bisonó** — A01781892  
**Santiago Aguilar Mello** — A01754105

**Repository:** https://github.com/sant-mell/videoGame-TC2005B.501  
**Issues:** https://github.com/sant-mell/videoGame-TC2005B.501/issues  
**Project Board:** https://github.com/users/sant-mell/projects/1/views/1

**User Stories**

| User Story \#1 | Play directly in browser |
| :---- | :---- |
| As a player, I want to play in a webpage so I don’t need to install anything. |  |
| The game runs fully in the browser without downloads. | *Priority:* High *Time Estimation:* 2h |

| User Story \#2 | Create account |
| :---- | :---- |
| As a new player, I want to create an account so I can save my progress and come back later. |  |
| Users can register with username and password to access the game. | *Priority:* High *Time Estimation:* 4.5h |

| User Story \#3 | Log in to the game  |
| :---- | :---- |
| As a returning player, I want to log in so I can continue my descent.  |  |
| User credentials are validated and the session starts. | *Priority:* High *Time Estimation:* 2.5h |

| User Story \#4 | View main menu |
| :---- | :---- |
| As a player, I want a clear main menu so I can choose what to do next. |  |
| Menu displays New Descent, Continue Descent, Statistics and Tutorial options. | *Priority:* High *Time Estimation:* 2h |

| User Story \#5 | Start a new run |
| :---- | :---- |
| As a player, I want to start a new descent so I can experience a fresh run from the beginning. |  |
| Clicking "New Descent" resets the run but keeps coins and upgrades. | *Priority:* High *Time Estimation:* 2h |

| User Story \#6 | Procedural map generation |
| :---- | :---- |
| As a player, I want each run to feel different so I can play it again without getting bored. |  |
| The map layout changes each run. | *Priority:* High *Time Estimation:* 6.5h |

| User Story \#7 | Continue previous run |
| :---- | :---- |
| As a player, I want to continue my last run so I don’t lose my progress. |  |
| Clicking "Continue Descent" loads the saved data correctly. | *Priority:* High *Time Estimation:* 3.5h |

| User Story \#8 | See personal statistics |
| :---- | :---- |
| As a player, I want to view my stats so I can track my progress. |  |
| The stats screen shows metrics like wins, deaths, coins and much more. | *Priority:* Medium *Time Estimation:* 4.5h |

| User Story \#9 | See global statistics |
| :---- | :---- |
| As a player, I want to view average stats so I can compare my progress. |  |
| The stats screen shows metrics like wins, deaths, coins and much more. | *Priority:* Medium *Time Estimation:* 1.5h |

| User Story \#10 | Read a tutorial |
| :---- | :---- |
| As a player, I want to learn how to play the game before I start it. |  |
| It takes you to another section of the webpage with step by step instructions that explain every detail necessary to begin playing. | *Priority:* Medium *Time Estimation:* 2h |

| User Story \#11 | Navigate map |
| :---- | :---- |
| As a player, I want to move through nodes so I can choose my path. |  |
| Players can select adjacent nodes. | *Priority:* High *Time Estimation:* 4.5h |

| User Story \#12 | See node types |
| :---- | :---- |
| As a player, I want to identify nodes easily so I can plan my decisions. |  |
| The nodes show an enemy, upgrade or rest stop visually. | *Priority:* High *Time Estimation:* 2h |
|  |  |

| User Story \#13 | Enter enemy node |
| :---- | :---- |
| As a player, I want to fight when choosing enemies so I can progress. |  |
| The duel starts after selecting the enemy node. | *Priority:* High *Time Estimation:* 3h |

| User Story \#14 | See deck composition |
| :---- | :---- |
| As a player, I want to see how many sun and moon cards exist so I can plan my moves. |  |
| The card count is shown before shuffle. | *Priority:* High *Time Estimation:* 3h |

| User Story \#15 | Shuffle deck |
| :---- | :---- |
| As a player, I want the deck to shuffle so outcomes are random. |  |
| The deck randomizes each duel. | *Priority:* High *Time Estimation:* 2h |

| User Story \#16 | Choose target |
| :---- | :---- |
| As a player, I want to choose who receives the effect so I can control risk. |  |
| Players can select themselves or the enemy. | *Priority:* High *Time Estimation:* 3h |

| User Story \#17 | Use Character Cards |
| :---- | :---- |
| As a player, I want to use cards from my character deck so I can influence the outcome of each turn. |  |
| The player can select and play a card from their deck during their turn. | *Priority:* High *Time Estimation:* 8h |

| User Story \#18 | Apply Card Effects |
| :---- | :---- |
| As a player, I want card effects to activate correctly so the gameplay feels consistent and strategic. |  |
| Each card applies its specific effect. | *Priority:* High *Time Estimation:* 8h |

| User Story \#19 | Lose and gain lives |
| :---- | :---- |
| As a player, I want my lives to update correctly so I understand the negative (or positive) consequences of my decisions in the game. |  |
| The health system updates based on Sun and Moon card outcomes (and some character cards). | *Priority:* High *Time Estimation:* 3h |

| User Story \#20 | Automatic enemy turn |
| :---- | :---- |
| As a player, I want enemies to take turns automatically so the duel feels dynamic and challenging. |  |
| Enemies execute their actions according to their difficulty and behavior rules automatically. | *Priority:* High *Time Estimation:* 9h |

| User Story \#21 | End of fight |
| :---- | :---- |
| As a player, I want the duel to end when the player or the enemy reaches zero lives so the game can progress correctly. |  |
| The duel ends and displays win or loss when a participant reaches 0 lives. | *Priority:* High *Time Estimation:* 4.5h |

| User Story \#22 | Receive rewards after win |
| :---- | :---- |
| As a player, I want to receive coins, cards or upgrades after winning so I can improve my chances in future encounters. |  |
| The system grants rewards based on enemy difficulty after a victory. | *Priority:* High *Time Estimation:* 5.5h |

| User Story \#23 | Purchase upgrades |
| :---- | :---- |
| As a player, I want to buy upgrades using coins so I can improve my performance in future battles. |  |
| The player can spend coins to obtain upgrades like Card Binding or Life Extension. | *Priority:* High *Time Estimation:* 5h |

| User Story \#24 | Apply upgrade effects |
| :---- | :---- |
| As a player, I want upgrades to persist and affect gameplay so my decisions feel meaningful. |  |
| Purchased upgrades modify gameplay. | *Priority:* High *Time Estimation:* 4.5h |

| User Story \#25 | Save game state |
| :---- | :---- |
| As a player, I want my data to be saved so I can resume exactly where I left off the game later. |  |
| The system restores map position, deck, coins, and upgrades accurately. | *Priority:* High *Time Estimation:* 5.5h |

| User Story \#26 | Track player statistics in real time |
| :---- | :---- |
| As a developer, I want gameplay events to update statistics automatically so data remains accurate. |  |
| Events like card usage, wins, and deaths update player statistics dynamically. | *Priority:* Medium *Time Estimation:* 5h |

| User Story \#27 | Update global statistics |
| :---- | :---- |
| As a developer, I want global statistics to aggregate all player data so I can analyze overall game performance. |  |
| The system updates global metrics when players complete actions or runs. | *Priority:* Medium *Time Estimation:* 4.5h |

| User Story \#29 | Obtain character card info |
| :---- | :---- |
| As a player, I want to be able to be able to consult what each character card does by hovering over it. |  |
| An event when the player’s mouse hovers over their deck displays a text with its description. | *Priority:* Low *Time Estimation:* 3h |

| User Story \#30 | Play music during game events |
| :---- | :---- |
| As a player, I want to feel the theming of the game by having the songs that are played match the events within, such as boss fights or selection menus. |  |
| The game will link its screens to certain audio files. | *Priority:* Low *Time Estimation:* 2h |

| User Story \#31 | Enter upgrade node |
| :---- | :---- |
| As the player, I want to be able to get my upgrades when entering the upgrade node and make the purchase be functional. |  |
| The game will have a trigger for when the player stands on an upgrade node, a screen to accept or reject the upgrade is correctly displayed. | *Priority:* Medium *Time Estimation:* 3.5h |

| User Story \#33 | Card drawing animations |
| :---- | :---- |
| As a player, I want to see animations when drawing cards for the revelation of the great deck so it feels lively. |  |
| The card drawing events will make the cards run an animation for when the cards are revealed. | *Priority:* Medium *Time Estimation:* 2.5h |

| User Story \#35 | Feedback for damage |
| :---- | :---- |
| As the player, I want to be able to know that I have received my damage from a moon card when it is applied to me. |  |
| The screen will dim because of the effect derived from losing a part of the candle. | *Priority:* Low *Time Estimation:* 1.5h |

| User Story \#36 | Character card acquirement |
| :---- | :---- |
| As the player, I want a fun and intuitive system to get my character cards that match my current difficulty. |  |
| A system will provide character cards every time the great deck is depleted. It will match the enemy’s difficulty and amounts will also vary by difficulty. | *Priority:* High *Time Estimation:* 2.5h |

| User Story \#37 | End of run screen |
| :---- | :---- |
| As a player, I want to know how my run went, showing whether I won or lost and my performance throughout the run, including some details of actions of my run. |  |
| When the run is finished, a screen showing stats and win or loss state will show up. | *Priority:* Low *Time Estimation:* 2.5h |

| User Story \#38 | Sound inclusion |
| :---- | :---- |
| As a player, I want to deepen my immersion of the game by listening to sound effects that are related to my current actions within the game. |  |
| Triggers will be added to actions like drawing, clicking through menus, etc., in order to fully immerse the player to the game. | *Priority:* Low *Time Estimation:* 2h |

| User Story \#39 | Card rarity |
| :---- | :---- |
| As a player, I want to be able to tell the rarity of my cards in order to understand its importance within gameplay. |  |
| Within the cards description, a coloured text will indicate its rarity. | *Priority:* Low *Time Estimation:* 0.5 h |

| User Story \#40 | New Descent Warning |
| :---- | :---- |
| As a player, wiiI want to make sure that when I click on a New Descent, I want to start from zero instead of continuing the game in case i did not mean to click on it.  |  |
| An “Are you sure?” screen will pop up in order to prevent accidental run loss. | *Priority:* low *Time Estimation:* 2h |

**Issues**

[https://github.com/sant-mell/videoGame-TC2005B.501/issues](https://github.com/sant-mell/videoGame-TC2005B.501/issues) 

**Project Board**

[https://github.com/users/sant-mell/projects/1/views/1](https://github.com/users/sant-mell/projects/1/views/1) 

[image1]: <data:image/png;base64,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>