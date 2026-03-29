import type {
  SolutionDesign,
  SolutionPhase,
  GrowthLoop,
  HypothesisConstraint,
  MVPScope,
  ParseWarning,
} from '../model/types';
import type { Section } from './sections';
import { extractTablesFromNodes, tableToRows, findTableNearHeading } from './sections';
import { extractField } from './fields';
import { parseFeatureMapTable } from './tables';

export function parseSolutionDesign(section: Section): { solution: SolutionDesign; warnings: ParseWarning[] } {
  const warnings: ParseWarning[] = [];
  const text = section.rawText;

  const growthArchitecture = extractField(text, 'Growth Architecture');
  const architectureRationale = extractField(text, 'Architecture Rationale');
  const lastUpdated = extractField(text, 'Last Updated');

  // Phases
  const phases = parsePhases(text);

  // Feature map table
  const featureTable = findTableNearHeading(section.nodes, /Feature Map/i);
  const featureMap = featureTable ? parseFeatureMapTable(featureTable) : [];

  // If no table found near heading, look for any table with Feature column
  if (featureMap.length === 0) {
    const tables = extractTablesFromNodes(section.nodes);
    for (const t of tables) {
      const rows = tableToRows(t);
      if (rows.length > 1 && rows[0].some(h => /Feature/i.test(h))) {
        featureMap.push(...parseFeatureMapTable(t));
        break;
      }
    }
  }

  // MVP Scope
  const mvpScope = parseMVPScope(text);

  // Growth loops
  const growthLoops = parseGrowthLoops(text);

  // Constraints from hypotheses
  const constraintTable = findTableNearHeading(section.nodes, /Constraints from Hypotheses/i);
  const constraints = constraintTable ? parseConstraintsTable(constraintTable) : [];

  // Adequacy criteria
  const adequacyCriteria = parseAdequacyCriteria(text);

  return {
    solution: {
      growthArchitecture,
      architectureRationale,
      phases,
      featureMap,
      mvpScope,
      growthLoops,
      constraintsFromHypotheses: constraints,
      adequacyCriteria,
      lastUpdated,
    },
    warnings,
  };
}

function parsePhases(text: string): SolutionPhase[] {
  const phases: SolutionPhase[] = [];

  // Match ### Phase A/B blocks
  const phasePattern = /###\s*Phase\s+([AB]):\s*(.+?)(?:\n)([\s\S]*?)(?=###\s*Phase|###\s*\w|\*\*Feature Map|$)/gi;
  let match;

  while ((match = phasePattern.exec(text)) !== null) {
    const [, letter, title, body] = match;
    const details: string[] = [];

    for (const line of body.split('\n')) {
      const trimmed = line.trim();
      if (trimmed.startsWith('-')) {
        details.push(trimmed.replace(/^-\s*/, ''));
      }
    }

    phases.push({
      name: `Phase ${letter}`,
      timeline: letter === 'A' ? 'Months 0-9' : 'Month 9+',
      description: title.trim(),
      details,
    });
  }

  return phases;
}

function parseMVPScope(text: string): MVPScope | undefined {
  const mvpBlock = text.match(/\*\*MVP Scope[^*]*\*\*:?\s*\n([\s\S]*?)(?=\*\*Growth Loops|\*\*Constraints|---|\n##)/i);
  if (!mvpBlock) return undefined;

  const block = mvpBlock[1];
  const included: string[] = [];
  const excluded: string[] = [];

  let mode: 'included' | 'excluded' | null = null;

  for (const line of block.split('\n')) {
    const trimmed = line.trim();

    if (/^-\s*Included:/i.test(trimmed)) {
      mode = 'included';
      continue;
    }
    if (/^-\s*Excluded/i.test(trimmed)) {
      mode = 'excluded';
      continue;
    }
    if (/^-\s*Aha moment:/i.test(trimmed)) {
      const ahaMoment = trimmed.replace(/^-\s*Aha moment:\s*/i, '');
      // We'll capture it below
      continue;
    }
    if (/^-\s*Time-to-value/i.test(trimmed)) {
      continue;
    }

    if (trimmed.startsWith('-') && mode) {
      const item = trimmed.replace(/^-\s*/, '');
      if (mode === 'included') included.push(item);
      else excluded.push(item);
    }
  }

  // Aha moment
  const ahaMatch = block.match(/Aha moment:\s*(.+(?:\n(?!\s*-).+)*)/i);
  const ahaMoment = ahaMatch ? ahaMatch[1].trim() : undefined;

  // Time to value
  const ttvMatch = block.match(/Time-to-value target:\s*(.+)/i);
  const timeToValueTarget = ttvMatch ? ttvMatch[1].trim() : undefined;

  if (included.length === 0 && excluded.length === 0) return undefined;

  return { included, excluded, ahaMoment, timeToValueTarget };
}

function parseGrowthLoops(text: string): GrowthLoop[] {
  const loops: GrowthLoop[] = [];

  const block = text.match(/\*\*Growth Loops:\*\*\s*\n([\s\S]*?)(?=\*\*Constraints|---|\n##)/i);
  if (!block) return loops;

  // Each loop starts with a numbered line
  const loopPattern = /\d+\.\s*\*\*(.+?)\*\*:?\s*(.+?)(?:Requirements:\s*(.+?))?(?:\[([T][123](?:-[T]?[123])?)\])?$/gm;
  const lines = block[1].split('\n');

  let currentLoop: Partial<GrowthLoop> | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    const numMatch = trimmed.match(/^\d+\.\s*\*\*(.+?)\*\*:?\s*(.*)/);

    if (numMatch) {
      if (currentLoop?.name) {
        loops.push(currentLoop as GrowthLoop);
      }

      const name = numMatch[1];
      const rest = numMatch[2];

      // Extract mechanism (text before "Mechanism:" or "Requirements:")
      const mechMatch = rest.match(/(?:^|\s)Mechanism:\s*(.+?)(?:\.\s*Requirements:|$)/i);
      const mechanism = mechMatch ? mechMatch[1].trim() : rest.split('.')[0]?.trim() || '';

      // Extract tier
      const tierMatch = rest.match(/\[([T][123](?:-[T]?[123])?)\]/);

      currentLoop = {
        name,
        mechanism,
        requirements: [],
        tier: tierMatch ? (tierMatch[1].substring(0, 2) as any) : undefined,
      };
    }
  }

  if (currentLoop?.name) {
    loops.push(currentLoop as GrowthLoop);
  }

  return loops;
}

function parseConstraintsTable(table: any): HypothesisConstraint[] {
  const rows = tableToRows(table);
  if (rows.length < 2) return [];

  return rows.slice(1).map(row => ({
    fromHypothesis: row[0] || '',
    constraint: row[1] || '',
    ifChanges: row[2] || '',
  }));
}

function parseAdequacyCriteria(text: string): string[] {
  const block = text.match(/\*\*Adequacy Criteria:\*\*\s*\n([\s\S]*?)(?=\*\*Last Updated|---|\n##)/i);
  if (!block) return [];

  const criteria: string[] = [];
  for (const line of block[1].split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('-')) {
      criteria.push(trimmed.replace(/^-\s*/, ''));
    }
  }
  return criteria;
}
