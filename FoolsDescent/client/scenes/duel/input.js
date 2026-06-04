Game.prototype.createEventListeners = function() {

        window.addEventListener("click", (event) => {

            const rect = ctx.canvas.getBoundingClientRect();

            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            this.checkStartButton(mouseX, mouseY);

            if (this.showTwoPentaclesChoice) {
                this.checkTwoPentaclesClick(mouseX, mouseY);
                return;
            }

            if (this.isPlayerTurnInputLocked()) {
                return;
            }

            for (let c of this.characterCards) {
                this.checkCardClick(c, mouseX, mouseY);
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
        
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
        
            this.checkCardHover(mouseX, mouseY);
        });
    
};

Game.prototype.checkCardHover = function(mouseX, mouseY) {

        this.hoveredCard = null;

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

Game.prototype.checkStartButton = function(mouseX, mouseY) {
        if (!this.gameOver && this.startSound.paused){
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

            this.showStartButton = false;

            this.showIntroText = true;

            setTimeout(() => {

                this.showIntroText = false;
                this.showPlayerCards = true;
                this.showEnemyCards = true;

            }, 5000);
        }
    
};
