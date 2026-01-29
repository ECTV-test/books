(() => {
  const $ = (sel) => document.querySelector(sel);
  const grid = $("#grid");
  const themeBtn = $("#themeBtn");
  const reloadBtn = $("#reloadBtn");

  const LS_THEME = "books_theme";

  function applyTheme() {
    const t = localStorage.getItem(LS_THEME) || "light";
    document.body.classList.toggle("dark", t === "dark");
  }

  themeBtn.addEventListener("click", () => {
    const cur = localStorage.getItem(LS_THEME) || "light";
    localStorage.setItem(LS_THEME, cur === "dark" ? "light" : "dark");
    applyTheme();
  });

  reloadBtn.addEventListener("click", () => location.reload());

  async function loadCatalog() {
    const res = await fetch("data/catalog.json", { cache: "no-cache" });
    if (!res.ok) throw new Error("Failed to load catalog.json");
    return await res.json();
  }

  function cardHtml(b) {
    return `
      <div class="card" data-id="${b.id}">
        <img class="cover" src="${b.cover}" alt="">
        <div class="card-body">
          <div class="card-title">${escapeHtml(b.title || b.id)}</div>
          <div class="card-meta">
            <span class="badge"><span class="dot-green"></span>${escapeHtml(b.level || "")}</span>
            <span class="badge">🕒 ${Number(b.minutes || 0)} хв</span>
          </div>
        </div>
      </div>
    `;
  }

  function escapeHtml(s) {
    return (s ?? "").toString()
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  async function init() {
    applyTheme();
    try {
      const books = await loadCatalog();
      grid.innerHTML = books.map(cardHtml).join("");
      grid.addEventListener("click", (e) => {
        const card = e.target.closest(".card");
        if (!card) return;
        const id = card.getAttribute("data-id");
        location.href = `reader.html?id=${encodeURIComponent(id)}`;
      });
    } catch (err) {
      grid.innerHTML = `<div class="pill">Ошибка: ${escapeHtml(err.message)}</div>`;
      console.error(err);
    }
  }

  init();
})();