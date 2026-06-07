const newDescentBtn = document.getElementById("newDescentBtn");
const continueDescentBtn = document.getElementById("continueDescentBtn");

newDescentBtn.addEventListener("click", () => {
    localStorage.setItem("continueRun", "false");
    window.location.href = "../scenes/map/introduction.html";
});

continueDescentBtn.addEventListener("click", () => {
    localStorage.setItem("continueRun", "true");
    window.location.href = "../scenes/map/map.html";
});
