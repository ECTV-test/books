// Book details page
(function(){
  const qs = new URLSearchParams(location.search);
  const id = qs.get("id");
  if(!id){ location.href = "index.html"; return; }

  const $ = (s)=>document.querySelector(s);

  function fmtDuration(sec){
    if(!sec && sec!==0) return "—";
    const m = Math.round(sec/60);
    return `${m} хв`;
  }

  async function loadMeta(){
    const res = await fetch(`data/books/${id}/meta.json?cb=${Date.now()}`);
    if(!res.ok) throw new Error("meta.json not found");
    return await res.json();
  }

  function setText(sel, val){ $(sel).textContent = val ?? "—"; }

  loadMeta().then(meta=>{
    document.title = meta.title || "Book";
    $("#coverImg").src = meta.cover || "";
    setText("#publisher", meta.publisher || "");
    setText("#title", meta.title || "");
    setText("#level", meta.level || "");
    setText("#narrator", meta.narrator || "Диктор");
    setText("#duration", fmtDuration(meta.durationSeconds || meta.duration || 0));
    setText("#subtitle", meta.subtitle || "");
    setText("#description", meta.description || meta.blurb || "");

    const readUrl = `reader.html?id=${encodeURIComponent(id)}`;
    $("#readBtn").href = readUrl;
    $("#listenBtn").href = readUrl + "&autoplay=1";
  }).catch(err=>{
    console.error(err);
    alert("Не вдалося завантажити книгу. Перевір папку data/books/<id>/meta.json");
    location.href = "index.html";
  });
})();
