Game.prototype.updatePlayerCandles = function() {
        if (this.playerLives === 5){
            this.player_candles.setSprite(
                "../assets/images/Candles.png",
                new Rect(50, 70, 280, 570)
            );
            this.extra_player_candles.setSprite(
                "../assets/images/Candles.png",
                new Rect(385, 70, 280, 570)
            );
        }
        if (this.playerLives === 4){
            this.player_candles.setSprite(
                "../assets/images/Candles.png",
                new Rect(50, 70, 280, 570)
            );
            this.extra_player_candles.setSprite(
                "../assets/images/Candles.png",
                new Rect(710, 70, 280, 570)
            );
        }
        if (this.playerLives === 3) {
            this.player_candles.setSprite(
                "../assets/images/Candles.png",
                new Rect(50, 70, 280, 570)
            );
        }
        if (this.playerLives === 2) {
            this.player_candles.setSprite(
                "../assets/images/Candles.png",
                new Rect(385, 70, 280, 570)
            );
            this.candleburn.play();
        }
        if (this.playerLives === 1) {
            this.player_candles.setSprite(
                "../assets/images/Candles.png",
                new Rect(710, 70, 280, 570)
            );
            this.candleburn.play();
        }
        if (this.playerLives === 0) {
            this.player_candles.setSprite(
                "../assets/images/Candles.png",
                new Rect(1050, 70, 280, 570)
            );
            this.candleblow.play();
        }
    
};

Game.prototype.updateEnemyCandles = function() {
    if (this.enemyLives === 5){
        this.enemy_candles.setSprite(
            "../assets/images/Candles.png",
            new Rect(50, 70, 280, 570)
        );
        this.extra_enemy_candles.setSprite(
            "../assets/images/Candles.png",
            new Rect(385, 70, 280, 570)
        );
    }
    if (this.enemyLives === 4){
        this.enemy_candles.setSprite(
            "../assets/images/Candles.png",
            new Rect(50, 70, 280, 570)
        );
        this.extra_enemy_candles.setSprite(
            "../assets/images/Candles.png",
            new Rect(710, 70, 280, 570)
        );
    }
        if (this.enemyLives >= 3) {
            this.enemy_candles.setSprite(
                "../assets/images/Candles.png",
                new Rect(50, 70, 280, 570)
            );
        }
        if (this.enemyLives === 2) {
            this.enemy_candles.setSprite(
                "../assets/images/Candles.png",
                new Rect(385, 70, 280, 570)
            );
        }
        if (this.enemyLives === 1) {
            this.enemy_candles.setSprite(
                "../assets/images/Candles.png",
                new Rect(710, 70, 280, 570)
            );
        }
        if (this.enemyLives === 0) {
            this.enemy_candles.setSprite(
                "../assets/images/Candles.png",
                new Rect(1050, 70, 280, 570)
            );
            if (!this.enemyStarActive){
            this.isEnemyShowing = false;
            this.isShowingDefeatedEnemy = true;
            }
        }
    
};

Game.prototype.repositionCards = function() {
        const y = canvasHeight - 108;
        const spacing = 100;
        const visible = []; 
        for (let c of this.characterCards) {
            if (c.visible) visible.push(c.object);
        }
        const n = visible.length;
        if (n === 0) return;
        const startX = canvasWidth / 2 - ((n - 1) * spacing) / 2;
        for (let i = 0; i < n; i++) {
            visible[i].position.x = startX + i * spacing;
            visible[i].position.y = y;
        }
    
};

Game.prototype.repositionCardsArray = function(cards) {
        const y = canvasHeight - 108;
        const spacing = 100;
        const visible = cards.filter(c => c.visible).map(c => c.object);
        const n = visible.length;
        if (n === 0) return;
        const startX = canvasWidth / 2 - ((n - 1) * spacing) / 2;
        for (let i = 0; i < n; i++) {
            visible[i].position.x = startX + i * spacing;
            visible[i].position.y = y;
        }
    
};

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
