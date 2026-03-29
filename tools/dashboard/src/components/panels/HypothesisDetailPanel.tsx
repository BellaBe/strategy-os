import type { HypothesisDetailView, HypothesisId } from '../../model/types';
import { ConfidenceBadge } from '../shared/ConfidenceBadge';
import { TierBadge } from '../shared/TierBadge';
import { BlastRadiusBadge } from '../shared/BlastRadiusBadge';
import { DataTable } from '../shared/DataTable';

interface Props {
  view: HypothesisDetailView;
  onBack: () => void;
}

export function HypothesisDetailPanel({ view, onBack }: Props) {
  return (
    <section id="panel-detail" role="tabpanel" aria-label={`${view.label} Hypothesis Detail`} className="panel">
      <div className="panel__header">
        <button className="back-button" onClick={onBack} aria-label="Back to previous panel">
          Back
        </button>
        <div className="panel__header-content">
          <h2 className="panel__title">{view.label}</h2>
          <ConfidenceBadge confidence={view.confidence} size="md" />
        </div>
        {view.lastUpdated && (
          <p className="panel__date">Last updated: {view.lastUpdated}</p>
        )}
      </div>

      {/* Claim */}
      {view.claim && (
        <div className="detail-section">
          <h3 className="section-heading">Claim</h3>
          <blockquote className="claim-block">{view.claim}</blockquote>
        </div>
      )}

      {/* Update rationale */}
      {view.updateRationale && (
        <div className="detail-section">
          <h3 className="section-heading">Update Rationale</h3>
          <p className="rationale-text">{view.updateRationale}</p>
        </div>
      )}

      {/* Possibility space */}
      {view.possibilitySpace && (
        <div className="detail-section">
          <h3 className="section-heading">Possibility Space</h3>
          <div className="possibility-counts">
            <span className="possibility-count">{view.possibilitySpace.consideredCount} considered</span>
            <span className="possibility-count">{view.possibilitySpace.eliminatedCount} eliminated</span>
            <span className="possibility-count">{view.possibilitySpace.carriedCount} carried</span>
          </div>
          {view.possibilitySpace.entries.length > 0 && (
            <ul className="possibility-list">
              {view.possibilitySpace.entries.map((e, i) => (
                <li key={i} className={`possibility-item possibility-item--${e.status.toLowerCase()}`}>
                  <span className="possibility-item__status">{e.status}</span>
                  <span className="possibility-item__desc">{e.description}</span>
                </li>
              ))}
            </ul>
          )}
          {view.possibilitySpace.eliminations.length > 0 && (
            <details className="elimination-details">
              <summary>Elimination reasoning</summary>
              <ul className="elimination-list">
                {view.possibilitySpace.eliminations.map((e, i) => (
                  <li key={i}>
                    <strong>{e.candidate}:</strong> {e.reason}
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}

      {/* Evidence */}
      {view.evidence.length > 0 && (
        <div className="detail-section">
          <h3 className="section-heading">
            Evidence
            <span className="section-heading__count">{view.evidence.length}</span>
          </h3>
          <ul className="evidence-list">
            {view.evidence.map((e, i) => (
              <li key={i} className="evidence-item">
                <div className="evidence-item__meta">
                  {e.type && <span className="evidence-item__type">{e.type.replace(/_/g, ' ')}</span>}
                  <TierBadge tier={e.tier} />
                  {e.date && <span className="evidence-item__date">{e.date}</span>}
                </div>
                <p className="evidence-item__detail">{e.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Research sources */}
      {view.researchSources.length > 0 && (
        <div className="detail-section">
          <h3 className="section-heading">Research Sources</h3>
          <ul className="source-list">
            {view.researchSources.map((s, i) => (
              <li key={i} className="source-item">
                <TierBadge tier={s.tier} />
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="source-item__link">
                    {s.description || s.url}
                  </a>
                ) : (
                  <span>{s.description || s.raw}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Assumptions */}
      {view.assumptions.length > 0 && (
        <div className="detail-section">
          <h3 className="section-heading">
            Assumptions
            <span className="section-heading__count">{view.assumptions.length}</span>
          </h3>
          <ul className="assumption-list">
            {view.assumptions.map((a, i) => (
              <li key={i} className="assumption-item">
                <div className="assumption-item__header">
                  {a.tag && <span className="assumption-item__tag">{a.tag}</span>}
                  <TierBadge tier={a.tier} />
                  <BlastRadiusBadge radius={a.blastRadius} />
                  {a.loadBearing && <span className="badge badge--load-bearing">Load-Bearing</span>}
                </div>
                <p className="assumption-item__claim">{a.claim}</p>
                {a.falsification && (
                  <p className="assumption-item__detail"><strong>Falsification:</strong> {a.falsification}</p>
                )}
                {a.validation && (
                  <p className="assumption-item__detail"><strong>Validation:</strong> {a.validation}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Kill condition */}
      {view.killCondition && (
        <div className="detail-section">
          <h3 className="section-heading">Kill Signal</h3>
          <div className="kill-condition-block">{view.killCondition}</div>
        </div>
      )}

      {/* === Hypothesis-specific sections === */}

      {/* Segment: Observable Filters */}
      {view.observableFilters && view.observableFilters.length > 0 && (
        <div className="detail-section">
          <h3 className="section-heading">Observable Filters</h3>
          <ol className="observable-filters">
            {view.observableFilters.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Segment: Pain Scoring */}
      {view.painScoring && view.painScoring.length > 0 && (
        <div className="detail-section">
          <h3 className="section-heading">Pain Scoring</h3>
          <DataTable
            caption="Segment pain scoring"
            columns={[
              { key: 'segment', header: 'Segment', render: r => r.segment },
              { key: 'freq', header: 'Freq', render: r => r.frequency, align: 'center' },
              { key: 'sev', header: 'Sev', render: r => r.severity, align: 'center' },
              { key: 'breadth', header: 'Breadth', render: r => r.breadth, align: 'center' },
              { key: 'alt', header: 'Alt Inad.', render: r => r.alternativesInadequacy, align: 'center' },
              { key: 'comp', header: 'Composite', render: r => <strong>{r.composite}/625</strong>, align: 'center' },
            ]}
            data={view.painScoring}
          />
        </div>
      )}

      {/* VP: Jobs Addressed */}
      {view.jobs && (
        <div className="detail-section">
          <h3 className="section-heading">Jobs Addressed</h3>
          <dl className="jobs-list">
            {view.jobs.functional && <><dt>Functional</dt><dd>{view.jobs.functional}</dd></>}
            {view.jobs.emotional && <><dt>Emotional</dt><dd>{view.jobs.emotional}</dd></>}
            {view.jobs.social && <><dt>Social</dt><dd>{view.jobs.social}</dd></>}
          </dl>
        </div>
      )}

      {/* VP: Clause Validation */}
      {view.vpClauses && view.vpClauses.length > 0 && (
        <div className="detail-section">
          <h3 className="section-heading">VP Clause Validation</h3>
          <DataTable
            caption="Value proposition clause validation"
            columns={[
              { key: 'clause', header: 'Clause', render: r => r.clause },
              {
                key: 'status', header: 'Status', render: r => {
                  const cls = r.status === 'tested' ? 'text-passes' : 'text-warning';
                  return <span className={cls}>{r.status}</span>;
                }
              },
              { key: 'tier', header: 'Tier', render: r => <TierBadge tier={r.tier} /> },
              { key: 'evidence', header: 'Evidence', render: r => r.evidence || '' },
            ]}
            data={view.vpClauses}
          />
        </div>
      )}

      {/* Economics: Phase Economics */}
      {view.phaseEconomics && view.phaseEconomics.length > 0 && (
        <div className="detail-section">
          <h3 className="section-heading">Phase Economics</h3>
          {view.phaseEconomics.map((pe, i) => (
            <div key={i} className="phase-economics">
              <h4 className="subsection-heading">{pe.phase}: {pe.description}</h4>
              <DataTable
                caption={`${pe.phase} economic inputs`}
                columns={[
                  { key: 'name', header: 'Input', render: r => r.name },
                  { key: 'value', header: 'Value', render: r => r.value },
                  { key: 'tier', header: 'Tier', render: r => <TierBadge tier={r.tier} /> },
                  { key: 'source', header: 'Source', render: r => r.source || '' },
                ]}
                data={pe.inputs}
                compact
              />
            </div>
          ))}
        </div>
      )}

      {/* Economics: Scenario Analysis */}
      {view.scenarioAnalysis && (
        <div className="detail-section">
          <h3 className="section-heading">Scenario Analysis</h3>
          <div className="scenario-grid">
            {view.scenarioAnalysis.base && <ScenarioCard scenario={view.scenarioAnalysis.base} />}
            {view.scenarioAnalysis.optimistic && <ScenarioCard scenario={view.scenarioAnalysis.optimistic} />}
            {view.scenarioAnalysis.pessimistic && <ScenarioCard scenario={view.scenarioAnalysis.pessimistic} />}
          </div>
          {view.scenarioAnalysis.killScenario && (
            <div className="kill-scenario">
              <h4 className="subsection-heading">Kill Scenario</h4>
              <p>{view.scenarioAnalysis.killScenario}</p>
            </div>
          )}
        </div>
      )}

      {/* Economics: Cost Structure */}
      {view.costStructure && view.costStructure.length > 0 && (
        <div className="detail-section">
          <h3 className="section-heading">Cost Structure</h3>
          <DataTable
            caption="Monthly cost structure"
            columns={[
              { key: 'category', header: 'Category', render: r => r.category },
              { key: 'type', header: 'Type', render: r => r.type },
              { key: 'monthly', header: 'Monthly', render: r => r.monthly },
              { key: 'tier', header: 'Tier', render: r => <TierBadge tier={r.tier} /> },
            ]}
            data={view.costStructure}
            compact
          />
        </div>
      )}

      {/* Economics: Mode Thresholds */}
      {view.modeThresholds && view.modeThresholds.length > 0 && (
        <div className="detail-section">
          <h3 className="section-heading">HYBRID Mode Thresholds</h3>
          <DataTable
            caption="Mode threshold assessment"
            columns={[
              { key: 'metric', header: 'Metric', render: r => r.metric },
              { key: 'required', header: 'Required', render: r => r.required },
              { key: 'estimate', header: 'Estimate', render: r => r.estimate },
              {
                key: 'status', header: 'Status', render: r => {
                  const cls = r.status === 'PASSES' ? 'text-passes' : r.status === 'WARNING' ? 'text-warning' : 'text-fails';
                  return <span className={cls}>{r.status}</span>;
                }
              },
            ]}
            data={view.modeThresholds}
          />
        </div>
      )}
    </section>
  );
}

function ScenarioCard({ scenario }: { scenario: { label: string; ltvCacRatio?: number; paybackMonths?: number; status?: string } }) {
  const statusCls = scenario.status === 'PASSES' ? 'scenario-card--passes'
    : scenario.status === 'CRITICAL_FAILURE' ? 'scenario-card--fails'
    : scenario.status === 'WARNING' ? 'scenario-card--warning'
    : '';

  return (
    <div className={`scenario-card ${statusCls}`}>
      <h4 className="scenario-card__label">{scenario.label}</h4>
      {scenario.ltvCacRatio !== undefined && (
        <div className="scenario-card__metric">
          <span className="scenario-card__value">{scenario.ltvCacRatio}:1</span>
          <span className="scenario-card__name">LTV:CAC</span>
        </div>
      )}
      {scenario.paybackMonths !== undefined && (
        <div className="scenario-card__metric">
          <span className="scenario-card__value">{scenario.paybackMonths}mo</span>
          <span className="scenario-card__name">Payback</span>
        </div>
      )}
      {scenario.status && (
        <span className={`scenario-card__status scenario-card__status--${scenario.status?.toLowerCase().replace('_', '-')}`}>
          {scenario.status.replace('_', ' ')}
        </span>
      )}
    </div>
  );
}
