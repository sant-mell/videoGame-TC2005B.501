// records play time from page load until the duel ends
const duelStartMs = Date.now();

async function sendDuelResult(game) {
    const won = game.enemyLives <= 0 && game.playerLives > 0;
    // ignore cards that were already used before this session started
    const cardsPlayed = game.characterCards.filter(c => c.visible === false).length - (game.cardsPlayedOffset || 0);
    const durationSec = Math.round((Date.now() - duelStartMs) / 1000);
    const greatDeck = Array.isArray(game.greatDeck) ? game.greatDeck.join(",") : "";
    try {
        const response = await fetch("http://localhost:3000/duel-result", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: localStorage.getItem("userId"),
                won: won,
                enemyTier: game.enemyTier,
                enemyName: game.enemyName,
                coinsGained: game.coins,
                kingOfPentaclesActive: (game.kingOfPentaclesActive && game.kingOfPentaclesOwner === "player") || false,
                cardsPlayed: cardsPlayed,
                durationSec: durationSec,
                greatDeck: greatDeck
            })
        });
        const data = await response.json();
        return data.success === true;
    } catch (err) {
        return false;
    }
}

async function finishDuel(game) {
    const won = game.enemyLives <= 0 && game.playerLives > 0;
    localStorage.setItem("duelWon", won ? "true" : "false");
    if (won) {
        const playerOwnsKing = game.kingOfPentaclesActive && game.kingOfPentaclesOwner === "player";
        game.coins += playerOwnsKing ? 200 : 100;
        const prev = parseInt(localStorage.getItem("playerCoins") || "0");
        localStorage.setItem("playerCoins", String(prev + game.coins));
    }
    if (!won) {
        await savePlayerDeckToDB([]); // lose all cards on death (GDD)
    } else {
        // save cards still in hand so they carry into the next duel
        const remaining = game.characterCards
            .filter(c => c.visible !== false)
            .map(c => c.cardIndex);
        await savePlayerDeckToDB(remaining);
    }
    await sendDuelResult(game);
    await clearDuelCheckpoint();
    // give the player a moment to read the win/lose message, then go back to the map
    setTimeout(() => {
        if (won && game.enemyTier === "boss") {
            window.location.href = "../map/victory.html";
        } else {
            window.location.href = "../map/map.html";
        }
    }, 3500);
}
