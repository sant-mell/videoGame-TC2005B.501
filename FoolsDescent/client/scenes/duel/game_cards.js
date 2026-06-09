Game.prototype.shuffleDeck = function(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = deck[i];
        deck[i] = deck[j];
        deck[j] = tmp;
    }
};

Game.prototype.buildAllCards = function() {
        return [
            {
                //0
                name: "The Magician",
                sprite: { src: "../../../assets/images/Common Cards.png", rect: new Rect(15, 20, 210, 400) },
                infoText: "Repeating the last card played...",
	                description: "Repeats the effect of your last played card",
	                action: () => {
	                    if (this.lastPlayedAction) {
	                        this.magicianHadLastCard = true;
                            const magicianOwner = this.currentTurn;
                            const repeatedAction = this.lastPlayedAction;
                            if (this.usesPendingMagicianRepeat) {
                                this.magicianRepeating = true;
                                this.pendingMagicianInfoText =
                                    this.getCardInfoTextForTurn(
                                        this.lastPlayedName,
                                        magicianOwner,
                                        this.lastPlayedInfoText
                                    );
                                this.pendingMagicianAction = () => {
                                    this.runCardActionAsTurn(
                                        repeatedAction,
                                        magicianOwner
                                    );
                                };
                            } else {
                                this.runCardActionAsTurn(
                                    repeatedAction,
                                    magicianOwner
                                );
                            }
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
                sprite: { src: "../../../assets/images/Common Cards.png", rect: new Rect(230, 20, 210, 400) },
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
                sprite: { src: "../../../assets/images/Common Cards.png", rect: new Rect(661, 20, 210, 400) },
                infoText: "Win this round for a 50 coin bonus!",
                description: "Gives you a 50 coin bonus if you win",
                action: () => { this.pageOfPentaclesActive = true; }
            },
            {
                //3
                name: "The Star",
                sprite: { src: "../../../assets/images/Common Cards.png", rect: new Rect(440, 20, 210, 400) },
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
                sprite: { src: "../../../assets/images/Common Cards.png", rect: new Rect(872, 20, 210, 400) },
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
                sprite: { src: "../../../assets/images/Common Cards.png", rect: new Rect(1087, 20, 210, 400) },
                infoText: "Drawing two cards - choose one to keep...",
                description: "Draws two cards, choose one to apply to yourself",
                action: () => {
                    this.activateTwoPentacles();
                }
            },
            {
                //6
                name: "The High Priestess",
                sprite: { src: "../../../assets/images/Rare Cards.png", rect: new Rect(20, 10, 210, 400) },
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
                sprite: { src: "../../../assets/images/Rare Cards.png", rect: new Rect(235, 10, 210, 400) },
                infoText: "Enemy's next turn is blocked!",
                description: "Blocks the enemy's next turn",
                action: () => {
                        if (this.currentTurn === "enemy") {
                            this.playerTurnBlocked = true;
                        } else {
                            this.enemyTurnBlocked = true;
                        }
                }
            },
            {
                //8
                name: "Justice",
                sprite: { src: "../../../assets/images/Rare Cards.png", rect: new Rect(448, 10, 210, 400) },
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
                sprite: { src: "../../../assets/images/Rare Cards.png", rect: new Rect(660, 10, 210, 400) },
                infoText: "Shuffling the Great Deck...",
                description: "Shuffles the Great Deck",
                action: () => { this.shuffleDeck(this.greatDeck); }
            },
            {
                //10
                name: "King of Pentacles",
                sprite: { src: "../../../assets/images/Rare Cards.png", rect: new Rect(875, 10, 210, 400) },
                infoText: "Win for double coins, but lose for double coin loss!",
                description: "Doubles your gained coins if you win, but also doubles your lost coins if you lose",
                action: () => {
                    this.kingOfPentaclesActive = true;
                    this.kingOfPentaclesOwner = this.currentTurn;
                }
            },
            {
                //11
                name: "The Lovers",
                sprite: { src: "../../../assets/images/Legendary Cards.png", rect: new Rect(20, 10, 210, 400) },
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
                sprite: { src: "../../../assets/images/Legendary Cards.png", rect: new Rect(659, 10, 210, 400) },
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
                sprite: { src: "../../../assets/images/Legendary Cards.png", rect: new Rect(228, 10, 210, 400) },
                description: "Destroys half of your opponent's character cards",
                infoText: "Destroyed half of the enemy's cards!",
                action: () => {
                    this.destroyHalfOpponentCards();
                }
            },
            {
                //14
                name: "The Devil",
                sprite: { src: "../../../assets/images/Legendary Cards.png", rect: new Rect(444, 10, 213, 400) },
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

                    this.shuffleDeck(this.greatDeck);
                    this.candleBurnPlayed = false;
                    this.updatePlayerCandles();
                    this.updateEnemyCandles();
                }
            },
            {
                //15
                name: "The Fool",
                sprite: { src: "../../../assets/images/Epic Cards.png", rect: new Rect(0, 10, 204, 385) },
                description: "Any card effect is possible, but which one will it be?",
                infoText: "Surprise!",
                action: () => {
                    if (this.foolIsExecuting) return;
                    this.foolIsExecuting = true;
                    let foolCards;

                    if (this.currentTurn === "enemy") {
                        foolCards = [
                            this.allCards[1],
                            this.allCards[3],
                            this.allCards[4],
                            this.allCards[7],
                            this.allCards[8],
                            this.allCards[9],
                            this.allCards[11],
                            this.allCards[12],
                            this.allCards[13],
                            this.allCards[14]
                        ];
                    }
                    else {
                        foolCards = this.allCards.filter(
                            card => card.name !== "The Fool"
                        );
                    }

                    const randomCard =
                        foolCards[Math.floor(Math.random() * foolCards.length)];
                    const foolOwner = this.currentTurn;
                    
                    this.lastPlayedAction = randomCard.action;
                    this.foolRandomCardName = randomCard.name;
                    this.foolRandomCardInfo = this.getCardInfoTextForTurn(
                        randomCard.name,
                        foolOwner,
                        randomCard.infoText
                    );

                    randomCard.action();
                    this.foolIsExecuting = false;
                }
            },
        ];
    
};
Game.prototype.runCardActionAsTurn = function(action, turnOwner) {
    const previousTurn = this.currentTurn;

    this.currentTurn = turnOwner;
    action();
    this.currentTurn = previousTurn;
};

Game.prototype.getCardInfoTextForTurn = function(cardName, turnOwner, fallbackText) {
    const infoTexts = {
        "The Star": {
            player: "You will be revived if you reach 0 lives!",
            enemy: "The enemy will be revived if they reach 0 lives!"
        },
        "Strength": {
            player: "You cannot die next round!",
            enemy: "Enemy can't die this round!"
        },
        "The Hermit": {
            player: "Enemy's next turn is blocked!",
            enemy: "Your turn will be blocked!"
        },
        "Justice": {
            player: "If you lose a life next turn, so does the enemy!",
            enemy: "If the enemy loses a life on this turn or the next one so do you!"
        },
        "The Hanged Man": {
            player: "Enemy cannot use their Character Deck next turn!",
            enemy: "The enemy has blocked your hand for the next turn."
        },
        "The Tower": {
            player: "Destroyed half of the enemy's cards!",
            enemy: "The enemy destroyed half of your character cards!"
        },
        "The Devil": {
            player: "Gained 2 lives! A Moon was added to the Great Deck.",
            enemy: "The enemy gained 2 lives! A Moon was added to the Great Deck."
        },
        "The Lovers": {
            player: "Removing one Moon from the Great Deck...",
            enemy: "The enemy removed one Moon from the Great Deck..."
        }
    };

    if (infoTexts[cardName] && infoTexts[cardName][turnOwner]) {
        return infoTexts[cardName][turnOwner];
    }

    return fallbackText;
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

Game.prototype.isPlayerTurnInputLocked = function() {
    return Boolean(
        this.playerInputLocked ||
        this.showIntroText ||
        this.pendingRewardCard ||
        this.isRewardCardSliding ||
        this.isCenterCardAnimating
    );
};

Game.prototype.startCenterCardAnimation = function() {
    const startX = this.maindeck.x + this.maindeck.width / 2;
    const startY = this.maindeck.y + this.maindeck.height / 2;

    this.showCenterImage = true;
    this.isCenterCardAnimating = true;
    this.centerCardAnimationTime = 0;
    this.centerCardAnimationDuration = 400;

    this.centerCardStartX = startX;
    this.centerCardStartY = startY;
    this.centerCardStartW = this.maindeck.width;
    this.centerCardStartH = this.maindeck.height;

    this.centerCardTargetX = canvasWidth / 2;
    this.centerCardTargetY = canvasHeight / 2;
    this.centerCardTargetW = 120;
    this.centerCardTargetH = 200;

    this.centerImage.position.x = this.centerCardStartX;
    this.centerImage.position.y = this.centerCardStartY;
    this.centerImage.size.x = this.centerCardStartW;
    this.centerImage.size.y = this.centerCardStartH;
};

Game.prototype.handleEmptyEnemyDeckDraw = function() {
    if (this.greatDeck.length > 0) {
        return false;
    }

    if (
        this.gameOver ||
        this.pendingPlayerDefeatAfterSlide ||
        this.playerLives <= 0 ||
        this.enemyLives <= 0
    ) {
        this.showIntroText = false;
        this.pendingRewardCard = false;
        this.playerInputLocked = false;
        return true;
    }

    this.showCenterImage = false;
    this.showFinalImage = false;
    this.isCenterCardAnimating = false;
    this.isCardSliding = false;
    this.currentTurn = "player";
    this.showEnemyCards = true;

    if (this.playerHandBlocked) {
        this.showPlayerCards = false;
        this.playerHandBlockedMessage = true;
    } else {
        this.showPlayerCards = true;
    }

    this.buildGreatDeck(true);

    return true;
};

Game.prototype.finishRewardCardSlide = function() {
    this.pendingRewardCard = false;
    this.playerInputLocked = false;
    this.isRewardCardSliding = false;
    this.rewardCard = null;
};

Game.prototype.startPendingRewardCard = function() {
    if (!this.pendingRewardCard || this.rewardCard || this.isRewardCardSliding) {
        return;
    }

    if (
        this.gameOver ||
        this.currentTurn !== "player" ||
        this.showStartButton ||
        this.showIntroText ||
        this.showCenterImage ||
        this.showFinalImage ||
        this.showTwoPentaclesChoice
    ) {
        return;
    }

    if (!this.playerHandBlocked) {
        this.showPlayerCards = true;
    }

    if (!this.addPlayerCardFromPool()) {
        this.finishRewardCardSlide();
    }
};

Game.prototype.buildGreatDeck = function(awardPlayerCard = false) {
    if (
        this.gameOver ||
        this.pendingPlayerDefeatAfterSlide ||
        this.playerLives <= 0 ||
        this.enemyLives <= 0
    ) {
        this.showIntroText = false;
        this.pendingRewardCard = false;
        this.playerInputLocked = false;
        return;
    }

    const sunCount = Math.floor(Math.random() * 4) +1;
    const moonCount = Math.floor(Math.random() * 4) +1;

    this.greatDeck = [];
    for (let i = 0; i < sunCount; i++) this.greatDeck.push("sun");
    for (let i = 0; i < moonCount; i++) this.greatDeck.push("moon");
    this.shuffleDeck(this.greatDeck);

    this.sunCount = sunCount;
    this.moonCount = moonCount;
    this.showIntroText = true;
    this.playerInputLocked = true;

    if (awardPlayerCard) {
        this.pendingRewardCard = true;
    }

    setTimeout(() => {
        if (this.gameOver) {
            this.showIntroText = false;
            this.finishRewardCardSlide();
            return;
        }

        this.showIntroText = false;
        if (!awardPlayerCard) {
            this.playerInputLocked = false;
        }
        if (awardPlayerCard) {
            this.currentTurn = "player";
            this.startPendingRewardCard();
        }
    }, 5000);
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
            this.candleBurnPlayed = false;
            this.playPlayerLastLifeSound(true);
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

            if (this.enemyLives !== 1) {
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

        if (this.playerLives !== 1) {
            return false;
        }
	
	    this.playerStrengthActive = false;
        this.playPlayerLastLifeSound(true);

    this.strengthMessage = true;

    setTimeout(() => {
        this.strengthMessage = false;
    }, 2000);

    return true;
};
Game.prototype.resolveNoResultTie = function() {
    if (this.playerLives > 0 || this.enemyLives > 0) {
        return false;
    }

    let protectionActivated = false;

    if (this.playerStrengthActive) {
        this.playerLives = 1;
        this.playerStrengthActive = false;
        this.playPlayerLastLifeSound(true);
        protectionActivated = true;
    }

    if (this.enemyStrengthActive) {
        this.enemyLives = 1;
        this.enemyStrengthActive = false;
        protectionActivated = true;
    }

    if (protectionActivated) {
        this.strengthMessage = true;
        setTimeout(() => {
            this.strengthMessage = false;
        }, 2000);
    }

    const playerStarActivated = this.activateStarPower("player");
    const enemyStarActivated = this.activateStarPower("enemy");

    if (protectionActivated || playerStarActivated || enemyStarActivated) {
        this.gameOver = this.playerLives <= 0 || this.enemyLives <= 0;

        if (this.enemyLives > 0) {
            this.isEnemyShowing = true;
            this.isShowingDefeatedEnemy = false;
        }

        this.candleBurnPlayed = false;
        this.updatePlayerCandles();
        this.updateEnemyCandles();

        return true;
    }

    this.gameOver = false;

    this.playerLives = 1;
    this.enemyLives = 1;

    this.playerJusticeActive = false;
    this.enemyJusticeActive = false;
    this.playerStrengthActive = false;
    this.enemyStrengthActive = false;

    this.noResultMessageUntil = performance.now() + 3500;

    this.showFinalImage = false;
    this.showCenterImage = false;
    this.isCardSliding = false;
    this.isEnemyShowing = true;
    this.isShowingDefeatedEnemy = false;

    this.candleBurnPlayed = false;
    this.updatePlayerCandles();
    this.updateEnemyCandles();

    return true;
};
Game.prototype.buildCharacterCardEntry = function(cardDef, cardIndex = null) {
        const obj = new AnimatedObject(
            new Vector(canvasWidth / 2, canvasHeight - 180),
            100, 175, "gray", "card", 1
        );
        obj.setSprite(cardDef.sprite.src, cardDef.sprite.rect);
        return {
            cardIndex: cardIndex,
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

Game.prototype.pickRandomCardIndexFromPool = function(poolIndices) {
        if (!poolIndices || poolIndices.length === 0) {
            return null;
        }

        const randomPoolIndex = Math.floor(Math.random() * poolIndices.length);
        return poolIndices[randomPoolIndex];
};

Game.prototype.takeRandomPlayerCardIndex = function() {
        return this.pickRandomCardIndexFromPool(
            this.difficultyCardPoolIndices ||
            this.playerCardPoolIndices ||
            this.availablePlayerCardIndices
        );
};

Game.prototype.addPlayerCardFromPool = function() {
        if (!this.allCards || !this.characterCards) {
            return false;
        }

        const cardIndex = this.takeRandomPlayerCardIndex();
        if (cardIndex === null) {
            return false;
        }

        const card = this.buildCharacterCardEntry(this.allCards[cardIndex], cardIndex);

        card.object.position.x = canvasWidth;
        card.object.position.y = canvasHeight;

        this.characterCards.push(card);
        this.repositionCards();

        this.rewardCard = card;
        this.rewardCardTargetX = card.object.position.x;
        this.rewardCardTargetY = card.object.position.y;
        card.object.position.x = canvasWidth;
        card.object.position.y = canvasHeight;
        this.pendingRewardCard = false;
        this.playerInputLocked = true;
        this.isRewardCardSliding = true;

        return true;
};

Game.prototype.chooseStartingCards = function(indices, amount = 0) {
        this.difficultyCardPoolIndices = indices.slice();
        this.playerCardPoolIndices = indices.slice();
        this.availablePlayerCardIndices = indices.slice();

        if (!Array.isArray(this.personalPlayerCardIndices)) {
            this.personalPlayerCardIndices = [];
        }

        this.savedWinningCards = false;

        const cards = [];

        for (let i = 0; i < amount; i++) {
            const cardIndex = this.takeRandomPlayerCardIndex();
            if (cardIndex !== null) {
                cards.push(this.buildCharacterCardEntry(this.allCards[cardIndex], cardIndex));
            }
        }

        for (let cardIndex of this.personalPlayerCardIndices) {
            if (this.allCards[cardIndex]) {
                cards.push(this.buildCharacterCardEntry(this.allCards[cardIndex], cardIndex));
            }
        }

        this.repositionCardsArray(cards);
        return cards;

};

Game.prototype.chooseEnemyCards = function(indices) {
        const cards = indices.map(i => {
            const card = this.buildCharacterCardEntry(this.allCards[i], i);
            card.object.size.x = 50;
            card.object.size.y = 90;
            return card;
        });
        this.enemyCharacterCards = cards;
        this.repositionEnemyCards();
        return cards;
    
};

Game.prototype.saveRemainingPlayerCardsAfterWin = function() {
        if (this.savedWinningCards || !this.gameOver || this.enemyLives > 0) {
            return;
        }

        // Reset so DB-loaded cards don't get duplicated with characterCards entries
        this.personalPlayerCardIndices = [];

        for (let card of this.characterCards) {
            if (card.visible && typeof card.cardIndex === "number") {
                this.personalPlayerCardIndices.push(card.cardIndex);
            }
        }

        savePlayerDeckToDB(this.personalPlayerCardIndices.slice());
        this.savedWinningCards = true;
};
