const newDescentBtn = document.getElementById("newDescentBtn");
const continueDescentBtn = document.getElementById("continueDescentBtn");

if (!localStorage.getItem("userId")) {
    window.location.href = "mainmenu.html";
}

newDescentBtn.addEventListener("click", () => {
    localStorage.setItem("continueRun", "false");
    window.location.href = "../scenes/map/map.html";
});

continueDescentBtn.addEventListener("click", () => {
    localStorage.setItem("continueRun", "true");
    window.location.href = "../scenes/map/map.html";
});