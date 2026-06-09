Game.prototype.draw = function(ctx) {

        // draw background
        this.background.draw(ctx);
        if (this.isEnemyShowing) {

            // Glow only when attackable
            if (this.showCenterImage && this.currentTurn === "player") {
                ctx.shadowColor = "#8b5cf6";
                ctx.shadowBlur = 20;
            }

            this.enemyImage.draw(ctx);

            ctx.shadowBlur = 0;
            ctx.shadowColor = "transparent";
        }

        if (this.isShowingDefeatedEnemy) {
            this.defeatedEnemyImage.draw(ctx);
        }
        if (this.hoveredCard) {
            for (let c of this.characterCards) {

                if (c === this.hoveredCard) {
        
                    if (!c.isHovered) {
                        c.object.position.y -= 25;
                        c.isHovered = true;
                    }
        
                } else {
        
                    if (c.isHovered) {
                        c.object.position.y += 25;
                        c.isHovered = false;
                    }
                }
                
                if (this.showPlayerCards && c.visible) {
            
                    ctx.fillStyle = "white";
                    ctx.font = "20px MedievalSharp";
                    ctx.textAlign = "center";
            
                    ctx.fillText(
                    this.hoveredCard.description,
                    canvasWidth / 2,
                    canvasHeight / 2 + 70
            );
                }
            }

        }
        else {

            for (let c of this.characterCards) {
        
                if (c.isHovered) {
                    c.object.position.y += 25;
                    c.isHovered = false;
                }
            }
        }
        for (let c of this.characterCards) {
            if (c.showInfo) {
                ctx.fillStyle = "white";
                ctx.font = "40px MedievalSharp";
                ctx.textAlign = "center";
                ctx.fillText(c.infoText, canvasWidth / 2, 100);
            }
        }
        if (this.activeEnemyCard && this.activeEnemyCard.showInfo) {

            ctx.fillStyle = "white";
            ctx.font = "40px MedievalSharp";
            ctx.textAlign = "center";
            ctx.fillText(this.activeEnemyCard.infoText, canvasWidth / 2, 100);
        }
        if (this.showIntroText && !this.gameOver) {

            ctx.fillStyle = "white";
            ctx.font = "50px MedievalSharp";
            ctx.textAlign = "center";

            ctx.fillText(
                this.sunCount + " Sun, " + this.moonCount + " Moon",
                canvasWidth / 2,
                300
            );
            ctx.fillText(
                "Good Luck",
                canvasWidth / 2,
                355
            );
        }
        if (this.magicianMessage) {
            ctx.fillStyle = "white";
            ctx.font = "40px MedievalSharp";
            ctx.textAlign = "center";
            ctx.fillText("No card has been played before, unable to repeat action. Play another card.", canvasWidth / 2, canvasHeight / 2 - 50);
        }
        if (this.starMessage) {
            ctx.fillStyle = "white";
            ctx.font = "40px MedievalSharp";
            ctx.textAlign = "center";
            ctx.fillText("Star power activated", canvasWidth / 2, canvasHeight / 2 - 100);
        }
        if (this.strengthMessage) {

            ctx.fillStyle = "white";
            ctx.font = "40px MedievalSharp";
            ctx.textAlign = "center";
        
            ctx.fillText(
                "Strength power activated",
                canvasWidth / 2,
                canvasHeight / 2 - 100
            );
        }
        if (this.maxLivesMessage) {
            if (this.currentTurn === "player"){
            ctx.fillStyle = "white";
            ctx.font = "25px MedievalSharp";
            ctx.textAlign = "center";
            ctx.fillText(
                "Reached Maximum",
                canvasWidth - 340,
                canvasHeight - 310
            );
            ctx.fillText(
                "number of lives.",
                canvasWidth - 340,
                canvasHeight - 280
            );
            }
            else {
                ctx.fillStyle = "white";
            ctx.font = "25px MedievalSharp";
            ctx.textAlign = "center";
            ctx.fillText(
                "Reached Maximum",
                canvasWidth / 2 - 390,
                canvasHeight / 2 - 80
            );
            ctx.fillText(
                "number of lives.",
                canvasWidth /2 - 390,
                canvasHeight /2 - 50
            );
            }
        }
        if (this.lastLifeMessage) {
            ctx.fillStyle = "white";
            ctx.font = "32px MedievalSharp";
            ctx.textAlign = "center";
            ctx.fillText(
                "Last Life!",
                canvasWidth - 280,
                canvasHeight - 230
            );
        }
        if (this.turnBlockedMessage) {

            ctx.font = "40px serif";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
        
            ctx.fillText(
                "Your turn is blocked!",
                canvasWidth / 2,
                canvasHeight / 2 + 250
            );
        }
        if (!this.showStartButton)  {
            
            // then draw the deck image on top as normal
            ctx.fillStyle = "white";
            ctx.font = "30px MedievalSharp";
            ctx.textAlign = "center";

            this.enemy_candles.draw(ctx)
            if (this.enemyLives > 3) {
                this.extra_enemy_candles.draw(ctx);
            }
            this.player_candles.draw(ctx)
            if (this.playerLives > 3) {
                this.extra_player_candles.draw(ctx);
            }

            // COIN DISPLAY
            ctx.fillStyle = "gold";
            ctx.font = "24px MedievalSharp";
            ctx.textAlign = "left";
            ctx.fillText("Coins: $" + (parseInt(localStorage.getItem("playerCoins") || "0") + this.coins), 140, 55);

            ctx.textAlign = "center";
            this.drawPowerSymbols(ctx);
        }
        if (this.showStartButton) {
            this.drawCustomHitbox(ctx, this.startButton);
        }
        if (this.showDealerIntro) {
            this.drawDealerIntro(ctx);
        }
        if (this.playerTurnMessage) {
            ctx.fillStyle = "white";
            ctx.font = "45px MedievalSharp";
            ctx.textAlign = "center";
            ctx.fillText("Your turn", canvasWidth / 2, 400);
        }
        if (this.sunMessage) {

            const sunExtraTurnText = this.sunMessageOwner === "enemy"
                ? "Enemy gets another turn"
                : "You get another turn";

            ctx.fillStyle = "white";
            ctx.font = "40px MedievalSharp";
            ctx.textAlign = "center";
            ctx.fillText(
                "Lucky guess.",
                canvasWidth / 2,
                100
            );
            ctx.fillText(
                sunExtraTurnText,
                canvasWidth / 2,
                140
            );
        }
        if (this.playerHandBlockedMessage) {
            ctx.fillStyle = "white";
            ctx.font = "32px MedievalSharp";
            ctx.textAlign = "center";
            ctx.fillText(
                "The enemy has blocked your hand for this turn.",
                canvasWidth / 2,
                canvasHeight - 100
            );
        }

        // draw actors
        for (let actor of this.actors) {
            actor.draw(ctx);
        }

        if (this.showPlayerCards) {
            for (let c of this.characterCards) {
                if (c.visible) {
                    c.object.draw(ctx);
                }
            }
        }
        if (this.showEnemyCards && !this.showStartButton && !this.showIntroText) {
            for (let c of this.enemyCharacterCards) {
                if (c.visible !== false) {
                    c.object.draw(ctx);
                }
            }
        }
        if (this.activeEnemyCard) {
            this.activeEnemyCard.object.draw(ctx);
        }

        if (this.showTwoPentaclesChoice) {

            ctx.fillStyle = "rgba(0,0,0,0.6)";
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
            ctx.fillStyle = "white";
            ctx.font = "36px MedievalSharp";
            ctx.textAlign = "center";
        
            ctx.fillText(
                "Choose a card",
                canvasWidth / 2,
                canvasHeight / 2 - 130
            );

            if (this.twoPentaclesCards.length === 1) {
                ctx.font = "22px MedievalSharp";
                ctx.fillText(
                    "Only one card remaining from the Great Deck!",
                    canvasWidth / 2,
                    canvasHeight / 2 - 92
                );
            }
	        
            const leftCx = this.twoPentaclesCards.length === 1
                ? canvasWidth / 2
                : this.twoPentaclesLeft.x +
                    this.twoPentaclesLeft.width / 2;
	        
            const leftCy = this.twoPentaclesCards.length === 1
                ? canvasHeight / 2
                : this.twoPentaclesLeft.y +
                    this.twoPentaclesLeft.height / 2;
        
            if (this.twoPentaclesCards[0] === "moon") {
        
                this.finalImage.position.x = leftCx;
                this.finalImage.position.y = leftCy;
        
                this.finalImage.draw(ctx);
        
            } else {
        
                this.sunImage.position.x = leftCx;
                this.sunImage.position.y = leftCy;
        
                this.sunImage.draw(ctx);
            }
        
            if (this.twoPentaclesCards.length === 2) {
                const rightCx =
                    this.twoPentaclesRight.x +
                    this.twoPentaclesRight.width / 2;
	        
                const rightCy =
                    this.twoPentaclesRight.y +
                    this.twoPentaclesRight.height / 2;
	        
                if (this.twoPentaclesCards[1] === "moon") {
	        
                    this.finalImage.position.x = rightCx;
                    this.finalImage.position.y = rightCy;
	        
                    this.finalImage.draw(ctx);
	        
                } else {
	        
                    this.sunImage.position.x = rightCx;
                    this.sunImage.position.y = rightCy;
	        
                    this.sunImage.draw(ctx);
                }
            }
        
            this.finalImage.position.x = canvasWidth / 2;
            this.finalImage.position.y = canvasHeight / 2;
        
            this.sunImage.position.x = canvasWidth / 2;
            this.sunImage.position.y = canvasHeight / 2;
        }

        // DISCARD SLIDE
        if (this.isDiscardSliding) {
            if (this.discardCardType === "moon") {
                this.finalImage.position.x = this.discardX;
                this.finalImage.position.y = this.discardY;
                this.finalImage.draw(ctx);
                this.finalImage.position.x = canvasWidth / 2;
                this.finalImage.position.y = canvasHeight / 2;
            } else {
                this.sunImage.position.x = this.discardX;
                this.sunImage.position.y = this.discardY;
                this.sunImage.draw(ctx);
                this.sunImage.position.x = canvasWidth / 2;
                this.sunImage.position.y = canvasHeight / 2;
            }
        }

        if (this.showPeekCard) {

            if (this.peekedCard === "moon") {

                this.finalImage.position.x = 250;
                this.finalImage.position.y = 250;

                this.finalImage.draw(ctx);
            }

            if (this.peekedCard === "sun") {

                this.sunImage.position.x = 250;
                this.sunImage.position.y = 250;

                this.sunImage.draw(ctx);
            }
        }


        // draw hitboxes
        //this.drawHitbox(ctx, this.card);
        //this.drawHitbox(ctx, this.card2);
        //this.drawHitbox(ctx, this.card3);
        if (this.showCenterImage) {
            this.centerImage.draw(ctx);
        }
        // DRAW BUTTONS ONLY WHEN CENTER IMAGE EXISTS
        if (
            this.showCenterImage &&
            this.currentTurn === "player" &&
            !this.isCenterCardAnimating
        ) {

        this.drawCustomHitbox(ctx, this.youButton);
        }

            if (this.showFinalImage) {
                    if (this.currentGreatCard === "moon") {
                        this.finalImage.draw(ctx);
                    }

                    if (this.currentGreatCard === "sun") {
                        this.sunImage.draw(ctx);
                    }
                }
            if (performance.now() < this.noResultMessageUntil) {
                ctx.fillStyle = "white";
                ctx.font = "40px MedievalSharp";
                    ctx.textAlign = "center";
                    ctx.fillText(
                        "This duel must have a result.",
                        canvasWidth / 2,
                        canvasHeight / 2 + 30
                    );
                    ctx.fillText(
                        "There is no cheating fate.",
                        canvasWidth / 2,
                        canvasHeight / 2 - 30
                    );
                }
            if (this.gameOver) {
                this.startSound.pause();
                this.showEnemyCards = false;

                if (this.playerLives <= 0 && !this.playerDefeatSequenceStarted) {
                    this.playPlayerCandleBlowSound();
                }

                if (!this.statsSent) {
                    this.statsSent = true;
                    finishDuel(this);
                }
                if (
                    this.playerLives <= 0 &&
                    performance.now() >= (this.playerDefeatTextReadyAt || 0)
                ){
                    ctx.fillStyle = "white";
                ctx.font = "70px MedievalSharp";
                ctx.textAlign = "center";

                ctx.fillText(
                    "FATE HAS SPOKEN: YOU LOST",
                    canvasWidth / 2,
                    canvasHeight / 2
                );
                }
                if(this.enemyLives <= 0){
                ctx.fillStyle = "white";
                ctx.font = "70px MedievalSharp";
                ctx.textAlign = "center";

                ctx.fillText(
                    "FATE HAS SPOKEN: YOU WON",
                    canvasWidth / 2,
                    canvasHeight / 2
                );
                }
            }
            if (performance.now() < this.justiceMessageUntil) {
                ctx.fillStyle = "white";
                ctx.font = "40px MedievalSharp";
                ctx.textAlign = "center";
                ctx.fillText("Justice activated", canvasWidth / 2, canvasHeight / 2);
            }
    
};

Game.prototype.drawDealerIntro = function(ctx) {
        const box = {
            x: 130,
            y: canvasHeight - 182,
            width: 940,
            height: 142
        };
        const button = this.dealerIntroButton;
        const text = this.dealerIntroLines[this.dealerIntroIndex] || "";

        ctx.save();
        ctx.fillStyle = "rgba(25, 15, 42, 0.94)";
        ctx.strokeStyle = "#c9a44c";
        ctx.lineWidth = 4;
        ctx.shadowColor = "#4b2f80";
        ctx.shadowBlur = 18;
        ctx.fillRect(box.x, box.y, box.width, box.height);
        ctx.strokeRect(box.x, box.y, box.width, box.height);
        ctx.shadowBlur = 0; 

        ctx.fillStyle = "#e8d7ff";
        ctx.font = "40px MedievalSharp";
        ctx.textAlign = "left";
        this.drawWrappedText(ctx, text, box.x + 25, box.y + 42, box.width - 25, 32);

        ctx.fillStyle = "#12091f";
        ctx.strokeStyle = "#c9a44c";
        ctx.lineWidth = 2;
        ctx.fillRect(button.x, button.y, button.width, button.height);
        ctx.strokeRect(button.x, button.y, button.width, button.height);

        ctx.fillStyle = "#ffffff";
        ctx.font = "20px MedievalSharp";
        ctx.textAlign = "center";
        ctx.fillText("CONTINUE", button.x + button.width / 2, button.y + 28);
        ctx.restore();
};

Game.prototype.drawWrappedText = function(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(" ");
        let line = "";

        for (let i = 0; i < words.length; i++) {
            const testLine = line.length > 0 ? line + " " + words[i] : words[i];

            if (ctx.measureText(testLine).width > maxWidth && line.length > 0) {
                ctx.fillText(line, x, y);
                line = words[i];
                y += lineHeight;
            } else {
                line = testLine;
            }
        }

        ctx.fillText(line, x, y);
};

Game.prototype.drawPowerSymbols = function(ctx) {
        if (!this.symbolsImage) {
            this.symbolsImage = new Image();
            this.symbolsImage.src = "../../../assets/images/Symbols.png";
        }

        if (!this.symbolsImage.complete) {
            return;
        }

        const cropSize = 540;
        const symbolSize = 60;
        const playerStarSymbolX = canvasWidth / 2 + 380;
        const playerStarSymbolY = 420;
        const playerJusticeSymbolX = canvasWidth / 2 + 450;
        const playerJusticeSymbolY = 490;
        const playerStrengthSymbolX = canvasWidth / 2 + 380;
        const playerStrengthSymbolY = 490;
        const playerKingSymbolX = canvasWidth / 2 + 450;
        const playerKingSymbolY = 420;

        const enemyStarSymbolX = canvasWidth / 2 + 230;
        const enemyStarSymbolY = 110;
        const enemyJusticeSymbolX = canvasWidth / 2 + 300;
        const enemyJusticeSymbolY = 180;
        const enemyStrengthSymbolX = canvasWidth / 2 + 220;
        const enemyStrengthSymbolY = 180;
        const enemyKingSymbolX = canvasWidth / 2 + 300;
        const enemyKingSymbolY = 110;

        const symbolCrops = {
            star: {
                x: 0,
                y: 0,
                width: cropSize,
                height: cropSize - 50
            },
            justice: {
                x: cropSize,
                y: 0,
                width: cropSize,
                height: cropSize - 30
            },
            strength: {
                x: cropSize,
                y: cropSize - 20,
                width: cropSize,
                height: cropSize + 20
            },
            king: {
                x: 0,
                y: cropSize,
                width: cropSize,
                height: cropSize
            } 
        };

        if (this.playerStarActive) {
            this.drawPowerSymbol(
                ctx,
                "star",
                playerStarSymbolX,
                playerStarSymbolY,
                symbolSize,
                cropSize,
                symbolCrops
            );
        }
        if (this.playerJusticeActive) {
            this.drawPowerSymbol(
                ctx,
                "justice",
                playerJusticeSymbolX,
                playerJusticeSymbolY,
                symbolSize,
                cropSize,
                symbolCrops
            );
        }
        if (this.playerStrengthActive) {
            this.drawPowerSymbol(
                ctx,
                "strength",
                playerStrengthSymbolX,
                playerStrengthSymbolY,
                symbolSize,
                cropSize,
                symbolCrops
            );
        }
        if (
            this.kingOfPentaclesActive &&
            (this.kingOfPentaclesOwner === "player" || !this.kingOfPentaclesOwner)
        ) {
            this.drawPowerSymbol(
                ctx,
                "king",
                playerKingSymbolX,
                playerKingSymbolY,
                symbolSize,
                cropSize,
                symbolCrops
            );
        }

        if (this.enemyStarActive) {
            this.drawPowerSymbol(
                ctx,
                "star",
                enemyStarSymbolX,
                enemyStarSymbolY,
                symbolSize,
                cropSize,
                symbolCrops
            );
        }
        if (this.enemyJusticeActive) {
            this.drawPowerSymbol(
                ctx,
                "justice",
                enemyJusticeSymbolX,
                enemyJusticeSymbolY,
                symbolSize,
                cropSize,
                symbolCrops
            );
        }
        if (this.enemyStrengthActive) {
            this.drawPowerSymbol(
                ctx,
                "strength",
                enemyStrengthSymbolX,
                enemyStrengthSymbolY,
                symbolSize,
                cropSize,
                symbolCrops
            );
        }
        if (this.kingOfPentaclesActive && this.kingOfPentaclesOwner === "enemy") {
            this.drawPowerSymbol(
                ctx,
                "king",
                enemyKingSymbolX,
                enemyKingSymbolY,
                symbolSize,
                cropSize,
                symbolCrops
            );
        }
};

Game.prototype.drawPowerSymbol = function(
    ctx,
    symbol,
    x,
    y,
    symbolSize,
    cropSize,
    symbolCrops
) {
        const crop = symbolCrops[symbol];

        ctx.drawImage(
            this.symbolsImage,
            crop.x,
            crop.y,
            crop.width,
            crop.height,
            x,
            y,
            symbolSize,
            symbolSize
        );
};

Game.prototype.drawCustomHitbox = function(ctx, hitbox) {
        if (hitbox === this.startButton) {

            ctx.fillStyle = "#2a1d3f";
            ctx.shadowColor = "#8b5cf6";
            ctx.shadowBlur = 25;

            ctx.fillRect(
                hitbox.x,
                hitbox.y,
                hitbox.width,
                hitbox.height
            );
            ctx.fillStyle = "white";
            ctx.font = "30px MedievalSharp";
            ctx.textAlign = "center";
            ctx.strokeStyle = "#c9a44c";
            ctx.lineWidth = 4;

            ctx.fillText(
            "START",
            hitbox.x + hitbox.width / 2,
            hitbox.y + hitbox.height / 2 + 10
            );
            ctx.shadowBlur = 0;
            ctx.shadowColor = "transparent";
        }
        if (hitbox === this.youButton) {
            
            ctx.fillStyle = "#2a1d3f";
            ctx.shadowColor = "#8b5cf6";
            ctx.shadowBlur = 30;

            ctx.fillRect(
                hitbox.x,
                hitbox.y,
                hitbox.width,
                hitbox.height
            );
            ctx.fillStyle = "white";
            ctx.font = "25px MedievalSharp";
            ctx.textAlign = "center";
        
            ctx.fillText(
            "You",
            hitbox.x + hitbox.width / 2,
            hitbox.y + hitbox.height / 2 + 8
            );
            ctx.shadowBlur = 0;
            ctx.shadowColor = "transparent";
        }
        
        ctx.strokeRect(
            hitbox.x,
            hitbox.y,
            hitbox.width,
            hitbox.height
        );
    
};

Game.prototype.drawHitbox = function(ctx, card) {

        const left = card.position.x - card.size.x / 2;
        const top = card.position.y - card.size.y / 2;

        //ctx.strokeStyle = "red";
        ctx.lineWidth = 3;

        ctx.strokeRect(
            left,
            top,
            card.size.x,
            card.size.y
        );
    
};
