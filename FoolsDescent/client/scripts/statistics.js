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
    if (!userId) return;
    try {
        const response = await fetch("http://localhost:3000/stats/current-run", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: userId })
        });
        const data = await response.json();
        if (!data.success) return;
        const s = data.stats;
        document.getElementById("personalPlayTime").textContent = formatTime(s.total_play_time || 0);
        document.getElementById("personalDeaths").textContent = s.deaths || 0;
        document.getElementById("personalEnemies").textContent = s.enemies_defeated || 0;
        document.getElementById("personalVictories").textContent = s.victories || 0;
        document.getElementById("personalCoins").textContent = "$" + (s.coins_earned || 0);
        document.getElementById("personalCards").textContent = s.cards_played || 0;
    } catch (err) {}
}

async function loadGlobalStats() {
    try {
        const response = await fetch("http://localhost:3000/stats/global");
        const data = await response.json();
        if (!data.success) return;
        const s = data.stats;
        if (!s || !s.total_players) return;
        document.getElementById("globalPlayers").textContent = s.total_players;
        document.getElementById("globalPlayTime").textContent = formatTime(s.avg_play_time || 0);
        document.getElementById("globalDeaths").textContent = roundOne(s.avg_deaths || 0);
        document.getElementById("globalEnemies").textContent = s.total_enemies_defeated || 0;
        document.getElementById("globalVictories").textContent = roundOne(s.avg_victories || 0);
        document.getElementById("globalCoins").textContent = "$" + (s.total_coins || 0);
        document.getElementById("globalCards").textContent = s.total_cards_played || 0;
    } catch (err) {}
}

loadPersonalStats();
loadGlobalStats();
