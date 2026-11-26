/**
 * Framework metadata: the single source of truth for the index, search,
 * guide headers and "where next" links.
 *
 * Every guide's content lives in public/guides/<file>; see docs/content-spec.md.
 */

export const categories = [
  {
    id: 'prioritization',
    name: 'Prioritization',
    description: 'Decide what to build next and what to leave out.',
    when: 'You have more ideas than time or people.',
  },
  {
    id: 'design',
    name: 'Design',
    description: 'Understand users and shape the right solution.',
    when: 'You need to find and define the right product.',
  },
  {
    id: 'strategy',
    name: 'Strategy',
    description: 'Read the market and choose where to play.',
    when: 'You face a large choice that is hard to reverse.',
  },
  {
    id: 'growth',
    name: 'Growth',
    description: 'Measure what matters and find what drives growth.',
    when: 'You need more users, revenue or engagement.',
  },
  {
    id: 'execution',
    name: 'Execution',
    description: 'Plan the work, ship it and keep delivery on track.',
    when: 'You need to organize and deliver product work.',
  },
  {
    id: 'communication',
    name: 'Communication',
    description: 'Structure arguments and tell product stories.',
    when: 'You need to persuade stakeholders or answer an interview question.',
  },
];

export const frameworks = [
  // ---- Prioritization ----
  { slug: 'rice', name: 'RICE Score', category: 'prioritization', file: 'RICE-Framework-Guide.html',
    description: 'Score features by reach, impact, confidence and effort.',
    question: 'Which features give the most impact for the effort?',
    origin: 'Sean McBride at Intercom',
    aliases: ['rice framework', 'reach impact confidence effort', 'scoring'],
    related: [
      { slug: 'ice', why: "ICE is the faster cousin: it drops Reach and rates Impact, Confidence and Ease from 1 to 10, so use it for a quick first pass or when you have no usage data yet." },
      { slug: 'value-effort', why: "Value vs Effort is the quickest first filter: plot a long list on a 2×2 to cut it to about ten ideas, then rank that shortlist with RICE." },
      { slug: 'kano', why: "The Kano model runs alongside RICE rather than replacing it: it does not rank, but it shows whether a feature is a Must-have, a Performance feature or a Delighter, which helps you judge Impact." },
      { slug: 'okrs', why: "OKRs give RICE something to aim at: agree the quarter’s objective and key results first, then score Impact by how much each idea moves them." },
    ] },
  { slug: 'value-effort', name: 'Value vs Effort', category: 'prioritization', file: 'Value-vs-Effort-Matrix.html',
    description: 'Plot ideas on a 2×2 of value against effort.',
    question: 'Which ideas are quick wins and which should we avoid?',
    origin: 'A long-standing 2×2 used across product and consulting',
    aliases: ['impact effort matrix', '2x2', 'quick wins', 'value effort matrix'],
    related: [
      { slug: 'rice', why: "RICE is the next step after the grid: once Value vs Effort has cut about 30 ideas to about 10, RICE ranks that shortlist with Reach taken from usage data." },
      { slug: 'ice', why: "ICE does the same first-pass job with three 1–10 ratings instead of a grid; pick it when you want one score to sort by rather than a picture to discuss." },
      { slug: 'kano', why: "The Kano model runs alongside rather than in sequence: use it when you need to know how a feature affects satisfaction, which a single value score cannot tell you." },
      { slug: 'user-story-mapping', why: "Once the grid has told you what to build, a story map plans how and when it ships, slicing the work into releases that each cover the whole user journey." },
    ] },
  { slug: 'kano', name: 'Kano Model', category: 'prioritization', file: 'Kano-Model.html',
    description: 'Sort features by how they affect customer satisfaction.',
    question: 'Which features are expected, which delight, and which nobody notices?',
    origin: 'Noriaki Kano, 1984',
    aliases: ['kano survey', 'delighters', 'must-haves', 'satisfaction'],
    related: [
      { slug: 'rice', why: "RICE is the next step after Kano: once you know which features are Must-haves, Performance features or Delighters, RICE ranks the features within a type using usage data." },
      { slug: 'value-effort', why: "Value vs Effort gives a quick first pass before a Kano survey, cutting a long list to the 8–12 features worth asking users about, and it can rank features within a Kano category when you have no usage data." },
      { slug: 'jtbd', why: "Jobs to Be Done names the job a customer is trying to get done; Kano can then classify the features that serve that job, and its results are easier to read when you know which job they serve." },
    ] },
  { slug: 'ice', name: 'ICE Score', category: 'prioritization', file: 'ICE-Score.html',
    description: 'Rank experiments fast by impact, confidence and ease.',
    question: 'Which experiment should we run first?',
    origin: 'Sean Ellis, GrowthHackers',
    aliases: ['ice framework', 'impact confidence ease', 'experiments'],
    related: [
      { slug: 'rice', why: "RICE adds Reach and divides by an Effort estimate. Move to it when the shortlist ICE produced needs a ranking that holds up to scrutiny and you have usage data for how many people each idea reaches." },
      { slug: 'value-effort', why: "Value vs Effort makes the same fast first pass on a 2×2 grid. It suits a team that wants to see and agree on the trade-offs, not read a score." },
      { slug: 'kano', why: "Kano does not rank ideas. It classifies features by how they affect satisfaction, so run it alongside ICE when you need to know whether an idea is a must-have or a delighter." },
    ] },

  // ---- Design ----
  { slug: 'circles', name: 'CIRCLES Method', category: 'design', file: 'CIRCLES-Method.html',
    description: 'A seven-step structure for product design questions.',
    question: 'How do I answer a product design interview question?',
    origin: 'Lewis C. Lin, Decode and Conquer, 2013',
    aliases: ['circles', 'product sense', 'design interview', 'pm interview'],
    related: [
      { slug: 'star', why: "STAR Method is the structure to use when the interview question is behavioral, such as ‘Tell me about a time when’, rather than a design prompt." },
      { slug: 'design-thinking', why: "Design thinking follows a similar path from users to needs to solutions, but with real users over days or weeks. Go there when you need evidence rather than a 20-minute spoken answer." },
      { slug: 'rice', why: "RICE is where to go when you already have a list of features and need to rank them with usage data. CIRCLES does not score a backlog." },
      { slug: 'pyramid', why: "For a case interview question such as ‘Should we enter this market?’, the Pyramid Principle’s answer-first structure fits better than the seven CIRCLES steps." },
    ] },
  { slug: 'jtbd', name: 'Jobs to Be Done', category: 'design', file: 'JTBD-Framework.html',
    description: 'Understand the progress customers hire a product to make.',
    question: 'What progress is the customer really trying to make?',
    origin: 'Clayton Christensen and Tony Ulwick',
    aliases: ['jtbd', 'jobs theory', 'job stories', 'switch interview'],
    related: [
      { slug: 'design-thinking', why: "Design thinking is the next step: JTBD is one lens for its Empathize research, and once you know the job, design thinking helps you frame, prototype and test solutions for it." },
      { slug: 'kano', why: "The Kano model can sort the features that serve a job into must-haves, performance features and delighters, which is easier once you know the job they are for." },
      { slug: 'rice', why: "RICE ranks the features that serve the job: the job sets what is worth scoring, and RICE decides the order to build in." },
      { slug: 'circles', why: "CIRCLES is for product design interviews; when asked how you would improve a product, frame the job first, then structure the rest of the answer with CIRCLES." },
    ] },
  { slug: 'user-story-mapping', name: 'User Story Mapping', category: 'design', file: 'User-Story-Mapping.html',
    description: 'Lay out the user journey to plan releases in slices.',
    question: 'What is the smallest release that works end to end?',
    origin: 'Jeff Patton, User Story Mapping, 2014',
    aliases: ['story map', 'backlog', 'mvp', 'release planning', 'walking skeleton'],
    related: [
      { slug: 'jtbd', why: "Start with Jobs to Be Done when you are unsure what progress the user wants to make; once the job is clear, the story map lays out the journey that gets it done." },
      { slug: 'design-thinking', why: "Design thinking helps you understand and frame a problem; when the team has ideas worth building, a story map plans what to build first and in what order." },
      { slug: 'rice', why: "Use RICE after the map to score the stories in the body and order each column, while the backbone stays in journey order." },
      { slug: 'kano', why: "The Kano model helps you order the stories under each step, but Release 1 is still the thinnest end-to-end journey, not every Must-have." },
    ] },
  { slug: 'design-thinking', name: 'Design Thinking', category: 'design', file: 'Design-Thinking.html',
    description: 'A human-centered process for problems you do not fully understand yet.',
    question: 'How do we solve a problem we do not fully understand yet?',
    origin: 'IDEO and the Stanford d.school',
    aliases: ['empathize define ideate prototype test', 'double diamond', 'human centered design'],
    related: [
      { slug: 'jtbd', why: "Jobs to Be Done is one lens for making sense of what you hear in Empathize: job stories summarize interviews compactly, though empathy research covers more than jobs. Start with JTBD when you first need to know what progress people are trying to make." },
      { slug: 'user-story-mapping', why: "Once a prototype holds up in testing, a story map plans how to release it in slices that each cover the whole user journey, the next step after design thinking in the design pipeline." },
      { slug: 'circles', why: "CIRCLES follows a similar path from users to needs to solutions but was developed separately: use it to structure a 20-minute interview answer with no real users, and design thinking for real research and prototyping." },
      { slug: 'dual-track', why: "Dual-track agile gives this kind of discovery a permanent place in the team’s week, running alongside delivery in the same team rather than as a phase before building." },
    ] },

  // ---- Strategy ----
  { slug: 'porters-5-forces', name: "Porter’s Five Forces", category: 'strategy', file: 'Porters-5-Forces.html',
    description: 'Analyze the forces that shape an industry’s profitability.',
    question: 'How attractive is this industry, and where does the pressure come from?',
    origin: 'Michael Porter, Harvard Business Review, 1979',
    aliases: ['five forces', '5 forces', 'porter', 'competitive analysis', 'industry analysis'],
    related: [
      { slug: 'blue-ocean', why: "Blue Ocean Strategy is the next step when the Five Forces shows a crowded red ocean: it looks for market space where those forces are weaker, and the substitutes you found point to its noncustomers." },
      { slug: 'playing-to-win', why: "Playing to Win turns the analysis into choices: the forces tell you which markets are attractive enough for your where-to-play choice." },
      { slug: 'jtbd', why: "Jobs to Be Done finds substitutes from the user’s side, as everything a person might hire for the same job, where the Five Forces sees them at the level of the market." },
      { slug: 'wardley-mapping', why: "Wardley Mapping adds how the components of your value chain evolve, where the Five Forces is a snapshot of industry structure." },
    ] },
  { slug: 'blue-ocean', name: 'Blue Ocean Strategy', category: 'strategy', file: 'Blue-Ocean-Strategy.html',
    description: 'Create uncontested market space instead of fighting rivals.',
    question: 'How do we stop competing head to head?',
    origin: 'W. Chan Kim and Renée Mauborgne, 2005',
    aliases: ['errc', 'strategy canvas', 'eliminate reduce raise create', 'value innovation'],
    related: [
      { slug: 'porters-5-forces', why: "Porter’s Five Forces comes first: it tells you whether your market is a red ocean, and its substitutes point you to the noncustomers Blue Ocean looks for." },
      { slug: 'playing-to-win', why: "Playing to Win comes next: it turns the move Blue Ocean suggests into concrete choices about where to play and how to win." },
      { slug: 'jtbd', why: "Jobs to Be Done takes you from market to user: once Blue Ocean finds the space, JTBD uncovers the job noncustomers need done." },
      { slug: 'kano', why: "Factors in the Create column often behave like Kano delighters: buyers do not expect them, so they add satisfaction without their absence causing complaints." },
    ] },
  { slug: 'playing-to-win', name: 'Playing to Win', category: 'strategy', file: 'Playing-to-Win.html',
    description: 'Five linked choices that make up a strategy.',
    question: 'Where will we play, and how will we win there?',
    origin: 'A.G. Lafley and Roger Martin, 2013',
    aliases: ['strategy cascade', 'where to play how to win', 'lafley martin'],
    related: [
      { slug: 'porters-5-forces', why: "Porter’s Five Forces usually comes first: its read of rivals, substitutes and buyer power is the input for choosing where to play and how to win." },
      { slug: 'blue-ocean', why: "Blue Ocean Strategy helps you find uncontested space worth pursuing; Playing to Win then turns that opportunity into five specific, linked choices." },
      { slug: 'wardley-mapping', why: "Wardley Mapping shows how the components behind your capabilities will evolve, so the capabilities you choose become the components you decide to build, and you can see when the choices need to change." },
      { slug: 'okrs', why: "OKRs carry the cascade into execution: once the choices are made, they turn the management systems choice into quarterly objectives and key results." },
    ] },
  { slug: 'wardley-mapping', name: 'Wardley Mapping', category: 'strategy', file: 'Wardley-Mapping.html',
    description: 'Map a value chain and how each part will evolve.',
    question: 'Where is each part of our value chain heading?',
    origin: 'Simon Wardley, 2005',
    aliases: ['wardley map', 'value chain', 'evolution', 'build vs buy'],
    related: [
      { slug: 'porters-5-forces', why: "Porter’s Five Forces sizes up the pressures on an industry today; Wardley Mapping adds how the components of your value chain evolve, so run the Five Forces first if you have not assessed the market." },
      { slug: 'playing-to-win', why: "Playing to Win decides where to play and how to win; a Wardley map then shows which of the capabilities those choices need are worth building because they differentiate, and which to buy or outsource." },
      { slug: 'blue-ocean', why: "Blue Ocean Strategy changes the buyer-facing factors you compete on, while Wardley Mapping works on the supply side, showing which components you must build to deliver that new offer and which you can adopt." },
      { slug: 'jtbd', why: "Every Wardley map starts from a user need at the top; Jobs to Be Done is a way to find and state that need before you map what serves it." },
    ] },

  // ---- Growth ----
  { slug: 'aarrr', name: 'AARRR Pirate Metrics', category: 'growth', file: 'AARRR-Pirate-Metrics.html',
    description: 'Track the funnel from acquisition to referral.',
    question: 'Where in the funnel are we losing people?',
    origin: 'Dave McClure, 2007',
    aliases: ['pirate metrics', 'funnel', 'acquisition activation retention revenue referral'],
    related: [
      { slug: 'north-star', why: "The North Star Framework narrows the view: AARRR maps every stage of the lifecycle, while a North Star Metric is the one measure of customer value the whole team rallies around, and the funnel shows which stages feed it." },
      { slug: 'growth-loops', why: "Growth loops turn the line into a circle: AARRR ends at its last stage, while a loop feeds outputs such as referred users or shared clips back in as new input, so growth can compound." },
      { slug: 'rice', why: "RICE picks up where AARRR stops: once the funnel shows which stage leaks, RICE ranks the features that could fix it." },
      { slug: 'okrs', why: "OKRs turn a stage metric into a goal: keep the Objective qualitative, such as making practice a habit, and use the metric as a key result, such as D30 retention from 9% to 11%." },
    ] },
  { slug: 'growth-loops', name: 'Growth Loops', category: 'growth', file: 'Growth-Loops.html',
    description: 'Design loops where each new user brings in the next.',
    question: 'How does each new user bring in the next one?',
    origin: 'Reforge: Brian Balfour, Casey Winters, Kevin Kwok and Andrew Chen, 2018',
    aliases: ['viral loop', 'flywheel', 'compounding growth'],
    related: [
      { slug: 'aarrr', why: "AARRR (pirate metrics) shows the growth funnel as a line; growth loops show how its referral stage feeds back into acquisition, so use AARRR first to find where growth is stuck." },
      { slug: 'north-star', why: "The North Star Framework gives the loop a focus: a good North Star Metric often sits inside your strongest loop, at the step where users get value." },
      { slug: 'input-output', why: "Input and Output Metrics turn a loop into levers: input metrics show which step of the loop to work on, and output metrics show whether the whole loop is speeding up." },
    ] },
  { slug: 'north-star', name: 'North Star Framework', category: 'growth', file: 'North-Star-Framework.html',
    description: 'Pick the one metric that reflects the value customers get.',
    question: 'Which single metric captures the value customers get?',
    origin: 'Amplitude’s North Star Playbook',
    aliases: ['north star metric', 'nsm', 'one metric that matters'],
    related: [
      { slug: 'aarrr', why: "AARRR maps every stage of the funnel and shows where users leak. Use it to find where growth is stuck, and the North Star Metric to keep every team aimed at the value customers get." },
      { slug: 'input-output', why: "Input and Output Metrics is the method for running a North Star Metric: break it into controllable inputs, pair each gameable input with a counter-metric and review the inputs every week." },
      { slug: 'okrs', why: "OKRs turn the North Star Metric into quarterly goals: the Objective stays qualitative, and the NSM or one of its inputs appears as a key result, such as Weekly Active Learners from 40,000 to 50,000." },
      { slug: 'growth-loops', why: "Growth loops show how users bring in more users. A good North Star Metric sits inside your strongest loop, so each turn of the loop moves it." },
    ] },
  { slug: 'input-output', name: 'Input and Output Metrics', category: 'growth', file: 'Input-Output-Metrics.html',
    description: 'Link the levers a team controls to the results it wants.',
    question: 'Which levers can the team pull to move the results?',
    origin: 'Amazon’s controllable input metrics, as described in Working Backwards (2021)',
    aliases: ['leading lagging', 'controllable inputs', 'metric tree', 'driver tree'],
    related: [
      { slug: 'north-star', why: "Start with the North Star Framework if you have not chosen your output yet: it picks the one metric of customer value that the inputs in this guide are meant to move." },
      { slug: 'okrs', why: "OKRs turn a metric stack into quarterly goals: the objective stays qualitative, the North Star Metric or an input becomes a key result, and counter-metrics become guardrails." },
      { slug: 'aarrr', why: "AARRR shows which funnel stage leaks; use it first to find where you need a lever, then give that stage an input metric and a counter-metric here." },
      { slug: 'growth-loops', why: "Growth loops feed a loop’s output back in as new users; each step of a loop is a conversion you can treat as its own input metric and improve one at a time." },
    ] },

  // ---- Execution ----
  { slug: 'agile-scrum', name: 'Agile and Scrum', category: 'execution', file: 'Agile-Scrum.html',
    description: 'Deliver in short Sprints with regular inspection.',
    question: 'How do we deliver in short increments we can inspect?',
    origin: 'Ken Schwaber and Jeff Sutherland, The Scrum Guide',
    aliases: ['scrum', 'sprint', 'standup', 'retrospective', 'agile'],
    related: [
      { slug: 'shape-up', why: "Shape Up is the alternative delivery method: instead of two-week Sprints over a backlog, it bets a fixed six-week cycle on work shaped in advance and cuts scope to fit." },
      { slug: 'dual-track', why: "Dual-track agile adds a continuous discovery track to Scrum, so the same team tests ideas every week while it delivers in Sprints." },
      { slug: 'okrs', why: "OKRs set the quarter’s goals; Sprint Goals are how a Scrum team works toward a key result two weeks at a time." },
      { slug: 'rice', why: "RICE helps the Product Owner order the Product Backlog, so the items pulled into each Sprint are the ones worth most for the effort." },
    ] },
  { slug: 'shape-up', name: 'Shape Up', category: 'execution', file: 'Shape-Up.html',
    description: 'Six-week cycles with work shaped to a fixed appetite.',
    question: 'How do we ship meaningful work in fixed cycles?',
    origin: 'Ryan Singer, Basecamp, 2019',
    aliases: ['basecamp', 'appetite', 'betting table', 'six week cycles', 'hill chart'],
    related: [
      { slug: 'agile-scrum', why: "Scrum is the main alternative way to organize delivery: short Sprints with a Sprint Goal and a Product Backlog, where Shape Up uses 6-week cycles, shaped pitches and no backlog, so a team usually picks one." },
      { slug: 'dual-track', why: "Dual-track agile runs discovery continuously in the whole product team; Shape Up’s shaping is also a form of discovery, but it is done by a few senior people in parallel with the cycle." },
      { slug: 'user-story-mapping', why: "A story map lays out the user’s journey and slices it into releases, which can help a shaper see which slice of a problem fits the appetite." },
      { slug: 'rice', why: "RICE scores can inform which pitches to bring to the betting table, though Shape Up relies on senior judgment at the table rather than a score." },
    ] },
  { slug: 'dual-track', name: 'Dual-Track Agile', category: 'execution', file: 'Dual-Track-Agile.html',
    description: 'Run discovery and delivery side by side.',
    question: 'How do we discover and deliver at the same time?',
    origin: 'Desirée Sy, 2007; popularized by Jeff Patton and Marty Cagan',
    aliases: ['dual track', 'continuous discovery', 'discovery delivery'],
    related: [
      { slug: 'agile-scrum', why: "Scrum can run the delivery track: keep its Sprints and events, and dual-track agile adds continuous discovery alongside them, done by the same team." },
      { slug: 'shape-up', why: "Shape Up’s shaping is like discovery, but a small senior group does it rather than the whole team. Dual-track agile can add continuous discovery to Shape Up cycles as well as to Scrum." },
      { slug: 'design-thinking', why: "Design thinking supplies many of the methods the discovery track runs on, from empathy interviews to prototypes and tests." },
      { slug: 'jtbd', why: "Jobs to Be Done interviews are a discovery technique: use them to learn what motivates users before you test a solution." },
    ] },
  { slug: 'okrs', name: 'OKRs', category: 'execution', file: 'OKRs.html',
    description: 'Objectives and key results for goal-setting across teams.',
    question: 'How do we align teams on outcomes instead of tasks?',
    origin: 'Andy Grove at Intel, popularized by John Doerr',
    aliases: ['objectives and key results', 'goals', 'kpi'],
    related: [
      { slug: 'north-star', why: "Choose your North Star Metric first: it, or one of its inputs, becomes a key result under a qualitative objective, never the objective itself." },
      { slug: 'input-output', why: "Input metrics, the customer-facing levers a team controls, make the best key results because a team can move them within a quarter; pair each with a counter-metric so it cannot be hit by damaging something else." },
      { slug: 'agile-scrum', why: "OKRs say what should change this quarter; Scrum’s two-week Sprints carry out the work toward those key results." },
      { slug: 'rice', why: "OKRs decide which outcomes matter this quarter; use RICE to rank the backlog items that serve a current key result." },
    ] },

  // ---- Communication ----
  { slug: 'star', name: 'STAR Method', category: 'communication', file: 'STAR-Method.html',
    description: 'Structure behavioral answers as situation, task, action, result.',
    question: 'How do I tell a clear story in a behavioral interview?',
    origin: 'Commonly credited to Development Dimensions International (DDI)',
    aliases: ['behavioral interview', 'situation task action result', 'tell me about a time'],
    related: [
      { slug: 'pyramid', why: "Use the Pyramid Principle when the listener wants the answer first, as in case interviews and stakeholder updates, where STAR’s story order would bury the conclusion." },
      { slug: 'circles', why: "The CIRCLES Method is the counterpart for product design questions: STAR tells what you did, CIRCLES structures what you would build, and many PM interview loops ask both." },
      { slug: 'narrative-arc', why: "The narrative arc follows a similar story order but builds tension for a presentation that must persuade a skeptical audience; its beats do not map one to one onto STAR’s letters." },
    ] },
  { slug: 'pyramid', name: 'Pyramid Principle', category: 'communication', file: 'Pyramid-Principle.html',
    description: 'Lead with the answer, then group the supporting arguments.',
    question: 'How do I lead with the answer and still make the case?',
    origin: 'Barbara Minto, McKinsey, 1970s',
    aliases: ['minto', 'scqa', 'answer first', 'mece'],
    related: [
      { slug: 'star', why: "STAR tells the story of what you did, for behavioral interview questions; use the pyramid instead when the reader wants your conclusion rather than your story." },
      { slug: 'narrative-arc', why: "The Narrative Arc runs in the opposite order, building tension before the answer, so reach for it only when a skeptical audience must be persuaded first; its Resolution can still carry a small pyramid of evidence." },
      { slug: 'exec-summary', why: "An Executive Summary is the pyramid in document form: the recommendation is the answer, the sections are the grouped reasons, and its Context is a compressed Situation and Complication." },
      { slug: 'circles', why: "For a product design interview question use CIRCLES; keep the pyramid for case interview answers, where you lead with the recommendation and group the reasons beneath it." },
    ] },
  { slug: 'narrative-arc', name: 'Narrative Arc', category: 'communication', file: 'Narrative-Arc.html',
    description: 'Shape product updates and pitches as a story with tension.',
    question: 'How do I turn a product update into a story people remember?',
    origin: 'Gustav Freytag’s dramatic structure and Nancy Duarte’s Resonate, adapted for product work',
    aliases: ['storytelling', 'pitch', 'story structure'],
    related: [
      { slug: 'pyramid', why: "The Pyramid Principle runs in the opposite order, answer first, so use it when the audience wants the answer. A small pyramid can also carry the evidence inside your arc’s Resolution." },
      { slug: 'star', why: "STAR tells a past story in a similar order for a behavioral interview answer. Use it when the question is about something you did, not a case you need to persuade people of." },
      { slug: 'exec-summary', why: "An executive summary is the written, recommendation-first brief for a decision. Write one when leadership will read the case rather than listen to a talk." },
    ] },
  { slug: 'exec-summary', name: 'Executive Summary', category: 'communication', file: 'Executive-Summary.html',
    description: 'A short, decision-ready brief for leadership.',
    question: 'How do I get a decision from leadership on one page?',
    origin: 'Business-writing practice, including BLUF (bottom line up front)',
    aliases: ['bluf', 'one pager', 'memo', 'exec update'],
    related: [
      { slug: 'pyramid', why: "An executive summary is the Pyramid Principle as a document. The recommendation is the governing thought at the top, and Context compresses SCQA’s Situation and Complication. For a short update that needs no options or ask, use the pyramid on its own." },
      { slug: 'narrative-arc', why: "When a room has to be persuaded before it will accept the answer, tell the story with the Narrative Arc in the meeting. Then send the executive summary as the written record of the decision." },
      { slug: 'star', why: "STAR is the format for answering a behavioral interview question about your past work. Reach for an executive summary when you need a decision from leadership, not a story about yourself." },
    ] },
];

export const comparisonGuides = [
  { slug: 'compare-prioritization', category: 'prioritization', file: 'Prioritization-Comparison-Guide.html',
    name: 'Choosing a prioritization framework', description: 'RICE, Value vs Effort, Kano and ICE side by side.' },
  { slug: 'compare-design', category: 'design', file: 'Design-Comparison-Guide.html',
    name: 'Choosing a design framework', description: 'CIRCLES, Jobs to Be Done, Story Mapping and Design Thinking side by side.' },
  { slug: 'compare-strategy', category: 'strategy', file: 'Strategy-Comparison-Guide.html',
    name: 'Choosing a strategy framework', description: 'Five Forces, Blue Ocean, Playing to Win and Wardley Mapping side by side.' },
  { slug: 'compare-growth', category: 'growth', file: 'Growth-Comparison-Guide.html',
    name: 'Choosing a growth framework', description: 'AARRR, Growth Loops, North Star and input metrics side by side.' },
  { slug: 'compare-execution', category: 'execution', file: 'Execution-Comparison-Guide.html',
    name: 'Choosing an execution framework', description: 'Scrum, Shape Up, dual-track agile and OKRs side by side.' },
  { slug: 'compare-communication', category: 'communication', file: 'Communication-Comparison-Guide.html',
    name: 'Choosing a communication framework', description: 'STAR, Pyramid, Narrative Arc and the executive summary side by side.' },
];

/** Starting points by situation, for the home page. */
export const situations = [
  { label: 'Preparing for a PM interview', slugs: ['circles', 'star', 'pyramid'] },
  { label: 'Too many ideas for the roadmap', slugs: ['rice', 'value-effort', 'ice'] },
  { label: 'Setting goals for next quarter', slugs: ['okrs', 'north-star', 'input-output'] },
  { label: 'Not sure what users need', slugs: ['jtbd', 'design-thinking', 'kano'] },
];

export function getFrameworksByCategory(categoryId) {
  return frameworks.filter(fw => fw.category === categoryId);
}

export function getFramework(slug) {
  return frameworks.find(fw => fw.slug === slug);
}

export function getCategory(id) {
  return categories.find(cat => cat.id === id);
}

export function getComparisonGuide(categoryId) {
  return comparisonGuides.find(cg => cg.category === categoryId);
}

export function getComparisonBySlug(slug) {
  return comparisonGuides.find(cg => cg.slug === slug);
}

/** Previous and next framework within the same category. */
export function getSiblings(slug) {
  const fw = getFramework(slug);
  if (!fw) return { prev: null, next: null };
  const list = getFrameworksByCategory(fw.category);
  const i = list.findIndex(f => f.slug === slug);
  return { prev: list[i - 1] || null, next: list[i + 1] || null };
}
