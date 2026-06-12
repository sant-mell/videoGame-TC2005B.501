// Developed with assistance from Claude Code (Anthropic)

// writes map state to localStorage as a quick backup in case the DB is unavailable
function saveMapLocally(game) {
    const key = "mapData_" + localStorage.getItem("userId");
    localStorage.setItem(key, JSON.stringify(game.getSaveData()));
}

// restores map state from localStorage; returns false if no backup exists
function loadMapLocally(game) {
    const key = "mapData_" + localStorage.getItem("userId");
    const raw = localStorage.getItem(key);
    if (!raw) return false;
    game.loadSaveData(JSON.parse(raw));
    return true;
}

// creates a new descent record in the DB and writes a local backup
async function saveNewDescent(game) {
    saveMapLocally(game);
    const saveData = game.getSaveData();
    try {
        const response = await fetch("http://localhost:3000/new-descent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: localStorage.getItem("userId"),
                mapData: saveData
            })
        });
        return response.ok;
    } catch (err) {
        console.error(err);
        return false;
    }
}

// saves the current node position and map state; called every time the fool arrives at a node
async function saveProgress(game) {
    saveMapLocally(game);
    const saveData = game.getSaveData();
    try {
        const response = await fetch("http://localhost:3000/save-progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: localStorage.getItem("userId"),
                currentMapPosition: saveData.currentId || 0,
                mapData: saveData
            })
        });
        return response.ok;
    } catch (err) {
        console.error(err);
        return false;
    }
}

// called from the map to wipe a stale duel checkpoint (e.g. when the player backed out mid-duel)
async function clearDuelCheckpointFromMap() {
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

// loads the player's saved descent from the DB; returns true if data was found
async function loadGame(game) {
    try {
        const response = await fetch("http://localhost:3000/load-game", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: localStorage.getItem("userId")
            })
        });
        const data = await response.json();
        if (data.success) {
            game.loadSaveData(data.saveData.mapData);
            localStorage.setItem("playerCoins", data.saveData.currentCoins || 0);
            return true;
        }
        return false;
    } catch (err) {
        console.error(err);
        return false;
    }
}
