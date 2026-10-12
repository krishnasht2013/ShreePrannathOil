// Loads header.html and footer.html into every page.
(function () {
  function load(id, url) {
    var el = document.getElementById(id);
    if (!el) return Promise.resolve();
    return fetch(url)
      .then(function (r) { if (!r.ok) throw new Error(url + " -> " + r.status); return r.text(); })
      .then(function (html) { el.innerHTML = html; })
      .catch(function (e) { console.error("Include failed:", e); });
  }

  function init() {
    // Highlight the current page in the menu
    var path = location.pathname.replace(/\/index\.html$/, "/");
    if (path.length > 1 && !/\.html$/.test(path)) path = path.replace(/\/$/, "") + ".html";
    document.querySelectorAll(".nav-link").forEach(function (a) {
      if (a.getAttribute("href") === path) {
        a.classList.add("text-primary");
        a.style.color = "#b45309";
        a.style.fontWeight = "700";
      }
    });

    // Mobile menu toggle
    var btn = document.getElementById("menu-toggle");
    var panel = document.getElementById("mobile-nav");
    if (btn && panel) {
      btn.addEventListener("click", function () {
        var open = panel.hasAttribute("hidden");
        if (open) panel.removeAttribute("hidden"); else panel.setAttribute("hidden", "");
        btn.setAttribute("aria-expanded", String(open));
      });
    }

    // Footer year
    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
    
    // Years since founding (auto-updates every year)
    document.querySelectorAll("[data-years-since]").forEach(function (el) {
      var years = new Date().getFullYear() - parseInt(el.getAttribute("data-years-since"), 10);
      el.textContent = years + (el.hasAttribute("data-no-plus") ? "" : "+");
    });
  }

  Promise.all([load("site-header", "/header.html"), load("site-footer", "/footer.html")]).then(init);
})();
