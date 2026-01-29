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
  // Prefer Ukrainian first
  langs.sort((a,b)=> (a==="Ukrainian")?-1:(b==="Ukrainian")?1:a.localeCompare(b));
  for(const l of langs){
    const opt = document.createElement("option");
    opt.value = l;
    opt.textContent = l;
    if(l === current) opt.selected = true;
    select.appendChild(opt);
  }
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
    // pages can react to settings via storage event, but in-page just refresh render if needed
    window.dispatchEvent(new Event("books:settingsChanged"));
  });
}

async function loadBooks(){
  const res = await fetch("./books/books.json", {cache:"no-store"});
  if(!res.ok) throw new Error(`books.json not found (${res.status})`);
  return res.json();
}

function renderGrid(books){
  const grid = document.getElementById("grid");
  if(!grid) return;
  grid.innerHTML = "";
  for(const item of books.items || []){
    const card = document.createElement("div");
    card.className = "card";
    card.tabIndex = 0;

    const img = document.createElement("img");
    img.alt = item.title || "Cover";
    img.src = item.cover || "";
    card.appendChild(img);

    const pad = document.createElement("div");
    pad.className = "pad";
    pad.innerHTML = `<div class="title">${escapeHtml(item.title||"Untitled")}</div>
                     <div class="sub">${escapeHtml(item.subtitle||"")}</div>`;
    card.appendChild(pad);

    const open = ()=> location.href = `reader.html?book=${encodeURIComponent(item.id)}`;
    card.addEventListener("click", open);
    card.addEventListener("keydown", (e)=>{ if(e.key==="Enter"||e.key===" "){e.preventDefault(); open();}});
    grid.appendChild(card);
  }
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
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

(function init(){
  const s = loadSettings();
  applyTheme(s.theme);
  applyTypography(s);
  wireThemeButton();
  wireSettingsDialog();

  loadBooks()
    .then(renderGrid)
    .catch(err=>{
      const grid = document.getElementById("grid");
      if(grid){
        grid.innerHTML = `<div class="hero"><b>Cannot load /books/books.json</b><div class="brand-sub">${escapeHtml(err.message)}</div></div>`;
      }
      console.error(err);
    });
})();
