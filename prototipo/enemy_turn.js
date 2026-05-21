Game.prototype.enemyTurn = function() {

        if (this.gameOver) return;
        if (this.greatDeck.length <= 0) return;
    
        if (this.enemyTurnBlocked) {
            this.enemyTurnBlocked = false;
            this.showPlayerCards = true;
            this.showEnemyCards = false;
            this.currentTurn = "player";
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
    
            const randomIndex = Math.floor(Math.random() * this.enemyCharacterCards.length);
            const enemyCard = this.enemyCharacterCards[randomIndex];
            const hasCharacterCard = !skipEnemyCharacterCard && this.enemyCharacterCards.length > 0 && enemyCard != null;
    
            if (hasCharacterCard) {
    
                // hide other cards, move chosen card to center
                setTimeout(() => {
                this.showEnemyCards = false;
                this.activeEnemyCard = enemyCard;
    
                enemyCard.object.position.x = canvasWidth / 2;
                enemyCard.object.position.y = canvasHeight / 2;
                enemyCard.object.size.x = 100;
                enemyCard.object.size.y = 175;
                }, 1000);

                // show info text after card is in center
                setTimeout(() => {
                    enemyCard.showInfo = enemyCard.name !== "The Magician" || this.lastPlayedAction;
                    if (enemyCard.name === "The Star") {
                        enemyCard.infoText = "The enemy will be revived if they reach 0 lives!";
                    }
                    if (enemyCard.name === "The Hermit") {
                        enemyCard.infoText = "Your turn will be blocked!";
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
                    enemyCard.action();
                    if (enemyCard.name !== "The Magician") {
                        this.lastPlayedAction = enemyCard.action;
                        this.lastPlayedName = enemyCard.name;
                    }
                    enemyCard.showInfo = false;
                    enemyCard.object.size.x = 50;
                    enemyCard.object.size.y = 90;
                    this.activeEnemyCard = null;
                    this.enemyCharacterCards.splice(randomIndex, 1);
                    this.repositionEnemyCards();
                }, 5000);
    
                // after character card resolves, draw from main deck
                setTimeout(() => {
                    this.showCenterImage = true;
                }, 7000);
    
                setTimeout(() => {
                    this.showCenterImage = false;
                    this.resolveEnemyDeckDraw();
                }, 8000);
    
            } else {
    
                // no character card, draw from main deck immediately
                setTimeout(() => {
                    this.showCenterImage = true;
                }, 500);
    
                setTimeout(() => {
                    this.showCenterImage = false;
                    this.resolveEnemyDeckDraw();
                }, 4000);
            }
    
        }, 500);
    
};

Game.prototype.resolveEnemyDeckDraw = function() {
    
        this.currentGreatCard = this.greatDeck.shift();
        this.showFinalImage = true;
    
        setTimeout(() => {
            this.slideDirection = "down";
            this.isCardSliding = true;
        }, 500);
    
        if (this.currentGreatCard === "moon") {
            if (!this.activateStrengthPower("player")) {
                this.playerLives--;
            }
            if (this.playerJusticeActive) {
                if (!this.activateStrengthPower("enemy")) {
                    this.enemyLives--;
                }
            
                this.justiceMessageUntil = performance.now() + 3000;
            
                this.playerJusticeActive = false;
                this.updateEnemyCandles();
            }
        }
    
        if (this.playerLives <= 0 && !this.activateStarPower("player")) {
            this.gameOver = true;
        }
    
        setTimeout(() => {

            this.showFinalImage = false;
        
            if (this.gameOver) {
                return;
            }
            console.log("BEFORE BLOCK CHECK", this.playerTurnBlocked);
            // PLAYER TURN BLOCKED
            if (this.playerTurnBlocked) {
                console.log("BLOCK Works", this.playerTurnBlocked);
                this.playerTurnBlocked = false;
        
                this.currentTurn = "enemy";
        
                this.turnBlockedMessage = true;
        
                setTimeout(() => {
        
                    this.turnBlockedMessage = false;
        
                    this.enemyTurn();
        
                }, 2000);
        
                return;
            }
        
            // NORMAL FLOW
            this.currentTurn = "player";
            this.showEnemyCards = true;

            if (this.playerHandBlocked) {
                this.showPlayerCards = false;
                this.playerHandBlockedMessage = true;
            } else {
                this.showPlayerCards = true;
            }
        
        }, 3000);
    
};
