import type { SolutionView } from '../../model/types';
import { TierBadge } from '../shared/TierBadge';
import { DataTable } from '../shared/DataTable';

interface Props {
  view: SolutionView;
}

export function SolutionPanel({ view }: Props) {
  if (!view.hasSolutionDesign) {
    return (
      <section id="panel-solution" role="tabpanel" aria-label="Solution Summary" className="panel">
        <div className="panel__header">
          <h2 className="panel__title">Solution Summary</h2>
        </div>
        <div className="panel__empty" role="status">
          <p>No solution design found in the register.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="panel-solution" role="tabpanel" aria-label="Solution Summary" className="panel">
      <div className="panel__header">
        <h2 className="panel__title">Solution Summary</h2>
        <p className="panel__subtitle">What does the solution look like?</p>
      </div>

      {/* Growth architecture */}
      {view.growthArchitecture && (
        <div className="solution-architecture">
          <h3 className="section-heading">Growth Architecture</h3>
          <p className="architecture-label">{view.growthArchitecture}</p>
        </div>
      )}

      {/* Phase timeline */}
      {view.phases.length > 0 && (
        <div className="phase-timeline">
          <h3 className="section-heading">Phases</h3>
          <div className="phases">
            {view.phases.map((phase, i) => (
              <div key={i} className="phase-card">
                <div className="phase-card__header">
                  <span className="phase-card__name">{phase.name}</span>
                  <span className="phase-card__timeline">{phase.timeline}</span>
                </div>
                <p className="phase-card__description">{phase.description}</p>
                {phase.details.length > 0 && (
                  <ul className="phase-card__details">
                    {phase.details.map((d, j) => (
                      <li key={j}>{d}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feature map */}
      <div className="feature-map">
        <h3 className="section-heading">Feature Map</h3>

        {view.featuresByPriority.mvp.length > 0 && (
          <div className="feature-group">
            <h4 className="feature-group__heading feature-group__heading--mvp">
              MVP
              <span className="feature-group__count">{view.featuresByPriority.mvp.length}</span>
            </h4>
            <DataTable
              caption="MVP features"
              columns={[
                { key: 'feature', header: 'Feature', render: r => r.feature },
                { key: 'problem', header: 'Solves', render: r => r.solvesProblem },
                { key: 'job', header: 'Job', render: r => r.jobDimension || '' },
                { key: 'phase', header: 'Phase', render: r => r.phase || '' },
                { key: 'tier', header: 'Tier', render: r => <TierBadge tier={r.tier} /> },
              ]}
              data={view.featuresByPriority.mvp}
              compact
            />
          </div>
        )}

        {view.featuresByPriority.postMvp.length > 0 && (
          <div className="feature-group">
            <h4 className="feature-group__heading feature-group__heading--post">
              Post-MVP
              <span className="feature-group__count">{view.featuresByPriority.postMvp.length}</span>
            </h4>
            <DataTable
              caption="Post-MVP features"
              columns={[
                { key: 'feature', header: 'Feature', render: r => r.feature },
                { key: 'problem', header: 'Solves', render: r => r.solvesProblem },
                { key: 'job', header: 'Job', render: r => r.jobDimension || '' },
                { key: 'phase', header: 'Phase', render: r => r.phase || '' },
              ]}
              data={view.featuresByPriority.postMvp}
              compact
            />
          </div>
        )}

        {view.featuresByPriority.future.length > 0 && (
          <div className="feature-group">
            <h4 className="feature-group__heading feature-group__heading--future">
              Future
              <span className="feature-group__count">{view.featuresByPriority.future.length}</span>
            </h4>
            <DataTable
              caption="Future features"
              columns={[
                { key: 'feature', header: 'Feature', render: r => r.feature },
                { key: 'problem', header: 'Solves', render: r => r.solvesProblem },
              ]}
              data={view.featuresByPriority.future}
              compact
            />
          </div>
        )}
      </div>

      {/* MVP scope */}
      {view.mvpScope && (
        <div className="mvp-scope">
          <h3 className="section-heading">MVP Scope</h3>
          <div className="mvp-scope__content">
            {view.mvpScope.included.length > 0 && (
              <div className="mvp-scope__section">
                <h4 className="subsection-heading">Included</h4>
                <ul className="mvp-scope__list mvp-scope__list--included">
                  {view.mvpScope.included.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {view.mvpScope.excluded.length > 0 && (
              <div className="mvp-scope__section">
                <h4 className="subsection-heading">Excluded</h4>
                <ul className="mvp-scope__list mvp-scope__list--excluded">
                  {view.mvpScope.excluded.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {view.mvpScope.ahaMoment && (
              <div className="mvp-scope__aha">
                <h4 className="subsection-heading">Aha Moment</h4>
                <p>{view.mvpScope.ahaMoment}</p>
              </div>
            )}
            {view.mvpScope.timeToValueTarget && (
              <p className="mvp-scope__ttv">
                <strong>Time-to-value target:</strong> {view.mvpScope.timeToValueTarget}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Growth loops */}
      {view.growthLoops.length > 0 && (
        <div className="growth-loops">
          <h3 className="section-heading">Growth Loops</h3>
          <div className="growth-loops__grid">
            {view.growthLoops.map((loop, i) => (
              <div key={i} className="growth-loop-card">
                <h4 className="growth-loop-card__name">{loop.name}</h4>
                <p className="growth-loop-card__mechanism">{loop.mechanism}</p>
                {loop.tier && <TierBadge tier={loop.tier} />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Adequacy criteria */}
      {view.adequacyCriteria.length > 0 && (
        <div className="adequacy-criteria">
          <h3 className="section-heading">Adequacy Criteria</h3>
          <ul className="adequacy-list">
            {view.adequacyCriteria.map((c, i) => (
              <li key={i} className="adequacy-list__item">{c}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Constraints */}
      {view.constraints.length > 0 && (
        <div className="constraints-section">
          <h3 className="section-heading">Constraints from Hypotheses</h3>
          <DataTable
            caption="Hypothesis constraints on solution"
            columns={[
              { key: 'from', header: 'From', render: r => r.fromHypothesis },
              { key: 'constraint', header: 'Constraint', render: r => r.constraint },
              { key: 'if', header: 'If Changes', render: r => r.ifChanges },
            ]}
            data={view.constraints}
          />
        </div>
      )}
    </section>
  );
}
