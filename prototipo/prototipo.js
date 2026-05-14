"use strict";
let hola=0;
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
        this.gameOver = false;
        this.startSound = new Audio("../assets/audio/easyEnemies.mpeg");
        this.startSound.volume = 0.2;
        this.hurtSound = new Audio ("../assets/audio/fahhh_KcgAXfs.mp3");
        this.hurtSound.volume = 1;
        this.showStartButton = true;

        this.startButton = {
        x: canvasWidth / 2 - 75,
        y: canvasHeight / 2 - 40,
        width: 150,
        height: 80
        };

        this.discardedCard = "";
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
            "../assets/images/FinalDuelTable.png",
            new Rect(0, 0, 1920, 1051)
        );

        this.greatDeck = [
            "sun",
            "sun",
            "moon",
            "moon",
            "moon",
            "moon",
            "moon",
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
        // =========================
        // CARD 1
        // =========================

        this.card = new AnimatedObject(

            // POSITION
            new Vector(canvasWidth / 2 + 8, canvasHeight - 108),

            // SIZE
            100,
            185, 

            "gray",
            "card",
            1
        );

        this.card.setSprite(
            "../assets/images/chariot_card.png",
            new Rect(0, 0, 560, 1100)
        );



        // =========================
        // CARD 2
        // =========================

        this.card2 = new AnimatedObject(

            // POSITION
            new Vector(canvasWidth / 2 + 110, canvasHeight - 108),

            // SIZE
            100,
            185,

            "gray",
            "card",
            1
        );

        this.card2.setSprite(
            "../assets/images/high_priestess_card.png",
            new Rect(0, 0, 380, 730)
        );

        // CARD 3

        this.card3 = new AnimatedObject(

            // POSITION
            new Vector(canvasWidth / 2 - 94, canvasHeight - 108),

            // SIZE
            100,
            185,

            "gray",
            "card",
            1
        );

        this.card3.setSprite(
            "../assets/images/wheel_of_fortune_card.png",
            new Rect(0, 0, 310, 590)
        );

        this.maindeck = {
            x: 280,
            y: 270,
            width: 80,
            height: 120
        };
        // You
        this.enemyButton = {
            x: canvasWidth / 2 - 50,
            y: 100,
            width: 100,
            height: 50
        };

        // Enemy
        this.youButton = {
            x: canvasWidth / 2 - 50,
            y: 500,
            width: 100,
            height: 50
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
        "../assets/images/moon_card.png",
        new Rect(0, 0, 430, 850)
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
            "../assets/images/sun_card.png",
            new Rect(0, 0, 430, 850)
        );

        this.showFinalImage = false;
        this.showCenterImage = false;
        this.showCards = false;
        this.showIntroText = false;
        this.cardVisible = true;
        this.card2Visible = true;
        this.card3Visible = true;
        this.showcard1info = false;
        this.showcard2info = false;
        this.showcard3info = false;

        

        // OPTIONAL ACTORS ARRAY
        this.actors = [];
    }
    enemyTurn() {

        if (this.gameOver) {
            return;
        }
    
        if (this.greatDeck.length <= 0) {
            return;
        }
        this.currentTurn = "enemy";

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
            // DAMAGE PLAYER
            if (this.currentGreatCard === "moon") {
                this.hurtSound.play();
                this.playerLives--;
            }
            // GAME OVER CHECK
            if (this.playerLives <= 0) {
                this.gameOver = true;
            }
            // HIDE RESULT AFTER 3 SECONDS
            setTimeout(() => {
    
                this.showFinalImage = false;
    
                if (!this.gameOver) {
                    this.showCards = true;
                    this.currentTurn = "player";
                }
    
            }, 4000);
    
        }, 4000);
    }
    createEventListeners() {

        window.addEventListener("click", (event) => {

            const rect = ctx.canvas.getBoundingClientRect();

            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            this.checkStartButton(mouseX, mouseY);

            this.checkCardClick(this.card, mouseX, mouseY);
            this.checkCardClick(this.card2, mouseX, mouseY);
            this.checkCardClick(this.card3, mouseX, mouseY);
            this.checkMainDeckClick(mouseX, mouseY);
            this.checkChoiceButtons(mouseX, mouseY);
            
        });
    }
    // =========================
    // CHECK IF CARD WAS CLICKED
    // =========================

    checkCardClick(card, mouseX, mouseY) {
        if (this.showStartButton) {
            return;
        }
        if (this.showCenterImage) {
            return;
        }
        if (card === this.card && !this.cardVisible) {
            return;
        }
        
        if (card === this.card2 && !this.card2Visible) {
            return;
        }
        
        if (card === this.card3 && !this.card3Visible) {
            return;
        }
        const left = card.position.x - card.size.x / 2;
        const right = card.position.x + card.size.x / 2;

        const top = card.position.y - card.size.y / 2;
        const bottom = card.position.y + card.size.y / 2;

        if (
            mouseX >= left &&
            mouseX <= right &&
            mouseY >= top &&
            mouseY <= bottom
        ) {

            // MOVE CARD TO CENTER
            card.position.x = canvasWidth / 2 + 8;
            card.position.y = canvasHeight / 2;
            if (card === this.card) {
                this.showcard1info = true;
                this.discardedCard = this.greatDeck.shift();
            }
            if (card === this.card2) {
                this.showcard2info = true;

                if (this.greatDeck.length > 0) {
                    this.peekedCard = this.greatDeck[0];
                    this.showPeekCard = true;
                }
                setTimeout(() => {
                    this.showPeekCard = false;
                }, 2000);
            }
            if (card === this.card3) {
                this.showcard3info = true;
                this.greatDeck.sort(() => Math.random() - 0.5);
            }
            setTimeout(() => {
                if (card === this.card) {
                    this.cardVisible = false;
                    this.showcard1info = false;
                }
                if (card === this.card2) {
                    this.card2Visible = false;
                    this.showcard2info = false;
                }
                if (card === this.card3) {
                    this.card3Visible = false;
                    this.showcard3info = false;
                }
            
            }, 2000);
        }
        console.log(left, right, top, bottom);
        console.log(mouseX, mouseY);
    }

    checkStartButton(mouseX, mouseY) {
        this.startSound.play();
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
        if (
            this.showcard1info ||
            this.showcard2info ||
            this.showcard3info
        ) {
            return;
        }
        if (this.showFinalImage) {
            return;
        }

        if (
            mouseX >= this.maindeck.x &&
            mouseX <= this.maindeck.x + this.maindeck.width &&
            mouseY >= this.maindeck.y &&
            mouseY <= this.maindeck.y + this.maindeck.height
        ) {
    
            // SHOW IMAGE
            this.showCenterImage = true;
            this.showCards = false;
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

        // IF MOON -> PLAYER TAKES DAMAGE
        if (this.currentGreatCard === "moon") {
            this.hurtSound.play();
            this.playerLives--;

        // PLAYER TURN ENDS
        this.currentTurn = "enemy";
        }

        // IF SUN -> PLAYER GETS ANOTHER TURN
        if (this.currentGreatCard === "sun") {
            this.currentTurn = "player";
        }

        setTimeout(() => {

        this.showFinalImage = false;

        // GAME OVER CHECK
        if (this.playerLives <= 0) {
            this.gameOver = true;
            return;
        }

        // ONLY START ENEMY TURN
        // IF TURN CHANGED
        if (this.currentTurn === "enemy") {
            this.enemyTurn();
        }

        }, 3000);
        }
        // EnemyButton
        // ENEMY BUTTON
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

    // =========================
    // DRAW EVERYTHING
    // =========================

    draw(ctx) {

        // DRAW BACKGROUND
        this.background.draw(ctx);
        if (this.showcard1info) {

            ctx.fillStyle = "white";
            ctx.font = "40px MedievalSharp";
            ctx.textAlign = "center";
        
            ctx.fillText(
                "Throwing away the top card of the Great Deck...",
                canvasWidth / 2,
                100
            );
        }
        if (this.showIntroText) {

            ctx.fillStyle = "white";
            ctx.font = "50px MedievalSharp";
            ctx.textAlign = "center";
        
            ctx.fillText(
                this.sunCount + " Sun, " + this.moonCount + " Moon",
                canvasWidth / 2,
                100
            );
            ctx.fillText(
                "Good Luck",
                canvasWidth / 2,
                150
            );
        }
        if (!this.showStartButton && !this.showIntroText) {

            ctx.fillStyle = "white";
            ctx.font = "30px MedievalSharp";
            ctx.textAlign = "center";
        
            // TOP TEXT
            ctx.fillText(
                "ENEMY LIVES: " + this.enemyLives,
                canvasWidth / 2,
                140
            );
        
            // BOTTOM TEXT
            ctx.fillText(
                "YOUR LIVES: " + this.playerLives,
                canvasWidth / 2 + 350,
                530
            );
        }
        if (this.showcard2info) {

            ctx.fillStyle = "white";
            ctx.font = "40px MedievalSharp";
            ctx.textAlign = "center";
        
            ctx.fillText(
                "See the next card from the Great Deck",
                canvasWidth / 2,
                100
            );
        }
        if (this.showcard3info) {

            ctx.fillStyle = "white";
            ctx.font = "40px MedievalSharp";
            ctx.textAlign = "center";
        
            ctx.fillText(
                "Shuffling the Great Deck...",
                canvasWidth / 2,
                100
            );
        }
        if (this.showStartButton) {
            this.drawCustomHitbox(ctx, this.startButton);
        }

        // DRAW ACTORS
        for (let actor of this.actors) {
            actor.draw(ctx);
        }

        // DRAW CARDS
        if (this.showCards) {
            if (this.cardVisible) {
                this.card.draw(ctx);
            }
            
            if (this.card2Visible) {
                this.card2.draw(ctx);
            }
            
            if (this.card3Visible) {
                this.card3.draw(ctx);
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

        this.drawCustomHitbox(ctx, this.maindeck);

        // DRAW HITBOXES
        //this.drawHitbox(ctx, this.card);
        //this.drawHitbox(ctx, this.card2);
        //this.drawHitbox(ctx, this.card3);
        if (this.showCenterImage) {
            this.centerImage.draw(ctx);
        }
        // DRAW BUTTONS ONLY WHEN CENTER IMAGE EXISTS
        if (this.showCenterImage) {

        this.drawCustomHitbox(ctx, this.youButton);
        this.drawCustomHitbox(ctx, this.enemyButton);
        }
            if (this.showFinalImage) {

                if (this.showFinalImage) {

                    this.finalImage.position.x = canvasWidth / 2;
                    this.finalImage.position.y = canvasHeight / 2;
                
                    this.sunImage.position.x = canvasWidth / 2;
                    this.sunImage.position.y = canvasHeight / 2;
                
                    if (this.currentGreatCard === "moon") {
                        this.finalImage.draw(ctx);
                    }
                
                    if (this.currentGreatCard === "sun") {
                        this.sunImage.draw(ctx);
                    }
                }
            }
            if (this.gameOver) {
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

        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
    
        ctx.strokeRect(
            hitbox.x,
            hitbox.y,
            hitbox.width,
            hitbox.height
        );
    }



    // =========================
    // UPDATE
    // =========================

    update(deltaTime) {

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



// =========================
// MAIN
// =========================

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

