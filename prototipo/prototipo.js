"use strict";

// Global variables
const canvasWidth = 1200;
const canvasHeight = 600;

// Context of the Canvas
let ctx;

// A variable to store the game object
let game;
// Variable to store the time at the previous frame
let oldTime;

class Game {

    constructor() {
        this.initObjects();
        this.createEventListeners();
    }
    initObjects() {

        this.enemyLives = 3;
        this.playerLives = 3;
        this.currentTurn = "player";
        //card animation
        this.isCardSliding = false;
        this.slideDirection = "up";
        this.slideSpeed = 500; // pixels per second
        this.uptargetY = 120;
        this.downtargetY = canvasHeight - 120;
        //card hover
        this.hoveredCard = null;
        //booleans
        this.gameOver = false;
        this.showStartButton = true;
        this.sunMessage = false;
        this.isEnemyShowing = true;
        this.isShowingDefeatedEnemy = false;
        // card effect states
        this.coins = 0;
        this.pageOfPentaclesActive = false;
        this.kingOfPentaclesActive = false;
        this.starActive = false;
        this.strengthActive = false;
        this.hermitActive = false;
        this.justiceActive = false;
        this.lastPlayedAction = null;
        this.lastPlayedName = "";
        this.showTwoPentaclesChoice = false;
        this.twoPentaclesCards = [];
        this.enemyTurnBlocked = false;
        this.enemyHandBlocked = false;
        // discard animation
        this.isDiscardSliding = false;
        this.discardCardType = "";
        this.discardX = canvasWidth / 2;
        this.discardY = canvasHeight / 2;
        //audio
        this.startSound = new Audio("../assets/audio/hardEnemies (1).mov");
        this.startSound.volume = 0.2;
        this.candleburn = new Audio("../assets/audio/candle_burning.mov");
        this.candleburn.volume = 0.8;
        this.candleblow = new Audio("../assets/audio/candle_blow.mov");
        this.candleblow.volume = 0.4;
        this.cardSound = new Audio("../assets/audio/card.mpeg");
        this.cardSound.volume = 0.3;

        this.startButton = {
        x: canvasWidth / 2 - 75,
        y: canvasHeight / 2 - 40,
        width: 150,
        height: 80
        };

        this.peekedCard = "";
        this.showPeekCard = false;
        // BACKGROUND
        this.background = new AnimatedObject(
            new Vector(canvasWidth / 2, canvasHeight / 2),
            canvasWidth,
            canvasHeight,
            "gray",
            "background",
            45
        );

        this.background.setSprite(
            "../assets/images/new_table.png",
            new Rect(0, 0, 1690, 928)
        );
        this.king = new AnimatedObject(
            new Vector(canvasWidth / 2, 151.5),
            390,
            260,
            "gray",
            "enemy",
            45
        );
        
        this.king.setSprite(
            "../assets/images/The_King_new.png",
            new Rect(10, 0, 835, 600)
        );
        
        this.defeatedKing = new AnimatedObject(
            new Vector(canvasWidth / 2, 205),
            270,
            140,
            "gray",
            "enemy",
            45
        );
        
        this.defeatedKing.setSprite(
            "../assets/images/DefeatedKing_new.png",
            new Rect(0, 0, 380, 174)
        );
        this.extra_player_candles = new AnimatedObject(

            new Vector(canvasWidth - 390 , 420),
        
            90,
            200,
        
            "gray",
            "card",
            1
        );
        
        this.extra_player_candles.setSprite(
            "../assets/images/Candles.png",
            new Rect(0, 0, 380, 500)
        );
        this.player_candles = new AnimatedObject(

            // POSITION
            new Vector(canvasWidth - 290 , 420),

            // SIZE
            90,
            200,

            "gray",
            "card",
            1
        );
        this.player_candles.setSprite(
            "../assets/images/Candles.png",
            new Rect(50, 70, 280, 570)
        );
        this.enemy_candles = new AnimatedObject(

            // POSITION
            new Vector(canvasWidth / 2 - 282 , 217),

            // SIZE
            90,
            180,

            "gray",
            "card",
            1
        );
        this.enemy_candles.setSprite(
            "../assets/images/Candles.png",
            new Rect(50, 70, 280, 570)
        );

        this.greatDeck = [
            "sun",
            "sun",
            "moon",
            "moon",
            "moon",
            "moon",
            "moon",
            "moon",
            "moon",
            "moon",
            "sun",
            "sun"
        ];
        this.greatDeck.sort(() => Math.random() - 0.5);

        this.currentGreatCard = "";
        this.sunCount = 0;
        this.moonCount = 0;

        for (let card of this.greatDeck) {

        if (card === "sun") {
            this.sunCount++;
        }
        if (card === "moon") {
            this.moonCount++;
        }
}
        // All card definitions in the pool
        this.allCards = this.buildAllCards();

        // Deal 3 random starting cards from the full pool
        //this.characterCards = this.dealStartingCards(3);

        // Manually choose starting cards by index
        this.characterCards = this.chooseStartingCards([0, 5, 10]);

        // Enemy character cards
        this.enemyCharacterCards = this.chooseEnemyCards([
            11, // Lovers
            14, // Devil
            12, // Hanged Man
            9,  // Wheel of Fortune
            7,  // Hermit
            1   // Chariot
        ]);

        this.repositionEnemyCards();

        this.maindeck = {
            x: 273,
            y: 350,
            width: 95,
            height: 95
        };
        this.enemyButton = {
            // ==== OCUPAMOS ARREGLAR ESTE, ROMPE TODO EL JUEGO Y LO DEJA EN PANTALLA AZUL ========
            //=================================================================================
            x: this.king.position.x - this.king.size.x / 2,
            y: this.king.position.y - this.king.size.y / 2,
            width: this.king.size.x,
            height: this.king.size.y,
        };
        this.youButton = {
            x: canvasWidth / 2 - 50,
            y: 500,
            width: 100,
            height: 50
        };
        this.twoPentaclesLeft = {
            x: canvasWidth / 2 - 180,
            y: canvasHeight / 2 - 100,
            width: 120,
            height: 200
        };
        
        this.twoPentaclesRight = {
            x: canvasWidth / 2 + 60,
            y: canvasHeight / 2 - 100,
            width: 120,
            height: 200
        };

        this.centerImage = new AnimatedObject(

            // POSITION
            new Vector(canvasWidth / 2, canvasHeight / 2),

            // SIZE
            120,
            200,

            "gray",
            "image",
            1
        );

        this.centerImage.setSprite(
            "../assets/images/backside_card.png",
            new Rect(0, 0, 550, 800)
        );
        // FINAL IMAGE
        this.finalImage = new AnimatedObject(

        new Vector(canvasWidth / 2, canvasHeight / 2),

        120,
        200,

        "gray",
        "image",
        1
        );

        this.finalImage.setSprite(
        "../assets/images/Sun and Moon.png",
        new Rect(50, 20, 220, 410)
        );
        //sun IMAGE//
        this.sunImage = new AnimatedObject(

            new Vector(canvasWidth / 2, canvasHeight / 2),

            120,
            200,

            "gray",
            "image",
            1
        );

        this.sunImage.setSprite(
            "../assets/images/Sun and Moon.png",
            new Rect(270, 20, 220, 410)
        );

        this.showFinalImage = false;
        this.showCenterImage = false;
        this.showCards = false;
        this.showIntroText = false;

        // OPTIONAL ACTORS ARRAY
        this.actors = [];
    }

    // =========================
    // BUILD ALL CARD DEFS
    // =========================

    buildAllCards() {
        return [
            {
                name: "The Magician",
                sprite: { src: "../assets/images/Common Cards.png", rect: new Rect(15, 20, 210, 400) },
                infoText: "Repeating the last card played...",
                description: "Repeats the effect of your last played card",
                action: () => {
                    if (this.lastPlayedAction) {
                        this.lastPlayedAction();
                    }
                }
            },
            {
                name: "The Chariot",
                sprite: { src: "../assets/images/Common Cards.png", rect: new Rect(230, 20, 210, 400) },
                infoText: "Throwing away the top card of the Great Deck...",
                description: "Throws away the top card of the Great Deck",
                action: () => {
                    if (this.greatDeck.length === 0) return;
                    this.discardCardType = this.greatDeck.shift();
                    this.discardX = canvasWidth / 2;
                    this.discardY = canvasHeight / 2;
                    this.isDiscardSliding = true;
                }
            },
            {
                name: "Page of Pentacles",
                sprite: { src: "../assets/images/Common Cards.png", rect: new Rect(661, 20, 210, 400) },
                infoText: "Win this round for a 50 coin bonus!",
                description: "Gives you a 50 coin bonus if you win",
                action: () => { this.pageOfPentaclesActive = true; }
            },
            {
                name: "The Star",
                sprite: { src: "../assets/images/Common Cards.png", rect: new Rect(440, 20, 210, 400) },
                infoText: "You will be revived if you reach 0 lives!",
                description: "If your lives reach 0, you will be revived with one life remaining",
                action: () => { this.starActive = true; }
            },
            {
                name: "Strength",
                sprite: { src: "../assets/images/Common Cards.png", rect: new Rect(872, 20, 210, 400) },
                infoText: "You cannot die next round!",
                description: "Prevents you from dying next round",
                action: () => { this.strengthActive = true; }
            },
            {
                name: "Two of Pentacles",
                sprite: { src: "../assets/images/Common Cards.png", rect: new Rect(1087, 20, 210, 400) },
                infoText: "Drawing two cards - choose one to keep...",
                description: "Draws two cards, choose one to apply to yourself",
                action: () => {
                    this.activateTwoPentacles();
                }
            },
            {
                name: "The High Priestess",
                sprite: { src: "../assets/images/Rare Cards.png", rect: new Rect(20, 10, 210, 400) },
                infoText: "See the next card from the Great Deck",
                description: "Shows you the next card in the Great Deck",
                action: () => {
                    if (this.greatDeck.length > 0) {
                        this.peekedCard = this.greatDeck[0];
                        this.showPeekCard = true;
                    }
                    setTimeout(() => { 
                        this.showPeekCard = false;
                        this.finalImage.position.x = canvasWidth / 2;
                        this.finalImage.position.y = canvasHeight / 2;

                        this.sunImage.position.x = canvasWidth / 2;
                        this.sunImage.position.y = canvasHeight / 2;
                    }, 2000);
                }
            },
            {
                name: "The Hermit",
                sprite: { src: "../assets/images/Rare Cards.png", rect: new Rect(235, 10, 210, 400) },
                infoText: "Your next draw phase will be skipped!",
                description: "Makes you skip next draw phase",
                action: () => { this.hermitActive = true; }
            },
            {
                name: "Justice",
                sprite: { src: "../assets/images/Rare Cards.png", rect: new Rect(448, 10, 210, 400) },
                infoText: "If you lose a life next turn, so does the enemy!",
                description: "Makes your enemy lose a life if you lose a life on this or next turn",
                action: () => { this.justiceActive = true; }
            },
            {
                name: "Wheel of Fortune",
                sprite: { src: "../assets/images/Rare Cards.png", rect: new Rect(660, 10, 210, 400) },
                infoText: "Shuffling the Great Deck...",
                description: "Shuffles the Great Deck",
                action: () => { this.greatDeck.sort(() => Math.random() - 0.5); }
            },
            {
                name: "King of Pentacles",
                sprite: { src: "../assets/images/Rare Cards.png", rect: new Rect(875, 10, 210, 400) },
                infoText: "Win for double coins, but lose for double coin loss!",
                description: "Doubles your gained coins if you win, but also doubles your lost coins if you lose",
                action: () => { this.kingOfPentaclesActive = true; }
            },
            {
                name: "The Lovers",
                sprite: { src: "../assets/images/Legendary Cards.png", rect: new Rect(20, 10, 210, 400) },
                infoText: "Removing one Moon from the Great Deck...",
                description: "Removes one Moon card from the Great Deck",
                action: () => {
                    const idx = this.greatDeck.indexOf("moon");
                    if (idx !== -1) this.greatDeck.splice(idx, 1);
                }
            },
            {
                name: "The Hanged Man",
                sprite: { src: "../assets/images/Legendary Cards.png", rect: new Rect(659, 10, 210, 400) },
                infoText: "Enemy cannot use their Character Deck next turn!",
                description: "Blocks the enemy from using their Character Deck next turn",
                action: () => { this.enemyHandBlocked = true; }
            },
            {
                name: "The Tower",
                sprite: { src: "../assets/images/Legendary Cards.png", rect: new Rect(228, 10, 210, 400) },
                description: "Enemy's next turn will be blocked",
                infoText: "Enemy's next turn is blocked!",
                action: () => { this.enemyTurnBlocked = true; }
            },
            {
                name: "The Devil",
                sprite: { src: "../assets/images/Legendary Cards.png", rect: new Rect(444, 10, 213, 400) },
                description: "Gain 2 lives, but a new moon card will be added to the Great Deck",
                infoText: "Gained 2 lives! A Moon was added to the Great Deck.",
                action: () => {
                    this.playerLives += 2;
            
                    this.greatDeck.push("moon");
            
                    this.greatDeck.sort(() => Math.random() - 0.5);
            
                    this.updatePlayerCandles();
                }
            },
        ];
    }

    // =========================
    // CARD FACTORY
    // =========================

    buildCharacterCardEntry(cardDef) {
        const obj = new AnimatedObject(
            new Vector(canvasWidth / 2, canvasHeight - 108),
            100, 185, "gray", "card", 1
        );
        obj.setSprite(cardDef.sprite.src, cardDef.sprite.rect);
        return {
            object: obj,
            sprite: cardDef.sprite,
            name: cardDef.name,
            visible: true,
            showInfo: false,
            infoText: cardDef.infoText,
            description: cardDef.description,
            action: cardDef.action
        };
    }

    // chooseStartingCards(indices)
    // Pass an array of indices (0-2) to pick specific cards from allCards.
    // Change the numbers in initObjects() to get different cards each run.
    chooseStartingCards(indices) {
        const cards = indices.map(i => this.buildCharacterCardEntry(this.allCards[i]));
        this.repositionCardsArray(cards);
        return cards;
    }

    chooseEnemyCards(indices) {

        const cards = indices.map(i =>
            this.buildCharacterCardEntry(this.allCards[i])
        );

        return cards;
    }

    activateTwoPentacles() {

        if (this.greatDeck.length < 2) {
            return;
        }
    
        this.twoPentaclesCards = [
            this.greatDeck.shift(),
            this.greatDeck.shift()
        ];
    
        this.showTwoPentaclesChoice = true;
        this.showCards = false;
    }
    
    resolveTwoPentacles(chosenIndex) {
    
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
    
            if (this.strengthActive) {
    
                this.strengthActive = false;
    
            } else {
    
                this.playerLives--;
    
                if (this.justiceActive) {
    
                    this.enemyLives--;
    
                    this.justiceActive = false;
    
                    this.updateEnemyCandles();
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
    
                if (this.starActive) {
    
                    this.playerLives = 1;
    
                    this.starActive = false;
    
                    this.updatePlayerCandles();
    
                    this.showCards = true;
    
                    this.currentTurn = "player";
    
                    return;
                }
    
                this.gameOver = true;
    
                this.showCards = false;
    
                return;
            }
    
            if (this.currentTurn === "enemy") {
    
                this.enemyTurn();
    
            } else {
    
                this.showCards = true;
            }
    
        }, 3000);
    }

    updatePlayerCandles() {
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
    }
    updateEnemyCandles() {

        if (this.enemyLives >= 3) {
            this.enemy_candles.setSprite(
                "../assets/images/Candles.png",
                new Rect(0, 0, 380, 500)
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
            this.isEnemyShowing = false;
            this.isShowingDefeatedEnemy = true;
        }
    }
    enemyTurn() {

        if (this.gameOver) {
            return;
        }

        if (this.greatDeck.length <= 0) {
            return;
        }

        if (this.enemyTurnBlocked) {
            this.enemyTurnBlocked = false;
            this.showCards = true;
            this.currentTurn = "player";
            return;
        }

        this.showCards = false;
        this.currentTurn = "enemy";

        // ENEMY CHARACTER CARD
        if (
            !this.enemyHandBlocked &&
            this.enemyCharacterCards.length > 0
        ) {

            const randomIndex = Math.floor(
                Math.random() *
                this.enemyCharacterCards.length
            );

            const enemyCard =
                this.enemyCharacterCards[randomIndex];

            // MOVE CARD TO CENTER
            enemyCard.object.position.x =
                canvasWidth / 2;

            enemyCard.object.position.y =
                canvasHeight / 2;

            // SHOW CARD TEXT
            enemyCard.showInfo = true;

            // SHOW CARD
            this.showCards = true;

            // APPLY EFFECT
            setTimeout(() => {

                enemyCard.action();

                // REMOVE CARD FROM ENEMY DECK
                this.enemyCharacterCards.splice(
                    randomIndex,
                    1
                );
                this.repositionEnemyCards();

            }, 2000);

            // HIDE CARD
            setTimeout(() => {

                enemyCard.showInfo = false;

                this.showCards = false;

            }, 4000);
        }

        if (this.enemyHandBlocked) {

            this.enemyHandBlocked = false;
        }

        // SHOW BACKSIDE CARD FIRST
        setTimeout(() => {
        this.showCenterImage = true;
        }, 2000);

        // WAIT 2 SECONDS BEFORE FLIPPING
        setTimeout(() => {

            this.showCenterImage = false;

            // DRAW TOP CARD
            this.currentGreatCard = this.greatDeck.shift();

            this.showFinalImage = true;
            setTimeout(() => {
            this.slideDirection = "down";
            this.isCardSliding = true;
            },500);
            // DAMAGE PLAYER
            if (this.currentGreatCard === "moon") {
                this.playerLives--;
                if (this.justiceActive) {

                    this.enemyLives--;
                    if (this.enemyLives <= 0) {
                        this.gameOver = true;
                    }
            
                    this.justiceActive = false;
            
                    this.updateEnemyCandles();
                }
            }

            // GAME OVER CHECK
            if (this.playerLives <= 0) {
                this.gameOver = true;
            }
            // HIDE RESULT AFTER 3 SECONDS
            setTimeout(() => {

                this.showFinalImage = false;
                this.justiceActive = false;
                if (!this.gameOver) {
                    this.showCards = true;
                    this.currentTurn = "player";
                }

            }, 3000);

        }, 3000);
    }
    createEventListeners() {

        window.addEventListener("click", (event) => {

            const rect = ctx.canvas.getBoundingClientRect();

            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            this.checkStartButton(mouseX, mouseY);

            for (let c of this.characterCards) {
                this.checkCardClick(c, mouseX, mouseY);
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
    }
    // =========================
    // CHECK IF CARD WAS CLICKED
    // =========================
    checkCardHover(mouseX, mouseY) {

        this.hoveredCard = null;
    
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
    }
    checkCardClick(cardEntry, mouseX, mouseY) {
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

            cardEntry.showInfo = true;
            cardEntry.action();
            if (cardEntry.name !== "The Magician") {

                this.lastPlayedAction = cardEntry.action;
                this.lastPlayedName = cardEntry.name;
            }

            setTimeout(() => {
                cardEntry.visible = false;
                cardEntry.showInfo = false;
                this.repositionCards();
            }, 2000);
        }
    }

    checkStartButton(mouseX, mouseY) {
        if (!this.gameOver){
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
                this.showCards = true;

            }, 5000);
        }
    }

    checkMainDeckClick(mouseX, mouseY) {
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
        if (!this.showCards) {
            return;
        }
        if (
            mouseX >= this.maindeck.x &&
            mouseX <= this.maindeck.x + this.maindeck.width &&
            mouseY >= this.maindeck.y &&
            mouseY <= this.maindeck.y + this.maindeck.height
        ) {
            // HERMIT SKIP CHECK
            if (this.hermitActive) {
                this.hermitActive = false;
                this.currentTurn = "enemy";
                this.showCards = false;
                setTimeout(() => { this.enemyTurn(); }, 1000);
                return;
            }
            // SHOW IMAGE
            this.showCenterImage = true;
            this.cardSound.play();
            this.showCards = false;
        }
    }
    checkTwoPentaclesClick(mouseX, mouseY) {

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
    }
    checkChoiceButtons(mouseX, mouseY) {
        if (this.currentTurn !== "player") {
            return;
        }
        // ONLY WORK IF CENTER IMAGE IS SHOWING
        if (!this.showCenterImage) {
            return;
        }
        //youButton
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
                if (this.strengthActive) {
                    this.strengthActive = false;
                } else {
                    this.playerLives--;
                    if (this.justiceActive) {
                        this.enemyLives--;
                        this.justiceActive = false;
                        if (!this.isCardSliding){
                        this.updateEnemyCandles();
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
                this.showCards = true;

                // GAME OVER CHECK
                if (this.playerLives <= 0) {
                    if (this.starActive) {
                        this.playerLives = 1;
                        this.starActive = false;
                        this.updatePlayerCandles();
                        this.showCards = true;
                        this.currentTurn = "player";
                        return;
                    }
                    this.gameOver = true;
                    this.showCards = false;
                    this.showFinalImage = false;
                    this.showCenterImage = false;

                    return;
                }
                if (this.currentTurn === "enemy") {
                    this.enemyTurn();
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
            this.enemyLives--;
        }

        // PLAYER TURN ALWAYS ENDS
        this.currentTurn = "enemy";

        setTimeout(() => {
        this.showFinalImage = false;

        // CHECK IF ENEMY LOST
        if (this.enemyLives <= 0) {

            this.gameOver = true;

            setTimeout(() => {
                this.showCards = false;
                this.showFinalImage = false;
                this.showCenterImage = false;

            }, 2000);

            return;
        }

        // ENEMY TURN STARTS
        this.enemyTurn();

        }, 3000);
        }
    }

    repositionCards() {
        const y = canvasHeight - 108;
        const spacing = 102;
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
    }

    repositionCardsArray(cards) {
        const y = canvasHeight - 108;
        const spacing = 102;
        const visible = cards.filter(c => c.visible).map(c => c.object);
        const n = visible.length;
        if (n === 0) return;
        const startX = canvasWidth / 2 - ((n - 1) * spacing) / 2;
        for (let i = 0; i < n; i++) {
            visible[i].position.x = startX + i * spacing;
            visible[i].position.y = y;
        }
    }

    repositionEnemyCards() {

        const y = 95;

        const spacing = 102;

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
            canvasWidth / 2 - ((n - 1) * spacing) / 2;

        for (let i = 0; i < n; i++) {

            visible[i].position.x =
                startX + i * spacing;

            visible[i].position.y = y;
        }
    }

    draw(ctx) {

        // DRAW BACKGROUND
        this.background.draw(ctx);
        if (this.isEnemyShowing) {
            this.king.draw(ctx);
        }
        
        if (this.isShowingDefeatedEnemy) {
            this.defeatedKing.draw(ctx);
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
                
                if (this.showCards && c.visible) {
            
                    ctx.fillStyle = "white";
                    ctx.font = "20px MedievalSharp";
                    ctx.textAlign = "center";
            
                    ctx.fillText(
                    this.hoveredCard.description,
                    canvasWidth / 2,
                    canvasHeight / 2 + 25
            );
                }
                if (c !== this.hoveredCard && c.isHovered) {
                    c.object.position.y += 25;
                    c.isHovered = false;
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
        for (let c of this.enemyCharacterCards) {
            if (c.showInfo) {
                ctx.fillStyle = "white";
                ctx.font = "40px MedievalSharp";
                ctx.textAlign = "center";
                ctx.fillText(c.infoText, canvasWidth / 2, 100);
            }
        }
        if (this.showIntroText) {

            ctx.fillStyle = "white";
            ctx.font = "50px MedievalSharp";
            ctx.textAlign = "center";

            ctx.fillText(
                this.sunCount + " Sun, " + this.moonCount + " Moon",
                canvasWidth / 2,
                490
            );
            ctx.fillText(
                "Good Luck",
                canvasWidth / 2,
                540
            );
        }
        if (!this.showStartButton && !this.showIntroText) {

            ctx.fillStyle = "white";
            ctx.font = "30px MedievalSharp";
            ctx.textAlign = "center";

            // TOP TEXT
            this.enemy_candles.draw(ctx)

            // BOTTOM TEXT
            this.player_candles.draw(ctx)
            if (this.playerLives > 3) {
                this.extra_player_candles.draw(ctx);
            }

            // COIN DISPLAY
            ctx.fillStyle = "gold";
            ctx.font = "24px MedievalSharp";
            ctx.textAlign = "left";
            ctx.fillText("Coins: " + this.coins, 20, 30);

            ctx.textAlign = "center";
        }
        if (this.showStartButton) {
            this.drawCustomHitbox(ctx, this.startButton);
        }
        if (this.sunMessage) {

            ctx.fillStyle = "white";
            ctx.font = "40px MedievalSharp";
            ctx.textAlign = "center";
            ctx.fillText(
                "Lucky guess.",
                canvasWidth / 2,
                100
            );
            ctx.fillText(
                "You get another turn",
                canvasWidth / 2,
                140
            );
        }

        // DRAW ACTORS
        for (let actor of this.actors) {
            actor.draw(ctx);
        }

        if (this.showCards) {
            // PLAYER CARDS
            for (let c of this.characterCards) {

                if (c.visible) {
                    c.object.draw(ctx);
                }
            }
            //ENEMY CARDS
            if (
                !this.showStartButton &&
                !this.showIntroText
            ) {

                for (let c of this.enemyCharacterCards) {

                    if (c.visible !== false) {

                        c.object.draw(ctx);
                    }
                }
            }
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
        
            const leftCx =
                this.twoPentaclesLeft.x +
                this.twoPentaclesLeft.width / 2;
        
            const leftCy =
                this.twoPentaclesLeft.y +
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


        // DRAW HITBOXES
        //this.drawHitbox(ctx, this.card);
        //this.drawHitbox(ctx, this.card2);
        //this.drawHitbox(ctx, this.card3);
        if (this.showCenterImage) {
            this.centerImage.draw(ctx);
        }
        // DRAW BUTTONS ONLY WHEN CENTER IMAGE EXISTS
        if (this.showCenterImage && this.currentTurn === "player") {

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
            if (this.gameOver) {
                this.startSound.pause();
                if (this.playerLives <= 0){
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
    }
    drawCustomHitbox(ctx, hitbox) {
        if (hitbox === this.startButton) {

            ctx.fillStyle = "gray";

            ctx.fillRect(
                hitbox.x,
                hitbox.y,
                hitbox.width,
                hitbox.height
            );
            ctx.fillStyle = "white";
            ctx.font = "30px MedievalSharp";
            ctx.textAlign = "center";

            ctx.fillText(
            "START",
            hitbox.x + hitbox.width / 2,
            hitbox.y + hitbox.height / 2 + 10
            );
        }
        if (hitbox === this.youButton) {

            ctx.fillStyle = "white";
            ctx.font = "25px MedievalSharp";
            ctx.textAlign = "center";
        
            ctx.fillText(
                "Fool",
                hitbox.x + hitbox.width / 2,
                hitbox.y + hitbox.height / 2 + 8
            );
        }

        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;

        ctx.strokeRect(
            hitbox.x,
            hitbox.y,
            hitbox.width,
            hitbox.height
        );
    }


    update(deltaTime) {
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

                        this.sunImage.position.y = this.downtargetY;
                        this.updatePlayerCandles();
                        this.isCardSliding = false;

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

        // UPDATE ACTORS
        for (let actor of this.actors) {
            actor.updateFrame(deltaTime);
        }
    }
    drawHitbox(ctx, card) {

        const left = card.position.x - card.size.x / 2;
        const top = card.position.y - card.size.y / 2;

        ctx.strokeStyle = "red";
        ctx.lineWidth = 3;

        ctx.strokeRect(
            left,
            top,
            card.size.x,
            card.size.y
        );
    }
}

function main() {

    const canvas = document.getElementById('canvas');

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx = canvas.getContext('2d');

    game = new Game();

    drawScene(0);
}


function drawScene(newTime) {

    if (oldTime == undefined) {
        oldTime = newTime;
    }

    let deltaTime = newTime - oldTime;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    game.update(deltaTime);
    game.draw(ctx);

    oldTime = newTime;

    requestAnimationFrame(drawScene);
}