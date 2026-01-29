# Books (GitHub Pages template)

This is a static (no backend) library/reader for multi-language books.

## How to add a new book (constructor)

1) Create a folder:

`/books/<book-id>/`

Example: `/books/my-new-book/`

2) Put 3 files inside:

- `book.json`
- `content.txt`
- `cover.svg` (or `cover.jpg` / `cover.png`)

3) Add the book to `/books/books.json`

---

## book.json example

```json
{
  "id": "my-new-book",
  "title": "My Book Title",
  "subtitle": "Short subtitle",
  "cover": "cover.svg",
  "content": "content.txt",
  "sourceLanguage": "English",
  "defaultTarget": "Ukrainian"
}
```

## content.txt format

One file with multiple language sections, each starting with:

`lang: <LanguageName>`

Example:

```
lang: English
Line 1
Line 2

lang: Ukrainian
Рядок 1
Рядок 2

lang: French
Ligne 1
Ligne 2
```

**Important:** for "translation under each line" to match nicely, try to keep the SAME number of lines in every language section.

---

## GitHub Pages (how to publish)

1) Create a repo (or open your repo)
2) Upload these files to the repo root
3) Go to: **Settings → Pages**
4) Set:
- Source: **Deploy from a branch**
- Branch: **main**
- Folder: **/(root)**
5) Save

Your site becomes:
`https://<username>.github.io/<repo>/`

If the repo name is `books`, the URL will be:
`https://<username>.github.io/books/`

---

## Common problems

- **404 / files not found**: paths are case-sensitive on GitHub Pages. `Books` ≠ `books`.
- **Nothing updates**: hard-refresh (Cmd+Shift+R) or wait for Pages build to finish.
- **Red highlight / errors in GitHub editor**: it often warns about missing files or wrong paths. Make sure `index.html` is in the repo root and scripts are in `/assets/`.
