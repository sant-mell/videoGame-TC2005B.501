"use strict";

const canvasWidth = 1200;
const canvasHeight = 600;

let ctx;
let game;
let oldTime = 0;
let showBBox = false; // y for hitbox
// s is for sheet location, d is for drawing dimensions
const SMALL_CASTLE = { sx: 0, sy: 0, sw: 331, sh: 444, dw: 62, dh: 75 }; // Castle Nodes.png left sprite
const BIG_CASTLE = { sx: 331, sy: 0, sw: 516, sh: 444, dw: 100, dh: 86 }; // boss castle
const NODE_FRAMES = [
    { sx: 0, sy: 0, sw: 305, sh: 362, dw: 78, dh: 78 }, //diamond
    { sx: 305, sy: 0, sw: 327, sh: 362, dw: 78, dh: 78 }, //gear
    { sx: 632, sy: 0, sw: 314, sh: 362, dw: 78, dh: 78 }  //portal
];

const NODE_REST = 0;
const NODE_ENEMY = 1;
const NODE_UPGRADE = 2;
const NODE_BOSS = 3;
 //enemy difficulty definition
const ENEMY_COMMON = 0;
const ENEMY_RARE = 1;
const ENEMY_EPIC = 2;

function pickDifficulty(fight) {
    if (fight === 1) {
        return ENEMY_COMMON;
    } else if (fight === 2) {
        return ENEMY_RARE;
    } else {
        return ENEMY_EPIC;
    }
}

const FOOL_COLS = 3;
const FOOL_FRAME_W = 256; // 768 / 3
const FOOL_FRAME_H = 341.25; // 1365 / 4

// this is from spritesheets in TC2005B
const foolMotion = { //each direction of frames with status for playing it
    left: {
        status: false,
        repeat: true,
        duration: 150,
        moveFrames: [3, 5],
        idleFrames: [4, 4],
    },
    right: {
        status: false,
        repeat: true,
        duration: 150,
        moveFrames: [9, 11],
        idleFrames: [10, 10],
    },
};

// random numbers for the node sprites so it is different each time
function randomRange(max, min = 0) {
    return Math.floor(Math.random() * max) + min;
}


// fool sliding to nodes
class Fool {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.tx = x; // target x to move to
        this.ty = y; // target y to move to
        this.moving = false;
        this.arrived = false;
        this.speed = 240;
        this.direction = "down"; // where the fool faces it will be the direction it is moving
        this.motion = foolMotion;

        // same as TC2005 sprite.js
        this.frame = 0;
        this.minFrame = 0;
        this.maxFrame = 0;
        this.sheetCols = FOOL_COLS;
        this.repeat = true;
        this.frameDuration = 150;
        this.totalTime = 0;

        // from GameObject,
        this.spriteImage = undefined;
        this.spriteRect = undefined;
    }

    setSprite(imagePath, rect) {
        this.spriteImage = new Image();
        this.spriteImage.src = imagePath;
        if (rect) {
            this.spriteRect = rect;
        }
    }

    // same as AnimatedObject.setAnimation
    setAnimation(minFrame, maxFrame, repeat, duration) {
        this.minFrame = minFrame;
        this.maxFrame = maxFrame;
        this.frame = minFrame;
        this.repeat = repeat;
        this.totalTime = 0;
        this.frameDuration = duration;
    }

    // same as AnimatedObject.updateFrame
    updateFrame(deltaTime) {
        this.totalTime += deltaTime;
        if (this.totalTime > this.frameDuration) {
            let restartFrame = this.minFrame;
            this.frame = this.frame == this.maxFrame ? restartFrame : this.frame + 1;
            this.spriteRect.x = this.frame % this.sheetCols * this.spriteRect.width;
            this.spriteRect.y = Math.floor(this.frame / this.sheetCols) * this.spriteRect.height;
            this.totalTime = 0;
        }
    }

    // same as AnimatedPlayer.startMovement
    startMovement(direction) {
        const dirData = this.motion[direction];
        if (!dirData.status) {
            dirData.status = true;
            this.setAnimation(...dirData.moveFrames, dirData.repeat, dirData.duration);
        }
    }

    // same as AnimatedPlayer.stopMovement. After stopping, it will do animations 6, 7 for idle
    stopMovement(direction) {
        const dirData = this.motion[direction];
        dirData.status = false;
        this.setAnimation(6, 7, true, 150);
    }

    getDirection(dx, dy) {
        // map is horizontal so the fool only ever faces left or right
        if (dx < 0) {
            return "left";
        } else {
            return "right";
        }
    }

    // finds target node and walks there with the animmation
    setTarget(tx, ty) {
        this.tx = tx;
        this.ty = ty;
        this.direction = this.getDirection(tx - this.x, ty - this.y);
        this.moving = true;
        this.startMovement(this.direction);
    }

    update(deltaTime) {
        this.arrived = false;
        if (this.moving) {
            let dt = deltaTime / 1000;
            let dx = this.tx - this.x;
            let dy = this.ty - this.y;
            let d = Math.sqrt(dx * dx + dy * dy);
            // if it gets close it will stop when it arrives and do the stop movement for idle animation
            if (d < 2) { //d is distance in pixels
                this.x = this.tx;
                this.y = this.ty;
                this.moving = false;
                this.arrived = true;
                this.stopMovement(this.direction);
            } else {
                // constant speed diagonally like in class
                this.x += (dx / d) * this.speed * dt;
                this.y += (dy / d) * this.speed * dt;
            }
        }
        // always tick for idle animation to alter
        this.updateFrame(deltaTime);
    }

    draw(ctx) {
        ctx.drawImage(this.spriteImage,
                      this.spriteRect.x,
                      this.spriteRect.y,
                      this.spriteRect.width,
                      this.spriteRect.height,
                      this.x - 24,
                      this.y - 32,
                      48, 64);
        if (showBBox) this.drawBoundingBox(ctx);
    }

    // red bounding box toggled w y
    drawBoundingBox(ctx) {
        ctx.globalCompositeOperation = "screen";
        ctx.fillStyle = "rgb(0.5, 0.5, 0.5, 0.3)";
        ctx.fillRect(this.x - 24, this.y - 32, 48, 64);
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.rect(this.x - 24, this.y - 32, 48, 64);
        ctx.stroke();
        ctx.fillStyle = "red";
        ctx.fillRect(this.x - 2, this.y - 2, 4, 4);
    }
}

// each node on the map. can be visited, available or locked
class Node {
    constructor(id, x, y, state, frame, sheet, type, upgradeType = null) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.state = state; // visited, available or locked
        this.frame = frame; // which part of the spritesheet to use
        this.sheet = sheet; // castles or nodes spritesheet
        this.type = type; // NODE_REST=0, NODE_ENEMY=1, NODE_UPGRADE=2, NODE_BOSS=3
        this.upgradeType = upgradeType; // UPGRADE_BINDING=0, UPGRADE_LIFE=1, UPGRADE_CARD=2
        this.sprite = null; // to assign sprite later
    }

    draw(ctx) {
        ctx.save();
        if (this.sprite) {
            // draw from spritesheet with frame info
            ctx.drawImage(this.sprite, this.frame.sx, this.frame.sy, this.frame.sw, this.frame.sh,
                this.x - this.frame.dw / 2, this.y - this.frame.dh / 2, this.frame.dw, this.frame.dh); // center
        } else {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 32, 0, Math.PI * 2);
            ctx.fill();
        }
        // small green dot to show the node was visited
        if (this.state === "visited") {
            ctx.fillStyle = "green";
            ctx.beginPath();
            ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
        if (showBBox) this.drawBoundingBox(ctx);
    }

    // red bounding box toggled w y
    drawBoundingBox(ctx) {
        ctx.globalCompositeOperation = "screen";
        ctx.fillStyle = "rgb(0.5, 0.5, 0.5, 0.3)";
        ctx.fillRect(this.x - this.frame.dw / 2, this.y - this.frame.dh / 2, this.frame.dw, this.frame.dh);
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.rect(this.x - this.frame.dw / 2, this.y - this.frame.dh / 2, this.frame.dw, this.frame.dh);
        ctx.stroke();
        ctx.fillStyle = "red";
        ctx.fillRect(this.x - 2, this.y - 2, 4, 4);
    }
}

// game handles nodes and fool. draws and checks inputs
class Game {
    constructor() {
        this.initObjects();
        this.createEventListeners();

        this.startSound = new Audio("../../../assets/audio/Map.mp3");
        this.startSound.volume = 0.2;
        this.startSound.loop = true;
    }

    initObjects() {
        let upgradeTypes = [UPGRADE_BINDING, UPGRADE_LIFE, UPGRADE_CARD];
        let r = randomRange(3);
        let temp = upgradeTypes[0];
        upgradeTypes[0] = upgradeTypes[r];
        upgradeTypes[r] = temp;
        r = randomRange(3);
        temp = upgradeTypes[1];
        upgradeTypes[1] = upgradeTypes[r];
        upgradeTypes[r] = temp;

        // fill middle 6 nodes, 1 enemy and 1 upgrade per column
        let pool = [];
        for (let i = 0; i < 3; i++) {
            let uType = upgradeTypes[i];
            if (Math.random() < 0.5) {
                pool.push({ frame: NODE_FRAMES[0], sheet: "nodes", type: NODE_ENEMY, upgradeType: null });
                pool.push({ frame: UPGRADE_FRAMES[uType], sheet: "upgradeNodes", type: NODE_UPGRADE, upgradeType: uType });
            } else {
                pool.push({ frame: UPGRADE_FRAMES[uType], sheet: "upgradeNodes", type: NODE_UPGRADE, upgradeType: uType });
                pool.push({ frame: NODE_FRAMES[0], sheet: "nodes", type: NODE_ENEMY, upgradeType: null });
            }
        }

        let n1 = pool[0], n2 = pool[1], n3 = pool[2], n4 = pool[3], n5 = pool[4], n6 = pool[5];
        this.nodes = [
            new Node(0, 120, 300, "visited", NODE_FRAMES[2], "nodes", NODE_REST),
            new Node(1, 360, 180, "available", n1.frame, n1.sheet, n1.type, n1.upgradeType),
            new Node(2, 360, 420, "available", n2.frame, n2.sheet, n2.type, n2.upgradeType),
            new Node(3, 600, 180, "locked", n3.frame, n3.sheet, n3.type, n3.upgradeType),
            new Node(4, 600, 420, "locked", n4.frame, n4.sheet, n4.type, n4.upgradeType),
            new Node(5, 840, 180, "locked", n5.frame, n5.sheet, n5.type, n5.upgradeType),
            new Node(6, 840, 420, "locked", n6.frame, n6.sheet, n6.type, n6.upgradeType),
            new Node(7, 1080, 300, "locked", BIG_CASTLE, "castle", NODE_BOSS),
        ];

        this.edges = [];
        this.edges.push([0, 1]);
        this.edges.push([0, 2]);

        // col1 to col2, cross if straight puts two upgrades next to each other
        let col2top = 3;
        let col2bot = 4;
        if (this.nodes[1].type === NODE_UPGRADE) {
            if (this.nodes[3].type === NODE_UPGRADE) {
                col2top = 4;
                col2bot = 3;
            }
        }
        if (this.nodes[2].type === NODE_UPGRADE) {
            if (this.nodes[4].type === NODE_UPGRADE) {
                col2top = 4;
                col2bot = 3;
            }
        }
        this.edges.push([1, col2top]);
        this.edges.push([2, col2bot]);
        if (Math.random() < 0.5) {
            let from;
            let to;
            if (Math.random() < 0.5) { from = 1; } else { from = 2; }
            if (Math.random() < 0.5) { to = 3; } else { to = 4; }
            let duplicate = false;
            for (let i = 0; i < this.edges.length; i++) {
                if (this.edges[i][0] === from) {
                    if (this.edges[i][1] === to) {
                        duplicate = true;
                        break;
                    }
                }
            }
            if (!duplicate) {
                if (this.nodes[from].type === NODE_UPGRADE) {
                    if (this.nodes[to].type !== NODE_UPGRADE) {
                        this.edges.push([from, to]);
                    }
                } else {
                    this.edges.push([from, to]);
                }
            }
        }

        // col2 to col3
        let col3top = 5;
        let col3bot = 6;
        if (this.nodes[3].type === NODE_UPGRADE) {
            if (this.nodes[5].type === NODE_UPGRADE) {
                col3top = 6;
                col3bot = 5;
            }
        }
        if (this.nodes[4].type === NODE_UPGRADE) {
            if (this.nodes[6].type === NODE_UPGRADE) {
                col3top = 6;
                col3bot = 5;
            }
        }
        this.edges.push([3, col3top]);
        this.edges.push([4, col3bot]);
        if (Math.random() < 0.5) {
            let from;
            let to;
            if (Math.random() < 0.5) { from = 3; } else { from = 4; }
            if (Math.random() < 0.5) { to = 5; } else { to = 6; }
            let alreadyIn = false;
            for (let i = 0; i < this.edges.length; i++) {
                if (this.edges[i][0] === from) {
                    if (this.edges[i][1] === to) {
                        alreadyIn = true;
                        break;
                    }
                }
            }
            if (!alreadyIn) {
                if (this.nodes[from].type === NODE_UPGRADE) {
                    if (this.nodes[to].type !== NODE_UPGRADE) {
                        this.edges.push([from, to]);
                    }
                } else {
                    this.edges.push([from, to]);
                }
            }
        }

        this.edges.push([5, 7]);
        this.edges.push([6, 7]);

        this.currentId = 0;
        this.fool = new Fool(120, 300);
        this.sprites = {};
        this.loadSprites();

        this.upgradeOpen = false;
        this.currentUpgradeType = null;
        this.exitBtnRect = null;
        this.acceptBtnRect = null;
        this.cardPickerOpen = false;
        this.cardCellRects = [];
        this.cardBackRect = null;

        this.upgradeNames = ["Card Binding", "Life Extension", "Extra Card"];
    }

    loadSprites() {
        this.sprites.bg = new Image();
        this.sprites.bg.src = "../../../assets/images/map/Map Background.png";
        this.sprites.castle = new Image();
        this.sprites.castle.src = "../../../assets/images/map/Castle Nodes.png";
        this.sprites.nodes = new Image();
        this.sprites.nodes.src = "../../../assets/images/map/Map Nodes.png";
        this.sprites.rope = new Image();
        this.sprites.rope.src = "../../../assets/images/map/Cuerda.png";
        this.sprites.upgradeNodes = new Image();
        this.sprites.upgradeNodes.src = "../../../assets/images/map/Upgrade Nodes.png";
        for (let n of this.nodes) {
            if (n.sheet === "castle") {
                n.sprite = this.sprites.castle;
            } else if (n.sheet === "upgradeNodes") {
                n.sprite = this.sprites.upgradeNodes;
            } else {
                n.sprite = this.sprites.nodes;
            }
        }
        // set fool sprite and initialize to idle facing down
        this.fool.setSprite('../../../assets/images/Sprite Fool Final.png',
                            { x: 0, y: 0, width: FOOL_FRAME_W, height: FOOL_FRAME_H });
        this.fool.setAnimation(6, 7, true, 150); // start on front-facing idle
    }

    getSaveData() {
        return {
            currentId: this.currentId,
            fool: {
                x: this.fool.x,
                y: this.fool.y
            },
            nodes: this.nodes.map(node => ({
                id: node.id,
                x: node.x,
                y: node.y,
                state: node.state,
                sheet: node.sheet,
                type: node.type,
                upgradeType: node.upgradeType
            })),
            edges: this.edges
        };
    }

    loadSaveData(data) {
        this.currentId = data.currentId;
        this.edges = data.edges;
        this.nodes = data.nodes.map(node => {
            let frame;
            if (node.type === NODE_REST) {
                frame = NODE_FRAMES[2];
            } else if (node.type === NODE_ENEMY) {
                frame = NODE_FRAMES[0];
            } else if (node.type === NODE_UPGRADE) {
                frame = node.upgradeType != null ? UPGRADE_FRAMES[node.upgradeType] : NODE_FRAMES[1];
            } else {
                frame = BIG_CASTLE;
            }

            return new Node(node.id, node.x, node.y, node.state, frame, node.sheet, node.type, node.upgradeType);
        });
        this.fool.x = data.fool.x;
        this.fool.y = data.fool.y;
        this.fool.tx = data.fool.x;
        this.fool.ty = data.fool.y;
        this.loadSprites();
    }

    update(deltaTime) {
        this.fool.update(deltaTime);
        // check if fool just arrived at a node this frame
        if (this.fool.arrived) {
            this.arrive();
        }
    }

    // called when the fool reaches a node, marks it visited and updates what's available
    async arrive() {
        for (let n of this.nodes) {
            if (n.x === this.fool.tx && n.y === this.fool.ty) {
                if (n.type === NODE_ENEMY) {
                    // a fight node is consumed only if it is won, so don't mark it
                    // visited or save here: just remember which node is being fought
                    localStorage.setItem("pendingFight", n.id);
                    let fight;
                    if (n.id === 1 || n.id === 2) {
                        fight = 1;
                    } else if (n.id === 3 || n.id === 4) {
                        fight = 2;
                    } else {
                        fight = 3;
                    }
                    let diff = pickDifficulty(fight);
                    if (diff === ENEMY_COMMON) {
                        window.location.href = "../duel/duel_easy.html";
                    } else if (diff === ENEMY_RARE) {
                        window.location.href = "../duel/duel_intermedio.html";
                    } else {
                        window.location.href = "../duel/duel.html";
                    }
                } else if (n.type === NODE_BOSS) {
                    localStorage.setItem("pendingFight", n.id);
                    window.location.href = "../duel/duel_dealer.html";
                } else {
                    // rest and upgrade nodes have no duel, so they are consumed on arrival
                    this.currentId = n.id;
                    n.state = "visited";
                    this.updateAvailable();
                    if (n.type === NODE_UPGRADE) {
                        this.currentUpgradeType = n.upgradeType;
                        this.upgradeOpen = true;
                    }
                    await saveProgress(this);
                }
                break;
            }
        }
    }

    // locks everything then unlocks only the nodes connected to where the fool is now
    updateAvailable() {
        for (let n of this.nodes) {
            if (n.state !== "visited") n.state = "locked";
        }
        for (let i = 0; i < this.edges.length; i++) {
            let from = this.edges[i][0];
            let to = this.edges[i][1];
            if (from === this.currentId && this.nodes[to].state !== "visited") {
                this.nodes[to].state = "available";
            }
        }
    }

    draw(ctx) {
        if (this.sprites.bg) {
            ctx.drawImage(this.sprites.bg, 0, 0, canvasWidth, canvasHeight);
        } else {
            ctx.fillStyle = "#0e0920";
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        }
        this.drawEdges(ctx);
        for (let n of this.nodes) n.draw(ctx);
        this.fool.draw(ctx);
        if (this.upgradeOpen) {
            this.drawUpgradePanel(ctx);
        } else if (this.cardPickerOpen) {
            this.drawCardPicker(ctx);
        }
    }

    // draws the rope connecting each pair of nodes
    drawEdges(ctx) {
        for (let i = 0; i < this.edges.length; i++) {
            let from = this.edges[i][0];
            let to = this.edges[i][1];
            let a = this.nodes[from];
            let b = this.nodes[to];
            let dx = b.x - a.x;
            let dy = b.y - a.y;
            let len = Math.sqrt(dx * dx + dy * dy);
            let angle = Math.atan2(dy, dx); // angle between the two nodes
            let ropeH = 20;

            // rotate the canvas so we can draw the rope horizontally then rotate it into place
            ctx.save();
            ctx.translate(a.x, a.y);
            ctx.rotate(angle);

            ctx.drawImage(this.sprites.rope, 0, -ropeH / 2, len, ropeH);

            ctx.restore();
        }
    }

    createEventListeners() {
        // y key toggles the bounding boxes
        window.addEventListener('keydown', event => {
            if (event.key == 'y') showBBox = !showBBox;
        });
        // click on an available node to send the fool there
        window.addEventListener("click", (event) => {
            //if (this.mapMusic.paused) this.mapMusic.play();
            if (this.startSound.paused) this.startSound.play();
            const rect = ctx.canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            if (this.upgradeOpen) {
                this.checkUpgradeClick(mouseX, mouseY);
                return;
            }
            if (this.cardPickerOpen) {
                this.checkCardPickerClick(mouseX, mouseY);
                return;
            }
            for (let n of this.nodes) {
                this.checkNodeClick(n, mouseX, mouseY);
            }
        });
    }

    checkNodeClick(n, mouseX, mouseY) { // if it is 40 pixels away from the node, it will count as a click
        if (this.fool.moving) return;
        let dx = mouseX - n.x;
        let dy = mouseY - n.y;
        if (Math.sqrt(dx * dx + dy * dy) <= 40 && n.state === "available") {
            console.log("node clicked: " + n.id);
            this.fool.setTarget(n.x, n.y);
        }
    }
}

// resolves a duel the player just returned from. the fought node becomes visited
// only on a win; otherwise it stays available so it can be challenged again
async function applyPendingFight(game) {
    const pending = localStorage.getItem("pendingFight");
    if (pending === null) {
        return;
    }
    const won = localStorage.getItem("duelWon") === "true";
    localStorage.removeItem("pendingFight");
    localStorage.removeItem("duelWon");
    if (!won) {
        return; // lost or abandoned, leave the node available to be revisited
    }
    const nodeId = parseInt(pending, 10);
    const node = game.nodes.find(n => n.id === nodeId);
    if (!node) {
        return;
    }
    game.currentId = nodeId;
    node.state = "visited";
    game.fool.x = node.x;
    game.fool.y = node.y;
    game.fool.tx = node.x;
    game.fool.ty = node.y;
    game.updateAvailable();
    await saveProgress(game);
}

// sets up the canvas and starts the game
async function main() {
    const canvas = document.getElementById('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext('2d');
    game = new Game();
    if (localStorage.getItem("continueRun") === "true") {
        let loaded = await loadGame(game);
        if (!loaded) {
            // DB unavailable or not logged in, restore from local backup if it exists
            loaded = loadMapLocally(game);
        }
        if (!loaded) {
            await saveNewDescent(game);
        } else {
            // resolve the result of a duel the player just came back from
            await applyPendingFight(game);
        }
    }
    else {
        // a brand new descent, drop any leftover state from a previous run
        localStorage.removeItem("pendingFight");
        localStorage.removeItem("duelWon");
        localStorage.removeItem("extraCards");
        localStorage.setItem("playerCoins", "0");
        const saved = await saveNewDescent(game);
        if (saved) {
            localStorage.setItem("continueRun", "true");
        }
    }
    drawScene(0);
}

// main loop, runs every frame
function drawScene(newTime) {
    let deltaTime = newTime - oldTime;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    game.update(deltaTime);
    game.draw(ctx);
    oldTime = newTime;
    requestAnimationFrame(drawScene);
}