import type { HypothesisRegister, HypothesisId, ReadinessView } from '../model/types';

const LABELS: Record<HypothesisId, string> = {
  problem: 'Problem',
  segment: 'Segment',
  valueProposition: 'Value Proposition',
  unitEconomics: 'Unit Economics',
};

export function computeReadiness(register: HypothesisRegister): ReadinessView {
  const blockers: string[] = [];
  const warnings: string[] = [];

  const hypothesisSummary = (['problem', 'segment', 'valueProposition', 'unitEconomics'] as HypothesisId[]).map(id => {
    const h = register.hypotheses[id];

    const t1Count = h.evidence.filter(e => e.tier === 'T1').length;
    const t2Count = h.evidence.filter(e => e.tier === 'T2').length;
    const t3Count = h.evidence.filter(e => e.tier === 'T3').length;
    const highBlastCount = h.assumptions.filter(a => a.blastRadius === 'HIGH').length;

    return {
      id,
      label: LABELS[id],
      confidence: h.confidence,
      evidenceCount: h.evidence.length,
      t1Count,
      t2Count,
      t3Count,
      assumptionCount: h.assumptions.length,
      highBlastCount,
      hasKillCondition: !!h.killCondition,
    };
  });

  // Blockers
  if (!register.metadata.sellGrowReady) {
    blockers.push('Sell & Grow Ready is explicitly set to "no"');
  }

  for (const s of hypothesisSummary) {
    if (s.confidence === 'BROKEN') {
      blockers.push(`${s.label} hypothesis is BROKEN`);
    }
    if (s.confidence === 'UNVALIDATED') {
      blockers.push(`${s.label} hypothesis is UNVALIDATED`);
    }
  }

  const totalT1 = hypothesisSummary.reduce((sum, s) => sum + s.t1Count, 0);
  if (totalT1 === 0) {
    blockers.push('No T1 (direct) evidence across any hypothesis');
  }

  // Warnings
  for (const s of hypothesisSummary) {
    if (s.confidence === 'RESEARCHED') {
      warnings.push(`${s.label} is RESEARCHED but not yet SUPPORTED`);
    }
  }

  const totalAssumptions = hypothesisSummary.reduce((sum, s) => sum + s.assumptionCount, 0);
  const highBlastT3 = (['problem', 'segment', 'valueProposition', 'unitEconomics'] as HypothesisId[])
    .flatMap(id => register.hypotheses[id].assumptions)
    .filter(a => a.blastRadius === 'HIGH' && a.tier === 'T3')
    .length;

  if (totalAssumptions > 0 && highBlastT3 / totalAssumptions > 0.5) {
    warnings.push('More than 50% of assumptions are HIGH blast radius with T3 evidence');
  }

  if (!register.destructionLog) {
    warnings.push('No destruction log found -- strategy has not been stress-tested');
  }

  return {
    sellGrowReady: register.metadata.sellGrowReady,
    businessMode: register.metadata.businessMode,
    buildMethod: register.metadata.buildMethod,
    hypothesisSummary,
    blockers,
    warnings,
  };
}
