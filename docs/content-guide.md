# Content Guide

## Homepage

Everything a recruiter needs lives on `public/index.html`, in this order: hero,
work, open source, about, photography. Keep each project to two short paragraphs,
two facts and its links. Every number should trace to something checkable: a test
run, a benchmark, or a GitHub query.

Numbers to refresh when they change:

- Merged pull request total and the per-owner bars in `#open-source`
  (GitHub search: `author:MohammedAlkindi is:pr is:merged -user:MohammedAlkindi`).
- Test counts and benchmark figures in `#work`.
- `public/resume.pdf`, which should match the current resume.

## Creative work

`public/creative/index.html` links to the photography archive and Architect of Silence.
The photography page lists every numbered image in `public/images/photography/`.
When the archive changes, run `scripts/make-thumbs.py`, update the gallery markup in
`public/creative/photography/index.html`, and keep image loading lazy after the first row.

## Search metadata

Each public page should have a descriptive title, meta description and canonical URL.
Update `public/sitemap.xml` when a canonical route is added or removed.
