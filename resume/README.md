# Resume

`resume.tex` is the single source. Build it, then copy the PDF to `public/resume.pdf`, to
`Career/Resumes/Resume.pdf` in his Google Drive, and to dotgithub `infra/data/resume.pdf` (the copy
the opportunities routine attaches). All three were brought back in line on 24 October 2026; before
that the site and Drive served a LibreOffice export from 12 October that this source did not generate.

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
take the distinct `repository_url` values. As of 2026-10-26 that is 203 merged pull
requests across 47 projects (60 at Microsoft, 22 at NVIDIA), 45 closed unmerged, so 82% accepted.
NVIDIA counts both the `NVIDIA` and `NVIDIA-NeMo` orgs (9 + 13).

The "LLM and AI agent tooling" figure (69 on 2026-10-26) is the merged count in exactly these
repositories: microsoft/hve-core (32), NVIDIA-NeMo/Automodel (13), microsoft/apm (8),
mcp-use/mcp-use (7), NVIDIA/NeMo-Agent-Toolkit (5), NVIDIA/SkillSpector (3) and NVIDIA/garak (1).
Add a repository to this list before counting it.

**Applicant tracking systems read the text layer, not the page.** Before
2026-10-09 a strict parser read the contact line as one token
(`CA·malkindi@ucsd.edu·github.com/...`) and glued every date onto its title
(`Computer ScienceExpected Jun 2030`). The preamble now turns on real space
characters (`\pdfinterwordspaceon`), Unicode glyph mapping and no hyphenation,
entries are no longer tables, and separators are a plain `|`. Check after any
layout change:

```bash
python3 -c "
import re; from pypdf import PdfReader
t = PdfReader('resume.pdf').pages[0].extract_text(); L = t.splitlines()
print('email:', re.findall(r'[\w.+-]+@[\w-]+\.[\w.]+', t))
print('glued dates:', [l for l in L if re.search(r'[a-z](Sep|Jun|Aug|Expected)', l)])
print('split words:', [l for l in L if l.endswith('-')])
"
```

The email must come back as `malkindi@ucsd.edu` alone and both lists must be empty.
