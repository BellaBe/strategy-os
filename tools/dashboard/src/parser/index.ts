import type {
  HypothesisRegister,
  Hypothesis,
  HypothesisId,
  ParseResult,
  ParseWarning,
} from '../model/types';
import { splitSections, type SectionId } from './sections';
import { parseMetadata } from './metadata';
import { parseHypothesis, emptyHypothesis } from './hypothesis';
import { parseSolutionDesign } from './solution';
import { parseDestructionLog } from './destruction';

const HYPOTHESIS_SECTIONS: { sectionId: SectionId; hypothesisId: HypothesisId }[] = [
  { sectionId: 'problem', hypothesisId: 'problem' },
  { sectionId: 'segment', hypothesisId: 'segment' },
  { sectionId: 'valueProposition', hypothesisId: 'valueProposition' },
  { sectionId: 'unitEconomics', hypothesisId: 'unitEconomics' },
];

export function parse(markdown: string): ParseResult {
  const warnings: ParseWarning[] = [];
  let fieldsAttempted = 0;
  let fieldsExtracted = 0;

  if (!markdown || markdown.trim().length === 0) {
    return {
      register: emptyRegister(),
      warnings: [{ section: 'root', field: 'document', message: 'Empty document', severity: 'error' }],
      parseCompleteness: 0,
    };
  }

  // Step 1: Split into sections
  const sections = splitSections(markdown);

  // Step 2: Parse metadata from root section
  const rootSection = sections.get('root');
  const rootText = rootSection?.rawText ?? markdown.split(/\n##\s/)[0] ?? '';
  const { metadata, directives, warnings: metadataWarnings } = parseMetadata(rootText);
  warnings.push(...metadataWarnings);

  // Track completeness for metadata
  fieldsAttempted += 5;
  if (metadata.created) fieldsExtracted++;
  if (metadata.lastReviewed) fieldsExtracted++;
  if (metadata.businessMode) fieldsExtracted++;
  if (metadata.buildMethod) fieldsExtracted++;
  fieldsExtracted++; // sellGrowReady always has a value (defaults false)

  // Step 3: Parse hypotheses
  const hypotheses: Record<HypothesisId, Hypothesis> = {
    problem: emptyHypothesis('problem'),
    segment: emptyHypothesis('segment'),
    valueProposition: emptyHypothesis('valueProposition'),
    unitEconomics: emptyHypothesis('unitEconomics'),
  };

  for (const { sectionId, hypothesisId } of HYPOTHESIS_SECTIONS) {
    const section = sections.get(sectionId);
    fieldsAttempted += 6; // claim, confidence, evidence, assumptions, killCondition, lastUpdated

    if (!section) {
      warnings.push({
        section: sectionId,
        field: 'section',
        message: `Section "${sectionId}" not found in document`,
        severity: 'warning',
      });
      continue;
    }

    const { hypothesis, warnings: hWarnings } = parseHypothesis(section, hypothesisId);
    hypotheses[hypothesisId] = hypothesis;
    warnings.push(...hWarnings);

    if (hypothesis.claim) fieldsExtracted++;
    if (hypothesis.confidence) fieldsExtracted++;
    if (hypothesis.evidence.length > 0) fieldsExtracted++;
    if (hypothesis.assumptions.length > 0) fieldsExtracted++;
    if (hypothesis.killCondition) fieldsExtracted++;
    if (hypothesis.lastUpdated) fieldsExtracted++;
  }

  // Step 4: Parse solution design
  let solutionDesign;
  const solutionSection = sections.get('solutionDesign');
  fieldsAttempted += 4; // growthArchitecture, featureMap, mvpScope, growthLoops

  if (solutionSection) {
    const { solution, warnings: sWarnings } = parseSolutionDesign(solutionSection);
    solutionDesign = solution;
    warnings.push(...sWarnings);

    if (solution.growthArchitecture) fieldsExtracted++;
    if (solution.featureMap.length > 0) fieldsExtracted++;
    if (solution.mvpScope) fieldsExtracted++;
    if (solution.growthLoops.length > 0) fieldsExtracted++;
  } else {
    warnings.push({
      section: 'solutionDesign',
      field: 'section',
      message: 'Solution Design section not found',
      severity: 'info',
    });
  }

  // Step 5: Parse destruction log
  let destructionLog;
  const destructionSection = sections.get('destructionLog');
  fieldsAttempted += 5;

  if (destructionSection) {
    const { log, warnings: dWarnings } = parseDestructionLog(destructionSection);
    destructionLog = log;
    warnings.push(...dWarnings);

    if (log.assumptionExtraction.length > 0) fieldsExtracted++;
    if (log.preMortem) fieldsExtracted++;
    if (log.redTeam) fieldsExtracted++;
    if (log.constraintInversions.length > 0) fieldsExtracted++;
    if (log.evidenceConcentration.length > 0) fieldsExtracted++;
  } else {
    warnings.push({
      section: 'destructionLog',
      field: 'section',
      message: 'Destruction Log section not found',
      severity: 'info',
    });
  }

  // Step 6: Assemble
  const register: HypothesisRegister = {
    metadata,
    hypotheses,
    solutionDesign,
    destructionLog,
    governorDirectives: directives.length > 0 ? directives : undefined,
  };

  const parseCompleteness = fieldsAttempted > 0 ? fieldsExtracted / fieldsAttempted : 0;

  return { register, warnings, parseCompleteness };
}

function emptyRegister(): HypothesisRegister {
  return {
    metadata: { sellGrowReady: false },
    hypotheses: {
      problem: emptyHypothesis('problem'),
      segment: emptyHypothesis('segment'),
      valueProposition: emptyHypothesis('valueProposition'),
      unitEconomics: emptyHypothesis('unitEconomics'),
    },
  };
}
