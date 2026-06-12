const registerForm = document.querySelector(".register-form");

// calls sp_register_player on the server then redirects to login on success
registerForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const fullName = document.getElementById("fullName").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const age = document.getElementById("age").value;
    const gender = document.getElementById("gender").value;

    try {
        const response = await fetch("http://localhost:3000/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                fullName: fullName,
                username: username,
                password: password,
                age: age,
                gender: gender

            })

        });

        const data = await response.json();

        if (data.success) {

            alert("Account created!");
            window.location.href = "mainmenu.html";

        } else {

            alert("Error creating account");

        }
    } catch (err) {
        alert("Could not reach the server. Please try again.");
    }

});