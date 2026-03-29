import type {
  EvidenceItem,
  EvidenceType,
  EpistemicTier,
  ResearchSource,
  Assumption,
  EpistemicTag,
  BlastRadius,
  ParseWarning,
} from '../model/types';

const EVIDENCE_TYPES: Set<string> = new Set([
  'CONVERSATION', 'OBSERVATION', 'DATA', 'FOUNDER_STATED', 'WEB_RESEARCH', 'COMPETITIVE_ANALYSIS',
]);

const TIERS: Set<string> = new Set(['T1', 'T2', 'T3']);
const TAGS: Set<string> = new Set(['K', 'B', 'O']);
const BLAST_RADII: Set<string> = new Set(['LOW', 'MEDIUM', 'HIGH']);

export function extractField(text: string, fieldName: string): string | undefined {
  // Handles multi-line: captures from **Field:** to next **Field:** or end
  const escaped = fieldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(
    `\\*\\*${escaped}:\\*\\*\\s*(.+(?:\\n(?!\\*\\*|---).+)*)`,
    'm'
  );
  const match = text.match(pattern);
  return match ? match[1].trim() : undefined;
}

export function extractBoldField(text: string, fieldName: string): string | undefined {
  return extractField(text, fieldName);
}

export function extractEvidenceItems(text: string, sectionName: string): { items: EvidenceItem[]; warnings: ParseWarning[] } {
  const items: EvidenceItem[] = [];
  const warnings: ParseWarning[] = [];

  // Find the evidence block: between **Evidence:** and the next **Field:** or ---
  const evidenceBlock = extractBlockAfterLabel(text, 'Evidence');
  if (!evidenceBlock) return { items, warnings };

  const lines = evidenceBlock.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('-')) continue;
    if (trimmed.startsWith('->') || trimmed.startsWith('- >')) continue;

    const raw = trimmed.replace(/^-\s*/, '');

    // Try structured extraction: [TYPE] [TIER] DATE -- detail
    const structuredMatch = trimmed.match(
      /^-\s*\[(\w+(?:_\w+)*)\]\s*\[([T][123])\]\s*(\d{4}-\d{2}-\d{2})\s*--\s*(.+)/
    );

    if (structuredMatch) {
      const [, typeStr, tierStr, date, detail] = structuredMatch;
      items.push({
        raw,
        type: EVIDENCE_TYPES.has(typeStr) ? (typeStr as EvidenceType) : undefined,
        tier: TIERS.has(tierStr) ? (tierStr as EpistemicTier) : undefined,
        date,
        detail: detail.trim(),
      });
    } else {
      // Fallback: use raw as detail
      items.push({ raw, detail: raw });
      warnings.push({
        section: sectionName,
        field: 'evidence',
        message: `Could not parse structured evidence: ${raw.substring(0, 80)}`,
        severity: 'info',
      });
    }
  }

  return { items, warnings };
}

export function extractResearchSources(text: string, sectionName: string): { items: ResearchSource[]; warnings: ParseWarning[] } {
  const items: ResearchSource[] = [];
  const warnings: ParseWarning[] = [];

  const block = extractBlockAfterLabel(text, 'Research Sources');
  if (!block) return { items, warnings };

  const lines = block.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('-')) continue;

    const raw = trimmed.replace(/^-\s*/, '');

    // Try: [TIER] DATE -- URL: description  OR  [TIER] DATE -- description
    const match = trimmed.match(
      /^-\s*\[([T][123])\]\s*(\d{4}-\d{2}-\d{2})\s*--\s*(https?:\/\/\S+)?:?\s*(.*)/
    );

    if (match) {
      const [, tierStr, date, url, description] = match;
      items.push({
        raw,
        tier: TIERS.has(tierStr) ? (tierStr as EpistemicTier) : undefined,
        date,
        url: url || undefined,
        description: description?.trim() || url || raw,
      });
    } else {
      items.push({ raw, description: raw });
    }
  }

  return { items, warnings };
}

export function extractAssumptions(text: string, sectionName: string): { items: Assumption[]; warnings: ParseWarning[] } {
  const items: Assumption[] = [];
  const warnings: ParseWarning[] = [];

  const block = extractBlockAfterLabel(text, 'Assumptions');
  if (!block) return { items, warnings };

  const lines = block.split('\n');
  let currentAssumption: Partial<Assumption> & { raw: string; claim: string } | null = null;

  function flushAssumption() {
    if (currentAssumption) {
      items.push({
        raw: currentAssumption.raw,
        tag: currentAssumption.tag,
        tier: currentAssumption.tier,
        claim: currentAssumption.claim,
        loadBearing: currentAssumption.loadBearing ?? false,
        blastRadius: currentAssumption.blastRadius,
        falsification: currentAssumption.falsification,
        validation: currentAssumption.validation,
      });
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();

    // Continuation lines for falsification/validation
    if (trimmed.startsWith('->') || trimmed.startsWith('- >')) {
      if (currentAssumption) {
        const contMatch = trimmed.match(/^-?>\s*(Falsification|Validation):\s*(.+)/i);
        if (contMatch) {
          const [, fieldType, value] = contMatch;
          if (fieldType.toLowerCase() === 'falsification') {
            currentAssumption.falsification = value.trim();
          } else {
            currentAssumption.validation = value.trim();
          }
        }
      }
      continue;
    }

    if (!trimmed.startsWith('-')) continue;

    // New assumption line
    flushAssumption();

    const raw = trimmed.replace(/^-\s*/, '');

    // Try: [TAG] [TIER] claim [LOAD-BEARING] [BLAST:LEVEL]
    const match = trimmed.match(
      /^-\s*\[([KBO])\]\s*\[([T][123])\]\s*(.+)/
    );

    if (match) {
      const [, tagStr, tierStr, rest] = match;
      const loadBearing = /\[LOAD-BEARING\]/i.test(rest);
      const blastMatch = rest.match(/\[BLAST:(\w+)\]/i);
      const blastRadius = blastMatch && BLAST_RADII.has(blastMatch[1].toUpperCase())
        ? (blastMatch[1].toUpperCase() as BlastRadius)
        : undefined;

      // Extract claim: everything before [LOAD-BEARING] or [BLAST:...]
      let claim = rest
        .replace(/\[LOAD-BEARING\]/gi, '')
        .replace(/\[BLAST:\w+\]/gi, '')
        .trim();

      // Remove trailing period if any
      claim = claim.replace(/\.\s*$/, '').trim();

      currentAssumption = {
        raw,
        tag: TAGS.has(tagStr) ? (tagStr as EpistemicTag) : undefined,
        tier: TIERS.has(tierStr) ? (tierStr as EpistemicTier) : undefined,
        claim,
        loadBearing,
        blastRadius,
      };
    } else {
      currentAssumption = { raw, claim: raw, loadBearing: false };
      warnings.push({
        section: sectionName,
        field: 'assumptions',
        message: `Could not parse structured assumption: ${raw.substring(0, 80)}`,
        severity: 'info',
      });
    }
  }

  flushAssumption();
  return { items, warnings };
}

function extractBlockAfterLabel(text: string, label: string): string | null {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`\\*\\*${escaped}:\\*\\*`, 'im');
  const match = text.match(pattern);
  if (!match || match.index === undefined) return null;

  const startIndex = match.index + match[0].length;
  const rest = text.substring(startIndex);

  // Find the end: next **Label:** or --- or ## heading
  const endMatch = rest.match(/\n\*\*[A-Z][^*]+:\*\*|\n---|\n##\s/);
  const endIndex = endMatch?.index ?? rest.length;

  return rest.substring(0, endIndex);
}

export function extractPossibilitySpace(text: string): {
  considered: { description: string; status: 'PRIMARY' | 'ELIMINATED' | 'CARRIED' }[];
  eliminated: { candidate: string; reason: string }[];
  alternativesCarried: string[];
} | undefined {
  const block = extractBlockAfterLabel(text, 'Possibility Space');
  if (!block) return undefined;

  const considered: { description: string; status: 'PRIMARY' | 'ELIMINATED' | 'CARRIED' }[] = [];
  const eliminated: { candidate: string; reason: string }[] = [];
  const alternativesCarried: string[] = [];

  // Split into sub-sections: Considered, Eliminated, Alternatives carried
  const sections = block.split(/\n\s*-\s*(Considered|Eliminated|Alternatives carried):?/i);

  // Parse Considered items
  const consideredBlock = extractSubBlock(block, 'Considered');
  if (consideredBlock) {
    const lines = consideredBlock.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      const itemMatch = trimmed.match(/^\d+\.\s*(.+)/);
      if (itemMatch) {
        const desc = itemMatch[1];
        let status: 'PRIMARY' | 'ELIMINATED' | 'CARRIED' = 'CARRIED';
        if (/\(PRIMARY/i.test(desc)) status = 'PRIMARY';
        else if (/\(eliminated\)/i.test(desc)) status = 'ELIMINATED';
        else if (/\(carried/i.test(desc)) status = 'CARRIED';
        considered.push({ description: desc.replace(/\s*\((?:PRIMARY|eliminated|carried)[^)]*\)/gi, '').trim(), status });
      }
    }
  }

  // Parse Eliminated items
  const eliminatedBlock = extractSubBlock(block, 'Eliminated');
  if (eliminatedBlock) {
    const lines = eliminatedBlock.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('-')) {
        const text = trimmed.replace(/^-\s*/, '');
        const dashIndex = text.indexOf(' -- ');
        if (dashIndex > 0) {
          eliminated.push({
            candidate: text.substring(0, dashIndex).trim(),
            reason: text.substring(dashIndex + 4).trim(),
          });
        } else {
          // Try splitting on first semicolon or period for reason
          const sepIndex = text.indexOf(';');
          if (sepIndex > 0) {
            eliminated.push({
              candidate: text.substring(0, sepIndex).trim(),
              reason: text.substring(sepIndex + 1).trim(),
            });
          } else {
            eliminated.push({ candidate: text, reason: '' });
          }
        }
      }
    }
  }

  // Parse Alternatives carried
  const altBlock = extractSubBlock(block, 'Alternatives carried');
  if (altBlock) {
    const lines = altBlock.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('-')) {
        alternativesCarried.push(trimmed.replace(/^-\s*/, ''));
      } else if (trimmed.length > 0 && !trimmed.startsWith('*')) {
        alternativesCarried.push(trimmed);
      }
    }
  }

  if (considered.length === 0 && eliminated.length === 0 && alternativesCarried.length === 0) {
    return undefined;
  }

  return { considered, eliminated, alternativesCarried };
}

function extractSubBlock(text: string, label: string): string | null {
  const pattern = new RegExp(`-\\s*${label}:?\\s*\\n`, 'i');
  const match = text.match(pattern);
  if (!match || match.index === undefined) return null;

  const start = match.index + match[0].length;
  const rest = text.substring(start);

  // End at next "- Label:" at same indentation or end
  const endMatch = rest.match(/\n\s*-\s*(Considered|Eliminated|Alternatives carried):?\s*\n/i);
  const endIndex = endMatch?.index ?? rest.length;

  return rest.substring(0, endIndex);
}

export function extractObservableFilters(text: string): string[] {
  const block = extractBlockAfterLabel(text, 'Observable Filters');
  if (!block) return [];

  const filters: string[] = [];
  for (const line of block.split('\n')) {
    const match = line.trim().match(/^\d+\.\s*(.+)/);
    if (match) filters.push(match[1].trim());
  }
  return filters;
}

export function extractJobsAddressed(text: string): { functional?: string; emotional?: string; social?: string } | undefined {
  const block = extractBlockAfterLabel(text, 'Jobs Addressed');
  if (!block) return undefined;

  const jobs: { functional?: string; emotional?: string; social?: string } = {};
  for (const line of block.split('\n')) {
    const trimmed = line.trim();
    const match = trimmed.match(/^-\s*(Functional|Emotional|Social):\s*(.+)/i);
    if (match) {
      const key = match[1].toLowerCase() as 'functional' | 'emotional' | 'social';
      jobs[key] = match[2].trim();
    }
  }

  return (jobs.functional || jobs.emotional || jobs.social) ? jobs : undefined;
}
