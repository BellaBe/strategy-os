interface Props {
  t1: number;
  t2: number;
  t3: number;
  total: number;
}

export function EvidenceBar({ t1, t2, t3, total }: Props) {
  if (total === 0) {
    return (
      <div className="evidence-bar" role="img" aria-label="No evidence">
        <div className="evidence-bar__empty">No evidence</div>
      </div>
    );
  }

  const t1Pct = (t1 / total) * 100;
  const t2Pct = (t2 / total) * 100;
  const t3Pct = (t3 / total) * 100;

  return (
    <div
      className="evidence-bar"
      role="img"
      aria-label={`Evidence: ${t1} T1, ${t2} T2, ${t3} T3 of ${total} total`}
    >
      <div className="evidence-bar__track">
        {t1 > 0 && (
          <div
            className="evidence-bar__segment evidence-bar__segment--t1"
            style={{ width: `${t1Pct}%` }}
            title={`T1: ${t1}`}
          />
        )}
        {t2 > 0 && (
          <div
            className="evidence-bar__segment evidence-bar__segment--t2"
            style={{ width: `${t2Pct}%` }}
            title={`T2: ${t2}`}
          />
        )}
        {t3 > 0 && (
          <div
            className="evidence-bar__segment evidence-bar__segment--t3"
            style={{ width: `${t3Pct}%` }}
            title={`T3: ${t3}`}
          />
        )}
      </div>
      <div className="evidence-bar__legend">
        <span className="evidence-bar__count">{total} items</span>
      </div>
    </div>
  );
}
