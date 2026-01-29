# Books template (design-preserving)

## Как добавить новую книгу
1) Скопируй папку `data/books/invisible-sandwich/` и переименуй (например) в `data/books/my-new-book/`
2) Внутри папки:
   - `cover.jpg` — обложка
   - `book.txt` — оригинальный текст (English)
   - `translations.txt` — переводы в формате:
     `lang:English` ... затем `lang:Ukrainian` ... и т.д.
   - `meta.json` — обнови поля `id`, `title`, `cover`, `book`, `translations`
3) Добавь книгу в `data/catalog.json`

## По умолчанию
- Язык перевода: украинский (если есть в translations.txt)
- Перевод показывается строкой под оригиналом
- Тема/скорость/размер/подсветка сохраняются в localStorage

## GitHub Pages
- В репозитории: Settings → Pages → Deploy from branch → Branch: main, folder: /root
- Открывай `https://<user>.github.io/<repo>/`
