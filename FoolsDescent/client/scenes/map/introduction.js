"use strict";

// Developed with assistance from Claude Code (Anthropic)

const storyLines = [
    "Not so long ago, there was only The Dealer and the Great Deck.",
    "Every life, love, death and heartbeat was shuffled into place.",
    "Then The Dealer grew bored.",
    "He scattered fate across the mortal plane like cards in the wind.",
    "You are The Fool, the only born soul without an assigned future.",
    "To keep your right to exist, you must descend and face fate at its own table."
];

const lineDelay = 2800;
const foolDelay = 11000;
const storyText = document.getElementById("storyText");
const foolCanvas = document.getElementById("foolCanvas");
const startButton = document.getElementById("startButton");
const doneButton = document.getElementById("doneButton");
const bossSpeech = new Audio("../../../assets/audio/BossSpeech.mov");

bossSpeech.volume = 0.8;

// appends a paragraph to the story text area
function addStoryLine(text) {
    const line = document.createElement("p");
    line.className = "story-line";
    line.textContent = text;
    storyText.appendChild(line);
}

// draws the Fool's front-facing idle frame (frame 6) on the canvas overlay
function drawFool() {
    const ctx = foolCanvas.getContext("2d");
    const image = new Image();
    const cols = 3;
    const frame = 6; // front-facing idle frame in the spritesheet
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

function showDoneButton() {
    doneButton.classList.add("visible");
}

// plays through the intro narration then shows the done button
function startIntroduction() {
    startButton.classList.add("hidden");
    bossSpeech.currentTime = 0;
    bossSpeech.play().catch(() => {});

    storyLines.forEach((line, index) => {
        setTimeout(() => addStoryLine(line), index * lineDelay);
    });

    setTimeout(drawFool, foolDelay);
    setTimeout(showDoneButton, storyLines.length * lineDelay + 1200);
}

startButton.addEventListener("click", startIntroduction);

doneButton.addEventListener("click", () => {
    bossSpeech.pause();
    window.location.href = "map.html";
});
