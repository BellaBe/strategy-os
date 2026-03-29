import type {
  RegisterMetadata,
  BusinessMode,
  BuildMethod,
  GovernorDirective,
  ParseWarning,
} from '../model/types';

export function parseMetadata(text: string): { metadata: RegisterMetadata; directives: GovernorDirective[]; warnings: ParseWarning[] } {
  const warnings: ParseWarning[] = [];

  const created = extractSimple(text, /^Created:\s*(.+)/m);
  const lastReviewed = extractSimple(text, /^Last Reviewed:\s*(.+)/m);

  const businessModeRaw = extractSimple(text, /^Business Mode:\s*(\w+)/m);
  const businessMode = parseBusinessMode(businessModeRaw);

  const buildMethodRaw = extractSimple(text, /^Build Method:\s*(\w+)/m);
  const buildMethod = parseBuildMethod(buildMethodRaw);

  const sellGrowReadyRaw = extractSimple(text, /^Sell & Grow Ready:\s*(yes|no)/mi);
  const sellGrowReady = sellGrowReadyRaw?.toLowerCase() === 'yes';

  const metadata: RegisterMetadata = {
    created,
    lastReviewed,
    businessMode,
    buildMethod,
    sellGrowReady,
  };

  // Parse governor directives
  const directives = parseGovernorDirectives(text);

  return { metadata, directives, warnings };
}

function parseGovernorDirectives(text: string): GovernorDirective[] {
  const directives: GovernorDirective[] = [];

  const pattern = /\*\*Governor Directives\s*\((.+?)\):\*\*/g;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    const date = match[1].trim();
    const startIndex = match.index + match[0].length;
    const rest = text.substring(startIndex);

    // Collect lines starting with "- " until blank line or next section
    const lines = rest.split('\n');
    const items: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ')) {
        items.push(trimmed.substring(2));
      } else if (trimmed === '' && items.length > 0) {
        break;
      } else if (trimmed.startsWith('**') || trimmed.startsWith('##') || trimmed === '---') {
        break;
      }
    }

    if (items.length > 0) {
      directives.push({ date, directives: items });
    }
  }

  return directives;
}

function extractSimple(text: string, pattern: RegExp): string | undefined {
  const match = text.match(pattern);
  return match ? match[1].trim() : undefined;
}

function parseBusinessMode(raw: string | undefined): BusinessMode | undefined {
  if (!raw) return undefined;
  const upper = raw.toUpperCase();
  if (upper === 'VENTURE') return 'VENTURE';
  if (upper === 'BOOTSTRAP') return 'BOOTSTRAP';
  if (upper === 'HYBRID') return 'HYBRID';
  return undefined;
}

function parseBuildMethod(raw: string | undefined): BuildMethod | undefined {
  if (!raw) return undefined;
  const upper = raw.toUpperCase();
  if (upper === 'AUTONOMOUS') return 'AUTONOMOUS';
  if (upper === 'GOVERNOR_AUTHORED') return 'GOVERNOR_AUTHORED';
  if (upper === 'MIXED') return 'MIXED';
  return undefined;
}
