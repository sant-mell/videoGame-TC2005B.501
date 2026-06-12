// updates the player candle sprite to match the current playerLives count (1-6)
// candle spritesheet columns: full=0, half=1, low=2, out=3
Game.prototype.updatePlayerCandles = function() {
        if (this.playerLives > 6){
            this.maxLivesMessage = true;
            this.playerLives = 6; // hard cap per GDD (two candles = 6 lives max)
            setTimeout(() => {
                this.maxLivesMessage = false;
            }, 2000);
        }
        if (this.playerLives > 1) {
            this.lastLifeSoundPlayed = false;
        }
        if (this.playerLives > 0) {
            this.candleBlowPlayed = false;
        }
        if (this.playerLives === 6){
                this.player_candles.setSprite(
                "../../../assets/images/Candles.png",
                new Rect(50, 70, 280, 570)
                );
            this.extra_player_candles.setSprite(
                "../../../assets/images/Candles.png",
                new Rect(50, 70, 280, 570)
            );
        }
        if (this.playerLives === 5){
            this.player_candles.setSprite(
                "../../../assets/images/Candles.png",
                new Rect(50, 70, 280, 570)
            );
            this.extra_player_candles.setSprite(
                "../../../assets/images/Candles.png",
                new Rect(385, 70, 280, 570)
            );
        }
        if (this.playerLives === 4){
            this.player_candles.setSprite(
                "../../../assets/images/Candles.png",
                new Rect(50, 70, 280, 570)
            );
            this.extra_player_candles.setSprite(
                "../../../assets/images/Candles.png",
                new Rect(710, 70, 280, 570)
            );
        }
        if (this.playerLives === 3) {
            this.player_candles.setSprite(
                "../../../assets/images/Candles.png",
                new Rect(50, 70, 280, 570)
            );
        }
        if (this.playerLives === 2) {
            this.player_candles.setSprite(
                "../../../assets/images/Candles.png",
                new Rect(385, 70, 280, 570)
            );
            if (!this.candleBurnPlayed) {
                this.candleburn.play();
                this.candleBurnPlayed = true;
            }
        }
        if (this.playerLives === 1) {
            this.player_candles.setSprite(
                "../../../assets/images/Candles.png",
                new Rect(710, 70, 280, 570)
            );
            this.playPlayerLastLifeSound();
            if (!this.candleBurnPlayed) {
                this.candleburn.play();
                this.candleBurnPlayed = true;
            }
        }
        if (this.playerLives === 0) {
            this.player_candles.setSprite(
                "../../../assets/images/Candles.png",
                new Rect(1050, 70, 280, 570)
            );
        }
    
};

// plays the candle-blow sound once and delays the defeat text until the sound finishes
Game.prototype.playPlayerCandleBlowSound = function() {
        if (this.candleBlowPlayed) {
            return;
        }

        this.candleBlowPlayed = true;
        this.playerDefeatSequenceStarted = true;
        this.playerDefeatTextReadyAt = performance.now() + 900;

        if (!this.candleblow) {
            return;
        }

        this.candleblow.currentTime = 0;
        this.candleblow.play().catch(() => {});
};

// applies a moon card damage to the player after the slide animation finishes
// deferred so the candle update happens at the correct visual moment
Game.prototype.resolvePendingEnemyMoonHitPlayer = function() {
        if (!this.pendingEnemyMoonHitPlayer) {
            return;
        }

        this.pendingEnemyMoonHitPlayer = false;

        if (!this.activateStrengthPower("player")) {
            this.playerLives--;
            this.updatePlayerCandles();
        }

        if (this.playerJusticeActive) {
            if (!this.activateStrengthPower("enemy")) {
                this.enemyLives--;
            }

            this.justiceMessageUntil = performance.now() + 3000;
            this.playerJusticeActive = false;
            this.updateEnemyCandles();
        }

        if (this.playerLives <= 0 && !this.activateStarPower("player")) {
            this.pendingPlayerDefeatAfterSlide = true;
        } else if (this.playerLives > 0) {
            this.pendingPlayerDefeatAfterSlide = false;
        }
};

// plays the last-life warning sound and pauses the background music while it plays
Game.prototype.playPlayerLastLifeSound = function(force = false) {
        if (!this.lastLifeSound) {
            return;
        }

        if (!force && this.lastLifeSoundPlayed) {
            return;
        }

        this.lastLifeMessage = true;
        if (this.lastLifeMessageTimeout) {
            clearTimeout(this.lastLifeMessageTimeout);
        }
        this.lastLifeMessageTimeout = setTimeout(() => {
            this.lastLifeMessage = false;
        }, 6000);

        if (this.startSound && !this.startSound.paused && !this.gameOver) {
            this.lastLifeResumeMainMusic = true;
            this.startSound.pause();
        }

        this.lastLifeSound.currentTime = 0;
        this.lastLifeSound.onended = () => {
            this.lastLifeMessage = false;

            if (
                this.lastLifeResumeMainMusic &&
                !this.gameOver &&
                this.startSound &&
                this.startSound.paused
            ) {
                this.startSound.play().catch(() => {});
            }

            this.lastLifeResumeMainMusic = false;
        };
        this.lastLifeSound.play().catch(() => {});
        this.lastLifeSoundPlayed = true;
};

// mirrors updatePlayerCandles but for the enemy side
Game.prototype.updateEnemyCandles = function() {
    if (this.enemyLives > 6){
        this.maxLivesMessage = true;
        this.enemyLives = 6;
        setTimeout(() => {
            this.maxLivesMessage = false;
        }, 2000);
    }
    if (this.enemyLives === 6){
        this.enemy_candles.setSprite(
            "../../../assets/images/Candles.png",
            new Rect(50, 70, 280, 570)
        );
        this.extra_enemy_candles.setSprite(
            "../../../assets/images/Candles.png",
            new Rect(50, 70, 280, 570)
        );
    }
    if (this.enemyLives === 5){
        this.enemy_candles.setSprite(
            "../../../assets/images/Candles.png",
            new Rect(50, 70, 280, 570)
        );
        this.extra_enemy_candles.setSprite(
            "../../../assets/images/Candles.png",
            new Rect(385, 70, 280, 570)
        );
    }
    if (this.enemyLives === 4){
        this.enemy_candles.setSprite(
            "../../../assets/images/Candles.png",
            new Rect(50, 70, 280, 570)
        );
        this.extra_enemy_candles.setSprite(
            "../../../assets/images/Candles.png",
            new Rect(710, 70, 280, 570)
        );
    }
        if (this.enemyLives >= 3) {
            this.enemy_candles.setSprite(
                "../../../assets/images/Candles.png",
                new Rect(50, 70, 280, 570)
            );
        }
        if (this.enemyLives === 2) {
            this.enemy_candles.setSprite(
                "../../../assets/images/Candles.png",
                new Rect(385, 70, 280, 570)
            );
        }
        if (this.enemyLives === 1) {
            this.enemy_candles.setSprite(
                "../../../assets/images/Candles.png",
                new Rect(710, 70, 280, 570)
            );
        }
        if (this.enemyLives === 0) {
            this.enemy_candles.setSprite(
                "../../../assets/images/Candles.png",
                new Rect(1050, 70, 280, 570)
            );
            if (!this.enemyStarActive){
            this.isEnemyShowing = false;
            this.isShowingDefeatedEnemy = true;
            }
        }
    
};

// evenly spreads visible player cards along the bottom of the canvas
Game.prototype.repositionCards = function() {
        const y = canvasHeight - 108;
        const spacing = 100;
        const visible = [];
        for (let c of this.characterCards) {
            if (c.visible !== false) visible.push(c.object);
        }
        const n = visible.length;
        if (n === 0) return;
        const startX = canvasWidth / 2 - ((n - 1) * spacing) / 2;
        for (let i = 0; i < n; i++) {
            visible[i].position.x = startX + i * spacing;
            visible[i].position.y = y;
        }
};

// same as repositionCards but works on an arbitrary cards array instead of this.characterCards
Game.prototype.repositionCardsArray = function(cards) {
        const y = canvasHeight - 108;
        const spacing = 100;
        const visible = cards.filter(c => c.visible !== false).map(c => c.object);
        const n = visible.length;
        if (n === 0) return;
        const startX = canvasWidth / 2 - ((n - 1) * spacing) / 2;
        for (let i = 0; i < n; i++) {
            visible[i].position.x = startX + i * spacing;
            visible[i].position.y = y;
        }
    
};

// spreads visible enemy cards in a tighter cluster above the table
Game.prototype.repositionEnemyCards = function() {

        const y = 330;

        const spacing = 50;

        const visible = [];

        for (let c of this.enemyCharacterCards) {

            if (c.visible !== false) {

                visible.push(c.object);
            }
        }

        const n = visible.length;

        if (n === 0) {
            return;
        }

        const startX =
            canvasWidth / 2 - ((n - 1) * spacing) / 2 + 20;

        for (let i = 0; i < n; i++) {

            visible[i].position.x =
                startX + i * spacing;

            visible[i].position.y = y;
        }
    
};
