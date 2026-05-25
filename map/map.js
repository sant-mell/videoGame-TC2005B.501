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
    constructor(id, x, y, state, frame, sheet, type) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.state = state; // visited, available or locked
        this.frame = frame; // which part of the spritesheet to use
        this.sheet = sheet; // castles or nodes spritesheet
        this.type = type; // NODE_REST=0, NODE_ENEMY=1, NODE_UPGRADE=2, NODE_BOSS=3
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

        this.mapMusic = new Audio("../assets/audio/travel map.mp3");
        this.mapMusic.volume = 0.4;
        this.mapMusic.loop = true;
    }

    initObjects() {
        // fill middle 6 nodes, 1 enemy and 1 upgrade per column
        let pool = [];
        for (let i = 0; i < 3; i++) {
            if (Math.random() < 0.5) {
                pool.push({ frame: NODE_FRAMES[0], sheet: "nodes", type: NODE_ENEMY });
                pool.push({ frame: NODE_FRAMES[1], sheet: "nodes", type: NODE_UPGRADE });
            } else {
                pool.push({ frame: NODE_FRAMES[1], sheet: "nodes", type: NODE_UPGRADE });
                pool.push({ frame: NODE_FRAMES[0], sheet: "nodes", type: NODE_ENEMY });
            }
        }

        let n1 = pool[0], n2 = pool[1], n3 = pool[2], n4 = pool[3], n5 = pool[4], n6 = pool[5];
        this.nodes = [
            new Node(0, 120, 300, "visited", NODE_FRAMES[2], "nodes", NODE_REST),
            new Node(1, 360, 180, "available", n1.frame, n1.sheet, n1.type),
            new Node(2, 360, 420, "available", n2.frame, n2.sheet, n2.type),
            new Node(3, 600, 180, "locked", n3.frame, n3.sheet, n3.type),
            new Node(4, 600, 420, "locked", n4.frame, n4.sheet, n4.type),
            new Node(5, 840, 180, "locked", n5.frame, n5.sheet, n5.type),
            new Node(6, 840, 420, "locked", n6.frame, n6.sheet, n6.type),
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
    }

    loadSprites() {
        this.sprites.bg = new Image();
        this.sprites.bg.src = "../assets/images/map/Map Background.png";
        this.sprites.castle = new Image();
        this.sprites.castle.src = "../assets/images/map/Castle Nodes.png";
        this.sprites.nodes = new Image();
        this.sprites.nodes.src = "../assets/images/map/Map Nodes.png";
        this.sprites.rope = new Image();
        this.sprites.rope.src = "../assets/images/map/Cuerda.png";
        for (let n of this.nodes) {
            if (n.sheet === "castle") {
                n.sprite = this.sprites.castle;
            } else {
                n.sprite = this.sprites.nodes;
            }
        }
        // set fool sprite and initialize to idle facing down
        this.fool.setSprite('../assets/images/Sprite Fool Final.png',
                            { x: 0, y: 0, width: FOOL_FRAME_W, height: FOOL_FRAME_H });
        this.fool.setAnimation(6, 7, true, 150); // start on front-facing idle
    }

    update(deltaTime) {
        this.fool.update(deltaTime);
        // check if fool just arrived at a node this frame
        if (this.fool.arrived) {
            this.arrive();
        }
    }

    // called when the fool reaches a node, marks it visited and updates what's available
    arrive() {
        for (let n of this.nodes) {
            if (n.x === this.fool.tx && n.y === this.fool.ty) {
                this.currentId = n.id;
                n.state = "visited";
                this.updateAvailable();
                if (n.type === NODE_ENEMY) {
                    window.location.href = "../prototipo/prototipo.html";
                } else if (n.type === NODE_BOSS) {
                    window.location.href = "../prototipo/prototipo.html";
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
            if (this.mapMusic.paused) this.mapMusic.play();
            const rect = ctx.canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            for (let n of this.nodes) {
                this.checkNodeClick(n, mouseX, mouseY);
            }
        });
    }

    checkNodeClick(n, mouseX, mouseY) { // if it is 40 pixels away from the node, it will count as a click
        if (this.fool.moving) return;
        let dx = mouseX - n.x;
        let dy = mouseY - n.y;
        // check both directions in the edge list so the fool can also return left
        let isConnected = false;
        for (let i = 0; i < this.edges.length; i++) {
            let from = this.edges[i][0];
            let to = this.edges[i][1];
            if (from === this.currentId) {
                if (to === n.id) {
                    isConnected = true;
                    break;
                }
            } else if (to === this.currentId) {
                if (from === n.id) {
                    isConnected = true;
                    break;
                }
            }
        }
        if (Math.sqrt(dx * dx + dy * dy) <= 40) {
            if (n.id !== this.currentId) {
                if (isConnected) {
                    console.log("node clicked: " + n.id);
                    this.fool.setTarget(n.x, n.y);
                }
            }
        }
    }
}

// sets up the canvas and starts the game
function main() {
    const canvas = document.getElementById('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext('2d');
    game = new Game();
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