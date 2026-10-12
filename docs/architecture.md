# Architecture

AlkindiX is a zero-build static site served from `public/` by Vercel.

## Public routes

| Route | Source |
| --- | --- |
| `/` | `public/index.html`: hero, work, open source, about, photography |
| `/creative` | `public/creative/index.html` |
| `/creative/photography` | `public/creative/photography/index.html` |
| `/creative/memoir` | `public/creative/memoir/index.html` |
| `/resume.pdf` | `public/resume.pdf` |

The old pages (`/about`, `/awards`, `/projects`, `/research`, `/open-source`,
`/integers`, `/systems`) redirect to the matching section of the homepage.
`/memoir` and `/photography` redirect to their `/creative` routes.

## Files

| File | Responsibility |
| --- | --- |
| `public/css/site.css` | Homepage tokens, layout, light and dark themes |
| `public/js/site.js` | Hero trajectories, stopping-time plot, chart reveal, sticky bar state |
| `public/css/styles.css`, `public/js/app.js` | Creative pages (photography gallery, memoir) |
| `public/img/` | Homepage images (Ridge screenshot) |
| `public/images/photography/` | Web-optimized photography archive and thumbnails |
| `vercel.json` | Output directory, redirects, security headers, cache policy |

Both homepage plots compute the Collatz map in the browser. With JavaScript off,
the page still reads in full; only the two canvases stay empty.

## Domain consolidation

`architectofsilence.com` redirects to `/creative/memoir`.
