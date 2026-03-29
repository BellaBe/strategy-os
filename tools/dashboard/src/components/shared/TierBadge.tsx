import type { EpistemicTier } from '../../model/types';

interface Props {
  tier?: EpistemicTier;
}

const LABELS: Record<EpistemicTier, string> = {
  T1: 'T1 Direct',
  T2: 'T2 Inferred',
  T3: 'T3 Stated',
};

export function TierBadge({ tier }: Props) {
  if (!tier) return null;
  return (
    <span className={`badge badge--tier-${tier.toLowerCase()}`}>
      {LABELS[tier]}
    </span>
  );
}
