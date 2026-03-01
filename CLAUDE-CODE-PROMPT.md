# PM Frameworks Guidebook — Web App Transformation

## PROJECT BRIEF

You are transforming an existing set of 34 static HTML files into a fully interactive, production-quality web application for product managers to learn, practice, assess, and revisit 24 PM frameworks across 6 categories.

### Source Files

All source files are located at: `/mnt/user-data/outputs/`

**Structure:**
- `index.html` — Hub/landing page linking all frameworks
- 24 individual framework pages (each ~35-65KB of self-contained HTML with embedded CSS/JS)
- 6 category comparison guides
- 3 duplicate/variant files to consolidate: `Jobs-to-be-Done.html` (duplicate of `JTBD-Framework.html`), `Porters-Five-Forces.html` (duplicate of `Porters-5-Forces.html`), `RICE-Framework-Interactive.html` (variant of `RICE-Framework-Guide.html`)

**Current design system (reference only — full redesign is welcome):**
- Currently uses neo-brutalism: thick borders, hard shadows, bold colors
- Fonts: Lilita One (headings), Outfit (body), JetBrains Mono (code/data)
- Category colors: Prioritization=#6c5ce7, Design=#00b894, Strategy=#e17055, Growth=#0984e3, Execution=#fdcb6e, Communication=#e88840
- Each framework page has 7 tabbed sections: Concept → Deep Dive → [varies] → Real Example → Builder/Analyzer → When to Use → Quiz

**Design direction: The current aesthetic is NOT sacred.** You have full creative freedom to propose a better visual system. The priority is a design that:
- Feels professional and credible (this is a career tool, not a toy)
- Supports long reading sessions without visual fatigue
- Has strong visual hierarchy for scannable content (critical for AuDHD users)
- Uses color meaningfully (category differentiation, progress states, interactive vs. static elements)
- Looks polished on both mobile and desktop
- Could credibly be a paid SaaS product

Consider: clean modern interfaces (Linear, Notion, Raycast), learning platforms (Brilliant, Codecademy), or any aesthetic that serves the content best. Propose your design direction with rationale in Phase 1 before building.

**Existing interactive features across files:**
- 31 files have tabbed navigation (journey-nav with j-btn buttons)
- 15 files have quizzes (quiz_area with multiple-choice + feedback)
- 20 files have builders/analyzers (input forms that generate feedback)
- 27 files have "When to Use" sections with use/skip cards
- 6 comparison guides have interactive framework pickers

---

## YOUR EXPERT TEAM

Approach this project as if you are a full product team. For every decision, channel the relevant expert(s):

### 🛠️ Lead Developer — Profile: Senior full-stack engineer specializing in interactive web apps
Think like someone who has built Brilliant.org, Duolingo's web interface, or Khan Academy. Priorities: component architecture, state management, performance, offline capability, progressive enhancement. Stack recommendation is yours to make, but consider: the source is vanilla HTML/CSS/JS — the migration path matters.

### 🎨 UX/UI Designer — Profile: Specialist in learning product interfaces
Think like the design lead at Notion, Linear, or Raycast — but for education. Priorities: scannable layouts for neurodivergent users (the primary user has AuDHD), clear visual hierarchy, micro-interactions that reinforce learning, responsive design from mobile-first, dark mode support, reduced motion preferences. You have full creative freedom on the visual design — propose the aesthetic that best serves a professional PM learning tool. Aim for something that looks like a credible paid product, not a student project.

### 📚 E-Learning Designer — Profile: Instructional design expert with focus on adult professional learning
Think like someone who designed Coursera's learning paths or Codecademy's interactive lessons. Priorities: spaced repetition, retrieval practice, scaffolded difficulty, competency tracking, the testing effect (quizzes improve retention more than re-reading), interleaving (mixing topics), desirable difficulty. Every interactive element should serve a learning science principle.

### 🎮 Gamification Designer — Profile: Engagement systems expert
Think like someone from Duolingo's growth team. Priorities: progress visualization, streak mechanics, XP/points systems that reward practice over completion, unlockable content, social proof elements, achievement badges that map to real PM competencies, "daily practice" mechanics. Avoid: dark patterns, anxiety-inducing urgency, vanity metrics.

### 📖 Content & Framework Experts — For accuracy verification
When implementing framework content, ensure accuracy as if consulting:
- **Michael Porter** (competitive strategy) — Porter's 5 Forces
- **W. Chan Kim & Renée Mauborgne** — Blue Ocean Strategy
- **A.G. Lafley & Roger Martin** — Playing to Win
- **Simon Wardley** — Wardley Mapping
- **Sean Ellis & Dave McClure** — AARRR Pirate Metrics, Growth Loops
- **John Doerr** — OKRs
- **Barbara Minto** — Pyramid Principle
- **Clayton Christensen** — Jobs to Be Done
- **Jeff Patton** — User Story Mapping
- **Noriaki Kano** — Kano Model
- **Ryan Singer (Basecamp)** — Shape Up
- **Marty Cagan / Teresa Torres** — Dual Track Agile, Discovery practices
- **IDEO / Stanford d.school** — Design Thinking
- **Intercom / Lenny Rachitsky** — North Star Framework, Input/Output Metrics

Cross-reference all framework descriptions, steps, and examples against the original authors' published work. Flag any inaccuracies or oversimplifications in the source files.

### 🧠 Accessibility & Neurodivergent UX Specialist
The primary user has AuDHD. Design decisions should account for: executive function support (clear next steps, no decision fatigue), sensory considerations (option for reduced animations, high contrast), chunked content (already done well in source files), focus management (keyboard navigation, visible focus states), time estimation for each activity, ability to pause and resume.

---

## FUNCTIONAL REQUIREMENTS

### Core App Features

1. **Unified App Shell**
   - Single-page application with client-side routing
   - Persistent sidebar/navigation showing all 6 categories and 24 frameworks
   - Global search across all framework content
   - Breadcrumb navigation: Category → Framework → Section
   - Deep-linking to any section of any framework

2. **Learning Progress System**
   - Track which sections of each framework have been visited
   - Track quiz scores per framework (best score, last score, attempts)
   - Track builder/analyzer usage (completed vs. not)
   - Visual progress per category (e.g., "3/4 frameworks started, 1/4 mastered")
   - Overall progress dashboard: frameworks explored, quizzes passed, builders used
   - All progress stored in localStorage with export/import capability

3. **Enhanced Quiz System**
   - Keep existing quiz content but add:
   - Spaced repetition: resurface questions the user got wrong after 1 day, 3 days, 7 days
   - Cross-framework quiz mode: mix questions from all frameworks
   - "Daily Practice" mode: 5 random questions from across all frameworks
   - Quiz history: see which questions you consistently get wrong
   - Explanations should be expandable (not auto-shown) to support retrieval practice

4. **Enhanced Builders/Analyzers**
   - Keep existing builder functionality but add:
   - Save drafts to localStorage (so users can return to half-finished analyses)
   - Export builder output as markdown or copy to clipboard
   - Template library: pre-filled examples for common PM scenarios
   - "Share" capability: generate a shareable URL or image of completed analysis

5. **Framework Comparison Engine**
   - Keep existing comparison guides but make them dynamic
   - Side-by-side comparison: pick any 2-3 frameworks and compare dimensions
   - "When should I use...?" interactive decision tree spanning ALL 24 frameworks
   - Scenario-based picker: "I'm preparing for a stakeholder meeting" → suggests Pyramid or Exec Summary

6. **Study Modes**
   - **Learn mode** (current default): full framework pages with all sections
   - **Review mode**: flashcard-style key concepts from each framework
   - **Practice mode**: quizzes + builders only, no reading
   - **Quick reference mode**: one-line summary + "When to use" for each framework, scannable on mobile

7. **Personalization**
   - Bookmark/favorite specific frameworks
   - Notes: add personal notes to any framework (stored locally)
   - Custom tags: tag frameworks with your own labels ("interview prep", "daily work", "weak area")
   - Dark mode / light mode toggle
   - Reduced motion toggle

### Content Enhancements

8. **Framework Connections Map**
   - Visual graph/map showing how frameworks relate to each other
   - Click a framework → see which other frameworks it connects to and why
   - "Learning paths": suggested sequences (e.g., "Interview Prep Path": STAR → Pyramid → CIRCLES → RICE)

9. **Real-World Scenario Library**
   - 10-15 PM scenarios (e.g., "Your CEO asks you to prioritize the roadmap for Q3")
   - Each scenario suggests 2-3 frameworks to apply
   - Users can practice applying frameworks to scenarios and compare their analysis to a model answer

10. **Glossary**
    - Auto-extracted key terms from all frameworks
    - Hover/click definitions throughout the app
    - Searchable glossary page

---

## TECHNICAL REQUIREMENTS

- **Performance**: First contentful paint < 2s. Each framework page should lazy-load.
- **Offline**: Service worker for offline access to all content (this is a study tool — users need it on planes/commutes)
- **Responsive**: Mobile-first. Framework pages must be fully usable on a 375px screen.
- **Accessibility**: WCAG 2.1 AA minimum. Keyboard navigation throughout. Screen reader compatible. Visible focus states. Skip navigation links.
- **Data persistence**: localStorage for progress, with JSON export/import. No backend required.
- **SEO-friendly**: Each framework should have its own URL path for shareability.
- **Print-friendly**: Each framework should have a print stylesheet for one-page cheat sheets.

---

## PHASED DELIVERY PLAN

Deliver in phases. Each phase should be a working, deployable state. Do not start a new phase until the current one is complete and tested.

### Phase 1: Foundation & Migration (Priority: Critical)
**Goal:** Unified app shell with all 24 frameworks migrated from static HTML into the component architecture. No new features — just a clean migration that preserves all existing content and interactivity.

Deliverables:
- App shell with routing, navigation sidebar, category pages
- All 24 framework pages migrated (content preserved exactly)
- All 6 comparison guides migrated
- Hub/landing page redesigned as app dashboard
- Responsive layout working on mobile
- Duplicate files consolidated (keep the better version)
- Shared design system extracted (CSS variables, component library)

**Acceptance criteria:** Every piece of content and interactivity from the source files works in the new app. Nothing lost.

### Phase 2: Progress & State (Priority: High)
**Goal:** Learning progress tracking and data persistence.

Deliverables:
- Section visit tracking per framework
- Quiz score tracking (best, last, attempts)
- Builder usage tracking
- Progress dashboard on hub page
- Per-category progress visualization
- localStorage persistence + JSON export/import
- "Continue where you left off" on app launch

### Phase 3: Enhanced Quizzes & Practice (Priority: High)
**Goal:** Transform quizzes from one-off checks into a real practice system.

Deliverables:
- Cross-framework quiz mode
- Daily Practice mode (5 questions)
- Spaced repetition scheduling for missed questions
- Quiz history and analytics
- "Review weak areas" feature

### Phase 4: Study Modes & Personalization (Priority: Medium)
**Goal:** Multiple ways to engage with content based on context.

Deliverables:
- Quick reference mode (scannable summaries)
- Review mode (flashcards)
- Practice mode (quizzes + builders only)
- Dark mode / light mode
- Reduced motion toggle
- Bookmarks, notes, custom tags
- Framework connections map

### Phase 5: Scenario Library & Advanced Features (Priority: Medium)
**Goal:** Apply frameworks to realistic PM situations.

Deliverables:
- 10-15 real-world scenarios with framework suggestions
- Model answers for each scenario
- Dynamic comparison engine (pick any 2-3 frameworks)
- Universal decision tree ("What framework should I use?")
- Glossary with hover definitions
- Print-friendly cheat sheets

### Phase 6: Gamification & Engagement (Priority: Lower)
**Goal:** Motivate consistent practice.

Deliverables:
- XP system: earn points for reading, quizzing, building
- Achievement badges mapped to PM competencies
- Streak tracking (daily practice)
- "Mastery" status per framework (requires: all sections read + quiz score ≥ 80% + builder completed)
- Learning paths with suggested sequences
- Weekly summary of activity

---

## IMPLEMENTATION NOTES

1. **Start by reading ALL source files** before making architectural decisions. The content quality is high — your job is to enhance the container, not rewrite the content.

2. **Design is wide open.** The current neo-brutalism was a working aesthetic for prototyping, but you're free to propose any visual direction that better serves a professional PM learning product. Prioritize: readability for long sessions, clear progress visualization, visual hierarchy for scanning, and a look that could credibly be a paid SaaS tool. Propose your design direction (with mood board references or style rationale) in Phase 1 before building.

3. **The user has AuDHD.** This means: clear visual progress indicators, chunked navigation, no overwhelming option screens, gentle "what's next?" suggestions, ability to pause and resume anything.

4. **Content accuracy matters.** These frameworks come from specific authors with specific methodologies. Don't simplify or modify framework content without flagging it. If you spot inaccuracies in the source, note them for review.

5. **Test on mobile.** The user will use this on commutes, in waiting rooms, before interviews. Mobile experience is as important as desktop.

6. **Each phase should be independently deployable.** Don't build phase 2 features into phase 1 code. Clean interfaces between phases.

---

## OUTPUT EXPECTATIONS

For each phase:
1. Provide a technical plan before coding (architecture decisions, file structure, tech stack)
2. Build incrementally — show working state after each major component
3. Test all migrated content against source files
4. Document any content changes or inaccuracies found
5. Provide deployment instructions

Begin with Phase 1. Start by reading the source files to understand the full content structure, then propose your technical architecture before writing any code.
