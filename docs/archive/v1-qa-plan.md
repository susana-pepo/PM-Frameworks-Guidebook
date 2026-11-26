# QA Testing Plan — PM Frameworks Guidebook

> **QA Lead:** Senior QA Engineer (Virtual Team Member)
> **Product:** PM Frameworks Guidebook SPA — 24 frameworks + 6 comparison guides
> **Stack:** Vanilla JS + Vite, CSS custom properties design system, dark/light themes
> **Last Updated:** 2026-03-01

---

## 1. Test Scope Overview

| Dimension | Coverage |
|-----------|----------|
| Pages | 24 framework pages + 6 comparison guides + Hub + 6 category views = **37 routes** |
| Themes | Light mode + Dark mode |
| Viewports | Mobile (375px), Tablet (768px), Desktop (1280px+) |
| Browsers | Chrome, Safari, Firefox (latest) |
| Interactive types | Tabs (29 pages), Quizzes (24), Drag-drop (11), Calculators/builders (7), Canvas/grid (5) |

---

## 2. Test Matrix — All 30 Content Pages

### Legend
- **Tabs** = `.j-btn` tab navigation with `.panel` switching
- **Quiz** = Interactive quiz with clickable options (`.qo`)
- **D&D** = Drag-and-drop / sortable elements
- **Calc** = Calculator, builder, or scoring tool
- **Canvas** = Grid/canvas/SVG visualization

### 2.1 Prioritization (4 frameworks + 1 comparison)

| Page | Slug | Tabs | Quiz | D&D | Calc | Canvas | Priority |
|------|------|------|------|-----|------|--------|----------|
| RICE Score | `rice` | ✓ | ✓ | | ✓ | | HIGH |
| Value vs Effort | `value-effort` | ✓ | ✓ | ✓ | | ✓ | HIGH |
| Kano Model | `kano` | ✓ | ✓ | | ✓ | ✓ | HIGH |
| ICE Score | `ice` | ✓ | ✓ | ✓ | | | MEDIUM |
| Prioritization Compare | `compare-prioritization` | ✓ | | | | ✓ | MEDIUM |

### 2.2 Design (4 frameworks + 1 comparison)

| Page | Slug | Tabs | Quiz | D&D | Calc | Canvas | Priority |
|------|------|------|------|-----|------|--------|----------|
| CIRCLES Method | `circles` | ✓ | ✓ | ✓ | | | HIGH |
| Jobs to Be Done | `jtbd` | ✓ | ✓ | | ✓ | | HIGH |
| User Story Mapping | `user-story-mapping` | ✓ | ✓ | | ✓ | ✓ | HIGH |
| Design Thinking | `design-thinking` | ✓ | ✓ | ✓ | | | MEDIUM |
| Design Compare | `compare-design` | ✓ | | | ✓ | | LOW |

### 2.3 Strategy (4 frameworks + 1 comparison)

| Page | Slug | Tabs | Quiz | D&D | Calc | Canvas | Priority |
|------|------|------|------|-----|------|--------|----------|
| Porter's 5 Forces | `porters-5-forces` | ✓ | ✓ | | ✓ | | HIGH |
| Blue Ocean Strategy | `blue-ocean` | ✓ | ✓ | | ✓ | | MEDIUM |
| Playing to Win | `playing-to-win` | ✓ | ✓ | | | | LOW |
| Wardley Mapping | `wardley-mapping` | ✓ | ✓ | | | | LOW |
| Strategy Compare | `compare-strategy` | ✓ | | | | ✓ | LOW |

### 2.4 Growth (4 frameworks + 1 comparison)

| Page | Slug | Tabs | Quiz | D&D | Calc | Canvas | Priority |
|------|------|------|------|-----|------|--------|----------|
| AARRR Pirate Metrics | `aarrr` | ✓ | ✓ | ✓ | | | MEDIUM |
| Growth Loops | `growth-loops` | ✓ | ✓ | | | | LOW |
| North Star Framework | `north-star` | ✓ | ✓ | | | | LOW |
| Input/Output Metrics | `input-output` | ✓ | ✓ | ✓ | | | MEDIUM |
| Growth Compare | `compare-growth` | ✓ | | ✓ | | | LOW |

### 2.5 Execution (4 frameworks + 1 comparison)

| Page | Slug | Tabs | Quiz | D&D | Calc | Canvas | Priority |
|------|------|------|------|-----|------|--------|----------|
| Agile / Scrum | `agile-scrum` | ✓ | ✓ | | | | LOW |
| Shape Up | `shape-up` | ✓ | ✓ | | | | LOW |
| Dual Track Agile | `dual-track` | ✓ | ✓ | | | | LOW |
| OKRs | `okrs` | ✓ | ✓ | | | | LOW |
| Execution Compare | `compare-execution` | ✓ | | | | | LOW |

### 2.6 Communication (4 frameworks + 1 comparison)

| Page | Slug | Tabs | Quiz | D&D | Calc | Canvas | Priority |
|------|------|------|------|-----|------|--------|----------|
| STAR Method | `star` | ✓ | ✓ | ✓ | | | MEDIUM |
| Pyramid Principle | `pyramid` | ✓ | ✓ | ✓ | | | MEDIUM |
| Narrative Arc | `narrative-arc` | ✓ | ✓ | ✓ | | | MEDIUM |
| Executive Summary | `exec-summary` | ✓ | ✓ | ✓ | | | MEDIUM |
| Communication Compare | `compare-communication` | ✓ | | | | | LOW |

---

## 3. Test Suites

### 3.1 SUITE: Visual & Theme Testing

> **Goal:** Every page is readable and visually correct in both light and dark mode.

| # | Test Case | Steps | Expected | Severity |
|---|-----------|-------|----------|----------|
| V-01 | H1 heading readable — dark mode | Navigate to each of the 30 pages in dark mode | H1 text color is light (approx `#f5f0e8`), clearly readable against dark background | BLOCKER |
| V-02 | H1 heading readable — light mode | Navigate to each of the 30 pages in light mode | H1 text color is dark (approx `#1a1816`), clearly readable against light background | BLOCKER |
| V-03 | Subtitle text readable — dark mode | Check `.header p.sub` on all pages in dark mode | Subtitle uses `--text-secondary` color, visible against dark background | HIGH |
| V-04 | Category badge visible and consistent | Check `.fw-category-badge` on all 30 pages | Badge shows correct category name + emoji (e.g., "🎯 Prioritization"), no duplicate `.header-badge` visible | HIGH |
| V-05 | No nav buttons visible | Check for `.panel-nav` or `.nav-btns` elements | No prev/next navigation buttons visible on any framework page | HIGH |
| V-06 | Card backgrounds in dark mode | Inspect `.c-card`, `.tldr`, `.insight`, `.example-plot` in dark mode | Cards have sufficient contrast against dark page background, text is readable | HIGH |
| V-07 | Axis labels not overlapping lines | Check Value vs Effort: Quadrants, Example, Plot It tabs | "VALUE →" and "EFFORT →" labels clear of axis lines, no overlap | MEDIUM |
| V-08 | Interactive tool backgrounds | Check builders, calculators, grid tools in dark mode | Tool containers have appropriate background, inputs are readable | MEDIUM |
| V-09 | Tab button active state | Click through tabs on 5+ pages in both themes | Active tab visually distinct, text readable on active background | MEDIUM |
| V-10 | Quiz option visibility | View quiz sections on 5+ pages in both themes | Quiz options have clear borders, hover states, selected states visible | MEDIUM |
| V-11 | No text overflow or clipping | Scroll through all content on 10+ pages | No text clips outside containers, no horizontal scroll | LOW |
| V-12 | Consistent spacing between sections | Compare spacing on 5 pages across categories | Section gaps consistent, no collapsed margins or double spacing | LOW |

### 3.2 SUITE: Navigation & Routing

> **Goal:** All navigation paths work, browser history is correct, URLs are stable.

| # | Test Case | Steps | Expected | Severity |
|---|-----------|-------|----------|----------|
| N-01 | Hub → Category → Framework | Click category on hub, click framework from category view | Correct framework loads, breadcrumb updates correctly | BLOCKER |
| N-02 | Sidebar navigation | Click each sidebar link for all 24 frameworks | Each framework page loads correctly, sidebar highlights active item | BLOCKER |
| N-03 | Sidebar comparison links | Click "Compare all" for each of the 6 categories | Comparison guide loads, breadcrumb shows category + "Compare" | HIGH |
| N-04 | Breadcrumb back-navigation | On any framework, click the category link in breadcrumb | Returns to category view, correct category displayed | HIGH |
| N-05 | Breadcrumb → Dashboard | On any framework, click "Dashboard" in breadcrumb | Returns to hub/dashboard | HIGH |
| N-06 | Browser back/forward | Navigate Hub → Category → Framework, press Back, press Forward | History works correctly, pages re-render properly | HIGH |
| N-07 | Direct URL access | Load `#/framework/rice` directly in address bar | RICE page loads correctly without navigating through hub | HIGH |
| N-08 | Invalid slug | Load `#/framework/nonexistent` in address bar | Shows "Framework not found" message, no console errors | MEDIUM |
| N-09 | Search functionality | Type "scrum" in sidebar search | Filters sidebar to show matching frameworks | MEDIUM |
| N-10 | Style cleanup on navigation | Navigate Framework A → Hub → Framework B | No CSS bleed from Framework A's injected styles into Framework B | HIGH |
| N-11 | Rapid navigation | Quickly click between 5+ different frameworks in sidebar | No crashes, no stale content, correct page renders each time | MEDIUM |
| N-12 | Theme toggle persistence | Switch to dark mode, navigate between pages | Theme stays consistent across navigation | MEDIUM |

### 3.3 SUITE: Interactive Elements — Tabs

> **Goal:** All tab-based navigation works correctly across the 29 pages that use it.

| # | Test Case | Steps | Expected | Severity |
|---|-----------|-------|----------|----------|
| T-01 | Tab switching — all panels | Click each tab button on 10+ pages | Correct panel displays, others hide, active tab highlighted | BLOCKER |
| T-02 | First tab active on load | Load 5 framework pages fresh | First tab (usually "Understand" or "Quadrants") active by default | HIGH |
| T-03 | Tab state after back-navigation | Navigate Framework → Hub → same Framework | Tabs reset to first tab (acceptable) or preserve state | MEDIUM |
| T-04 | Tab numbering display | Check tab buttons on all pages | Tab numbers (01, 02, etc.) and labels match content | LOW |
| T-05 | Tab scroll position | Click a tab that reveals long content | Content scrolls appropriately, no content hidden above fold | MEDIUM |

### 3.4 SUITE: Interactive Elements — Quizzes

> **Goal:** All 24 quiz interactions work: selection, feedback, scoring.

| # | Test Case | Steps | Expected | Severity |
|---|-----------|-------|----------|----------|
| Q-01 | Quiz option selection | Click a quiz option on 5+ pages | Option highlights as selected, feedback appears | HIGH |
| Q-02 | Correct answer feedback | Select the correct answer | Green/positive feedback, score increments if applicable | HIGH |
| Q-03 | Incorrect answer feedback | Select an incorrect answer | Red/negative feedback or explanation shown | HIGH |
| Q-04 | Quiz reset/replay | Complete a quiz, look for reset | If reset exists, quiz returns to initial state | MEDIUM |
| Q-05 | Multiple quizzes per page | On pages with multiple quiz sections, complete each | Each quiz works independently, no state leaking between them | MEDIUM |

### 3.5 SUITE: Interactive Elements — Calculators & Builders

> **Goal:** All 7 calculation/builder tools produce correct results.

| # | Test Case | Pages | Steps | Expected | Severity |
|---|-----------|-------|-------|----------|----------|
| C-01 | RICE calculator | `rice` | Enter Reach=1000, Impact=3, Confidence=80%, Effort=2 | Score calculates to 1200, display updates | HIGH |
| C-02 | ICE score inputs | `ice` | Enter Impact=8, Confidence=7, Ease=6 | Score calculates correctly | HIGH |
| C-03 | Kano classifier | `kano` | Select functional/dysfunctional responses | Correct category classification shown | HIGH |
| C-04 | JTBD builder | `jtbd` | Fill in "When I...", "I want to...", "So I can..." | Statement assembles correctly | HIGH |
| C-05 | Porter's forces analyzer | `porters-5-forces` | Rate each of the 5 forces | Summary/analysis reflects ratings | HIGH |
| C-06 | Blue Ocean canvas | `blue-ocean` | Add factors, rate current vs new | Canvas/chart updates | MEDIUM |
| C-07 | User Story Map builder | `user-story-mapping` | Add activities, stories | Map structure renders correctly | MEDIUM |
| C-08 | Empty state handling | All 7 builders | Open builder without entering data | No errors, placeholder or prompt shown | MEDIUM |
| C-09 | Edge case inputs | RICE, ICE | Enter 0, very large numbers, decimals | Handles gracefully, no NaN or Infinity | MEDIUM |

### 3.6 SUITE: Interactive Elements — Drag & Drop

> **Goal:** All 11 drag-and-drop interactions work on mouse and touch.

| # | Test Case | Pages | Steps | Expected | Severity |
|---|-----------|-------|-------|----------|----------|
| D-01 | Value vs Effort plot | `value-effort` | Add feature, drag dot to quadrant | Dot moves smoothly, snaps to position, quadrant updates | HIGH |
| D-02 | Drag-and-drop on touch | `value-effort` | On mobile viewport, touch-drag a dot | Touch-drag works, no page scroll during drag | HIGH |
| D-03 | Remove drag item | `value-effort` | Hover dot, click remove button | Dot removed, list updates | MEDIUM |
| D-04 | Sortable/reorder lists | `circles`, `star`, `pyramid` | Drag items to reorder | Items reorder correctly, visual feedback during drag | HIGH |
| D-05 | AARRR funnel drag | `aarrr` | Drag metrics to funnel stages | Metrics attach to correct stage | MEDIUM |
| D-06 | Drag boundary containment | `value-effort` | Try to drag dot outside grid | Dot constrained within grid boundaries | MEDIUM |

### 3.7 SUITE: Canvas & Grid Visualizations

> **Goal:** All 5 canvas/grid visualizations render correctly.

| # | Test Case | Pages | Steps | Expected | Severity |
|---|-----------|-------|-------|----------|----------|
| G-01 | Value vs Effort grid axes | `value-effort` | View Plot It tab | "VALUE →" on y-axis, "EFFORT →" on x-axis, grid lines visible | HIGH |
| G-02 | Value vs Effort quadrant colors | `value-effort` | View Quadrants tab | 4 quadrants with distinct colors (mint, sky, yellow, rose) | MEDIUM |
| G-03 | Kano curve rendering | `kano` | View Kano curve visualization | Curves render correctly, labels positioned | HIGH |
| G-04 | User Story Map grid | `user-story-mapping` | View story map | Grid layout intact, activities and stories positioned | MEDIUM |
| G-05 | Comparison grid tables | Comparison guides | View comparison tables | Columns aligned, no horizontal overflow | MEDIUM |

### 3.8 SUITE: Responsive Design

> **Goal:** Usable at 375px, 768px, and 1280px+.

| # | Test Case | Steps | Expected | Severity |
|---|-----------|-------|----------|----------|
| R-01 | Mobile sidebar collapse | Set viewport to 375px | Sidebar collapses, hamburger menu appears | HIGH |
| R-02 | Mobile content width | View 5 framework pages at 375px | Content fills width, no horizontal scroll, text readable | HIGH |
| R-03 | Mobile tabs wrap | View tabbed pages at 375px | Tabs wrap or scroll horizontally, all accessible | HIGH |
| R-04 | Mobile interactive tools | Use RICE calculator at 375px | Input fields and buttons usable with touch targets ≥44px | HIGH |
| R-05 | Mobile drag-and-drop | Use Value vs Effort plot at 375px | Grid usable, dots draggable with touch | MEDIUM |
| R-06 | Tablet layout | View pages at 768px | Content area uses available width, sidebar visible or toggleable | MEDIUM |
| R-07 | Desktop wide screen | View pages at 1920px+ | Content doesn't stretch too wide, readable line lengths | LOW |
| R-08 | Mobile quiz interaction | Take a quiz at 375px | Options are tappable, feedback visible without scrolling | MEDIUM |

### 3.9 SUITE: Accessibility

> **Goal:** WCAG 2.1 AA compliance, keyboard navigable, screen-reader compatible.

| # | Test Case | Steps | Expected | Severity |
|---|-----------|-------|----------|----------|
| A-01 | Keyboard tab navigation | Tab through a framework page | Focus moves logically through content, tabs, interactive elements | HIGH |
| A-02 | Focus visible | Tab through elements | Clear focus indicator on all interactive elements | HIGH |
| A-03 | Skip to content link | Press Tab on page load | "Skip to content" link appears and works | MEDIUM |
| A-04 | Color contrast — text | Audit 5 pages with contrast checker | All text meets 4.5:1 ratio (AA) | HIGH |
| A-05 | Color contrast — interactive | Check buttons, badges, tabs | All interactive elements meet 3:1 ratio | HIGH |
| A-06 | Screen reader — headings | Navigate with VoiceOver heading shortcuts | Heading hierarchy is logical (h1 → h2 → h3) | MEDIUM |
| A-07 | Screen reader — tabs | Navigate tab component with VoiceOver | Tab role and selected state announced | MEDIUM |
| A-08 | Reduced motion | Enable prefers-reduced-motion | No animations play, transitions are instant | LOW |
| A-09 | Keyboard quiz interaction | Complete quiz using only keyboard | Options selectable with Enter/Space, feedback accessible | MEDIUM |

### 3.10 SUITE: Performance

> **Goal:** Fast load, no layout shifts, clean console.

| # | Test Case | Steps | Expected | Severity |
|---|-----------|-------|----------|----------|
| P-01 | Initial load — FCP | Load hub page, measure FCP | First Contentful Paint < 2 seconds | HIGH |
| P-02 | Framework page load | Navigate to a framework from hub | Content appears within 1 second | HIGH |
| P-03 | Console errors | Open console, navigate through 10+ pages | Zero console errors (warnings acceptable) | HIGH |
| P-04 | Layout shift (CLS) | Load 5 pages, observe for content jumping | No visible layout shifts during load | MEDIUM |
| P-05 | Bundle size check | Run `npm run build` | CSS < 55KB, JS < 25KB (gzipped < 10KB each) | MEDIUM |
| P-06 | Caching behavior | Load framework, navigate away, return | Second load is instant (cached) | LOW |

### 3.11 SUITE: Content Integrity

> **Goal:** All original framework content is preserved through the SPA migration.

| # | Test Case | Steps | Expected | Severity |
|---|-----------|-------|----------|----------|
| I-01 | Section count matches | Compare loaded page vs source HTML for 5 pages | Same number of major sections visible | HIGH |
| I-02 | No truncated content | Scroll to bottom of 10 pages | Footer/last section fully rendered, no cut-off text | HIGH |
| I-03 | Images and icons render | Check pages with emoji icons and inline images | All visual elements display correctly | MEDIUM |
| I-04 | Code examples preserved | Check pages with code snippets (if any) | Code formatting intact | LOW |
| I-05 | Links work | Click 5+ external links across pages | Links open correctly (same or new tab as appropriate) | MEDIUM |

---

## 4. Regression Test Suite

> **Run after every CSS/JS change. Covers the most fragile areas.**

| # | Regression Check | What to verify |
|---|-----------------|----------------|
| REG-01 | Dark mode headings | H1 readable on 3 sample pages (AARRR, RICE, CIRCLES) |
| REG-02 | Light mode headings | H1 readable on same 3 pages |
| REG-03 | Category badges | Consistent badge on 3 pages across categories |
| REG-04 | Nav buttons hidden | Check 3 pages — no prev/next buttons |
| REG-05 | Value vs Effort axes | All 3 tabs (Quadrants, Example, Plot It) show VALUE + EFFORT labels |
| REG-06 | Tab switching | Test tab switching on 2 pages |
| REG-07 | Quiz interaction | Complete 1 quiz question on any page |
| REG-08 | Calculator | Enter values in RICE calculator |
| REG-09 | Drag-and-drop | Drag a dot on Value vs Effort Plot It |
| REG-10 | Style cleanup | Navigate Framework A → Hub → Framework B — no CSS bleed |
| REG-11 | Build succeeds | `npm run build` — zero errors |

---

## 5. User Journey Tests

> **End-to-end flows testing real usage patterns.**

### Journey 1: First-time learner
1. Land on Hub/Dashboard
2. Browse categories, click "Prioritization"
3. Click "RICE Score" framework
4. Read through tabs (01 → 02 → ... → Quiz)
5. Complete the quiz
6. Navigate back via breadcrumb to category
7. Click "Compare all" to see comparison guide
8. Return to Hub

**Verify:** Smooth navigation, no stale state, themes consistent, quiz score visible.

### Journey 2: Quick reference user
1. Load Hub
2. Use search to find "Agile"
3. Click "Agile / Scrum"
4. Jump directly to tab "03" or "Example"
5. Navigate via sidebar to "Shape Up"
6. Compare both using "Execution Compare"

**Verify:** Search works, direct tab access works, sidebar navigation is fast.

### Journey 3: Interactive tool user
1. Navigate to "Value vs Effort"
2. Go to "Plot It" tab
3. Add 5 features via the input
4. Drag each dot to different quadrants
5. Read the quadrant summary
6. Switch to "Example" tab to compare
7. Return to "Plot It" — check if dots persist
8. Navigate to RICE calculator
9. Score 3 features

**Verify:** All interactive tools function, state persists within session, no console errors.

### Journey 4: Dark mode power user
1. Switch to dark mode on Hub
2. Navigate to 4 different frameworks across categories
3. Check readability on each
4. Use an interactive tool (calculator or drag-drop) in dark mode
5. Switch to light mode mid-session
6. Verify the current page re-renders correctly

**Verify:** Theme toggle works instantly, no flash of wrong theme, all content readable in both modes.

---

## 6. Bug Report Template

When filing bugs, use this format:

```
**Bug ID:** BUG-XXX
**Severity:** BLOCKER / HIGH / MEDIUM / LOW
**Suite:** (e.g., Visual & Theme Testing)
**Test Case:** (e.g., V-01)

**Page(s) Affected:**
**Theme:** Light / Dark / Both
**Viewport:** Mobile / Tablet / Desktop / All

**Steps to Reproduce:**
1.
2.
3.

**Expected:**
**Actual:**

**Screenshot/Recording:** (attached)

**Environment:** Chrome 124 / macOS 15.x / 1280×800 viewport
```

---

## 7. Priority Execution Order

Testing should be executed in this order to catch the highest-impact bugs first:

1. **Regression Suite** (REG-01 through REG-11) — 15 min
2. **Visual & Theme** (V-01 through V-06) — 30 min
3. **Navigation & Routing** (N-01 through N-06) — 20 min
4. **Tabs** (T-01, T-02) — 15 min
5. **Calculators & Builders** (C-01 through C-07) — 20 min
6. **Drag & Drop** (D-01 through D-04) — 15 min
7. **Quizzes** (Q-01 through Q-03) — 15 min
8. **Responsive** (R-01 through R-05) — 20 min
9. **Accessibility** (A-01 through A-05) — 20 min
10. **Performance** (P-01 through P-05) — 10 min
11. **Content Integrity** (I-01, I-02) — 15 min
12. **User Journeys** (Journey 1 through 4) — 30 min

**Total estimated first-pass execution: ~3.5 hours**

---

## 8. Continuous Quality Gates

Before any merge/deploy:

- [ ] Regression suite passes (all REG-XX green)
- [ ] `npm run build` succeeds with 0 errors
- [ ] Console clean (0 errors) on 5 sample pages
- [ ] Dark mode spot check on 3 pages
- [ ] One interactive tool verified working
