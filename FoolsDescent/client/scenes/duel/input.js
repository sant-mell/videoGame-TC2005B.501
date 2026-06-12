// wires click and mousemove to the relevant game interaction checks
Game.prototype.createEventListeners = function() {

        window.addEventListener("click", (event) => {
            // scale mouse coords from CSS pixels to canvas pixels in case the canvas is CSS-resized
            const rect = ctx.canvas.getBoundingClientRect();
            const scaleX = ctx.canvas.width / rect.width;
            const scaleY = ctx.canvas.height / rect.height;
            const mouseX = (event.clientX - rect.left) * scaleX;
            const mouseY = (event.clientY - rect.top) * scaleY;

            this.checkStartButton(mouseX, mouseY);

            // dealer intro intercepts all other clicks until dismissed
            if (this.showDealerIntro) {
                this.checkDealerIntroClick(mouseX, mouseY);
                return;
            }

            // Two of Pentacles overlay blocks normal card/deck clicks
            if (this.showTwoPentaclesChoice) {
                if (this.currentTurn !== "player") {
                    return;
                }
                this.checkTwoPentaclesClick(mouseX, mouseY);
                return;
            }

            if (this.isPlayerTurnInputLocked()) {
                return;
            }

            if (
                this.gameOver ||
                this.currentTurn !== "player" ||
                this.isCardSliding ||
                this.showFinalImage ||
                this.isGreatCardResolving
            ) {
                return;
            }

            for (let c of this.characterCards) {
                this.checkCardClick(c, mouseX, mouseY);
                // a card click may open the Two of Pentacles overlay, stop here if so
                if (this.showTwoPentaclesChoice) {
                    return;
                }
            }
            this.checkMainDeckClick(mouseX, mouseY);
            this.checkChoiceButtons(mouseX, mouseY);
            this.checkTwoPentaclesClick(mouseX, mouseY);
        });

        window.addEventListener("mousemove", (event) => {
            const rect = ctx.canvas.getBoundingClientRect();
            const scaleX = ctx.canvas.width / rect.width;
            const scaleY = ctx.canvas.height / rect.height;
            const mouseX = (event.clientX - rect.left) * scaleX;
            const mouseY = (event.clientY - rect.top) * scaleY;
            this.checkCardHover(mouseX, mouseY);
        });
};

// sets hoveredCard to whichever visible card the mouse is over, or null
Game.prototype.checkCardHover = function(mouseX, mouseY) {

        this.hoveredCard = null;

        if (this.showDealerIntro) {
            return;
        }

        if (this.isPlayerTurnInputLocked()) {
            return;
        }
    
        for (let c of this.characterCards) {
    
            if (!c.visible) {
                continue;
            }
    
            const obj = c.object;
    
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
    
                this.hoveredCard = c;
            }
        }
    
};

// starts music on any click and, if the START button is visible, begins the duel
Game.prototype.checkStartButton = function(mouseX, mouseY) {
        // music is started here (on first user gesture) because browsers block autoplay
        if (!this.gameOver && this.startSound.paused && !this.hasDealerIntro){
            this.startSound.play();
        }
        if (!this.showStartButton) {
            return;
        }

        if (
            mouseX >= this.startButton.x &&
            mouseX <= this.startButton.x + this.startButton.width &&
            mouseY >= this.startButton.y &&
            mouseY <= this.startButton.y + this.startButton.height
        ) {

            if (this.hasDealerIntro) {
                this.startDealerIntro();
                return;
            }

            this.showStartButton = false;

            this.showIntroText = true;

            setTimeout(() => {

                this.showIntroText = false;
                this.showPlayerCards = true;
                this.showEnemyCards = true;
                this.playerTurnMessage = true;

                setTimeout(() => {
                    if (this.gameOver) return;
                    this.playerTurnMessage = false;
                }, 2000);

            }, 5000);
        }
    
};

// transitions from the START button to the Dealer's intro dialog sequence
Game.prototype.startDealerIntro = function() {
        this.showStartButton = false;
        this.showDealerIntro = true;
        this.dealerIntroIndex = 0;

        if (this.dealerSpeechSound) {
            this.dealerSpeechSound.currentTime = 0;
            this.dealerSpeechSound.play().catch(() => {});
        }
};

// advances the Dealer's intro to the next line when the CONTINUE button is clicked
Game.prototype.checkDealerIntroClick = function(mouseX, mouseY) {
        const button = this.dealerIntroButton;

        if (
            mouseX < button.x ||
            mouseX > button.x + button.width ||
            mouseY < button.y ||
            mouseY > button.y + button.height
        ) {
            return;
        }

        this.dealerIntroIndex++;

        if (this.dealerIntroIndex >= this.dealerIntroLines.length) {
            this.finishDealerIntro();
        }
};

// closes the Dealer intro and starts the actual duel (shows Great Deck counts and player turn)
Game.prototype.finishDealerIntro = function() {
        this.showDealerIntro = false;
        this.hasDealerIntro = false;

        if (this.dealerSpeechSound) {
            this.dealerSpeechSound.pause();
        }

        if (!this.gameOver && this.startSound.paused) {
            this.startSound.play();
        }

        this.showIntroText = true;

        setTimeout(() => {

            this.showIntroText = false;
            this.showPlayerCards = true;
            this.showEnemyCards = true;
            this.playerTurnMessage = true;

            setTimeout(() => {
                if (this.gameOver) return;
                this.playerTurnMessage = false;
            }, 2000);

        }, 5000);
};
