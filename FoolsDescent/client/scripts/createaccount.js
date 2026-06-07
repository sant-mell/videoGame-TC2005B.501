const registerForm = document.querySelector(".register-form");

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

        } else {

            alert("Error creating account");

        }
    } catch (err) {
        alert("Could not reach the server. Please try again.");
    }

});