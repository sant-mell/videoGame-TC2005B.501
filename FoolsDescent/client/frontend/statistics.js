const BASE = "http://localhost:3000";

// helpers

function fmtTime(seconds) {
    if (!seconds || seconds === 0) return "0m";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
}

function fmtNum(n) {
    return Number(n || 0).toLocaleString();
}

function fmtAvg(n) {
    return Number(n || 0).toFixed(1);
}

function el(id) { return document.getElementById(id); }

// chart colors (hex - canvas can't resolve CSS vars)

const C = {
    purple:    "#7f77dd",
    gold:      "#c9a84c",
    coral:     "#d85a30",
    teal:      "#1d9e75",
    tealLight: "#5dcaa5",
    pink:      "#d4537e",
    blue:      "#378add",
    muted:     "rgba(176,160,192,0.28)",
    gridLine:  "rgba(255,255,255,0.07)",
    tick:      "#9080a8",
};

const BASE_OPTS = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
        x: { ticks: { color: C.tick, font: { size: 11 }, maxRotation: 35 }, grid: { color: C.gridLine } },
        y: { ticks: { color: C.tick, font: { size: 11 } }, grid: { color: C.gridLine }, beginAtZero: true }
    }
};

// Doughnut fix: Chart.js renders nothing when all values are 0
function makeDoughnut(canvasId, labels, data, colors) {
    const canvas = el(canvasId);
    if (!canvas) return;
    const allZero = data.every(v => v === 0);
    new Chart(canvas, {
        type: "doughnut",
        data: {
            labels,
            datasets: [{
                data: allZero ? data.map((_, i) => i === 0 ? 1 : 0) : data,
                backgroundColor: allZero ? ["rgba(100,80,120,0.25)", "transparent"] : colors,
                borderWidth: 0,
                hoverOffset: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "65%",
            plugins: {
                legend: { display: false },
                tooltip: { filter: () => !allZero }
            }
        }
    });
}

// summary tables

async function fillSummaryTables() {
    const userId = localStorage.getItem("userId");

    try {
        const g = (await (await fetch(`${BASE}/stats/global`)).json()).stats || {};
        el("globalPlayers").textContent   = fmtNum(g.total_players);
        el("globalPlayTime").textContent  = fmtTime(g.avg_play_time);
        el("globalDeaths").textContent    = fmtAvg(g.avg_deaths);
        el("globalEnemies").textContent   = fmtNum(g.total_enemies_defeated);
        el("globalVictories").textContent = fmtAvg(g.avg_victories);
        el("globalCoins").textContent     = fmtNum(g.total_coins);
        el("globalCards").textContent     = fmtNum(g.total_cards_played);
    } catch (e) { console.error(e); }

    if (!userId) {
        document.querySelectorAll(
            "#personalPlayTime,#personalDeaths,#personalEnemies,#personalVictories,#personalCoins,#personalCards"
        ).forEach(n => n.textContent = "—");
        return;
    }

    try {
        const res  = await fetch(`${BASE}/stats/personal`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: Number(userId) })
        });
        const p = (await res.json()).stats || {};
        el("personalPlayTime").textContent  = fmtTime(p.total_play_time);
        el("personalDeaths").textContent    = fmtNum(p.deaths);
        el("personalEnemies").textContent   = fmtNum(p.enemies_defeated);
        el("personalVictories").textContent = fmtNum(p.victories);
        el("personalCoins").textContent     = fmtNum(p.coins_earned);
        el("personalCards").textContent     = fmtNum(p.cards_played);
    } catch (e) { console.error(e); }
}

// leaderboards

async function fillLeaderboards() {
    const me = localStorage.getItem("username") || "";

    const render = (id, rows, key) => {
        const wrap = el(id);
        if (!wrap || !rows?.length) return;
        wrap.innerHTML = rows.map((r, i) => {
            const isMe = me && r.username === me;
            const rank = `#${i + 1}`;
            return `<div class="lb-row${isMe ? " lb-me" : ""}">
                <span class="lb-rank">${rank}</span>
                <span class="lb-name">${r.username}</span>
                <span class="lb-val">${fmtNum(r[key])}</span>
            </div>`;
        }).join("");
    };

    try {
        const [vD, cD] = await Promise.all([
            fetch(`${BASE}/stats/leaderboard/victories`).then(r => r.json()),
            fetch(`${BASE}/stats/leaderboard/coins`).then(r => r.json())
        ]);
        if (vD.success) render("leaderboard-victories", vD.leaderboard, "victories");
        if (cD.success) render("leaderboard-coins",     cD.leaderboard, "coins_earned");
    } catch (e) { console.error(e); }
}

// personal chart P1: victories vs deaths

async function chartP_WinLoss(userId) {
    try {
        const res  = await fetch(`${BASE}/stats/personal`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: Number(userId) })
        });
        const p = (await res.json()).stats || {};
        const vic    = Number(p.victories      || 0);
        const deaths = Number(p.deaths         || 0);
        const enems  = Number(p.enemies_defeated || 0);

        el("p-stat-vic").textContent    = fmtNum(vic);
        el("p-stat-deaths").textContent = fmtNum(deaths);
        el("p-stat-enems").textContent  = fmtNum(enems);

        makeDoughnut("chart-p-winloss", ["Victories", "Deaths"], [vic, deaths], [C.teal, C.coral]);
    } catch (e) { console.error(e); }
}

// personal P2: last run summary

async function fillCurrentRun(userId) {
    try {
        const json = await fetch(`${BASE}/stats/current-run`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: Number(userId) })
        }).then(r => r.json());

        const wrap = el("current-run-panel");
        if (!wrap) return;
        if (!json.success || !json.stats) {
            wrap.innerHTML = `<p style="color:#6a5080;font-size:0.85rem">No runs found yet.</p>`;
            return;
        }

        const s = json.stats;
        const isVictory = s.result === "victory";
        const isOngoing = s.result === "ongoing";

        const resultColor = isVictory ? C.teal : isOngoing ? C.gold : C.coral;
        const resultLabel = isVictory ? "Victory" : isOngoing ? "Ongoing" : "Defeat";

        wrap.innerHTML = `
            <div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:1rem;">
                <span style="font-size:0.78rem;font-weight:700;letter-spacing:0.1em;
                             color:${resultColor};text-transform:uppercase;">${resultLabel}</span>
            </div>
            <table class="stats-table">
                <tbody>
                    <tr><td>Enemies Defeated</td><td>${fmtNum(s.enemies_defeated)}</td></tr>
                    <tr><td>Deaths</td>          <td>${fmtNum(s.deaths)}</td></tr>
                    <tr><td>Coins Earned</td>    <td>${fmtNum(s.coins_earned)}</td></tr>
                    <tr><td>Cards Played</td>    <td>${fmtNum(s.cards_played)}</td></tr>
                    <tr><td>Duration</td>        <td>${fmtTime(s.total_play_time)}</td></tr>
                </tbody>
            </table>`;
    } catch (e) { console.error(e); }
}

// global chart P3: enemy win rates

async function chartP_EnemyWinrate() {
    try {
        const json = await fetch(`${BASE}/stats/enemy-winrate`).then(r => r.json());
        if (!json.success || !json.data?.length) return;

        const rows   = json.data.slice(0, 8);
        const labels = rows.map(r => r.enemy_name);
        const data   = rows.map(r => Number(r.win_rate_pct || 0));
        const colors = data.map(v => v >= 50 ? C.teal : C.coral);

        new Chart(el("chart-p-enemy"), {
            type: "bar",
            data: { labels, datasets: [{ label: "Win %", data, backgroundColor: colors,
                borderRadius: 4, borderSkipped: false }] },
            options: { ...BASE_OPTS,
                scales: { ...BASE_OPTS.scales,
                    y: { ...BASE_OPTS.scales.y, max: 100,
                         ticks: { color: C.tick, font: { size: 11 }, callback: v => `${v}%` } } },
                plugins: { legend: { display: false },
                    tooltip: { callbacks: { label: ctx =>
                        `${ctx.parsed.y}% · fought ${rows[ctx.dataIndex].times_fought}×` } } } }
        });
    } catch (e) { console.error(e); }
}

// personal chart P4: deck rarity + card table

async function chartP_Deck(userId) {
    try {
        const json = await fetch(`${BASE}/stats/my-deck`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: Number(userId) })
        }).then(r => r.json());

        const rows = json.data || [];
        const rarColors = { legendary: C.gold, rare: C.purple, common: C.blue };

        const counts = {};
        for (const row of rows) {
            const rar = (row.rarity || "Common").toLowerCase();
            counts[rar] = (counts[rar] || 0) + Number(row.card_num || 1);
        }
        const rarOrder = ["legendary", "rare", "common"];
        const labels = rarOrder.filter(r => counts[r]);
        const data   = labels.map(r => counts[r]);
        const colors = labels.map(r => rarColors[r]);
        const totalUnique = rows.length;

        const totalEl = el("p-deck-total");
        if (totalEl) totalEl.textContent = fmtNum(totalUnique);

        makeDoughnut("chart-p-deck-rarity",
            labels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
            data, colors);

        const tbody = el("deck-table-body");
        if (!tbody) return;
        if (!rows.length) {
            tbody.innerHTML = `<tr><td colspan="3" style="color:#6a5080">No cards yet.</td></tr>`;
            return;
        }
        tbody.innerHTML = rows.map(r => {
            const col = rarColors[(r.rarity || "common").toLowerCase()] || C.tick;
            return `<tr>
                <td>${r.card_name}</td>
                <td><span style="color:${col};font-weight:600">${r.rarity}</span></td>
                <td style="text-align:right">${r.card_num}</td>
            </tr>`;
        }).join("");
    } catch (e) { console.error(e); }
}

// personal P5: upgrades list

async function fillPersonalUpgrades(userId) {
    try {
        const json = await fetch(`${BASE}/stats/my-upgrades`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: Number(userId) })
        }).then(r => r.json());

        const wrap = el("personal-upgrades-list");
        if (!wrap) return;
        if (!json.success || !json.data?.length) {
            wrap.innerHTML = `<p style="color:#6a5080;font-size:0.85rem">No upgrades purchased yet.</p>`;
            return;
        }
        wrap.innerHTML = json.data.map(u => `
            <div class="upgrade-row">
                <span class="upgrade-name">${u.upgrade_name}</span>
                <span class="upgrade-cost">${fmtNum(u.cost)} coins</span>
            </div>`).join("");
    } catch (e) { console.error(e); }
}

// global chart G1: leaderboard victories

async function chartG_Victories() {
    try {
        const json = await fetch(`${BASE}/stats/leaderboard/victories`).then(r => r.json());
        if (!json.success || !json.leaderboard?.length) return;
        const me     = localStorage.getItem("username") || "";
        const rows   = json.leaderboard;
        const labels = rows.map(r => r.username);
        const data   = rows.map(r => Number(r.victories));
        const colors = rows.map(r => r.username === me ? C.gold : C.purple);

        new Chart(el("chart-g-victories"), {
            type: "bar",
            data: { labels, datasets: [{ label: "Victories", data, backgroundColor: colors,
                borderRadius: 4, borderSkipped: false }] },
            options: { ...BASE_OPTS }
        });
    } catch (e) { console.error(e); }
}

// global chart G2: difficulty win % + times fought

async function chartG_Difficulty() {
    try {
        const json = await fetch(`${BASE}/stats/difficulty-winrate`).then(r => r.json());
        if (!json.success || !json.data?.length) return;

        const rows   = json.data;
        const labels = rows.map(r => r.difficulty_tier);
        const pcts   = rows.map(r => Number(r.win_rate_pct || 0));
        const fought = rows.map(r => Number(r.times_fought));

        new Chart(el("chart-g-difficulty"), {
            type: "bar",
            data: { labels, datasets: [
                { label: "Win %",        data: pcts,   backgroundColor: C.teal,  borderRadius: 4, borderSkipped: false, yAxisID: "y"  },
                { label: "Times fought", data: fought, backgroundColor: C.muted, borderRadius: 4, borderSkipped: false, yAxisID: "y2" }
            ]},
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x:  { ticks: { color: C.tick, font: { size: 12 } }, grid: { color: C.gridLine } },
                    y:  { position: "left",  beginAtZero: true, max: 100,
                          ticks: { color: C.teal, callback: v => `${v}%` }, grid: { color: C.gridLine } },
                    y2: { position: "right", beginAtZero: true,
                          ticks: { color: C.tick }, grid: { drawOnChartArea: false } }
                }
            }
        });

        const tbody = el("difficulty-table-body");
        if (tbody) tbody.innerHTML = rows.map(r =>
            `<tr><td>${r.difficulty_tier}</td><td>${fmtNum(r.times_fought)}</td>
             <td>${fmtNum(r.times_defeated)}</td><td>${r.win_rate_pct ?? "—"}%</td></tr>`
        ).join("");
    } catch (e) { console.error(e); }
}

// global chart G3: card popularity

async function chartG_Cards() {
    try {
        const json = await fetch(`${BASE}/stats/card-popularity`).then(r => r.json());
        if (!json.success || !json.data?.length) return;

        const rows   = json.data.slice(0, 10);
        const labels = rows.map(r => r.card_name);
        const owners = rows.map(r => Number(r.owners));
        const copies = rows.map(r => Number(r.total_copies));
        const colors = rows.map(r => {
            const rar = (r.rarity || "").toLowerCase();
            if (rar === "legendary") return C.gold;
            if (rar === "rare")      return C.purple;
            return C.blue;
        });

        new Chart(el("chart-g-cards"), {
            type: "bar",
            data: { labels, datasets: [
                { label: "Players who own it", data: owners, backgroundColor: colors, borderRadius: 4, borderSkipped: false },
                { label: "Total copies",       data: copies, backgroundColor: C.muted, borderRadius: 4, borderSkipped: false }
            ]},
            options: {
                indexAxis: "y", responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: C.tick, font: { size: 11 } }, grid: { color: C.gridLine }, beginAtZero: true },
                    y: { ticks: { color: C.tick, font: { size: 11 } }, grid: { color: C.gridLine } }
                }
            }
        });
    } catch (e) { console.error(e); }
}

// global chart G4: upgrade popularity

async function chartG_Upgrades() {
    try {
        const json = await fetch(`${BASE}/stats/upgrade-popularity`).then(r => r.json());
        if (!json.success || !json.data?.length) return;

        const rows   = json.data.slice(0, 8);
        const labels = rows.map(r => r.upgrade_name);
        const data   = rows.map(r => Number(r.times_bought));

        new Chart(el("chart-g-upgrades"), {
            type: "bar",
            data: { labels, datasets: [{ label: "Times bought", data,
                backgroundColor: C.pink, borderRadius: 4, borderSkipped: false }] },
            options: { ...BASE_OPTS }
        });
    } catch (e) { console.error(e); }
}

// global chart G5: victories vs deaths

async function chartG_WinLoss() {
    try {
        const g = (await fetch(`${BASE}/stats/global`).then(r => r.json())).stats || {};
        const totalVic    = Math.round(Number(g.avg_victories) * Number(g.total_players));
        const totalDeaths = Math.round(Number(g.avg_deaths)    * Number(g.total_players));

        el("g-stat-vic").textContent    = fmtNum(totalVic);
        el("g-stat-deaths").textContent = fmtNum(totalDeaths);

        makeDoughnut("chart-g-winloss", ["Victories", "Deaths"], [totalVic, totalDeaths], [C.teal, C.coral]);
    } catch (e) { console.error(e); }
}

// bootstrap

document.addEventListener("DOMContentLoaded", () => {
    const userId = localStorage.getItem("userId");

    fillSummaryTables();
    fillLeaderboards();

    if (userId) {
        chartP_WinLoss(userId);
        fillCurrentRun(userId);
        chartP_EnemyWinrate();
        chartP_Deck(userId);
        fillPersonalUpgrades(userId);
    }

    chartG_Victories();
    chartG_Difficulty();
    chartG_Cards();
    chartG_Upgrades();
    chartG_WinLoss();
});