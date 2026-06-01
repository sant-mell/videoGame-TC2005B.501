Game.prototype.update = function(deltaTime) {
    this.resolveNoResultTie();
    if (
        this.greatDeck.length === 0 &&
        !this.gameOver &&
        !this.showTwoPentaclesChoice &&
        !this.showCenterImage &&
        !this.showFinalImage &&
        !this.isCardSliding &&
        !this.isDiscardSliding
    ) {
        this.buildGreatDeck(true);
    }
    this.startPendingRewardCard();
    this.saveRemainingPlayerCardsAfterWin();
        let dt = deltaTime / 1000;
        

        // DISCARD SLIDE
        if (this.isDiscardSliding) {
            this.discardX += this.slideSpeed * dt;
            if (this.discardX >= canvasWidth + 80) {
                this.isDiscardSliding = false;
                this.discardX = canvasWidth / 2;
                this.discardY = canvasHeight / 2;
            }
        }

        if (this.isCardSliding) {

            // MOON CARD
            if (this.currentGreatCard === "moon") {

                // UP
                if (this.slideDirection === "up") {

                    this.finalImage.position.y -= this.slideSpeed * dt;

                    if (this.finalImage.position.y <= this.uptargetY) {

                        this.finalImage.position.y = this.uptargetY;
                        this.updateEnemyCandles();
                        this.isCardSliding = false;

                        setTimeout(() => {

                            this.showFinalImage = false;

                            this.finalImage.position.x = canvasWidth / 2;
                            this.finalImage.position.y = canvasHeight / 2;

                        }, 300);
                    }
                }

                // DOWN
                if (this.slideDirection === "down") {

                    this.finalImage.position.y += this.slideSpeed * dt;
                
                    if (this.finalImage.position.y >= this.downtargetY) {
                
                        this.finalImage.position.y = this.downtargetY;
                        this.isCardSliding = false;
                        this.candleBurnPlayed = false;
                        this.updatePlayerCandles();
                
                        setTimeout(() => {
                            this.showFinalImage = false;
                            this.finalImage.position.x = canvasWidth / 2;
                            this.finalImage.position.y = canvasHeight / 2;
                        }, 300);
                    }
                }
                
            }
            // SUN CARD
            if (this.currentGreatCard === "sun") {

                // UP
                if (this.slideDirection === "up") {

                    this.sunImage.position.y -= this.slideSpeed * dt;

                    if (this.sunImage.position.y <= this.uptargetY) {

                        this.sunImage.position.y = this.uptargetY;

                        this.isCardSliding = false;

                        setTimeout(() => {

                            this.showFinalImage = false;

                            this.sunImage.position.x = canvasWidth / 2;
                            this.sunImage.position.y = canvasHeight / 2;

                        }, 300);
                    }
                }

                // DOWN
                if (this.slideDirection === "down") {

                    this.sunImage.position.y += this.slideSpeed * dt;

                    if (this.sunImage.position.y >= this.downtargetY)  {

                        this.finalImage.position.y = this.downtargetY;

                        this.isCardSliding = false;

                        setTimeout(() => {

                            this.showFinalImage = false;

                            this.sunImage.position.x = canvasWidth / 2;
                            this.sunImage.position.y = canvasHeight / 2;

                        }, 300);
                    }
                }
            }
        }
        if (this.isRewardCardSliding && this.rewardCard) {
            const card = this.rewardCard.object;
            const dx = this.rewardCardTargetX - card.position.x;
            const dy = this.rewardCardTargetY - card.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const step = this.slideSpeed * dt;
        
            if (distance <= step) {
                card.position.x = this.rewardCardTargetX;
                card.position.y = this.rewardCardTargetY;
                this.finishRewardCardSlide();
            } else {
                card.position.x += (dx / distance) * step;
                card.position.y += (dy / distance) * step;
            }
        }
        // update actors
        for (let actor of this.actors) {
            actor.updateFrame(deltaTime);
        }
    
};
