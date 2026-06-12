const newDescentBtn = document.getElementById("newDescentBtn");
const continueDescentBtn = document.getElementById("continueDescentBtn");

// redirect to login if there is no active session
if (!localStorage.getItem("userId")) {
    window.location.href = "mainmenu.html";
}

// continueRun tells map.js whether to load a saved game or start fresh
newDescentBtn.addEventListener("click", () => {
    localStorage.setItem("continueRun", "false");
    window.location.href = "../scenes/map/introduction.html";
});

continueDescentBtn.addEventListener("click", () => {
    localStorage.setItem("continueRun", "true");
    window.location.href = "../scenes/map/map.html";
});
