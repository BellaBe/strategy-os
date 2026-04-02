# StrategyOS

Autonomous strategy and gap intelligence system.
Part of **LeanOS** → **The Missing Team** product portfolio.

------------------------------------------------------------------------

## Position in the System

StrategyOS is the **entry point** of the LeanOS product pipeline.

    StrategyOS (free)
        ↓
    Produces:
        - Hypothesis Register
        - Gap Register
        ↓
    Consumed by:
        - RevenueOS (execution)
        - StyleOS (design targeting)
        - EngineeringOS (build decisions)

It does not execute. It defines **what should be executed and why**.

------------------------------------------------------------------------

## What It Does

Input: problem space
Output: validated strategy + targeting intelligence

    Problem → Research → Hypotheses → Destruction → Gap Identification → Decision State

### Core Outputs

#### 1. Hypothesis Register

-   Problem
-   Segment
-   Unit Economics
-   Value Proposition
-   Solution Design
-   GTM Plan

Each hypothesis includes: - Claim - Evidence (tiered) - Assumptions -
Kill conditions - Confidence state

#### 2. Gap Register

StrategyOS produces **targeting intelligence**:

-   Market gaps → unserved needs
-   Competitive openings → positioning white space
-   Segment gaps → where demand is concentrated
-   Awareness gaps → what buyers don't yet understand

------------------------------------------------------------------------

## Core Architecture

Two-agent system with enforced authority separation:

    Strategist (builds candidate truth)
            ↓
    Gap Definer (destroys, validates, decides)
            ↓
    Governor (human resolves what cannot be computed)

------------------------------------------------------------------------

## How It Works

    1. Governor defines problem space

    2. Strategist
       - Researches (web)
       - Constructs hypotheses (compression model)
       - Writes register (sections 1–7)

    3. Gap Definer
       - Computes gaps (desired vs current)
       - Runs destruction protocol
       - Enforces decision rules
       - Writes sections 8–9
       - Generates execution queue

    4. Governor
       - Resolves escalations
       - Provides ground truth

    5. Loop until:
       - sell_ready OR
       - scale_ready

------------------------------------------------------------------------

## Confidence System

### States

  State         Meaning
  ------------- ---------------------------------
  UNVALIDATED   No evidence
  RESEARCHED    Supported by T1/T2
  SUPPORTED     Backed by real-world validation
  BROKEN        Invalidated

### Evidence Tiers

  Tier   Meaning
  ------ -----------------------
  T1     Public data
  T2     Synthesized reasoning
  T3     Requires ground truth

------------------------------------------------------------------------

## The Strategist

Builds the strongest possible version of the truth.

### Modes

  Mode        Purpose
  ----------- ---------------------------
  BUILD       Create full register
  CHALLENGE   Re-test with new research
  REVIEW      Evaluate readiness

------------------------------------------------------------------------

## The Gap Definer

Decision authority.

### Responsibilities

-   Compute gap ledger
-   Run adversarial destruction
-   Enforce decision rules
-   Set readiness gates

------------------------------------------------------------------------

## File Structure

    strategy/
      hypotheses.md
      gap-analysis.md

    execution/
      queue/

    .claude/
      agents/
        strategist.md
        gap-definer.md

      skills/
        stg-*
        gap-*

    tools/
      dashboard/

------------------------------------------------------------------------

## License

MIT
