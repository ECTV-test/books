(() => {
  const $ = (sel) => document.querySelector(sel);
  const params = new URLSearchParams(location.search);
  const bookId = params.get("id") || "invisible-sandwich";

  // UI
  const el = {
    backBtn: $("#backBtn"),
    catalogBtn: $("#catalogBtn"),
    settingsBtn: $("#settingsBtn"),
    mask: $("#mask"),
    panel: $("#panel"),
    closePanel: $("#closePanel"),
    langSelect: $("#langSelect"),
    showTr: $("#showTr"),
    theme: $("#theme"),
    hl: $("#hl"),
    rate: $("#rate"),
    rateLbl: $("#rateLbl"),
    fontUp: $("#fontUp"),
    fontDown: $("#fontDown"),
    content: $("#content"),
    title: $("#title"),
    author: $("#author"),
    level: $("#level"),
    minutes: $("#minutes"),
    coverImg: $("#coverImg"),
    crumbTitle: $("#crumbTitle"),
    playerTitle: $("#playerTitle"),
    progress: $("#progress"),
    pct: $("#pct"),
    playBtn: $("#playBtn"),
    stopBtn: $("#stopBtn"),
  };

  // State + persistence
  const LS = {
    theme: "books_theme",
    lang: "books_lang",
    showTr: "books_showTr",
    font: "books_font",
    rate: "books_rate",
    hl: "books_hl",
    hColor: "books_hColor",
  };

  let bookMeta = null;
  let originalLines = [];
  let translationsByLang = {}; // lang -> lines[]
  let currentLangKey = null;

  // TTS
  let playing = false;
  let utter = null;
  let currentLineIdx = 0;

  // ---------- helpers ----------
  function escapeHtml(s) {
    return (s ?? "").toString()
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function openPanel() {
    el.panel.classList.add("open");
    el.mask.classList.add("show");
  }
  function closePanel() {
    el.panel.classList.remove("open");
    el.mask.classList.remove("show");
  }

  function applyTheme() {
    const t = localStorage.getItem(LS.theme) || "light";
    document.body.classList.toggle("dark", t === "dark");
    el.theme.checked = (t === "dark");
  }

  function applyHighlightColor() {
    const hc = localStorage.getItem(LS.hColor) || "default";
    document.body.dataset.hc = hc;
  }

  function applyFontSize() {
    const f = Number(localStorage.getItem(LS.font) || "0");
    // 0..4 steps
    document.documentElement.style.setProperty("--fontScale", String(1 + f * 0.08));
  }

  function applyRate() {
    const r = Number(localStorage.getItem(LS.rate) || "1.0");
    el.rate.value = String(r);
    el.rateLbl.textContent = `${r.toFixed(2)}×`.replace(/\.00×$/, ".0×");
  }

  function applyShowTr() {
    const v = localStorage.getItem(LS.showTr);
    const on = v === null ? true : v === "1";
    el.showTr.checked = on;
    document.body.classList.toggle("hideTr", !on);
  }

  function applyHL() {
    const v = localStorage.getItem(LS.hl);
    const on = v === null ? true : v === "1";
    el.hl.checked = on;
  }

  function parseLangBlocks(text) {
    const lines = text.replace(/\r\n/g, "\n").split("\n");
    const out = {};
    let cur = null;
    let buf = [];
    for (const line of lines) {
      const m = line.match(/^lang:\s*(.+)\s*$/i);
      if (m) {
        if (cur !== null) out[cur] = buf.join("\n");
        cur = m[1].trim();
        buf = [];
      } else {
        buf.push(line);
      }
    }
    if (cur !== null) out[cur] = buf.join("\n");
    return out;
  }

  function splitLinesKeep(text) {
    return text.replace(/\r\n/g, "\n").split("\n");
  }

  function findUkrainianKey(keys) {
    // try common labels
    const lower = keys.map(k => k.toLowerCase());
    const idx = lower.findIndex(k => k.startsWith("ukrain") || k.includes("україн"));
    return idx >= 0 ? keys[idx] : null;
  }

  // Convert a line into word spans to keep the "underlined words" look.
  function renderLineWords(line, lineIdx) {
    // split into words + separators
    const parts = line.split(/(\s+)/);
    let html = "";
    for (const part of parts) {
      if (part.trim() === "") {
        html += escapeHtml(part);
        continue;
      }
      // further split punctuation attached to words
      const sub = part.split(/([,.;:!?“”"()—–\-…]+)/).filter(x => x !== "");
      for (const s of sub) {
        if (/^[,.;:!?“”"()—–\-…]+$/.test(s)) html += escapeHtml(s);
        else html += `<span class="w" data-li="${lineIdx}">${escapeHtml(s)}</span>`;
      }
    }
    return html;
  }

  function buildLanguageOptions(keys) {
    el.langSelect.innerHTML = "";
    for (const k of keys) {
      const opt = document.createElement("option");
      opt.value = k;
      opt.textContent = k;
      el.langSelect.appendChild(opt);
    }
  }

  function setLanguage(langKey) {
    currentLangKey = langKey;
    localStorage.setItem(LS.lang, langKey);
    el.langSelect.value = langKey;
    renderContent(); // update translations
  }

  function renderContent() {
    const trLines = translationsByLang[currentLangKey] || [];
    let out = "";
    for (let i = 0; i < originalLines.length; i++) {
      const o = originalLines[i] ?? "";
      const t = trLines[i] ?? "";
      if (o.trim() === "" && t.trim() === "") {
        out += `<div class="gap"></div>`;
        continue;
      }
      out += `
        <div class="line" data-li="${i}">
          <div class="orig">${renderLineWords(o, i)}</div>
          <div class="tr">${escapeHtml(t)}</div>
        </div>
      `;
    }
    el.content.innerHTML = out;
    el.playerTitle.textContent = bookMeta?.title || bookId;
    // reset progress
    el.progress.value = "0";
    el.pct.textContent = "0%";
  }

  // ---------- TTS ----------
  function stopTTS() {
    playing = false;
    currentLineIdx = 0;
    if (utter) utter.onend = null;
    speechSynthesis.cancel();
    utter = null;
    el.playBtn.textContent = "▶";
    clearActive();
    el.progress.value = "0";
    el.pct.textContent = "0%";
  }

  function clearActive() {
    document.querySelectorAll(".line.active").forEach(x => x.classList.remove("active"));
    document.querySelectorAll(".w.active").forEach(x => x.classList.remove("active"));
  }

  function setActiveLine(idx) {
    if (!el.hl.checked) return;
    clearActive();
    const lineEl = document.querySelector(`.line[data-li="${idx}"]`);
    if (lineEl) lineEl.classList.add("active");
    // scroll into view gently
    if (lineEl) lineEl.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  function speakNext() {
    if (!playing) return;

    // Skip empty lines
    while (currentLineIdx < originalLines.length && (originalLines[currentLineIdx] || "").trim() === "") {
      currentLineIdx++;
    }
    if (currentLineIdx >= originalLines.length) {
      stopTTS();
      return;
    }

    const text = originalLines[currentLineIdx];
    setActiveLine(currentLineIdx);

    utter = new SpeechSynthesisUtterance(text);
    utter.rate = Number(el.rate.value || "1.0");

    utter.onend = () => {
      // progress
      const pct = Math.round((currentLineIdx / Math.max(1, originalLines.length - 1)) * 100);
      el.progress.value = String(pct);
      el.pct.textContent = `${pct}%`;
      currentLineIdx++;
      speakNext();
    };

    speechSynthesis.speak(utter);
  }

  function togglePlay() {
    if (playing) {
      playing = false;
      speechSynthesis.pause();
      el.playBtn.textContent = "▶";
      return;
    }
    // resume if paused
    if (speechSynthesis.paused) {
      playing = true;
      speechSynthesis.resume();
      el.playBtn.textContent = "⏸";
      return;
    }
    playing = true;
    el.playBtn.textContent = "⏸";
    speakNext();
  }

  // ---------- data loading ----------
  async function fetchJson(url) {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) throw new Error(`Failed to load ${url}`);
    return await res.json();
  }
  async function fetchText(url) {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) throw new Error(`Failed to load ${url}`);
    return await res.text();
  }

  async function loadBook() {
    bookMeta = await fetchJson(`data/books/${bookId}/meta.json`);

    // meta links (allow relative)
    const bookPath = bookMeta.book || `data/books/${bookId}/book.txt`;
    const trPath = bookMeta.translations || `data/books/${bookId}/translations.txt`;

    const [bookText, trText] = await Promise.all([fetchText(bookPath), fetchText(trPath)]);

    originalLines = splitLinesKeep(bookText);

    const blocks = parseLangBlocks(trText);
    translationsByLang = {};
    for (const [k, v] of Object.entries(blocks)) translationsByLang[k] = splitLinesKeep(v);

    const keys = Object.keys(translationsByLang);
    buildLanguageOptions(keys);

    // default language: Ukrainian if exists, else saved, else first
    const saved = localStorage.getItem(LS.lang);
    const ukKey = findUkrainianKey(keys);
    const def = (ukKey && (bookMeta.defaultLang?.toLowerCase().startsWith("ukrain") ?? true)) ? ukKey
              : (saved && keys.includes(saved)) ? saved
              : ukKey || keys[0] || null;

    if (def) setLanguage(def);

    // fill meta
    el.title.textContent = bookMeta.title || bookId;
    el.author.textContent = bookMeta.author || "";
    el.level.textContent = bookMeta.level || "";
    el.minutes.textContent = String(bookMeta.minutes ?? "");
    el.coverImg.src = bookMeta.cover || `data/books/${bookId}/cover.jpg`;
    el.coverImg.onerror = () => { el.coverImg.style.display = "none"; };

    el.crumbTitle.textContent = `Бібліотека / ${bookMeta.title || bookId}`;
    el.playerTitle.textContent = bookMeta.title || bookId;

    renderContent();
  }

  // ---------- events ----------
  el.backBtn.addEventListener("click", () => history.length > 1 ? history.back() : (location.href = "index.html"));
  el.catalogBtn.addEventListener("click", () => location.href = "index.html");
  el.settingsBtn.addEventListener("click", openPanel);
  el.closePanel.addEventListener("click", closePanel);
  el.mask.addEventListener("click", closePanel);

  el.langSelect.addEventListener("change", () => setLanguage(el.langSelect.value));

  el.showTr.addEventListener("change", () => {
    localStorage.setItem(LS.showTr, el.showTr.checked ? "1" : "0");
    applyShowTr();
  });

  el.theme.addEventListener("change", () => {
    localStorage.setItem(LS.theme, el.theme.checked ? "dark" : "light");
    applyTheme();
  });

  el.hl.addEventListener("change", () => {
    localStorage.setItem(LS.hl, el.hl.checked ? "1" : "0");
    applyHL();
    clearActive();
  });

  el.rate.addEventListener("input", () => {
    localStorage.setItem(LS.rate, String(el.rate.value));
    applyRate();
  });

  el.fontUp.addEventListener("click", () => {
    const cur = Number(localStorage.getItem(LS.font) || "0");
    localStorage.setItem(LS.font, String(Math.min(4, cur + 1)));
    applyFontSize();
  });
  el.fontDown.addEventListener("click", () => {
    const cur = Number(localStorage.getItem(LS.font) || "0");
    localStorage.setItem(LS.font, String(Math.max(-1, cur - 1)));
    applyFontSize();
  });

  document.querySelectorAll("[data-hc]").forEach(btn => {
    btn.addEventListener("click", () => {
      localStorage.setItem(LS.hColor, btn.getAttribute("data-hc"));
      applyHighlightColor();
    });
  });

  el.playBtn.addEventListener("click", togglePlay);
  el.stopBtn.addEventListener("click", stopTTS);

  // clicking a word optionally shows line translation in a small toast (keeps design, но не "перевод по слову")
  el.content.addEventListener("click", (e) => {
    const w = e.target.closest(".w");
    if (!w) return;
    const li = Number(w.getAttribute("data-li"));
    const lineEl = document.querySelector(`.line[data-li="${li}"]`);
    if (!lineEl) return;
    const tr = lineEl.querySelector(".tr")?.textContent || "";
    if (!tr.trim()) return;
    // simple native tooltip
    w.setAttribute("title", tr);
  });

  // init
  function init() {
    applyTheme();
    applyHighlightColor();
    applyFontSize();
    applyRate();
    applyShowTr();
    applyHL();
    loadBook().catch(err => {
      console.error(err);
      el.content.innerHTML = `<div class="note">Помилка завантаження книги: ${escapeHtml(err.message)}</div>`;
    });
  }

  init();
})();