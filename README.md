# LeanOS Core

The validation layer of LeanOS Pro. Helps founders decide whether to build - before they've committed resources to building.

---

## The Boundary Principle

The lifecycle gate is the **decision to build**.

Canvas completion = validation done.

- **Core** — everything that *produces* the canvas. Validates the idea, sizes the market, defines segments, scores problems, maps competition, drafts UVP, models economics, extracts assumptions, selects channels, plans GTM.
- **Pro** — everything that *executes against* the canvas. Runs campaigns, converts leads, onboards customers, builds product, deploys infrastructure, monitors health.

If the output answers "should we build this, and how?" → Core.
If the output does the building → Pro.

---

## What Core Does

Core runs three sequential phases:

### Phase 1: Research
Populates the canvas with evidence. Market size, customer segments, problem scores, competitive landscape. Uses external sources — researcher handles the intelligence gathering.

### Phase 2: Strategy
Derives the 16-section canvas from research. Four gated phases (Setup → Discovery → Definition → Launch). Strategist executes. Human gates at mode selection and UVP/unfair advantage — both are founder decisions, not synthesizable from data.

### Phase 3: Validation
Each canvas section runs through a validator before the phase advances. Segments, UVP, solution, economics — all scored. Failures are flagged with specific items, not passed forward.

The value function is derived at the end of canvas completion. Hard constraints, soft constraints, and tradeoff preferences (last one requires founder input). This becomes the decision filter for every subsequent orchestrator cycle in Pro.

---

## See It Running

[Watch the demo](https://youtu.be/CPCu2l_9GXM) - 5 minutes. One command. Regulation in, business model out.

---

## Agents

Core ships with three agents. Human directs them via CLI — there is no orchestrator layer in Core. The orchestrator is a Pro component.

| Agent | Role | Canvas Sections Written |
|-------|------|------------------------|
| `strategist` | Builds and validates the 16-section canvas through 4 gated phases. Runs `str-*` skills per phase. Derives `strategy/values.md` via VALUE mode. | `strategy/canvas/00–15`, `strategy/values.md` |
| `researcher` | External intelligence. Market research, competitive analysis, source extraction, playbook creation. Feeds strategist. | `execution/active/{thread}/output/` |
| `planner` | Translates completed canvas into active goals. Validates that the canvas targets are reachable before any execution begins. | `strategy/goals/active/` |

**Not in Core:** orchestrator, narrator, builder, modeler, tester, deployer, reacher, converter, nurturer, observer, reviewer, pruner.

---

## Skills

### Strategy Skills — `str-*` (13 skills)

All 13 are Core. These are the canvas-building procedures. Each maps directly to one or more canvas sections.

| Skill | Phase | Canvas Section |
|-------|-------|---------------|
| `str-sizing-markets` | Discovery | 03.opportunity |
| `str-segmenting-customers` | Discovery | 04.segments |
| `str-scoring-problems` | Discovery | 05.problem |
| `str-analyzing-competition` | Discovery | 06.competitive |
| `str-positioning-value` | Definition | 07.uvp, 08.unfair |
| `str-designing-solutions` | Definition | 09.solution |
| `str-designing-pricing` | Definition | 12.revenue |
| `str-calculating-economics` | Definition | 13.metrics |
| `str-structuring-costs` | Definition | 14.costs |
| `str-extracting-assumptions` | Launch | 10.assumptions |
| `str-selecting-channels` | Launch | 11.channels |
| `str-planning-gtm` | Launch | 15.gtm |
| `str-defining-values` | Post-canvas | strategy/values.md |

**Not Core:** `str-planning-fundraising` (execution), `str-assessing-compliance` (execution due diligence).

### Validation Skills — `crt-validating-*` (5 skills)

Canvas gate validators. Each runs at the end of the relevant canvas phase. A section that fails validation is flagged and does not advance.

| Skill | Validates | Gate |
|-------|-----------|------|
| `crt-validating-segments` | 04.segments | G1 (post-Discovery) |
| `crt-validating-uvp` | 07.uvp | G2 (post-Definition) |
| `crt-validating-solution` | 09.solution | G2 (post-Definition) |
| `crt-validating-economics` | 13.metrics | G2 (post-Definition) |
| `crt-validating-metrics` | 13.metrics (quantitative) | G2 (post-Definition) |

**Not Core:** `crt-validating-design`, `crt-reviewing-canvas`, `crt-auditing-*`, `crt-analyzing-ux` — these validate execution artifacts, not canvas sections.

### Research Skills — `rsh-*` (3 skills)

All 3 are Core. These give the researcher its intelligence-gathering capability.

| Skill | Purpose |
|-------|---------|
| `rsh-researching-market` | Market research calibrated to business mode (BOOTSTRAP/VENTURE/HYBRID) |
| `rsh-extracting-insights` | Processes expert sources — videos, podcasts, articles, books |
| `rsh-creating-playbooks` | Generates actionable playbooks from extracted insights |

### Reasoning Skills — `sys-*` (7 skills)

Core takes the reasoning primitives — the skills that improve the *quality* of decisions before they're made. Meta-system skills (creating agents, creating skills) and execution-coordination skills stay in Pro.

| Skill | Purpose |
|-------|---------|
| `sys-auditing-effectiveness` | Wisdom gate — checks whether the target is the right target before executing |
| `sys-dissolving-problems` | Applies dissolution hierarchy: redesign > solve > resolve > optimize |
| `sys-formulating-mess` | Treats interacting problems as a system, not as isolated gaps |
| `sys-reframing-assumptions` | Breaks conformity loop when default approaches keep failing |
| `sys-rotating-viewpoints` | Examines a problem from every state level before choosing a treatment |
| `sys-managing-goals` | Full goal lifecycle: define from canvas → track → resolve |
| `sys-evaluating-values` | Evaluates decisions against the value function (BLOCK / EXECUTE / EXECUTE+FLAG / ESCALATE) |

**Not Core:** `sys-coordinating-campaigns`, `sys-creating-agents`, `sys-creating-knowledge`, `sys-creating-skills`, `sys-designing-skills`, `sys-evaluating-skills`.

### Learning Skill — `rsn-*` (1 skill)

| Skill | Purpose |
|-------|---------|
| `rsn-learning-outcomes` | Extracts insights and improves performance from experience. Single-loop and double-loop learning. |

---

## What Core Produces

When Core runs to completion, the output is:

```
strategy/
├── canvas/               16 evidence-based section files (00–15)
├── values.md             Value function — hard constraints, soft constraints, tradeoff preferences
└── goals/active/         Active goals derived from canvas targets

execution/queue/          Escalations requiring founder input
```

This package is the input to Pro. Pro's orchestrator reads `strategy/values.md` as its decision filter on every cycle. Pro's narrator derives brand foundations from canvas. Pro's planner tracks goals against canvas targets. Without the canvas, Pro cannot run coherently.

**When your canvas says yes, Pro runs everything from there.**

Pro adds 12 agents and 130+ skills that execute what Core validated — campaigns, sales pipeline, product build, customer success, autonomous orchestration. $499 one-time.

- Landing page: [bellabelgarokova.com/leanos/](https://bellabelgarokova.com/leanos/)
- Direct purchase: [gumroad.com/l/leanos-pro](https://gumroad.com/l/leanos-pro)

---

## What Pro Adds

Pro adds 12 agents and 130+ skills that execute what Core validated. Core produces the canvas. Pro runs against it.

| Capability | Agents | When It Becomes Relevant |
|-----------|--------|--------------------------|
| Autonomous orchestration | orchestrator | After canvas is complete — governs the execution cycle |
| Brand + channel foundations | narrator | After canvas — derives ICP, brand voice, design system, channel profiles |
| Awareness | reacher | After foundations — campaigns, content, sequences |
| Acquisition | converter | After pipeline is defined — prospect, qualify, close |
| Retention | nurturer | After first customer — onboard, monitor health, expand |
| Product build | builder, modeler, tester, deployer | After solution is defined — spec, code, test, deploy |
| State observation | observer | After execution begins — reads reality, computes gaps |
| Pruning | pruner | Ongoing — deprecates stale assets |
| Quality review | reviewer | High-stakes outputs — security, customer-facing, strategic |

---

## Skill Count Summary

| Category | Core | Pro |
|----------|------|-----|
| Strategy (`str-*`) | 13 | 2 |
| Validation (`crt-*`) | 5 | 6 |
| Research (`rsh-*`) | 3 | 0 |
| Reasoning (`sys-*`) | 7 | 6 |
| Learning (`rsn-*`) | 1 | 0 |
| Awareness (`rch-*`) | 0 | 8 |
| Acquisition (`cnv-*`) | 0 | 17 |
| Retention (`nrt-*`) | 0 | 14 |
| Behavioral (`beh-*`) | 0 | 6 |
| Modeling (`mdl-*`) | 0 | 6 |
| Design tokens (`ds-*`) | 0 | 2 |
| Web design system (`dsw-*`) | 0 | 8 |
| Infographic design (`dsi-*`) | 0 | 6 |
| Narrative (`nar-*`) | 0 | 6 |
| Observation (`obs-*`) | 0 | 5 |
| Testing (`tst-*`) | 0 | 5 |
| Deployment (`dpl-*`) | 0 | 3 |
| Engineering (`eng.*`) | 0 | 30+ |
| **Total** | **29** | **130+** |

---

## Installation

```bash
# Clone Core
git clone https://github.com/BellaBe/lean-os my-project-name
rm -rf .git
git init

# Run the canvas builder
claude --agent strategist
```

Core requires Claude Code CLI. The agents use filesystem as communication — no external services, no database, no API keys beyond Claude.

---

## License

Core is MIT. Use it, fork it, build on it.

Pro is commercial. $499 one-time. No subscription.

- [bellabelgarokova.com/leanos/](https://bellabelgarokova.com/leanos/) — landing page with full capability breakdown
- [gumroad.com/l/leanos-pro](https://gumroad.com/l/leanos-pro) — direct purchase
