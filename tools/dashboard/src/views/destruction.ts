import type { HypothesisRegister, DestructionView } from '../model/types';

export function computeDestructionView(register: HypothesisRegister): DestructionView {
  if (!register.destructionLog) {
    return { hasDestructionLog: false };
  }

  const log = register.destructionLog;

  const assumptions = log.assumptionExtraction.length > 0
    ? {
        total: log.assumptionExtraction.length,
        byBlastRadius: {
          high: log.assumptionExtraction.filter(a => a.blastRadius === 'HIGH').length,
          medium: log.assumptionExtraction.filter(a => a.blastRadius === 'MEDIUM').length,
          low: log.assumptionExtraction.filter(a => a.blastRadius === 'LOW').length,
        },
        entries: log.assumptionExtraction,
      }
    : undefined;

  const preMortem = log.preMortem
    ? { narrative: log.preMortem.narrative, keyFindings: log.preMortem.keyFindings }
    : undefined;

  const redTeam = log.redTeam
    ? {
        scenario: log.redTeam.scenario,
        responses: log.redTeam.responses,
        survivalDependsOn: log.redTeam.strategySurvivalDependsOn,
      }
    : undefined;

  const constraintInversions = log.constraintInversions.length > 0
    ? {
        survives: log.constraintInversions.filter(c => /^Yes/i.test(c.strategySurvives)).length,
        fails: log.constraintInversions.filter(c => /^No/i.test(c.strategySurvives)).length,
        marginal: log.constraintInversions.filter(c => /Marginal|modification/i.test(c.strategySurvives)).length,
        entries: log.constraintInversions,
      }
    : undefined;

  const evidenceConcentration = log.evidenceConcentration.length > 0
    ? {
        highRisk: log.evidenceConcentration.filter(e => /HIGH|CONCENTRATED/i.test(e.riskLevel)),
        entries: log.evidenceConcentration,
      }
    : undefined;

  return {
    hasDestructionLog: true,
    assumptions,
    preMortem,
    redTeam,
    constraintInversions,
    evidenceConcentration,
  };
}
