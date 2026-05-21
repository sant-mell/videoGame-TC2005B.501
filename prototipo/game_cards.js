Game.prototype.buildAllCards = function() {
        return [
            {
                //0
                name: "The Magician",
                sprite: { src: "../assets/images/Common Cards.png", rect: new Rect(15, 20, 210, 400) },
                infoText: "Repeating the last card played...",
                description: "Repeats the effect of your last played card",
                action: () => {
                    if (this.lastPlayedAction) {
                        this.magicianHadLastCard = true;
                        this.lastPlayedAction();
                    } else {
                        this.magicianHadLastCard = false;
                        this.magicianMessage = true;
                        setTimeout(() => { this.magicianMessage = false; }, 2000);
                    }
                }
            },
            {
                //1
                name: "The Chariot",
                sprite: { src: "../assets/images/Common Cards.png", rect: new Rect(230, 20, 210, 400) },
                infoText: "Throwing away the top card of the Great Deck...",
                description: "Throws away the top card of the Great Deck",
                action: () => {
                    if (this.greatDeck.length === 0) return;
                    this.discardCardType = this.greatDeck.shift();
                    this.discardX = canvasWidth / 2;
                    this.discardY = canvasHeight / 2;
                    this.isDiscardSliding = true;
                }
            },
            {
                //2
                name: "Page of Pentacles",
                sprite: { src: "../assets/images/Common Cards.png", rect: new Rect(661, 20, 210, 400) },
                infoText: "Win this round for a 50 coin bonus!",
                description: "Gives you a 50 coin bonus if you win",
                action: () => { this.pageOfPentaclesActive = true; }
            },
            {
                //3
                name: "The Star",
                sprite: { src: "../assets/images/Common Cards.png", rect: new Rect(440, 20, 210, 400) },
                infoText: "You will be revived if you reach 0 lives!",
                description: "If your lives reach 0, you will be revived with one life remaining",
                action: () => {
                    if (this.currentTurn === "enemy") {
                        this.enemyStarActive = true;
                    } else {
                        this.playerStarActive = true;
                    }
                }
            },
            {
                //4
                name: "Strength",
                sprite: { src: "../assets/images/Common Cards.png", rect: new Rect(872, 20, 210, 400) },
                infoText: "You cannot die next round!",
                description: "Prevents you from dying next round",
                action: () => { 

                        if (this.currentTurn === "enemy") {
                            this.enemyStrengthActive = true;
                        }
                        else {
                            this.playerStrengthActive = true;
                        }
                }
            },
            {
                //5
                name: "Two of Pentacles",
                sprite: { src: "../assets/images/Common Cards.png", rect: new Rect(1087, 20, 210, 400) },
                infoText: "Drawing two cards - choose one to keep...",
                description: "Draws two cards, choose one to apply to yourself",
                action: () => {
                    this.activateTwoPentacles();
                }
            },
            {
                //6
                name: "The High Priestess",
                sprite: { src: "../assets/images/Rare Cards.png", rect: new Rect(20, 10, 210, 400) },
                infoText: "See the next card from the Great Deck",
                description: "Shows you the next card in the Great Deck",
                action: () => {
                    if (this.greatDeck.length > 0) {
                        this.peekedCard = this.greatDeck[0];
                        this.showPeekCard = true;
                    }
                    setTimeout(() => { 
                        this.showPeekCard = false;
                        this.finalImage.position.x = canvasWidth / 2;
                        this.finalImage.position.y = canvasHeight / 2;

                        this.sunImage.position.x = canvasWidth / 2;
                        this.sunImage.position.y = canvasHeight / 2;
                    }, 2000);
                }
            },
            {
                //7
                name: "The Hermit",
                sprite: { src: "../assets/images/Rare Cards.png", rect: new Rect(235, 10, 210, 400) },
                infoText: "Enemy's next turn is blocked!",
                description: "Blocks the enemy's next turn",
                action: () => {
                        if (this.currentTurn === "enemy") {
                            this.playerTurnBlocked = true;
                            console.log("HERMIT PLAYER ACTION", this.currentTurn);
                        } else {
                            this.enemyTurnBlocked = true;
                            console.log("HERMIT ENEMY ACTION", this.currentTurn);
                        }
                }
            },
            {
                //8
                name: "Justice",
                sprite: { src: "../assets/images/Rare Cards.png", rect: new Rect(448, 10, 210, 400) },
                infoText: "If you lose a life next turn, so does the enemy!",
                description: "Makes your enemy lose a life if you lose a life on this or next turn",
                action: () => {
                    if (this.currentTurn === "enemy") {
                        this.enemyJusticeActive = true;
                    } else {
                        this.playerJusticeActive = true;
                    }
                }
            },
            {
                //9
                name: "Wheel of Fortune",
                sprite: { src: "../assets/images/Rare Cards.png", rect: new Rect(660, 10, 210, 400) },
                infoText: "Shuffling the Great Deck...",
                description: "Shuffles the Great Deck",
                action: () => { this.greatDeck.sort(() => Math.random() - 0.5); }
            },
            {
                //10
                name: "King of Pentacles",
                sprite: { src: "../assets/images/Rare Cards.png", rect: new Rect(875, 10, 210, 400) },
                infoText: "Win for double coins, but lose for double coin loss!",
                description: "Doubles your gained coins if you win, but also doubles your lost coins if you lose",
                action: () => { this.kingOfPentaclesActive = true; }
            },
            {
                //11
                name: "The Lovers",
                sprite: { src: "../assets/images/Legendary Cards.png", rect: new Rect(20, 10, 210, 400) },
                infoText: "Removing one Moon from the Great Deck...",
                description: "Removes one Moon card from the Great Deck",
                action: () => {
                    const idx = this.greatDeck.indexOf("moon");
                    if (idx !== -1) this.greatDeck.splice(idx, 1);
                }
            },
            {
                //12
                name: "The Hanged Man",
                sprite: { src: "../assets/images/Legendary Cards.png", rect: new Rect(659, 10, 210, 400) },
                infoText: "Enemy cannot use their Character Deck next turn!",
                description: "Blocks the enemy from using their Character Deck next turn",
                action: () => {
                    if (this.currentTurn === "enemy") {
                        this.playerHandBlocked = true;
                    } else {
                        this.enemyHandBlocked = true;
                    }
                }
            },
            {
                //13
                name: "The Tower",
                sprite: { src: "../assets/images/Legendary Cards.png", rect: new Rect(228, 10, 210, 400) },
                description: "Destroys half of your opponents character cards",
                infoText: "Destroyed half of the enemy's cards!",
                action: () => {
                    this.destroyHalfOpponentCards();
                }
            },
            {
                //14
                name: "The Devil",
                sprite: { src: "../assets/images/Legendary Cards.png", rect: new Rect(444, 10, 213, 400) },
                description: "Gain 2 lives, but a new moon card will be added to the Great Deck",
                infoText: "Gained 2 lives! A Moon was added to the Great Deck.",
                action: () => {
                    if (this.currentTurn !== "enemy"){
                    this.playerLives += 2;
                    }
                    else {
                        this.enemyLives +=2;
                    }
            
                    this.greatDeck.push("moon");
            
                    this.greatDeck.sort(() => Math.random() - 0.5);
            
                    this.updatePlayerCandles();
                    this.updateEnemyCandles();
                }
            },
        ];
    
};
Game.prototype.destroyHalfOpponentCards = function() {
    const targetCards = this.currentTurn === "enemy"
        ? this.characterCards
        : this.enemyCharacterCards;

    const amountToDestroy = Math.floor(targetCards.length / 2);

    for (let i = 0; i < amountToDestroy; i++) {
        const randomIndex = Math.floor(Math.random() * targetCards.length);
        targetCards.splice(randomIndex, 1);
    }

    if (this.currentTurn === "enemy") {
        this.repositionCards();
    } else {
        this.repositionEnemyCards();
    }
};

Game.prototype.activateStarPower = function(target) {
        if (target === "enemy") {
            if (!this.enemyStarActive || this.enemyLives > 0) return false;

            this.enemyLives = 1;
            this.enemyStarActive = false;
            this.updateEnemyCandles();
        } else {
            if (!this.playerStarActive || this.playerLives > 0) return false;

            this.playerLives = 1;
            this.playerStarActive = false;
            this.updatePlayerCandles();
        }

        this.starMessage = true;
        setTimeout(() => { this.starMessage = false; }, 2000);
        return true;
};
Game.prototype.activateStrengthPower = function(target) {

    if (target === "enemy") {

        if (!this.enemyStrengthActive) {
            return false;
        }

        this.enemyStrengthActive = false;

        this.strengthMessage = true;

        setTimeout(() => {
            this.strengthMessage = false;
        }, 2000);

        return true;
    }

    if (!this.playerStrengthActive) {
        return false;
    }

    this.playerStrengthActive = false;

    this.strengthMessage = true;

    setTimeout(() => {
        this.strengthMessage = false;
    }, 2000);

    return true;
};
Game.prototype.buildCharacterCardEntry = function(cardDef) {
        const obj = new AnimatedObject(
            new Vector(canvasWidth / 2, canvasHeight - 180),
            100, 175, "gray", "card", 1
        );
        obj.setSprite(cardDef.sprite.src, cardDef.sprite.rect);
        return {
            object: obj,
            sprite: cardDef.sprite,
            name: cardDef.name,
            visible: true,
            showInfo: false,
            infoText: cardDef.infoText,
            description: cardDef.description,
            action: cardDef.action
        };
    
};

Game.prototype.chooseStartingCards = function(indices) {
        const cards = indices.map(i => this.buildCharacterCardEntry(this.allCards[i]));
        this.repositionCardsArray(cards);
        return cards;
    
};

Game.prototype.chooseEnemyCards = function(indices) {
        const cards = indices.map(i => {
            const card = this.buildCharacterCardEntry(this.allCards[i]);
            card.object.size.x = 50;
            card.object.size.y = 90;
            return card;
        });
        this.enemyCharacterCards = cards; // assign FIRST
        this.repositionEnemyCards();      // THEN reposition
        return cards;
    
};
