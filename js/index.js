function logincheck() {
  const usuario = localStorage.getItem("usuario");
  const password = localStorage.getItem("password");
  var currentPage = window.location.pathname.split("/").pop(); 

  if (usuario && password) {
    if (currentPage === "login.html") {
      window.location.href = "index.html";
    }
  } else {
    if (currentPage !== "login.html") {
      window.location.href = "login.html";
    }
  }
}

logincheck();

document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });
});