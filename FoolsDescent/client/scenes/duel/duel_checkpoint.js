// Developed with assistance from Claude Code (Anthropic)
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
        playerCardVisible: game.characterCards.map(c => c.visible !== false),
        enemyCardIndices: game.enemyCharacterCards.map(c => c.cardIndex),
        enemyCardVisible: game.enemyCharacterCards.map(c => c.visible !== false),
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
    game.personalPlayerCardIndices = (snap.personalPlayerCardIndices || []).slice();
    game.availablePlayerCardIndices = (snap.availablePlayerCardIndices || []).slice();
    game.difficultyCardPoolIndices = (snap.difficultyCardPoolIndices || []).slice();
    const playerCards = snap.playerCardIndices.map((cardIdx, pos) => {
        const entry = game.buildCharacterCardEntry(game.allCards[cardIdx], cardIdx);
        if (snap.playerCardVisible && snap.playerCardVisible[pos] === false) {
            entry.visible = false;
        }
        return entry;
    });
    game.repositionCardsArray(playerCards);
    game.characterCards = playerCards;
    const enemyCards = snap.enemyCardIndices.map((cardIdx, pos) => {
        const card = game.buildCharacterCardEntry(game.allCards[cardIdx], cardIdx);
        card.object.size.x = 50;
        card.object.size.y = 90;
        if (snap.enemyCardVisible && snap.enemyCardVisible[pos] === false) {
            card.visible = false;
        }
        return card;
    });
    game.enemyCharacterCards = enemyCards;
    game.repositionEnemyCards();
    game.showStartButton = false;
    game.hasDealerIntro = false;
    game.showDealerIntro = false;
    game.showPlayerCards = true;
    game.showEnemyCards = true;
    game.updatePlayerCandles();
    game.updateEnemyCandles();
    // offset already-played cards so duel_stats doesn't count them as played this session
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

async function loadPlayerUpgrades(game) {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    try {
        const res = await fetch(`http://localhost:3000/player-upgrades/${userId}`);
        const data = await res.json();
        if (!data.success) return;
        const lifeExtCount = data.upgrades.filter(u => u.upgrade_id === 2).length;
        const bonus = Math.min(lifeExtCount, 6 - game.playerLives);
        if (bonus > 0) {
            game.playerLives = Math.min(6, game.playerLives + bonus);
            game.updatePlayerCandles();
        }
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

    const dealCount = 0;// NO DAR CARTAS AL PRINCIPIO, PARA AGREGAR DIFICULTAD NO MOVER!!!!
    const pool = game.difficultyCardPoolIndices.slice().sort(() => Math.random() - 0.5);
    const dealt = pool.slice(0, dealCount)
        .filter(i => game.allCards[i])
        .map(i => game.buildCharacterCardEntry(game.allCards[i], i));
    game.characterCards = [...game.characterCards, ...dealt];
    game.repositionCardsArray(game.characterCards);

}

async function applyExtraCards(game) {
    const extraCardsStr = localStorage.getItem("extraCards");
    if (!extraCardsStr) return;
    const existingIndices = new Set(game.characterCards.map(c => c.cardIndex));
    const toAdd = extraCardsStr.split(",").map(Number)
        .filter(i => game.allCards[i] && !existingIndices.has(i));
    if (toAdd.length > 0) {
        const extras = toAdd.map(i => game.buildCharacterCardEntry(game.allCards[i], i));
        game.characterCards = [...game.characterCards, ...extras];
        game.repositionCardsArray(game.characterCards);
    }
    localStorage.removeItem("extraCards");
}
