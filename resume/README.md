# Resume

`resume.tex` is the source. `public/resume.pdf` is the copy the site serves; it is
generated, never edited by hand.

## Build

```bash
cd resume
pdflatex -interaction=nonstopmode -halt-on-error resume.tex
cp resume.pdf ../public/resume.pdf
```

TeX Live supplies everything used here (`helvet`, `geometry`, `titlesec`,
`enumitem`, `tabularx`, `hyperref`, `microtype`). There is no external template.

## Checks before sending it anywhere

**It must stay one page.** The build log ends with `Output written on resume.pdf
(1 page…)`. Two pages means something above grew; trim, do not shrink the type.

```bash
python3 -c "from pypdf import PdfReader; print(len(PdfReader('resume.pdf').pages))"
```

**The LinkedIn handle contains a double hyphen**, and LaTeX turns `--` into an
en-dash in text mode. It is written `mohammed{-}{-}alkindi` for that reason. If
the printed URL ever shows a single long dash, the link is dead for anyone who
retypes it — the June 2026 PDF shipped with exactly that defect, alongside a
handle (`alkindi-network`) that was not his. Verify the visible text, not just
the clickable target:

```bash
python3 -c "
from pypdf import PdfReader
t = PdfReader('resume.pdf').pages[0].extract_text()
line = [l for l in t.splitlines() if 'linkedin' in l.lower()][0]
print(repr(line)); print('double hyphen present:', '--' in line)
"
```

**The open-source figures are measured, not estimated.** Re-derive them before
any send; they move every week.

```bash
gh api -X GET search/issues \
  -f q='is:pr author:MohammedAlkindi is:merged -user:MohammedAlkindi' \
  --jq '.total_count'
```

For the project count and the combined stars, page through the same query and
take the distinct `repository_url` values. As of 2026-09-15 that is 110 merged
pull requests across 32 projects carrying 626,632 stars.
