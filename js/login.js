document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("regBtn").addEventListener("click", function(event) {
        
        const usuario = document.getElementById("usuario").value.trim();
        const password = document.getElementById("password").value;


        if (usuario && password ) {
            localStorage.setItem("usuario", usuario);
            localStorage.setItem("password", password);
            window.location.href = "index.html";
        } else {
            alert("Por favor, complete todos los campos.");
        }
    });
});