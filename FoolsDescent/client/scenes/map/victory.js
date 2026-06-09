"use strict";

// Dealer's last words in red, followed by the narrator's closing lines
const dealerLines = [
    { text: "\"Impossible... No soul escapes my table...\"", dealer: true },
    { text: "\"The deck was rigged from the start... and still you won...\"", dealer: true },
];

const storyLines = [
    { text: "The Dealer's last card has been played.", dealer: false },
    { text: "Fate is yours to keep.", dealer: false },
    { text: "Your coins carry the weight of every choice you made.", dealer: false },
    { text: "The descent has ended.", dealer: false },
    { text: "But the Great Deck will be shuffled again.", dealer: false },
    { text: "Do you dare to descend once more?", dealer: false },
];

const allLines = [...dealerLines, ...storyLines];
const lineDelay = 2800;
const foolDelay = allLines.length * lineDelay - 2000;

const storyText = document.getElementById("storyText");
const foolCanvas = document.getElementById("foolCanvas");
const startButton = document.getElementById("startButton");
const actionButtons = document.getElementById("actionButtons");
const descentButton = document.getElementById("descentButton");
const menuButton = document.getElementById("menuButton");

const victorySound = new Audio("../../../assets/audio/BossSpeech.mov");
victorySound.volume = 0.5;

function addLine(text, isDealer) {
    const line = document.createElement("p");
    line.className = isDealer ? "dealer-line" : "story-line";
    line.textContent = text;
    storyText.appendChild(line);
}

function drawFool() {
    const ctx = foolCanvas.getContext("2d");
    const image = new Image();
    const cols = 3;
    const frame = 6;
    const frameW = 256;
    const frameH = 341.25;
    const sx = frame % cols * frameW;
    const sy = Math.floor(frame / cols) * frameH;

    image.onload = () => {
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, foolCanvas.width, foolCanvas.height);
        ctx.drawImage(image, sx, sy, frameW, frameH, 0, 0, foolCanvas.width, foolCanvas.height);
        foolCanvas.classList.add("visible");
    };

    image.src = "../../../assets/images/Sprite Fool Final.png";
}

function showActionButtons() {
    actionButtons.classList.add("visible");
}

function startVictory() {
    startButton.classList.add("hidden");
    victorySound.currentTime = 0;
    victorySound.play().catch(() => {});

    allLines.forEach((line, index) => {
        setTimeout(() => addLine(line.text, line.dealer), index * lineDelay);
    });

    setTimeout(drawFool, foolDelay);
    setTimeout(showActionButtons, allLines.length * lineDelay + 1200);
}

startButton.addEventListener("click", startVictory);

async function resetForNewDescent() {
    const userId = localStorage.getItem("userId");
    if (userId) {
        try {
            await fetch("http://localhost:3000/reset-deck", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: Number(userId) })
            });
        } catch (e) {}
        try {
            await fetch("http://localhost:3000/clear-duel-checkpoint", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: Number(userId) })
            });
        } catch (e) {}
    }
    localStorage.removeItem("pendingFight");
    localStorage.removeItem("duelWon");
    localStorage.removeItem("extraCards");
    localStorage.removeItem("pendingEnemyChoice");
    localStorage.setItem("continueRun", "false");
    localStorage.setItem("playerCoins", "0");
}

descentButton.addEventListener("click", async () => {
    victorySound.pause();
    await resetForNewDescent();
    window.location.href = "map.html";
});

menuButton.addEventListener("click", async () => {
    victorySound.pause();
    await resetForNewDescent();
    window.location.href = "../../frontend/menu.html";
});
