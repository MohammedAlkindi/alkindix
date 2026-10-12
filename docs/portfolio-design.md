# Portfolio design

The homepage leads with Mohammed’s name and current education; the Projects page carries the three resume projects. Descriptions explain what each tool does and link directly to the work. Performance figures are attributed to the supplied resume; contribution counts are dated and backed by GitHub queries.

Use the original near-black background, white text and links, subtle grid, pill buttons, and compact homepage. The earlier charcoal/green redesign was rejected by Mohammed and has been replaced. Keep project descriptions current and avoid promotional scorecards and count-up effects. Keep creative work accessible without placing every section in the main navigation.

Content renders without JavaScript. Motion is limited to short transitions; respect reduced-motion preferences. Mobile navigation and the photo viewer keep focus inside the open panel, make the background inert, close on Escape, and restore focus. Both desktop and mobile expose a resume link.

The zero-build static architecture remains. `portfolio.css` loads after the older page styles; all shared assets use versioned URLs. `resume.tex` is historical until synchronized with Mohammed’s current master PDF.
