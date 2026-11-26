# Design Revamp Research — Inspiration Sites & Patterns

## Product Identity
**This is NOT a course. It's a REFERENCE TOOL.**
Users come back to: find the right framework, review it, use templates/builders, compare options, brush up before meetings/interviews. Design for: finding → using → leaving → coming back.

---

## Key Patterns by Source

### Brilliant.org
- Flat tab navigation (Today/Courses/Practice) — shallow, not deep trees
- Category filter pills with bold per-topic colors
- Curated dashboard feed, not a grid dump of everything
- One-concept-per-screen lesson structure
- 12px border-radius, warm subtle shadows
- Color-coded learning paths (distinct per subject area)
- Generous whitespace and clear section breaks
- Custom illustrations/icons on every card
- CoFo Sans-style clean product typography (clear weight hierarchy)
- Micro-celebrations and progress feedback
- Skeleton loading states with shimmer animation
- 200ms transitions (snappy, not sluggish)

### Stripe Docs
- Three-column layout: sidebar (nav) + center (content) + right (contextual TOC)
- Section compression — show headings collapsed, expand what you need
- Multi-directional navigation: forward (CTAs), back (breadcrumbs), sideways (sidebar), contextual (TOC)
- Custom Cmd+K search modal across all content
- Premium typography (Sohne variable font, clear hierarchy)
- Restrained color palette — white/dark base with purple/blue accents only
- Generous whitespace = the biggest contributor to "premium feel"
- Subtle borders/dividers, not heavy boxes
- Smooth morphing micro-interactions

### DevDocs.io
- Speed above all — every decision serves lookup speed
- Minimal two-panel layout: search+nav sidebar + content
- Always-focused search bar (/ or Ctrl+K) — primary entry point
- Instant fuzzy matching with real-time results
- Full keyboard navigation (/, Up/Down, Enter, Esc, Backspace, Shift+S)
- Client-side only, service worker + localStorage for offline
- Stripped HTML for fast loading
- Utilitarian but effective — dense information display

### Laws of UX
- Concept collection as visual gallery (closest analog to PM Frameworks)
- Responsive CSS Grid: `repeat(auto-fill, minmax(16rem, 1fr))`
- Each concept has unique visual identity (color + abstract geometric icon)
- Inspired by vintage Penguin psychology book covers
- Category filter on homepage grid
- Card hover: `transform: scale(1.02)` with `prefers-reduced-motion` respect
- Warm color palette (#EDEDE8 off-white, #F4F1D0 eggshell, #101014 dark)
- IBM Plex Sans, modular type scale (1.333 ratio)
- Consistent detail page template: definition, takeaways, origins, related, further reading
- 0.3s transition duration, smooth and deliberate

### Duolingo
- Three basic shapes: rounded rectangle, circle, rounded triangle (no sharp edges)
- Tight purposeful palette: Dodger Blue (#1CB0F6), Feather Green (#58CC02), Bee Yellow (#FFC800)
- 3D button technique: `box-shadow: 0 4px 0 [darker]` + `translateY(4px)` on press
- Generous border-radius (pill-shaped primary buttons)
- Winding learning path (visual journey metaphor)
- Micro-celebrations on every completion
- Progressive disclosure (features introduced gradually)
- "Playful, bold, ultimately human" voice
- Gray avoided in illustrations — light pastels instead
- Custom Feather Bold typeface (rounded, friendly)

### Codecademy
- 10 design principles (One Column, Social Proof, More Contrast, Fewer Form Fields, Keeping Focus, Direct Manipulation, Visual Hierarchy, Visual Recognition, Larger Targets, Edge Cases)
- Single-column content for focused reading
- Hick's Law applied: reduce CTAs per page
- Two-level syllabus hierarchy (Career Path > Unit)
- Progress per small completion, not just major milestones
- Course Menu in top-left corner
- Dark mode + accessibility toggles (high contrast, screen reader mode)

### Notion
- 224px sidebar width (proven dimension)
- 8px grid system for all spacing
- Warm off-white sidebar (#F7F6F3) vs white content
- Collapsible sections with click-to-toggle headings
- Hover-reveal secondary actions (+ and ... buttons)
- Progressive indentation with tooltip overflow
- Warm text color (#37352F instead of #000000)
- Inter typeface (Regular, Medium, Bold)
- 6px gaps between navigation sections

---

## Design System Updates Applied

### Category Colors (New — Bold & Vibrant)
| Category | Old | New | Rationale |
|----------|-----|-----|-----------|
| Prioritization | #4ead6b (muted green) | #7C5CFC (royal purple) | Distinct, premium, high-energy |
| Design | #e0a820 (muted gold) | #10B981 (emerald) | Fresh, creative, inviting |
| Strategy | #5889d0 (muted blue) | #F97066 (coral) | Bold, attention-grabbing |
| Growth | #dc6050 (muted red) | #3B82F6 (ocean blue) | Trust, clarity, expansion |
| Execution | #9868c0 (muted purple) | #F59E0B (amber) | Energy, action, urgency |
| Communication | #e08030 (muted orange) | #F97316 (tangerine) | Warm, approachable, expressive |

### Border Radius (New — Duolingo-friendly)
- xs: 4px, sm: 8px, md: 12px, lg: 16px (cards), xl: 24px (hero), pill: 9999px

### Shadows (New — Brilliant-inspired lifted feel)
- Increased opacity for more visual depth
- Added --shadow-hover for card interactions
- Focus shadow updated to use new prioritization purple

### Transitions
- Fast: 150ms (was 120ms), Normal: 200ms, Slow: 300ms

---

## Expanded Virtual Team

Added for Design Revamp:
- **Design Lead** — Senior product designer (Stripe Docs, Tailwind UI, Laws of UX, Mobbin)
- **Senior Visual Designer** — UI craft (Vercel, Raycast, Apple HIG)
- **Senior Interaction Designer** — Navigation & IA (Notion sidebar, Linear, DevDocs)
