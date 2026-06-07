"use strict";

const UPGRADE_BINDING = 0;
const UPGRADE_LIFE = 1;
const UPGRADE_CARD = 2;

const UPGRADE_FRAMES = [
    { sx: 43, sy: 0, sw: 418, sh: 552, dw: 78, dh: 78 }, // Card Binding
    { sx: 474, sy: 0, sw: 438, sh: 552, dw: 78, dh: 78 }, // Life Extension
    { sx: 929, sy: 0, sw: 414, sh: 552, dw: 78, dh: 78 }, // Extra Card
];

// matches the order of buildAllCards in game_cards.js so the index can be saved to localStorage
const ALL_CARDS = [
    { name: "The Magician", desc: "Repeats the effect of the last card you played." },
    { name: "The Chariot", desc: "Throws away the top card of the Great Deck." },
    { name: "Page of Pentacles", desc: "Win the next round for a 50 coin bonus." },
    { name: "The Star", desc: "Revives you with 1 life if you reach 0." },
    { name: "Strength", desc: "You cannot die in the next round." },
    { name: "Two of Pentacles", desc: "Draw two cards from the Great Deck, choose one." },
    { name: "The High Priestess", desc: "See the next card in the Great Deck." },
    { name: "The Hermit", desc: "Blocks the enemy's next turn." },
    { name: "Justice", desc: "If you lose a life next turn, so does the enemy." },
    { name: "Wheel of Fortune", desc: "Shuffles the Great Deck." },
    { name: "King of Pentacles", desc: "Doubles coins earned or lost at the end of the duel." },
    { name: "The Lovers", desc: "Permanently removes one Moon from the Great Deck." },
    { name: "The Hanged Man", desc: "Blocks the enemy from using cards next turn." },
    { name: "The Tower", desc: "Destroys half of the enemy's character cards." },
    { name: "The Devil", desc: "Gain 2 lives, but a Moon is added to the Great Deck." },
];

Game.prototype.drawUpgradePanel = function(ctx) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    let px = 350, py = 150, pw = 500, ph = 260;
    ctx.fillStyle = "#1a0a2e";
    ctx.strokeStyle = "#c0a060";
    ctx.lineWidth = 3;
    ctx.fillRect(px, py, pw, ph);
    ctx.strokeRect(px, py, pw, ph);

    ctx.textAlign = "center";
    ctx.font = "bold 26px Arial";
    ctx.fillStyle = "#f0d080";
    ctx.fillText(this.upgradeNames[this.currentUpgradeType], px + pw / 2, py + 60);

    let acceptX = px + 50, acceptY = py + 175;
    ctx.fillStyle = "#4a7a40";
    ctx.fillRect(acceptX, acceptY, 165, 40);
    ctx.strokeStyle = "#80cc60";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(acceptX, acceptY, 165, 40);
    ctx.font = "15px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Accept", acceptX + 82, acceptY + 26);

    let exitX = px + 285, exitY = py + 175;
    ctx.fillStyle = "#5a2020";
    ctx.fillRect(exitX, exitY, 165, 40);
    ctx.strokeStyle = "#cc6060";
    ctx.strokeRect(exitX, exitY, 165, 40);
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Exit Upgrade", exitX + 82, exitY + 26);
    this.acceptBtnRect = { x: acceptX, y: acceptY, w: 165, h: 40 };
    this.exitBtnRect = { x: exitX, y: exitY, w: 165, h: 40 };

    ctx.textAlign = "left";
    ctx.lineWidth = 1;
};

Game.prototype.checkUpgradeClick = function(mouseX, mouseY) {
    if (!this.exitBtnRect) return;
    let e = this.exitBtnRect;
    if (mouseX >= e.x && mouseX <= e.x + e.w && mouseY >= e.y && mouseY <= e.y + e.h) {
        this.upgradeOpen = false;
        return;
    }
    let a = this.acceptBtnRect;
    if (a && mouseX >= a.x && mouseX <= a.x + a.w && mouseY >= a.y && mouseY <= a.y + a.h) {
        this.acceptUpgrade();
    }
};

Game.prototype.acceptUpgrade = async function() {
    const userId = localStorage.getItem("userId");
    if (!userId) { this.upgradeOpen = false; return; }
    try {
        const res = await fetch("http://localhost:3000/player-upgrade", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: Number(userId), upgradeId: this.currentUpgradeType + 1 })
        });
        const data = await res.json();
        if (!data.success) {
            this.upgradeOpen = false;
            return; // not enough coins or server error
        }
        // keep local coins in sync
        const prev = parseInt(localStorage.getItem("playerCoins") || "0");
        const costs = [300, 400, 100]; // Card Binding, Life Extension, Extra Card
        localStorage.setItem("playerCoins", Math.max(0, prev - costs[this.currentUpgradeType]));
    } catch (e) {
        this.upgradeOpen = false;
        return;
    }
    this.upgradeOpen = false;
    if (this.currentUpgradeType === UPGRADE_CARD) {
        this.cardPickerOpen = true;
    }
};

Game.prototype.drawCardPicker = function(ctx) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.textAlign = "center";
    ctx.font = "bold 28px Arial";
    ctx.fillStyle = "#f0d080";
    ctx.fillText("Choose a Card", canvasWidth / 2, 55);

    let cellW = 208, cellH = 118, gapX = 13, gapY = 10;
    let startX = 54, startY = 80;
    this.cardCellRects = [];

    for (let i = 0; i < ALL_CARDS.length; i++) {
        let col = i % 5;
        let row = Math.floor(i / 5);
        let cx = startX + col * (cellW + gapX);
        let cy = startY + row * (cellH + gapY);

        ctx.fillStyle = "#1a0a2e";
        ctx.strokeStyle = "#c0a060";
        ctx.lineWidth = 1.5;
        ctx.fillRect(cx, cy, cellW, cellH);
        ctx.strokeRect(cx, cy, cellW, cellH);

        ctx.textAlign = "left";
        ctx.font = "bold 14px Arial";
        ctx.fillStyle = "#f0d080";
        ctx.fillText(ALL_CARDS[i].name, cx + 10, cy + 24);

        ctx.font = "12px Arial";
        ctx.fillStyle = "#cccccc";
        let words = ALL_CARDS[i].desc.split(" ");
        let line = "";
        let lineY = cy + 48;
        for (let w = 0; w < words.length; w++) {
            let test = line === "" ? words[w] : line + " " + words[w];
            if (ctx.measureText(test).width > cellW - 20) {
                ctx.fillText(line, cx + 10, lineY);
                lineY += 16;
                line = words[w];
            } else {
                line = test;
            }
        }
        ctx.fillText(line, cx + 10, lineY);

        this.cardCellRects.push({ x: cx, y: cy, w: cellW, h: cellH });
    }

    let backY = startY + 3 * (cellH + gapY) - gapY + 18;
    let backX = canvasWidth / 2 - 80;
    ctx.fillStyle = "#5a2020";
    ctx.fillRect(backX, backY, 160, 36);
    ctx.strokeStyle = "#cc6060";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(backX, backY, 160, 36);
    ctx.textAlign = "center";
    ctx.font = "15px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Back", canvasWidth / 2, backY + 24);
    this.cardBackRect = { x: backX, y: backY, w: 160, h: 36 };

    ctx.textAlign = "left";
    ctx.lineWidth = 1;
};

Game.prototype.checkCardPickerClick = function(mouseX, mouseY) {
    let b = this.cardBackRect;
    if (mouseX >= b.x && mouseX <= b.x + b.w && mouseY >= b.y && mouseY <= b.y + b.h) {
        this.cardPickerOpen = false;
        return;
    }
    for (let i = 0; i < this.cardCellRects.length; i++) {
        let c = this.cardCellRects[i];
        if (mouseX >= c.x && mouseX <= c.x + c.w && mouseY >= c.y && mouseY <= c.y + c.h) {
            this.pickCard(i);
            return;
        }
    }
};

Game.prototype.pickCard = function(cardIndex) {
    let cards = localStorage.getItem("extraCards");
    localStorage.setItem("extraCards", cards ? cards + "," + cardIndex : "" + cardIndex);
    this.cardPickerOpen = false;
};
