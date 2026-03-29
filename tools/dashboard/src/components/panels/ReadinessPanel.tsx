import type { ReadinessView, HypothesisId } from '../../model/types';
import { ConfidenceBadge } from '../shared/ConfidenceBadge';
import { EvidenceBar } from '../shared/EvidenceBar';

interface Props {
  view: ReadinessView;
  onSelectHypothesis: (id: HypothesisId) => void;
}

export function ReadinessPanel({ view, onSelectHypothesis }: Props) {
  return (
    <section
      id="panel-readiness"
      role="tabpanel"
      aria-label="Readiness Overview"
      className="panel"
    >
      <div className="panel__header">
        <h2 className="panel__title">Readiness Overview</h2>
        <p className="panel__subtitle">Am I Sell & Grow ready? What's blocking?</p>
      </div>

      {view.blockers.length > 0 && (
        <div className="blockers" role="alert">
          <h3 className="blockers__title">Blockers</h3>
          <ul className="blockers__list">
            {view.blockers.map((b, i) => (
              <li key={i} className="blockers__item">{b}</li>
            ))}
          </ul>
        </div>
      )}

      {view.warnings.length > 0 && (
        <div className="warnings-block">
          <h3 className="warnings-block__title">Warnings</h3>
          <ul className="warnings-block__list">
            {view.warnings.map((w, i) => (
              <li key={i} className="warnings-block__item">{w}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="hypothesis-grid">
        {view.hypothesisSummary.map(h => (
          <button
            key={h.id}
            className="hypothesis-card"
            onClick={() => onSelectHypothesis(h.id)}
            aria-label={`View ${h.label} hypothesis details`}
          >
            <div className="hypothesis-card__header">
              <h3 className="hypothesis-card__title">{h.label}</h3>
              <ConfidenceBadge confidence={h.confidence} />
            </div>

            <div className="hypothesis-card__evidence">
              <EvidenceBar
                t1={h.t1Count}
                t2={h.t2Count}
                t3={h.t3Count}
                total={h.evidenceCount}
              />
            </div>

            <div className="hypothesis-card__stats">
              <div className="hypothesis-card__stat">
                <span className="hypothesis-card__stat-value">{h.assumptionCount}</span>
                <span className="hypothesis-card__stat-label">Assumptions</span>
              </div>
              <div className="hypothesis-card__stat">
                <span className={`hypothesis-card__stat-value ${h.highBlastCount > 0 ? 'hypothesis-card__stat-value--danger' : ''}`}>
                  {h.highBlastCount}
                </span>
                <span className="hypothesis-card__stat-label">HIGH Blast</span>
              </div>
              <div className="hypothesis-card__stat">
                <span className={`hypothesis-card__stat-value ${h.hasKillCondition ? '' : 'hypothesis-card__stat-value--warn'}`}>
                  {h.hasKillCondition ? 'Yes' : 'No'}
                </span>
                <span className="hypothesis-card__stat-label">Kill Signal</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
