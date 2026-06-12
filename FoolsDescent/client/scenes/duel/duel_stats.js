// Developed with assistance from Claude Code (Anthropic)

// timestamp taken at page load so we can measure how long the duel lasted
const duelStartMs = Date.now();

// sends the duel outcome and all tracked stats to the backend
async function sendDuelResult(game) {
    const won = game.enemyLives <= 0 && game.playerLives > 0;
    // subtract cards already used before this session so the count is per-duel only
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

// applies end-of-duel consequences: coins, deck changes, stats, then navigates away
async function finishDuel(game) {
    const won = game.enemyLives <= 0 && game.playerLives > 0;
    localStorage.setItem("duelWon", won ? "true" : "false");

    if (won) {
        const playerOwnsKing = game.kingOfPentaclesActive && game.kingOfPentaclesOwner === "player";
        const baseReward = game.enemyTier === "boss" ? 300 : 100;
        game.coins += playerOwnsKing ? baseReward * 2 : baseReward;
        if (game.pageOfPentaclesActive) {
            game.coins += 50;
            game.pageOfPentaclesActive = false;
        }
        const prev = parseInt(localStorage.getItem("playerCoins") || "0");
        localStorage.setItem("playerCoins", String(prev + game.coins));
    }

    if (!won) {
        await savePlayerDeckToDB([]); // GDD: lose all cards on death
    } else if (game.enemyTier === "boss") {
        const allCards = game.characterCards.map(c => c.cardIndex);
        await savePlayerDeckToDB(allCards);
    } else {
        // only keep cards that were not used this duel
        const remaining = game.characterCards
            .filter(c => c.visible !== false)
            .map(c => c.cardIndex);
        await savePlayerDeckToDB(remaining);
    }

    await sendDuelResult(game);
    game.coins = 0;
    await clearDuelCheckpoint();

    // 3.5 s lets the player read the result text before the redirect
    setTimeout(() => {
        if (won && game.enemyTier === "boss") {
            window.location.href = "../map/victory.html";
        } else {
            window.location.href = "../map/map.html";
        }
    }, 3500);
}
