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
        this.chooseEnemy = 2; //<--- CHOOSE ENEMY (only Dealer here; this.chooseEnemy is unused)
        //^^^^^^ CHOOSE ENEMY ^^^^^^
        this.enemyName = "The Dealer";

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
        this.enemyTier = "boss";
        this.showStartButton = true;
        this.sunMessage = false;
        this.sunMessageOwner = "";
        this.isEnemyShowing = true;
        this.isShowingDefeatedEnemy = false;
        this.strengthMessage = false;
        this.noMoonCardsMessage = false;
        this.turnBlockedMessage = false;
        this.justiceMessageUntil = 0;
        this.playerHandBlocked = false;
        this.playerHandBlockedMessage = false;
        this.maxLivesMessage = false;
        this.candleBurnPlayed = false;
        this.enemyCanPlayCharacterCard = true;
        this.playerTurnMessage = false;
        this.usesPendingMagicianRepeat = true;
        this.hasDealerIntro = true;
        this.showDealerIntro = false;
        this.dealerIntroIndex = 0;
        this.dealerIntroLines = [
            "So, the unassigned soul finally reaches my table.",
            "Do you know what fate was before I changed it?",
            "A predictable wheel. A thousand obedient lives turning exactly as written.",
            "I held the Great Deck, and every soul received its card.",
            "No one asked. No one wondered. No one surprised me.",
            "So, I shuffled.",
            "I scattered futures across the mortal plane and watched the world remember fear.",
            "Hope became a wager. Death became a question.",
            "And for the first time, existence had suspense.",
            "But you, you were never dealt a future.",
            "No card bears your name. No thread knows where to pull you.",
            "Sit, Fool. Let us see whether you deserve a fate.",
            "Amuse me..."
        ];
        this.dealerIntroButton = {
            x: canvasWidth - 290,
            y: canvasHeight - 86,
            width: 160,
            height: 42
        };
        this.dealerSpeechSound = new Audio("../../../assets/audio/BossSpeech.mov");
        this.dealerSpeechSound.volume = 0.8;
        this.dealerSpeechSound.loop = true;
        // card effect states
        this.coins = 0;
        this.pageOfPentaclesActive = false;
        this.kingOfPentaclesActive = false;
        this.kingOfPentaclesOwner = "";
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
        this.startSound = new Audio("../../../assets/audio/Boss_Fight.mp3");
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
        //Counters
        this.enemyCharacterCardsUsed = 0;
        this.enemyExtraCardTurn = false;
        this.enemyTurnCounter = 0;
        
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
            "../../../assets/images/Dealer_Table.png",
            new Rect(0, 0, 1920, 1042)
        );
        this.enemyImage = new AnimatedObject(
            new Vector(canvasWidth / 2, 133),
            450,
            300,
            "gray",
            "enemy",
            45
        );
        this.enemyImage.setSprite(
            "../../../assets/images/Dealer_Final.png",
            new Rect(0, 0, 835, 584)
        );

        this.defeatedEnemyImage = new AnimatedObject(
            new Vector(canvasWidth / 2, 200),
            380,
            220,
            "gray",
            "enemy",
            45
        );
        this.defeatedEnemyImage.setSprite(
            "../../../assets/images/Defeated_Dealer.png",
            new Rect(0, 0, 380, 174));

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
        //this.personalPlayerCardIndices = [9, 6];
        // Choose the player card pool; 2 random cards are dealt from it.
        //this.characterCards = this.chooseStartingCards([11, 0, 14, 13, 12]);
        // Gives two random cards at the start of the duel, they get added to the players deck
        let cards = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]; // All cards

        // Random order
        cards.sort(() => Math.random() - 0.5);

        // Chooses two
        this.characterCards = this.chooseStartingCards(cards.slice(0, 2));

        this.enemyCharacterCards = this.chooseEnemyCards([
            11,
            12,
            8,
            7,
            0,
            3,
            14,
            15
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
    await loadPlayerUpgrades(game);
    await loadDuelCheckpoint(game);
    await applyExtraCards(game);
    await saveDuelCheckpoint(game);

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
