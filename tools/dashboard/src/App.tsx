import { useReducer, useEffect, useCallback } from 'react';
import { designTokensCSS } from './tokens/design-tokens';
import type { AppState, AppEvent, ParseResult, HypothesisId, PanelId } from './model/types';
import { transition } from './model/types';
import { loadRegister } from './loader/index';
import { Header } from './components/Header';
import { ReadinessPanel } from './components/panels/ReadinessPanel';
import { EvidencePanel } from './components/panels/EvidencePanel';
import { RiskPanel } from './components/panels/RiskPanel';
import { DestructionPanel } from './components/panels/DestructionPanel';
import { SolutionPanel } from './components/panels/SolutionPanel';
import { HypothesisDetailPanel } from './components/panels/HypothesisDetailPanel';
import { computeReadiness } from './views/readiness';
import { computeEvidenceQuality } from './views/evidence-quality';
import { computeRiskMap } from './views/risk-map';
import { computeDestructionView } from './views/destruction';
import { computeSolutionView } from './views/solution';
import { computeHypothesisDetail } from './views/hypothesis-detail';
import './App.css';

function reducer(state: AppState, event: AppEvent): AppState {
  return transition(state, event);
}

const INITIAL_STATE: AppState = { _tag: 'Loading' };

function App() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const fetchData = useCallback(async () => {
    dispatch({ _tag: 'FetchStart' });

    // Try register.json first, fall back to hypotheses.md
    const jsonResult = await loadRegister('/register.json');
    if (jsonResult._tag === 'Ok') {
      dispatch({ _tag: 'FetchSuccess', data: jsonResult.data });
      return;
    }

    const mdResult = await loadRegister('/hypotheses.md');
    if (mdResult._tag === 'Ok') {
      dispatch({ _tag: 'FetchSuccess', data: mdResult.data });
    } else {
      const err = mdResult.error;
      dispatch({ _tag: 'FetchError', message: `${err._tag}: ${err.path}${'reason' in err ? ` — ${err.reason}` : ''}` });
    }
  }, []);

  useEffect(() => {
    // Inject design tokens
    const style = document.createElement('style');
    style.textContent = designTokensCSS;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSelectPanel = useCallback((panel: PanelId) => {
    dispatch({ _tag: 'SelectPanel', panel });
  }, []);

  const handleSelectHypothesis = useCallback((id: HypothesisId) => {
    dispatch({ _tag: 'SelectHypothesis', id });
  }, []);

  const handleBack = useCallback(() => {
    dispatch({ _tag: 'Back' });
  }, []);

  const handleRefresh = useCallback(() => {
    dispatch({ _tag: 'Refresh' });
    fetchData();
  }, [fetchData]);

  // Loading
  if (state._tag === 'Loading') {
    return (
      <div className="app">
        <div className="app__loading" role="status" aria-live="polite">
          <div className="loading-spinner" />
          <p className="loading-text">Loading hypothesis register...</p>
        </div>
      </div>
    );
  }

  // Error
  if (state._tag === 'Error') {
    return (
      <div className="app">
        <div className="app__error" role="alert">
          <h1 className="error-title">Failed to load register</h1>
          <p className="error-message">{state.message}</p>
          <button className="error-retry" onClick={handleRefresh}>Retry</button>
        </div>
      </div>
    );
  }

  // Loaded or Stale
  const data: ParseResult = state.data;
  const activePanel: PanelId = state.activePanel;
  const selectedHypothesis: HypothesisId | undefined = state.selectedHypothesis;

  const register = data.register;

  return (
    <div className="app">
      {state._tag === 'Stale' && (
        <div className="stale-banner" role="alert">
          Showing cached data. Refresh failed: {state.error}
        </div>
      )}

      <Header
        metadata={register.metadata}
        parseCompleteness={data.parseCompleteness}
        warningCount={data.warnings.length}
        activePanel={activePanel}
        onSelectPanel={handleSelectPanel}
        onRefresh={handleRefresh}
      />

      <main className="app__main">
        {activePanel === 'readiness' && (
          <ReadinessPanel
            view={computeReadiness(register)}
            onSelectHypothesis={handleSelectHypothesis}
          />
        )}

        {activePanel === 'evidence' && (
          <EvidencePanel view={computeEvidenceQuality(register)} />
        )}

        {activePanel === 'risk' && (
          <RiskPanel view={computeRiskMap(register)} />
        )}

        {activePanel === 'destruction' && (
          <DestructionPanel view={computeDestructionView(register)} />
        )}

        {activePanel === 'solution' && (
          <SolutionPanel view={computeSolutionView(register)} />
        )}

        {activePanel === 'detail' && selectedHypothesis && (
          <HypothesisDetailPanel
            view={computeHypothesisDetail(register, selectedHypothesis)}
            onBack={handleBack}
          />
        )}
      </main>
    </div>
  );
}

export default App;
