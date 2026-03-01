/**
 * Framework metadata — the single source of truth for all 24 frameworks + 6 comparison guides.
 */

export const categories = [
  {
    id: 'prioritization',
    name: 'Prioritization',
    description: 'Decide what to build next — and what to skip.',
    when: 'When you have more ideas than resources',
    color: 'var(--cat-prioritization)',
    colorLight: 'var(--cat-prioritization-light)',
    gradient: 'var(--cat-prioritization-gradient)',
    emoji: '🎯',
  },
  {
    id: 'design',
    name: 'Design',
    description: 'Understand users, shape solutions, map journeys.',
    when: 'When you need to discover and define the right product',
    color: 'var(--cat-design)',
    colorLight: 'var(--cat-design-light)',
    gradient: 'var(--cat-design-gradient)',
    emoji: '🎨',
  },
  {
    id: 'strategy',
    name: 'Strategy',
    description: 'See the competitive landscape and chart your path.',
    when: 'When you need to make high-level strategic decisions',
    color: 'var(--cat-strategy)',
    colorLight: 'var(--cat-strategy-light)',
    gradient: 'var(--cat-strategy-gradient)',
    emoji: '♟️',
  },
  {
    id: 'growth',
    name: 'Growth',
    description: 'Measure what matters and find your growth engine.',
    when: 'When you need to grow users, revenue, or engagement',
    color: 'var(--cat-growth)',
    colorLight: 'var(--cat-growth-light)',
    gradient: 'var(--cat-growth-gradient)',
    emoji: '🚀',
  },
  {
    id: 'execution',
    name: 'Execution',
    description: 'Ship work consistently and manage delivery.',
    when: 'When you need to organize and deliver product work',
    color: 'var(--cat-execution)',
    colorLight: 'var(--cat-execution-light)',
    gradient: 'var(--cat-execution-gradient)',
    emoji: '⚡',
  },
  {
    id: 'communication',
    name: 'Communication',
    description: 'Present ideas, tell stories, structure arguments.',
    when: 'When you need to influence stakeholders or ace an interview',
    color: 'var(--cat-communication)',
    colorLight: 'var(--cat-communication-light)',
    gradient: 'var(--cat-communication-gradient)',
    emoji: '💬',
  },
];

export const frameworks = [
  // ---- PRIORITIZATION ----
  { id: 'rice', slug: 'rice', name: 'RICE Score', emoji: '🍚', category: 'prioritization', sourceFile: 'RICE-Framework-Guide.html', description: 'Score features by Reach, Impact, Confidence, and Effort' },
  { id: 'value-effort', slug: 'value-effort', name: 'Value vs Effort', emoji: '⚖️', category: 'prioritization', sourceFile: 'Value-vs-Effort-Matrix.html', description: '2×2 matrix plotting value against implementation effort' },
  { id: 'kano', slug: 'kano', name: 'Kano Model', emoji: '📊', category: 'prioritization', sourceFile: 'Kano-Model.html', description: 'Categorize features by customer satisfaction impact' },
  { id: 'ice', slug: 'ice', name: 'ICE Score', emoji: '🧊', category: 'prioritization', sourceFile: 'ICE-Score.html', description: 'Rapid prioritization via Impact, Confidence, Ease' },

  // ---- DESIGN ----
  { id: 'circles', slug: 'circles', name: 'CIRCLES Method', emoji: '⭕', category: 'design', sourceFile: 'CIRCLES-Method.html', description: 'Structured approach to product design questions' },
  { id: 'jtbd', slug: 'jtbd', name: 'Jobs to Be Done', emoji: '🔨', category: 'design', sourceFile: 'JTBD-Framework.html', description: 'Understand the jobs customers hire your product to do' },
  { id: 'user-story-mapping', slug: 'user-story-mapping', name: 'User Story Mapping', emoji: '🗺️', category: 'design', sourceFile: 'User-Story-Mapping.html', description: 'Map user journeys to plan releases incrementally' },
  { id: 'design-thinking', slug: 'design-thinking', name: 'Design Thinking', emoji: '💡', category: 'design', sourceFile: 'Design-Thinking.html', description: 'Human-centered approach to innovation and problem-solving' },

  // ---- STRATEGY ----
  { id: 'porters-5-forces', slug: 'porters-5-forces', name: "Porter's 5 Forces", emoji: '🏛️', category: 'strategy', sourceFile: 'Porters-5-Forces.html', description: 'Analyze competitive forces shaping your industry' },
  { id: 'blue-ocean', slug: 'blue-ocean', name: 'Blue Ocean Strategy', emoji: '🌊', category: 'strategy', sourceFile: 'Blue-Ocean-Strategy.html', description: 'Create uncontested market space with value innovation' },
  { id: 'playing-to-win', slug: 'playing-to-win', name: 'Playing to Win', emoji: '🏆', category: 'strategy', sourceFile: 'Playing-to-Win.html', description: 'Five cascading choices for winning strategy' },
  { id: 'wardley-mapping', slug: 'wardley-mapping', name: 'Wardley Mapping', emoji: '🧭', category: 'strategy', sourceFile: 'Wardley-Mapping.html', description: 'Map your value chain and its evolution over time' },

  // ---- GROWTH ----
  { id: 'aarrr', slug: 'aarrr', name: 'AARRR Pirate Metrics', emoji: '🏴‍☠️', category: 'growth', sourceFile: 'AARRR-Pirate-Metrics.html', description: 'Track the funnel: Acquisition → Activation → Retention → Revenue → Referral' },
  { id: 'growth-loops', slug: 'growth-loops', name: 'Growth Loops', emoji: '🔁', category: 'growth', sourceFile: 'Growth-Loops.html', description: 'Design self-reinforcing loops that compound growth' },
  { id: 'north-star', slug: 'north-star', name: 'North Star Framework', emoji: '⭐', category: 'growth', sourceFile: 'North-Star-Framework.html', description: 'Identify the single metric that drives your business' },
  { id: 'input-output', slug: 'input-output', name: 'Input/Output Metrics', emoji: '📈', category: 'growth', sourceFile: 'Input-Output-Metrics.html', description: 'Connect team inputs to business outputs' },

  // ---- EXECUTION ----
  { id: 'agile-scrum', slug: 'agile-scrum', name: 'Agile / Scrum', emoji: '🔄', category: 'execution', sourceFile: 'Agile-Scrum.html', description: 'Iterative delivery with sprints, standups, and retrospectives' },
  { id: 'shape-up', slug: 'shape-up', name: 'Shape Up', emoji: '🔺', category: 'execution', sourceFile: 'Shape-Up.html', description: 'Six-week cycles with appetite-based shaping' },
  { id: 'dual-track', slug: 'dual-track', name: 'Dual Track Agile', emoji: '🔀', category: 'execution', sourceFile: 'Dual-Track-Agile.html', description: 'Parallel discovery and delivery tracks' },
  { id: 'okrs', slug: 'okrs', name: 'OKRs', emoji: '🎯', category: 'execution', sourceFile: 'OKRs.html', description: 'Objectives and Key Results for aligned goal-setting' },

  // ---- COMMUNICATION ----
  { id: 'star', slug: 'star', name: 'STAR Method', emoji: '⭐', category: 'communication', sourceFile: 'STAR-Method.html', description: 'Structure behavioral interview answers: Situation, Task, Action, Result' },
  { id: 'pyramid', slug: 'pyramid', name: 'Pyramid Principle', emoji: '🔺', category: 'communication', sourceFile: 'Pyramid-Principle.html', description: 'Lead with the answer, support with grouped arguments' },
  { id: 'narrative-arc', slug: 'narrative-arc', name: 'Narrative Arc', emoji: '📖', category: 'communication', sourceFile: 'Narrative-Arc.html', description: 'Tell compelling product stories with tension and resolution' },
  { id: 'exec-summary', slug: 'exec-summary', name: 'Executive Summary', emoji: '📋', category: 'communication', sourceFile: 'Executive-Summary.html', description: 'Concise, decision-ready summaries for leadership' },
];

export const comparisonGuides = [
  { id: 'prioritization-comparison', slug: 'compare-prioritization', name: 'Prioritization Comparison', category: 'prioritization', sourceFile: 'Prioritization-Comparison-Guide.html', emoji: '⚖️' },
  { id: 'design-comparison', slug: 'compare-design', name: 'Design Comparison', category: 'design', sourceFile: 'Design-Comparison-Guide.html', emoji: '🎨' },
  { id: 'strategy-comparison', slug: 'compare-strategy', name: 'Strategy Comparison', category: 'strategy', sourceFile: 'Strategy-Comparison-Guide.html', emoji: '♟️' },
  { id: 'growth-comparison', slug: 'compare-growth', name: 'Growth Comparison', category: 'growth', sourceFile: 'Growth-Comparison-Guide.html', emoji: '📊' },
  { id: 'execution-comparison', slug: 'compare-execution', name: 'Execution Comparison', category: 'execution', sourceFile: 'Execution-Comparison-Guide.html', emoji: '⚡' },
  { id: 'communication-comparison', slug: 'compare-communication', name: 'Communication Comparison', category: 'communication', sourceFile: 'Communication-Comparison-Guide.html', emoji: '💬' },
];

/** Get all frameworks in a category */
export function getFrameworksByCategory(categoryId) {
  return frameworks.filter(fw => fw.category === categoryId);
}

/** Get a framework by slug */
export function getFramework(slug) {
  return frameworks.find(fw => fw.slug === slug);
}

/** Get a category by id */
export function getCategory(id) {
  return categories.find(cat => cat.id === id);
}

/** Get comparison guide for a category */
export function getComparisonGuide(categoryId) {
  return comparisonGuides.find(cg => cg.category === categoryId);
}
