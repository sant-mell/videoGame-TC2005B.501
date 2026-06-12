const loginButton = document.getElementById("loginButton");

// stores userId and username in localStorage on a successful login then redirects to the menu
loginButton.addEventListener("click", async () => {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:3000/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                username: username,
                password: password

            })

        });

        const data = await response.json();

        if (data.success) {

            localStorage.setItem("userId", data.userId);
            localStorage.setItem("username", username);
            localStorage.setItem("continueRun", "false");

            alert("Login successful!");

            window.location.href = "menu.html";

        } else {

            alert("Incorrect username or password");

        }
    } catch (err) {
        alert("Could not reach the server. Please try again.");
    }

});