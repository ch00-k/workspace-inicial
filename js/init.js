const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

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

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}
 document.getElementById("miEnlace").textContent = localStorage.getItem("usuario");

 document.addEventListener("DOMContentLoaded", function(){
logincheck();
});


/* === NUEVO: gestor de tema claro/oscuro === */
(function () {
  const KEY = "theme";                
  const root = document.documentElement;


  function current() {
    return root.getAttribute("data-theme") ||
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }
  function setTheme(next){
    root.setAttribute("data-theme", next);
    localStorage.setItem(KEY, next);
    const btn = document.getElementById("theme-toggle");
    if (btn){
      btn.setAttribute("aria-pressed", String(next==="dark"));
      btn.innerHTML = `${next==="dark" ? "🌙 Oscuro" : "☀️ Claro"}`;
    }
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta){ meta = document.createElement("meta"); meta.name="theme-color"; document.head.appendChild(meta); }
    meta.content = next==="dark" ? "#0f1115" : "#ffffff";
  }

  const saved = localStorage.getItem(KEY);
  if (saved==="light" || saved==="dark") setTheme(saved);

  document.addEventListener("click",(e)=>{
    const btn = e.target.closest("#theme-toggle"); if(!btn) return;
    setTheme(current()==="dark" ? "light" : "dark");
  });

  document.addEventListener("DOMContentLoaded", ()=>{
    const btn = document.getElementById("theme-toggle");
    if (btn){ btn.innerHTML = `${current()==="dark" ? "🌙 Oscuro" : "☀️ Claro"}`; }
  });
})();
