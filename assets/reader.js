const STORAGE_KEY = "books_v3_settings";

const LANGUAGE_CODES = {
  "Ukrainian":"uk",
  "English":"en",
  "French":"fr",
  "German":"de",
  "Spanish":"es",
  "Polish":"pl",
  "Italian":"it",
  "Portuguese":"pt",
  "Romanian":"ro",
  "Czech":"cs",
  "Slovak":"sk",
  "Slovenian":"sl",
  "Croatian":"hr",
  "Serbian":"sr",
  "Bulgarian":"bg",
  "Greek":"el",
  "Hungarian":"hu",
  "Finnish":"fi",
  "Estonian":"et",
  "Latvian":"lv",
  "Lithuanian":"lt",
  "Georgian":"ka",
  "Kazakh":"kk",
  "Indonesian":"id",
  "Malay":"ms",
  "Arabic":"ar",
  "Chinese":"zh",
  "Korean":"ko",
  "Swahili":"sw",
  "Turkish":"tr",
  "Albanian":"sq"
};

function loadSettings(){
  const defaults = {
    theme: "dark",
    targetLanguage: "Ukrainian",
    showTranslations: true,
    highlightStyle: "underline",
    fontSize: 18,
    lineHeight: 1.55,
  };
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return defaults;
    return {...defaults, ...JSON.parse(raw)};
  }catch{
    return defaults;
  }
}
function saveSettings(s){ localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); }

function applyTheme(theme){
  document.documentElement.dataset.theme = theme === "light" ? "light" : "dark";
  const btn = document.getElementById("btnTheme");
  if(btn) btn.textContent = theme === "light" ? "🌞" : "🌙";
}
function applyTypography(s){
  document.documentElement.style.setProperty("--fontSize", `${s.fontSize}px`);
  document.documentElement.style.setProperty("--lineHeight", `${s.lineHeight}`);
  document.documentElement.style.setProperty("--hlStyle", s.highlightStyle);
}

function fillLanguageSelect(select, current){
  select.innerHTML = "";
  const langs = Object.keys(LANGUAGE_CODES);
  langs.sort((a,b)=> (a==="Ukrainian")?-1:(b==="Ukrainian")?1:a.localeCompare(b));
  for(const l of langs){
    const opt = document.createElement("option");
    opt.value = l;
    opt.textContent = l;
    if(l === current) opt.selected = true;
    select.appendChild(opt);
  }
}

function wireThemeButton(){
  const btn = document.getElementById("btnTheme");
  if(!btn) return;
  btn.addEventListener("click", ()=>{
    const s = loadSettings();
    const next = {...s, theme: s.theme === "light" ? "dark" : "light"};
    saveSettings(next);
    applyTheme(next.theme);
  });
}

function wireSettingsDialog(){
  const dlg = document.getElementById("settingsDialog");
  const btnSettings = document.getElementById("btnSettings");
  if(!dlg || !btnSettings) return;

  const s = loadSettings();

  const langSelect = dlg.querySelector("#langSelect");
  const showTranslations = dlg.querySelector("#showTranslations");
  const highlightStyle = dlg.querySelector("#highlightStyle");
  const fontSize = dlg.querySelector("#fontSize");
  const lineHeight = dlg.querySelector("#lineHeight");

  fillLanguageSelect(langSelect, s.targetLanguage);
  showTranslations.checked = !!s.showTranslations;
  highlightStyle.value = s.highlightStyle || "underline";
  fontSize.value = s.fontSize;
  lineHeight.value = s.lineHeight;

  btnSettings.addEventListener("click", ()=> dlg.showModal());

  dlg.addEventListener("close", ()=>{
    const next = {
      ...s,
      targetLanguage: langSelect.value,
      showTranslations: showTranslations.checked,
      highlightStyle: highlightStyle.value,
      fontSize: Number(fontSize.value),
      lineHeight: Number(lineHeight.value),
    };
    saveSettings(next);
    applyTypography(next);
    renderFromState();
  });
}

function getBookId(){
  const u = new URL(location.href);
  return u.searchParams.get("book") || "sample-book";
}

async function loadBookMeta(bookId){
  const res = await fetch(`./books/${bookId}/book.json`, {cache:"no-store"});
  if(!res.ok) throw new Error(`Cannot load books/${bookId}/book.json (${res.status})`);
  return res.json();
}

async function loadBookContent(bookId, fileName){
  const res = await fetch(`./books/${bookId}/${fileName}`, {cache:"no-store"});
  if(!res.ok) throw new Error(`Cannot load content (${res.status})`);
  return res.text();
}

/**
 * Parse a file formatted as:
 * lang: English
 * ...
 * lang: Ukrainian
 * ...
 * Each language section can contain blank lines. We keep the content as blocks of lines.
 */
function parseLangSections(text){
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const sections = new Map();
  let currentLang = null;
  let buf = [];
  const flush = ()=>{
    if(!currentLang) return;
    const raw = buf.join("\n").trim();
    // Split into "display lines": keep headings/blank lines as separate lines
    const displayLines = raw.split("\n").map(s=>s.trimEnd());
    sections.set(currentLang, displayLines);
  };

  for(const line of lines){
    const m = line.match(/^lang:\s*(.+?)\s*$/i);
    if(m){
      flush();
      currentLang = m[1].trim();
      buf = [];
    }else{
      buf.push(line);
    }
  }
  flush();
  return sections;
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function splitWordsKeepingSpaces(text){
  // Keeps spaces as tokens so we can render nice word spans.
  // Example: "Hello, world!" => ["Hello,", " ", "world!"]
  const tokens = [];
  let cur = "";
  let isSpace = null;
  for(const ch of text){
    const space = /\s/.test(ch);
    if(isSpace === null){
      isSpace = space;
      cur = ch;
    }else if(space === isSpace){
      cur += ch;
    }else{
      tokens.push(cur);
      cur = ch;
      isSpace = space;
    }
  }
  if(cur) tokens.push(cur);
  return tokens;
}

let STATE = {
  bookId: null,
  meta: null,
  sections: null,
  settings: null
};

function setHeader(meta){
  document.getElementById("bookTitle").textContent = meta.title || "Reader";
  document.getElementById("hTitle").textContent = meta.title || "—";
  document.getElementById("hSubtitle").textContent = meta.subtitle || "";
  const cover = document.getElementById("cover");
  cover.src = `./books/${STATE.bookId}/${meta.cover || ""}`;
  cover.alt = meta.title || "Cover";
}

function renderFromState(){
  const {meta, sections} = STATE;
  if(!meta || !sections) return;

  const s = loadSettings();
  STATE.settings = s;
  applyTheme(s.theme);
  applyTypography(s);

  const sourceLang = meta.sourceLanguage || "English";
  const targetLang = s.targetLanguage || meta.defaultTarget || "Ukrainian";

  // Update chips
  document.getElementById("chipSource").textContent = shortLang(sourceLang);
  document.getElementById("chipTarget").textContent = shortLang(targetLang);

  // Sync dialog selections
  const dlg = document.getElementById("settingsDialog");
  if(dlg){
    const langSelect = dlg.querySelector("#langSelect");
    const showTranslations = dlg.querySelector("#showTranslations");
    const highlightStyle = dlg.querySelector("#highlightStyle");
    const fontSize = dlg.querySelector("#fontSize");
    const lineHeight = dlg.querySelector("#lineHeight");
    if(langSelect) fillLanguageSelect(langSelect, targetLang);
    if(showTranslations) showTranslations.checked = !!s.showTranslations;
    if(highlightStyle) highlightStyle.value = s.highlightStyle || "underline";
    if(fontSize) fontSize.value = s.fontSize;
    if(lineHeight) lineHeight.value = s.lineHeight;
  }

  const sourceLines = sections.get(sourceLang) || [];
  const targetLines = sections.get(targetLang) || [];

  const content = document.getElementById("content");
  content.innerHTML = "";

  const max = Math.max(sourceLines.length, targetLines.length);

  for(let i=0; i<max; i++){
    const o = sourceLines[i] ?? "";
    const t = targetLines[i] ?? "";

    // Preserve empty lines (make spacing)
    if(o.trim()==="" && t.trim()===""){
      const spacer = document.createElement("div");
      spacer.className = "block";
      spacer.style.height = "10px";
      content.appendChild(spacer);
      continue;
    }

    const block = document.createElement("div");
    block.className = "block";

    const line = document.createElement("div");
    line.className = "line";

    const orig = document.createElement("span");
    orig.className = "orig";

    // Render words as spans for highlight-on-tap
    const tokens = splitWordsKeepingSpaces(o);
    for(const tok of tokens){
      if(tok.trim()===""){
        orig.appendChild(document.createTextNode(tok));
      }else{
        const w = document.createElement("span");
        w.className = "word";
        w.textContent = tok;
        w.addEventListener("click", ()=>{
          // Toggle highlight
          const style = (loadSettings().highlightStyle || "underline");
          const isOn = w.classList.toggle("hl");
          w.dataset.hl = style;
          if(!isOn) w.dataset.hl = style; // keep attribute for CSS consistency
        });
        orig.appendChild(w);
      }
    }

    line.appendChild(orig);

    if(s.showTranslations){
      const tr = document.createElement("span");
      tr.className = "tr";
      tr.textContent = t;
      line.appendChild(tr);
    }

    block.appendChild(line);
    content.appendChild(block);
  }
}

function shortLang(name){
  // quick 2-letter fallback
  const code = LANGUAGE_CODES[name];
  if(code) return code.toUpperCase();
  return (name||"??").slice(0,2).toUpperCase();
}

function wireSettingsChangeLive(){
  window.addEventListener("storage", (e)=>{
    if(e.key === STORAGE_KEY) renderFromState();
  });
}

(async function init(){
  const s = loadSettings();
  applyTheme(s.theme);
  applyTypography(s);
  wireThemeButton();
  wireSettingsDialog();
  wireSettingsChangeLive();

  const bookId = getBookId();
  STATE.bookId = bookId;

  try{
    const meta = await loadBookMeta(bookId);
    STATE.meta = meta;
    setHeader(meta);

    const text = await loadBookContent(bookId, meta.content || "content.txt");
    const sections = parseLangSections(text);
    STATE.sections = sections;

    // If the selected language isn't available in this book, fall back to Ukrainian, then English.
    const preferred = loadSettings().targetLanguage || meta.defaultTarget || "Ukrainian";
    if(!sections.has(preferred)){
      const next = sections.has("Ukrainian") ? "Ukrainian" : (sections.keys().next().value || "English");
      saveSettings({...loadSettings(), targetLanguage: next});
    }

    renderFromState();
  }catch(err){
    const content = document.getElementById("content");
    content.innerHTML = `<div class="hero"><b>Reader error</b><div class="brand-sub">${escapeHtml(err.message)}</div></div>`;
    console.error(err);
  }
})();
