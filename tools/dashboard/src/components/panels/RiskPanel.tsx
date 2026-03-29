import type { RiskMapView } from '../../model/types';
import { TierBadge } from '../shared/TierBadge';
import { BlastRadiusBadge } from '../shared/BlastRadiusBadge';

interface Props {
  view: RiskMapView;
}

const RISK_ORDER = ['critical', 'high', 'medium', 'low'] as const;

const HYPOTHESIS_LABELS: Record<string, string> = {
  problem: 'Problem',
  segment: 'Segment',
  valueProposition: 'Value Proposition',
  unitEconomics: 'Unit Economics',
};

export function RiskPanel({ view }: Props) {
  return (
    <section id="panel-risk" role="tabpanel" aria-label="Risk Map" className="panel">
      <div className="panel__header">
        <h2 className="panel__title">Risk Map</h2>
        <p className="panel__subtitle">Which assumptions will kill the strategy if wrong?</p>
      </div>

      {/* Risk summary counters */}
      <div className="risk-summary">
        {RISK_ORDER.map(level => (
          <div key={level} className={`risk-counter risk-counter--${level}`}>
            <span className="risk-counter__value">{view.byCriticality[level]}</span>
            <span className="risk-counter__label">{level}</span>
          </div>
        ))}
      </div>

      {/* Assumptions by risk level */}
      {RISK_ORDER.map(level => {
        const items = view.assumptions.filter(a => a.riskLevel === level);
        if (items.length === 0) return null;

        return (
          <div key={level} className="risk-group">
            <h3 className={`risk-group__heading risk-group__heading--${level}`}>
              {level.charAt(0).toUpperCase() + level.slice(1)} Risk
              <span className="risk-group__count">{items.length}</span>
            </h3>
            <ul className="risk-group__list">
              {items.map((a, i) => (
                <li key={i} className={`risk-item risk-item--${level}`}>
                  <div className="risk-item__header">
                    <span className="risk-item__hypothesis">{HYPOTHESIS_LABELS[a.hypothesis] ?? a.hypothesis}</span>
                    <div className="risk-item__badges">
                      <TierBadge tier={a.tier} />
                      <BlastRadiusBadge radius={a.blastRadius} />
                      {a.loadBearing && <span className="badge badge--load-bearing">Load-Bearing</span>}
                    </div>
                  </div>
                  <p className="risk-item__claim">{a.claim}</p>
                  {a.falsification && (
                    <div className="risk-item__detail">
                      <strong>Falsification:</strong> {a.falsification}
                    </div>
                  )}
                  {a.validation && (
                    <div className="risk-item__detail">
                      <strong>Validation:</strong> {a.validation}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      {/* Kill conditions */}
      {view.killConditions.length > 0 && (
        <div className="kill-conditions">
          <h3 className="section-heading">Kill Signals</h3>
          <ul className="kill-conditions__list">
            {view.killConditions.map((kc, i) => (
              <li key={i} className="kill-condition-item">
                <span className="kill-condition-item__hypothesis">{HYPOTHESIS_LABELS[kc.hypothesis] ?? kc.hypothesis}</span>
                <p className="kill-condition-item__text">{kc.condition}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
