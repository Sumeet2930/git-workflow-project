function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

function submitForm(event) {
    event.preventDefault();
    document.getElementById("msg").textContent =
        "Thank you! Your message has been sent successfully.";
}
