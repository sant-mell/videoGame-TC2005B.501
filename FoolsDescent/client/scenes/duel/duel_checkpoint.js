"use strict";

function getDuelSnapshot(game) {
    return {
        enemyLives: game.enemyLives,
        playerLives: game.playerLives,
        currentTurn: game.currentTurn,
        chooseEnemy: game.chooseEnemy,
        enemyName: game.enemyName,
        coins: game.coins,
        greatDeck: game.greatDeck.slice(),
        sunCount: game.sunCount,
        moonCount: game.moonCount,
        playerCardIndices: game.characterCards.map(c => c.cardIndex),
        enemyCardIndices: game.enemyCharacterCards.map(c => c.cardIndex),
        personalPlayerCardIndices: Array.isArray(game.personalPlayerCardIndices)
            ? game.personalPlayerCardIndices.slice() : [],
        availablePlayerCardIndices: Array.isArray(game.availablePlayerCardIndices)
            ? game.availablePlayerCardIndices.slice() : [],
        difficultyCardPoolIndices: Array.isArray(game.difficultyCardPoolIndices)
            ? game.difficultyCardPoolIndices.slice() : [],
        pageOfPentaclesActive: game.pageOfPentaclesActive,
        kingOfPentaclesActive: game.kingOfPentaclesActive,
        kingOfPentaclesOwner: game.kingOfPentaclesOwner,
        playerStarActive: game.playerStarActive,
        enemyStarActive: game.enemyStarActive,
        playerStrengthActive: game.playerStrengthActive,
        enemyStrengthActive: game.enemyStrengthActive,
        playerJusticeActive: game.playerJusticeActive,
        enemyJusticeActive: game.enemyJusticeActive,
        enemyTurnBlocked: game.enemyTurnBlocked,
        playerTurnBlocked: game.playerTurnBlocked,
        enemyHandBlocked: game.enemyHandBlocked,
        playerHandBlocked: game.playerHandBlocked,
        loversRemovedMoon: game.loversRemovedMoon || false,
        lastPlayedName: game.lastPlayedName,
    };
}

function restoreDuelSnapshot(game, snap) {
    game.enemyLives = snap.enemyLives;
    game.playerLives = snap.playerLives;
    game.currentTurn = snap.currentTurn;
    game.chooseEnemy = snap.chooseEnemy;
    game.enemyName = snap.enemyName;
    game.coins = snap.coins;
    game.greatDeck = snap.greatDeck.slice();
    game.sunCount = snap.sunCount;
    game.moonCount = snap.moonCount;
    game.loversRemovedMoon = snap.loversRemovedMoon;
    game.lastPlayedName = snap.lastPlayedName;
    game.pageOfPentaclesActive = snap.pageOfPentaclesActive;
    game.kingOfPentaclesActive = snap.kingOfPentaclesActive;
    game.kingOfPentaclesOwner = snap.kingOfPentaclesOwner || "";
    game.playerStarActive = snap.playerStarActive;
    game.enemyStarActive = snap.enemyStarActive;
    game.playerStrengthActive = snap.playerStrengthActive;
    game.enemyStrengthActive = snap.enemyStrengthActive;
    game.playerJusticeActive = snap.playerJusticeActive;
    game.enemyJusticeActive = snap.enemyJusticeActive;
    game.enemyTurnBlocked = snap.enemyTurnBlocked;
    game.playerTurnBlocked = snap.playerTurnBlocked;
    game.enemyHandBlocked = snap.enemyHandBlocked;
    game.playerHandBlocked = snap.playerHandBlocked;
    game.personalPlayerCardIndices = snap.personalPlayerCardIndices.slice();
    game.availablePlayerCardIndices = snap.availablePlayerCardIndices.slice();
    game.difficultyCardPoolIndices = snap.difficultyCardPoolIndices.slice();
    const playerCards = snap.playerCardIndices.map(i =>
        game.buildCharacterCardEntry(game.allCards[i], i)
    );
    game.repositionCardsArray(playerCards);
    game.characterCards = playerCards;
    const enemyCards = snap.enemyCardIndices.map(i => {
        const card = game.buildCharacterCardEntry(game.allCards[i], i);
        card.object.size.x = 50;
        card.object.size.y = 90;
        return card;
    });
    game.enemyCharacterCards = enemyCards;
    game.repositionEnemyCards();
    game.showStartButton = false;
    game.hasDealerIntro = false;
    game.showDealerIntro = false;
    game.currentTurn = "player";
    game.showPlayerCards = true;
    game.showEnemyCards = true;
    game.updatePlayerCandles();
    game.updateEnemyCandles();
    // cards are rebuilt visible above, so offset is 0, but set it explicitly for safety
    game.cardsPlayedOffset = game.characterCards.filter(c => c.visible === false).length;
}

async function saveDuelCheckpoint(game) {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    const snapshot = getDuelSnapshot(game);
    try {
        await fetch("http://localhost:3000/duel-checkpoint", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: Number(userId), duelData: snapshot })
        });
    } catch (e) {
        console.error(e);
    }
}

async function loadDuelCheckpoint(game) {
    const userId = localStorage.getItem("userId");
    if (!userId) return false;
    try {
        const res = await fetch(`http://localhost:3000/duel-checkpoint/${userId}`);
        const data = await res.json();
        if (data.success && data.duelData) {
            restoreDuelSnapshot(game, data.duelData);
            return true;
        }
    } catch (e) {
        console.error(e);
    }
    return false;
}

async function clearDuelCheckpoint() {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    try {
        await fetch("http://localhost:3000/clear-duel-checkpoint", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: Number(userId) })
        });
    } catch (e) {
        console.error(e);
    }
}

async function savePlayerDeckToDB(cardIndices) {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    try {
        await fetch("http://localhost:3000/player-deck", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: Number(userId), cards: cardIndices })
        });
    } catch (e) {
        console.error(e);
    }
}

async function loadPlayerDeck(game) {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    try {
        const res = await fetch(`http://localhost:3000/player-deck/${userId}`);
        const data = await res.json();
        if (data.success && data.cards.length > 0) {
            const oldPersonal = new Set(game.personalPlayerCardIndices);
            game.personalPlayerCardIndices = data.cards.slice();
            // Keep pool-awarded cards, replace only the personal-hand entries
            const poolCards = game.characterCards.filter(c => !oldPersonal.has(c.cardIndex));
            const personalCards = data.cards
                .filter(i => game.allCards[i])
                .map(i => game.buildCharacterCardEntry(game.allCards[i], i));
            game.characterCards = [...personalCards, ...poolCards];
            game.repositionCardsArray(game.characterCards);
        }
    } catch (e) {
        console.error(e);
    }

    // GDD: 3 cards for common, 4 rare, 5 epic, 6 legendary
    const tierCounts = { common: 3, rare: 4, epic: 5, boss: 6 };
    const dealCount = tierCounts[game.enemyTier] || 3;
    const pool = game.difficultyCardPoolIndices.slice().sort(() => Math.random() - 0.5);
    const dealt = pool.slice(0, dealCount)
        .filter(i => game.allCards[i])
        .map(i => game.buildCharacterCardEntry(game.allCards[i], i));
    game.characterCards = [...game.characterCards, ...dealt];
    game.repositionCardsArray(game.characterCards);

    // Extra card picked from map upgrade node (consumed once then cleared)
    const extraCardsStr = localStorage.getItem("extraCards");
    if (extraCardsStr) {
        const extras = extraCardsStr.split(",").map(Number)
            .filter(i => game.allCards[i])
            .map(i => game.buildCharacterCardEntry(game.allCards[i], i));
        game.characterCards = [...game.characterCards, ...extras];
        game.repositionCardsArray(game.characterCards);
        localStorage.removeItem("extraCards");
    }
}
