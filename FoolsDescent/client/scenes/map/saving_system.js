function saveMapLocally(game) {
    const key = "mapData_" + localStorage.getItem("userId");
    localStorage.setItem(key, JSON.stringify(game.getSaveData()));
}

function loadMapLocally(game) {
    const key = "mapData_" + localStorage.getItem("userId");
    const raw = localStorage.getItem(key);
    if (!raw) return false;
    game.loadSaveData(JSON.parse(raw));
    return true;
}

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
