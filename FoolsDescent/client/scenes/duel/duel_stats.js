// records play time from page load until the duel ends
const duelStartMs = Date.now();

async function sendDuelResult(game) { // reports one finished duel to the server
    const won = game.enemyLives <= 0;
    const cardsPlayed = game.characterCards.filter(c => c.visible === false).length;
    const durationSec = Math.round((Date.now() - duelStartMs) / 1000);
    try {
        const response = await fetch("http://localhost:3000/duel-result", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: localStorage.getItem("userId"),
                won: won,
                enemyTier: game.enemyTier,
                coinsGained: game.coins,
                cardsPlayed: cardsPlayed,
                durationSec: durationSec
            })
        });
        return response.ok;
    } catch (err) {
        return false;
    }
}

function finishDuel(game) { // records the result, then returns to the map to apply it
    const won = game.enemyLives <= 0;
    localStorage.setItem("duelWon", won ? "true" : "false");
    sendDuelResult(game);
    // give the player a moment to read the win/lose message, then go back to the map
    setTimeout(() => {
        window.location.href = "../map/map.html";
    }, 3500);
}
