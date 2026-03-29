import type { Content, Table } from 'mdast';
import type {
  PainScoreEntry,
  VPClause,
  EpistemicTier,
  PhaseEconomics,
  EconomicInput,
  CostEntry,
  ModeThreshold,
  DestructionAssumption,
  BlastRadius,
  ConstraintInversion,
  EvidenceConcentrationEntry,
  FeatureMapEntry,
} from '../model/types';
import { tableToRows, findTableNearHeading } from './sections';

const TIERS: Set<string> = new Set(['T1', 'T2', 'T3']);

function parseTier(s: string): EpistemicTier | undefined {
  const cleaned = s.trim().toUpperCase();
  // Handle ranges like "T2-T3" -> take the lower
  const match = cleaned.match(/T([123])/);
  return match ? (`T${match[1]}` as EpistemicTier) : undefined;
}

function parseNumber(s: string): number {
  const n = parseFloat(s.replace(/[^0-9.-]/g, ''));
  return isNaN(n) ? 0 : n;
}

export function parsePainScoringTable(table: Table): PainScoreEntry[] {
  const rows = tableToRows(table);
  if (rows.length < 2) return [];

  // Skip header row
  return rows.slice(1).map(row => ({
    segment: row[0] || '',
    frequency: parseNumber(row[1] || '0'),
    severity: parseNumber(row[2] || '0'),
    breadth: parseNumber(row[3] || '0'),
    alternativesInadequacy: parseNumber(row[4] || '0'),
    composite: parseNumber(row[5] || '0'),
  }));
}

export function parseVPClauseTable(table: Table): VPClause[] {
  const rows = tableToRows(table);
  if (rows.length < 2) return [];

  return rows.slice(1).map(row => ({
    clause: row[0] || '',
    status: row[1] || '',
    tier: parseTier(row[2] || ''),
    evidence: row[3] || undefined,
  }));
}

export function parseEconomicInputsTable(table: Table): EconomicInput[] {
  const rows = tableToRows(table);
  if (rows.length < 2) return [];

  // Columns: Input | Value (Range) | Tier | Source
  return rows.slice(1).map(row => ({
    name: row[0] || '',
    value: row[1] || '',
    tier: parseTier(row[2] || ''),
    source: row[3] || undefined,
  }));
}

export function parseCostStructureTable(table: Table): CostEntry[] {
  const rows = tableToRows(table);
  if (rows.length < 2) return [];

  return rows.slice(1).map(row => ({
    category: row[0] || '',
    type: (row[1]?.trim() === 'Variable' ? 'Variable' : 'Fixed') as 'Fixed' | 'Variable',
    monthly: row[2] || '',
    tier: parseTier(row[3] || ''),
  }));
}

export function parseModeThresholdsTable(table: Table): ModeThreshold[] {
  const rows = tableToRows(table);
  if (rows.length < 2) return [];

  // Columns: Metric | Required (Bootstrap start) | Required (Venture scale) | Estimate | Status
  return rows.slice(1).map(row => {
    const statusStr = (row[4] || '').toUpperCase();
    let status: 'PASSES' | 'WARNING' | 'FAILS' = 'PASSES';
    if (statusStr.includes('FAIL')) status = 'FAILS';
    else if (statusStr.includes('WARNING')) status = 'WARNING';

    return {
      metric: row[0] || '',
      required: `${row[1] || ''} / ${row[2] || ''}`.trim(),
      estimate: row[3] || '',
      status,
    };
  });
}

export function parseDestructionAssumptionTable(table: Table): DestructionAssumption[] {
  const rows = tableToRows(table);
  if (rows.length < 2) return [];

  return rows.slice(1).map(row => {
    const blastStr = (row[4] || '').toUpperCase().trim();
    const blastRadius: BlastRadius = blastStr === 'HIGH' ? 'HIGH' : blastStr === 'MEDIUM' ? 'MEDIUM' : 'LOW';

    return {
      id: row[0] || '',
      assumption: row[1] || '',
      evidenceTier: row[2] || '',
      falsification: row[3] || '',
      blastRadius,
      status: row[5] || '',
    };
  });
}

export function parseConstraintInversionTable(table: Table): ConstraintInversion[] {
  const rows = tableToRows(table);
  if (rows.length < 2) return [];

  return rows.slice(1).map(row => ({
    assumption: row[0] || '',
    consequence: row[1] || '',
    strategySurvives: row[2] || '',
  }));
}

export function parseEvidenceConcentrationTable(table: Table): EvidenceConcentrationEntry[] {
  const rows = tableToRows(table);
  if (rows.length < 2) return [];

  return rows.slice(1).map(row => ({
    source: row[0] || '',
    hypothesesSupported: row[1] || '',
    riskLevel: row[2] || '',
  }));
}

export function parseFeatureMapTable(table: Table): FeatureMapEntry[] {
  const rows = tableToRows(table);
  if (rows.length < 2) return [];

  return rows.slice(1).map(row => {
    const priorityStr = (row[3] || '').toUpperCase().replace(/\s+/g, '_');
    let priority: 'MVP' | 'POST_MVP' | 'FUTURE' | undefined;
    if (priorityStr === 'MVP') priority = 'MVP';
    else if (priorityStr.includes('POST')) priority = 'POST_MVP';
    else if (priorityStr.includes('FUTURE')) priority = 'FUTURE';

    return {
      feature: row[0] || '',
      solvesProblem: row[1] || '',
      jobDimension: row[2] || undefined,
      priority,
      phase: row[4] || undefined,
      tier: parseTier(row[5] || ''),
    };
  });
}

export function parseAccreditationTable(table: Table): EconomicInput[] {
  const rows = tableToRows(table);
  if (rows.length < 2) return [];

  return rows.slice(1).map(row => ({
    name: row[0] || '',
    value: row[1] || '',
    tier: parseTier(row[2] || ''),
    source: row[3] || undefined,
  }));
}
