Game.prototype.update = function(deltaTime) {
    if (!this.isCardSliding && !this.isDiscardSliding && !this.isRewardCardSliding) {
        this.resolveNoResultTie();
    }
    if (this.gameOver) {
        this.showIntroText = false;
        this.pendingRewardCard = false;
        this.playerInputLocked = false;
    }
    if (
        this.greatDeck.length === 0 &&
        !this.gameOver &&
        !this.pendingPlayerDefeatAfterSlide &&
        !this.isGreatCardResolving &&
        !this.pendingRewardCard &&
        !this.showIntroText &&
        this.playerLives > 0 &&
        this.enemyLives > 0 &&
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
    if (this.gameOver && !this.checkpointCleared) {
        this.checkpointCleared = true;
        clearDuelCheckpoint();
    }
        let dt = deltaTime / 1000;

        if (this.isCenterCardAnimating) {
            this.centerCardAnimationTime += deltaTime;

            let t =
                this.centerCardAnimationTime /
                this.centerCardAnimationDuration;

            t = Math.min(t, 1);
            t = 1 - Math.pow(1 - t, 3);

            this.centerImage.position.x =
                this.centerCardStartX +
                (this.centerCardTargetX - this.centerCardStartX) * t;

            this.centerImage.position.y =
                this.centerCardStartY +
                (this.centerCardTargetY - this.centerCardStartY) * t;

            this.centerImage.size.x =
                this.centerCardStartW +
                (this.centerCardTargetW - this.centerCardStartW) * t;

            this.centerImage.size.y =
                this.centerCardStartH +
                (this.centerCardTargetH - this.centerCardStartH) * t;

            if (t >= 1) {
                this.isCenterCardAnimating = false;
                this.centerImage.position.x = this.centerCardTargetX;
                this.centerImage.position.y = this.centerCardTargetY;
                this.centerImage.size.x = this.centerCardTargetW;
                this.centerImage.size.y = this.centerCardTargetH;
            }
        }
        

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
                            if (this.gameOver) return;
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
                        if (this.pendingEnemyMoonHitPlayer) {
                            this.resolvePendingEnemyMoonHitPlayer();
                        } else {
                            this.updatePlayerCandles();
                        }

                        setTimeout(() => {
                            if (this.gameOver) return;
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
                            if (this.gameOver) return;
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

                        this.sunImage.position.y = this.downtargetY;

                        this.isCardSliding = false;

                        setTimeout(() => {
                            if (this.gameOver) return;
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
