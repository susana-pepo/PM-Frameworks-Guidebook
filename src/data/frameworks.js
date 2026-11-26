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
    when: 'You have to say no to good ideas and explain why.',
  },
  {
    id: 'design',
    name: 'Design',
    description: 'Learn what users are trying to do and shape a product around it.',
    when: 'You need to work out what to build and for whom.',
  },
  {
    id: 'strategy',
    name: 'Strategy',
    description: 'Read the market and choose where to play.',
    when: 'The choice will commit money and people for years.',
  },
  {
    id: 'growth',
    name: 'Growth',
    description: 'Find where growth leaks and which levers move it.',
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
    aliases: ['rice framework', 'rice score', 'reach impact confidence effort', 'scoring', 'feature scoring', 'prioritize', 'rank features', 'backlog', 'roadmap'],
    related: [
      { slug: 'ice', why: "Faster and rougher: three 1–10 ratings with no Reach. Use it for a first pass, or before you have usage data." },
      { slug: 'value-effort', why: "A first filter for a long list. Plot it on a 2×2, cut it to about ten ideas, then rank those with RICE." },
      { slug: 'kano', why: "It ranks nothing, but knowing whether a feature is a Must-have, a Performance feature or a Delighter helps you judge its Impact." },
      { slug: 'okrs', why: "Agree the quarter’s objective and key results first, then score Impact by how much each idea moves them." },
    ] },
  { slug: 'value-effort', name: 'Value vs Effort', category: 'prioritization', file: 'Value-vs-Effort-Matrix.html',
    description: 'Plot ideas on a 2×2 of value against effort.',
    question: 'Which ideas are quick wins and which should we avoid?',
    origin: 'A long-standing 2×2 used across product and consulting',
    aliases: ['impact effort matrix', '2x2', 'quick wins', 'value effort matrix', 'priority matrix', 'low hanging fruit', 'prioritize', 'roadmap', 'backlog'],
    related: [
      { slug: 'rice', why: "The next step after the grid. Once you’ve cut about 30 ideas to 10, rank the shortlist with Reach taken from usage data." },
      { slug: 'ice', why: "Does the same first-pass job with three 1–10 ratings. Pick it when you’d rather sort by one score than discuss a picture." },
      { slug: 'kano', why: "A single value score can’t show how a feature affects satisfaction. Kano can, so run it alongside the grid." },
      { slug: 'user-story-mapping', why: "Once the grid says what to build, a story map plans the releases, each one covering the whole user journey." },
    ] },
  { slug: 'kano', name: 'Kano Model', category: 'prioritization', file: 'Kano-Model.html',
    description: 'Ask users how they’d feel with and without each feature, then classify it from the pair of answers.',
    question: 'Which features are expected, which delight, and which nobody notices?',
    origin: 'Noriaki Kano, 1984',
    aliases: ['kano survey', 'kano questions', 'survey questions', 'functional dysfunctional', 'delighters', 'must-haves', 'performance features', 'attractive quality', 'satisfaction', 'customer satisfaction'],
    related: [
      { slug: 'rice', why: "Once the survey has sorted features into types, rank the features within each type using usage data." },
      { slug: 'value-effort', why: "Cut a long list to the 8–12 features worth surveying. Without usage data, the grid can also rank features within a category." },
      { slug: 'jtbd', why: "Name the job first. Kano results are easier to read when you know which job the features serve." },
    ] },
  { slug: 'ice', name: 'ICE Score', category: 'prioritization', file: 'ICE-Score.html',
    description: 'Rate each idea 1 to 10 for impact, confidence and ease, and multiply the three.',
    question: 'Which experiment should we run first?',
    origin: 'Sean Ellis, GrowthHackers',
    aliases: ['ice framework', 'ice score', 'impact confidence ease', 'experiments', 'growth experiments', 'prioritize', 'rank ideas', 'rank features', 'backlog'],
    related: [
      { slug: 'rice', why: "Adds Reach and divides by Effort. Move to it when your shortlist needs a ranking that survives scrutiny and you have usage data." },
      { slug: 'value-effort', why: "The same fast first pass, drawn as a 2×2, for a team that wants to see and agree on the trade-offs together." },
      { slug: 'kano', why: "Classifies where ICE ranks. Run it alongside when you need to know whether an idea is a Must-have or a Delighter." },
    ] },

  // ---- Design ----
  { slug: 'circles', name: 'CIRCLES Method', category: 'design', file: 'CIRCLES-Method.html',
    description: 'Seven spoken steps that move from the customer and their needs to a summarized recommendation.',
    question: 'How do I answer a product design interview question?',
    origin: 'Lewis C. Lin, Decode and Conquer, 2013',
    aliases: ['circles', 'product sense', 'design interview', 'product design interview', 'product sense interview', 'improve a product', 'design a product', 'pm interview', 'lewis lin'],
    related: [
      { slug: 'star', why: "For behavioral questions such as ‘Tell me about a time when’, which call for a story about your own work instead of a design." },
      { slug: 'design-thinking', why: "A similar path from users to solutions, run with real users over days or weeks. Go there when you need evidence." },
      { slug: 'rice', why: "If you already have a feature list and usage data, rank it with RICE. CIRCLES doesn’t score a backlog." },
      { slug: 'pyramid', why: "Case questions such as ‘Should we enter this market?’ want the answer first, which suits the pyramid better than seven steps." },
    ] },
  { slug: 'jtbd', name: 'Jobs to Be Done', category: 'design', file: 'JTBD-Framework.html',
    description: 'Ask people what they switched from and why, to find the progress they hire a product to make.',
    question: 'What progress is the customer really trying to make?',
    origin: 'Clayton Christensen and Tony Ulwick',
    aliases: ['jtbd', 'jobs theory', 'job stories', 'switch interview', 'customer interviews', 'hire and fire', 'milkshake', 'outcome driven innovation', 'user needs'],
    related: [
      { slug: 'design-thinking', why: "JTBD is one lens for its Empathize research. Once you know the job, design thinking frames, prototypes and tests solutions for it." },
      { slug: 'kano', why: "Sorts the features that serve a job into Must-haves, Performance features and Delighters, which is easier once the job is known." },
      { slug: 'rice', why: "The job decides what is worth scoring; RICE decides the order to build in." },
      { slug: 'circles', why: "In a product design interview, frame the job first and let CIRCLES structure the rest of your answer." },
    ] },
  { slug: 'user-story-mapping', name: 'User Story Mapping', category: 'design', file: 'User-Story-Mapping.html',
    description: 'Journey steps run left to right, stories hang beneath them, and lines across the map cut the releases.',
    question: 'What is the smallest release that works end to end?',
    origin: 'Jeff Patton, User Story Mapping, 2014',
    aliases: ['story map', 'user stories', 'user journey', 'backlog', 'mvp', 'release planning', 'release slices', 'walking skeleton', 'jeff patton'],
    related: [
      { slug: 'jtbd', why: "Start there when you’re unsure what progress the user wants. Once the job is clear, the map lays out the journey that gets it done." },
      { slug: 'design-thinking', why: "Use it to understand and frame the problem. When the team has ideas worth building, the story map plans what ships first." },
      { slug: 'rice', why: "Score the stories in the body to order each column, and leave the backbone in journey order." },
      { slug: 'kano', why: "It can order the stories under each step, but Release 1 is still the thinnest end-to-end journey, not every Must-have." },
    ] },
  { slug: 'design-thinking', name: 'Design Thinking', category: 'design', file: 'Design-Thinking.html',
    description: 'Loop through five modes, from Empathize to Test, with real users and cheap prototypes.',
    question: 'How do we solve a problem we do not fully understand yet?',
    origin: 'IDEO and the Stanford d.school',
    aliases: ['empathize define ideate prototype test', 'double diamond', 'human centered design', 'user research', 'ideation', 'prototyping', 'brainstorming', 'ideo', 'd.school'],
    related: [
      { slug: 'jtbd', why: "One lens for Empathize research, though empathy covers more than jobs. Start there when you first need to know what progress people want." },
      { slug: 'user-story-mapping', why: "The next step once a prototype holds up in testing: plan its release in slices that each cover the whole user journey." },
      { slug: 'circles', why: "A similar path, developed separately. Use it for a 20-minute interview answer with no real users, and design thinking for real research." },
      { slug: 'dual-track', why: "Gives discovery a permanent place in the team’s week, run alongside delivery by the same team instead of as a phase before building." },
    ] },

  // ---- Strategy ----
  { slug: 'porters-5-forces', name: "Porter’s Five Forces", category: 'strategy', file: 'Porters-5-Forces.html',
    description: 'Weigh rivals, new entrants, substitutes, buyers and suppliers; the stronger they are, the thinner everyone’s returns.',
    question: 'How attractive is this industry, and where does the pressure come from?',
    origin: 'Michael Porter, Harvard Business Review, 1979',
    aliases: ['five forces', '5 forces', 'porter', 'competitive analysis', 'industry analysis', 'market analysis', 'competitors', 'bargaining power', 'threat of substitutes', 'new entrants'],
    related: [
      { slug: 'blue-ocean', why: "The next step when the forces show a crowded red ocean. It looks for space where they’re weaker, and your substitutes point to its noncustomers." },
      { slug: 'playing-to-win', why: "Turns the analysis into choices: the forces tell you which markets are attractive enough to choose as where to play." },
      { slug: 'jtbd', why: "From the user’s side, a substitute is anything hired for the same job. The Five Forces sees substitutes at the level of the market." },
      { slug: 'wardley-mapping', why: "Shows how the parts of your value chain evolve over time, where the Five Forces is a snapshot of industry structure." },
    ] },
  { slug: 'blue-ocean', name: 'Blue Ocean Strategy', category: 'strategy', file: 'Blue-Ocean-Strategy.html',
    description: 'Compare offerings on a strategy canvas, then pick the factors to eliminate, reduce, raise and create.',
    question: 'How do we stop competing head to head?',
    origin: 'W. Chan Kim and Renée Mauborgne, 2005',
    aliases: ['errc', 'strategy canvas', 'eliminate reduce raise create', 'four actions', 'value innovation', 'red ocean', 'uncontested market', 'noncustomers', 'differentiation'],
    related: [
      { slug: 'porters-5-forces', why: "Run it first. It tells you whether you’re in a red ocean, and its substitutes lead you to the noncustomers Blue Ocean looks for." },
      { slug: 'playing-to-win', why: "Next step: turn the move the canvas suggests into concrete choices about where to play and how to win." },
      { slug: 'jtbd', why: "Takes you from market to user. Once you’ve found the space, it uncovers the job noncustomers need done." },
      { slug: 'kano', why: "Factors in the Create column often behave like Delighters: buyers don’t expect them, so they add satisfaction and their absence draws no complaints." },
    ] },
  { slug: 'playing-to-win', name: 'Playing to Win', category: 'strategy', file: 'Playing-to-Win.html',
    description: 'Five linked choices that make up a strategy.',
    question: 'Where will we play, and how will we win there?',
    origin: 'A.G. Lafley and Roger Martin, 2013',
    aliases: ['strategy cascade', 'where to play how to win', 'winning aspiration', 'strategy choices', 'product strategy', 'lafley martin', 'roger martin'],
    related: [
      { slug: 'porters-5-forces', why: "Usually comes first. Its read of rivals, substitutes and buyer power feeds the where-to-play and how-to-win choices." },
      { slug: 'blue-ocean', why: "Finds uncontested space worth pursuing; the five choices then turn that opportunity into a strategy." },
      { slug: 'wardley-mapping', why: "Shows how the components behind your capabilities will evolve, so you can see which to build and when the choices need to change." },
      { slug: 'okrs', why: "Once the choices are made, OKRs carry the management systems choice into quarterly objectives and key results." },
    ] },
  { slug: 'wardley-mapping', name: 'Wardley Mapping', category: 'strategy', file: 'Wardley-Mapping.html',
    description: 'Place each component by how visible it is to the user and how evolved it is, from genesis to commodity.',
    question: 'Where is each part of our value chain heading?',
    origin: 'Simon Wardley, 2005',
    aliases: ['wardley map', 'value chain', 'evolution', 'genesis to commodity', 'build vs buy', 'build or buy', 'make or buy', 'outsource'],
    related: [
      { slug: 'porters-5-forces', why: "Sizes up the pressure on an industry today. If you haven’t assessed the market yet, run it before you map." },
      { slug: 'playing-to-win', why: "Decides where to play and how to win. The map then shows which capabilities differentiate enough to build and which to buy or outsource." },
      { slug: 'blue-ocean', why: "Changes the buyer-facing factors you compete on. The map works on the supply side: what to build for that offer and what to adopt." },
      { slug: 'jtbd', why: "Every map starts from a user need at the top, and a job is a good way to find and state that need." },
    ] },

  // ---- Growth ----
  { slug: 'aarrr', name: 'AARRR Pirate Metrics', category: 'growth', file: 'AARRR-Pirate-Metrics.html',
    description: 'Give each lifecycle stage, from Acquisition to Revenue, one metric, and look for the biggest drop.',
    question: 'Where in the funnel are we losing people?',
    origin: 'Dave McClure, 2007',
    aliases: ['pirate metrics', 'funnel', 'funnel metrics', 'acquisition activation retention revenue referral', 'conversion', 'drop off', 'churn', 'dave mcclure'],
    related: [
      { slug: 'north-star', why: "Narrows the view to one measure of customer value. The funnel then shows which stages feed it." },
      { slug: 'growth-loops', why: "Turn the line into a circle. A loop feeds outputs such as referred users or shared clips back in as input, so growth can compound." },
      { slug: 'rice', why: "Once the funnel shows which stage leaks, RICE ranks the features that could fix it." },
      { slug: 'okrs', why: "Make a stage metric a key result, such as D30 retention from 9% to 11%, under a qualitative Objective like making practice a habit." },
    ] },
  { slug: 'growth-loops', name: 'Growth Loops', category: 'growth', file: 'Growth-Loops.html',
    description: 'Trace how one user’s action produces an output, such as a shared clip, that brings in new users.',
    question: 'How does each new user bring in the next one?',
    origin: 'Reforge: Brian Balfour, Casey Winters, Kevin Kwok and Andrew Chen, 2018',
    aliases: ['viral loop', 'viral growth', 'referral loop', 'invite loop', 'word of mouth', 'flywheel', 'compounding growth', 'reforge'],
    related: [
      { slug: 'aarrr', why: "Draws growth as a line. Use it first to find where growth is stuck; the loop shows how referral feeds back into acquisition." },
      { slug: 'north-star', why: "Gives the loop a focus. A good North Star Metric often sits inside your strongest loop, at the step where users get value." },
      { slug: 'input-output', why: "Turn the loop into levers: inputs show which step to work on, and outputs show whether the whole loop is speeding up." },
    ] },
  { slug: 'north-star', name: 'North Star Framework', category: 'growth', file: 'North-Star-Framework.html',
    description: 'One metric of customer value, broken into three to five inputs that teams can move.',
    question: 'Which single metric captures the value customers get?',
    origin: 'Amplitude’s North Star Playbook',
    aliases: ['north star metric', 'nsm', 'one metric that matters', 'omtm', 'key metric', 'success metric', 'amplitude'],
    related: [
      { slug: 'aarrr', why: "Shows which funnel stage leaks users. Use it to find where growth is stuck; the North Star keeps every team aimed at customer value." },
      { slug: 'input-output', why: "The method for running a North Star Metric: break it into controllable inputs, pair gameable ones with counter-metrics and review them weekly." },
      { slug: 'okrs', why: "Put it in quarterly goals. The NSM or one of its inputs becomes a key result, such as Weekly Active Learners from 40,000 to 50,000." },
      { slug: 'growth-loops', why: "A good North Star Metric sits inside your strongest loop, so each turn of the loop moves it." },
    ] },
  { slug: 'input-output', name: 'Input and Output Metrics', category: 'growth', file: 'Input-Output-Metrics.html',
    description: 'Break each result into customer-facing inputs a team controls, with a counter-metric on any input that can be gamed.',
    question: 'Which levers can the team pull to move the results?',
    origin: 'Amazon’s controllable input metrics, as described in Working Backwards (2021)',
    aliases: ['leading lagging', 'leading indicators', 'controllable inputs', 'metric tree', 'driver tree', 'kpi tree', 'counter metrics', 'guardrail metrics', 'working backwards'],
    related: [
      { slug: 'north-star', why: "Start there if you haven’t chosen your output yet. It picks the one metric of customer value your inputs should move." },
      { slug: 'okrs', why: "The objective stays qualitative, the North Star Metric or an input becomes a key result, and counter-metrics become guardrails." },
      { slug: 'aarrr', why: "Use it first to find the leaking funnel stage, then give that stage an input metric and a counter-metric." },
      { slug: 'growth-loops', why: "Each step of a loop is a conversion you can treat as its own input metric and improve one at a time." },
    ] },

  // ---- Execution ----
  { slug: 'agile-scrum', name: 'Agile and Scrum', category: 'execution', file: 'Agile-Scrum.html',
    description: 'A small team ships a usable Increment every Sprint and inspects its work at fixed events.',
    question: 'How do we deliver in short increments we can inspect?',
    origin: 'Ken Schwaber and Jeff Sutherland, The Scrum Guide',
    aliases: ['scrum', 'sprint', 'sprint planning', 'standup', 'daily scrum', 'retrospective', 'product owner', 'scrum master', 'backlog refinement', 'agile'],
    related: [
      { slug: 'shape-up', why: "Instead of Sprints over a backlog, work is shaped in advance, bet on a six-week cycle and cut in scope to fit." },
      { slug: 'kanban', why: "Pulls new work whenever a WIP limit leaves room, instead of planning in Sprints. A Scrum team can also add its flow measures and keep every event." },
      { slug: 'okrs', why: "They set the quarter’s goals. Sprint Goals are how a Scrum team works toward a key result two weeks at a time." },
      { slug: 'rice', why: "Helps the Product Owner order the Product Backlog, so each Sprint pulls in the items worth most for the effort." },
    ] },
  { slug: 'kanban', name: 'Kanban', category: 'execution', file: 'Kanban-Method.html',
    description: 'Make the workflow visible, limit work in progress and manage the flow of items from start to finish.',
    question: 'How do we keep work flowing when it never stops arriving?',
    origin: 'David J. Anderson, 2010, adapting the Toyota Production System',
    aliases: ['kanban board', 'kanban method', 'kanban guide', 'wip limit', 'work in progress', 'flow metrics', 'cycle time', 'lead time', 'throughput', 'work item age', 'littles law', 'service level expectation', 'cumulative flow diagram', 'support work', 'maintenance'],
    related: [
      { slug: 'agile-scrum', why: "Scrum plans in fixed Sprints; Kanban pulls new work whenever a slot frees up. A Scrum team can also add Kanban’s flow measures and keep its events." },
      { slug: 'shape-up', why: "Shape Up bets on six-week cycles of shaped work; Kanban suits work that arrives continuously and cannot wait for a cycle." },
      { slug: 'okrs', why: "OKRs set the outcome for the quarter; a Kanban board shows how the work toward it is flowing day to day." },
    ] },
  { slug: 'shape-up', name: 'Shape Up', category: 'execution', file: 'Shape-Up.html',
    description: 'Shaped pitches are bet on six-week cycles, and the team cuts scope to ship on time.',
    question: 'How do we ship meaningful work in fixed cycles?',
    origin: 'Ryan Singer, Basecamp, 2019',
    aliases: ['basecamp', '37signals', 'appetite', 'pitch', 'betting table', 'six week cycles', 'cooldown', 'fixed time variable scope', 'hill chart'],
    related: [
      { slug: 'agile-scrum', why: "The main alternative: short Sprints toward a Sprint Goal from a Product Backlog, where Shape Up has no backlog. Teams usually pick one." },
      { slug: 'dual-track', why: "Runs discovery continuously across the whole team. Shaping is discovery too, but a few senior people do it alongside the cycle." },
      { slug: 'user-story-mapping', why: "Slicing the user’s journey into releases can help a shaper see which slice of a problem fits the appetite." },
      { slug: 'kanban', why: "Suits work that arrives continuously and cannot wait for the next cycle: items flow through a board as capacity frees up, with no bets and no cooldown." },
    ] },
  { slug: 'dual-track', name: 'Dual-Track Agile', category: 'execution', file: 'Dual-Track-Agile.html',
    description: 'One team tests ideas cheaply every week while it builds what earlier tests have de-risked.',
    question: 'How do we discover and deliver at the same time?',
    origin: 'Desirée Sy, 2007; popularized by Jeff Patton and Marty Cagan',
    aliases: ['dual track', 'continuous discovery', 'product discovery', 'discovery delivery', 'discovery track', 'marty cagan'],
    related: [
      { slug: 'agile-scrum', why: "Can run the delivery track. Keep its Sprints and events; the same team adds continuous discovery alongside them." },
      { slug: 'shape-up', why: "Its shaping resembles discovery but is done by a small senior group. Continuous discovery can run beside its cycles as well as Scrum’s." },
      { slug: 'design-thinking', why: "Supplies many of the methods the discovery track runs on, from empathy interviews to prototypes and tests." },
      { slug: 'jtbd', why: "Use its interviews in discovery to learn what motivates users before you test a solution." },
    ] },
  { slug: 'okrs', name: 'OKRs', category: 'execution', file: 'OKRs.html',
    description: 'A qualitative objective with two to five measurable key results, set for a quarter and graded at the end.',
    question: 'How do we align teams on outcomes instead of tasks?',
    origin: 'Andy Grove at Intel, popularized by John Doerr',
    aliases: ['objectives and key results', 'goals', 'goal setting', 'quarterly goals', 'key results', 'measure what matters', 'john doerr', 'kpi'],
    related: [
      { slug: 'north-star', why: "Choose it first. The NSM or one of its inputs becomes a key result under a qualitative objective, never the objective itself." },
      { slug: 'input-output', why: "Make inputs your key results, since a team can move them within a quarter, and pair each with a counter-metric to catch damage elsewhere." },
      { slug: 'agile-scrum', why: "Two-week Sprints carry out the work toward this quarter’s key results." },
      { slug: 'rice', why: "With the quarter’s outcomes set, rank the backlog items that serve a current key result." },
    ] },

  // ---- Communication ----
  { slug: 'star', name: 'STAR Method', category: 'communication', file: 'STAR-Method.html',
    description: 'Structure behavioral answers as situation, task, action, result.',
    question: 'How do I tell a clear story in a behavioral interview?',
    origin: 'Commonly credited to Development Dimensions International (DDI)',
    aliases: ['behavioral interview', 'situation task action result', 'tell me about a time', 'interview stories', 'story bank', 'competency interview', 'leadership principles'],
    related: [
      { slug: 'pyramid', why: "For listeners who want the answer first, in case interviews and stakeholder updates, where a story order would bury the conclusion." },
      { slug: 'circles', why: "The counterpart for product design questions. STAR tells what you did, CIRCLES what you would build, and many PM loops ask both." },
      { slug: 'narrative-arc', why: "A similar story order that builds tension to persuade a skeptical audience. Its beats don’t map one to one onto STAR’s letters." },
    ] },
  { slug: 'pyramid', name: 'Pyramid Principle', category: 'communication', file: 'Pyramid-Principle.html',
    description: 'Put the governing thought on top, a few grouped reasons below it and the evidence under each.',
    question: 'How do I lead with the answer and still make the case?',
    origin: 'Barbara Minto, McKinsey, 1970s',
    aliases: ['minto', 'scqa', 'situation complication question answer', 'answer first', 'bottom line', 'top down communication', 'structured communication', 'mece', 'mckinsey'],
    related: [
      { slug: 'star', why: "Tells the story of what you did, for behavioral questions. Use the pyramid when the reader wants your conclusion instead." },
      { slug: 'narrative-arc', why: "Runs the other way, building tension before the answer. Reach for it only when a skeptical audience must be persuaded first." },
      { slug: 'exec-summary', why: "The pyramid as a document: the recommendation is the answer, the sections are the grouped reasons, and Context compresses Situation and Complication." },
      { slug: 'circles', why: "Use it for product design questions. Keep the pyramid for case answers, where you lead with the recommendation and group the reasons beneath it." },
    ] },
  { slug: 'narrative-arc', name: 'Narrative Arc', category: 'communication', file: 'Narrative-Arc.html',
    description: 'Five beats, from status quo to new reality, that build tension before the answer arrives.',
    question: 'How do I turn a product update into a story people remember?',
    origin: 'Gustav Freytag’s dramatic structure and Nancy Duarte’s Resonate, adapted for product work',
    aliases: ['storytelling', 'pitch', 'pitch deck', 'presentation', 'story structure', 'keynote', 'nancy duarte', 'resonate'],
    related: [
      { slug: 'pyramid', why: "Answer first, for an audience that wants the conclusion now. A small pyramid can also carry the evidence inside your Resolution." },
      { slug: 'star', why: "Tells a past story in a similar order, for a behavioral interview question about something you did." },
      { slug: 'exec-summary', why: "Recommendation first, and written down. Send one when leadership will read the case instead of hearing a talk." },
    ] },
  { slug: 'exec-summary', name: 'Executive Summary', category: 'communication', file: 'Executive-Summary.html',
    description: 'Open with the recommendation, then give only the context, data, options, risks and request the decision needs.',
    question: 'How do I get a decision from leadership on one page?',
    origin: 'Business-writing practice, including BLUF (bottom line up front)',
    aliases: ['bluf', 'one pager', 'memo', 'decision memo', 'exec update', 'executive update', 'stakeholder update', 'brief'],
    related: [
      { slug: 'pyramid', why: "The structure underneath, with the recommendation as the governing thought. For a short update with no options or ask, the pyramid alone is enough." },
      { slug: 'narrative-arc', why: "When a room has to be persuaded first, tell the story in the meeting, then send the summary as the written record." },
      { slug: 'star', why: "Built for behavioral interview questions about your past work. A decision from leadership calls for a summary instead." },
    ] },
];

export const comparisonGuides = [
  { slug: 'compare-prioritization', category: 'prioritization', file: 'Prioritization-Comparison-Guide.html',
    name: 'Choosing a prioritization framework', description: 'Pick by how long the list is and how much usage data you have; Kano answers a different question.' },
  { slug: 'compare-design', category: 'design', file: 'Design-Comparison-Guide.html',
    name: 'Choosing a design framework', description: 'An interview prompt, a fuzzy problem, an unknown job and a release plan each call for a different method.' },
  { slug: 'compare-strategy', category: 'strategy', file: 'Strategy-Comparison-Guide.html',
    name: 'Choosing a strategy framework', description: 'Depends on whether you’re sizing up a market, escaping a crowded one, committing to choices or deciding what to build or buy.' },
  { slug: 'compare-growth', category: 'growth', file: 'Growth-Comparison-Guide.html',
    name: 'Choosing a growth framework', description: 'Which to use for a leaking funnel, a missing target, a stuck metric or growth that won’t compound.' },
  { slug: 'compare-execution', category: 'execution', file: 'Execution-Comparison-Guide.html',
    name: 'Choosing an execution framework', description: 'Scrum, Kanban and Shape Up are rival ways to run delivery. Dual-track agile and OKRs sit on top of any of them.' },
  { slug: 'compare-communication', category: 'communication', file: 'Communication-Comparison-Guide.html',
    name: 'Choosing a communication framework', description: 'Who’s listening decides it: an interviewer, a reader who wants the answer, a skeptical room or leadership.' },
];

/** Starting points by situation, for the home page. */
export const situations = [
  { label: 'Preparing for a PM interview', slugs: ['circles', 'star', 'pyramid'] },
  { label: 'Sorting through too many roadmap ideas', slugs: ['rice', 'value-effort', 'ice'] },
  { label: 'Setting goals for next quarter', slugs: ['okrs', 'north-star', 'input-output'] },
  { label: 'Finding out what users need', slugs: ['jtbd', 'design-thinking', 'kano'] },
  { label: 'Weighing a big bet that is hard to undo', slugs: ['playing-to-win', 'porters-5-forces', 'wardley-mapping'] },
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
