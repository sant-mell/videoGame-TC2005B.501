// drives the enemy's turn for rare-tier duels; prioritizes Strength when at 1 life
Game.prototype.intermedio_enemy_turn = function() {

        if (this.gameOver) return;
        if (this.showIntroText) {
            setTimeout(() => {
                if (this.gameOver) return;
                this.intermedio_enemy_turn();
            }, 250);
            return;
        }
        if (this.greatDeck.length <= 0) return;
    
        if (this.enemyTurnBlocked) {
            this.enemyTurnBlocked = false;
            this.playerStrengthActive = false;
            this.showPlayerCards = true;
            this.showEnemyCards = false;
            this.currentTurn = "player";
            this.playerTurnMessage = true;
            setTimeout(() => {
                this.playerTurnMessage = false;
            }, 2000);
            return;
        }
    
        this.showEnemyCards = true;
        this.showPlayerCards = false;
        this.currentTurn = "enemy";
    
        const skipEnemyCharacterCard = this.enemyHandBlocked;

            if (this.enemyHandBlocked) {
                this.enemyHandBlocked = false;
            }
    
        setTimeout(() => {

            if (this.gameOver) return;
    
            let enemyCard;

            // Uses Strength if they have one live left
            if (this.enemyLives === 1) {
                enemyCard = this.enemyCharacterCards.find(
                    card => card.name === "Strength"
                );
            }

            // It's random the rest of the time
            if (!enemyCard) {
                
                let availableCards = this.enemyCharacterCards;

                if (this.enemyLives !== 1) {
                    availableCards = availableCards.filter(
                        card => card.name !== "Strength"
                    );
                }

                if (availableCards.length <= 0) {
                    availableCards = this.enemyCharacterCards;
                }

                enemyCard = availableCards[
                    Math.floor(Math.random() * availableCards.length)
                ];
            }

            const chosenIndex = this.enemyCharacterCards.indexOf(enemyCard);

            if (this.enemyCharacterTurnCounter == null) {
                this.enemyCharacterTurnCounter = 0;
            }

            this.enemyCharacterTurnCounter++;

            const canUseCharacterCard =
                this.enemyCharacterTurnCounter <= 2;

            const hasCharacterCard =
                !skipEnemyCharacterCard &&
                canUseCharacterCard &&
                this.enemyCharacterCards.length > 0 &&
                enemyCard != null;

            if (this.enemyCharacterTurnCounter >= 3) {
                this.enemyCharacterTurnCounter = 0;
            }
    
            if (hasCharacterCard) {
    
                // hide other cards, move chosen card to center
                setTimeout(() => {
                if (this.gameOver) return;
                this.showEnemyCards = false;
                this.activeEnemyCard = enemyCard;
    
                enemyCard.object.position.x = canvasWidth / 2;
                enemyCard.object.position.y = canvasHeight / 2;
                enemyCard.object.size.x = 100;
                enemyCard.object.size.y = 175;
                }, 1000);

                // show info text after card is in center
                setTimeout(() => {
                    if (this.gameOver) return;
                    enemyCard.showInfo = enemyCard.name !== "The Magician" || this.lastPlayedAction;
                    if (enemyCard.name === "The Star") {
                        enemyCard.infoText = "The enemy will be revived if they reach 0 lives!";
                    }
                    if (enemyCard.name === "The Hermit") {
                        enemyCard.infoText = "Your turn will be blocked!";
                    }
                    if (enemyCard.name === "Strength") {
                        enemyCard.infoText = "Enemy can't die this round!";
                    }
                    if (enemyCard.name === "Justice") {
                        enemyCard.infoText = "If the enemy loses a life on this turn or the next one so do you!";
                    }
                    if (enemyCard.name === "The Hanged Man") {
                        enemyCard.infoText = "The enemy has blocked your hand for the next turn.";
                    }
                    enemyCard.showInfo = true;
                }, 1500);
    
	                // apply effect and remove card
	                setTimeout(() => {
                    if (this.gameOver) return;
	                    enemyCard.action();
                    if (enemyCard.name === "The Magician" && this.magicianRepeating) {
                        enemyCard.showInfo = true;

                        setTimeout(() => {
                            if (this.gameOver) return;
                            enemyCard.infoText = this.pendingMagicianInfoText;
                            this.pendingMagicianAction();
                        }, 800);

                        setTimeout(() => {
                            if (this.gameOver) return;
                            this.magicianRepeating = false;
                            enemyCard.showInfo = false;
                            enemyCard.infoText = "Repeating the last card played...";
                            enemyCard.object.size.x = 50;
                            enemyCard.object.size.y = 90;
                            this.activeEnemyCard = null;
                            this.enemyCharacterCards.splice(chosenIndex, 1);
                            this.repositionEnemyCards();
                        }, 1800);

                        return;
                    }
	                    if (enemyCard.name !== "The Magician") {
                        this.lastPlayedInfoText = enemyCard.infoText;
	                        this.lastPlayedAction = enemyCard.action;
	                        this.lastPlayedName = enemyCard.name;
	                    }
                    enemyCard.showInfo = false;
                    enemyCard.object.size.x = 50;
                    enemyCard.object.size.y = 90;
                    this.activeEnemyCard = null;
                    this.enemyCharacterCards.splice(chosenIndex, 1);
                    this.repositionEnemyCards();
                }, 5000);
    
                // after character card resolves, draw from main deck
                setTimeout(() => {
                    if (this.gameOver) return;
                    this.startCenterCardAnimation();
                }, 7000);
    
                setTimeout(() => {
                    if (this.gameOver) return;
                    this.showCenterImage = false;
                    this.resolveEnemyDeckDraw();
                }, 8000);
    
            } else {
	    
                // no character card, draw from main deck immediately
                setTimeout(() => {
                    if (this.gameOver) return;
                    this.showEnemyCards = false;
                    this.startCenterCardAnimation();
                }, 500);
    
                setTimeout(() => {
                    if (this.gameOver) return;
                    this.showCenterImage = false;
                    this.resolveEnemyDeckDraw();
                }, 4000);
            }
    
        }, 500);
    
};

// draws from the Great Deck for the enemy; rare-tier AI targets self 30% of the time
Game.prototype.resolveEnemyDeckDraw = function() {

    if (this.gameOver) return;
    if (this.handleEmptyEnemyDeckDraw()) return;

    this.currentGreatCard = this.greatDeck.shift();
    this.isGreatCardResolving = true;

    this.pendingEnemyMoonHitPlayer = false;
    this.pendingPlayerDefeatAfterSlide = false;
    this.finalImage.position.x = canvasWidth / 2;
    this.finalImage.position.y = canvasHeight / 2;
    this.sunImage.position.x = canvasWidth / 2;
    this.sunImage.position.y = canvasHeight / 2;

    this.showFinalImage = true;

    // Probability: 70% they attack you, 30% they choose themselves
    const enemyTargetsSelf = Math.random() < 0.30;

    setTimeout(() => {
        if (this.gameOver) return;
        this.slideDirection = enemyTargetsSelf ? "up" : "down";
        this.isCardSliding = true;
    }, 500);

    if (this.currentGreatCard === "moon") {

        if (enemyTargetsSelf) {
            if (!this.activateStrengthPower("enemy")) {
                this.enemyLives--;
                this.updateEnemyCandles();
            }
            if (this.enemyJusticeActive) {
                if (!this.activateStrengthPower("player")) {
                    this.playerLives--;
                }
                this.justiceMessageUntil = performance.now() + 3000;
                this.enemyJusticeActive = false;
                this.updatePlayerCandles();
                if (this.playerLives <= 0 && !this.activateStarPower("player")) {
                    this.pendingPlayerDefeatAfterSlide = true;
                } else if (this.playerLives > 0) {
                    this.pendingPlayerDefeatAfterSlide = false;
                }
            }
            if (this.enemyLives <= 0 && !this.activateStarPower("enemy")) {
                this.gameOver = true;
            }

        } else {
            this.pendingEnemyMoonHitPlayer = true;
        }
    }

    if (this.currentGreatCard === "sun") {
        if (enemyTargetsSelf) {
            this.sunMessageOwner = "enemy";
            this.sunMessage = true;
            setTimeout(() => { this.sunMessage = false; }, 2000);
        }
    }

    setTimeout(() => {
        this.isGreatCardResolving = false;
        this.showFinalImage = false;

        if (this.pendingPlayerDefeatAfterSlide) {
            this.pendingPlayerDefeatAfterSlide = false;
            this.gameOver = true;
            this.playPlayerCandleBlowSound();
            return;
        }

        this.playerStrengthActive = false;

        if (!this.gameOver) saveDuelCheckpoint(this);
        if (this.gameOver) return;

        // If the enemy targeted themselves and it was a sun, they also get another turn
        if (enemyTargetsSelf) {

            if (this.currentGreatCard === "sun") {
                this.enemyHasExtraTurn = true;
                this.enemyTurnFn = () => this.intermedio_enemy_turn();
                this.intermedio_enemy_turn();
                return;
            }

	            // If they targeted themselves and it was a moon, it's now the players turn
            if (this.playerTurnBlocked) {
                this.playerTurnBlocked = false;
                this.currentTurn = "enemy";
                this.turnBlockedMessage = true;

                setTimeout(() => {
                    if (this.gameOver) return;
                    this.turnBlockedMessage = false;
                    this.intermedio_enemy_turn();
                }, 2000);

                return;
            }

	            this.currentTurn = "player";
	            this.showEnemyCards = true;

            this.playerTurnMessage = true;
            setTimeout(() => {
                this.playerTurnMessage = false;
            }, 2000);
	
	            if (this.playerHandBlocked) {
                this.showPlayerCards = false;
                this.playerHandBlockedMessage = true;
            } else {
                this.showPlayerCards = true;
            }
            return;
        }

        if (this.playerTurnBlocked) {
            this.playerTurnBlocked = false;
            this.currentTurn = "enemy";
            this.turnBlockedMessage = true;

            setTimeout(() => {
                if (this.gameOver) return;
                this.turnBlockedMessage = false;
                this.intermedio_enemy_turn();
            }, 2000);

            return;
        }

	        this.currentTurn = "player";
	        this.showEnemyCards = true;

        this.playerTurnMessage = true;
        setTimeout(() => {
            if (this.gameOver) return;
            this.playerTurnMessage = false;
        }, 2000);
	
	        if (this.playerHandBlocked) {
            this.showPlayerCards = false;
            this.playerHandBlockedMessage = true;
        } else {
            this.showPlayerCards = true;
        }

    }, 3000);

};
