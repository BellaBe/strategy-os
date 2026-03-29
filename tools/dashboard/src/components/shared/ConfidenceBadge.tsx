import type { ConfidenceState } from '../../model/types';

interface Props {
  confidence?: ConfidenceState;
  size?: 'sm' | 'md';
}

const LABELS: Record<ConfidenceState, string> = {
  SUPPORTED: 'Supported',
  RESEARCHED: 'Researched',
  UNVALIDATED: 'Unvalidated',
  BROKEN: 'Broken',
};

export function ConfidenceBadge({ confidence, size = 'md' }: Props) {
  if (!confidence) {
    return <span className="badge badge--unknown badge--sm">Unknown</span>;
  }

  const cls = `badge badge--confidence-${confidence.toLowerCase()} badge--${size}`;

  return (
    <span className={cls} role="status">
      {LABELS[confidence]}
    </span>
  );
}
