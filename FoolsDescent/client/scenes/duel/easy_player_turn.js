Game.prototype.activateTwoPentacles = function() {

        if (this.greatDeck.length < 2) {
            return;
        }

        this.twoPentaclesCards = [
            this.greatDeck.shift(),
            this.greatDeck.shift()
        ];

        this.showTwoPentaclesChoice = true;
        this.showPlayerCards = false;

};

Game.prototype.resolveTwoPentacles = function(chosenIndex) {

        this.currentGreatCard = this.twoPentaclesCards[chosenIndex];

        this.showTwoPentaclesChoice = false;

        this.discardCardType = this.twoPentaclesCards[1 - chosenIndex];

        this.discardX = canvasWidth / 2;
        this.discardY = canvasHeight / 2;

        this.isDiscardSliding = true;

        this.showFinalImage = true;

        setTimeout(() => {

            this.slideDirection = "down";
            this.isCardSliding = true;

        }, 500);

        if (this.currentGreatCard === "moon") {

            if (!this.activateStrengthPower("player")) {
                this.playerLives--;

                if (this.playerJusticeActive) {

                    if (!this.activateStrengthPower("enemy")) {
                        this.enemyLives--;
                    }

                    this.playerJusticeActive = false;

                    this.updateEnemyCandles();

                    if (this.enemyLives <= 0 && !this.activateStarPower("enemy")) {
                        this.gameOver = true;
                    }
                }
            }

            this.currentTurn = "enemy";
        }

        if (this.currentGreatCard === "sun") {

            this.currentTurn = "player";

            this.sunMessage = true;

            if (this.pageOfPentaclesActive) {

                this.coins += this.kingOfPentaclesActive ? 100 : 50;

                this.pageOfPentaclesActive = false;
                this.kingOfPentaclesActive = false;
            }

            setTimeout(() => {

                this.sunMessage = false;

            }, 2000);
        }

        setTimeout(() => {

            this.showFinalImage = false;

            if (this.playerLives <= 0) {

                if (this.activateStarPower("player")) {
                    this.showPlayerCards = true;

                    this.currentTurn = "player";

                    return;
                }

                this.gameOver = true;

                this.showPlayerCards = false;

                return;
            }

            if (this.currentTurn === "enemy") {

                this.easy_enemy_turn();

            } else {

                this.showPlayerCards = true;
            }

        }, 3000);

};

Game.prototype.checkCardClick = function(cardEntry, mouseX, mouseY) {
        if (this.currentTurn !== "player") {
            return;
        }
        if (!this.showPlayerCards) {
            return;
        }
        if (this.playerHandBlocked) {
            return;
        }
        if (this.showStartButton) {
            return;
        }
        if (this.showCenterImage) {
            return;
        }
        if (!cardEntry.visible) {
            return;
        }

        const obj = cardEntry.object;
        const left = obj.position.x - obj.size.x / 2;
        const right = obj.position.x + obj.size.x / 2;
        const top = obj.position.y - obj.size.y / 2;
        const bottom = obj.position.y + obj.size.y / 2;

        if (
            mouseX >= left &&
            mouseX <= right &&
            mouseY >= top &&
            mouseY <= bottom
        ) {
            // MOVE CARD TO CENTER

            obj.position.x = canvasWidth / 2;
            obj.position.y = canvasHeight / 2;
            this.showEnemyCards = false;
            cardEntry.action();
            if (cardEntry.name === "The Magician" && this.magicianRepeating) {
                cardEntry.showInfo = true;
            
                setTimeout(() => {
                    cardEntry.infoText = this.pendingMagicianInfoText;
                    this.pendingMagicianAction();
                }, 2000);
            
                setTimeout(() => {
                    this.magicianRepeating = false;
                    cardEntry.visible = false;
                    cardEntry.showInfo = false;
                    cardEntry.infoText = "Repeating the last card played...";
                    this.showEnemyCards = true;
                    this.repositionCards();
                }, 4000);
            
                return;
            }
            cardEntry.showInfo = cardEntry.name !== "The Magician" || this.magicianHadLastCard;
            if (cardEntry.name !== "The Magician") {
                this.lastPlayedInfoText = cardEntry.infoText;
                this.lastPlayedAction = cardEntry.action;
                this.lastPlayedName = cardEntry.name;
            }

            setTimeout(() => {
                cardEntry.visible = false;
                cardEntry.showInfo = false;
                this.showEnemyCards = true;
                this.repositionCards();
            }, 2000);
        }

};

Game.prototype.checkMainDeckClick = function(mouseX, mouseY) {
        if (this.currentTurn !== "player") {
            return;
        }
        if (this.showStartButton) {
            return;
        }
        if (this.showCenterImage) {
            return;
        }
        if (this.showIntroText) {
            return;
        }
        if (this.showTwoPentaclesChoice) {
            return;
        }
        let anyCardInfo = false;
        for (let c of this.characterCards) {
            if (c.showInfo) anyCardInfo = true;
        }
        if (anyCardInfo) {
            return;
        }
        if (this.showFinalImage) {
            return;
        }
        if (!this.showPlayerCards && !this.playerHandBlocked) {
            return;
        }
        if (
            mouseX >= this.maindeck.x &&
            mouseX <= this.maindeck.x + this.maindeck.width &&
            mouseY >= this.maindeck.y &&
            mouseY <= this.maindeck.y + this.maindeck.height
        ) {
            // SHOW IMAGE
            this.showCenterImage = true;
            this.playerHandBlocked = false;
            this.playerHandBlockedMessage = false;
            this.showEnemyCards = false;
            this.cardSound.play();
            this.showPlayerCards = false;
        }

};

Game.prototype.checkTwoPentaclesClick = function(mouseX, mouseY) {

        if (!this.showTwoPentaclesChoice) {
            return;
        }

        if (
            mouseX >= this.twoPentaclesLeft.x &&
            mouseX <= this.twoPentaclesLeft.x + this.twoPentaclesLeft.width &&
            mouseY >= this.twoPentaclesLeft.y &&
            mouseY <= this.twoPentaclesLeft.y + this.twoPentaclesLeft.height
        ) {

            this.resolveTwoPentacles(0);
        }

        if (
            mouseX >= this.twoPentaclesRight.x &&
            mouseX <= this.twoPentaclesRight.x + this.twoPentaclesRight.width &&
            mouseY >= this.twoPentaclesRight.y &&
            mouseY <= this.twoPentaclesRight.y + this.twoPentaclesRight.height
        ) {

            this.resolveTwoPentacles(1);
        }

};

Game.prototype.checkChoiceButtons = function(mouseX, mouseY) {
        if (this.currentTurn !== "player") {
            return;
        }
        // ONLY WORK IF CENTER IMAGE IS SHOWING
        if (!this.showCenterImage) {
            return;
        }
        // YOU BUTTON
        if (
            mouseX >= this.youButton.x &&
            mouseX <= this.youButton.x + this.youButton.width &&
            mouseY >= this.youButton.y &&
            mouseY <= this.youButton.y + this.youButton.height
        ) {

            this.showCenterImage = false;

            // DRAW TOP CARD
            this.currentGreatCard = this.greatDeck.shift();

            this.showFinalImage = true;

            setTimeout(() => {
                this.slideDirection = "down";
                this.isCardSliding = true;
            }, 1000);

            // IF MOON -> PLAYER TAKES DAMAGE
            if (this.currentGreatCard === "moon") {
                if (!this.activateStrengthPower("player")) {
                    this.playerLives--;
                    if (this.playerJusticeActive) {
                        if (!this.activateStrengthPower("enemy")) {
                            this.enemyLives--;
                        }
                        this.playerJusticeActive = false;
                        if (!this.isCardSliding){
                        this.updateEnemyCandles();
                        }
                        if (this.enemyLives <= 0 && !this.activateStarPower("enemy")) {
                            this.gameOver = true;
                        }
                    }
                }
                this.currentTurn = "enemy";
            }

            // IF SUN -> PLAYER GETS ANOTHER TURN
            if (this.currentGreatCard === "sun") {
                this.currentTurn = "player";
                this.sunMessage = true;

                setTimeout(() => {
                    this.sunMessage = false;
                }, 2000);
            }
            setTimeout(() => {
                this.showFinalImage = false;
                this.showPlayerCards = true;

                // game over check
                if (this.playerLives <= 0) {
                    if (this.activateStarPower("player")) {
                        this.showPlayerCards = true;
                        this.currentTurn = "player";
                        return;
                    }
                    this.gameOver = true;
                    this.showPlayerCards = false;
                    this.showFinalImage = false;
                    this.showCenterImage = false;

                    return;
                }
                this.enemyJusticeActive = false;
                if (this.currentTurn === "enemy") {
                    this.easy_enemy_turn();
                }

            }, 3000);
        }
        if (
        mouseX >= this.enemyButton.x &&
        mouseX <= this.enemyButton.x + this.enemyButton.width &&
        mouseY >= this.enemyButton.y &&
        mouseY <= this.enemyButton.y + this.enemyButton.height
        ) {

        this.showCenterImage = false;

        // DRAW TOP CARD
        this.currentGreatCard = this.greatDeck.shift();

        this.showFinalImage = true;

        this.finalImage.position.x = canvasWidth / 2;
        this.finalImage.position.y = canvasHeight / 2;

        this.sunImage.position.x = canvasWidth / 2;
        this.sunImage.position.y = canvasHeight / 2;

        setTimeout(() => {
            this.slideDirection = "up";
            this.isCardSliding = true;
        }, 1000);

        // IF MOON -> ENEMY TAKES DAMAGE
        if (this.currentGreatCard === "moon") {
            if (!this.activateStrengthPower("enemy")) {
                this.enemyLives--;

                if (this.enemyJusticeActive) {
                    if (!this.activateStrengthPower("player")) {
                        this.playerLives--;
                    }

                    this.justiceMessageUntil = performance.now() + 3000;

                    this.enemyJusticeActive = false;
                    this.candleBurnPlayed = false;
                    this.updatePlayerCandles();
                }
            }
        }

        // PLAYER TURN ALWAYS ENDS
        this.currentTurn = "enemy";

        setTimeout(() => {
        this.showFinalImage = false;

        // CHECK IF ENEMY LOST
        if (this.enemyLives <= 0) {
            if (this.activateStarPower("enemy")) {
                this.easy_enemy_turn();
                return;
            }

            this.gameOver = true;

            setTimeout(() => {
                this.showPlayerCards = false;
                this.showFinalImage = false;
                this.showCenterImage = false;

            }, 2000);

            return;
        }

        // enemy turn starts
        this.enemyJusticeActive = false;
        this.playerStrengthActive = false;
        this.easy_enemy_turn();

        }, 3000);
        }

};
