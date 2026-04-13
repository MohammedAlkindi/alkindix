# Alkindi — alkindix.com

Personal HQ for systems, computation, photography, and thoughtful work.

## Structure

```
/
├── vercel.json          # Routing, redirects, headers
├── README.md
│
├── images/              # Photography assets (h1.jpg, v1.jpg, ...)
│   ├── h1.jpg           # Horizontal series (h1–h50)
│   ├── v1.jpg           # Vertical series (v1–v50)
│   └── ...
│
└── public/              # All HTML, CSS, JS
    ├── index.html       # Home         → alkindix.com/
    ├── about.html       # About        → alkindix.com/about
    ├── photography.html # Photography  → alkindix.com/photography
    ├── memoir.html      # Memoir       → alkindix.com/memoir
    ├── styles.css       # Shared design system
    └── app.js           # Shared behavior (nav, scroll, reveal)
```

## Routes

| URL | File |
|-----|------|
| `alkindix.com/` | `public/index.html` |
| `alkindix.com/about` | `public/about.html` |
| `alkindix.com/photography` | `public/photography.html` |
| `alkindix.com/memoir` | `public/memoir.html` |
| `alkindix.com/linkedin` | → linkedin.com/in/alkindi-network/ |
| `alkindix.com/github` | → github.com/MohammedAlkindi/ |
| `alkindix.com/read` | → architectofsilence.com |

## Photography images

Place images in `/images/` named:
- `h1.jpg`, `h2.jpg`, ... `h50.jpg` — horizontal/landscape
- `v1.jpg`, `v2.jpg`, ... `v50.jpg` — vertical/portrait

Supported formats: `jpg`, `jpeg`, `png`, `webp` (any case).

## Deploy

Push to GitHub, connect to Vercel. No build step required — pure static HTML.