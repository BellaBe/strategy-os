# Strategy OS

Autonomous business strategy for founders. One agent builds and stress-tests your strategy before you commit to building.

---

## How It Works

You describe a problem space. The system researches, constructs hypotheses, and attacks its own conclusions. What survives is your strategy.

```
Governor -> provides problem space, constraints, values
Strategist -> researches (WebSearch/WebFetch)
           -> constructs hypotheses (compression model)
           -> self-challenges (adversarial protocol)
           -> writes strategy/hypotheses.md
           -> escalates only when it cannot decide
Governor -> responds to escalations, provides ground-truth evidence
```

The output is a hypothesis register — four validated hypotheses plus a solution design — ready to feed the Sell & Grow execution chain.

---

## See It Running

...coming soon

---

## The Hypothesis Register

One file. Three hypotheses. Each earns its confidence.

| Hypothesis | What It Answers |
|-----------|----------------|
| **Problem** | What problem exists, for whom, and how acute? |
| **Segment** | Who has it badly enough to pay? Observable filters, not demographics. |
| **Unit Economics** | Does the business model sustain itself? LTV:CAC, payback, margins. |

Plus a **Solution Design** section (growth architecture, positioning, feature map, MVP scope, growth loops) derived from the three hypotheses.

### Confidence States

Every hypothesis must earn its confidence through evidence:

| State | Meaning |
|-------|---------|
| `UNVALIDATED` | Stated, no qualifying evidence |
| `RESEARCHED` | System did autonomous research (T1/T2 evidence), awaiting ground truth |
| `SUPPORTED` | Governor provided customer conversations or test results that validate |
| `BROKEN` | Evidence contradicts the claim |

### Epistemic Tiers

Every claim carries its tier — no false confidence:

| Tier | What It Means | Example |
|------|--------------|---------|
| **T1** | Derivable from public data | Market size from census + industry reports |
| **T2** | Synthesized hypothesis | "This segment likely has this problem because..." |
| **T3** | Requires ground truth | "Customers will pay $X for this" |

---

## The Strategist

One agent. Three modes. No orchestrator — you invoke it directly.

| Mode | When | What Happens |
|------|------|-------------|
| **BUILD** | First use | Autonomous research, hypothesis construction via compression (enumerate possibilities, eliminate, what survives is the strategy), adversarial destruction pass, complete register |
| **CHALLENGE** | Default | Re-evaluate existing register with fresh research, test evidence quality, run destruction on changed hypotheses, update confidence |
| **REVIEW** | Readiness check | Full challenge pass plus cross-hypothesis consistency, Sell & Grow readiness evaluation |

### What It Does Autonomously

- Market research (TAM/SAM/SOM from public data)
- Competitive mapping (features, pricing, positioning gaps)
- Problem scoring (frequency, severity, breadth, alternatives' inadequacy)
- Hypothesis construction via compression model
- Adversarial self-challenge (assumption extraction, pre-mortem, red-team, constraint inversion)
- Evidence quality assessment and overconfidence detection

### What It Escalates to You

- Mode selection (VENTURE / BOOTSTRAP / HYBRID)
- UVP and unfair advantage approval
- Tradeoff preferences when options have quantified consequences
- Ground-truth gaps that block strategy (load-bearing T3 assumptions)

---

## Strategy Dashboard

A visual command center for the hypothesis register. Parses the markdown and presents six views:

| View | Question It Answers |
|------|-------------------|
| **Readiness** | Am I Sell & Grow ready? What's blocking? |
| **Evidence Quality** | Where is my evidence weak? What's T3 that should be T1? |
| **Risk Map** | Which assumptions will kill the strategy if wrong? |
| **Destruction** | What did the adversarial self-challenge find? |
| **Solution** | What does the solution look like? Features, MVP, growth loops. |
| **Hypothesis Detail** | Full deep-dive on any hypothesis (click through). |

### Run the Dashboard

```bash
cd tools/dashboard
npm install
npx vite
```

The dashboard reads `strategy/hypotheses.md` directly from the project root. No file copying needed.

### Sync Script (Optional)

Pre-generates a JSON file from the register for faster dashboard loading:

```bash
./tools/scripts/sync-register.sh
```

Runs the TypeScript parser against `strategy/hypotheses.md`, writes `tools/dashboard/public/register.json`. The dashboard tries JSON first, falls back to live markdown parsing.

---

## File Structure

```
strategy/
  hypotheses.md              The hypothesis register (source of truth)

execution/
  queue/                     Escalations awaiting governor response

.claude/
  agents/
    strategist.md            The autonomous strategist agent

  skills/
    stg-sizing-markets/      Market opportunity (TAM/SAM/SOM)
    stg-segmenting-customers/ Customer segments with observable filters
    stg-scoring-problems/    Problem validation (frequency/severity/breadth)
    stg-analyzing-competition/ Competitive landscape and red-team input
    stg-designing-pricing/   Value-based pricing methodology
    stg-calculating-economics/ Unit economics (LTV/CAC/payback/margins)
    stg-designing-solutions/ Growth architecture, MVP scope, feature map
    stg-extracting-insights/ Process governor-provided expert sources

tools/
  dashboard/                 Strategy visualization dashboard (React)
  scripts/
    sync-register.sh         Parse markdown register to JSON
```

---

## Quick Start

```bash
# Clone
git clone https://github.com/BellaBe/leanos my-project
cd my-project

# Run the strategist in BUILD mode
claude --agent strategist

# View the dashboard
cd tools/dashboard && npm install && npx vite
```

Requires [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code). The system uses the filesystem for all communication — no external services, no database, no API keys beyond Claude.

---

## Sell & Grow Interface

The register feeds directly into the Sell & Grow execution chain. The chain proceeds when all three hypotheses reach `SUPPORTED`:

| Chain Step | Consumes From Register |
|-----------|----------------------|
| **Strategic Positioning** | Solution Design (positioning subsection), Segment hypothesis (target customer) |
| **Revenue Architecture** | Solution Design (growth architecture, MVP, growth loops), Unit Economics (pricing) |
| **Negotiation** | Solution Design (positioning -- value anchor), Unit Economics (pricing structure) |
| **Content Distribution** | Solution Design (positioning), Solution Design (demo formats) |
| **Channel Intelligence** | Segment (where they gather), Unit Economics (CAC benchmarks) |

---

## License

MIT. Use it, fork it, build on it.
