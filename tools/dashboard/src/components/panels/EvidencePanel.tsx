import type { EvidenceQualityView } from '../../model/types';
import { TierBadge } from '../shared/TierBadge';

interface Props {
  view: EvidenceQualityView;
}

export function EvidencePanel({ view }: Props) {
  return (
    <section id="panel-evidence" role="tabpanel" aria-label="Evidence Quality" className="panel">
      <div className="panel__header">
        <h2 className="panel__title">Evidence Quality Matrix</h2>
        <p className="panel__subtitle">Where is my evidence weak? What's T3 that should be T1?</p>
      </div>

      {/* Tier legend */}
      <div className="tier-legend">
        <div className="tier-legend__item">
          <span className="tier-legend__badge tier-legend__badge--t1">T1</span>
          <div className="tier-legend__text">
            <strong>Derivable</strong> — from public data through valid reasoning. Census, industry reports, published regulations, competitor websites.
          </div>
        </div>
        <div className="tier-legend__item">
          <span className="tier-legend__badge tier-legend__badge--t2">T2</span>
          <div className="tier-legend__text">
            <strong>Synthesized</strong> — plausible conclusions combining data with structural reasoning. "This segment likely has this problem because adjacent segments do." These are bets, not findings.
          </div>
        </div>
        <div className="tier-legend__item">
          <span className="tier-legend__badge tier-legend__badge--t3">T3</span>
          <div className="tier-legend__text">
            <strong>Needs ground truth</strong> — requires contact with reality the system doesn't have. "Customers will pay $X." No amount of research resolves these. Governor must run tests.
          </div>
        </div>
      </div>

      {/* Overall quality gauge */}
      <div className="quality-overview">
        <div className="quality-gauge">
          <div className="quality-gauge__score">
            {Math.round(view.overall.qualityScore * 100)}
          </div>
          <div className="quality-gauge__label">Quality Score</div>
          <div className="quality-gauge__sublabel">{view.overall.totalEvidence} total evidence items</div>
        </div>
        <div className="quality-breakdown">
          <div className="quality-breakdown__item quality-breakdown__item--t1">
            <span className="quality-breakdown__count">{view.overall.tierBreakdown.t1}</span>
            <span className="quality-breakdown__label">T1 Direct</span>
          </div>
          <div className="quality-breakdown__item quality-breakdown__item--t2">
            <span className="quality-breakdown__count">{view.overall.tierBreakdown.t2}</span>
            <span className="quality-breakdown__label">T2 Inferred</span>
          </div>
          <div className="quality-breakdown__item quality-breakdown__item--t3">
            <span className="quality-breakdown__count">{view.overall.tierBreakdown.t3}</span>
            <span className="quality-breakdown__label">T3 Stated</span>
          </div>
        </div>
      </div>

      {/* Per-hypothesis breakdown */}
      <div className="evidence-matrix">
        <h3 className="section-heading">By Hypothesis</h3>
        <div className="table-wrapper">
          <table className="data-table">
            <caption className="sr-only">Evidence tier breakdown by hypothesis</caption>
            <thead>
              <tr>
                <th>Hypothesis</th>
                <th style={{ textAlign: 'center' }}>T1</th>
                <th style={{ textAlign: 'center' }}>T2</th>
                <th style={{ textAlign: 'center' }}>T3</th>
                <th style={{ textAlign: 'center' }}>Total</th>
                <th style={{ textAlign: 'center' }}>Quality</th>
              </tr>
            </thead>
            <tbody>
              {view.byHypothesis.map(h => (
                <tr key={h.id}>
                  <td className="text-semibold">{h.label}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span className="tier-count tier-count--t1">{h.tierBreakdown.t1}</span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className="tier-count tier-count--t2">{h.tierBreakdown.t2}</span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className="tier-count tier-count--t3">{h.tierBreakdown.t3}</span>
                  </td>
                  <td style={{ textAlign: 'center' }}>{h.totalEvidence}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`quality-score quality-score--${h.qualityScore >= 0.7 ? 'good' : h.qualityScore >= 0.4 ? 'fair' : 'poor'}`}>
                      {Math.round(h.qualityScore * 100)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tier gaps */}
      {view.tierGaps.length > 0 && (
        <div className="tier-gaps">
          <h3 className="section-heading">Investigate: T3 Evidence in Validated Hypotheses</h3>
          <ul className="tier-gaps__list">
            {view.tierGaps.map((gap, i) => (
              <li key={i} className="tier-gap-item">
                <div className="tier-gap-item__header">
                  <TierBadge tier={gap.item.tier} />
                  <span className="tier-gap-item__hypothesis">{gap.hypothesis}</span>
                </div>
                <p className="tier-gap-item__detail">{gap.item.detail}</p>
                <p className="tier-gap-item__impact">{gap.impact}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
