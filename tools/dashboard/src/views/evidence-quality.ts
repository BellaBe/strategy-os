import type { HypothesisRegister, HypothesisId, EvidenceType, EvidenceQualityView } from '../model/types';

const LABELS: Record<HypothesisId, string> = {
  problem: 'Problem',
  segment: 'Segment',
  valueProposition: 'Value Proposition',
  unitEconomics: 'Unit Economics',
};

const TIER_WEIGHTS = { T1: 1.0, T2: 0.6, T3: 0.2 };

export function computeEvidenceQuality(register: HypothesisRegister): EvidenceQualityView {
  const ids: HypothesisId[] = ['problem', 'segment', 'valueProposition', 'unitEconomics'];

  const byHypothesis = ids.map(id => {
    const h = register.hypotheses[id];

    const t1 = h.evidence.filter(e => e.tier === 'T1').length;
    const t2 = h.evidence.filter(e => e.tier === 'T2').length;
    const t3 = h.evidence.filter(e => e.tier === 'T3').length;

    const typeBreakdown: Partial<Record<EvidenceType, number>> = {};
    for (const e of h.evidence) {
      if (e.type) {
        typeBreakdown[e.type] = (typeBreakdown[e.type] || 0) + 1;
      }
    }

    const totalEvidence = h.evidence.length;
    const weightedSum = t1 * TIER_WEIGHTS.T1 + t2 * TIER_WEIGHTS.T2 + t3 * TIER_WEIGHTS.T3;
    const qualityScore = totalEvidence > 0 ? weightedSum / totalEvidence : 0;

    return {
      id,
      label: LABELS[id],
      tierBreakdown: { t1, t2, t3 },
      typeBreakdown,
      totalEvidence,
      qualityScore,
    };
  });

  // Overall
  const overallT1 = byHypothesis.reduce((s, h) => s + h.tierBreakdown.t1, 0);
  const overallT2 = byHypothesis.reduce((s, h) => s + h.tierBreakdown.t2, 0);
  const overallT3 = byHypothesis.reduce((s, h) => s + h.tierBreakdown.t3, 0);
  const totalEvidence = overallT1 + overallT2 + overallT3;
  const overallWeighted = overallT1 * TIER_WEIGHTS.T1 + overallT2 * TIER_WEIGHTS.T2 + overallT3 * TIER_WEIGHTS.T3;

  // Tier gaps: T3 evidence in RESEARCHED or SUPPORTED hypotheses
  const tierGaps = ids.flatMap(id => {
    const h = register.hypotheses[id];
    if (h.confidence !== 'RESEARCHED' && h.confidence !== 'SUPPORTED') return [];

    return h.evidence
      .filter(e => e.tier === 'T3')
      .map(item => ({
        hypothesis: id,
        item,
        impact: `This evidence supports a ${h.confidence} hypothesis but is T3 (founder-stated). Investigate to upgrade.`,
      }));
  });

  return {
    byHypothesis,
    overall: {
      totalEvidence,
      tierBreakdown: { t1: overallT1, t2: overallT2, t3: overallT3 },
      qualityScore: totalEvidence > 0 ? overallWeighted / totalEvidence : 0,
    },
    tierGaps,
  };
}
