# Architecture

AlkindiX is a zero-build static site served from `public/` by Vercel. It uses HTML,
two shared stylesheets, and one shared JavaScript file.

## Public routes

| Route | Source |
| --- | --- |
| `/` | `public/index.html` |
| `/about` | `public/about.html` |
| `/projects` | `public/projects.html` |
| `/research` | `public/research.html` |
| `/open-source` | `public/open-source.html` |
| `/awards` | `public/awards.html` |
| `/creative` | `public/creative/index.html` |
| `/creative/photography` | `public/creative/photography/index.html` |
| `/creative/memoir` | `public/creative/memoir/index.html` |

Legacy routes for `/memoir`, `/photography`, `/systems`, and `/integers` redirect
to their current destinations.

## Shared files

| File | Responsibility |
| --- | --- |
| `public/css/styles.css` | Design tokens, navigation, buttons, interaction states, footer, and responsive rules |
| `public/css/portfolio.css` | Shared portfolio layout, loaded after `styles.css` and inline page styles |
| `public/js/app.js` | Mobile navigation, active links, scroll state, reveal effects, gallery filters, and lightbox behavior |
| `public/images/photography/` | Web-optimized photography archive |
| `public/sitemap.xml` | Canonical public pages |
| `vercel.json` | Output directory, redirects, security headers, and cache policy |

All JavaScript features initialize only when their matching elements exist.

## Domain consolidation

`photographyx.org` redirects to `/creative/photography`, and
`architectofsilence.com` redirects to `/creative/memoir`.
