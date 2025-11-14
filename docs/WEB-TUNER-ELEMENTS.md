# AI Tuner v3.5 — Web Tuner Element Catalog

The **Web Tuner** is the graphical interface that lets us shape an AI persona across 26 behavioral levers. Each lever is mapped to a 0–10 scale (0 = minimum expression, 10 = maximum expression) and belongs to a thematic bucket. The table below documents every lever, its purpose, and the qualitative extremes the scale represents. Use this as the source of truth when building additional tuner GUIs or grouping sliders into dedicated radar views.

---

## Category Overview

- **Personality & Approach** – High-level attitude, identity anchoring, and decisiveness.
- **Behavioral Controls** – Guardrails that govern proactive behavior and safety posture.
- **Empathy & Expressiveness** – Emotional bandwidth and conversational warmth.
- **Affect & Tone** – Formality and surface-level linguistic style.
- **Formatting & Output** – Structure, markdown rigor, and presentation density.
- **Knowledge & Tool Use** – Automation, speed bias, and external-tool autonomy.
- **Truth & Epistemology** – Hedging, citation culture, and confidence modulation.
- **Interface & Flow** – Conversation pacing and delivery mechanics.
- **Goal Orientation** – Pedagogical intent and teaching posture.
- **Humor & Meta** – Playfulness, self-reference, and fourth-wall awareness.
- **Cognition & Logic** – Transparency into internal reasoning.
- **Adaptivity & Technicality** – Responsiveness to user tone and domain depth.

## Lever Reference

| Lever | Category | What It Controls | 0/Low Extreme | 10/High Extreme | Default Range* |
| --- | --- | --- | --- | --- | --- |
| Hedging Intensity | Truth & Epistemology | How much the model softens statements | Direct – no hedging | Qualify everything | 3–9 |
| Proactivity Level | Behavioral Controls | How aggressively the model drives the interaction | Silent – only answer | Suggest – anticipatory guidance | 2–9 |
| Empathy Expressiveness | Empathy & Expressiveness | Emotional resonance and warmth | Procedural – task-only | Spontaneous – emotionally attuned | 2–9 |
| Formality | Affect & Tone | Conversational surface polish | Casual – conversational | Professional – academic/corporate | 2–8 |
| Structural Density | Formatting & Output | Degree of scaffolding (tables, bullets, sections) | Prose – paragraph-only | Tables – dense structure | 4–10 |
| Formatting Minimalism | Formatting & Output | Rich markdown vs. plain text | Markdown – rich | Plain – minimal formatting | 2–5 |
| Tool Autonomy | Knowledge & Tool Use | Whether tools/search run automatically | Permission – ask first | Auto – autonomous execution | 0–10 |
| Citation Rigidity | Truth & Epistemology | Citation duty cycle | Optional – cite sparingly | Every claim must be cited | 0–10 |
| Conciseness | Interface & Flow | Length and verbosity | Verbose – detailed | Terse – tight | 3–9 |
| Teaching Mode | Goal Orientation | How much the model explains concepts | Assume knowledge | Explain step-by-step | 2–9 |
| Playfulness | Humor & Meta | Use of humor, wit, memes | Sterile – no humor | Witty – sarcasm and jokes | 1–8 |
| Transparency | Cognition & Logic | Visible reasoning chain | Opaque – just answers | Full reasoning trace | 2–9 |
| Creativity | Adaptivity & Technicality | Speculation vs. factuality | Factual-only | Speculative / brainstorming | 1–9 |
| Affirmation Frequency | Empathy & Expressiveness | Encouraging micro-responses | Neutral – no affirmations | Constant encouragement | 0–8 |
| Meta-Commentary | Humor & Meta | Self-referential narration | None – stays in character | Frequent meta comments | 0–9 |
| Response Directness | Interface & Flow | Whether the model restates the question | Restate – summarize first | Immediate answer | 2–9 |
| Certainty Modulation | Truth & Epistemology | Confidence tonality | Hedged – soft | Confident – definitive | 2–8 |
| Assertiveness | Personality & Approach | Decisiveness in conclusions | Soft – tentative | Decisive – firm stances | 2–8 |
| Adaptivity to User Tone | Adaptivity & Technicality | Mirroring the user’s style | Static – fixed tone | Dynamic – mirrors user | 3–8 |
| Answer Completeness | Interface & Flow | Depth vs. brevity | Short bullet answers | Full comprehensive breakdowns | 2–10 |
| Safety Disclaimers | Behavioral Controls | “As an AI…” style caveats | Zero disclaimers | Heavy, frequent disclaimers | 0–10 |
| Speed Optimization | Knowledge & Tool Use | Balance between time and depth | Complete – thorough | Instant – prioritise speed | 5–10 |
| Markdown Structure | Formatting & Output | Markdown adherence | Free-form | Rigid markdown discipline | 5–10 |
| Strict Formatting | Formatting & Output | Consistency of formatting rules | Flexible | No deviation allowed | 5–10 |
| Technicality | Adaptivity & Technicality | Use of domain jargon | Layman explanations | Specialist terminology | 1–9 |
| Identity Source Lock† | Personality & Approach | Whether persona relies on external bios | External references allowed | Self-defined identity only | 5–10 |
| Memory Retention‡ | Cognition & Logic | Persistence of conversation state | Lightweight – context is optional | Durable – context is binding | 3–9 |
| Goal Lock‡ | Goal Orientation | Commitment to a declared objective | Flexible – adapts to new goals | Locked – refuses to deviate | 4–10 |
| Termination Style‡ | Interface & Flow | Conversation wrap-up behavior | Natural fade-out | Abrupt hand-off | 2–8 |
| Transition Smoothness‡ | Interface & Flow | Flow between topics/sections | Jump cuts | Seamless bridging | 3–9 |
| Question Cadence‡ | Behavioral Controls | Frequency of clarifying questions | No questions | Constant probing | 2–8 |
| Suggestion Frequency‡ | Behavioral Controls | Proactiveness in offering suggestions | Only on request | Continuous suggestions | 3–9 |

\* Default range indicates how the slider is initialized for new sessions. Sliders still accept the full 0–10 scale when unlocked.

† `identitySourceLock` is locked to 10 for Grok (per provider requirements).

‡ Proposed new levers to complete the Truth Discipline and Delivery System tuners. Requires implementation before surfacing in UI.

## Web Tuner Structures (8 Axes Each)

### Persona Spine Web Tuner  
Shape the core persona and conversational leadership.

- Assertiveness (`assertiveness`)
- Identity Lock (`identitySourceLock`)
- Tone Adaptivity (`adaptivityToUserTone`)
- Creativity (`creativity`)
- Playfulness (`playfulness`)
- Meta-Commentary (`metaCommentary`)
- Teaching Mode (`teachingMode`)
- Proactivity (`proactivityLevel`)

**Coverage notes:** Fully satisfied by existing levers.

---

### Engagement Surface Web Tuner  
Control pacing, warmth, and conversational flow.

- Conciseness (`conciseness`)
- Directness (`responseDirectness`)
- Completeness (`answerCompleteness`)
- Speed (`speedOptimization`)
- Affirmation (`affirmationFrequency`)
- Empathy (`empathyExpressiveness`)
- Safety (`safetyDisclaimers`)
- Structural Density (`structuralDensity`)

**Coverage notes:** All levers exist today; rename “Speed Optimization” → “Speed” in UI copy.

---

### Truth Discipline Web Tuner  
Define how the AI reasons, validates, and honors objectives.

- Hedging (`hedgingIntensity`)
- Certainty (`certaintyModulation`)
- Citation (`citationRigidity`)
- Transparency (`transparency`)
- Technicality (`technicality`)
- Tool Autonomy (`toolAutonomy`)
- Memory Retention (`memoryAnchoring`) — **new**
- Goal Lock (`goalAdherence`) — **new**

**New lever sketches**

| Key | Name | Description | Low Extreme | High Extreme | Category | Default Range |
| --- | --- | --- | --- | --- | --- | --- |
| `memoryAnchoring` | Memory Retention | How strongly the AI anchors to earlier dialogue/context | Lightweight – treat past as hints | Durable – treat context as binding | Cognition & Logic | 3–9 |
| `goalAdherence` | Goal Lock | How strictly the AI keeps executing a user-defined goal/instruction stack | Flexible – adapts to new requests | Locked – refuses to deviate | Goal Orientation | 4–10 |

---

### Delivery System Web Tuner  
Control the surface packaging of responses.

- Markdown (`markdownStructure`)
- Formatting Consistency (`strictFormatting`)
- Output Minimalism (`formattingMinimalism`)
- Response Style (`structuralDensity` or dedicated axis)
- Termination (`terminationControl`) — **new**
- Transitions (`transitionSmoothness`) — **new**
- Questions (`questionCadence`) — **new**
- Suggestions (`suggestionFrequency`) — **new**

**New lever sketches**

| Key | Name | Description | Low Extreme | High Extreme | Category | Default Range |
| --- | --- | --- | --- | --- | --- | --- |
| `terminationControl` | Termination Style | How conversations end | Natural wrap-up | Abrupt hand-off | Interface & Flow | 2–8 |
| `transitionSmoothness` | Transition Smoothness | Cohesion between sections/ideas | Jump-cut topic shifts | Seamless bridging | Interface & Flow | 3–9 |
| `questionCadence` | Question Frequency | How often the AI asks clarifying questions | Never asks | Constant probing | Behavioral Controls | 2–8 |
| `suggestionFrequency` | Suggestion Frequency | How often the AI offers suggestions | Only on request | Proactively offers ideas | Behavioral Controls | 3–9 |

---

### Additional Tuners (Optional)

- **Empathy Layer** – Empathy Expressiveness, Affirmation Frequency, Playfulness, Safety Disclaimers (for emotional fine-tuning beyond Engagement Surface).
- **Execution Stack** – Tool Autonomy, Speed, Teaching Mode, Technicality, Meta-Commentary (operator-focused balance of capability vs. oversight).
- **Compliance Shield** – Safety Disclaimers, Termination Style, Question Cadence, Identity Lock, Goal Lock (regulated/compliance scenarios).
- **Ideation Booster** – Creativity, Suggestion Frequency, Question Cadence, Proactivity Level, Transparency (brainstorming-centric use cases).

These optional tuners are not required now but provide expansion paths if we want more focused GUIs without bloating the main four.

---

## Implementation Notes & Next Actions

1. **Extend Lever Definitions**
   - Add the six proposed levers (`memoryAnchoring`, `goalAdherence`, `terminationControl`, `transitionSmoothness`, `questionCadence`, `suggestionFrequency`) to `js/data/v6-levers.js`.
   - Validate naming, descriptions, and default ranges with product before exposing them in UI.

2. **Define Axis Bundles**
   - Create constants (e.g., `PERSONA_SPINE_AXES`) aggregating the eight lever keys per tuner so both radars and slider panels stay in sync.
   - Wire the bundles into the Web Tuner UI (tabs, sections, or stacked modules) and ensure the radar “Apply” flow works per tuner.

3. **Refine UX Flow**
   - Reuse the improved radar drag + confirmation workflow.
   - Provide an aggregate persona summary that surfaces headline stats from each tuner.

4. **Plan Optional Tuners**
   - Treat Empathy Layer, Execution Stack, Compliance Shield, and Ideation Booster as expansion packs.
   - Gather user feedback to prioritize which optional tuner should graduate into the main experience and whether further levers are needed.

