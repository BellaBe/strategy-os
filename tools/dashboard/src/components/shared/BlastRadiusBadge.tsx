import type { BlastRadius } from '../../model/types';

interface Props {
  radius?: BlastRadius;
}

export function BlastRadiusBadge({ radius }: Props) {
  if (!radius) return null;
  return (
    <span className={`badge badge--blast-${radius.toLowerCase()}`}>
      {radius}
    </span>
  );
}
