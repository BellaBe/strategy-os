import type {
  Hypothesis,
  HypothesisId,
  ConfidenceState,
  ParseWarning,
  PainScoreEntry,
  VPClause,
  PhaseEconomics,
  EconomicInput,
  ScenarioAnalysis,
  EconomicScenario,
  CostEntry,
  ModeThreshold,
} from '../model/types';
import type { Section } from './sections';
import { extractTablesFromNodes, tableToRows, findTableNearHeading } from './sections';
import {
  extractField,
  extractEvidenceItems,
  extractResearchSources,
  extractAssumptions,
  extractPossibilitySpace,
  extractObservableFilters,
  extractJobsAddressed,
} from './fields';
import {
  parsePainScoringTable,
  parseVPClauseTable,
  parseEconomicInputsTable,
  parseCostStructureTable,
  parseModeThresholdsTable,
} from './tables';

const CONFIDENCE_VALUES: Set<string> = new Set(['UNVALIDATED', 'RESEARCHED', 'SUPPORTED', 'BROKEN']);

export function parseHypothesis(
  section: Section,
  id: HypothesisId
): { hypothesis: Hypothesis; warnings: ParseWarning[] } {
  const warnings: ParseWarning[] = [];
  const text = section.rawText;
  const sectionName = id;

  // Core fields
  const claim = extractField(text, 'Claim');
  const confidenceRaw = extractField(text, 'Confidence');
  const confidence = confidenceRaw && CONFIDENCE_VALUES.has(confidenceRaw.toUpperCase())
    ? (confidenceRaw.toUpperCase() as ConfidenceState)
    : undefined;

  const killCondition = extractField(text, 'Kill Condition');
  const lastUpdated = extractField(text, 'Last Updated');
  const updateRationale = extractField(text, 'Update Rationale');

  // Structured sub-sections
  const possibilitySpace = extractPossibilitySpace(text);
  const evidenceResult = extractEvidenceItems(text, sectionName);
  const sourcesResult = extractResearchSources(text, sectionName);
  const assumptionsResult = extractAssumptions(text, sectionName);

  warnings.push(...evidenceResult.warnings, ...sourcesResult.warnings, ...assumptionsResult.warnings);

  const hypothesis: Hypothesis = {
    id,
    claim,
    confidence,
    possibilitySpace,
    evidence: evidenceResult.items,
    researchSources: sourcesResult.items,
    assumptions: assumptionsResult.items,
    killCondition,
    lastUpdated,
    updateRationale,
  };

  // Hypothesis-specific extensions
  if (id === 'segment') {
    hypothesis.observableFilters = extractObservableFilters(text);

    const tables = extractTablesFromNodes(section.nodes);
    const painTable = findTableNearHeading(section.nodes, /Pain Scoring/i);
    if (painTable) {
      hypothesis.painScoring = parsePainScoringTable(painTable);
    } else if (tables.length > 0) {
      // Try first table as pain scoring
      const rows = tableToRows(tables[0]);
      if (rows.length > 0 && rows[0].some(h => /frequency/i.test(h))) {
        hypothesis.painScoring = parsePainScoringTable(tables[0]);
      }
    }
  }

  if (id === 'valueProposition') {
    hypothesis.jobsAddressed = extractJobsAddressed(text);

    const vpTable = findTableNearHeading(section.nodes, /VP Clause|Clause/i);
    if (vpTable) {
      hypothesis.vpClauseValidation = parseVPClauseTable(vpTable);
    } else {
      // Try to find a table with "Clause" column
      const tables = extractTablesFromNodes(section.nodes);
      for (const t of tables) {
        const rows = tableToRows(t);
        if (rows.length > 0 && rows[0].some(h => /clause/i.test(h))) {
          hypothesis.vpClauseValidation = parseVPClauseTable(t);
          break;
        }
      }
    }
  }

  if (id === 'unitEconomics') {
    parseUnitEconomicsExtensions(section, hypothesis, warnings);
  }

  return { hypothesis, warnings };
}

function parseUnitEconomicsExtensions(
  section: Section,
  hypothesis: Hypothesis,
  warnings: ParseWarning[]
): void {
  const text = section.rawText;
  const tables = extractTablesFromNodes(section.nodes);

  // Phase economics
  const phases: PhaseEconomics[] = [];

  // Find phase blocks generically (### Phase X: Description)
  const phaseBlocks: { name: string; description: string; line: number }[] = [];
  const phaseHeadingRe = /^###\s*(Phase\s*\w+)[:\s]*(.*)$/gm;
  let phaseMatch;
  while ((phaseMatch = phaseHeadingRe.exec(text)) !== null) {
    phaseBlocks.push({
      name: phaseMatch[1].trim(),
      description: phaseMatch[2].trim(),
      line: text.substring(0, phaseMatch.index).split('\n').length,
    });
  }

  // Phase input tables
  for (const table of tables) {
    const rows = tableToRows(table);
    if (rows.length < 2) continue;
    const headers = rows[0];

    if (headers.some(h => /Input|Value.*Range/i.test(h)) && headers.some(h => /Tier/i.test(h))) {
      const inputs = parseEconomicInputsTable(table);
      if (inputs.length > 0) {
        // Determine which phase this table belongs to by position
        const tablePos = table.position?.start?.line ?? 0;
        let assignedPhase = { phase: 'Economics', description: '', inputs };

        for (let i = phaseBlocks.length - 1; i >= 0; i--) {
          if (tablePos >= phaseBlocks[i].line) {
            assignedPhase = { phase: phaseBlocks[i].name, description: phaseBlocks[i].description, inputs };
            break;
          }
        }

        phases.push(assignedPhase);
      }
    }

    // Cost structure
    if (headers.some(h => /Category/i.test(h)) && headers.some(h => /Type/i.test(h)) && headers.some(h => /Monthly/i.test(h))) {
      hypothesis.costStructure = parseCostStructureTable(table);
    }

    // Mode thresholds
    if (headers.some(h => /Metric/i.test(h)) && headers.some(h => /Required/i.test(h)) && headers.some(h => /Status/i.test(h))) {
      hypothesis.modeThresholds = parseModeThresholdsTable(table);
    }
  }

  if (phases.length > 0) {
    hypothesis.twoPhaseEconomics = phases;
  }

  // Scenario analysis
  hypothesis.scenarioAnalysis = parseScenarioAnalysis(text);
}

function parseScenarioAnalysis(text: string): ScenarioAnalysis | undefined {
  const scenarios: ScenarioAnalysis = {};

  // Base case
  const baseMatch = text.match(/\*\*Base Case[^*]*\*\*:?\s*\n([\s\S]*?)(?=\*\*(?:Optimistic|Pessimistic|Kill)|---|\n##)/i);
  if (baseMatch) {
    scenarios.base = parseScenarioBlock('Base Case', baseMatch[1]);
  }

  // Optimistic
  const optMatch = text.match(/\*\*Optimistic[^*]*\*\*:?\s*\n([\s\S]*?)(?=\*\*(?:Pessimistic|Kill|Base)|---|\n##)/i);
  if (optMatch) {
    scenarios.optimistic = parseScenarioBlock('Optimistic', optMatch[1]);
  }

  // Pessimistic
  const pessMatch = text.match(/\*\*Pessimistic[^*]*\*\*:?\s*\n([\s\S]*?)(?=\*\*(?:Kill|Base|Optimistic)\b|---|\n##)/i);
  if (pessMatch) {
    scenarios.pessimistic = parseScenarioBlock('Pessimistic', pessMatch[1]);
  }

  // Kill scenario
  const killMatch = text.match(/\*\*Kill Scenario:\*\*\s*(.+(?:\n(?!\*\*).+)*)/m);
  if (killMatch) {
    scenarios.killScenario = killMatch[1].trim();
  }

  if (!scenarios.base && !scenarios.optimistic && !scenarios.pessimistic && !scenarios.killScenario) {
    return undefined;
  }

  return scenarios;
}

function parseScenarioBlock(label: string, block: string): EconomicScenario {
  const scenario: EconomicScenario = { label };

  const lines = block.split('\n').map(l => l.trim()).filter(l => l.startsWith('-'));

  for (const line of lines) {
    const text = line.replace(/^-\s*/, '');

    if (/^ARPU/i.test(text)) {
      scenario.arpu = text.replace(/^ARPU:?\s*/i, '').trim();
    } else if (/^.*churn/i.test(text)) {
      scenario.churn = text;
    } else if (/^LTV:CAC/i.test(text) || /LTV:CAC:\s*/i.test(text)) {
      const ratioMatch = text.match(/(\d+\.?\d*):1/);
      if (ratioMatch) scenario.ltvCacRatio = parseFloat(ratioMatch[1]);

      if (/CRITICAL/i.test(text)) scenario.status = 'CRITICAL_FAILURE';
      else if (/WARNING/i.test(text)) scenario.status = 'WARNING';
      else if (/PASSES/i.test(text)) scenario.status = 'PASSES';
    } else if (/^LTV/i.test(text)) {
      scenario.ltv = text.replace(/^LTV:?\s*/i, '').trim();
    } else if (/^CAC/i.test(text)) {
      scenario.cac = text.replace(/^CAC:?\s*/i, '').trim();
    } else if (/^Payback/i.test(text)) {
      const monthMatch = text.match(/(\d+\.?\d*)\s*months/i);
      if (monthMatch) scenario.paybackMonths = parseFloat(monthMatch[1]);

      if (/CRITICAL/i.test(text)) scenario.status = scenario.status || 'CRITICAL_FAILURE';
    }
  }

  return scenario;
}

export function emptyHypothesis(id: HypothesisId): Hypothesis {
  return {
    id,
    evidence: [],
    researchSources: [],
    assumptions: [],
  };
}
