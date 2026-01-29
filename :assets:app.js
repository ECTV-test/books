<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta http-equiv="Content-Style-Type" content="text/css">
  <title></title>
  <meta name="Generator" content="Cocoa HTML Writer">
  <meta name="CocoaVersion" content="2685.4">
  <style type="text/css">
    body {background-color: #f4f5fa}
    p.p1 {margin: 0.0px 0.0px 0.0px 0.0px; font: 12.0px 'Helvetica Neue'; color: #0f121c; -webkit-text-stroke: #0f121c}
    p.p2 {margin: 0.0px 0.0px 0.0px 0.0px; font: 12.0px 'Helvetica Neue'; color: #0f121c; -webkit-text-stroke: #0f121c; min-height: 15.0px}
    span.s1 {font-kerning: none}
  </style>
</head>
<body>
<p class="p1"><span class="s1">const App = (() =&gt; {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>// 6 языков в настройках: Ukrainian по умолчанию</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>const LANGS = [</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>{ code: "en", label: "English", <span class="Apple-converted-space">  </span>tag: "English" },</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>{ code: "uk", label: "Ukrainian", tag: "Ukrainian" },</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>{ code: "fr", label: "French",<span class="Apple-converted-space">    </span>tag: "French" },</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>{ code: "pl", label: "Polish",<span class="Apple-converted-space">    </span>tag: "Polish" },</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>{ code: "de", label: "German",<span class="Apple-converted-space">    </span>tag: "German" },</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>{ code: "es", label: "Spanish", <span class="Apple-converted-space">  </span>tag: "Spanish" },</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>];</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>const DEFAULTS = {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>translationLang: "uk",</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>highlightStyle: "default",</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>origSize: 20,</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>lineHeight: 1.5</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>};</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>function qs(name) {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>return new URLSearchParams(location.search).get(name);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>}</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>function setRootVars({origSize, lineHeight, highlightStyle}) {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>document.documentElement.style.setProperty("--orig-size", `${origSize}px`);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>document.documentElement.style.setProperty("--lh", `${lineHeight}`);</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>if (highlightStyle === "yellow") {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>document.documentElement.style.setProperty("--hl-bg", "rgba(255, 213, 79, .28)");</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>document.documentElement.style.setProperty("--hl-br", "rgba(255, 213, 79, .62)");</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>document.documentElement.style.setProperty("--hl-tx", "rgba(234,240,255,1)");</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>} else if (highlightStyle === "invert") {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>document.documentElement.style.setProperty("--hl-bg", "rgba(0,0,0,.70)");</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>document.documentElement.style.setProperty("--hl-br", "rgba(255,255,255,.20)");</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>document.documentElement.style.setProperty("--hl-tx", "rgba(255,255,255,1)");</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>} else {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>document.documentElement.style.setProperty("--hl-bg", "rgba(108,124,255,.22)");</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>document.documentElement.style.setProperty("--hl-br", "rgba(108,124,255,.55)");</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>document.documentElement.style.setProperty("--hl-tx", "rgba(234,240,255,1)");</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>}</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>}</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>function loadPrefs() {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>try {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>const raw = localStorage.getItem("readerPrefs");</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>const p = raw ? JSON.parse(raw) : {};</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>return { ...DEFAULTS, ...p };</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>} catch {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>return { ...DEFAULTS };</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>}</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>}</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>function savePrefs(prefs) {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>localStorage.setItem("readerPrefs", JSON.stringify(prefs));</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>}</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>async function fetchJSON(path) {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const res = await fetch(path, { cache: "no-store" });</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>return await res.json();</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>}</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>// Парсер файла с блоками lang:...</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>function parseLangBlocks(raw) {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>// нормализуем переносы</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>raw = raw.replace(/\r\n/g, "\n");</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>// найдём все заголовки "lang:..."</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const re = /^lang:(.+)$/gm;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const hits = [];</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>let m;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>while ((m = re.exec(raw)) !== null) {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>hits.push({ idx: m.index, tag: m[1].trim() });</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>}</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>if (!hits.length) return {};</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const blocks = {};</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>for (let i = 0; i &lt; hits.length; i++) {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>const start = hits[i].idx;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>const end = (i + 1 &lt; hits.length) ? hits[i + 1].idx : raw.length;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>const tag = hits[i].tag;</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>// content starts after the header line</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>const headerEnd = raw.indexOf("\n", start);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>const content = raw.slice(headerEnd + 1, end).trim();</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>// lines: сохраняем пустые строки тоже, но убираем лишние хвостовые</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>const lines = content.split("\n").map(s =&gt; s.replace(/\s+$/g, ""));</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>blocks[tag] = lines;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>}</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>return blocks;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>}</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>// Приводим перевод к длине английского</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>function alignToEnglish(blocks, targetTag) {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const en = blocks["English"] || [];</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const tr = blocks[targetTag] || [];</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const max = en.length;</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const trAligned = [];</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>for (let i = 0; i &lt; max; i++) trAligned.push(tr[i] ?? "");</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>return { en, tr: trAligned };</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>}</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>function normalizeForTTS(line) {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>// пропускаем визуальные разделители</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>if (!line) return "";</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const s = line.trim();</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>if (!s) return "";</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>if (/^_{5,}$/.test(s)) return "";</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>return s;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>}</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>// ========== PAGES ==========</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>async function renderCatalog() {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const catalog = await fetchJSON("data/catalog.json");</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const el = document.getElementById("catalog");</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>el.innerHTML = "";</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>for (const b of catalog.books) {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>const a = document.createElement("a");</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>a.className = "card";</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>a.href = `book.html?id=${encodeURIComponent(b.id)}`;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>a.innerHTML = `</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">        </span>&lt;img src="${b.cover}" alt="Cover"&gt;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">        </span>&lt;div&gt;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">          </span>&lt;div class="card__title"&gt;${escapeHTML(b.title)}&lt;/div&gt;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">          </span>&lt;div class="card__sub"&gt;${escapeHTML(b.level)}&lt;/div&gt;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">        </span>&lt;/div&gt;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>`;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>el.appendChild(a);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>}</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>}</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>async function renderBookPage() {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const id = qs("id");</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const backBtn = document.getElementById("backBtn");</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>backBtn.onclick = () =&gt; location.href = "index.html";</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const meta = await fetchJSON(`data/books/${id}/meta.json`);</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>document.title = meta.title;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>document.getElementById("bookTitle").textContent = meta.title;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>document.getElementById("title").textContent = meta.title;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>document.getElementById("level").textContent = meta.level;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>document.getElementById("desc").textContent = meta.description;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>document.getElementById("cover").src = meta.cover;</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>document.getElementById("listenBtn").href = `reader.html?id=${encodeURIComponent(id)}`;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>document.getElementById("homeBtn").href = "index.html";</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>}</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>async function renderReader() {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const id = qs("id");</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const prefs = loadPrefs();</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>setRootVars(prefs);</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>// Back</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>document.getElementById("backBtn").onclick = () =&gt; location.href = `book.html?id=${encodeURIComponent(id)}`;</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>// Title</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const meta = await fetchJSON(`data/books/${id}/meta.json`);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>document.getElementById("readerTitle").textContent = meta.title;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>document.title = meta.title;</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>// Load translations file</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const txtRes = await fetch(`data/books/${id}/translations.txt`, { cache: "no-store" });</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>if (!txtRes.ok) throw new Error(`translations.txt load failed: ${txtRes.status}`);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const raw = await txtRes.text();</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const blocks = parseLangBlocks(raw);</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>// Build language select (только те, что реально есть)</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const langSelect = document.getElementById("langSelect");</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>langSelect.innerHTML = "";</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const available = LANGS.filter(l =&gt; blocks[l.tag]);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>for (const l of available) {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>const opt = document.createElement("option");</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>opt.value = l.code;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>opt.textContent = l.label;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>langSelect.appendChild(opt);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>}</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>// Ukrainian default</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>if (!available.some(l =&gt; l.code === prefs.translationLang)) {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>prefs.translationLang = available.some(l =&gt; l.code === "uk") ? "uk" : available[0]?.code || "en";</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>savePrefs(prefs);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>}</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>langSelect.value = prefs.translationLang;</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>// Highlight style, font size, line height</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const hlSelect = document.getElementById("hlSelect");</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const fontSize = document.getElementById("fontSize");</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const lineHeight = document.getElementById("lineHeight");</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>hlSelect.value = prefs.highlightStyle;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>fontSize.value = prefs.origSize;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>lineHeight.value = prefs.lineHeight;</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>// Render lines</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const linesEl = document.getElementById("lines");</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>function codeToTag(code) {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>const found = LANGS.find(l =&gt; l.code === code);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>return found ? found.tag : "Ukrainian";</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>}</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>let currentLangTag = codeToTag(prefs.translationLang);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>let aligned = alignToEnglish(blocks, currentLangTag);</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>function renderLines() {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>linesEl.innerHTML = "";</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>for (let i = 0; i &lt; aligned.en.length; i++) {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">        </span>const orig = aligned.en[i] ?? "";</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">        </span>const tr = aligned.tr[i] ?? "";</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">        </span>const div = document.createElement("div");</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">        </span>div.className = "line";</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">        </span>div.dataset.i = String(i);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">        </span>div.innerHTML = `</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">          </span>&lt;div class="line__orig"&gt;${escapeHTML(orig)}&lt;/div&gt;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">          </span>&lt;div class="line__tr"&gt;${escapeHTML(tr)}&lt;/div&gt;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">        </span>`;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">        </span>linesEl.appendChild(div);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>}</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>updateProgressUI();</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>}</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>// ===== TTS: читаем строками, подсвечиваем строку =====</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>let idx = 0;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>let isPlaying = false;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>let cancelRequested = false;</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const playBtn = document.getElementById("playBtn");</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const pauseBtn = document.getElementById("pauseBtn");</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const progress = document.getElementById("progress");</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const pos = document.getElementById("pos");</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const total = document.getElementById("total");</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>function updateProgressUI() {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>const n = aligned.en.length;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>progress.max = String(Math.max(0, n - 1));</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>total.textContent = String(n);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>pos.textContent = String(idx + 1);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>progress.value = String(idx);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>}</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>function setActive(i) {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>const prev = linesEl.querySelector(".line.active");</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>if (prev) prev.classList.remove("active");</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>const cur = linesEl.querySelector(`.line[data-i="${i}"]`);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>if (cur) {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">        </span>cur.classList.add("active");</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">        </span>cur.scrollIntoView({ block: "center", behavior: "smooth" });</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>}</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>idx = i;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>updateProgressUI();</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>}</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>function stopTTS() {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>cancelRequested = true;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>isPlaying = false;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>try { window.speechSynthesis.cancel(); } catch {}</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>}</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>async function speakFrom(startIndex) {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>if (!("speechSynthesis" in window)) {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">        </span>alert("Speech Synthesis is not supported in this browser.");</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">        </span>return;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>}</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>cancelRequested = false;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>isPlaying = true;</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>for (let i = startIndex; i &lt; aligned.en.length; i++) {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">        </span>if (cancelRequested) break;</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">        </span>const line = normalizeForTTS(aligned.en[i]);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">        </span>setActive(i);</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">        </span>// пустые/разделители не озвучиваем, но подсветка остаётся</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">        </span>if (!line) continue;</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">        </span>await new Promise((resolve) =&gt; {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">          </span>const u = new SpeechSynthesisUtterance(line);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">          </span>u.lang = "en-US"; // оригинал — English; потом можно сделать выбор</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">          </span>u.rate = 1.0;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">          </span>u.onend = resolve;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">          </span>u.onerror = resolve;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">          </span>window.speechSynthesis.speak(u);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">        </span>});</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>}</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>isPlaying = false;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>}</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>playBtn.onclick = () =&gt; {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>if (isPlaying) return;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>speakFrom(idx);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>};</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>pauseBtn.onclick = () =&gt; {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>stopTTS();</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>};</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>progress.addEventListener("input", () =&gt; {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>const v = Number(progress.value);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>setActive(v);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>if (isPlaying) {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">        </span>stopTTS();</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">        </span>speakFrom(v);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>}</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>});</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>// ===== Settings modal =====</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const modal = document.getElementById("modal");</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const settingsBtn = document.getElementById("settingsBtn");</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const closeModal = document.getElementById("closeModal");</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const backdrop = document.getElementById("backdrop");</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>function openModal() {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>modal.classList.add("open");</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>modal.setAttribute("aria-hidden", "false");</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>}</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>function close() {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>modal.classList.remove("open");</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>modal.setAttribute("aria-hidden", "true");</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>}</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>settingsBtn.onclick = openModal;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>closeModal.onclick = close;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>backdrop.onclick = close;</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>langSelect.onchange = () =&gt; {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>const code = langSelect.value;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>prefs.translationLang = code;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>savePrefs(prefs);</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>currentLangTag = codeToTag(code);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>aligned = alignToEnglish(blocks, currentLangTag);</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>// сохраняем позицию</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>const keep = Math.min(idx, Math.max(0, aligned.en.length - 1));</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>renderLines();</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>setActive(keep);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>};</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>hlSelect.onchange = () =&gt; {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>prefs.highlightStyle = hlSelect.value;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>savePrefs(prefs);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>setRootVars(prefs);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>};</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>fontSize.oninput = () =&gt; {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>prefs.origSize = Number(fontSize.value);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>savePrefs(prefs);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>setRootVars(prefs);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>};</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>lineHeight.oninput = () =&gt; {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>prefs.lineHeight = Number(lineHeight.value);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>savePrefs(prefs);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>setRootVars(prefs);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>};</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>// initial render</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>renderLines();</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>setActive(0);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>}</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>function escapeHTML(s) {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>return String(s ?? "")</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>.replaceAll("&amp;", "&amp;amp;")</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>.replaceAll("&lt;", "&amp;lt;")</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>.replaceAll("&gt;", "&amp;gt;")</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>.replaceAll('"', "&amp;quot;")</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>.replaceAll("'", "&amp;#039;");</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>}</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>return { renderCatalog, renderBookPage, renderReader };</span></p>
<p class="p1"><span class="s1">})();</span></p>
</body>
</html>
