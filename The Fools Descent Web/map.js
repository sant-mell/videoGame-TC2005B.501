"use strict";

// ============================================================
// CANVAS DIMENSIONS  (internal drawing space)
// ============================================================
const MAP_W = 1200;
const MAP_H = 600;

// ============================================================
// SPRITESHEET FRAME DEFINITIONS
// ============================================================

// Map Nodes.png — 946×362, three sprites side by side
// Frame 0: diamond (x 0–305)  Frame 1: gear (x 305–632)  Frame 2: portal (x 632–946)
const NODE_FRAMES = [
    { sx:   0, sy: 0, sw: 305, sh: 362 },  // diamond
    { sx: 305, sy: 0, sw: 327, sh: 362 },  // gear
    { sx: 632, sy: 0, sw: 314, sh: 362 }   // portal
];

// Castle Nodes.png — 847×444, two sizes side by side
// Small castle (start):  x 0–331
// Large castle (boss):   x 331–847
const CASTLE_FRAMES = {
    small: { sx:   0, sy: 0, sw: 331, sh: 444 },
    large: { sx: 331, sy: 0, sw: 516, sh: 444 }
};

// Drawn sizes on canvas
const SIZE_NODE_MID   = { w: 78,  h: 78  };  // middle nodes (diamond/gear/portal)
const SIZE_CASTLE_SM  = { w: 62,  h: 75  };  // small castle (start)
const SIZE_CASTLE_LG  = { w: 120, h: 104 };  // large castle (boss)

// Click-detection radius (all nodes use same radius)
const NODE_R = 38;

// ============================================================
// LAYOUT — strict 1·2·1·2·1 column structure
// ============================================================
const COL_X = [110, 330, 570, 810, 1060];
const COL_Y = {
    0: [300],
    1: [165, 435],
    2: [300],
    3: [165, 435],
    4: [300]
};
// Node IDs: col0→0, col1→1(top)/2(bot), col2→3, col3→4(top)/5(bot), col4→6
const EDGES = [
    [0, 1], [0, 2],
    [1, 3], [2, 3],
    [3, 4], [3, 5],
    [4, 6], [5, 6]
];

// ============================================================
// NODE TYPE METADATA (for modal text and glow colour)
// ============================================================
const NODE_META = {
    ENEMY_COMMON: {
        label:   "Common",
        title:   "A Common Enemy Awaits",
        desc:    ["A Drunk or Peasant blocks your path.", "They are sloppy — find the opening."],
        enemies: ["Drunk", "Peasant"],
        glowColor: "#c0392b"
    },
    ENEMY_RARE: {
        label:   "Rare",
        title:   "A Seasoned Combatant",
        desc:    ["Crazy Jester or Bounded Knight awaits.", "They skip every third turn — exploit it."],
        enemies: ["Crazy Jester", "Bounded Knight"],
        glowColor: "#8e44ad"
    },
    ENEMY_EPIC: {
        label:   "Epic",
        title:   "A Powerful Foe",
        desc:    ["Killer Queen or Mad Monarch.", "They play every single turn. Stay sharp."],
        enemies: ["Killer Queen", "Mad Monarch"],
        glowColor: "#6c3483"
    },
    BOSS: {
        label:   "The Dealer",
        title:   "The Dealer — Final Confrontation",
        desc:    ["He made the game. Now face him.", "Survive his relentless aggression to reclaim fate."],
        enemies: ["The Dealer"],
        glowColor: "#8b0000"
    },
    UPGRADE: {
        label:   "Upgrade",
        title:   "The Merchant's Stall",
        desc:    ["Card Binding · 300c  |  Life Extension · 400c  |  New Card · 100c", "Spend wisely. Your next duel depends on it."],
        enemies: [],
        glowColor: "#d4af37"
    },
    REST: {
        label:   "Rest Site",
        title:   "A Moment of Stillness",
        desc:    ["No encounter. Breathe.", "Plan your next move carefully."],
        enemies: [],
        glowColor: "#4499ff"
    }
};

// ============================================================
// MOCK PLAYER STATE
// ============================================================
const mockState = {
    currentNodeId: 0,
    visitedIds:    new Set([0]),
    coins:         320,
    lives:         3
};

// ============================================================
// PUBLIC CALLBACK — replace body with real navigation later
// ============================================================
function onNodeSelect(nodeData) {
    console.log("[MAP] Node selected:", nodeData);
}

// ============================================================
// SPRITE LOADER
// ============================================================
const sprites = {};

function loadSprites(onComplete) {
    const paths = {
        background: "../assets/images/map/Map Background.png",
        nodes:      "../assets/images/map/Map Nodes.png",
        castle:     "../assets/images/map/Castle Nodes.png",
        rope:       "../assets/images/map/Cuerda.png"
    };
    let done = 0;
    const total = Object.keys(paths).length;
    const finish = () => { if (++done === total) onComplete(); };
    for (const [key, src] of Object.entries(paths)) {
        const img = new Image();
        img.onload  = finish;
        img.onerror = finish;
        img.src = src;
        sprites[key] = img;
    }
}

function spriteOk(key) {
    const img = sprites[key];
    return img && img.complete && img.naturalWidth > 0;
}

// ============================================================
// MAP ENGINE
// ============================================================
class MapEngine {

    constructor() {
        this._buildNodes();

        this._currentId = mockState.currentNodeId;
        for (const id of mockState.visitedIds) {
            this._nodes[id].state = "visited";
        }
        this._updateAvailable();

        const start  = this._nodes[this._currentId];
        this._foolX  = start.x;
        this._foolY  = start.y;
        this._foolTX = start.x;
        this._foolTY = start.y;
        this._foolMoving = false;
        this._foolSpeed  = 260;

        this._pulse   = 0;
        this._hoverId = -1;
        this._modal   = null;
        this._modalBtnRect = null;

        this._stars = this._buildStars(90);

        canvas.addEventListener("click",     e => this._onClick(e));
        canvas.addEventListener("mousemove", e => this._onMove(e));
    }

    // ---- BUILD ------------------------------------------------

    _buildNodes() {
        // Determine middle node types (random, matching GDD probabilities)
        const fight2 = Math.random() < 0.20 ? "ENEMY_COMMON" : "ENEMY_RARE";
        const fight3 = Math.random() < 0.40 ? "ENEMY_RARE"   : "ENEMY_EPIC";
        const pool   = [fight2, fight3, "UPGRADE", "UPGRADE", "REST"];
        pool.sort(() => Math.random() - 0.5);

        const typeByIndex = [
            "ENEMY_COMMON",             // id 0 — start
            pool[0], pool[1],           // id 1, 2 — col 1
            pool[2],                    // id 3 — col 2
            pool[3], pool[4],           // id 4, 5 — col 3
            "BOSS"                      // id 6 — boss
        ];

        // Randomly assign one of the three Map Nodes sprites to each middle node
        // (ids 1–5); ids 0 and 6 use castle sprites instead
        const spriteFrameByIndex = [
            null,                       // id 0 → small castle
            Math.floor(Math.random() * 3),
            Math.floor(Math.random() * 3),
            Math.floor(Math.random() * 3),
            Math.floor(Math.random() * 3),
            Math.floor(Math.random() * 3),
            null                        // id 6 → large castle
        ];

        this._nodes = [];
        let id = 0;
        for (let col = 0; col <= 4; col++) {
            for (const y of COL_Y[col]) {
                this._nodes.push({
                    id,
                    col,
                    x:           COL_X[col],
                    y,
                    type:        typeByIndex[id],
                    spriteFrame: spriteFrameByIndex[id], // null = castle
                    state:       "locked"  // "locked" | "available" | "visited"
                });
                id++;
            }
        }

        this._edges = EDGES;
    }

    _buildStars(n) {
        const phi = 1.6180339887;
        return Array.from({ length: n }, (_, i) => ({
            x: (i * phi * 193) % MAP_W,
            y: (i * phi * 127) % MAP_H,
            r: i % 5 === 0 ? 1.8 : i % 3 === 0 ? 1.3 : 0.9,
            a: 0.10 + (i % 7) * 0.035
        }));
    }

    // ---- STATE ------------------------------------------------

    _updateAvailable() {
        for (const n of this._nodes) {
            if (n.state !== "visited") n.state = "locked";
        }
        for (const [from, to] of this._edges) {
            if (from === this._currentId && this._nodes[to].state !== "visited") {
                this._nodes[to].state = "available";
            }
        }
    }

    _nodeAt(mx, my) {
        for (const n of this._nodes) {
            const dx = mx - n.x, dy = my - n.y;
            if (dx * dx + dy * dy <= NODE_R * NODE_R) return n;
        }
        return null;
    }

    _toCanvas(e) {
        const r = canvas.getBoundingClientRect();
        return [
            (e.clientX - r.left) * (MAP_W / r.width),
            (e.clientY - r.top)  * (MAP_H / r.height)
        ];
    }

    // ---- EVENTS -----------------------------------------------

    _onMove(e) {
        if (this._modal) { canvas.style.cursor = "default"; return; }
        const [mx, my] = this._toCanvas(e);
        const n = this._nodeAt(mx, my);
        if (n && n.state === "available") {
            this._hoverId = n.id;
            canvas.style.cursor = "pointer";
        } else {
            this._hoverId = -1;
            canvas.style.cursor = "default";
        }
    }

    _onClick(e) {
        if (this._foolMoving) return;
        const [mx, my] = this._toCanvas(e);

        if (this._modal) {
            const b = this._modalBtnRect;
            if (b && mx >= b.x && mx <= b.x + b.w && my >= b.y && my <= b.y + b.h) {
                this._modal = null;
            }
            return;
        }

        const n = this._nodeAt(mx, my);
        if (n && n.state === "available") {
            onNodeSelect({ id: n.id, type: n.type, col: n.col, meta: NODE_META[n.type] });
            this._foolMoving = true;
            this._foolTX = n.x;
            this._foolTY = n.y;
        }
    }

    // ---- UPDATE -----------------------------------------------

    update(dt) {
        this._pulse += dt * 0.003;

        if (!this._foolMoving) return;
        const dx = this._foolTX - this._foolX;
        const dy = this._foolTY - this._foolY;
        const d  = Math.hypot(dx, dy);
        if (d < 2) {
            this._foolX = this._foolTX;
            this._foolY = this._foolTY;
            this._arrive();
        } else {
            const step = this._foolSpeed * (dt / 1000);
            this._foolX += (dx / d) * step;
            this._foolY += (dy / d) * step;
        }
    }

    _arrive() {
        for (const n of this._nodes) {
            if (n.x === this._foolTX && n.y === this._foolTY) {
                this._currentId  = n.id;
                n.state          = "visited";
                this._foolMoving = false;
                this._updateAvailable();
                this._modal = n;
                break;
            }
        }
    }

    // ---- DRAW -------------------------------------------------

    draw() {
        this._drawBackground();
        this._drawStars();
        this._drawEdges();
        for (const n of this._nodes) this._drawNode(n);
        this._drawFool();
        this._drawHUD();
        if (this._modal) this._drawModal(this._modal);
    }

    _drawBackground() {
        if (spriteOk("background")) {
            ctx.drawImage(sprites.background, 0, 0, MAP_W, MAP_H);
        } else {
            ctx.fillStyle = "#0e0920";
            ctx.fillRect(0, 0, MAP_W, MAP_H);
        }
    }

    _drawStars() {
        for (const s of this._stars) {
            ctx.fillStyle = `rgba(200,180,255,${s.a})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    _drawEdges() {
        ctx.save();
        for (const [from, to] of this._edges) {
            const a = this._nodes[from];
            const b = this._nodes[to];
            const traveled  = a.state === "visited" && b.state === "visited";
            const reachable = a.id === this._currentId && b.state === "available";

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);

            if (traveled) {
                ctx.strokeStyle = "#7b4fcf";
                ctx.lineWidth   = 3;
                ctx.setLineDash([]);
            } else if (reachable) {
                ctx.strokeStyle = "#d4af37";
                ctx.lineWidth   = 2;
                ctx.setLineDash([12, 6]);
            } else {
                ctx.strokeStyle = "rgba(90,70,130,0.35)";
                ctx.lineWidth   = 1.5;
                ctx.setLineDash([4, 9]);
            }
            ctx.stroke();
            ctx.setLineDash([]);
        }
        ctx.restore();
    }

    // Returns { sheet: spriteImage, frame: {sx,sy,sw,sh}, size: {w,h} } for a node
    _resolveSprite(node) {
        const isCastleOk = spriteOk("castle");
        const isNodesOk  = spriteOk("nodes");

        if (node.id === 0) {
            // Start — small castle
            return isCastleOk
                ? { sheet: sprites.castle, frame: CASTLE_FRAMES.small, size: SIZE_CASTLE_SM }
                : null;
        }
        if (node.type === "BOSS") {
            // Boss — large castle
            return isCastleOk
                ? { sheet: sprites.castle, frame: CASTLE_FRAMES.large, size: SIZE_CASTLE_LG }
                : null;
        }
        // Middle node — randomly assigned Map Nodes frame
        return isNodesOk
            ? { sheet: sprites.nodes, frame: NODE_FRAMES[node.spriteFrame], size: SIZE_NODE_MID }
            : null;
    }

    _drawNode(node) {
        const { x, y, state, type } = node;
        const meta    = NODE_META[type];
        const hovered = this._hoverId === node.id && state === "available";
        const pulse   = Math.sin(this._pulse) * 0.5 + 0.5;

        ctx.save();

        const sp = this._resolveSprite(node);

        if (sp) {
            // ── Sprite path ─────────────────────────────────────

            const { sheet, frame, size } = sp;
            const dx = x - size.w / 2;
            const dy = y - size.h / 2;

            // Available: pulsing glow via shadowBlur on the sprite itself
            if (state === "available") {
                ctx.shadowColor = meta.glowColor;
                ctx.shadowBlur  = 20 + pulse * 22;
            }

            // Locked: dim and desaturate
            if (state === "locked") {
                ctx.filter      = "grayscale(80%) brightness(35%)";
                ctx.globalAlpha = 0.55;
            }

            // Visited: dim
            if (state === "visited") {
                ctx.globalAlpha = 0.38;
            }

            ctx.drawImage(sheet, frame.sx, frame.sy, frame.sw, frame.sh, dx, dy, size.w, size.h);

            ctx.filter      = "none";
            ctx.shadowBlur  = 0;
            ctx.globalAlpha = 1;

            // Visited: purple checkmark drawn on top
            if (state === "visited") {
                ctx.strokeStyle = "#7b4fcf";
                ctx.lineWidth   = 2.5;
                ctx.lineCap     = "round";
                ctx.beginPath();
                ctx.moveTo(x - 9, y + 1);
                ctx.lineTo(x - 3, y + 9);
                ctx.lineTo(x + 10, y - 9);
                ctx.stroke();
            }

            // Hover: white ring around the sprite bounding box area
            if (hovered) {
                ctx.globalAlpha = 0.7 + pulse * 0.3;
                ctx.strokeStyle = "#ffffff";
                ctx.lineWidth   = 2;
                ctx.beginPath();
                ctx.arc(x, y, Math.max(size.w, size.h) / 2 + 12, 0, Math.PI * 2);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }

            // Label beneath
            const labelY = y + size.h / 2 + 14;
            ctx.font      = "11px Arial, sans-serif";
            ctx.textAlign = "center";
            ctx.fillStyle = state === "available" ? meta.glowColor : "rgba(150,130,180,0.5)";
            ctx.fillText(meta.label, x, labelY);

        } else {
            // ── Vector fallback (sprites not loaded) ─────────────

            // Available glow ring
            if (state === "available") {
                ctx.shadowColor = meta.glowColor;
                ctx.shadowBlur  = 18 + pulse * 18;
                ctx.strokeStyle = meta.glowColor;
                ctx.lineWidth   = 2 + pulse * 0.8;
                ctx.globalAlpha = 0.65 + pulse * 0.35;
                ctx.beginPath();
                ctx.arc(x, y, NODE_R + 7, 0, Math.PI * 2);
                ctx.stroke();
                ctx.shadowBlur  = 0;
                ctx.globalAlpha = 1;
            }

            // Node circle
            ctx.beginPath();
            ctx.arc(x, y, NODE_R, 0, Math.PI * 2);
            ctx.fillStyle   = "#1a0a30";
            ctx.fill();
            ctx.strokeStyle = meta.glowColor;
            ctx.lineWidth   = 2.5;
            ctx.stroke();

            this._drawFallbackIcon(node);

            if (state === "locked") {
                ctx.globalAlpha = 0.65;
                ctx.fillStyle   = "rgba(0,0,0,0.6)";
                ctx.beginPath();
                ctx.arc(x, y, NODE_R, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }
            if (state === "visited") {
                ctx.globalAlpha = 0.55;
                ctx.fillStyle   = "#000";
                ctx.beginPath();
                ctx.arc(x, y, NODE_R, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;

                ctx.strokeStyle = "#7b4fcf";
                ctx.lineWidth   = 2.5;
                ctx.lineCap     = "round";
                ctx.beginPath();
                ctx.moveTo(x - 9, y + 1);
                ctx.lineTo(x - 3, y + 9);
                ctx.lineTo(x + 10, y - 9);
                ctx.stroke();
            }
            if (hovered) {
                ctx.globalAlpha = 0.75 + pulse * 0.25;
                ctx.strokeStyle = "#ffffff";
                ctx.lineWidth   = 2;
                ctx.beginPath();
                ctx.arc(x, y, NODE_R + 13, 0, Math.PI * 2);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }

            ctx.font      = "11px Arial, sans-serif";
            ctx.textAlign = "center";
            ctx.fillStyle = state === "available" ? meta.glowColor : "rgba(150,130,180,0.5)";
            ctx.fillText(meta.label, x, y + NODE_R + 16);
        }

        ctx.restore();
    }

    // ---- VECTOR FALLBACK ICONS --------------------------------

    _drawFallbackIcon(node) {
        const { x, y, type } = node;
        switch (type) {
            case "ENEMY_COMMON":
            case "ENEMY_RARE":
            case "ENEMY_EPIC": this._iconSkull(x, y, NODE_META[type].glowColor); break;
            case "BOSS":       this._iconCastle(x, y); break;
            case "UPGRADE":    this._iconGear(x, y); break;
            case "REST":       this._iconPortal(x, y); break;
        }
    }

    _iconSkull(x, y, color) {
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(x - 7, y - 3, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(x + 7, y - 3, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#1a0a30";
        ctx.beginPath(); ctx.arc(x - 7, y - 3, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(x + 7, y - 3, 2, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth   = 1.5;
        ctx.beginPath();
        ctx.moveTo(x - 9, y + 7);
        for (let i = 0; i <= 3; i++) {
            ctx.lineTo(x - 9 + i * 6,     y + (i % 2 === 0 ? 7  : 13));
            ctx.lineTo(x - 9 + i * 6 + 6, y + (i % 2 === 0 ? 13 : 7));
        }
        ctx.stroke();
    }

    _iconCastle(x, y) {
        ctx.fillStyle   = "#0a0505";
        ctx.strokeStyle = "#8b0000";
        ctx.lineWidth   = 2;
        ctx.fillRect  (x - 20, y - 4, 40, 22); ctx.strokeRect(x - 20, y - 4, 40, 22);
        for (const ox of [-13, 0, 13]) {
            ctx.fillRect  (x + ox - 6, y - 18, 12, 16);
            ctx.strokeRect(x + ox - 6, y - 18, 12, 16);
        }
        ctx.fillStyle = "#8b0000";
        ctx.beginPath(); ctx.arc(x, y + 14, 7, Math.PI, 0); ctx.closePath(); ctx.fill();
        ctx.fillRect(x - 7, y + 14, 14, 4);
    }

    _iconGear(x, y) {
        const teeth = 8, rI = 11, rO = 19, rT = 6;
        ctx.fillStyle   = "#6a4a00";
        ctx.strokeStyle = "#d4af37";
        ctx.lineWidth   = 1.5;
        ctx.beginPath();
        for (let i = 0; i < teeth; i++) {
            const a0 = (i / teeth) * Math.PI * 2;
            const a1 = a0 + 0.22;
            const a2 = ((i + 0.5) / teeth) * Math.PI * 2 - 0.22;
            const a3 = ((i + 0.5) / teeth) * Math.PI * 2;
            ctx.lineTo(x + Math.cos(a0) * rO,       y + Math.sin(a0) * rO);
            ctx.lineTo(x + Math.cos(a1) * (rO + rT), y + Math.sin(a1) * (rO + rT));
            ctx.lineTo(x + Math.cos(a2) * (rO + rT), y + Math.sin(a2) * (rO + rT));
            ctx.lineTo(x + Math.cos(a3) * rO,       y + Math.sin(a3) * rO);
        }
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#0e0920";
        ctx.beginPath(); ctx.arc(x, y, rI, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#d4af37";
        ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2); ctx.fill();
    }

    _iconPortal(x, y) {
        ctx.save();
        ctx.shadowColor = "#0066ff";
        ctx.shadowBlur  = 16;
        const g = ctx.createRadialGradient(x, y, 5, x, y, 24);
        g.addColorStop(0, "#1a55cc"); g.addColorStop(0.5, "#0a2266"); g.addColorStop(1, "#04091a");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, 24, 0, Math.PI * 2); ctx.fill();
        for (const r of [24, 16, 9]) {
            ctx.strokeStyle = `rgba(80,160,255,${0.9 - r * 0.015})`;
            ctx.lineWidth   = r === 24 ? 2 : 1.5;
            ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
        }
        ctx.restore();
    }

    // ---- FOOL TOKEN -------------------------------------------

    _drawFool() {
        const x = this._foolX, y = this._foolY;
        ctx.save();
        ctx.shadowColor = "#ffd700";
        ctx.shadowBlur  = 22;
        ctx.strokeStyle = "#ffd700";
        ctx.lineWidth   = 2.5;
        ctx.beginPath(); ctx.arc(x, y, 18, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = "#ffcc00";
        ctx.beginPath(); ctx.arc(x, y, 13, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#1a0a00";
        ctx.font      = "bold 13px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("F", x, y + 4.5);
        ctx.restore();
    }

    // ---- HUD --------------------------------------------------

    _drawHUD() {
        ctx.fillStyle = "rgba(14,9,32,0.82)";
        ctx.fillRect(0, MAP_H - 40, MAP_W, 40);
        ctx.strokeStyle = "#3a2a1d";
        ctx.lineWidth   = 1;
        ctx.strokeRect(0, MAP_H - 40, MAP_W, 40);

        ctx.font      = "13px Arial, sans-serif";
        ctx.textAlign = "left";
        ctx.fillStyle = "#d4af37";
        ctx.fillText("Coins: " + mockState.coins, 14, MAP_H - 14);
        ctx.fillStyle = "#c0392b";
        ctx.fillText("Lives: " + "♥".repeat(mockState.lives), 130, MAP_H - 14);

        const legend = [
            { color: "#c0392b", label: "Enemy" },
            { color: "#d4af37", label: "Upgrade" },
            { color: "#4499ff", label: "Rest" },
            { color: "#8b0000", label: "Boss" }
        ];
        let lx = MAP_W - 340;
        const ly = MAP_H - 32;
        ctx.font = "11px Arial, sans-serif";
        for (const item of legend) {
            ctx.fillStyle   = item.color;
            ctx.strokeStyle = item.color;
            ctx.lineWidth   = 1.5;
            ctx.fillRect(lx, ly, 12, 12);
            ctx.fillStyle = "rgba(200,185,220,0.85)";
            ctx.textAlign = "left";
            ctx.fillText(item.label, lx + 16, ly + 10);
            lx += 80;
        }

        ctx.fillStyle = "#d4af37";
        ctx.font      = "11px Arial, sans-serif";
        ctx.textAlign = "right";
        ctx.fillText("Gold glow = available  ·  Click to move", MAP_W - 10, MAP_H - 14);
    }

    // ---- ARRIVAL MODAL ----------------------------------------

    _drawModal(node) {
        const meta = NODE_META[node.type] || {};
        const mw = 500, mh = 270;
        const mx = MAP_W / 2 - mw / 2;
        const my = MAP_H / 2 - mh / 2;

        ctx.fillStyle = "rgba(0,0,0,0.78)";
        ctx.fillRect(0, 0, MAP_W, MAP_H);

        // Panel — matches repo container style
        ctx.fillStyle   = "rgba(20,15,45,0.97)";
        ctx.strokeStyle = "#5a4128";
        ctx.lineWidth   = 4;
        this._roundRect(mx, my, mw, mh, 12);
        ctx.fill(); ctx.stroke();

        ctx.strokeStyle = "#3a2a1d";
        ctx.lineWidth   = 1;
        this._roundRect(mx + 8, my + 8, mw - 16, mh - 16, 8);
        ctx.stroke();

        ctx.fillStyle = "#e0b36d";
        ctx.font      = "bold 22px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(meta.title || node.type, MAP_W / 2, my + 46);

        ctx.strokeStyle = "rgba(90,65,40,0.6)";
        ctx.lineWidth   = 1;
        ctx.beginPath();
        ctx.moveTo(mx + 28, my + 58);
        ctx.lineTo(mx + mw - 28, my + 58);
        ctx.stroke();

        ctx.fillStyle = "#c0b0d8";
        ctx.font      = "14px Arial, sans-serif";
        ctx.textAlign = "center";
        for (let i = 0; i < (meta.desc || []).length; i++) {
            ctx.fillText(meta.desc[i], MAP_W / 2, my + 84 + i * 26);
        }

        if (meta.enemies && meta.enemies.length > 0) {
            ctx.fillStyle = "rgba(180,155,200,0.55)";
            ctx.font      = "12px Arial, sans-serif";
            ctx.fillText("Possible: " + meta.enemies.join(" or "), MAP_W / 2, my + mh - 66);
        }

        // Button — matches repo .back-button style
        const bw = 210, bh = 46;
        const bx = MAP_W / 2 - bw / 2;
        const by = my + mh - 58;
        this._modalBtnRect = { x: bx, y: by, w: bw, h: bh };

        ctx.fillStyle   = "#38435a";
        ctx.strokeStyle = "#5a4128";
        ctx.lineWidth   = 3;
        this._roundRect(bx, by, bw, bh, 10);
        ctx.fill(); ctx.stroke();

        ctx.fillStyle = "#e6c07b";
        ctx.font      = "bold 15px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("CONTINUE DESCENT", MAP_W / 2, by + 29);
    }

    _roundRect(x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.arcTo(x + w, y,     x + w, y + r,     r);
        ctx.lineTo(x + w, y + h - r);
        ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
        ctx.lineTo(x + r, y + h);
        ctx.arcTo(x,     y + h, x,     y + h - r, r);
        ctx.lineTo(x, y + r);
        ctx.arcTo(x,     y,     x + r, y,          r);
        ctx.closePath();
    }
}

// ============================================================
// MAIN LOOP
// ============================================================
let canvas, ctx;
let mapEngine;
let lastTime;

function tick(now) {
    if (!lastTime) lastTime = now;
    const dt = now - lastTime;
    lastTime = now;

    ctx.clearRect(0, 0, MAP_W, MAP_H);
    mapEngine.update(dt);
    mapEngine.draw();

    requestAnimationFrame(tick);
}

window.addEventListener("DOMContentLoaded", () => {
    canvas        = document.getElementById("mapCanvas");
    canvas.width  = MAP_W;
    canvas.height = MAP_H;
    ctx           = canvas.getContext("2d");

    loadSprites(() => {
        mapEngine = new MapEngine();
        requestAnimationFrame(tick);
    });
});
