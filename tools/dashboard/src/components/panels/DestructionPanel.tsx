import type { DestructionView } from '../../model/types';
import { BlastRadiusBadge } from '../shared/BlastRadiusBadge';
import { DataTable } from '../shared/DataTable';

interface Props {
  view: DestructionView;
}

export function DestructionPanel({ view }: Props) {
  if (!view.hasDestructionLog) {
    return (
      <section id="panel-destruction" role="tabpanel" aria-label="Destruction Findings" className="panel">
        <div className="panel__header">
          <h2 className="panel__title">Destruction Findings</h2>
        </div>
        <div className="panel__empty" role="status">
          <p>No destruction log found. The strategy has not been stress-tested yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="panel-destruction" role="tabpanel" aria-label="Destruction Findings" className="panel">
      <div className="panel__header">
        <h2 className="panel__title">Destruction Findings</h2>
        <p className="panel__subtitle">What did the destruction phase find?</p>
      </div>

      {/* Assumption extraction */}
      {view.assumptions && (
        <div className="destruction-section">
          <h3 className="section-heading">
            Extracted Assumptions
            <span className="section-heading__count">{view.assumptions.total}</span>
          </h3>
          <div className="blast-summary">
            <span className="blast-summary__item blast-summary__item--high">
              {view.assumptions.byBlastRadius.high} HIGH
            </span>
            <span className="blast-summary__item blast-summary__item--medium">
              {view.assumptions.byBlastRadius.medium} MEDIUM
            </span>
            <span className="blast-summary__item blast-summary__item--low">
              {view.assumptions.byBlastRadius.low} LOW
            </span>
          </div>

          <DataTable
            caption="Destruction assumption extraction"
            columns={[
              { key: 'id', header: '#', render: r => r.id },
              { key: 'assumption', header: 'Assumption', render: r => r.assumption },
              { key: 'evidence', header: 'Evidence', render: r => r.evidenceTier },
              { key: 'falsification', header: 'Falsification', render: r => r.falsification },
              { key: 'blast', header: 'Blast', render: r => <BlastRadiusBadge radius={r.blastRadius} /> },
              { key: 'status', header: 'Status', render: r => <span className="text-sm">{r.status}</span> },
            ]}
            data={view.assumptions.entries}
            compact
          />
        </div>
      )}

      {/* Pre-mortem */}
      {view.preMortem && (
        <div className="destruction-section">
          <h3 className="section-heading">Pre-Mortem</h3>
          <div className="pre-mortem-narrative">
            {view.preMortem.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      )}

      {/* Red team */}
      {view.redTeamResponse && (
        <div className="destruction-section">
          <h3 className="section-heading">Red Team Response</h3>
          {view.redTeamResponse.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      )}

      {/* Constraint inversions */}
      {view.constraintInversions && (
        <div className="destruction-section">
          <h3 className="section-heading">Constraint Inversions</h3>
          <div className="inversion-summary">
            <span className="inversion-summary__item inversion-summary__item--survives">
              {view.constraintInversions.survives} Survives
            </span>
            <span className="inversion-summary__item inversion-summary__item--fails">
              {view.constraintInversions.fails} Fails
            </span>
            <span className="inversion-summary__item inversion-summary__item--marginal">
              {view.constraintInversions.withModification} With Modification
            </span>
          </div>
          <DataTable
            caption="Constraint inversion analysis"
            columns={[
              { key: 'assumption', header: 'Assumption Inverted', render: r => r.assumption },
              { key: 'consequence', header: 'Consequence', render: r => r.consequence },
              {
                key: 'survives', header: 'Survives?', render: r => {
                  const cls = /^Yes/i.test(r.survives) ? 'text-passes'
                    : /^No/i.test(r.survives) ? 'text-fails'
                    : 'text-warning';
                  return <span className={cls}>{r.survives}</span>;
                }
              },
            ]}
            data={view.constraintInversions.entries}
          />
        </div>
      )}

      {/* Evidence concentration */}
      {view.evidenceConcentration && (
        <div className="destruction-section">
          <h3 className="section-heading">Evidence Concentration Risk</h3>
          <DataTable
            caption="Evidence concentration analysis"
            columns={[
              { key: 'source', header: 'Source', render: r => r.source },
              { key: 'supports', header: 'Hypotheses Supported', render: r => r.hypothesesSupported },
              {
                key: 'risk', header: 'Risk Level', render: r => {
                  const isHigh = /HIGH|CONCENTRATED/i.test(r.riskLevel);
                  return <span className={isHigh ? 'text-fails' : 'text-muted'}>{r.riskLevel}</span>;
                }
              },
            ]}
            data={view.evidenceConcentration.entries}
          />
        </div>
      )}
    </section>
  );
}
