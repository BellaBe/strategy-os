import type {
  DestructionLog,
  PreMortem,
  RedTeam,
  RedTeamResponse,
  ParseWarning,
} from '../model/types';
import type { Section } from './sections';
import { extractTablesFromNodes, tableToRows } from './sections';
import {
  parseDestructionAssumptionTable,
  parseConstraintInversionTable,
  parseEvidenceConcentrationTable,
} from './tables';

export function parseDestructionLog(section: Section): { log: DestructionLog; warnings: ParseWarning[] } {
  const warnings: ParseWarning[] = [];
  const text = section.rawText;
  const tables = extractTablesFromNodes(section.nodes);

  // Assumption extraction table (first table, has columns like #, Assumption, Evidence...)
  const assumptionTable = tables.find(t => {
    const rows = tableToRows(t);
    return rows.length > 1 && rows[0].some(h => /Assumption/i.test(h)) && rows[0].some(h => /Blast/i.test(h));
  });

  const assumptionExtraction = assumptionTable
    ? parseDestructionAssumptionTable(assumptionTable)
    : [];

  // Pre-mortem
  const preMortem = parsePreMortem(text);

  // Red team
  const redTeam = parseRedTeam(text);

  // Constraint inversions table
  const inversionTable = tables.find(t => {
    const rows = tableToRows(t);
    return rows.length > 1 && rows[0].some(h => /Assumption.*Inverted|Inverted/i.test(h)) && rows[0].some(h => /Survives/i.test(h));
  });

  const constraintInversions = inversionTable
    ? parseConstraintInversionTable(inversionTable)
    : [];

  // Evidence concentration table
  const concentrationTable = tables.find(t => {
    const rows = tableToRows(t);
    return rows.length > 1 && rows[0].some(h => /Source/i.test(h)) && rows[0].some(h => /Risk.*Level/i.test(h));
  });

  const evidenceConcentration = concentrationTable
    ? parseEvidenceConcentrationTable(concentrationTable)
    : [];

  return {
    log: {
      assumptionExtraction,
      preMortem,
      redTeam,
      constraintInversions,
      evidenceConcentration,
    },
    warnings,
  };
}

function parsePreMortem(text: string): PreMortem | undefined {
  // Find Pre-Mortem section
  const preMatch = text.match(/###\s*Pre-?Mortem\s*\n([\s\S]*?)(?=###\s|$)/i);
  if (!preMatch) return undefined;

  const block = preMatch[1].trim();

  // Extract key findings from "What this changes:" section
  const keyFindings: string[] = [];
  const changesMatch = block.match(/\*\*What this changes:\*\*\s*\n([\s\S]*?)$/i);
  if (changesMatch) {
    for (const line of changesMatch[1].split('\n')) {
      const trimmed = line.trim();
      if (trimmed.startsWith('-')) {
        keyFindings.push(trimmed.replace(/^-\s*/, ''));
      }
    }
  }

  // Narrative is everything before "What this changes"
  const narrativeEnd = block.indexOf('**What this changes:');
  const narrative = narrativeEnd > 0 ? block.substring(0, narrativeEnd).trim() : block;

  return { narrative, keyFindings };
}

function parseRedTeam(text: string): RedTeam | undefined {
  const redMatch = text.match(/###\s*Red-?Team\s+Response\s*\n([\s\S]*?)(?=###\s|$)/i);
  if (!redMatch) return undefined;

  const block = redMatch[1].trim();

  // Scenario: first bold text block or first paragraph
  const scenarioMatch = block.match(/\*\*(.+?)\*\*/);
  const scenario = scenarioMatch ? scenarioMatch[1] : '';

  // Responses: numbered items with timeline pattern
  const responses: RedTeamResponse[] = [];
  const responsePattern = /\d+\.\s*\*\*(.+?):\*\*\s*([\s\S]*?)(?=\d+\.\s*\*\*|^\*\*Impact|\*\*Strategy survival|$)/gm;
  let match;

  while ((match = responsePattern.exec(block)) !== null) {
    responses.push({
      timeline: match[1].trim(),
      action: match[2].trim(),
    });
  }

  // Impact assessment
  const impactMatch = block.match(/\*\*Impact assessment:\*\*\s*([\s\S]*?)(?=\*\*Strategy survival|$)/i);
  const impactAssessment = impactMatch ? impactMatch[1].trim() : undefined;

  // Strategy survival depends on
  const survivalDependsOn: string[] = [];
  const survivalMatch = block.match(/\*\*Strategy survival depends on:\*\*\s*\n([\s\S]*?)(?=\*\*Modified|$)/i);
  if (survivalMatch) {
    for (const line of survivalMatch[1].split('\n')) {
      const trimmed = line.trim();
      if (trimmed.startsWith('-')) {
        survivalDependsOn.push(trimmed.replace(/^-\s*/, ''));
      }
    }
  }

  // Modified strategy response
  const modifiedMatch = block.match(/\*\*Modified strategy response:\*\*\s*([\s\S]*?)$/i);
  const modifiedStrategyResponse = modifiedMatch ? modifiedMatch[1].trim() : undefined;

  return {
    scenario,
    responses,
    impactAssessment,
    strategySurvivalDependsOn: survivalDependsOn,
    modifiedStrategyResponse,
  };
}
