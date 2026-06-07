function formatTime(seconds) { // seconds -> "Xm Ys"
    const total = Math.round(seconds);
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return mins + "m " + secs + "s";
}

function roundOne(value) {
    return Math.round(value * 10) / 10;
}

async function loadPersonalStats() {
    const userId = localStorage.getItem("userId");
    const response = await fetch("http://localhost:3000/stats/personal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId })
    });
    const data = await response.json();
    if (!data.success) {
        return; // no duels played yet, leave the dashes
    }
    const s = data.stats;
    document.getElementById("personalPlayTime").textContent = formatTime(s.total_play_time);
    document.getElementById("personalDeaths").textContent = s.deaths;
    document.getElementById("personalEnemies").textContent = s.enemies_defeated;
    document.getElementById("personalVictories").textContent = s.victories;
    document.getElementById("personalCoins").textContent = "$" + s.coins_earned;
    document.getElementById("personalCards").textContent = s.cards_played;
}

async function loadGlobalStats() {
    const response = await fetch("http://localhost:3000/stats/global");
    const data = await response.json();
    if (!data.success) {
        return;
    }
    const s = data.stats;
    if (s.total_players === 0 || s.total_players === null) {
        return; // nobody has played yet
    }
    document.getElementById("globalPlayers").textContent = s.total_players;
    document.getElementById("globalPlayTime").textContent = formatTime(s.avg_play_time);
    document.getElementById("globalDeaths").textContent = roundOne(s.avg_deaths);
    document.getElementById("globalEnemies").textContent = s.total_enemies_defeated;
    document.getElementById("globalVictories").textContent = roundOne(s.avg_victories);
    document.getElementById("globalCoins").textContent = "$" + s.total_coins;
    document.getElementById("globalCards").textContent = s.total_cards_played;
}

loadPersonalStats();
loadGlobalStats();
