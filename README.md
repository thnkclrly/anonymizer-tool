# Text Anonymizer

A fully client-side text anonymization tool. Scrub PII and sensitive corporate data from text before pasting it into external AI tools like ChatGPT or Claude.

**All processing happens in your browser. Zero data is transmitted anywhere.**

## Features

- **Three-layer detection:** Regex patterns (emails, phones, IBANs, IDs), NLP named entity recognition (names, organizations, places via Compromise.js), and a custom corporate dictionary
- **Contextual placeholders:** Entities are replaced with readable tags like `<PERSON_1>`, `<EMAIL_1>`, `<CLIENT_NAME_1>` — preserving grammatical structure for AI comprehension
- **Consistent mapping:** The same entity always maps to the same placeholder
- **Visual diff:** Color-coded badges in the output show what was replaced, with hover tooltips
- **Entity map:** Full list of all replacements for review
- **Aggressive mode:** Toggle to also catch monetary amounts and other edge cases
- **Keyboard shortcuts:** `⌘+Enter` to anonymize, `⌘+Shift+C` to copy

## Quick Start (Local)

No build step required. Just open `index.html` in your browser:

```bash
# macOS
open index.html

# Or use any local server
python3 -m http.server 8000
# Then visit http://localhost:8000
```

## Deploy to GitHub Pages

1. Create a new GitHub repository (e.g., `text-anonymizer`)
2. Push this code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/text-anonymizer.git
   git push -u origin main
   ```
3. Go to **Settings → Pages**
4. Under **Source**, select **Deploy from a branch**
5. Choose **main** branch, **/ (root)** folder
6. Click **Save**
7. Your site will be live at `https://YOUR_USERNAME.github.io/text-anonymizer/` within ~60 seconds

## Customizing the Corporate Dictionary

Edit `config.js` to add your company's sensitive terms:

```javascript
const CORPORATE_TERMS = [
  { term: "Your Client Name", category: "CLIENT_NAME" },
  { term: "Secret Project", category: "PROJECT_CODENAME" },
  { term: "Internal Tool", category: "INTERNAL_TOOL" },
  // Add more...
];
```

## File Structure

```
├── index.html    # Main page + embedded CSS
├── app.js        # Anonymization engine + UI logic
├── config.js     # Corporate dictionary + regex patterns (edit this!)
└── README.md     # This file
```

## Tech Stack

- **Compromise.js** (v14) — lightweight NLP library for named entity recognition, loaded via CDN
- **Vanilla JS** — zero framework dependencies
- **Zero build step** — static files only

## License

Internal use.
