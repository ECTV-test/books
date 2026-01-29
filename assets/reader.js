// Reader (line-by-line + cached translations)
(function(){
  const qs = new URLSearchParams(location.search);
  const bookId = qs.get("id");
  const autoplay = qs.get("autoplay") === "1";
  if(!bookId){ location.href = "index.html"; return; }

  const $ = (s)=>document.querySelector(s);

  const el = {
    backBtn: $("#backBtn"),
    coverImg: $("#coverImg"),
    author: $("#author"),
    title: $("#title"),
    level: $("#level"),
    minutes: $("#minutes"),
    crumbTitle: $("#crumbTitle"),
    playerTitle: $("#playerTitle"),
    content: $("#content"),
    playBtn: $("#playBtn"),
    stopBtn: $("#stopBtn"),
    progress: $("#progress"),
    pct: $("#pct"),

    settingsBtn: $("#settingsBtn"),
    panel: $("#panel"),
    mask: $("#mask"),
    closePanel: $("#closePanel"),

    langSelect: $("#langSelect"),
    fontUp: $("#fontUp"),
    fontDown: $("#fontDown"),
    rate: $("#rate"),
    rateLbl: $("#rateLbl"),
    showTr: $("#showTr"),
    theme: $("#theme"),
    hl: $("#hl"),
  };

  const LS = {
    lang: "books_lang",
    showTr: "books_showTr",
    theme: "books_theme",
    font: "books_font",
    rate: "books_rate",
    hl: "books_hl",
    hlColor: "books_hlColor",
  };

  let meta = null;
  let origLines = [];
  let trByLang = {};
  let langList = [];
  let currentLang = "Ukrainian";
  let showTranslations = true;
  let fontSize = 24;
  let rate = 1.0;
  let highlightOn = true;
  let hlColor = "default";

  // speech
  let idx = 0;
  let isPlaying = false;
  let isPaused = false;
  let currentUtter = null;

  function escapeText(s){ return (s ?? "").toString(); }

  function parseBlocks(txt){
    // txt contains multiple blocks starting with "lang:Name"
    const lines = txt.replace(/\r/g, "").split("\n");
    const out = {};
    let cur = null;
    let buf = [];
    for(const line of lines){
      const m = line.match(/^lang:(.+)$/);
      if(m){
        if(cur){
          out[cur] = buf.join("\n");
        }
        cur = m[1].trim();
        buf = [];
        continue;
      }
      if(cur===null) continue;
      buf.push(line);
    }
    if(cur) out[cur] = buf.join("\n");
    return out;
  }

  function setTheme(on){
    document.body.classList.toggle("dark", !!on);
    localStorage.setItem(LS.theme, on ? "1" : "0");
  }

  function setFont(px){
    fontSize = Math.max(16, Math.min(34, px));
    document.documentElement.style.setProperty("--fontSize", fontSize + "px");
    localStorage.setItem(LS.font, String(fontSize));
  }

  function setRate(v){
    rate = Math.max(0.75, Math.min(1.5, v));
    el.rate.value = String(rate);
    el.rateLbl.textContent = rate.toFixed(2) + "×";
    localStorage.setItem(LS.rate, String(rate));
  }

  function setShowTr(on){
    showTranslations = !!on;
    el.showTr.checked = showTranslations;
    localStorage.setItem(LS.showTr, showTranslations ? "1" : "0");
    render();
  }

  function setHighlight(on){
    highlightOn = !!on;
    el.hl.checked = highlightOn;
    localStorage.setItem(LS.hl, highlightOn ? "1" : "0");
    renderActiveLine();
  }

  function setHlColor(v){
    hlColor = v === "yellow" ? "yellow" : "default";
    document.body.dataset.hl = hlColor;
    localStorage.setItem(LS.hlColor, hlColor);
  }

  function openPanel(){
    el.panel.classList.remove("hidden");
    el.mask.classList.remove("hidden");
    el.panel.setAttribute("aria-hidden","false");
  }
  function closePanel(){
    el.panel.classList.add("hidden");
    el.mask.classList.add("hidden");
    el.panel.setAttribute("aria-hidden","true");
  }

  function fmtMinutes(sec){
    const m = Math.max(1, Math.round((sec||0)/60));
    return m + " хв";
  }

  async function loadMeta(){
    const res = await fetch(`data/books/${bookId}/meta.json?cb=${Date.now()}`);
    if(!res.ok) throw new Error("meta.json not found");
    return await res.json();
  }
  async function loadText(path){
    const res = await fetch(path + `?cb=${Date.now()}`);
    if(!res.ok) throw new Error("text not found: " + path);
    return await res.text();
  }

  function buildLangSelect(){
    el.langSelect.innerHTML = "";
    for(const lang of langList){
      const opt = document.createElement("option");
      opt.value = lang;
      opt.textContent = lang;
      el.langSelect.appendChild(opt);
    }
    if(!langList.includes(currentLang)){
      currentLang = langList.includes("Ukrainian") ? "Ukrainian" : (langList[0]||"English");
    }
    el.langSelect.value = currentLang;
  }

  function getTrLines(){
    const block = trByLang[currentLang] || "";
    return block.replace(/\r/g,"").split("\n");
  }

  function render(){
    el.content.innerHTML = "";
    const trLines = getTrLines();
    origLines.forEach((o, i)=>{
      const line = document.createElement("div");
      line.className = "line";
      line.dataset.i = String(i);

      const oDiv = document.createElement("div");
      oDiv.className = "lineOrig";
      oDiv.textContent = o;

      line.appendChild(oDiv);

      if(showTranslations){
        const t = trLines[i] ?? "";
        const tDiv = document.createElement("div");
        tDiv.className = "lineTr";
        tDiv.textContent = t;
        line.appendChild(tDiv);
      }

      // spacing for empty lines
      if(o.trim()==="" && (!showTranslations || (trLines[i]??"").trim()==="")){
        line.classList.add("blank");
      }

      el.content.appendChild(line);
    });

    // progress
    el.progress.max = String(Math.max(1, origLines.length-1));
    el.progress.value = String(idx);
    updatePct();
    renderActiveLine();
  }

  function clearActive(){
    el.content.querySelectorAll(".line.active").forEach(n=>n.classList.remove("active"));
  }

  function renderActiveLine(){
    clearActive();
    if(!highlightOn) return;
    const node = el.content.querySelector(`.line[data-i="${idx}"]`);
    if(node){
      node.classList.add("active");
      node.scrollIntoView({block:"center", behavior:"smooth"});
    }
  }

  function updatePct(){
    const total = Math.max(1, origLines.length);
    const pct = Math.round((idx / (total-1 || 1)) * 100);
    el.pct.textContent = pct + "%";
  }

  function stop(){
    window.speechSynthesis.cancel();
    isPlaying = false;
    isPaused = false;
    currentUtter = null;
    el.playBtn.textContent = "▶";
  }

  function speakCurrent(){
    stop(); // cancel any queued
    if(idx < 0) idx = 0;
    if(idx >= origLines.length) idx = origLines.length - 1;

    const text = (origLines[idx] || "").trim();
    if(!text){
      // skip empty
      next(true);
      return;
    }

    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    u.onend = ()=>{ if(isPlaying) next(true); };
    u.onerror = ()=>{ if(isPlaying) next(true); };
    currentUtter = u;
    isPlaying = true;
    isPaused = false;
    el.playBtn.textContent = "❚❚";
    renderActiveLine();
    window.speechSynthesis.speak(u);
  }

  function playPause(){
    if(isPlaying && !isPaused){
      window.speechSynthesis.pause();
      isPaused = true;
      el.playBtn.textContent = "▶";
      return;
    }
    if(isPlaying && isPaused){
      window.speechSynthesis.resume();
      isPaused = false;
      el.playBtn.textContent = "❚❚";
      return;
    }
    speakCurrent();
  }

  function next(auto=false){
    idx = Math.min(origLines.length-1, idx + 1);
    el.progress.value = String(idx);
    updatePct();
    if(auto) speakCurrent(); else renderActiveLine();
  }

  function prev(){
    idx = Math.max(0, idx - 1);
    el.progress.value = String(idx);
    updatePct();
    renderActiveLine();
  }

  function applyStored(){
    // language default
    const storedLang = localStorage.getItem(LS.lang);
    currentLang = storedLang || "Ukrainian";

    showTranslations = localStorage.getItem(LS.showTr) !== "0";
    el.showTr.checked = showTranslations;

    setTheme(localStorage.getItem(LS.theme) === "1");

    const f = parseInt(localStorage.getItem(LS.font) || "24", 10);
    setFont(isFinite(f) ? f : 24);

    const r = parseFloat(localStorage.getItem(LS.rate) || "1");
    setRate(isFinite(r) ? r : 1);

    highlightOn = localStorage.getItem(LS.hl) !== "0";
    el.hl.checked = highlightOn;

    setHlColor(localStorage.getItem(LS.hlColor) || "default");
  }

  function wireUI(){
    el.settingsBtn.addEventListener("click", openPanel);
    el.closePanel.addEventListener("click", closePanel);
    el.mask.addEventListener("click", closePanel);

    el.playBtn.addEventListener("click", playPause);
    el.stopBtn.addEventListener("click", stop);

    el.progress.addEventListener("input", ()=>{
      idx = parseInt(el.progress.value,10) || 0;
      updatePct();
      renderActiveLine();
    });

    // keyboard
    window.addEventListener("keydown", (e)=>{
      if(e.key === "Escape") closePanel();
      if(e.key === " "){ e.preventDefault(); playPause(); }
      if(e.key === "ArrowRight") next(false);
      if(e.key === "ArrowLeft") prev();
    });

    el.langSelect.addEventListener("change", ()=>{
      currentLang = el.langSelect.value;
      localStorage.setItem(LS.lang, currentLang);
      render();
    });

    el.showTr.addEventListener("change", ()=> setShowTr(el.showTr.checked));
    el.theme.addEventListener("change", ()=> setTheme(el.theme.checked));
    el.hl.addEventListener("change", ()=> setHighlight(el.hl.checked));

    el.fontUp.addEventListener("click", ()=> setFont(fontSize + 2));
    el.fontDown.addEventListener("click", ()=> setFont(fontSize - 2));

    el.rate.addEventListener("input", ()=> setRate(parseFloat(el.rate.value)));

    // highlight color buttons
    document.querySelectorAll("[data-hl]").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        setHlColor(btn.getAttribute("data-hl"));
        document.querySelectorAll("[data-hl]").forEach(b=>b.classList.toggle("active", b===btn));
      });
    });
    // init active state
    const activeBtn = document.querySelector(`[data-hl="${hlColor}"]`);
    if(activeBtn) activeBtn.classList.add("active");
  }

  async function init(){
    applyStored();
    wireUI();

    meta = await loadMeta();
    const backTo = `details.html?id=${encodeURIComponent(bookId)}`;
    el.backBtn.href = backTo;

    // header
    el.coverImg.src = meta.cover || "";
    el.author.textContent = meta.publisher || meta.author || "";
    el.title.textContent = meta.title || "";
    el.level.textContent = meta.level || "";
    el.minutes.textContent = fmtMinutes(meta.durationSeconds || meta.duration || 0);

    el.crumbTitle.textContent = meta.title || "";
    el.playerTitle.textContent = meta.title || "—";

    // content
    const bookTxt = await loadText(meta.text || `data/books/${bookId}/book.txt`);
    origLines = bookTxt.replace(/\r/g,"").split("\n");

    const trTxt = await loadText(meta.translations || `data/books/${bookId}/translations.txt`);
    trByLang = parseBlocks(trTxt);
    langList = Object.keys(trByLang);
    buildLangSelect();

    // ensure default lang (UA) if no stored
    if(!localStorage.getItem(LS.lang)){
      currentLang = meta.defaultLang || "Ukrainian";
      if(langList.includes(currentLang)) el.langSelect.value = currentLang;
      localStorage.setItem(LS.lang, currentLang);
    } else {
      currentLang = el.langSelect.value;
    }

    render();

    if(autoplay) speakCurrent();
  }

  init().catch(err=>{
    console.error(err);
    alert("Помилка завантаження книги. Перевір файли у data/books/" + bookId);
    location.href = "index.html";
  });
})();
