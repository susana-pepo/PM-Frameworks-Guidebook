# Content glossary and canonical reference

This document is the contract for the consistency pass over the 30 guides in `public/guides/`. When a guide, a legacy page or an audit disagrees with this document, this document wins. When this document is silent, follow `docs/content-spec.md`.

It has six parts:

1. [Canonical definitions](#1-canonical-definitions): what each framework's core ideas are, in the wording a guide should use, with the source.
2. [Glossary](#2-glossary): one definition for every shared term.
3. [Contradiction resolutions](#3-contradiction-resolutions): the canonical value for every cross-page and in-page disagreement, and the files that must change.
4. [Claims to remove or soften](#4-claims-to-remove-or-soften): fabricated, unverifiable, dated or unsourced statements, with replacements.
5. [The case file: Larkwell](#5-the-case-file-larkwell): one fictional company for every worked example that needs one, with a single fact sheet.
6. [Section and naming standards](#6-section-and-naming-standards): rail labels, fixed labels, names, the 24-guide chapter map and candidate pitfalls.

**Conventions used here.**
- Line numbers (`File.html:123`) refer to the legacy files in `public/*.html` at commit `9678cc4`. The new guides in `public/guides/` have the same file names; find the passage by its content, not its line number.
- "Say" gives wording a guide can use as is or lightly adapted. "Do not say" lists the errors to remove.
- "Illustrative" means an invented number or example. Every Larkwell figure is illustrative, and a guide shows that once per worked example (the `example-label` is "Worked example"; add "Larkwell is a fictional company" in the first sentence or a `table-note`).
- Sources are named by author, title and year. Nothing here relies on a source that is not named. Where a fact could not be pinned to a source, the replacement wording is softened instead.

---

## 1. Canonical definitions

Grouped by category, in the order of `src/data/frameworks.js`. Each entry gives the canonical wording, the facts a guide must get right, what not to say, and the source.

### 1.1 Prioritization

#### RICE

- **Say:** "RICE scores an idea as Reach × Impact × Confidence ÷ Effort. Reach is how many people the idea affects in a fixed period, Impact is how much it changes things for each of them, Confidence is how sure you are of the other estimates, and Effort is the total work it takes."
- **Facts:**
  - Reach is an estimated count for a stated period (for example, users per quarter). It is a number, not a band. Any band table is a rough guide, not a required value.
  - Impact uses the fixed scale 3 (massive), 2 (high), 1 (medium), 0.5 (low), 0.25 (minimal).
  - Confidence uses 100% (high), 80% (medium), 50% (low). Write it as a percentage everywhere, including the template table and CSV header ("Confidence (%)"). The calculator may convert to 0.8 internally.
  - Effort is in person-months (or person-weeks if the guide says so once) and includes all disciplines.
  - Effort is the only divisor.
- **Do not say:** "Use these exact values, no freestyling" next to an invented Reach scale (`RICE:347,353–356`); "the #1 / #2 RICE mistake" (`:380,391`).
- **Source:** Sean McBride, "RICE: Simple prioritization for product managers," Intercom blog (the origin already in `frameworks.js`; confirm the year against the post before printing it).

#### Value vs Effort

- **Say:** "Rate each idea for value and for effort, plot it on a 2×2 and read the quadrant: Quick wins (high value, low effort), Big bets (high value, high effort), Fill-ins (low value, low effort) and Avoid (low value, high effort)."
- **Facts:**
  - Quadrant names are exactly: Quick wins, Big bets, Fill-ins, Avoid. "Money pits" and "time sinks" may appear once as other names for Avoid.
  - The quadrant suggests a next move, not a verdict. Strategy, dependencies and deadlines can override it.
  - The guide's effort scale is deliberately non-linear (1 = hours to a few days, 3 = one to two weeks, 5 = months, several teams) while value is linear. Say so once.
  - It is commonly used as a fast first-pass filter before a more detailed score (see C-19).
- **Do not say:** "Always start top-left"; "each one tells you exactly what to do"; "aim for roughly equal items per quadrant" (`V/E:298,268,452`).
- **Source:** no single originator; a long-standing 2×2 used in product and consulting work (as `frameworks.js` says).

#### Kano model

- **Say:** "The Kano model sorts features by how their presence or absence affects satisfaction. Must-haves cause dissatisfaction when missing but no delight when present. Performance features raise satisfaction in proportion to how well you deliver them. Delighters cause delight when present and no dissatisfaction when missing. Indifferent features change nothing. Reverse features lower satisfaction for some customers when present."
- **Names:** use the guide's names with Kano's term on first mention: Must-have (Kano: must-be quality), Performance (Kano: one-dimensional quality), Delighter (Kano: attractive quality), Indifferent, Reverse. Survey analysis also yields Questionable (contradictory answers). Do not mix in "Basics", "Linear" or "Exciters".
- **Curve semantics:** the horizontal axis is how fully the feature is implemented or the need is met (absent on the left, fully present on the right). The vertical axis is satisfaction (dissatisfied at the bottom, delighted at the top), with neutral in the middle.
  - Must-have rises from strong dissatisfaction toward neutral and never goes above neutral.
  - Performance is a straight line through the center.
  - Delighter starts at neutral and curves upward; it never goes below neutral.
  - Indifferent is flat on the neutral line. Reverse slopes downward.
  - Label the horizontal axis "How well it is implemented", not "Feature investment".
- **Survey:** each feature gets a pair of questions, functional ("How would you feel if the product had X?") and dysfunctional ("…did not have X?"), each answered on five options (I like it, I expect it, I am neutral, I can tolerate it, I dislike it). A 5×5 evaluation table maps each answer pair to a category.
- **Better/Worse coefficients:** Better = (D + P) ÷ (D + P + M + I); Worse = −(P + M) ÷ (D + P + M + I). Research papers write A (attractive) and O (one-dimensional) for D and P. Reverse and Questionable answers are left out.
- **Drift over time:** attributes tend to move from Delighter to Performance to Must-have as customers get used to them. Say it as a tendency, without precise years.
- **Threshold vs scale:** one attribute can be a Must-have up to a threshold and Performance beyond it (page load speed is the classic case). A guide that lists speed under Performance and "fast page load" under Must-have must say this, or pick one (C-26).
- **Sources:** Noriaki Kano, Nobuhiku Seraku, Fumio Takahashi and Shinichi Tsuji, "Attractive quality and must-be quality," *Journal of the Japanese Society for Quality Control*, 1984. Charles Berger et al., "Kano's methods for understanding customer-defined quality," *Center for Quality of Management Journal*, 1993 (Better/Worse coefficients).

#### ICE

- **Say:** "ICE rates an idea from 1 to 10 for Impact, Confidence and Ease, and multiplies the three ratings. Some teams average them instead; the ranking is often the same."
- **Confidence bands (one rubric, everywhere in the guide):** 1–3 gut feel (an opinion with no data); 4–5 some signals (anecdotes, a few requests); 6–7 good data (qualitative research, consistent feedback); 8–9 strong evidence (quantitative data, a test elsewhere); 10 proven (an A/B test or a measured launch in this product). The rewritten `ICE-Score.html` already uses these bands; the pitfall fix must use the same ones.
- **Clustering pitfall:** the problem with ratings that all sit at 5–7 is that small differences decide the ranking and near-ties hide real differences. Do not argue it with "125 vs 343" (`ICE:456`, quiz `#q5e`), which shows a 2.7× spread.
- **Source:** Sean Ellis (GrowthHackers). Itamar Gilad's Confidence Meter is a common reference for anchoring Confidence; name it if the guide uses its bands as inspiration.

### 1.2 Design

#### CIRCLES Method

- **Say:** "CIRCLES is a seven-step structure for answering product design interview questions: Comprehend the situation, Identify the customer, Report the customer's needs, Cut through prioritization, List solutions, Evaluate tradeoffs and Summarize your recommendation."
- **Timing (canonical):** in a 35-minute product design question, the seven steps take about 20 minutes and leave about 15 minutes for follow-up. Per step: Comprehend 3 min (clarifying questions are part of this step), Identify 2, Report 3, Cut 2, List 5, Evaluate 3, Summarize 2. The rewritten `CIRCLES-Method.html` agenda already uses these values (0–3, 3–5, 5–8, 8–10, 10–15, 15–18, 18–20, 20–35).
- **Relationship to design thinking:** "CIRCLES and design thinking follow a similar path, from users to needs to solutions, but they were developed separately and do different jobs. CIRCLES structures a spoken answer of about 20 minutes with no real users. Design thinking is a research and prototyping process with real users that runs for days or weeks." Never call CIRCLES "compressed design thinking" or map Evaluate to Prototype/Test.
- **Kano in the Cut step:** Kano classifies features by satisfaction effect; it does not rank them. If a quiz asks which framework ranks solutions, the answer is RICE or ICE, and the explanation must not call Kano a prioritization score.
- **Source:** Lewis C. Lin, *Decode and Conquer*, 2013.

#### Jobs to Be Done

- **Say:** "Jobs to Be Done looks at the progress a person is trying to make in a particular situation. People 'hire' a product to make that progress and 'fire' it when something serves them better."
- **Job story vs job statement (never interchange the names):**
  - A **job story** has three parts: "When [situation], I want to [motivation], so I can [expected outcome]." It comes from Paul Adams and the product team at Intercom and was developed further by Alan Klement.
  - A **job statement** (Tony Ulwick's Outcome-Driven Innovation) is a verb, an object and a contextual clarifier, for example "listen to music while commuting." It has no "when / I want / so I can" form.
  - The guide's format, builder and examples use the job story. Every label that says "Job Statement" over the When/I want/So I can format becomes "Job story" (`JTBD:178,229,339`; `Design-Comparison-Guide.html:720`).
- **Job executor** is the person who carries out the job (ODI). A pitfall about defining jobs by demographics is titled "Defining the job by who the customer is", not "Confusing the job with the job executor" (`JTBD:429`).
- **Stability:** "The underlying job is stable over long periods; the ways people get it done, and the situations they meet it in, change. Revisit your job stories when the context changes (for example once a quarter), not because the job itself has changed." This settles `JTBD:268,426` vs `:431` (C-37).
- **Forces of progress:** push of the current situation, pull of the new solution, anxiety about the new solution, habit of the present. Credit Bob Moesta and Chris Spiek, together with the switch interview.
- **The drill and the hole:** "People don't want a quarter-inch drill, they want a quarter-inch hole" is usually credited to Theodore Levitt, who credited Leo McGinneva. Teach it on the page before any quiz uses it.
- **Sources:** Clayton Christensen et al., *Competing Against Luck*, 2016 (milkshake case). Anthony Ulwick, *What Customers Want*, 2005, and *Jobs to Be Done: Theory to Practice*, 2016. Paul Adams, "Replacing the user story with the job story," Intercom blog, 2013. Alan Klement, *When Coffee and Kale Compete*, 2016. Bob Moesta and Chris Spiek (Re-Wired Group); Moesta, *Demand-Side Sales 101*, 2020.

#### User Story Mapping

- **Say:** "A story map lays the user's journey left to right and the possible stories for each step top to bottom, in priority order. Lines drawn across the map cut it into releases, so every release covers the whole journey."
- **Layers (one definition):**
  - **Goal:** what the user is trying to achieve; frames the map.
  - **Activities:** the big things the user does, the chapter headings, across the top.
  - **Steps** (user tasks): the steps within each activity, in narrative order, directly under the activities.
  - **Backbone:** the activities and their steps together, the top two rows. Activities sit at the top of the backbone, not above it.
  - **Body:** the stories (details, options, alternatives) hung under each step, highest priority first.
- **Rules of thumb (stated once, as rules of thumb):** 3–7 activities; 8–15 steps across the backbone. A builder must offer as many activity inputs as the rule allows (7), or the rule must say "up to 6" (`USM:535`).
- **Release slices:** horizontal lines across every column. Everything above the first line is Release 1.
- **Walking skeleton:** Release 1, the thinnest version of the whole journey that works end to end. The term comes from Alistair Cockburn; Patton uses it for the first slice.
- **"Vertical slice":** do not use it as the anti-pattern. If the term appears, say: "Agile teams often call this a vertical slice, because it cuts through every layer of the system. On the map it is drawn as a horizontal band." (The rewritten guide already says this.)
- **Kano and releases:** do not map Must-haves to Release 1, Performance to Release 2 and Delighters to Release 3 (`USM:650`). Release 1 is the thinnest end-to-end journey, which usually includes some Must-haves and not others.
- **Shared understanding:** paraphrase Patton's point that the map's value is the shared understanding built while making it. Do not present it as a quotation.
- **Source:** Jeff Patton with Peter Economy, *User Story Mapping*, O'Reilly, 2014. Alistair Cockburn, *Crystal Clear*, 2004 (walking skeleton).

#### Design Thinking

- **Say:** "Design thinking is a human-centered way to solve a problem you do not fully understand yet. The Stanford d.school's model has five modes: Empathize, Define, Ideate, Prototype and Test. Teams move back and forth between them rather than through them once."
- **Attribution:** design thinking as a practice predates the d.school (Herbert Simon, Peter Rowe, IDEO). The five-mode model is the d.school's (Hasso Plattner Institute of Design at Stanford). `frameworks.js` ("IDEO and the Stanford d.school") is correct.
- **Double Diamond:** a separate model, introduced by the UK Design Council in 2005, with four stages: Discover, Define, Develop, Deliver. The first diamond explores and then narrows the problem; the second explores and then narrows the solution. It is not part of the d.school process. A guide may show the d.school modes against it only as an analogy, captioned as such.
- **Canonical durations:** empathy research 1–2 weeks before a workshop; a prototype takes "a few hours, two days at most"; a full cycle typically 2–6 weeks; the workshop agenda runs 200 minutes (3 h 20 min). The worked example's prototype takes about 6 hours (C-34).
- **Five users:** "Testing with about five users finds most usability problems" is Jakob Nielsen and Tom Landauer's model (1993; Nielsen, "Why You Only Need to Test with 5 Users," 2000). It applies to usability problems in one round of testing, under stated assumptions, not to insight in general.
- **Relation to JTBD:** JTBD is one lens a team can use during Empathize. Empathy research is broader. Do not write "Empathize IS JTBD research" (`DT:366`).
- **Sources:** Hasso Plattner Institute of Design at Stanford, *An Introduction to Design Thinking: Process Guide*. Tim Brown, *Change by Design*, 2009. Design Council, *Eleven Lessons: Managing Design in Eleven Global Brands*, 2005 (first publication of the Double Diamond).

### 1.3 Strategy

#### Porter's Five Forces

- **Say:** "Five forces shape how profitable an industry is on average: rivalry among existing competitors, the threat of new entrants, the threat of substitutes, the bargaining power of buyers and the bargaining power of suppliers. The stronger the forces, the harder it is for anyone in the industry to earn high returns."
- **Facts:**
  - Name: Porter's Five Forces (not "5 Forces", "Porter's" or "Porter").
  - A **competitor** offers the same kind of product for the same job (another piano app). A **substitute** meets the same need in a different way (free video tutorials, a private teacher). A product for a different job (a music streaming service) is neither.
  - Complements are not a sixth force; Porter's 2008 article treats them as a factor that affects the forces.
  - "Strategy is about being different" comes from Porter's "What Is Strategy?" (1996), not from the Five Forces article. Attribute it or leave it out.
  - "Stuck in the middle" comes from Porter's *Competitive Strategy* (1980).
- **Sources:** Michael E. Porter, "How Competitive Forces Shape Strategy," *Harvard Business Review*, 1979; "The Five Competitive Forces That Shape Strategy," *HBR*, 2008; *Competitive Strategy*, 1980; "What Is Strategy?," *HBR*, 1996.

#### Blue Ocean Strategy

- **Say:** "Blue Ocean Strategy is about making the competition irrelevant by creating a leap in value for buyers while lowering cost, which Kim and Mauborgne call value innovation. The two main tools are the strategy canvas, which shows how offerings compare on the factors an industry competes on, and the four actions framework: which factors to eliminate, reduce, raise and create."
- **Order:** always Eliminate, Reduce, Raise, Create (ERRC), in prose, cards, builder and quiz (`Blue-Ocean:70` lists them in another order).
- **Four questions:** Which factors that the industry takes for granted should be eliminated? Which factors should be reduced well below the industry's standard? Which should be raised well above it? Which should be created that the industry has never offered?
- **Grid layout (the book's):** a 2×2 with Eliminate top-left, Raise top-right, Reduce bottom-left, Create bottom-right. The left column (Eliminate, Reduce) is where cost comes down; the right column (Raise, Create) is where buyer value goes up. Use this layout on every page that draws the grid (`cards data-cols="2"` in that order: Eliminate, Raise, Reduce, Create).
- **No ranking of actions:** the book does not call any action the most important or hardest. Remove "Why is Eliminate the most important?" (`:490`) and "Eliminate + Create is the strongest pair" (`:482`).
- **Three tiers of noncustomers:** first tier, "soon-to-be" noncustomers on the edge of the market who use it minimally and are ready to leave; second tier, "refusing" noncustomers who consciously choose against the market's offerings; third tier, "unexplored" noncustomers in markets distant from yours. Noncustomers may use another solution; the quiz explanation "aren't using any solution" (`:491`) is wrong.
- **Other core content a guide may add:** the three characteristics of a good strategy (focus, divergence, a compelling tagline); the six paths framework; the buyer utility map. And the book's own warning that blue oceans attract imitators and eventually turn red.
- **The Yellow Tail case, as the book presents it** (Casella Wines' [yellow tail], launched in the US in 2001):

  | Action | Factors |
  |---|---|
  | Eliminate | Enological terminology and distinctions; aging qualities; above-the-line marketing |
  | Reduce | Wine complexity; range of wines; vineyard prestige |
  | Raise | Price versus budget wines; retail store involvement |
  | Create | Easy drinking; ease of selection; fun and adventure |

  On the strategy canvas, [yellow tail] is priced above budget wines and below premium wines; it sits at the bottom on terminology, marketing and aging, low on complexity, range and vineyard prestige, and high on the three created factors, where both premium and budget wines are low. "Range of wines" and "ease of selection" are two separate factors that move in opposite directions; never merge them into one "Selection" factor (`:178`). Vineyard prestige and complexity were reduced, not eliminated; marketing was eliminated (`:202`). Before publishing the canvas, check the plotted levels against the figure in the book.
- **Source:** W. Chan Kim and Renée Mauborgne, *Blue Ocean Strategy*, Harvard Business School Press, 2005 (expanded edition 2015).

#### Playing to Win

- **Say:** "Playing to Win treats strategy as five linked choices: What is our winning aspiration? Where will we play? How will we win? What capabilities must we have? What management systems do we need? Each choice must fit the ones above and below it."
- **Facts:**
  - Authors: A.G. Lafley (former CEO of Procter & Gamble) and Roger L. Martin (former dean of the Rotman School of Management, a long-time adviser to P&G). Martin was never a P&G employee (`PTW:70`).
  - The five choices form the **strategy choice cascade**. The cascade is nested: it repeats at company, category and brand level.
  - Draw it as a cascade (five boxes top to bottom, with arrows that also run back up), not a funnel. If a funnel image is kept, its shape must match the figure (C-51).
  - How to win is built on cost leadership (lowest cost, not lowest price) or differentiation (C-52).
  - The book prescribes no number of capabilities (`:151`).
  - Martin's method for testing choices is "What would have to be true?". A guide can name it.
  - "Stuck in the middle" is Porter's term; credit it if used (`:279–281`, quiz Q5).
- **Source:** A.G. Lafley and Roger L. Martin, *Playing to Win: How Strategy Really Works*, Harvard Business Review Press, 2013.

#### Wardley Mapping

- **Say:** "A Wardley map places the components that serve a user need on two axes: how visible each component is to the user (the value chain, top to bottom) and how evolved it is (left to right, from genesis to commodity). Because components evolve, the map shows where to build, where to buy and where to outsource."
- **Axes:**
  - Vertical: the value chain, anchored at the top by the user and their need; components lower down are less visible to the user. It is not importance.
  - Horizontal (evolution), four stages: Genesis, Custom-built, Product (including rental), Commodity (including utility).
  - Parallel label sets, used only as full sets: practices (Novel, Emerging, Good, Best); data (Unmodelled, Divergent, Convergent, Modelled); knowledge (Concept, Hypothesis, Theory, Accepted). Never mix "Good enough" or "Utility" into the practice row (`Wardley:82–85`).
- **Predictability:** "The direction of evolution is predictable; its timing is not." Say this wherever the page says evolution is "predictable" (`:141,219`).
- **Stage actions (as guidance, consistent with the example table):** Genesis, explore; Custom-built, build where it differentiates; Product, buy or adopt unless you have a reason to differentiate; Commodity, outsource or use a utility. The example table must not tell the reader to "differentiate heavily" on a Product-stage component (C-54).
- **Higher-order systems:** commoditized components enable new higher-order systems. Correct example: utility compute (for example Amazon EC2, 2006) let a wave of new online services be built without owning servers. Do not say "cloud enabled SaaS" (SaaS came first) (`:276`).
- **Core concepts a guide should at least name:** anchor (user need), inertia, climatic patterns, doctrine, gameplay, pioneers / settlers / town planners.
- **Source:** Simon Wardley, *Wardley Maps* (book published online, 2016 onward); mapping developed around 2005.

### 1.4 Growth

#### AARRR (pirate metrics)

- **Say:** "AARRR splits the customer lifecycle into five stages and gives each one a metric: Acquisition, Activation, Retention, Referral and Revenue. It shows where in the journey people drop out."
- **Order:** McClure's 2007 talk lists Acquisition, Activation, Retention, Referral, Revenue. Many later write-ups put Revenue before Referral. Teach McClure's order and note the variant once; do not test either order as "the" order without that note (`AARRR:68,325`).
- **Attribution:** "Dave McClure, 2007." Not "Dave McClure (500 Startups)": 500 Startups was founded in 2010.
- **Activation and the aha moment:** activation is the first time a new user experiences the product's core value, defined as a specific event in a time window.
- **Where the "biggest leak" claim belongs:** in the worked example only, computed from the example's own numbers (Larkwell's is retention, §5). Never as a general claim about an industry ("for most music learning apps, the biggest leak is retention", `:230`) and never as a fixed priority order for all products (`:168`).
- **Stage priority:** state as a heuristic: fix activation and retention before paying for more acquisition, because acquired users who never activate or return are wasted spend. Before product-market fit, retention is the signal that matters; the full funnel is more useful after it.
- **Source:** Dave McClure, "Startup Metrics for Pirates: AARRR!," talk and slides, 2007.

#### Growth Loops

- **Say:** "A growth loop is a closed system: new users take an action that produces an output, and that output brings in more new users. A funnel ends at its last stage; a loop feeds its output back in as input, so growth can compound."
- **Facts:**
  - Acquisition loop types: viral (users invite or expose others), content (user-generated, where users create the content, or company-generated, where the company does), and paid (revenue is reinvested in acquisition). The content example must match its label: a blog post written by the company is a company-generated content loop (`Loops:255`).
  - A loop's speed depends on the conversion at each step and on the **cycle time** (how long one turn takes).
  - **K-factor** = invitations sent per user × conversion rate of an invitation. K above 1 means each cohort brings in more than itself; this is rare and usually temporary.
  - A paid loop compounds only if lifetime value exceeds acquisition cost and the payback period is short enough to reinvest. "Paid loops have zero defensibility" and "the weakest" are overclaims (`:179,222`).
  - Funnels still have a use inside loops: each step of a loop is measured as a conversion.
  - "Loop strength = Amplitude × Conversion ÷ Cycle time" (`:229`) is not a published formula. Present it as the guide's heuristic ("a loop gets stronger when more people take part, more of them convert and each turn is faster") or remove it.
- **Source:** Brian Balfour, Casey Winters, Kevin Kwok and Andrew Chen, "Growth Loops are the New Funnels," Reforge, 2018. Add Andrew Chen to the `frameworks.js` origin.

#### North Star Framework

- **Say:** "The North Star Metric is the single metric that best captures the core value customers get from the product. The North Star Framework pairs it with three to five input metrics that teams can influence directly."
- **Facts:**
  - The NSM is a leading indicator of revenue and long-term business results. Relative to its own inputs it is an output: inputs move first, the NSM follows. Both statements are true; a guide states both (C-02).
  - It measures value delivered in a time window ("per week"), not value captured (revenue).
  - Amplitude's criteria: it expresses customer value, represents the product vision and strategy, is a leading indicator of business results, is actionable, is understandable, is measurable, and is not a vanity metric. Teach these as the standard criteria. A guide-made "4 tests" litmus (Value, Revenue, Game, Lever) may stay only if labeled as this guide's shortcut, and the quiz must not present it as the standard (`NS:208–213,360`).
  - Amplitude's three games: the attention game (time spent), the transaction game (purchases or bookings), the productivity game (work done). A guide may use them to help readers pick a NSM.
  - Famous examples (Spotify time spent listening, Airbnb nights booked, Slack messages sent, Netflix hours watched) are "commonly cited" examples, not quoted from the companies. Use "messages sent" for Slack, not "messages sent in teams of 2+".
- **Relation to OKRs:** "The NSM is a long-lived metric; OKRs are set each quarter. The Objective stays qualitative. The NSM, or one of its inputs, usually appears as a key result ('Weekly Active Learners from 40,000 to 50,000'). The NSM is never the Objective, and the projects that move it are never key results." (C-04)
- **Sources:** Amplitude, *The North Star Playbook* (John Cutler and colleagues). Sean Ellis and Morgan Brown, *Hacking Growth*, 2017 (popularized the term).

#### Input and Output Metrics

- **Say:** "Output metrics are the results you want, such as revenue or retention. Input metrics are the controllable, customer-facing measures a team can move directly and that, when they rise, push the outputs up. Inputs are metrics, not tasks or projects."
- **Facts:**
  - An input metric is something like selection, price, delivery speed or (for a learning app) lesson completion rate or practice sessions per learner. "We shipped 5 new lessons" is an activity; "quality-reviewed beginner lessons available" is the input metric it moves (`I/O:76–77,110`).
  - **Retention is an output metric.** State it once, in the glossary sense: a team cannot change retention directly; it changes retention by moving inputs. In a metric tree retention can sit between the inputs and the NSM as an intermediate output; it is never a team's input (C-01).
  - Output metrics lag the inputs that drive them. Do not say "outputs are lagging indicators" without "of their inputs", because the NSM is also called leading (C-02).
  - Every input that can be gamed should be paired with a **counter-metric** that worsens when the input is over-optimized. A counter-metric must pull against the input, not move with it (C-14).
  - Amazon reviews controllable input metrics weekly in its Weekly Business Review (WBR).
  - Revenue decomposes as Revenue = paying users × ARPPU = active users × paid conversion × ARPPU = active users × ARPU. Never "Users × Conversion × ARPU" (`I/O:227`) or "Paying users × ARPU" (`:213,221`) (C-08).
- **Source:** Colin Bryar and Bill Carr, *Working Backwards*, 2021 (controllable input metrics, the WBR).

### 1.5 Execution

#### Agile and Scrum (Scrum Guide 2020)

- **Say:** "Scrum is a lightweight framework in which a small team delivers a usable Increment every Sprint and inspects and adapts its product and its way of working at fixed events."
- **Facts (all from the 2020 Scrum Guide):**
  - **Scrum Team:** one Product Owner, one Scrum Master and Developers, typically 10 or fewer people in all. No "Development Team", no "3–9 people".
  - **Accountabilities**, not roles. The Product Owner is accountable for maximizing the value of the product and for managing the Product Backlog (may delegate the writing of items). The Scrum Master is accountable for the team's effectiveness and is described as a true leader who serves the team and the organization. Developers create the Increment.
  - **Five events:** the Sprint (the container for the other four; fixed length, one month or less), Sprint Planning (up to 8 hours for a one-month Sprint, usually shorter for shorter Sprints), Daily Scrum (15 minutes, for the Developers to inspect progress toward the Sprint Goal and adapt the plan; the guide prescribes no three questions), Sprint Review (up to 4 hours for a one-month Sprint; a working session with stakeholders on what to do next, not just a demo), Sprint Retrospective (up to 3 hours for a one-month Sprint).
  - **Product Backlog refinement** is an ongoing activity, not an event.
  - **Three artifacts and their commitments:** Product Backlog and the Product Goal; Sprint Backlog and the Sprint Goal; Increment and the Definition of Done.
  - **Scope during a Sprint:** no changes that endanger the Sprint Goal; scope may be clarified and renegotiated with the Product Owner as more is learned. Do not write "no new items, ever" and then teach a swap rule in the quiz (C-71).
  - Use "events", never "ceremonies".
- **Not in the Scrum Guide:** story points, velocity, user stories and the "As a / I want / so that" format are common complementary practices. A guide may teach them, labeled as practices many Scrum teams use.
- **Story points:** use the modified Fibonacci set 1, 2, 3, 5, 8, 13 (and 20 if needed). Only items that meet the Definition of Done count toward velocity; there is no partial credit. "An 8 is roughly twice a 5" if a ratio sentence is wanted; never "a 5 is roughly twice a 3".
- **Agile vs Scrum:** Agile is the set of values and principles in the *Manifesto for Agile Software Development* (2001); Scrum is one framework that applies them.
- **Sources:** Ken Schwaber and Jeff Sutherland, *The Scrum Guide*, November 2020. Beck et al., *Manifesto for Agile Software Development*, 2001.

#### Shape Up

- **Say:** "Shape Up fixes the time and lets the scope vary. Senior people shape a problem into a rough, bounded pitch with an appetite; a betting table chooses which pitches to bet a six-week cycle on; a small team then has the whole cycle to build it, cutting scope as needed to ship on time."
- **Facts:**
  - **Fixed time, variable scope.** The appetite caps the time; the team hammers the scope to fit. Quality is not the variable. This replaces "Fixed time AND fixed scope… the variable is quality of execution" everywhere (C-66).
  - Cycles are six weeks, followed by a two-week cooldown (unscheduled time for bugs, exploration and the betting table).
  - **Appetite:** how much time a problem is worth. Small batch: one to two weeks of work (several small-batch projects fill one cycle). Big batch: the full six weeks.
  - **Shaping** happens in parallel with the current cycle, done by a small senior group; the book gives no fixed shaping duration. Remove "Phase 1: Shape (2–4 weeks)" (`Shape-Up:129`).
  - **Pitch ingredients:** Problem, Appetite, Solution, Rabbit holes, No-gos.
  - **Shaping tools:** breadboarding (places, affordances and connection lines, no visual design) and fat-marker sketches.
  - **Betting table:** meets during cooldown and decides what the next cycle builds. No central backlog; pitches that are not bet on are not kept by the process (anyone may keep their own notes and re-pitch later).
  - **Circuit breaker:** a project that does not ship by the end of its cycle does not get an extension by default; it can be reshaped and re-pitched. The book allows rare exceptions for work that is very close to done.
  - **Scopes and scope hammering:** the team breaks the work into scopes and cuts whatever does not fit the appetite.
  - **Hill chart:** each scope moves uphill while the team figures out what to do and downhill while it executes. It replaces percent-complete reporting.
  - **Team:** a typical project team is one designer and one or two programmers.
  - Basecamp, the company, is now called 37signals. Do not call Shape Up "Basecamp's alternative to Scrum"; the book does not frame it against Scrum.
  - Shape Up uses "cycle", never "sprint".
- **Source:** Ryan Singer, *Shape Up: Stop Running in Circles and Ship Work that Matters*, Basecamp, 2019.

#### Dual-Track Agile

- **Say:** "Dual-track agile runs discovery and delivery as two parallel, continuous kinds of work in the same team. Discovery finds out what is worth building by testing ideas cheaply; delivery builds and ships what discovery has de-risked. Both happen every week."
- **Facts:**
  - The same cross-functional team does both. Discovery is led by the product trio: product manager, designer and tech lead. The tech lead is a full member of discovery, not "sometimes one engineer" (`Dual-Track:67`).
  - It is not a handoff between two teams and not a fixed lag of "discovery 1–2 sprints ahead of delivery." Remove the "validated backlog" handoff framing (`:29,38,70`, quiz Q3).
  - Discovery tests address the four risks: value (will customers want it?), usability (can they use it?), feasibility (can we build it?) and business viability (does it work for the business?).
  - Discovery experiments are small and fast: "hours to days", not "1–3 days max" (C-76).
  - Origin: Desirée Sy described parallel design and development tracks at Autodesk in 2007, with designers working a cycle ahead of developers. Jeff Patton and Marty Cagan later popularized "dual-track" and stressed that the tracks are continuous and done by one team, which is what the guide teaches. Credit Sy in the origin line.
- **Sources:** Desirée Sy, "Adapting Usability Investigations for Agile User-centered Design," *Journal of Usability Studies*, 2007. Marty Cagan, *Inspired*, 2nd ed., 2017. Jeff Patton, "Dual Track Development is not Duel Track," 2017.

#### OKRs

- **Say:** "An OKR has an Objective, a short qualitative statement of what you want to achieve, and two to five Key Results, measurable outcomes that show whether you got there. OKRs are set for a fixed period, usually a quarter, and graded at the end."
- **Facts:**
  - **Counts (everywhere, including the comparison picker and the builder):** no more than three to five objectives per team per period, each with two to five key results. (Doerr and Google both recommend a small number per objective; this guide uses 2–5 so a narrow objective can have just two.)
  - **Key results** are outcomes, written "from X to Y" where a baseline exists. Tasks and projects (initiatives) are not KRs. A committed KR may be an output ("Publish 8 beginner song lessons") when the output is the promise; label it as a deliberate exception.
  - **Committed vs aspirational.** Committed OKRs are promises the team expects to hit in full (1.0). Aspirational OKRs are stretch goals; the expected average score is about 0.7. The 0.7 rule applies to aspirational OKRs only, including in the summary (`OKRs:68,135`). Label every OKR as one or the other.
  - "Rooftop" is not a term. "Roofshot" and "moonshot" (from X, the Alphabet lab) describe degrees of ambition, not committed vs aspirational. Remove the pair or teach it separately, correctly (`:183`).
  - Grading: 0.0–1.0 per KR. Do not tie OKR scores to compensation.
  - Cascades: higher-level KRs often become lower-level objectives or KRs; alignment can also run bottom-up. "Each level's KRs feed the level above" is fine as a description of the example.
  - Relation to the NSM: see North Star above (C-04).
- **Sources:** Andy Grove, *High Output Management*, 1983. John Doerr, *Measure What Matters*, 2018. Google, "Set goals with OKRs" (re:Work guide; committed vs aspirational and the 0.7 expectation).

### 1.6 Communication

#### STAR Method

- **Say:** "STAR structures an answer to a behavioral interview question as a short story: the Situation, your Task, the Actions you took and the Result."
- **Facts:**
  - Weights as a rule of thumb: Situation about 15%, Task about 10%, Action about 50%, Result about 25%. Length: 90 seconds to 2 minutes. State the length once in the guide and refer back to it.
  - Ending with what you learned is the STAR+L variant (also written STARL; CARL is a related variant). Name it when the guide teaches the learning.
  - Use "I" for your own actions; "we" only for the team's.
- **Attribution:** STAR is commonly credited to Development Dimensions International (DDI), which uses it in its behavioral interviewing method (Targeted Selection). Use "commonly credited to"; `frameworks.js` ("Standard practice in behavioral interviewing") should add the DDI credit in that form.

#### Pyramid Principle

- **Say:** "The Pyramid Principle puts the main point first and supports it with a small group of ideas, each supported in turn by the ideas below it. The reader gets the answer at once and can stop reading as soon as they are convinced."
- **Minto's three rules (exact):**
  1. Ideas at any level in the pyramid must always be summaries of the ideas grouped below them.
  2. Ideas in each grouping must always be the same kind of idea.
  3. Ideas in each grouping must always be logically ordered.
- **Orders for rule 3:** deductive order (an argument), chronological order (time), structural order (parts of a whole, or place) and comparative order (degree or importance). Time, structure and degree are not rule 2 (`Pyramid:115–117`). Between levels the logic is deductive or inductive; within a group it is one of these orders. Do not list "deductive, inductive or chronological" as one set (`:122`).
- **"Start with the answer"** is the governing principle of the pyramid (the governing thought at the top), not one of the three rules.
- **SCQA:** Minto's introduction: Situation (what the reader already knows and agrees with), Complication (what changed or went wrong), Question (the question this raises in the reader's mind), Answer (your main point, the top of the pyramid). The introduction should remind the reader of what they know, not tell them something new.
- **MECE** (mutually exclusive, collectively exhaustive) is the test for a grouping: no overlaps, no gaps.
- **Source:** Barbara Minto, *The Pyramid Principle: Logic in Writing and Thinking* (developed from her training work at McKinsey). Name the book in the guide.

#### Narrative Arc

- **Say:** "The narrative arc structures a product story in five beats: Status quo, Disruption, Struggle, Resolution and New reality. It builds tension before it offers the answer, so the audience feels the problem before they hear the solution."
- **Lineage:** the five beats are this guide's adaptation of two sources. Gustav Freytag's pyramid of dramatic structure (exposition, rising action, climax, falling action, dénouement; *Die Technik des Dramas*, 1863) and Nancy Duarte's presentation form, which moves between "what is" and "what could be" and ends with a call to action (*Resonate*, 2010). Say this once; update the `frameworks.js` origin to name Duarte.
- **Beat weights** (about 10 / 15 / 25 / 30 / 20%) are a rule of thumb, labeled as such.
- **Relation to Pyramid:** Pyramid gives the answer first; the narrative arc gives it after the tension. Never call the arc "an oral Pyramid" (`Narrative:196`). The arc can use a pyramid inside the Resolution to present the evidence.
- **Relation to STAR:** STAR follows a similar story order, but the beats do not map one to one. If a mapping is shown: Situation ≈ Status quo plus Disruption, Action ≈ Struggle plus Resolution, Result ≈ New reality. Task is the assignment, not the disruption (`:195,235`).

#### Executive Summary

- **Say:** "An executive summary is a short, decision-ready brief for leadership. It opens with the recommendation, then gives only the context, data, options, risks and request needed to make the decision. It is written last and read first."
- **Six sections, in this order:** Recommendation; Context; Key data (the three to five points that decide it); Options considered; Risks and mitigations; Ask and next steps (who, what, by when).
- **BLUF:** "bottom line up front", a US military writing convention: the conclusion and the request come first.
- **Relation to SCQA:** because the recommendation comes first, the Context section is a compressed Situation and Complication (one or two sentences). The Question is implied and the Answer is already the Recommendation. Do not tell readers to "use SCQA format" for Context without saying this (C-92).
- **Amazon:** Amazon's senior meetings use six-page narrative memos read in silence at the start of the meeting, and new-product proposals use the PR/FAQ, which opens with a press release (Bryar and Carr, *Working Backwards*, 2021; Jeff Bezos, 2017 letter to shareholders). They are not executive summaries. There is no verifiable Bezos quote about summaries (§4).

---

## 2. Glossary

One definition per term. A guide may reword for flow but must not contradict it. Terms are grouped by domain; framework-specific vocabulary is in §1.

### 2.1 Growth and metrics

| Term | Definition | Do not confuse with |
|---|---|---|
| Activation | The share of new accounts that reach the product's first real value moment (the aha moment) within a stated window. Larkwell: completes a first song lesson within 24 hours of sign-up. | Sign-up or onboarding completion |
| Aha moment (value moment) | The event at which a new user first experiences the product's core value. | A screen in the onboarding flow |
| ARPU | Average revenue per user: revenue in a period ÷ all users in the base you state (for example MAU). | ARPPU |
| ARPPU | Average revenue per paying user: revenue in a period ÷ paying users (subscribers). Larkwell: $9.00 a month. | ARPU |
| CAC | Customer acquisition cost: total sales and marketing spend in a period ÷ new paying customers in that period. State whether it is blended (all channels) or per channel. | CPA, CPI |
| CPA | Cost per acquisition: paid spend ÷ the number of a defined action (sign-up, trial start, purchase). Always name the action. | CAC |
| CPI | Cost per install: paid spend ÷ installs from paid channels. | CPA, CAC |
| Churn (subscriber churn) | The share of paying subscribers at the start of a period who cancel during it (monthly unless stated). | Retention, which is measured on a cohort of all new users |
| Cohort | A group of users who share a start event in the same period (for example everyone who signed up in one week). | Segment |
| Counter-metric (guardrail) | A metric that gets worse when an input is pushed too far, used to catch gaming or harm. It pulls against the input. | A metric that moves with the target (churn is not a counter-metric for active learners) |
| Conversion rate | The share of people at one step who complete the next step. Name both steps. | — |
| DAU, WAU, MAU | Daily, weekly and monthly active users: distinct users who do a defined core action in the day, week or 30 days. Larkwell's active action is opening a lesson. | Registered accounts |
| Input metric | A controllable, customer-facing metric a team can move directly that drives an output. It is a metric, never a task or a project. | An initiative or deliverable |
| K-factor | Invitations sent per user × conversion rate of an invitation. Above 1, each cohort brings in more than itself. | Referral share of installs |
| Leading and lagging indicators | Relative terms: a leading indicator moves before the result it predicts; a lagging indicator reports the result after the fact. The NSM leads revenue and lags its inputs. | Input and output (related, but not identical) |
| LTV (lifetime value) | Expected gross profit from a customer over their lifetime. Simple form: ARPPU × gross margin ÷ monthly churn. | Revenue per customer |
| LTV:CAC | Lifetime value divided by acquisition cost. About 3:1 or better is a widely cited rule of thumb for a healthy subscription business (for example in David Skok's SaaS metrics writing); below that, growth spending struggles to pay back. A ratio of 1–3 is not "sustainable". | — |
| MRR, ARR | Monthly and annual recurring revenue: subscription revenue normalized to one month or one year (ARR = MRR × 12). | Bookings |
| North Star Metric (NSM) | The single metric that best captures the core value customers get from the product (§1.4). | Revenue, a KPI dashboard, an OKR objective |
| Output metric | A result you want but cannot move directly, such as revenue, retention or the NSM. It lags the inputs that drive it. | — |
| Payback period | Months of gross profit per customer needed to recover CAC: CAC ÷ (ARPPU × gross margin). | LTV |
| Product-market fit (PMF) | The point at which a product meets a real need well enough that a meaningful share of users keep using it; retention curves that flatten above zero are the usual signal. | Revenue growth |
| Retention (Dn) | The share of a sign-up cohort that is active on day n after sign-up (D1, D7, D30). An output metric. | Churn |
| Trial-to-paid | The share of free-trial starts that become paying subscribers. | Install-to-paid |
| Vanity metric | A metric that can grow without users getting more value (total sign-ups, downloads). | Input metric |
| UGC loop vs company-generated content loop | In a UGC loop users create the content that attracts new users; in a company-generated content loop the company creates it. | — |

### 2.2 Goals and planning

| Term | Definition |
|---|---|
| Objective | A short, qualitative statement of what a team wants to achieve in the period. No numbers. |
| Key result (KR) | A measurable outcome that shows progress toward the objective, written "from X to Y" where a baseline exists. |
| Initiative | A project or task the team does to move a KR. Not a KR. |
| Committed OKR | One the team promises to deliver in full; the expected score is 1.0. |
| Aspirational OKR | A stretch goal; the expected average score is about 0.7. |
| Grading | Scoring each KR from 0.0 to 1.0 at the end of the period. |
| Cascade | Linking OKRs across levels so lower-level objectives and KRs support higher-level ones. |
| Roadmap | A plan of what a team intends to work on over time, usually by quarter. Not a list of KRs. |

### 2.3 Delivery

| Term | Definition |
|---|---|
| Sprint | Scrum's fixed-length event of one month or less (Larkwell: two weeks) that contains the other events. |
| Cycle | Shape Up's six-week period of building, followed by a two-week cooldown. Never called a sprint. |
| Cooldown | Shape Up's two weeks between cycles: unscheduled time for bugs, exploration and betting. |
| Appetite | Shape Up: how much time a problem is worth, set before shaping (small batch 1–2 weeks, big batch 6 weeks). |
| Betting table | Shape Up: the meeting in cooldown where senior people choose which pitches the next cycle builds. |
| Pitch | Shape Up: a shaped proposal with Problem, Appetite, Solution, Rabbit holes and No-gos. |
| Rabbit hole | Shape Up: a known risk in the solution that the pitch resolves or rules out in advance. |
| No-go | Shape Up: something the pitch explicitly excludes. |
| Scope hammering | Shape Up: cutting scope to fit the fixed time. |
| Hill chart | Shape Up: a chart where each scope moves uphill (figuring out) then downhill (executing). |
| Breadboard | Shape Up: a sketch of places, affordances and connections, with no visual design. |
| Fat-marker sketch | Shape Up: a sketch drawn so broadly that it cannot carry detail. |
| Product Goal, Sprint Goal, Definition of Done | The three Scrum commitments, one for each artifact (Product Backlog, Sprint Backlog, Increment). |
| Increment | A usable, Done piece of product that adds to all prior Increments. |
| Product Owner vs product manager | The Product Owner is a Scrum accountability; a product manager is a job. One person often holds both, but the guide must not equate them or address the reader as "the PO". |
| Story points | A relative estimate of the size of a backlog item, commonly on 1, 2, 3, 5, 8, 13. A complementary practice, not part of the Scrum Guide. |
| Velocity | Story points of items that met the Definition of Done in a Sprint; averaged over several Sprints for planning only. No partial credit. |
| User story | A short description of a need from the user's view, often "As a [user], I want [capability], so that [benefit]". |
| Discovery, delivery | Discovery decides what is worth building by testing ideas; delivery builds and ships it. In dual-track agile the same team does both continuously. |
| Product trio | Product manager, designer and tech lead, who lead discovery together. |
| Four product risks | Value, usability, feasibility and business viability (Cagan). |
| MVP | The smallest product that lets you learn whether the core assumption holds. Not the same as Release 1 of a story map, which is the thinnest complete journey. |
| Walking skeleton | The thinnest end-to-end version of a journey or system that works. |
| Release slice | A horizontal cut across a story map; everything above it ships in that release. |
| Kanban | A flow-based method that limits work in progress. Not covered by a guide in this set (§3, C-85). |

### 2.4 Design and research

| Term | Definition |
|---|---|
| Job (JTBD) | The progress a person is trying to make in a given situation. |
| Job story | "When [situation], I want to [motivation], so I can [expected outcome]." (Intercom, Klement.) |
| Job statement | Verb + object + contextual clarifier, for example "listen to music while commuting." (Ulwick, ODI.) |
| Job executor | The person who carries out the job. |
| Forces of progress | Push, pull, anxiety and habit, which together decide whether someone switches (Moesta, Spiek). |
| Switch interview | A JTBD interview that reconstructs, step by step, how someone came to switch to or from a product. |
| Persona | A described archetype of a user segment, used to keep a team's view of the user consistent. |
| Empathy map | A grid of what a user says, thinks, does and feels, filled from research. |
| POV statement | Design thinking: "[User] needs [need] because [insight]." |
| How might we (HMW) | A question that turns an insight into an invitation to generate ideas. |
| Prototype | The cheapest artifact that lets you test an idea with users. |
| Usability test | A session where a user tries to complete tasks with a design while you observe. |

### 2.5 Strategy

| Term | Definition |
|---|---|
| Competitor | A firm offering the same kind of product for the same job. |
| Substitute | A different way of meeting the same need. |
| Complement | A product that makes yours more valuable when used together. Not a sixth force. |
| Value curve | One offering's levels across the factors on a strategy canvas. |
| Strategy canvas | A chart of the factors an industry competes on (horizontal) and each offering's level on them (vertical). |
| Value innovation | Lifting buyer value and lowering cost at the same time (Kim and Mauborgne). |
| Red ocean, blue ocean | Existing market space where rivals compete on the same factors, and uncontested market space created by changing those factors. |
| Noncustomers | People outside the current market, in three tiers (§1.3). |
| Winning aspiration, where to play, how to win, capabilities, management systems | The five choices of the Playing to Win cascade. |
| Cost leadership, differentiation | The two generic ways to win: lowest cost in the industry, or a valued difference customers pay for. |
| Stuck in the middle | Porter's term for a firm that achieves neither cost leadership nor differentiation. |
| Anchor | Wardley: the user and their need, at the top of the map. |
| Evolution | Wardley: a component's movement from genesis to commodity, driven by supply and demand competition. |
| Inertia | Wardley: resistance to change, often from past success. |

### 2.6 Communication

| Term | Definition |
|---|---|
| Governing thought | The single main point at the top of a pyramid. |
| SCQA | Situation, Complication, Question, Answer: Minto's introduction structure. |
| MECE | Mutually exclusive, collectively exhaustive: no overlaps and no gaps within a grouping. |
| BLUF | Bottom line up front. |
| Behavioral interview | An interview that asks for past examples ("Tell me about a time…") to predict future behavior. |
| Product design (product sense) interview | An interview that asks the candidate to design or improve a product. |
| Case interview | An interview that asks the candidate to analyze a business problem and give a recommendation. |

### 2.7 Notation

- Confidence in RICE: percentages (100%, 80%, 50%).
- Numbers: thousands with commas (40,000); money with the symbol first ($9.00, $540,000); round large amounts in prose ($6.5 million).
- Ranges: en dash, no spaces (2–3 weeks, 4–8 people). Times inside agendas: "0–10 min".
- Multipliers: × (2×). Percentage points: "points" in prose ("up 7 points"), "pp" only in tables.
- Dates: no calendar years or named quarters with years in examples. Use "this quarter", "last year", "Q3" without a year.
- Durations: "minutes" in prose, "min" in agendas and tables.

---

## 3. Contradiction resolutions

Every disagreement found by the audits, between pages or inside one page, with the single value to use and the files that must change. Some resolutions depend on the Larkwell case file (§5); those are marked "case".

**File key.** The short names below stand for `public/guides/<File>.html`.

| Short | File | Short | File | Short | File |
|---|---|---|---|---|---|
| RICE | RICE-Framework-Guide | VE | Value-vs-Effort-Matrix | Kano | Kano-Model |
| ICE | ICE-Score | PrioCmp | Prioritization-Comparison-Guide | CIRCLES | CIRCLES-Method |
| JTBD | JTBD-Framework | USM | User-Story-Mapping | DT | Design-Thinking |
| DesignCmp | Design-Comparison-Guide | Porter | Porters-5-Forces | BO | Blue-Ocean-Strategy |
| PTW | Playing-to-Win | Wardley | Wardley-Mapping | StratCmp | Strategy-Comparison-Guide |
| AARRR | AARRR-Pirate-Metrics | Loops | Growth-Loops | NS | North-Star-Framework |
| IO | Input-Output-Metrics | GrowthCmp | Growth-Comparison-Guide | Scrum | Agile-Scrum |
| ShapeUp | Shape-Up | DualTrack | Dual-Track-Agile | OKRs | OKRs |
| ExecCmp | Execution-Comparison-Guide | STAR | STAR-Method | Pyramid | Pyramid-Principle |
| Narrative | Narrative-Arc | ExecSum | Executive-Summary | CommsCmp | Communication-Comparison-Guide |

### 3.1 Growth

| ID | Topic | Found | Canonical value | Change |
|---|---|---|---|---|
| C-01 | Is retention an input or an output? | Input with an owner (`NS:243`); output (`IO:104,114`) | Retention is an output metric. It may sit in a metric tree between inputs and the NSM; no team owns it as an input. Replace the NS input "D7 retention rate" with "practice sessions per active learner per week" (case) | NS, IO, GrowthCmp |
| C-02 | Is the NSM leading or lagging? | Leading (`NS:121`); lagging output (`IO:114,242`) | The NSM leads revenue and lags its inputs. IO says "outputs lag the inputs that drive them", not "outputs are lagging indicators" | NS, IO |
| C-03 | What an input metric is | Activities and projects (`IO:76–77,110`); customer-behavior metrics (`NS:247`) | Inputs are controllable, customer-facing metrics, never tasks. The IO hero lists metrics only: "Onboarding redesign" becomes "median time to first note"; "Push notification timing" becomes "day-3 reminder return rate" | IO, NS, OKRs |
| C-04 | How the NSM and inputs map to OKRs | "North Star = Objective, inputs = KRs" (`NS:300,361`; `IO:326,372`; `OKRs:254–255,300`) | Objectives are qualitative. The NSM or an input metric appears as a KR. Projects are not KRs. Worked KR: "Weekly Active Learners from 40,000 to 50,000" under a qualitative objective (case). Rewrite each quiz so the correct option says this | NS, IO, OKRs, GrowthCmp, ExecCmp |
| C-05 | Which funnel stage leaks most | Retention (`AARRR:230`); activation (`GrowthCmp:66,127`) | Case: retention. 45% of new accounts activate, but only 9% are active on day 30, so four in five activated learners are gone within a month, most of them in week one. Activation (55% never activate) is the second-largest loss. The claim lives only in worked examples | AARRR, GrowthCmp |
| C-06 | Lesson volume | 5, 8, 10/week and 20 (`IO:110,258,372,373`; `GrowthCmp:66`; `NS:361`; `OKRs:177,198`) | Case: the content team publishes 8 new beginner song lessons this quarter (a committed KR), taking quality-reviewed beginner lessons from 120 to 128. No per-week figure | IO, NS, OKRs, GrowthCmp |
| C-07 | CAC, CPA, CPI | "CAC (Cost per Acquisition)", "CAC (Customer Acquisition Cost)", "CPI" used for one idea (`AARRR:180,190,208`) | Three metrics, defined in §2.1. The AARRR metrics table uses CPI for the Acquisition stage and CAC in the unit-economics block | AARRR |
| C-08 | Revenue formula | "Users × Conversion × ARPU" (`IO:227`); "Paying users × ARPU" (`IO:213,221`) | Revenue = paying users × ARPPU = MAU × paid share × ARPPU = MAU × ARPU. Case: 400,000 × 15% × $9.00 = $540,000 = 400,000 × $1.35 | IO |
| C-09 | NSM unit drift | "Lessons completed", "Songs completed per week", "Weekly Active Learners (3+ lessons)" (`NS:120,196,227`) | One unit: Weekly Active Learners, users who complete at least 3 lessons in a calendar week. "Songs completed per week" may stay only as a deliberately weaker draft in the "make it measurable" step, marked as such | NS, GrowthCmp |
| C-10 | AARRR stage order | "Acquisition, Activation, Retention, Revenue, Referral, in that order" (`AARRR:68,325`) | McClure's order is Acquisition, Activation, Retention, Referral, Revenue; note that many write-ups swap the last two. The quiz must not grade either order as the only one | AARRR |
| C-11 | Which stage matters most | Activation "nothing else matters" (`:140`); retention "the KING metric" (`:148`); a fixed five-step priority order (`:168`) vs "skip AARRR pre-PMF" (`:266`) | One heuristic: fix activation and retention before buying more acquisition; before product-market fit, watch retention only. No stage is "the most important" in general | AARRR |
| C-12 | North Star before product-market fit | "Skip pre-PMF" (`NS:288`) vs "Early-stage: focus on activation" (`:215`) | Before product-market fit the NSM is likely to change; a team can use activation as a provisional focus metric, labeled as provisional. Both lines say this | NS |
| C-13 | DAU as a North Star | Facebook DAU listed as a famous NSM (`NS:165`) and "DAU: too vague" (`:178`) | DAU suits products where daily attention is the value (social, messaging); for most products, including a learning app, it is too vague. The trap row says "for most products" and links back to the example | NS |
| C-14 | Counter-metrics in the metric stack | "Churn rate" as the NSM's counter; "time to first lesson" as the onboarding counter (`IO:242,245`) | A counter-metric pulls against the metric it guards. Case: WAL is guarded by average lesson rating; time to first note by week-1 setup errors; new activated learners by D7 retention of new cohorts | IO |
| C-15 | Which product the growth examples are about | Trala in the aha moment (`AARRR:140,327`), Skoove in the funnel (`:204`) | Case: Larkwell throughout | AARRR, NS, Loops, IO, GrowthCmp |
| C-16 | Two metaphors per framework | GrowthCmp "Analogy" row (`:82`) vs each page's memory trick | Delete the Analogy row. A page may keep at most one image (§6.2) | GrowthCmp |

### 3.2 Prioritization

| ID | Topic | Found | Canonical value | Change |
|---|---|---|---|---|
| C-17 | Which framework is "most rigorous" | RICE (`PrioCmp:180,266,479`) vs Kano (`:239`) | RICE is the most rigorous way to rank, because Reach comes from usage data. Kano gathers the most direct user evidence but classifies rather than ranks. From fastest to slowest: ICE, Value vs Effort, RICE, Kano. (The rewritten PrioCmp already says this; keep it and match RICE, Kano and the table to it) | PrioCmp, RICE, Kano |
| C-18 | Triage funnel | 30 → 12 (`PrioCmp:355`) vs 30 → 10 (`ICE:344`; `VE:440,544`) | 30 ideas → about 10 on the first pass → the top 3 after scoring | PrioCmp, ICE, VE |
| C-19 | Where Value vs Effort sits in the pipeline | Last, to "communicate" (`PrioCmp:372–373`) vs first-pass filter (`VE:424,440`, quiz q5) | First pass: ICE or Value vs Effort cuts 30 ideas to about 10. Second: RICE ranks the shortlist. Kano runs alongside, when you need to know how a feature affects satisfaction, not as a step between ICE and RICE. The Value vs Effort grid can be reused at the end to present the result | PrioCmp, VE, ICE |
| C-20 | Picker vs flowchart on RICE without data | The picker recommends RICE with no usage data (`PrioCmp:476–483`); the flowchart (`:261`), RICE "skip when" (`RICE:464`) and RICE quiz q5 say not to | No path recommends RICE without data to estimate Reach. "RICE Score (lite)" is removed. The static decision and the picker share one rules table (`data-picker`) | PrioCmp |
| C-21 | RICE confidence notation | "50%, 80%, or 100%", "50–100%", "0.5, 0.8, or 1.0", "0.5-1.0" (`RICE:325,485,500,665`) | Percentages everywhere a reader sees them, including the CSV header "Confidence (%)" | RICE |
| C-22 | RICE Reach: exact values or bands | "Use these exact values" (`RICE:347`) beside an invented band scale (`:353–356`) | Reach is an estimated count for a stated period. Bands may appear only as "rough orders of magnitude if you have no data", never as required values | RICE |
| C-23 | ICE confidence anchors | Two rubrics on one page (`ICE:293–297` vs `:455`) | The single rubric in §1.1 (1–3, 4–5, 6–7, 8–9, 10). The rewritten ICE's scale already matches; its pitfall fix also does | ICE |
| C-24 | Effort anchors across the three scoring pages | RICE 0.5 = 2 weeks; VE 3 = 1–2 weeks; ICE ease 5–6 ≈ 1 week | The scales are different by design and are not converted. Each page states its own anchors once; VE adds that its effort scale is non-linear. The comparison table says "each framework uses its own scale" | RICE, VE, ICE, PrioCmp |
| C-25 | Fill-ins | "Good for gaps between projects" then "Never prioritize these" (`VE:286–287`) | "Do them when there is spare capacity, for example between larger projects; do not plan around them" | VE |
| C-26 | Fast page load: Performance or Must-have | Speed under Performance (`Kano:266`) and "Fast page load" as Must-have (`:433`) | Speed is a Must-have up to a threshold (pages that load in an acceptable time) and Performance beyond it. Say this once and keep the example as Must-have | Kano |
| C-27 | RICE session voting | "Fingers 1–5" applied to Impact (five values from 0.25 to 3) and Confidence (three values); "divergences > 1 point" (`RICE:559`) | Each person writes down a value from the factor's own scale; discuss any factor where estimates are more than one step apart on that scale | RICE |
| C-28 | Kano category names | Partial parentheticals: "Must-Haves (Basics)", "Performance (Linear)", "Delighters (Attractive)" (`Kano:253,263,273`) | Must-have, Performance, Delighter, Indifferent, Reverse, with Kano's term on first mention (§1.1). The prioritization comparison and the CIRCLES and DT guides use the same five names | Kano, PrioCmp, CIRCLES, USM |

### 3.3 Design

| ID | Topic | Found | Canonical value | Change |
|---|---|---|---|---|
| C-29 | How long CIRCLES takes | 13–21 min, "~15–20", "about 18", 0–24 (`CIRCLES:236–293,433–440`); "15-20 min" (`DesignCmp:121,125,181,246`) | About 20 minutes for the seven steps in a 35-minute question, 15 minutes for follow-up; per-step values in §1.2. The app computes the agenda total | CIRCLES, DesignCmp |
| C-30 | Interview length | 35 min (`CIRCLES:429`; `DesignCmp:420`) vs 30 min (`DesignCmp:465`) | 35 minutes for one product design question | DesignCmp |
| C-31 | Story-mapping session length | 90 min (`DesignCmp:164,187,249,745`) vs 2 hours (`USM:720`) | Two hours (the 120-minute agenda in USM) | DesignCmp |
| C-32 | Workshop size | 4–8 (`USM:726`; `DT:402`), 4–7 (`DesignCmp:256`), 3–8 (`DesignCmp:255`) | 4–8 people for both story mapping and a design thinking workshop | DesignCmp |
| C-33 | Number of JTBD interviews | 8–12 (`JTBD:506,570`; `DesignCmp:193,725`), 5–6 (`DesignCmp:755`), 3–5 (`DesignCmp:720`) | A full study: 8–12 switch interviews, a common practitioner guideline. A quick read: 5–6 conversations, labeled as a starting point. Drop 3–5 | DesignCmp, JTBD |
| C-34 | How long a prototype takes | Hours; 1–3 days; 1–2 days; 2 days and 6 hours in adjacent lines (`DT:256,259,300,301,385,461`) | Rule: "a few hours, two days at most." Worked example: about 6 hours. The quiz option reads "Hours, at most two days" | DT |
| C-35 | Workshop total and format | "Full-day or half-day" with one 200-minute agenda; "Total: ~3.5 hours" (`DT:396,418`) | One agenda of 200 minutes (3 h 20 min), described as a half-day workshop; the total is computed by the app. A full-day version is mentioned in one sentence without its own agenda | DT, DesignCmp |
| C-36 | Length of a design thinking cycle | Full cycle 2 weeks (`DesignCmp:733–736`) vs 2–6 weeks (`:248`); "Hours" option that needs empathy research done beforehand (`:728–731`) | A full cycle takes 2–6 weeks. The picker's two-week plan is "the short end of a full cycle". The fast option says "if empathy research already exists, run the 200-minute workshop and test with 3–5 users the next day" | DesignCmp |
| C-37 | Are jobs stable or do they evolve? | "Stable over time" (`JTBD:268,426`) vs "Jobs evolve… revisit quarterly" (`:431`) | The job is stable; circumstances and solutions change; revisit job stories when context changes (§1.2) | JTBD |
| C-38 | Job story or job statement | The When/I want/So I can format called "Job Statement" (`JTBD:178,229,339`; `DesignCmp:720`) | That format is a job story everywhere; job statement means Ulwick's verb + object + clarifier (§1.2) | JTBD, DesignCmp |
| C-39 | What the backbone is | Activities (`USM:179`); the whole journey (`:215`); user steps with activities above (`:330,405`); quiz Q3 vs Q7 (`:1000,1004`) | Backbone = activities plus their steps, the top two rows. Q7 becomes "What sits at the top of the backbone?" (Activities). Q3 asks about activities and uses 3–7 | USM |
| C-40 | "Vertical slice" | Used as the anti-pattern (`USM:259,684`, quiz `:1001`) | Release slices; a slice is a horizontal band on the map that agile teams also call a vertical slice (§1.2). The anti-pattern is "one feature done completely before the rest of the journey exists" | USM |
| C-41 | Kano categories mapped to releases | Must-haves → R1, Performance → R2, Delighters → R3 (`USM:650`) | Remove. Release 1 is the thinnest end-to-end journey | USM |
| C-42 | Story-map counts | "Activities (3–7)" with six inputs (`USM:535–548`); "8–15 steps max" vs Q3 | 3–7 activities (builder offers 7 inputs or the copy says "up to 6"); 8–15 steps across the backbone | USM |
| C-43 | Completion percentage on the map | A body story in the hero (`USM:191`), a backbone step in Anatomy (`:341`) | "See results" is the backbone step; "Show completion percentage" is a story under it | USM |
| C-44 | CIRCLES and the design pipeline | "CIRCLES is DT compressed for interviews" (`DesignCmp:172,536`; `DT:367,489,492`); CIRCLES as the last pipeline step (`DesignCmp:306`) vs "the odd one out" (`:595`) | CIRCLES is not part of the working pipeline and is not compressed design thinking. Pipeline: JTBD → Design Thinking → User Story Mapping. CIRCLES is for interviews (§1.2) | DesignCmp, DT, CIRCLES |
| C-45 | When everything is unclear | Picker `combo_fast`: "start with a quick Story Mapping session" (`DesignCmp:748–751`) vs USM: skip mapping when "you don't understand the user yet" (`USM:609`) | Start with 5–6 quick JTBD conversations on the riskiest assumption, then map | DesignCmp |
| C-46 | Order in the combined result | Title "Design Thinking + JTBD", body JTBD first (`DesignCmp:739`) | Title and body both "JTBD, then design thinking" | DesignCmp |
| C-47 | Name for items under a backbone step | "Stories" (USM) vs "tasks" (`DesignCmp:587,745`) | Stories. "Tasks" is the other name for steps, so it must not be used for the body | DesignCmp |
| C-48 | Empathize and JTBD | "Empathize phase IS JTBD research" (`DT:366`) | JTBD is one lens for empathy research; empathy research is broader | DT, DesignCmp |

### 3.4 Strategy

| ID | Topic | Found | Canonical value | Change |
|---|---|---|---|---|
| C-49 | How many steps the strategy pipeline has | Three (`StratCmp:114`), four (`:128`; `BO:437`), five with OKRs (`PTW:428`; `Wardley:434`) | Four: Porter's Five Forces → Blue Ocean → Playing to Win → Wardley Mapping. OKRs are where the strategy's output goes next, shown as a relation link, not as a fifth step. The pipeline is written only in StratCmp `combine`; framework pages link to it | StratCmp, BO, PTW, Wardley, Porter |
| C-50 | Time each framework takes | BO 1–2 weeks and PTW 1–4 weeks (`StratCmp:65–66`) vs an offsite that runs Porter, BO and PTW in two days (`:128`) | Overview times are for a full analysis. The offsite scenario says "a first pass of each, using research prepared beforehand" | StratCmp |
| C-51 | Shape of the Playing to Win figure | Memory trick funnel, wide aspiration narrowing down (`PTW:161`) vs hero widening downward (`:74–110`) | A cascade of five equal boxes with arrows down and back up (§1.3). Delete the funnel trick | PTW |
| C-52 | Cost leadership | "cheapest" (`PTW:147`) vs "lowest cost" (`:267`) | Lowest cost, which is not the same as lowest price | PTW |
| C-53 | Aspiration example rules out professional musicians | "Help every adult learn an instrument → rules out professional musicians" (`PTW:186`) | Case: "Help every adult who has wanted to play the piano play the songs they love" rules out children, advanced players and schools, which fits the Where-to-play choice | PTW |
| C-54 | What to do with a Product-stage component | Rule: "buy or adopt, stop custom-building" (`Wardley:252`) vs example: Learning experience at Product, "differentiate heavily here" (`:299`) | Case table (§5.8): the learning experience is Custom-built (differentiate); Product-stage components are adopted | Wardley |
| C-55 | Components in the hero vs the table | Hero "Audio Detection" at Product plus "AI Teacher" at Genesis; table "AI Audio Feedback, Genesis → Custom"; "Mobile SDK" vs "Mobile Framework" (`Wardley:97–98,302,317`) | One component list for hero, example and builder (case, §5.8) | Wardley |
| C-56 | Wardley in interviews | Skip it in a 30-minute interview (`Wardley:403`) yet an interview script (`:375`) | Mention it in an interview; do not draw a full map. The interview line, if kept, says that | Wardley, StratCmp |
| C-57 | Evolution axis labels | Stage names mixed with "Good enough / Utility" (`Wardley:82–85`) | Genesis, Custom-built, Product, Commodity; practice labels, if shown, Novel, Emerging, Good, Best (§1.3) | Wardley, StratCmp |
| C-58 | Order of the four actions | "raising… creating… reducing… eliminating" (`BO:70`) | Eliminate, Reduce, Raise, Create | BO, StratCmp |
| C-59 | Is one action the most important? | "Eliminate is the most important (and hardest)" (`BO:490`); "Eliminate + Create is the strongest pair" (`:482`) | The book ranks none. The quiz asks why the eliminate and reduce questions matter (they are where cost comes down), without ranking | BO |
| C-60 | Noncustomer tiers | Tier definitions (`BO:326–334`) vs quiz explanation "not using any solution" (`:491`) | The book's three tiers (§1.3) in cards, example and quiz | BO |
| C-61 | Which part of the grid cuts cost | "The top row (E + R) cuts costs" (`BO:251`) from the page's own layout | The book's layout; the left column (Eliminate, Reduce) brings cost down (§1.3) | BO |
| C-62 | ERRC mapped onto Wardley stages | "Create → Genesis, where advantage lives"; "Eliminate → Commodity" (`StratCmp:170,172`) | Remove both. ERRC works on buyer-facing value factors; Wardley maps supply-side components. Keep the two sound connections: Porter's substitutes inform Blue Ocean's noncustomers; Playing to Win's capabilities should be the components you choose to build | StratCmp |
| C-63 | Substitute or competitor | Spotify as a substitute (`Porter:354`) vs YouTube tutorials and teachers as substitutes (`:271`, quiz Q2) | Substitutes: free video tutorials, private teachers, books. A streaming service serves a different job and is neither. Rewrite the pitfall to use it as the example of a false competitor | Porter |
| C-64 | Porter quiz Q6 | "Which framework uses Porter as input?" with the answer embedded, while PTW also takes Porter as input (`Porter:425`, `:337`) | Ask a question with one defensible answer, or accept both | Porter |
| C-65 | Analogy row | "Weather report / Treasure map / Battle plan / Terrain" (`StratCmp:86`) vs each page's own image | Delete the row | StratCmp |

### 3.5 Execution

| ID | Topic | Found | Canonical value | Change |
|---|---|---|---|---|
| C-66 | Shape Up scope | "Fixed time AND fixed scope… the variable is quality" (`ShapeUp:119`, quiz Q6 `:292`); "Fixed (shaped pitch)" (`ExecCmp:80`) | Fixed time, variable scope (§1.5). Table cell: "Variable: scope is hammered to fit the six weeks". Quiz Q6's key and explanation change | ShapeUp, ExecCmp, Scrum (Scrum vs Shape Up line `:293`) |
| C-67 | Shape Up team size | 1–3 (`ShapeUp:148`; `ExecCmp:78`) vs 2–6 (`ShapeUp:233`) | One designer and one or two programmers per project. A "skip it when" line for large organizations talks about shaping capacity, not team size | ShapeUp, ExecCmp |
| C-68 | Shape Up batch sizes and shaping time | "Small batch: 2 weeks" (`ShapeUp:133`); "Shape (2–4 weeks)" (`:129`) | Small batch 1–2 weeks; shaping has no fixed duration and runs in parallel with the cycle | ShapeUp |
| C-69 | Scrum team size | "3-9 people" (`Scrum:140,276`; `ExecCmp:78`) | "Typically 10 or fewer people, including the Product Owner and Scrum Master" | Scrum, ExecCmp |
| C-70 | Scrum events | "5 Ceremonies" including refinement and omitting the Sprint (`Scrum:146–167`) | Five events: the Sprint, Sprint Planning, Daily Scrum, Sprint Review, Sprint Retrospective; refinement is an ongoing activity (§1.5). Render as a table: event, purpose, timebox | Scrum, ExecCmp |
| C-71 | Can scope change mid-sprint? | "No new items added" (`Scrum:185`) vs quiz Q5 "something of equal size must come out" (`:336`) | No changes that endanger the Sprint Goal; scope may be clarified and renegotiated with the Product Owner. The quiz's correct option says this | Scrum |
| C-72 | Story-point arithmetic | "5 is twice 3" (`Scrum:208`); a "4 pts" item (`:238`); "26/28 completed" with a half-done item (`:243`) | Fibonacci values only; "an 8 is roughly twice a 5"; only Done items count. Case sprint (§5.6): 28 planned, 20 Done | Scrum |
| C-73 | Sprint numbers and points across pages | Sprint 14 = 28 points (`Scrum:231`) vs Sprint 5 = 21 points (`ExecCmp:137`) | Case: Sprint 14, 28 points planned, 20 Done; average velocity 27. ExecCmp quotes Sprint 14 | Scrum, ExecCmp |
| C-74 | How long Practice Mode takes | Built in one sprint (`DualTrack:96`) vs a six-week bet (`ShapeUp:185–207`; `ExecSum`; `Narrative:146`) | Case: Practice Mode is a six-week bet for the Practice team (one designer, two programmers). DualTrack's example no longer builds it; it uses the Onboarding team's work (§5.6) | DualTrack, ExecCmp |
| C-75 | Is discovery ahead of delivery? | "1–2 sprints ahead", "validated backlog", "Discovery Sprint 13–14 → Delivery Sprint 15" (`DualTrack:29,38,70,98`, quiz Q3) | Two continuous, parallel tracks in one team, every week; no fixed lag or handoff (§1.5). The swimlane figure shows both tracks in every sprint, with ideas crossing over when ready | DualTrack, ExecCmp, DT |
| C-76 | Discovery timebox | "1–3 days max" vs "hours to days" (`DualTrack:85`) | Hours to days per experiment | DualTrack |
| C-77 | Who does discovery | "PM + designer (+ sometimes 1 engineer)" (`DualTrack:67`) | The product trio: PM, designer and tech lead; other engineers join as needed | DualTrack, ExecCmp (`PM + designer + devs` cell) |
| C-78 | The 0.7 rule | "70% achievement = success" in the summary (`OKRs:68`); "0.7" (`:135`) vs "0.6–0.7" (`:183`, quiz `:297`) | Aspirational OKRs: expected average about 0.7. Committed: 1.0. The summary says both | OKRs, ExecCmp |
| C-79 | How many objectives and KRs | Objectives 3–5 (`OKRs:97,126`) vs "2-3 company objectives" (`ExecCmp:179`); KRs 2–5 (`OKRs:134`) vs builder 2–4 (`:284`) | No more than 3–5 objectives, each with 2–5 KRs, everywhere including the builder and the picker | OKRs, ExecCmp |
| C-80 | "Quick win" lesson KR | 5 lessons in the cascade (`OKRs:177`), 8 in the example and quiz (`:198,299`) | Case: 8, a committed output KR, labeled as a deliberate exception | OKRs |
| C-81 | Output KRs vs "outcomes, not outputs" | Rule (`OKRs:133,141`) broken by KRs that are deliverables (`:177,198,206`) | Keep the rule; allow committed output KRs only when labeled as the exception; the aspirational KRs are outcomes (case, §5.5) | OKRs |
| C-82 | "KR3 is an input metric (lessons published)" | `OKRs:211` vs IO's definition | "KR3 is an output the content team promises; the input metric it moves is quality-reviewed beginner lessons available" | OKRs |
| C-83 | Do the execution frameworks compete? | "These aren't competing frameworks, they operate at different levels" (`ExecCmp:59`) vs the picker choosing between Scrum and Shape Up | OKRs set goals; Scrum and Shape Up are alternative delivery methods (a team usually picks one); dual-track agile adds continuous discovery to either | ExecCmp |
| C-84 | Picker inputs and wording | Team size ignored in three of four branches; Shape Up suggested regardless of size; "no mid-sprint interruptions" for Shape Up (`ExecCmp:173–184`) | Every question affects the result or is removed. Shape Up results say "cycle". No result recommends Shape Up for a single team of 10 or more without shaping capacity | ExecCmp |
| C-85 | Kanban recommended but missing | `Scrum:284`; `ShapeUp:241`; `DualTrack:68,124` | Owner decision. Until a Kanban guide exists, write "a flow-based method such as Kanban (not covered in this guide)" without a link, at most once per page | Scrum, ShapeUp, DualTrack, ExecCmp |

### 3.6 Communication

| ID | Topic | Found | Canonical value | Change |
|---|---|---|---|---|
| C-86 | Week-one churn vs D7 | "70% drop-off in the first week" (`STAR:111`), "70% churn in week 1" (`Pyramid:139`) beside "D7 retention 12%" (`STAR:138`; `Pyramid:155`) | Case, at the time of the bridge-lessons story: only 12% of new users were active on day 7 (88% gone within the week). Drop the 70% figure from both | STAR, Pyramid, Narrative |
| C-87 | The STAR answer misses its own target | Target "at least 10 points" (`STAR:120`), result 12% → 21% (`:138`) | Case: target D7 of at least 18% (6 points) within the quarter; result 12% → 19%, a 7-point rise (58% relative) | STAR |
| C-88 | Numbers reused across products | Skoove's bridge-lesson figures reappear as Trala's Practice Mode data (`ExecSum:162` vs `Pyramid:164`, `Narrative:102`) | Case: bridge lessons (last year) and Practice Mode (this quarter) have separate data (§5.7) | ExecSum, Narrative, Pyramid |
| C-89 | Which framework for a presentation | STAR → Pyramid (`STAR:231,285`); Narrative → Arc for a skeptical CPO (`Narrative:236`); CommsCmp → Arc unconditionally (`:118,180`) and Pyramid when the audience agrees (`:204`) | One rule: a presentation that must persuade (skeptical audience, status quo to overcome) → Narrative Arc; a presentation or readout where the audience wants the answer → Pyramid. STAR's skip line becomes "Stakeholder updates (use Pyramid); persuasive presentations (use Narrative Arc)" | STAR, Narrative, Pyramid, ExecSum, CommsCmp |
| C-90 | Which framework for a case interview | "structured problem-solving" (`STAR:229`); Pyramid (`Pyramid:198`; `CommsCmp:144`); Arc for a "PM interview case presentation" (`Narrative:130`) | Case interview answer → Pyramid (answer first, grouped reasons). Product design question → CIRCLES. Behavioral question → STAR. A take-home case presented as a deck may use the arc; say so only in Narrative, with that condition | STAR, Narrative, CommsCmp |
| C-91 | Tie-break when unsure | "So what?" test (`Narrative:80`) vs "Default to Pyramid" (`CommsCmp:182`) | Default to Pyramid. Use the arc only if the audience must be persuaded before it will accept the answer; the "So what?" test is how you check | Narrative, CommsCmp |
| C-92 | SCQA vs recommendation first | Pyramid teaches SCQA before the answer (`Pyramid:137–145`); ExecSum puts the recommendation first and says "use SCQA" for Context (`ExecSum:99,145`); CommsCmp says "Pyramid structure for Context and Key Data" (`:145`) | Pyramid: SCQA is the introduction to the answer (§1.6). ExecSum: the recommendation comes first; Context is a compressed Situation and Complication. CommsCmp's combination card says the same | ExecSum, CommsCmp, Pyramid |
| C-93 | "Narrative Arc is an oral Pyramid with tension" | `Narrative:196` vs the rest of the page | Delete; the arc is the opposite order (§1.6) | Narrative |
| C-94 | STAR mappings to other frameworks | "Task = Disruption" (`Narrative:195,235`); "A = Options + Recommendation" (`ExecSum:212`) | Narrative: the approximate mapping in §1.6. ExecSum: drop the STAR mapping | Narrative, ExecSum |
| C-95 | "The four differ by channel" | `CommsCmp:65`, though STAR and the arc are both spoken | "They differ by situation: interviews, quick updates, persuasive presentations and decision documents" | CommsCmp |
| C-96 | Three storylines on the Pyramid page | Hero "mobile onboarding" with unsourced stats (`Pyramid:90–95`), SCQA "ad spend" (`:139–142`), example "bridge lessons" (`:151–166`) | Case: one storyline, bridge lessons, used in the contrast, the SCQA block and the example (§5.9) | Pyramid |
| C-97 | How much revenue Practice Mode recovers | "€84K/month recovered" (`ExecSum:160`) vs the arc's definition of €84K as the whole monthly silent churn (`Narrative:145`) | Case: about 4,200 subscribers ($37,800 of MRR) cancel each month; each point of monthly churn is about 600 subscribers ($5,400 of MRR). Practice Mode claims only the share it can plausibly move, with the A/B test as proof | ExecSum, Narrative |

### 3.7 Cross-cutting

| ID | Topic | Found | Canonical value | Change |
|---|---|---|---|---|
| C-98 | Relationships between frameworks | "Connections" prose in 19 files, written differently on each side of a pair (for example Loops and AARRR, `:315`, `:277`; BO, PTW and Wardley flows) | Relations become data in `frameworks.js` (`relations: [{slug, sentence}]`), written once per pair from the canonical statements in this document; the guides no longer contain Connections blocks | All 24 framework guides, `frameworks.js` |

**Total: 98 contradictions resolved** (C-01 to C-98). C-85 still needs an owner decision about a Kanban guide.

### 3.8 `frameworks.js` values to correct

The consistency pass should propose these edits to `src/data/frameworks.js` (chrome data, not guide files):

| Slug | Field | Current | Canonical |
|---|---|---|---|
| value-effort | question | "Which ideas are quick wins and which are money pits?" | "Which ideas are quick wins and which should we avoid?" (matches the quadrant names) |
| dual-track | origin | "Jeff Patton and Marty Cagan" | "Desirée Sy, 2007; popularized by Jeff Patton and Marty Cagan" |
| growth-loops | origin | "Reforge (Brian Balfour, Casey Winters and Kevin Kwok)" | "Reforge: Brian Balfour, Casey Winters, Kevin Kwok and Andrew Chen, 2018" |
| narrative-arc | origin | "Freytag's dramatic structure, adapted for product work" | "Gustav Freytag's dramatic structure and Nancy Duarte's Resonate, adapted for product work" |
| star | origin | "Standard practice in behavioral interviewing" | "Commonly credited to Development Dimensions International (DDI)" |
| north-star | origin | "Amplitude's North Star Playbook" | keep; the guide credits Sean Ellis for the term in prose |
| input-output | origin | "Amazon's controllable input metrics" | "Amazon's controllable input metrics, as described in Working Backwards (2021)" |
| shape-up | origin | "Ryan Singer, Basecamp, 2019" | keep (the company is now 37signals; say so in prose if needed) |
| rice | origin | "Sean McBride at Intercom, 2016" | keep after checking the year against the Intercom post |
| design-thinking | description | "human-centred" | "human-centered" (American spelling; also "Analyse" → "Analyze" in porters-5-forces, "organise" → "organize" in the execution category, "popularised" → "popularized" in okrs, "behavioural" → "behavioral" in star) |

---

## 4. Claims to remove or soften

Every fabricated, unverifiable, dated or unsourced statement found, with its replacement. "Remove" means delete the sentence and anything that depends on it (including quiz questions). Claims about Skoove, Trala or Learnfield are replaced by the case file and are listed in §5.9 rather than here, unless the claim is about a real third party.

### 4.1 Fabricated or unverifiable evidence (P0-4)

| File | Claim | Action and replacement |
|---|---|---|
| `Pyramid:166` | "Simply Piano launched 'review sessions' in Q1 and reported 15% retention improvement in their earnings call." | Remove. Simply (JoyTunes) is private and holds no earnings calls. Replace Reason 3 with internal evidence from the case: "A two-week pilot with 2,000 new learners raised completion of lessons 3–5 by 25%." |
| `ExecSum:85` | Bezos: "If the summary is good, the details will follow." | Remove the quote and the claim that six-pagers "begin with the executive summary." Optional replacement, unquoted: "Amazon replaced slide decks in senior meetings with six-page narrative memos that everyone reads at the start of the meeting (Bryar and Carr, *Working Backwards*, 2021)." |
| `USM:241` | Patton: "A backlog is like a grocery list. A story map is like a recipe." | Remove the quotation marks and the attribution. Paraphrase: "Patton's point is that a flat backlog loses the story of what the user is doing; a map keeps it." |
| `StratCmp:163` | "That sentence alone puts you ahead of 90% of PM candidates." | Remove. |
| `PrioCmp:291` | "This flowchart handles 80% of situations. The other 20%? Use the scenario matcher…" | Remove. If a pointer is needed: "For other situations, try the picker below." |
| `DualTrack:84` | "A quick prototype tested with 5 users gives 80% of insight at 5% of the cost." | Remove. If the point is needed: "A rough prototype tested with a handful of users often shows whether an idea works before any engineering starts." Cite Nielsen only for usability problems (§1.2). |
| `DualTrack:86` | "The 80% Rule" (invented name) | Remove the name; keep any advice under a descriptive title. |
| `DualTrack:147` | "Without discovery, ~50-80% of features fail to move metrics. A $500 prototype test is cheaper than $50,000 of engineering." | Remove the figures. Replace: "Many ideas do not move the metric they were meant to move, so testing an idea cheaply before building it saves engineering time." (Kohavi and colleagues report low success rates for online experiments; cite *Trustworthy Online Controlled Experiments*, 2020, only if a figure from it is quoted exactly.) |
| `PTW:215`, quiz Q6 `:518` | "The Lafley Test" | Remove the name; keep the check unnamed: "A useful check: if a competitor could adopt your strategy statement unchanged, it is not specific enough." Quiz Q6 asks about the check without the name. |
| `ExecSum:72` | "Executives have 50+ decisions per week." | Remove. Replace: "Leaders read many documents; a summary that leads with the decision respects that." |
| `ShapeUp:191` | "70% of users who finish a lesson never revisit it" (stated as fact) | Keep only as Larkwell data inside the labeled worked example (§5). |
| `Narrative:90,143` | "We're the #2 piano learning app"; "the top-rated violin app on iOS" | Remove (case: "reviews praise the real-time feedback"). |
| `Narrative:145`; `ExecSum:161` | "D30 retention is 8%, half the industry benchmark"; "music ed benchmark (16%)" | Remove the benchmark. Case: "D30 retention is 9%; we aim for 11%." |
| `Pyramid:155` | "well below the 20% benchmark for music ed apps" | Remove the benchmark; use the internal target. |
| `Pyramid:95` | "60% of our users are mobile-only, mobile converts 2x higher than web, and all three competitors launched it this quarter" | Replace with the case storyline (C-96). |
| `AARRR:216` | "Music learning apps have ~70% churn in first month." | Remove. Case: Larkwell's D30 retention of 9%. |
| `AARRR:220` | "$9.99/mo or $59.99/yr"; "Free trial to paid ~3-5%" (as a real company's figures) | Replace with case prices and rates (§5.3). |
| `AARRR:224` | "Invite a friend, get 1 month free" (as a real company's program) | Case: Larkwell's "Give a friend 30 days free". |
| `Loops:243,263` | Skoove's prices; "Skoove is running the weakest loop (paid) as its primary growth engine" | Case (§5.4). |
| `DesignCmp:551` | "Skoove has 200 features" | Case: "Larkwell's app has grown to dozens of features." |
| `StratCmp:125`; `GrowthCmp:111` | "churn is 70%" | Remove the figure: "Every piano app looks the same and subscribers cancel after their first month." |
| `GrowthCmp:127,66` | "60% of signups never complete a lesson." | Case: "55% of new accounts never complete a first lesson; of those who do, four in five are gone within a month." |

### 4.2 Factual errors stated as fact

| File | Claim | Replacement |
|---|---|---|
| `Porter:279,364` | "Platform stores (Apple/Google) take 30%" | "App stores take a commission of 15–30%, depending on the program and, for subscriptions, how long the subscriber has stayed. The rules are changing in several countries." |
| `Porter:181` | "Strategy is NOT about being the best. It's about being different" (no source) | "Porter makes a related point elsewhere: strategy means choosing to be different ('What Is Strategy?', 1996). The Five Forces' own point is that industry structure sets average profitability." |
| `Porter:339` | "Wardley adds evolution (how forces change over time)" | "Wardley Mapping adds how the components of your value chain evolve." |
| `Porter:271` | "private teachers ($40-80/hr)" | "private teachers, who cost far more per hour than an app" |
| `BO:202`, canvas `:167–198` | Yellow Tail eliminated aging, vineyard prestige and complexity; canvas price below budget wines; marketing high; one "Selection" factor | The book's ERRC grid and canvas (§1.3). |
| `BO:286,308` | "Social/community features nobody uses"; "Create: AI-powered teacher" (not new) | Case ERRC (§5.8). |
| `PTW:70` | "By A.G. Lafley & Roger Martin (P&G)" | "By A.G. Lafley, former CEO of Procter & Gamble, and Roger Martin, former dean of the Rotman School of Management (2013)." |
| `PTW:273` | Peloton as a differentiation example (dated) | Use the book's own case: Olay's repositioning as a premium "masstige" skin-care brand sold in mass retail. |
| `PTW:151` | "These are the 3-5 things you must invest in heavily" | "The few capabilities that make your where-to-play and how-to-win choices work." |
| `Wardley:141,219` | "This movement is predictable." | "The direction of this movement is predictable; its timing is not." |
| `Wardley:276` | "Cloud (commodity) enabled SaaS (product) which enabled AI apps (genesis)." | "Utility compute let a wave of new online services be built without owning servers: a commodity enabling new, higher-order systems." |
| `Wardley:329` | "In 2-3 years, off-the-shelf AI music APIs will exist." | "Note-detection libraries are already available off the shelf (for example Spotify's open-source Basic Pitch, 2022), so this component is moving toward Product." (§5.8) |
| `Wardley:152` | Memory trick: "Google Maps… Y-axis = how close to the user (like zoom level)" | Remove; it muddles the axis. |
| `Wardley` quiz Q4 `:534` | "Top-left… is where advantage lives" | Remove the question or ask about the build/buy implication of a stage. |
| `AARRR:68` | "By Dave McClure (500 Startups)" | "Dave McClure, 2007." |
| `AARRR:193`, quiz `:328` | LTV:CAC 1–3 = "sustainable but thin margins" / "survivable but tight" | "Below about 3:1, acquisition spending is hard to pay back; 3:1 or better is a widely cited rule of thumb." |
| `AARRR:329` | "If 90% churn in week 1… every dollar goes 10x further" | Rewrite with the case funnel: "If only 9% of new accounts are active on day 30, most acquisition spend buys users who leave; raising retention makes every acquisition dollar return more." |
| `Loops:229`, quiz Q4 `:368` | "Loop strength = Amplitude × Conversion ÷ Cycle Time" as a canonical formula | Label it the guide's heuristic, or replace with K-factor and cycle time (§1.4). Quiz Q4 tests the heuristic only if labeled. |
| `Loops:179,222` | "Paid loops are the most common but the weakest"; "zero defensibility"; "Viral loops are the most powerful" | "Paid loops stop when spending stops and depend on LTV exceeding CAC. Viral loops cost little per user, but sustained K above 1 is rare." |
| `Loops:173` | "Only compounds if LTV grows faster than CAC" | "A paid loop compounds only if LTV exceeds CAC and the payback period is short enough to reinvest." |
| `Loops:121` | "double the input, double the output (at best)" | "A funnel converts what you put in; it does not feed itself." |
| `NS:117,357` | "cutting costs" raises revenue | "raising prices or cutting costs can lift revenue or profit without delivering more value." |
| `NS:164` | "Slack: Messages sent in teams of 2+" | "Slack: messages sent (commonly cited)." All rows get a `table-note`: "Commonly cited examples; not official statements." |
| `IO:110` | "We shipped 5 new lessons" as an input | §1.4: an input metric, not an activity. |
| `IO:358,360` | "Every input needs a counter-metric"; "Counter-metrics are what separate junior PMs from senior ones." | "Pair any input that can be gamed with a counter-metric." Remove the second. |
| `Scrum:104,136,140,146–167,158,162,185,154` | 2017-era Scrum: roles, Development Team, 3–9, ceremonies, refinement as an event, three questions, review as demo-and-accept, rigid scope, "~2h for a 2-week sprint", "servant-leader" | §1.5 (2020 Scrum Guide). Sprint Planning: "up to 8 hours for a one-month Sprint, usually shorter for a two-week one." |
| `Scrum:132` | PO "writes user stories. This is you (or your future role)." | "The Product Owner is accountable for the Product Backlog, and often writes or delegates its items. Many product managers hold this accountability." |
| `ShapeUp:63` | "Basecamp's alternative to Scrum" | "A way of working developed at Basecamp (now 37signals) and published in 2019." |
| `ShapeUp:129,133,148,233` | "Shape (2-4 weeks, senior people)"; small batch 2 weeks; team sizes | §1.5. |
| `ShapeUp:173` | Cooldown "prevents burnout" | "Cooldown gives the team unscheduled time for bugs and small ideas, and gives leadership time to decide the next bets." |
| `ShapeUp:113` | "Estimation theater"; "Story points are debated endlessly but rarely accurate" | "Shape Up replaces estimates with an appetite: instead of asking how long it will take, it asks how much time the problem is worth." |
| `DualTrack:28` | Origin without Desirée Sy | §1.5. |
| `DualTrack:59,98` | Kitchen metaphor (prep vs plating vs cooking); "overlap like train tracks" | Remove both. If an image is wanted: "two tracks run side by side, all the time, in the same team." |
| `DualTrack:38,56,57,98` | "No wasted engineering." "No wasted effort." "Months wasted." "Engineers never wait. PMs never stop learning." | "Less engineering time goes into ideas that do not work." Remove the rest. |
| `OKRs:183` | "Committed OKRs (also called 'rooftop' OKRs)" | §1.5. |
| `OKRs:63,98` | "Used by Google, Intel, Spotify"; "Used by most top tech companies" | "Developed by Andy Grove at Intel and adopted by Google in 1999, where John Doerr introduced them." Drop Spotify and "most top tech companies." |
| `OKRs:77,298` | "4.7App Store rating"; "sandbar" | "App Store rating from 4.5 to 4.7"; "sandbag". |
| `OKRs:112` | Memory trick: mile markers as KRs (time-boxed milestones) | Remove; it teaches output KRs. |
| `DT:151` | "a 5-phase process from Stanford's d.school" | "the Stanford d.school's five-mode model" (§1.2). |
| `DT:213–214`, quiz Q5 `:468–474`, Q1 distractor `:436` | Double Diamond as part of the d.school model | §1.2; the quiz tests the Design Council attribution or drops the item; Q1 gets a plausible distractor. |
| `DT:268` | "5 users finds 85% of issues" | "Testing with about five users finds most usability problems in a round of testing (Nielsen and Landauer)." |
| `DT:366,367`; quiz Q7 `:489,492` | "Empathize IS JTBD research"; "CIRCLES is a compressed… version" | §1.2. Replace Q7. |
| `JTBD:525` | Quiz: "a laser pointer that made perfect holes" | "If something else made the hole more easily, people would switch to it." |
| `JTBD:429` | "Confusing the job with the job executor" | "Defining the job by who the customer is" (§1.2). |
| `JTBD:411` | "Kano operates within a JTBD context." | "Kano can classify the features that serve a job." |
| `DesignCmp:313` | "Don't sell drills, sell holes" | "People don't want a quarter-inch drill, they want a quarter-inch hole," credited to Theodore Levitt. |
| `DesignCmp:314` | "Fall in love with the problem" as a design-thinking slogan | Credit Uri Levine, whose book takes that title, or remove. |
| `DesignCmp:464` | "Spotify's discover weekly" | "Spotify's Discover Weekly". |
| `DesignCmp:288–291` | Inventor row: "Stanford d.school" for design thinking | "IDEO and the Stanford d.school (five-mode model)"; JTBD: "Clayton Christensen, Tony Ulwick; Bob Moesta for switch interviews". Better: rename the row "Origin" and take values from `frameworks.js`. |
| `Kano:356` | "smartphone GPS was a Delighter in 2008, Performance by 2012, Must-Have by 2015" | "Features such as built-in GPS moved from delighter to expected within a few years." |
| `Kano:285–286` | Code refactor as an Indifferent example, "pure waste" | Remove (the rewrite already says to survey only what customers meet). |
| `ICE:456`, quiz `#q5e` `:542` | "125 vs 343" shows scores barely differ | §1.1 (near-ties hide real differences). |
| `ICE:325–337` | Comparison table: "2 min/feature", "Varies widely" | Remove the cells or replace with "minutes per idea" (no figure) and a real value. |
| `ICE:206`; `PrioCmp:201` | "The fastest scoring framework"; "The fastest." | "One of the fastest ways to score." |
| `PrioCmp:480` | "RICE Score (lite)" | Remove. |
| `RICE:380,391` | "#1 / #2 RICE mistake" | "A common mistake." |
| `VE:357,377` | "AI recommendations", "Blockchain loyalty… a buzzword trap" | Timeless examples (the rewrite uses "Voice shopping assistant"; keep it). |
| `VE:452` | "aim for roughly equal items per quadrant" | "Calibrate: agree on one anchor item for value 1, 3 and 5 and for effort 1, 3 and 5, and score against them." |
| `CIRCLES:177` | "The PM interview gold standard." | "A widely taught structure for product design interviews." |
| `CIRCLES:317` | "This is the largest group with the most room for improvement." | Phrase as the candidate's stated assumption (the rewrite already does). |
| `CIRCLES:412` | "Most people fail at steps 1–2, not 5–7" | "Candidates often rush the first two steps; that is where answers go wrong." |
| `CIRCLES:446` | "That's a great point —" (canned flattery in the script) | Remove from the script. |
| `JTBD:207,216,427,445,570` | "it's never who you think"; "Most PMs only think about functional jobs."; "10x more useful"; "The most powerful JTBD technique."; "8–12 is the sweet spot." | "often not who you think"; remove; "far more useful"; "a core JTBD research technique"; "8–12 interviews is a common guideline." |
| `USM:215,685,693` | "it replaced flat backlogs"; "The most common mistake."; "The conversation IS the deliverable." | "an alternative to the flat backlog"; "A common mistake."; "The shared understanding matters more than the map itself." |
| `DT:243,271,447,483` | "the hardest and most important step"; "the shortest but hardest"; "the single most important output"; "the most expensive assumption in product development" | "a step teams often rush"; "short, and often hard"; "the main output of Define"; "an expensive assumption". |
| `STAR:47` | "The gold standard for behavioral interview answers" | "A common structure for behavioral interview answers." (A superlative such as "the most widely used" would also need a source.) |
| `Narrative:98` | "we burn €500K/month… CAC exceeds LTV by Q4" | Case (§5.9). |
| `Narrative:147` | "a competitive moat that's very hard to copy"; "the only violin app with a real practice experience" | Remove both. |
| `ExecSum:160` | "€84K/month recovered" | C-97 and §5.9. |
| `Porter:402` | Quiz: "Which force do PMs most commonly overlook?" | Ask which force a given example belongs to. |
| `Wardley` quiz Q5 `:535`; `PTW`; `Porter`; others | "What's the #1 mistake…" questions that test an opinion | Ask about a scenario instead. |
| `Scrum:216`, `:335`, `:166` | "destroys trust"; "destroys psychological safety"; "The continuous improvement engine" | "Using velocity to judge people leads teams to inflate estimates"; remove the other two. |

### 4.3 Dated claims (P3)

| File | Claim | Replacement |
|---|---|---|
| `Porter:359` | "AI is lowering entry barriers in music ed RIGHT NOW. Your 2024 analysis may be wrong by 2026." | "Entry barriers can change quickly, for example when new tools make an app cheaper to build. Revisit the analysis when they do." |
| `Porter:279,364` | 30% app store cut | §4.2. |
| `PTW:273` | Peloton | §4.2. |
| `OKRs:63` | Spotify as an OKR user | §4.2. |
| `OKRs:191` | "Q2 2026" | "this quarter" (§5.5). |
| `Wardley:329` | "AI music APIs in 2–3 years" | §4.2. |
| `VE:357,377` | AI recommendations, blockchain loyalty | §4.2. |
| `BO:308` | "AI-powered teacher" as a new Create factor | §5.8. |
| `Kano:356` | GPS years | §4.2. |

### 4.4 Unsourced statistics and benchmarks to label or cut

| File | Statistic | Action |
|---|---|---|
| `AARRR:180–184` (metrics table) | "D1: 25-40%, D30: 8-15%", "$1-$5 mobile", "30-60% complete onboarding" | Replace the Benchmark column with "Larkwell (illustrative)" values from §5.3, plus a `table-note`. No industry benchmarks without a named source and year. |
| `AARRR:208` | "~$3-5 CPI" | Case: CPI $2.50. |
| `NS:159–168` | Famous NSM table | `table-note`: "Commonly cited examples; not official company statements." |
| `Narrative:89–105` | Beat weights 10/15/25/30/20% | Label "a rule of thumb". |
| `STAR:105–132` | Weights 15/10/50/25% | Label "a rule of thumb". |
| `CIRCLES`, `DT`, `USM` agendas | Durations | Fine as recommendations; the app computes totals. |
| `StratCmp:64–67`; `GrowthCmp:61–64`; `DesignCmp` time bars | Time estimates per framework | Label "typical time" and keep consistent with each guide; the Design time bars become an ordinal `scale` or are cut. |
| `JTBD:506,570`; `DesignCmp` | Interview counts | C-33. |
| `DualTrack:95` | "Interviewed 8 users. 6/8…" | Fine inside the labeled case example (§5.7). |
| `Scrum:216` | "After 3-5 sprints, you have a reliable average" | "After a few Sprints, the average becomes useful for planning." |
| `USM:745,753` | "Aim for 8–15 backbone steps", "3–7 activities" | Label as rules of thumb (§1.2). |
| `DT:402` | "More than 8 = chaos. Fewer than 4 = echo chamber." | "Four to eight people keeps the group varied and manageable." |
| `JTBD:426` | "would this job statement make sense 50 years ago?" | Keep as a test, renamed "job story", with "decades ago". |

### 4.5 Quotations

No guide may contain a direct quotation unless it carries a `<cite>` to a source a reader can check. The only quotations found were the Bezos and Patton lines above (both removed) and the Levitt drill line, which is widely attributed and may stay as "usually credited to Theodore Levitt". Slogans set in quotation marks ("Data tells, stories sell", `Narrative:64`; "Ship small, learn fast, adapt continuously", `Scrum:63`) are not quotations; remove them as copy slop.

---

## 5. The case file: Larkwell

### 5.1 The company

**Larkwell** is a fictional subscription app that teaches adults to play the piano. It listens through the phone's microphone or a MIDI keyboard and gives real-time feedback on each note. It runs on iOS and Android and sells in English-speaking markets.

- **Why this name.** Short, neutral and music-adjacent (a lark is a songbird). A web search found no music app, music-education company or well-known brand called Larkwell. Similar-sounding products exist (Lark Player, LarkSound), so always write "Larkwell" in full, never "Lark".
- **How guides introduce it.** The first sentence of each worked example that uses it says "Larkwell, a fictional piano-learning app" (or the `table-note` says "Larkwell is a fictional company; all figures are illustrative"). After that, just "Larkwell".
- **What it replaces.** Skoove, Trala, Learnfield, "Susana's team", "your team", "this is you", and unsourced figures about real music apps.
- **Voice.** Larkwell is described in the third person ("Larkwell's onboarding team"). The only first-person text is a quoted sample answer or a quoted pitch, attributed to "a product manager at Larkwell".
- **Time.** Examples happen "this quarter" or "last year". No calendar years, no "Q2 2026". Where a quarter label helps (an OKR set), use "Q3" without a year.

### 5.2 Fact sheet

All figures are illustrative and internally consistent. Use them as given; derive anything else from them with the formulas in §5.3.

**Scale**

| Metric | Value |
|---|---|
| Registered accounts (lifetime) | 2,000,000 |
| Monthly active users (MAU: opened a lesson in the last 30 days) | 400,000 |
| Weekly active users (WAU) | 160,000 |
| **North Star: Weekly Active Learners** (completed at least 3 lessons in a calendar week) | **40,000** |
| Paying subscribers | 60,000 (15% of MAU) |
| Lesson library | 320 lessons, of which 120 are quality-reviewed beginner lessons |

**Each month's new users**

| Step | Value | Rate |
|---|---|---|
| Installs | 100,000 | 60,000 paid, 30,000 organic app store search, 10,000 from referrals and shared clips |
| New accounts | 80,000 | 80% of installs |
| Activated (completed a first song lesson within 24 hours of sign-up) | 36,000 | 45% of new accounts (about 8,300 a week) |
| Trial starts (7-day free trial) | 20,000 | 25% of new accounts |
| New paying subscribers | 6,000 | 30% trial-to-paid; 7.5% of new accounts |

**Retention of new accounts (this quarter)**

| D1 | D7 | D30 |
|---|---|---|
| 40% | 19% | 9% |

Of activated learners, about 42% are active on day 7 and 20% on day 30, so four in five activated learners are gone within a month, most of them in the first week.

**Prices and revenue**

| Item | Value |
|---|---|
| Monthly plan | $14.99 |
| Annual plan | $89.99 ($7.50 a month) |
| Plan mix | 20% monthly, 80% annual |
| ARPPU | $9.00 a month (gross, before store fees) |
| MRR | $540,000 (ARR about $6.5 million) |
| ARPU (per MAU) | $1.35 a month |
| Subscriber churn | 7% a month: about 4,200 cancellations, $37,800 of MRR lost each month |
| Net subscriber growth | +1,800 a month (6,000 new − 4,200 cancelled) |
| One point of monthly churn | about 600 subscribers, $5,400 of MRR a month |
| Gross margin | 75% (after app store fees, music licensing and hosting) |

**Acquisition and unit economics**

| Item | Value |
|---|---|
| Paid install spend | $150,000 a month |
| Other marketing (content, brand) | $30,000 a month |
| CPI (paid) | $2.50 |
| CPA (cost per new account from paid channels) | about $3.13 |
| Blended CAC | $30 ($180,000 ÷ 6,000) |
| LTV | about $96 ($9.00 × 75% ÷ 7%) |
| LTV:CAC | about 3.2:1 |
| Payback period | about 4.4 months |
| Referral program | "Give a friend 30 days free" |
| K-factor | 0.10 (0.5 invites per new account × 20% acceptance) |
| Share rate | about 3% of activated learners share a clip of their first song |

**Product and learning**

| Metric | Value |
|---|---|
| Lesson completion rate (lessons started that are finished) | 60% |
| Week-1 lesson completion | 65% |
| Median time to first note (new user) | 4 minutes, before Sprint 14 |
| Onboarding steps | 7 before the redesign; target 3 |
| Learners who finish a lesson but never return to practice it | 70% |
| Practice sessions per active learner per week | 0.4 |
| New learners who play a song they recognize in their first session | 20% |
| Lesson production time | 5 days per lesson |
| Internal lesson quality score | 4.0 out of 5 |

**Team**

| Item | Value |
|---|---|
| Employees | 120 |
| Product and engineering | 45 people in five product teams plus a content team |
| Onboarding team | Scrum; 7 people: product manager (Product Owner), Scrum Master, 5 Developers (3 engineers, 1 product designer, 1 QA engineer). Its discovery trio is the PM, the designer and the tech lead |
| Lessons team | Scrum |
| Practice team | six-week cycles with two-week cooldowns (Shape Up); one designer and two programmers per bet |
| Growth team, Platform team | Scrum |
| Content team | 8 music educators and 2 producers |
| Sprint length | 2 weeks |
| Onboarding team velocity | last three Sprints 26, 28, 27; average 27 points |

### 5.3 Formulas behind the numbers

Guides that compute anything use these exact relations.

- Revenue: MRR = paying subscribers × ARPPU = 60,000 × $9.00 = $540,000. Also MRR = MAU × paid share × ARPPU = 400,000 × 15% × $9.00, and MRR = MAU × ARPU = 400,000 × $1.35.
- ARPPU = 20% × $14.99 + 80% × $7.50 ≈ $9.00.
- Blended CAC = $180,000 ÷ 6,000 new paying subscribers = $30.
- CPA = $150,000 ÷ 48,000 paid new accounts (80% of 60,000 paid installs) ≈ $3.13.
- LTV = $9.00 × 0.75 ÷ 0.07 ≈ $96. LTV:CAC = 96 ÷ 30 ≈ 3.2. Payback = $30 ÷ ($9.00 × 0.75) ≈ 4.4 months.
- K-factor = 0.5 × 0.20 = 0.10, which gives about 8,000 new accounts a month from invites (80,000 × 0.10), consistent with 10,000 referral installs at 80% sign-up.
- Activated per week = 36,000 ÷ 4.33 ≈ 8,300.

### 5.4 Growth model

**Funnel (AARRR, McClure's order)**

| Stage | Larkwell metric | Value |
|---|---|---|
| Acquisition | New accounts a month (CPI on paid installs) | 80,000 ($2.50) |
| Activation | Completes a first song lesson within 24 hours | 45% |
| Retention | D1 / D7 / D30 of new accounts | 40% / 19% / 9% |
| Referral | Installs from referrals and shared clips; K-factor | 10,000 a month; 0.10 |
| Revenue | New accounts that become paying; ARPPU; churn | 7.5%; $9.00; 7% a month |

**The leakiest stage is retention.** 45% of new accounts activate, but only 9% are active on day 30. Activation is the second-largest loss (55% never activate). This is the only "biggest leak" any guide states, and only inside a Larkwell example.

**North Star and inputs**

- North Star: **Weekly Active Learners**, learners who complete at least 3 lessons in a calendar week. Now 40,000; this quarter's aspirational KR is 50,000.
- Why: three or more lessons a week means the learner is getting value and building a habit, and it predicts renewal.
- Input metrics (each owned by one team, all customer-facing and controllable):

| Input metric | Now | Owner | Counter-metric |
|---|---|---|---|
| New activated learners per week | about 8,300 | Growth team | D7 retention of new cohorts |
| Lesson completion rate | 60% | Lessons team | Average lesson rating (1–5) |
| Practice sessions per active learner per week | 0.4 | Practice team | Share of practice sessions abandoned in the first minute |
| Quality-reviewed beginner lessons available | 120 | Content team | Lesson completion rate of new lessons |
| Median time to first note | 4 min (1 min 15 s after Sprint 14) | Onboarding team | Week-1 setup errors reported |

Retention (D7, D30) sits between these inputs and the North Star as an intermediate output. No team owns it as an input.

**Metric stack (for Input and Output Metrics)**

| Layer | Metric | Type | Owner | Counter-metric |
|---|---|---|---|---|
| Business | MRR ($540,000) | Output | CEO | Refund rate |
| North Star | Weekly Active Learners (40,000) | Output, leading indicator of revenue | Head of Product | Average lesson rating |
| Growth | New activated learners per week | Input | Growth team | D7 retention of new cohorts |
| Content | Quality-reviewed beginner lessons available | Input | Content team | Completion rate of new lessons |
| Onboarding | Median time to first note | Input | Onboarding team | Week-1 setup errors reported |
| Lifecycle | Day-3 reminder return rate | Input | Growth team (lifecycle) | Notification opt-out rate |

The "Layer" column names layers only; teams go in the Owner column.

**Growth loops**

| Loop | Type | Steps | Status |
|---|---|---|---|
| Paid | Paid acquisition | Subscription revenue → app store and video ads → installs → some become subscribers → revenue | Active; LTV:CAC about 3.2:1, payback about 4.4 months |
| First-song clip | Viral | Learner plays a first song → app offers to share a 15-second clip → friends see it → some install → they reach their own first song | Potential; about 3% share today |
| Song tutorial pages | Company-generated content | Larkwell's educators publish "How to play [song] on piano" pages → search traffic → installs → learners request songs → more pages | Potential |

### 5.5 OKRs this quarter (Q3)

Each KR is labeled committed or aspirational. The NSM appears as a KR, never as the Objective.

**Company**

- Objective: Make Larkwell the app adult beginners keep playing with.
  - KR1: Weekly Active Learners from 40,000 to 50,000 (aspirational).
  - KR2: D30 retention of new accounts from 9% to 11% (aspirational).
  - KR3: Monthly subscriber churn at or below 7% (committed).

**Onboarding team** (supports company KR1 and KR2)

- Objective: Make a new learner's first week feel like progress.
  - KR1: Activation from 45% to 55% (aspirational).
  - KR2: D7 retention from 19% to 24% (aspirational).
  - KR3: Median time to first note from 4 minutes to under 90 seconds (committed).

**Content team**

- Objective 1: Give every beginner a song they know in their first week.
  - KR1: Week-1 lesson completion from 65% to 80% (aspirational).
  - KR2: New learners who play a song they recognize in their first session, from 20% to 60% (aspirational).
  - KR3: Publish 8 new beginner song lessons (committed). This is a deliberate output KR: the team promises the deliverable, and KR1 and KR2 measure whether it worked.
- Objective 2: Build a content engine that scales.
  - KR1: Production time per lesson from 5 days to 3 (aspirational).
  - KR2: Internal lesson quality score from 4.0 to 4.5 (committed).
  - KR3: Reusable lesson template used for 80% of new lessons (committed output KR).

**How it connects.** Content KR3 is an output; the input metric it moves is "quality-reviewed beginner lessons available" (120 → 128). The Onboarding team's Sprint 14 goal serves its KR3.

### 5.6 Delivery examples

**Sprint 14, Onboarding team (Scrum)**

- Sprint Goal: cut the median time to first note for new users from 4 minutes to under 90 seconds.
- Sprint Backlog, 28 points planned against an average velocity of 27:

| Item | Points |
|---|---|
| Skip instrument setup for the first lesson | 5 |
| Inline microphone and keyboard check (no separate setup screen) | 8 |
| Auto-play demo of the first exercise | 5 |
| "First note" celebration | 2 |
| Analytics: track time to first note | 3 |
| Bug: audio latency on some Android devices | 5 |
| **Total** | **28** |

- Sprint Review: median time to first note fell to 1 minute 15 seconds. Five items met the Definition of Done (20 points). The inline check was not finished; it earns no points, returns to the Product Backlog and is re-estimated for Sprint 15. Velocity for Sprint 14 is 20.
- Retrospective items may be authored freely.

**Practice Mode, Practice team (Shape Up)**

- Problem: 70% of learners who finish a lesson never return to practice it. The "Practice" button only replays the lesson.
- Appetite: six weeks, big batch; one designer and two programmers.
- Solution (fat-marker level): a Practice screen reachable from any finished lesson with a tempo slider (50–150%), tap-to-loop section markers and a mistake heatmap built from existing lesson data.
- Rabbit hole: no new real-time audio analysis for mistakes; use the data lessons already record.
- No-gos: no recording, no sharing, no custom practice playlists.
- Beta (50 learners, before the bet): practice sessions per learner tripled (0.4 to 1.2 a week).
- Target: D30 retention from 9% to 11% (the company KR); an A/B test from day one measures it.

**Play Along, Onboarding team (dual-track: discovery running alongside Sprints 15 and 16)**

- Discovery question: should early lessons let learners play along with a backing track?
- Week 1: 8 interviews; 6 of 8 want to play "with someone". "With someone" means different things: live with a friend, or along with a recording.
- Feasibility spike by the tech lead: live two-person sync, 6 months or more; a backing-track version, 3–4 weeks.
- Week 2: clickable prototype of the backing-track version tested with 5 learners; 4 of 5 completed the flow; the sync button was redesigned.
- Outcome: the backing-track version is added to the Product Backlog for a later Sprint; live sync is dropped.
- Delivery in the same Sprints, by the same team: the redesigned onboarding (7 steps down to 3) and the Sprint 14 carry-over.
- The example shows both tracks in both Sprints. It never says "validated in Sprint 13, built in Sprint 15".

### 5.7 Feature history

| When | Feature | Team | Key facts | Used in |
|---|---|---|---|---|
| Last year | Song-first lesson mix | Content | Song-based lessons had 3× the completion of technique-only lessons, but 70% of new lessons were technique-only; the mix moved to 50/50 with a "technique through songs" format. Lesson completion rose from 52% to 60%; D14 retention rose 3 points | STAR (data story) |
| Last year | Bridge lessons | Lessons | Before: D7 of 12%; 80% of week-one drop-offs happened in lessons 3–5; replay rate of lessons 3–5 was 4× the others. Two-week pilot with 2,000 new learners: completion of lessons 3–5 up 25%. Build: 2 Sprints of engineering, 1 week of content per bridge set. Target D7 of at least 18% within the quarter; result 12% → 19%; "too hard" support tickets down 40% | STAR (main), Pyramid, Narrative (beats) |
| Last year | Publisher renewal | Partnerships | A publisher whose catalog covered 30% of the most-played songs asked for a 40% increase; renewed for two years at 12% with tiered royalties tied to play counts | STAR (stakeholder story) |
| This quarter | Onboarding redesign ("first song in five minutes") | Onboarding | Activation 45% → target 55%; onboarding 7 → 3 steps; Sprint 14 | Scrum, USM, DT, DualTrack, OKRs |
| This quarter | 8 beginner song lessons | Content | Committed KR | OKRs, IO |
| This quarter | Practice Mode | Practice | Six-week bet (§5.6) | ShapeUp, ExecSum, Narrative, ExecCmp |
| This quarter, discovery | Play Along | Onboarding | Dual-track discovery (§5.6) | DualTrack, ExecCmp |
| Proposed | Kids' version | — | No data; a market-entry question | DesignCmp, StratCmp, Porter |

### 5.8 Strategy views of Larkwell

**Porter's Five Forces (market: app-based piano learning for adults)**

| Force | Level | Why |
|---|---|---|
| Rivalry | High | Several established subscription apps offer similar lessons and feedback to the same beginners. Do not name real apps or describe their features |
| Threat of new entrants | Medium–high | Building a basic app is cheap; a deep lesson library and song licensing take years |
| Threat of substitutes | High | Free video tutorials, private teachers, books |
| Buyer power | High | Monthly plans, no switching costs, public reviews |
| Supplier power | Medium | Music publishers control licensed songs; app stores take a 15–30% commission |

**Blue Ocean ERRC (illustrative, in the book's grid layout)**

| Eliminate | Raise |
|---|---|
| The race for the largest song library; "learn any instrument" positioning | Accuracy of real-time feedback; depth of the piano-only learning path; practice habit design |
| **Reduce** | **Create** |
| Badges that do not drive learning; breadth of the catalog; video production cost | Practice plans built from your own mistakes; milestones tied to real songs you can play; Play Along with a backing track |

**Playing to Win cascade**

| Choice | Larkwell |
|---|---|
| Winning aspiration | Help every adult who has wanted to play the piano play the songs they love |
| Where to play | Adult beginners (25–55) in English-speaking markets, on iOS and Android, piano and keyboard only. Not children, advanced players, schools or other instruments |
| How to win | Differentiation on learning outcomes: feedback and practice good enough that learners keep playing. Not the biggest library, not the lowest price |
| Capabilities | Note detection through microphone and MIDI; lesson design by music educators; habit design; song licensing |
| Management systems | Weekly Active Learners and D30 retention as the main metrics; every lesson reviewed by an educator; hiring that favors educators and audio engineers |

**Wardley map components (one list for the hero, the example table and the builder)**

Anchor: an adult beginner who wants to play songs they love.

| Component | Visibility | Evolution | Implication |
|---|---|---|---|
| Lesson experience | High | Custom-built | Differentiate here; build in-house |
| Practice plans | High | Genesis | Explore; small bets such as Practice Mode |
| Real-time note detection | Medium | Custom-built, moving toward Product | Keep investing while it differentiates; watch off-the-shelf libraries (for example Basic Pitch) and be ready to adopt one |
| Lesson library | Medium | Custom-built | Curate for quality, not volume |
| Song licensing | Medium | Product | Standard publisher deals; negotiate, don't invent |
| Gamification | Medium | Product | Use established patterns |
| Cross-platform mobile framework | Low | Product | Adopt; don't build |
| Payments and subscriptions | Low | Commodity | Use app store billing or a payment provider |
| Cloud hosting | Low | Commodity | Use a utility provider |

### 5.9 Which examples switch to Larkwell, and what changes

The new guides keep their structure; the consistency pass swaps the company and the numbers. Files are `public/guides/<File>.html`.

| File | Example | Change |
|---|---|---|
| STAR-Method | Letter cards S/T/A/R (`:111,120,129,138`) | Larkwell bridge-lessons story (§5.7): "I was the product manager for lessons at Larkwell, a piano-learning app with 400,000 monthly active learners. Only 12% of new users were still active a week after signing up." Task: raise D7 to at least 18% within the quarter. Result: 12% → 19%, a 7-point (58%) rise; "too hard" tickets down 40%. Remove the 70% drop-off line |
| STAR-Method | "Real Examples: From YOUR experience at Learnfield" (`:175–191`) | Retitle "Two sample answers from a Larkwell product manager". Data story: song-first mix (§5.7), with "400,000 monthly active learners" instead of "5M+ users". Stakeholder story: the publisher renewal, told by "the partnerships manager at Larkwell"; no Learnfield, Skoove or Trala, no job titles from the author's CV |
| Pyramid-Principle | Bottom-up vs top-down contrast (`:89–95`) | Bridge lessons: "We should add bridge lessons between lessons 3 and 5. Three reasons: that is where 80% of week-one drop-offs happen, learners already replay those lessons 4× as often, and a pilot raised their completion by 25%." Bottom-up version tells the same facts in research order |
| Pyramid-Principle | SCQA block (`:139–142`) | S: "Most new Larkwell learners finish their first two lessons." C: "But 80% of week-one drop-offs happen in lessons 3–5, where difficulty jumps, and only 12% of new users are active on day 7." Q: "How do we smooth the difficulty curve without making the course easier?" A: "Add short bridge lessons between the jumps." |
| Pyramid-Principle | Slack message to the CPO (`:151–166`) | Same storyline; target D7 of at least 18% by the end of the quarter; Reason 3 becomes the internal pilot (§4.1); no benchmark |
| Narrative-Arc | Five-beat illustration (`:90–102`) | Status quo: "Larkwell has 400,000 monthly active learners, and our lesson library has tripled in two years." Disruption: "But D7 retention has not moved: only 12% of new users are active after a week." Struggle: "We spend $150,000 a month on paid installs, and most of those learners are gone within a week." Resolution: bridge lessons; pilot raised completion of lessons 3–5 by 25%; two Sprints to build. New reality: D7 of at least 18% |
| Narrative-Arc | "Trala product pitch to leadership" (`:139–147`) | "Why Larkwell needs Practice Mode." Status quo: 60,000 paying subscribers; reviews praise real-time feedback. Disruption: 70% of learners who finish a lesson never come back to practice it. Struggle: learners stall around week three; about 4,200 subscribers cancel each month ($37,800 of MRR). Resolution: Practice Mode in one six-week cycle; the 50-learner beta tripled practice sessions. New reality: D30 retention from 9% to 11%. Remove "#2", "top-rated", "only app", "moat" |
| Executive-Summary | Section examples (`:95–115`) and the one-pager (`:156–165`) | Practice Mode (§5.6). Recommendation: build the Practice Mode MVP in one six-week cycle to raise D30 retention from 9% to 11%. Context: compressed S+C (C-92). Key data: D30 9%; 70% never practice; beta (n = 50) practice sessions tripled; each point of monthly churn ≈ 600 subscribers ≈ $5,400 of MRR. Options: A, full practice suite (12 weeks, $180,000); B, MVP (6 weeks, $80,000), recommended; C, do nothing (churn stays at 7%, about $37,800 of MRR lost each month). Risks as in the legacy page. Ask: one designer and two engineers for the next cycle; decision needed by Friday. Replace "€84K/month recovered" with "every point of churn we remove keeps about $5,400 of MRR a month; the A/B test will show how much Practice Mode moves" |
| Communication-Comparison-Guide | Scenarios | Keep the generic scenarios (they name no company). If a product is needed, use Larkwell |
| AARRR-Pirate-Metrics | "AARRR for Skoove / Trala" (`:202–230`), aha moment (`:140,327`) | Larkwell funnel (§5.4) in McClure's order; "Where's the leak?" computed from it (retention). Aha moment: "playing a first song with real-time feedback". Metrics table's Benchmark column becomes "Larkwell (illustrative)" |
| Growth-Loops | "Growth loops for Skoove / Trala" (`:236–263`) | Larkwell's three loops (§5.4), correctly typed; the "strategic insight" becomes "Larkwell relies on its paid loop; the first-song clip loop is the largest untested opportunity" |
| North-Star-Framework | "North Star for Skoove / Trala" (`:221–253`); method step 1 (`:192`) | Weekly Active Learners (40,000) with the five inputs and owners (§5.4). Step 1 value event: "For Larkwell, playing a recognizable song." Step 2's weaker draft "songs completed" is labeled as the first draft |
| North-Star-Framework | OKR quiz Q6 (`:361`) | Correct option: "The Objective stays qualitative; WAL from 40,000 to 50,000 is a key result" |
| Input-Output-Metrics | Revenue tree and decomposition (`:205–227`) | MRR = paying subscribers × ARPPU; MAU × paid share × ARPPU (§5.3) |
| Input-Output-Metrics | "Skoove's Metric Stack" (`:234–258`) | Larkwell metric stack (§5.4). "Real-world tension": the content team publishes 8 new lessons and the completion rate of new lessons drops |
| Input-Output-Metrics | Quiz Q5, Q6 (`:372,373`) | OKR mapping per C-04; "8 new lessons" |
| Growth-Comparison-Guide | One-liners (`:66`), operating system (`:127–142`), scenarios (`:111`) | AARRR: "Our biggest leak is retention: 45% activate, but only 9% are active on day 30." North Star: "We rally around Weekly Active Learners (3+ lessons a week)." Input/Output: "The content team grows quality-reviewed beginner lessons from 120 to 128, guarded by the completion rate of new lessons." Loops: "A learner who plays a first song shares a clip that brings in new learners." Scenario "Churn is 70%" becomes "Subscribers cancel after their first month and nobody knows why" |
| Agile-Scrum | "A Trala sprint in action" (`:222–246`) | Sprint 14, Onboarding team (§5.6): 28 planned, 20 Done, no partial credit |
| Shape-Up | "Shape Up for Skoove" (`:185–207`) | Practice Mode pitch (§5.6); team one designer and two programmers |
| Dual-Track-Agile | "Dual Track at Trala" (`:92–98`) | Play Along discovery plus onboarding delivery in the same Sprints, same team (§5.6). Remove Practice Mode from this page |
| OKRs | Hero (`:73–77`) | Larkwell company OKR (§5.5) |
| OKRs | Cascade (`:160–181`) | Company → Onboarding team → Content team (§5.5). Remove "(your team)" |
| OKRs | "Susana's Team — Q2 2026 OKRs" (`:189–211`) | "Larkwell content team OKRs, Q3" (§5.5). KR3 is 8 lessons, labeled committed output |
| Execution-Comparison-Guide | One-liners (`:66`), operating system (`:127–137`) | OKRs: "This quarter we raise D7 retention from 19% to 24%." Dual-track: "We tested a Play Along prototype with 5 learners before building it." Scrum: "Sprint 14: time to first note under 90 seconds; 28 points planned." Shape Up: "We bet six weeks on the Practice Mode pitch." |
| User-Story-Mapping | "Story mapping Trala's violin onboarding" (`:434–510`) and the rewrite's violin example | Larkwell piano onboarding. Goal: "Start learning piano with Larkwell and play a first song in the first session." "Auto-select violin" becomes "Choose microphone or MIDI keyboard"; "tuning" items become "instrument check". Release metrics: R1, a new user can sign up and finish one lesson; R2, activation of at least 50% and D7 of at least 21%; R3, activation of 55% and D7 of 24% |
| Design-Thinking | Walkthrough (`:279–306`); workshop tip (`:329`) | Larkwell onboarding redesign. "Dumps 200+ lessons" becomes "opens on a library of 320 lessons". Prototype built in about 6 hours. Delete the "If you're at Trala/Skoove" tip |
| JTBD-Framework | Music learning example (`:289`) | "Larkwell (piano learning)"; job story unchanged |
| Design-Comparison-Guide | Scenarios (`:428,455`), pipeline examples (`:551,561,573`), footer (`:653`) | "Larkwell subscribers cancel after their first month: why?"; "Larkwell is considering a version for children"; "Larkwell's app has grown to dozens of features"; "Larkwell's onboarding redesign"; delete the footer |
| Porters-5-Forces | "Porter's 5 Forces for Skoove/Trala's market" (`:253–285`); pitfall (`:354`); footer (`:434`) | Larkwell's market (§5.8); no named rival apps; substitutes per C-63; delete the footer |
| Blue-Ocean-Strategy | "Skoove / Trala Market Analysis" (`:270–310`) | Larkwell ERRC (§5.8). Yellow Tail stays as the book's case (§1.3) |
| Playing-to-Win | "Trala's Strategic Cascade" (`:291–326`) | Larkwell cascade (§5.8), labeled "Worked example", not "Real Example" |
| Wardley-Mapping | "Wardley Map for Trala" (`:287–329`) and hero | Larkwell components (§5.8), the same list in hero, table and builder defaults |
| Strategy-Comparison-Guide | Scenarios (`:124–128`), pipeline (`:141–156`) | Kids' version scenario for Porter; "Every piano app looks the same" (no churn figure) for Blue Ocean; pipeline steps quote §5.8; Wardley step: "Note detection is Custom-built but moving toward Product; adopt a library when it matches ours." No "2–3 years" |

**Examples that stay as they are.** These are generic, fictional and make no claim about a real company. Their numbers are fixed by golden tests or by the rewrite, so they do not switch to Larkwell:

- RICE: the streaming-app features (Smart Shuffle, Social Playlists, Lyrics Display; 32,000 > 7,500 > 4,167).
- ICE: the growth team's five experiments (576, 441, 216, 160, 36).
- Value vs Effort: the e-commerce features.
- Kano: the hotel booking app (with C-26 fixed).
- CIRCLES: "Design a feature for elderly users to use ride-sharing apps" (an interview prompt; naming Uber as the assumed product is public and general).
- JTBD: the milkshake and the other well-known job stories (Christensen's milkshake is a published case; the others are illustrative job stories, labeled as such).
- Real public cases that stay, with accurate names: Spotify's Discover Weekly; [yellow tail] (Kim and Mauborgne); Olay (Lafley and Martin); Amazon's WBR and six-page memos (Bryar and Carr); Intercom (RICE, job stories); Basecamp, now 37signals (Shape Up); Google and Intel (OKRs); the commonly cited North Star examples (labeled as commonly cited).

### 5.10 The §5.4 drifts, resolved

| Drift | Resolution |
|---|---|
| 70% week-one churn vs 12% D7 | One number: D7 was 12% before bridge lessons and is 19% now. "70%" survives only as "70% of learners who finish a lesson never return to practice it" |
| The missed 10-point target | Target 18% (6 points); result 19% (7 points) |
| Skoove numbers reused as Trala's | Bridge lessons and Practice Mode have separate data (§5.7) |
| Practice Mode: one sprint vs a six-week bet | Six-week bet by the Practice team; Dual-Track no longer builds it |
| Sprint 14 = 28 points vs Sprint 5 = 21 points | Sprint 14 only: 28 planned, 20 Done, average velocity 27 |
| Lesson volume 5 / 8 / 10 / 20 | 8 new beginner song lessons this quarter; 120 → 128 available |
| Prices and the referral program stated as fact | Larkwell's $14.99 / $89.99 and "Give a friend 30 days free", labeled illustrative |
| Retention vs activation as the leak | Retention, computed from the funnel (§5.4) |
| NSM unit drift | Weekly Active Learners (3+ lessons a week) |
| D30 8% / 15% / 16%; D7 20% → 35% | D30 9% now, 11% target; D7 19% now, 24% target |
| Violin (Trala) vs piano (Skoove) | Piano only |

---

## 6. Section and naming standards

### 6.1 Chapter ids and rail labels

`data-nav` is the rail label (1–3 words, sentence case). The `h2` is specific and says something. Never a third name.

| id | data-nav | Default h2 pattern | Replaces |
|---|---|---|---|
| `understand` | How it works | Names the idea ("Three factors multiply, one divides") | Concept, Theory, Quadrants, Categories, Factors, 5 Forces, 5 Choices, 7 Steps, 5 Phases, The Core Idea, Why STAR?, Why Shape Up?, The Problem |
| (specific, at most two) | Short noun phrase (Scoring, The curve, The survey, The canvas, ERRC grid, The cascade, Where and how, The map, Evolution, The stages, Metrics, Loop types, Mechanics, Anatomy, Finding yours, The model, Counter-metrics, Accountabilities and events, Artifacts, Phases, Key ideas, The tracks, Discovery, Writing OKRs, The letters, The rules, SCQA, The beats, Formats, The sections, Writing it, The job story) | Specific | Deep Dive, Theory, sec-label variants |
| `example` | Example | Specific ("Scoring three features for a music app", "Larkwell's piano funnel") | Example, Examples, Real Example, Full Walkthrough, Full Example, Example: Music Learning Apps |
| `try` | Try it | "Score a feature of your own", "Build your own map" | Try It, Plot It, Classify, Builder, Analyzer, Practice, Practice It, Apply to Your Problem, Sprint Planner, Pitch Builder, Discovery Planner, Map Builder, Arc Builder |
| `when` | When to use | "When RICE fits and when it doesn't" or similar | When, When to Use, When to Use / Skip, When to Use JTBD |
| `pitfalls` | Pitfalls | "Common pitfalls" | 6 Common Pitfalls, 5 Common Pitfalls, Common Mistakes, Signs Your Cascade Is Broken |
| `session` | Run a session, or In the interview | "Running a two-hour mapping workshop", "A 35-minute plan for a product design question" | Session, Run a Session, Interview, Interviews, Workshop, Running a Design Thinking Workshop |
| `quiz` | Quiz | "Check your understanding" | Quiz, Quick Quiz, Check Yourself, Knowledge Check |

Comparison guides: `overview` At a glance · `compare` Side by side · `decide` How to decide · `picker` Picker · `scenarios` Scenarios · `combine` Using them together · `quiz` Quiz (optional, owner decision).

"In the interview" is used by CIRCLES and STAR (and JTBD's interviews chapter uses "Run a session", since those interviews are research, not job interviews).

### 6.2 Fixed labels

| Slot | Label |
|---|---|
| Summary title | In short |
| Example label | Worked example |
| Fit columns | Use it when / Skip it when |
| Pitfall fix | Fix: |
| Quiz h2 | Check your understanding |
| Quiz result line | "5 of 6 correct" (generated) |
| Interview line, if the owner keeps them | template titled "Saying it in an interview", at most one per guide |
| Mnemonic | At most one per guide, a `callout` titled with the image itself ("A leaky bucket"), never "Memory trick" |
| Comparison guide titles | "Choosing a prioritization framework", "Choosing a design framework", "Choosing a strategy framework", "Choosing a growth framework", "Choosing an execution framework", "Choosing a communication framework" |
| Category noun | frameworks (never "tools") |
| Banned labels | Pro tip, Pro move, Key insight, Remember, Note, Memory trick, Deep dive, Real example, One-liner, In 15 seconds, In 10 seconds, Why this works (use `example-reading` with a specific h4), Power combos, The growth operating system |

### 6.3 Framework names

Use these names in full on first mention in a guide; the short form may follow.

| Name | Short form | Not |
|---|---|---|
| RICE Score (page title); RICE (in prose) | RICE | RICE Framework |
| Value vs Effort | — | V/E, Value/Effort, V vs E, Impact/Effort |
| Kano model | Kano | Kano Model in prose (title case only in the title) |
| ICE Score; ICE | ICE | — |
| CIRCLES Method | CIRCLES | CIRCLES framework |
| Jobs to Be Done | JTBD | Jobs-to-be-Done, JTBD Framework |
| User Story Mapping | story mapping, story map | USM in prose |
| Design thinking (in prose); Design Thinking (title) | — | DT |
| Porter's Five Forces | the Five Forces | Porter's 5 Forces, 5 Forces, Porter's |
| Blue Ocean Strategy | Blue Ocean | — |
| Playing to Win | — | PTW |
| Wardley Mapping; a Wardley map | — | — |
| AARRR (pirate metrics) | AARRR | Pirate funnel |
| Growth loops (prose); Growth Loops (title) | loops | — |
| North Star Framework; North Star Metric | NSM after first use | North Star (alone, for the metric) |
| Input and Output Metrics | inputs and outputs | Input/Output |
| Agile and Scrum | Scrum | — |
| Shape Up | — | ShapeUp |
| Dual-track agile (prose); Dual-Track Agile (title) | dual-track | Dual Track |
| OKRs | an OKR | OKR's |
| STAR Method | STAR | — |
| Pyramid Principle | the pyramid | Minto pyramid |
| Narrative arc (prose); Narrative Arc (title) | the arc | — |
| Executive summary (prose); Executive Summary (title) | exec summary only in tables | Exec Sum |

Headings use sentence case; framework names keep their own capitals inside them.

### 6.4 The 24 framework guides: chapter map

"[+]" means the chapter has to be authored or assembled from material already on the page. Everything else is a move or a rename.

| Framework | Specific chapters (≤ 2) | Moves and merges | Pitfalls status | Session |
|---|---|---|---|---|
| RICE | `score` Scoring | Template and CSV → `try`; "After scoring" → `session` | Has 6 | Run a session |
| Value vs Effort | `score` How to score | — | Has; replace the "equal items per quadrant" fix (§4.2) | Run a session |
| Kano | `curve` The curve; `survey` The survey | `understand` = five categories; evaluation table and Better/Worse in `survey` | Has | Run a session |
| ICE | `score` Scoring | "vs RICE" → a compare table in `when` plus a link to the comparison guide | Has; fix aligned to the one rubric | Run a session |
| CIRCLES | — | "7 Steps" and "Deep Dive" merge into `understand` as one `steps` list with `step-meta` and `step-say` | Has | In the interview |
| JTBD | `story` The job story | Example gallery → one `example` plus cards; forces with the interviews | Has; retitle pitfall 4 (§4.2) | Run a session (interviews) |
| User Story Mapping | `anatomy` Anatomy | — | Has | Run a session |
| Design Thinking | — | "5 Phases" and "Deep Dive" merge into grouped `steps` | Has | Run a session (workshop) |
| Porter's Five Forces | `assess` Assessing each force (a table: force, raises pressure, lowers pressure) | Force list once; drop the restatements | Has; fix the Spotify pitfall (C-63) | Optional |
| Blue Ocean | `canvas` The strategy canvas; `errc` The ERRC grid | Value innovation explained once | [+] author (§6.5) | Optional |
| Playing to Win | `cascade` The cascade; `where-how` Where to play and how to win | "Signs your cascade is broken" and "Stuck in the middle" → `pitfalls` with fixes | [+] assemble (§6.5) | Optional |
| Wardley | `map` The map; `evolution` Evolution | "#1 Mistake: Building Commodities" → `pitfalls` | [+] assemble (§6.5) | Optional |
| AARRR | `stages` The stages; `metrics` Metrics | "The Biggest Mistake" → `pitfalls` | [+] assemble (§6.5) | Optional |
| Growth Loops | `types` Loop types; `mechanics` Mechanics | "Not All Loops Are Equal" → `pitfalls`, corrected (§4.2) | [+] assemble (§6.5) | Optional |
| North Star | `anatomy` Anatomy; `find` Finding yours | "Common NSM Traps" → `pitfalls` with fixes | [+] assemble (§6.5) | Optional |
| Input and Output | `model` The model; `counter` Counter-metrics and trees | "Correlation Trap" and "Real-World Tension" → `pitfalls`; "Complete Growth Stack" → GrowthCmp `combine` | [+] assemble (§6.5) | Optional |
| Agile and Scrum | `roles` Accountabilities and events; `artifacts` Artifacts and commitments | Events as a table | [+] author (§6.5) | Optional |
| Shape Up | `phases` Shaping, betting, building; `concepts` Key ideas (with a hill chart figure) | "Circuit Breaker" stays in `concepts`; its misuse goes in `pitfalls` | [+] author (§6.5) | Optional |
| Dual-Track Agile | `tracks` The two tracks; `discovery` Running discovery | "Feature factory" and "single track" contrast → `understand` | [+] author (§6.5) | Optional |
| OKRs | `anatomy` Anatomy; `writing` Writing OKRs | "Common Mistakes" → `pitfalls` with fixes | [+] assemble (§6.5) | Optional |
| STAR | `letters` The letters | "Common Mistakes" → `pitfalls`, placed after `when` | Has | In the interview |
| Pyramid | `rules` The three rules; `scqa` SCQA | Bottom-up contrast → `understand` | [+] author (§6.5) | — |
| Narrative Arc | `beats` The five beats; `formats` Formats (table: format × beat) | — | [+] author (§6.5) | — |
| Executive Summary | `sections` The six sections; `writing` Writing it | "Common Mistakes" → `pitfalls` with fixes | [+] assemble (§6.5) | — |

Fourteen guides need a pitfalls chapter authored or assembled: Blue Ocean, Playing to Win, Wardley, AARRR, Growth Loops, North Star, Input and Output, Agile and Scrum, Shape Up, Dual-Track, OKRs, Pyramid, Narrative Arc and Executive Summary. Adding new teaching content needs the owner's approval (synthesis §6.1); the candidates below are drawn from each page's own warnings first, then from criticism that is standard in the literature. Each guide uses 3–6 of them.

### 6.5 Candidate pitfalls

Each item: title, one sentence on the problem, one sentence for the fix. "From the page" marks material already in the legacy file.

#### Blue Ocean Strategy

1. **A higher curve, not a different one.** Raising every factor produces a better red-ocean offer at a higher cost, not a new value curve (from the page, `:254–257`). Fix: require at least one Eliminate or Reduce for every Raise or Create, and check that the canvas shows a different shape, not just a higher line.
2. **ERRC filled with features.** Listing product features instead of the factors the industry competes on produces a feature roadmap, not a strategy. Fix: draw the strategy canvas first and make every ERRC item a factor on it.
3. **Asking only current customers.** Current customers describe the industry's existing curve. Fix: talk to people in each of the three noncustomer tiers before filling the grid.
4. **Treating the blue ocean as permanent.** Kim and Mauborgne note that successful moves attract imitators and the ocean eventually turns red. Fix: watch rivals' value curves and plan the next move before imitation closes the gap.
5. **Value without cost, or cost without value.** Value innovation needs both at once, and a grid with only Raise and Create, or only Eliminate and Reduce, has neither. Fix: check that the Eliminate and Reduce items pay for the Raise and Create items.

#### Playing to Win

1. **"We play everywhere."** A strategy that rules nothing out has made no where-to-play choice (from the page, `:207`). Fix: write down which segments, channels and products you will not serve.
2. **"We win by being the best."** "Best" says nothing about how you win or for whom (from the page, `:208`). Fix: state whether you win on lower cost or on a difference customers value, and for which customers.
3. **Too many capabilities.** Ten capabilities means no priorities (from the page, `:209`). Fix: keep the few capabilities that make the where and how choices work, and that reinforce each other.
4. **A target in place of a strategy.** "Grow 20%" is a goal, not a choice (from the page, `:210`). Fix: put targets in the management systems (OKRs) and keep the aspiration about who you serve and why.
5. **Stuck in the middle.** Trying to win on both cost and differentiation usually achieves neither; the term is Porter's (*Competitive Strategy*, 1980; from the page, `:279–281`). Fix: choose one way to win and let it shape the capabilities.
6. **Choices that do not fit together.** Each choice can look reasonable while the set contradicts itself, or reads as generic. Fix: ask "What would have to be true?" for each choice, and check that a competitor could not adopt the whole cascade unchanged.

#### Wardley Mapping

1. **Building commodities.** Custom-building payments, hosting or authentication spends engineering time on solved problems (from the page, `:267–268`). Fix: outsource or rent anything in the Commodity stage and spend the effort on components that differentiate.
2. **No anchor.** A map that does not start from a user and their need cannot show what is visible or valuable. Fix: write the user and the need at the top before placing any component.
3. **Treating timing as predictable.** Evolution has a predictable direction but unpredictable timing, so dated forecasts mislead. Fix: commit to the direction, keep timing assumptions explicit and watch for signals.
4. **Reading the axes as a 2×2.** Treating the vertical axis as importance or a quadrant as "where advantage lives" misreads the map (from the page, quiz Q4). Fix: read vertical position as visibility to the user through the value chain and horizontal position as evolution.
5. **Ignoring inertia.** Past success makes teams defend components that are commoditizing. Fix: mark where your own team or your rivals will resist a move, and plan for it.

#### AARRR

1. **Buying acquisition into a leaky funnel.** Spending on ads while activation or retention is broken pays for users who leave (from the page, `:115–116`). Fix: compute each stage's conversion first and fix the largest relative loss before raising acquisition spend.
2. **Vanity metrics per stage.** Installs and sign-ups can grow while value does not. Fix: pick one actionable metric per stage, defined on a cohort and a time window.
3. **An undefined activation event.** "Active" without a specific event and window cannot be improved. Fix: define the aha moment from data, for example the action that best separates retained from churned users.
4. **Borrowed benchmarks.** Industry figures rarely match your product, channel mix or definitions. Fix: compare each cohort with your own earlier cohorts.
5. **A linear view of a looping product.** Funnels ignore how users bring in other users, the criticism Reforge makes of funnel-only thinking. Fix: map the product's growth loops alongside the funnel.

#### Growth Loops

1. **Calling a funnel a loop.** If no output of the last step becomes a new input, it is a funnel. Fix: trace the output of each cycle back to the start of the next before drawing the loop.
2. **Assuming virality.** A K-factor above 1 is rare and usually temporary (from the page, `:179`, corrected). Fix: measure invitations per user, acceptance and cycle time, and plan as if K is below 1.
3. **A paid loop without unit economics.** Reinvesting revenue in ads only compounds when LTV exceeds CAC and the payback is short (from the page, `:173`, corrected). Fix: compute LTV:CAC and payback before scaling a paid loop.
4. **Mislabeling content loops.** A loop where the company writes the content behaves differently from one where users do (from the page, `:255`). Fix: name who creates the content and cost it accordingly.
5. **Ignoring cycle time.** Two loops with the same conversion grow at very different speeds if one turn takes a week and the other a quarter. Fix: measure how long one turn takes and look for ways to shorten it.

#### North Star Framework

1. **Revenue as the North Star.** Revenue measures value captured, not value delivered, and can rise through price alone (from the page, `:175`). Fix: choose a metric of value delivered, such as lessons completed by active learners, and let revenue follow.
2. **A vanity count.** Total sign-ups keep rising while users leave (from the page, `:176`). Fix: count a value event in a time window.
3. **A metric you cannot read weekly.** Survey scores such as NPS are slow and indirect (from the page, `:177`). Fix: pick a behavioral metric you can track every week.
4. **A North Star with no inputs.** A single number without levers tells teams what to watch, not what to do. Fix: break it into three to five input metrics, each owned by a team.
5. **Making the North Star the Objective.** An OKR objective with a number in it is a key result (C-04). Fix: keep the Objective qualitative and use the NSM as one of its key results.

#### Input and Output Metrics

1. **Inputs that are tasks.** "Ship 5 lessons" is a deliverable, not a metric the team moves week to week. Fix: name the customer-facing metric the work should move, such as lessons available or completion rate.
2. **The correlation trap.** An input that rises with the output may not cause it (from the page, `:166–167`). Fix: test the link with an experiment before making the input a team's goal.
3. **Inputs that can be gamed.** A team can push an input up in ways that hurt users, such as sending more notifications (from the page, `:177`). Fix: pair each gameable input with a counter-metric.
4. **A counter-metric that moves with the input.** A metric that rises and falls with the target cannot warn you (C-14). Fix: pick one that worsens when the input is pushed too far.
5. **Reviewing only outputs.** Weekly reviews of revenue and retention show results too late to act on. Fix: review controllable inputs weekly, as Amazon's WBR does (Bryar and Carr, 2021), and outputs less often.

#### Agile and Scrum

1. **Velocity as a performance measure.** Comparing teams or people by velocity leads to inflated estimates (from the page, `:216`). Fix: use velocity only for the team's own planning.
2. **The Daily Scrum as a status report.** Reporting to a manager turns the event into a meeting about the past. Fix: let the Developers inspect progress toward the Sprint Goal and adapt the plan for the next day.
3. **No Sprint Goal.** A list of unrelated stories gives the team nothing to protect when trade-offs come. Fix: agree on one Sprint Goal at Sprint Planning and choose items that serve it.
4. **Partial credit.** Counting half-done items as done hides problems and inflates velocity (C-72). Fix: count only items that meet the Definition of Done and return the rest to the Product Backlog.
5. **The Sprint Review as a demo for sign-off.** A one-way demo misses the point of the event. Fix: run it as a working session with stakeholders about what to do next.
6. **Frozen or churning scope.** Refusing any change and changing everything are both mistakes. Fix: renegotiate scope with the Product Owner as long as the Sprint Goal is not endangered.

#### Shape Up

1. **A pitch that is a spec, or a wish.** Too much detail leaves the team no room; too little leaves rabbit holes open (from the page, `:130`). Fix: shape at fat-marker level and write down the rabbit holes and no-gos.
2. **Extending the cycle.** Granting "one more week" removes the pressure to cut scope (from the page, the circuit breaker, `:177–178`). Fix: let the circuit breaker stop the project; reshape and re-pitch it if it is still worth doing.
3. **Treating scope as fixed.** Reading the pitch as a contract makes the team miss the deadline instead of cutting (C-66). Fix: hammer scope throughout the cycle to fit the appetite.
4. **Skipping cooldown.** Filling the two weeks with planned work leaves no time for bugs, exploration or betting. Fix: protect cooldown as unscheduled time.
5. **Six-week cycles without shaping.** Teams that adopt the cycles but have nobody shaping work get unbounded projects. Fix: give named senior people time to shape in parallel with each cycle.
6. **Rebuilding a backlog.** Keeping every unpicked pitch in a central list brings back the backlog the method drops. Fix: let pitches that matter come back at the next betting table.

#### Dual-Track Agile

1. **Discovery as a handoff.** A discovery group that passes a "validated backlog" to a delivery group recreates a mini-waterfall (Patton, "Dual Track Development is not Duel Track," 2017). Fix: have the same team do both tracks every week.
2. **Engineers left out of discovery.** Without the tech lead, feasibility risks surface only during delivery (C-77). Fix: run discovery as a product trio of PM, designer and tech lead.
3. **Validation theater.** Discovery that never kills an idea is confirming, not testing. Fix: write down before each test what result would stop the idea.
4. **Testing only usability.** A usable prototype can still be something nobody wants or the business cannot support. Fix: map each idea's value, usability, feasibility and viability risks and test the riskiest first.
5. **Big-batch discovery.** Weeks of research before any test delays learning (C-76). Fix: keep each experiment to hours or days.

#### OKRs

1. **Key results that are tasks.** "Launch the redesigned onboarding" is work, not a result (from the page, `:141`). Fix: write the outcome the work should change, for example "activation from 45% to 55%".
2. **Too many OKRs.** Eight objectives with five KRs each is forty things nobody remembers (from the page, `:142`). Fix: keep to three to five objectives with two to five KRs each.
3. **Sandbagging.** Easy goals that always score 1.0 hide what the team could do (from the page, `:143`). Fix: label stretch goals aspirational and expect about 0.7 on average.
4. **OKRs tied to pay.** Linking scores to bonuses makes people set safe goals (from the page, `:144`; Doerr, *Measure What Matters*, 2018). Fix: keep OKR grading separate from performance reviews.
5. **Committed and aspirational mixed up.** Without labels, a 0.7 on a committed KR looks like success. Fix: label every OKR and grade each type against its own expectation.
6. **Set and forget.** OKRs written at the start of the quarter and read only at the end cannot steer work. Fix: check progress on each KR every week or two.

#### Pyramid Principle

1. **Bottom-up order.** Walking through the research before the conclusion makes the reader wait for the point (from the page, `:83–91`). Fix: put the governing thought first.
2. **Mixed groupings.** Reasons, actions and facts in one group break Minto's rule that a grouping holds one kind of idea. Fix: check that every idea in a group is the same kind and that its summary is the idea above it.
3. **Overlaps and gaps.** Supporting points that overlap or leave an obvious case out invite challenge. Fix: test each group for MECE.
4. **No order within a group.** A random list is harder to follow and check. Fix: order each group deductively, by time, by structure or by degree.
5. **A long introduction.** An SCQA that tells the reader new things delays the answer. Fix: keep the Situation and Complication to what the reader already knows, in a sentence or two.
6. **A hedged answer.** "We might want to consider…" at the top leaves the reader without a position. Fix: state the recommendation plainly and put the caveats in the support.

#### Narrative Arc

1. **A story when they want the answer.** Building tension for an audience that already agrees, or only needs an update, wastes their time (from the page, `:183–188`). Fix: use the Pyramid Principle for updates and the arc only when you must persuade.
2. **No real struggle.** Skipping the cost of doing nothing leaves the resolution without urgency. Fix: quantify what the problem costs in the Struggle beat.
3. **Manufactured drama.** Exaggerated stakes or unsourced claims lose a skeptical audience. Fix: use only figures you can show, and say where they come from.
4. **A resolution without evidence.** A solution that arrives with no proof reads as a hope. Fix: bring pilot data, a prototype result or a comparable case into the Resolution.
5. **A vague new reality.** Ending on a vision without a request leaves nothing to decide. Fix: end with a specific ask and the metric that will show it worked.

#### Executive Summary

1. **Burying the recommendation.** Context first makes the reader hunt for the point (from the page, `:145`). Fix: open with the recommendation in the first sentence.
2. **All the data.** Including everything hides what decides the question (from the page, `:146`). Fix: keep the three to five data points that drive the decision and link the rest.
3. **No clear ask.** "Thoughts?" is not a request (from the page, `:147`). Fix: say who must decide what, by when, and what it costs.
4. **Hedging.** "We might want to consider…" weakens the recommendation (from the page, `:148`). Fix: write "I recommend…" and handle doubts under Risks.
5. **No alternatives.** A single option looks like a decision already made. Fix: show two or three options, including doing nothing, with their costs.
6. **Writing it first.** A summary written before the analysis is finished drifts from the conclusion. Fix: write it last, once the recommendation is settled.

---

## Appendix: sources named in this document

- Adams, Paul. "Replacing the user story with the job story." Intercom blog, 2013.
- Balfour, Brian, Casey Winters, Kevin Kwok and Andrew Chen. "Growth Loops are the New Funnels." Reforge, 2018.
- Beck, Kent, et al. *Manifesto for Agile Software Development*, 2001.
- Berger, Charles, et al. "Kano's methods for understanding customer-defined quality." *Center for Quality of Management Journal*, 1993.
- Brown, Tim. *Change by Design*, 2009.
- Bryar, Colin, and Bill Carr. *Working Backwards*, 2021.
- Cagan, Marty. *Inspired*, 2nd ed., 2017.
- Christensen, Clayton, et al. *Competing Against Luck*, 2016.
- Cockburn, Alistair. *Crystal Clear*, 2004.
- Design Council. *Eleven Lessons: Managing Design in Eleven Global Brands*, 2005.
- Doerr, John. *Measure What Matters*, 2018.
- Duarte, Nancy. *Resonate*, 2010.
- Ellis, Sean, and Morgan Brown. *Hacking Growth*, 2017.
- Freytag, Gustav. *Die Technik des Dramas*, 1863.
- Google. "Set goals with OKRs" (re:Work guide).
- Grove, Andrew. *High Output Management*, 1983.
- Hasso Plattner Institute of Design at Stanford. *An Introduction to Design Thinking: Process Guide*.
- Kano, Noriaki, et al. "Attractive quality and must-be quality." *Journal of the Japanese Society for Quality Control*, 1984.
- Kim, W. Chan, and Renée Mauborgne. *Blue Ocean Strategy*, 2005 (expanded edition 2015).
- Klement, Alan. *When Coffee and Kale Compete*, 2016.
- Kohavi, Ron, Diane Tang and Ya Xu. *Trustworthy Online Controlled Experiments*, 2020 (only if a figure is quoted exactly).
- Lafley, A.G., and Roger L. Martin. *Playing to Win: How Strategy Really Works*, 2013.
- Lin, Lewis C. *Decode and Conquer*, 2013.
- McBride, Sean. "RICE: Simple prioritization for product managers." Intercom blog.
- McClure, Dave. "Startup Metrics for Pirates: AARRR!" 2007.
- Minto, Barbara. *The Pyramid Principle: Logic in Writing and Thinking*.
- Moesta, Bob. *Demand-Side Sales 101*, 2020.
- Nielsen, Jakob. "Why You Only Need to Test with 5 Users," 2000; Nielsen and Landauer, 1993.
- Patton, Jeff. *User Story Mapping*, 2014; "Dual Track Development is not Duel Track," 2017.
- Porter, Michael E. "How Competitive Forces Shape Strategy," *HBR*, 1979; *Competitive Strategy*, 1980; "What Is Strategy?," *HBR*, 1996; "The Five Competitive Forces That Shape Strategy," *HBR*, 2008.
- Schwaber, Ken, and Jeff Sutherland. *The Scrum Guide*, November 2020.
- Singer, Ryan. *Shape Up*, Basecamp, 2019.
- Sy, Desirée. "Adapting Usability Investigations for Agile User-centered Design." *Journal of Usability Studies*, 2007.
- Ulwick, Anthony. *What Customers Want*, 2005; *Jobs to Be Done: Theory to Practice*, 2016.
- Wardley, Simon. *Wardley Maps*, 2016 onward.
