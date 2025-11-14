# Visual Language Guide

- **Contrast-First Palette**: The UI leans on high-contrast black and white, treating mid greys (`#f5f5f5`, `#e0e0e0`, `#666`) as supporting tones for depth and hierarchy. Cards and toggles use white backgrounds with black borders; active states invert to black backgrounds with white text for clarity.

- **Geometric Structure**: Components rely on rectangles with tight 4 px radii and generous gutters (15–40 px) to keep dense information readable. Cards stack in flex and CSS grid layouts with `gap` rather than margin spacing to preserve rhythm across breakpoints.

- **Card Framing & Grouping**: Every logical group—workflow steps, category clusters, presets, expandable info—sits inside a bordered box to echo the "control panel" aesthetic. Headings keep a moderate weight (500–600) and sit alongside circular info buttons that repeat the black/white theme.

- **Stateful Toggles & Buttons**: Modes, cards, and presets all communicate state with border weight, drop shadows, and inverted fills. Active items add 1 px thicker borders plus subtle lift shadows; inactive items fade to soft grey while staying legible.

- **Interactive Micro-Patterns**: Hover states generally lighten backgrounds or scale buttons by 1–2 px, maintaining minimal motion. Circular info buttons and slider thumbs flip colours on hover, reinforcing the tactile, hardware-inspired feel.

- **Typography & Copy Tone**: Headings use `clamp()` to scale between desktop and mobile, with tight letter-spacing for assertive titles. Body copy sits around 0.95–1.05 rem and uses neutral greys to soften descriptions, keeping the focus on controls rather than paragraphs.

- **Expandable & Enumerated Content**: Accordion panels stay framed by black borders, and lists use custom markers—black discs or numbered circles—to maintain visual coherence with the rest of the UI chrome.

- **Control Styling**: Sliders and numeric outputs favour restrained greys with black text. Thumbs are solid black circles with white borders to echo the mode toggles and step badges, helping disparate inputs feel related.

- **Dark Mode Philosophy**: Dark mode inverts backgrounds to near-black, but keeps borders white to preserve the signature frame. Active elements flip to white with black text so hierarchy survives the inversion. This makes it easy to port the aesthetic: treat every surface as a "card" with a border; invert the card and text colours in dark mode while keeping the geometry identical.

## How to Reuse the System Elsewhere

- Start with a monochrome palette, then introduce greys only to suggest depth; keep accents rare and purposeful.
- Wrap each functional module in a bordered card with a 4 px radius and internal padding ~20–25 px.
- Use grid or flex layouts with consistent gaps (15–40 px) instead of ad-hoc margins to maintain rhythm across viewports.
- Signal state changes by inverting black and white, increasing border weight, and adding subtle elevation; avoid colour-coding unless absolutely necessary.
- Maintain consistent micro-interactions: 0.2 s transitions, small hover lifts, and scaling info icons to 110%.
- For dark mode, invert surfaces but retain the same border logic to keep the "outlined hardware" feel intact.
- Keep typography assertive: bold, condensed headings for section labels, subdued greys for descriptive text, and numbered/bulleted lists with custom markers that mirror the circular badges used elsewhere.
