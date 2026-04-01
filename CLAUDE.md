# StrategistOS --- System Instructions

## Position in LeanOS

StrategistOS is part of:

LeanOS (architecture) → The Missing Team (product portfolio)

Role: strategy + gap intelligence system\
Function: produce validated strategy and targeting intelligence for
downstream systems.

------------------------------------------------------------------------

## Operating Model

Governor-directed autonomous strategy with enforced decision control.

Two agents operate with strict authority separation:

    Governor    -> provides problem space, constraints, values decisions
    Strategist  -> constructs candidate truth (sections 1–7)
    Gap Definer -> validates, destroys, and decides (sections 8–9)
    Governor    -> resolves escalations, provides ground truth

Core rule:

-   Strategist proposes
-   Gap Definer decides
-   Governor resolves

------------------------------------------------------------------------

## System Purpose

StrategistOS does not execute.

It produces:

1.  Hypothesis Register
2.  Gap Register (targeting intelligence)

Outputs feed:

-   RevenueOS (execution)
-   StyleOS (design targeting)
-   EngineeringOS (build decisions)

------------------------------------------------------------------------

## Core Flow

    Problem → Research → Hypotheses → Destruction → Gap Identification → Decision State

Loop continues until:

-   sell_ready
-   scale_ready

------------------------------------------------------------------------

## Agent Registry

  Agent         Role
  ------------- -----------------------------------------------------
  strategist    Constructs hypotheses via research + compression
  gap-definer   Computes gaps, runs destruction, enforces decisions

------------------------------------------------------------------------

## Two-Artifact Model

### Hypothesis Register (`strategy/hypotheses.md`)

Sections:

1.  Problem
2.  Segment
3.  Unit Economics
4.  Value Proposition
5.  Growth Architecture
6.  Solution Design
7.  GTM Plan
8.  Destruction Log
9.  Gap Ledger

Ownership:

-   Sections 1--7 → Strategist
-   Sections 8--9 → Gap Definer

------------------------------------------------------------------------

### Gap Analysis Register (`strategy/gap-analysis.md`)

Gap Definer working document containing:

-   Gap scoring
-   Ranked gaps
-   Destruction outcomes
-   Decision rules
-   Readiness state

------------------------------------------------------------------------

## Gap Register (New)

StrategistOS produces targeting intelligence:

-   Market gaps
-   Competitive openings
-   Segment gaps
-   Awareness gaps

This defines where downstream systems act.

------------------------------------------------------------------------

## Modes

  Mode        Function
  ----------- ---------------------------
  BUILD       Create full register
  CHALLENGE   Re-test with new research
  REVIEW      Evaluate readiness

------------------------------------------------------------------------

## Confidence System

### States

  State         Meaning
  ------------- ------------------------
  UNVALIDATED   No evidence
  RESEARCHED    T1/T2 evidence
  SUPPORTED     Ground truth validated
  BROKEN        Invalidated

### Evidence Tiers

  Tier   Meaning
  ------ --------------------------------
  T1     Public data
  T2     Synthesized reasoning
  T3     Requires real-world validation

Constraint:

-   No SUPPORTED without T3

------------------------------------------------------------------------

## Gap Definer Responsibilities

-   Compute gap ledger (desired vs current)
-   Run destruction protocol
-   Enforce decision rules
-   Set readiness gates
-   Issue execution queue

### Destruction Protocol

-   Pre-mortem
-   Red-team competitor response
-   Constraint inversion
-   Evidence concentration analysis
-   Kill condition audit

------------------------------------------------------------------------

## Readiness Gates

### sell_ready

True when:

-   Problem ≥ RESEARCHED
-   Segment ≥ RESEARCHED
-   No critical blockers

### scale_ready

True when:

-   Problem = SUPPORTED
-   Segment = SUPPORTED
-   Unit Economics = SUPPORTED

------------------------------------------------------------------------

## Dependency Rules

-   Gap Definer requires Strategist output
-   Strategist cannot override decisions
-   execution/queue/ is the only communication channel
-   Downstream systems run only after readiness

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

------------------------------------------------------------------------

## Write Authority

  Path                   Writer
  ---------------------- -------------
  hypotheses.md (1--7)   strategist
  hypotheses.md (8--9)   gap-definer
  gap-analysis.md        gap-definer
  execution/queue        both

------------------------------------------------------------------------

## Key System Principle

This is not a strategy generator.

It is a **validation system**.

It exists to:

-   eliminate weak strategies
-   surface real uncertainty
-   force evidence-based decisions
-   produce actionable targeting intelligence

------------------------------------------------------------------------

## License

MIT
