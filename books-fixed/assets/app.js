const App = (() => {
  // 6 языков в настройках: Ukrainian по умолчанию
  const LANGS = [
    { code: "en", label: "English",   tag: "English" },
    { code: "uk", label: "Ukrainian", tag: "Ukrainian" },
    { code: "fr", label: "French",    tag: "French" },
    { code: "pl", label: "Polish",    tag: "Polish" },
    { code: "de", label: "German",    tag: "German" },
    { code: "es", label: "Spanish",   tag: "Spanish" },
  ];

  const DEFAULTS = {
    translationLang: "uk",
    highlightStyle: "default",
    origSize: 20,
    lineHeight: 1.5
  };

  function qs(name) {
    return new URLSearchParams(location.search).get(name);
  }

  function setRootVars({origSize, lineHeight, highlightStyle}) {
    document.documentElement.style.setProperty("--orig-size", `${origSize}px`);
    document.documentElement.style.setProperty("--lh", `${lineHeight}`);

    if (highlightStyle === "yellow") {
      document.documentElement.style.setProperty("--hl-bg", "rgba(255, 213, 79, .28)");
      document.documentElement.style.setProperty("--hl-br", "rgba(255, 213, 79, .62)");
      document.documentElement.style.setProperty("--hl-tx", "rgba(234,240,255,1)");
    } else if (highlightStyle === "invert") {
      document.documentElement.style.setProperty("--hl-bg", "rgba(0,0,0,.70)");
      document.documentElement.style.setProperty("--hl-br", "rgba(255,255,255,.20)");
      document.documentElement.style.setProperty("--hl-tx", "rgba(255,255,255,1)");
    } else {
      document.documentElement.style.setProperty("--hl-bg", "rgba(108,124,255,.22)");
      document.documentElement.style.setProperty("--hl-br", "rgba(108,124,255,.55)");
      document.documentElement.style.setProperty("--hl-tx", "rgba(234,240,255,1)");
    }
  }

  function loadPrefs() {
    try {
      const raw = localStorage.getItem("readerPrefs");
      const p = raw ? JSON.parse(raw) : {};
      return { ...DEFAULTS, ...p };
    } catch {
      return { ...DEFAULTS };
    }
  }
  function savePrefs(prefs) {
    localStorage.setItem("readerPrefs", JSON.stringify(prefs));
  }

  async function fetchJSON(path) {
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
    return await res.json();
  }

  // Парсер файла с блоками lang:...
  function parseLangBlocks(raw) {
    // нормализуем переносы
    raw = raw.replace(/\r\n/g, "\n");

    // найдём все заголовки "lang:..."
    const re = /^lang:(.+)$/gm;
    const hits = [];
    let m;
    while ((m = re.exec(raw)) !== null) {
      hits.push({ idx: m.index, tag: m[1].trim() });
    }
    if (!hits.length) return {};

    const blocks = {};
    for (let i = 0; i < hits.length; i++) {
      const start = hits[i].idx;
      const end = (i + 1 < hits.length) ? hits[i + 1].idx : raw.length;
      const tag = hits[i].tag;

      // content starts after the header line
      const headerEnd = raw.indexOf("\n", start);
      const content = raw.slice(headerEnd + 1, end).trim();

      // lines: сохраняем пустые строки тоже, но убираем лишние хвостовые
      const lines = content.split("\n").map(s => s.replace(/\s+$/g, ""));
      blocks[tag] = lines;
    }
    return blocks;
  }

  // Приводим перевод к длине английского
  function alignToEnglish(blocks, targetTag) {
    const en = blocks["English"] || [];
    const tr = blocks[targetTag] || [];
    const max = en.length;

    const trAligned = [];
    for (let i = 0; i < max; i++) trAligned.push(tr[i] ?? "");
    return { en, tr: trAligned };
  }

  function normalizeForTTS(line) {
    // пропускаем визуальные разделители
    if (!line) return "";
    const s = line.trim();
    if (!s) return "";
    if (/^_{5,}$/.test(s)) return "";
    return s;
  }

  // ========== PAGES ==========
  async function renderCatalog() {
    const catalog = await fetchJSON("data/catalog.json");
    const el = document.getElementById("catalog");
    el.innerHTML = "";

    for (const b of catalog.books) {
      const a = document.createElement("a");
      a.className = "card";
      a.href = `book.html?id=${encodeURIComponent(b.id)}`;
      a.innerHTML = `
        <img src="${b.cover}" alt="Cover">
        <div>
          <div class="card__title">${escapeHTML(b.title)}</div>
          <div class="card__sub">${escapeHTML(b.level)}</div>
        </div>
      `;
      el.appendChild(a);
    }
  }

  async function renderBookPage() {
    const id = qs("id");
    const backBtn = document.getElementById("backBtn");
    backBtn.onclick = () => location.href = "index.html";

    const meta = await fetchJSON(`data/books/${id}/meta.json`);

    document.title = meta.title;
    document.getElementById("bookTitle").textContent = meta.title;
    document.getElementById("title").textContent = meta.title;
    document.getElementById("level").textContent = meta.level;
    document.getElementById("desc").textContent = meta.description;
    document.getElementById("cover").src = meta.cover;

    document.getElementById("listenBtn").href = `reader.html?id=${encodeURIComponent(id)}`;
    document.getElementById("homeBtn").href = "index.html";
  }

  async function renderReader() {
    const id = qs("id");
    const prefs = loadPrefs();
    setRootVars(prefs);

    // Back
    document.getElementById("backBtn").onclick = () => location.href = `book.html?id=${encodeURIComponent(id)}`;

    // Title
    const meta = await fetchJSON(`data/books/${id}/meta.json`);
    document.getElementById("readerTitle").textContent = meta.title;
    document.title = meta.title;

    // Load translations file
    const txtRes = await fetch(`data/books/${id}/translations.txt`, { cache: "no-store" });
    if (!txtRes.ok) throw new Error(`translations.txt load failed: ${txtRes.status}`);
    const raw = await txtRes.text();
    const blocks = parseLangBlocks(raw);

    // Build language select (только те, что реально есть)
    const langSelect = document.getElementById("langSelect");
    langSelect.innerHTML = "";
    const available = LANGS.filter(l => blocks[l.tag]);
    for (const l of available) {
      const opt = document.createElement("option");
      opt.value = l.code;
      opt.textContent = l.label;
      langSelect.appendChild(opt);
    }

    // Ukrainian default
    if (!available.some(l => l.code === prefs.translationLang)) {
      prefs.translationLang = available.some(l => l.code === "uk") ? "uk" : available[0]?.code || "en";
      savePrefs(prefs);
    }
    langSelect.value = prefs.translationLang;

    // Highlight style, font size, line height
    const hlSelect = document.getElementById("hlSelect");
    const fontSize = document.getElementById("fontSize");
    const lineHeight = document.getElementById("lineHeight");

    hlSelect.value = prefs.highlightStyle;
    fontSize.value = prefs.origSize;
    lineHeight.value = prefs.lineHeight;

    // Render lines
    const linesEl = document.getElementById("lines");

    function codeToTag(code) {
      const found = LANGS.find(l => l.code === code);
      return found ? found.tag : "Ukrainian";
    }

    let currentLangTag = codeToTag(prefs.translationLang);
    let aligned = alignToEnglish(blocks, currentLangTag);

    function renderLines() {
      linesEl.innerHTML = "";
      for (let i = 0; i < aligned.en.length; i++) {
        const orig = aligned.en[i] ?? "";
        const tr = aligned.tr[i] ?? "";
        const div = document.createElement("div");
        div.className = "line";
        div.dataset.i = String(i);
        div.innerHTML = `
          <div class="line__orig">${escapeHTML(orig)}</div>
          <div class="line__tr">${escapeHTML(tr)}</div>
        `;
        linesEl.appendChild(div);
      }
      updateProgressUI();
    }

    // ===== TTS: читаем строками, подсвечиваем строку =====
    let idx = 0;
    let isPlaying = false;
    let cancelRequested = false;

    const playBtn = document.getElementById("playBtn");
    const pauseBtn = document.getElementById("pauseBtn");
    const progress = document.getElementById("progress");
    const pos = document.getElementById("pos");
    const total = document.getElementById("total");

    function updateProgressUI() {
      const n = aligned.en.length;
      progress.max = String(Math.max(0, n - 1));
      total.textContent = String(n);
      pos.textContent = String(idx + 1);
      progress.value = String(idx);
    }

    function setActive(i) {
      const prev = linesEl.querySelector(".line.active");
      if (prev) prev.classList.remove("active");
      const cur = linesEl.querySelector(`.line[data-i="${i}"]`);
      if (cur) {
        cur.classList.add("active");
        cur.scrollIntoView({ block: "center", behavior: "smooth" });
      }
      idx = i;
      updateProgressUI();
    }

    function stopTTS() {
      cancelRequested = true;
      isPlaying = false;
      try { window.speechSynthesis.cancel(); } catch {}
    }

    async function speakFrom(startIndex) {
      if (!("speechSynthesis" in window)) {
        alert("Speech Synthesis is not supported in this browser.");
        return;
      }
      cancelRequested = false;
      isPlaying = true;

      for (let i = startIndex; i < aligned.en.length; i++) {
        if (cancelRequested) break;

        const line = normalizeForTTS(aligned.en[i]);
        setActive(i);

        // пустые/разделители не озвучиваем, но подсветка остаётся
        if (!line) continue;

        await new Promise((resolve) => {
          const u = new SpeechSynthesisUtterance(line);
          u.lang = "en-US"; // оригинал — English; потом можно сделать выбор
          u.rate = 1.0;
          u.onend = resolve;
          u.onerror = resolve;
          window.speechSynthesis.speak(u);
        });
      }

      isPlaying = false;
    }

    playBtn.onclick = () => {
      if (isPlaying) return;
      speakFrom(idx);
    };

    pauseBtn.onclick = () => {
      stopTTS();
    };

    progress.addEventListener("input", () => {
      const v = Number(progress.value);
      setActive(v);
      if (isPlaying) {
        stopTTS();
        speakFrom(v);
      }
    });

    // ===== Settings modal =====
    const modal = document.getElementById("modal");
    const settingsBtn = document.getElementById("settingsBtn");
    const closeModal = document.getElementById("closeModal");
    const backdrop = document.getElementById("backdrop");

    function openModal() {
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
    }
    function close() {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
    }

    settingsBtn.onclick = openModal;
    closeModal.onclick = close;
    backdrop.onclick = close;

    langSelect.onchange = () => {
      const code = langSelect.value;
      prefs.translationLang = code;
      savePrefs(prefs);

      currentLangTag = codeToTag(code);
      aligned = alignToEnglish(blocks, currentLangTag);

      // сохраняем позицию
      const keep = Math.min(idx, Math.max(0, aligned.en.length - 1));
      renderLines();
      setActive(keep);
    };

    hlSelect.onchange = () => {
      prefs.highlightStyle = hlSelect.value;
      savePrefs(prefs);
      setRootVars(prefs);
    };

    fontSize.oninput = () => {
      prefs.origSize = Number(fontSize.value);
      savePrefs(prefs);
      setRootVars(prefs);
    };

    lineHeight.oninput = () => {
      prefs.lineHeight = Number(lineHeight.value);
      savePrefs(prefs);
      setRootVars(prefs);
    };

    // initial render
    renderLines();
    setActive(0);
  }

  function escapeHTML(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  return { renderCatalog, renderBookPage, renderReader };
})();
