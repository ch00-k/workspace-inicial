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

