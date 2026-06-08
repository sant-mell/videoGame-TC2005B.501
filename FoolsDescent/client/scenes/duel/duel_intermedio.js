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

        //CHOOSE ENEMY HERE!!
        //this.chooseEnemy = 2; //<--- CHOOSE ENEMY (1 = Jester, 2 = Knight)
        
        // Automatically chooses the enemy (1 or 2)
        this.chooseEnemy = Math.floor(Math.random() * 2) + 1;
        this.enemyName = this.chooseEnemy === 1 ? "Crazy Jester" : "Bounded Knight";

        //enemy card
        this.activeEnemyCard = null;
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
        this.statsSent = false;
        this.enemyTier = "rare";
        this.showStartButton = true;
        this.sunMessage = false;
        this.isEnemyShowing = true;
        this.isShowingDefeatedEnemy = false;
        this.strengthMessage = false;
        this.turnBlockedMessage = false;
        this.justiceMessageUntil = 0;
        this.playerHandBlocked = false;
        this.playerHandBlockedMessage = false;
        this.maxLivesMessage = false;
        this.candleBurnPlayed = false;
        this.enemyCharacterTurnCounter = 0;
        this.playerTurnMessage = false;
        this.usesPendingMagicianRepeat = true;
        // card effect states
        this.coins = 0;
        this.pageOfPentaclesActive = false;
        this.kingOfPentaclesActive = false;
        this.playerStarActive = false;
        this.enemyStarActive = false;
        this.starMessage = false;
        this.playerStrengthActive = false;
        this.enemyStrengthActive = false;
        this.playerJusticeActive = false;
        this.enemyJusticeActive = false;
        this.lastPlayedAction = null;
        this.lastPlayedName = "";
        this.showTwoPentaclesChoice = false;
        this.twoPentaclesCards = [];
        this.enemyTurnBlocked = false;
        this.playerTurnBlocked = false;
        this.enemyHandBlocked = false;
        // discard animation
        this.isDiscardSliding = false;
        this.discardCardType = "";
        this.discardX = canvasWidth / 2;
        this.discardY = canvasHeight / 2;
        this.isRewardCardSliding = false;
        this.rewardCard = null;
        this.rewardCardTargetX = 0;
        this.rewardCardTargetY = 0;
        this.pendingRewardCard = false;
        this.playerInputLocked = false;
        this.isCenterCardAnimating = false;
        this.centerCardAnimationTime = 0;
        this.centerCardAnimationDuration = 400;
        this.centerCardStartX = 0;
        this.centerCardStartY = 0;
        this.centerCardStartW = 0;
        this.centerCardStartH = 0;
        this.centerCardTargetX = 0;
        this.centerCardTargetY = 0;
        this.centerCardTargetW = 0;
        this.centerCardTargetH = 0;
        //audio
        this.startSound = new Audio("../../../assets/audio/midEnemies.mp3");
        this.startSound.volume = 0.2;
        this.candleburn = new Audio("../../../assets/audio/candle_burning.mov");
        this.candleburn.volume = 0.8;
        this.candleblow = new Audio("../../../assets/audio/candle_blow.mov");
        this.candleblow.volume = 0.8;
        this.lastLifeSound = new Audio("../../../assets/audio/last_life.mp3");
        this.lastLifeSound.volume = 0.1;
        this.lastLifeSoundPlayed = false;
        this.cardSound = new Audio("../../../assets/audio/card.mpeg");
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
            "../../../assets/images/intermedio_background.png",
            new Rect(0, 0, 1690, 928)
        );
        this.enemyImage = new AnimatedObject(
            new Vector(canvasWidth / 2, 142),
            490,
            290,
            "gray",
            "enemy",
            45
        );
        switch(this.chooseEnemy){
            case 1:
                this.enemyImage.setSprite(
                    "../../../assets/images/Jester_final.png",
                    new Rect(0, 0, 850, 610)
                );
                break;
            case 2:
                this.enemyImage.setSprite(
                    "../../../assets/images/Knight_final.png",
                    new Rect(10, 10, 825, 610)
                );
                break;
        }

        this.defeatedEnemyImage = new AnimatedObject(
            new Vector(canvasWidth / 2, 162),
            600,
            270,
            "gray",
            "enemy",
            45
        );

        switch(this.chooseEnemy){
            case 1:
                this.defeatedEnemyImage.setSprite(
                "../../../assets/images/defeated_jester.png",
                new Rect(0, 0, 380, 174));
                break;
            case 2:
                this.defeatedEnemyImage.setSprite(
                "../../../assets/images/Defeated_knight.png",
                new Rect(0, 0, 380, 174));
                break;
        }
        this.extra_player_candles = new AnimatedObject(

            new Vector(canvasWidth - 390 , 420),

            90,
            200,

            "gray",
            "card",
            1
        );

        this.extra_player_candles.setSprite(
            "../../../assets/images/Candles.png",
            new Rect(0, 0, 380, 500)
        );
        this.extra_enemy_candles = new AnimatedObject(

            new Vector(canvasWidth / 2 - 208 , 217),

            90,
            200,

            "gray",
            "card",
            1
        );
        this.extra_enemy_candles.setSprite(
            "../../../assets/images/Candles.png",
            new Rect(0, 0, 380, 500)
        );
        this.player_candles = new AnimatedObject(
            new Vector(canvasWidth - 290 , 420),
            90,
            200,

            "gray",
            "card",
            1
        );
        this.player_candles.setSprite(
            "../../../assets/images/Candles.png",
            new Rect(50, 70, 280, 570)
        );
        this.enemy_candles = new AnimatedObject(
            new Vector(canvasWidth / 2 - 282 , 217),
            90,
            200,

            "gray",
            "card",
            1
        );
        this.enemy_candles.setSprite(
            "../../../assets/images/Candles.png",
            new Rect(50, 70, 280, 570)
        );

        this.currentGreatCard = "";
        this.buildGreatDeck();

        // All card definitions in the pool
        this.allCards = this.buildAllCards();

        //this.personalPlayerCardIndices = [11, 8];
        // Choose the player card pool; 2 random cards are dealt from it.
        //this.characterCards = this.chooseStartingCards([6, 7, 8, 9, 10]);

        // Gives two random cards at the start of the duel, they get added to the players deck
        let cards = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Common and rare

        // Random order
        cards.sort(() => Math.random() - 0.5);

        // Choose one
        this.characterCards = this.chooseStartingCards(cards.slice(0, 10));

        // Enemy character cards
        this.enemyCharacterCards = this.chooseEnemyCards([
            7,
            8,
            12,
            9,
            1,
            4
        ]);

        this.maindeck = {
            x: 273,
            y: 350,
            width: 95,
            height: 95
        };
        this.enemyButton = {
            x: this.enemyImage.position.x - this.enemyImage.size.x / 2,
            y: this.enemyImage.position.y - this.enemyImage.size.y / 2,
            width: this.enemyImage.size.x,
            height: this.enemyImage.size.y,
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
            new Vector(canvasWidth / 2, canvasHeight / 2),
            120,
            200,

            "gray",
            "image",
            1
        );

        this.centerImage.setSprite(
            "../../../assets/images/backside_card.png",
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
        "../../../assets/images/Sun and Moon.png",
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
            "../../../assets/images/Sun and Moon.png",
            new Rect(270, 20, 220, 410)
        );

        this.showFinalImage = false;
        this.showCenterImage = false;
        this.showPlayerCards = false;
        this.showEnemyCards = false;
        this.showIntroText = false;

        // OPTIONAL ACTORS ARRAY
        this.actors = [];
    }
}

async function main() {

    const canvas = document.getElementById('canvas');

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx = canvas.getContext('2d');

    game = new Game();

    await loadPlayerDeck(game);
    await loadDuelCheckpoint(game);

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
