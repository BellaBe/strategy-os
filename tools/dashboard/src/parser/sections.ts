import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import type { Root, Content, Table, TableRow, TableCell, PhrasingContent } from 'mdast';

export type SectionId =
  | 'root'
  | 'problem'
  | 'segment'
  | 'valueProposition'
  | 'unitEconomics'
  | 'solutionDesign'
  | 'destructionLog';

export interface Section {
  id: SectionId;
  rawText: string;
  nodes: Content[];
}

const SECTION_PATTERNS: [RegExp, SectionId][] = [
  [/^##\s+1\.\s+Problem/i, 'problem'],
  [/^##\s+2\.\s+Segment/i, 'segment'],
  [/^##\s+3\.\s+Value\s+Proposition/i, 'valueProposition'],
  [/^##\s+4\.\s+Unit\s+Economics/i, 'unitEconomics'],
  [/^##\s+5\.\s+Solution/i, 'solutionDesign'],
  [/^##\s+Destruction\s+Log/i, 'destructionLog'],
];

function identifySection(text: string): SectionId | null {
  for (const [pattern, id] of SECTION_PATTERNS) {
    if (pattern.test(text)) return id;
  }
  return null;
}

function nodeToText(node: Content): string {
  if ('value' in node && typeof node.value === 'string') return node.value;
  if ('children' in node) {
    return (node.children as Content[]).map(nodeToText).join('');
  }
  return '';
}

function headingText(node: Content): string {
  if (node.type !== 'heading') return '';
  return (node.children as PhrasingContent[]).map(c => {
    if ('value' in c) return c.value;
    if ('children' in c) return (c.children as PhrasingContent[]).map(cc => ('value' in cc ? cc.value : '')).join('');
    return '';
  }).join('');
}

export function splitSections(markdown: string): Map<SectionId, Section> {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown) as Root;
  const sections = new Map<SectionId, Section>();

  let currentId: SectionId = 'root';
  let currentNodes: Content[] = [];
  let currentStart = 0;

  const lines = markdown.split('\n');

  function flushSection() {
    if (currentNodes.length > 0 || currentId === 'root') {
      const lastNode = currentNodes[currentNodes.length - 1];
      const endLine = lastNode?.position?.end?.line ?? currentStart;
      const rawText = lines.slice(Math.max(0, currentStart - 1), endLine).join('\n');
      sections.set(currentId, { id: currentId, rawText, nodes: currentNodes });
    }
  }

  for (const node of tree.children) {
    if (node.type === 'heading' && node.depth === 2) {
      const text = headingText(node);
      const sectionId = identifySection(`## ${text}`);
      if (sectionId) {
        flushSection();
        currentId = sectionId;
        currentNodes = [node];
        currentStart = node.position?.start?.line ?? 0;
        continue;
      }
    }
    currentNodes.push(node);
  }
  flushSection();

  return sections;
}

export function extractTablesFromNodes(nodes: Content[]): Table[] {
  const tables: Table[] = [];
  for (const node of nodes) {
    if (node.type === 'table') {
      tables.push(node as Table);
    }
  }
  return tables;
}

export function tableToRows(table: Table): string[][] {
  return table.children.map((row: TableRow) =>
    row.children.map((cell: TableCell) =>
      cell.children.map(c => nodeToText(c as Content)).join('').trim()
    )
  );
}

export function findTableNearHeading(nodes: Content[], headingPattern: RegExp): Table | undefined {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.type === 'heading') {
      const text = headingText(node);
      if (headingPattern.test(text)) {
        // Look for the next table node
        for (let j = i + 1; j < nodes.length; j++) {
          if (nodes[j].type === 'table') return nodes[j] as Table;
          if (nodes[j].type === 'heading') break;
        }
      }
    }
  }
  return undefined;
}
