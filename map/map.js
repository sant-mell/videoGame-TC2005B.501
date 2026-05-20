"use strict";

const canvasWidth = 1200;
const canvasHeight = 600;

let ctx;
let game;
let oldTime = 0;
let showBBox = false; // y for hitbox 
// s is for sheet location, d is for drawing dimensions
const SMALL_CASTLE = { sx: 0, sy: 0, sw: 331, sh: 444, dw: 62, dh: 75 }; // Castle Nodes.png left sprite
const NODE_FRAMES = [
    { sx: 0, sy: 0, sw: 305, sh: 362, dw: 78, dh: 78 }, //diamond
    { sx: 305, sy: 0, sw: 327, sh: 362, dw: 78, dh: 78 }, //gear
    { sx: 632, sy: 0, sw: 314, sh: 362, dw: 78, dh: 78 }  //portal
];

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
    }

    update(deltaTime) {
        this.arrived = false;
        if (this.moving) {
            let dt = deltaTime / 1000;
            let dx = this.tx - this.x;
            let dy = this.ty - this.y;
            let d = Math.sqrt(dx * dx + dy * dy);
            // if it gets close it will stop when it arrives 
            if (d < 2) { //d is distance in pixels
                this.x = this.tx;
                this.y = this.ty;
                this.moving = false;
                this.arrived = true;
            } else {
                // constant speed diagonally like in class
                this.x += (dx / d) * this.speed * dt;
                this.y += (dy / d) * this.speed * dt;
            }
        }
    }

    // draws the fool as F, 
    //=========================
    // HAY QUE AGREGAR FOOL SPRITE
    //==========================
    draw(ctx) {
        ctx.save();
        ctx.strokeStyle = "#ffd700";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 18, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "#ffcc00";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#1a0a00";
        ctx.font = "bold 13px Arial";
        ctx.fillText("F", this.x, this.y + 4.5);
        ctx.restore();
        if (showBBox) this.drawBoundingBox(ctx);
    }

    // red bounding box toggled w y
    drawBoundingBox(ctx) {
        ctx.globalCompositeOperation = "screen";
        ctx.fillStyle = "rgb(0.5, 0.5, 0.5, 0.3)";
        ctx.fillRect(this.x - 18, this.y - 18, 36, 36);
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.rect(this.x - 18, this.y - 18, 36, 36);
        ctx.stroke();
        ctx.fillStyle = "red";
        ctx.fillRect(this.x - 2, this.y - 2, 4, 4);
    }
}

// each node on the map. can be visited, available or locked
class Node {
    constructor(id, x, y, state, frame, sheet) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.state = state; // visited, available or locked
        this.frame = frame; // which part of the spritesheet to use
        this.sheet = sheet; // castles or nodes spritesheet
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
    }

    initObjects() {
        // starting node is already visited, the two branches are available at the start
        this.nodes = [
            new Node(0, 120, 300, "visited", SMALL_CASTLE, "castle"),
            new Node(1, 360, 180, "available", NODE_FRAMES[randomRange(3)], "nodes"),
            new Node(2, 360, 420, "available", NODE_FRAMES[randomRange(3)], "nodes")
        ];
        // edges say which nodes are connected, [from, to]
        this.edges = [[0, 1], [0, 2]];
        this.currentId = 0; // which node the fool is currently on

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
        // give each node a reference to its spritesheet
        for (let n of this.nodes) {
            if (n.sheet == "castle") {
                n.sprite = this.sprites.castle;
            } else {
                n.sprite = this.sprites.nodes;
            }
        }
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
            const rect = ctx.canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            for (let n of this.nodes) {
                this.checkNodeClick(n, mouseX, mouseY);
            }
        });
    }

    checkNodeClick(n, mouseX, mouseY) { // if it is 40 pixels away from the node, it will counta s click
        if (this.fool.moving) return;
        let dx = mouseX - n.x;
        let dy = mouseY - n.y;
        if (Math.sqrt(dx * dx + dy * dy) <= 40 && n.state === "available") {
            console.log("node clicked: " + n.id);
            this.fool.tx = n.x;
            this.fool.ty = n.y;
            this.fool.moving = true;
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
