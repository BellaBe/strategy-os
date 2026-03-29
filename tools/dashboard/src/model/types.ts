// === Register Root ===

export interface HypothesisRegister {
  metadata: RegisterMetadata;
  hypotheses: {
    problem: Hypothesis;
    segment: Hypothesis;
    valueProposition: Hypothesis;
    unitEconomics: Hypothesis;
  };
  solutionDesign?: SolutionDesign;
  destructionLog?: DestructionLog;
  governorDirectives?: GovernorDirective[];
}

// === Metadata ===

export interface RegisterMetadata {
  created?: string;
  lastReviewed?: string;
  businessMode?: BusinessMode;
  buildMethod?: BuildMethod;
  sellGrowReady: boolean;
}

export type BusinessMode = 'VENTURE' | 'BOOTSTRAP' | 'HYBRID';
export type BuildMethod = 'AUTONOMOUS' | 'GOVERNOR_AUTHORED' | 'MIXED';

// === Governor Directives ===

export interface GovernorDirective {
  date: string;
  directives: string[];
}

// === Hypothesis ===

export interface Hypothesis {
  id: HypothesisId;
  claim?: string;
  confidence?: ConfidenceState;
  possibilitySpace?: PossibilitySpace;
  evidence: EvidenceItem[];
  researchSources: ResearchSource[];
  assumptions: Assumption[];
  killCondition?: string;
  lastUpdated?: string;
  updateRationale?: string;

  // Hypothesis-specific extensions
  observableFilters?: string[];
  painScoring?: PainScoreEntry[];
  jobsAddressed?: JobsAddressed;
  vpClauseValidation?: VPClause[];
  twoPhaseEconomics?: PhaseEconomics[];
  scenarioAnalysis?: ScenarioAnalysis;
  costStructure?: CostEntry[];
  modeThresholds?: ModeThreshold[];
}

export type HypothesisId = 'problem' | 'segment' | 'valueProposition' | 'unitEconomics';
export type ConfidenceState = 'UNVALIDATED' | 'RESEARCHED' | 'SUPPORTED' | 'BROKEN';

// === Possibility Space ===

export interface PossibilitySpace {
  considered: PossibilityCandidate[];
  eliminated: EliminationEntry[];
  alternativesCarried: string[];
}

export interface PossibilityCandidate {
  description: string;
  status: 'PRIMARY' | 'ELIMINATED' | 'CARRIED';
}

export interface EliminationEntry {
  candidate: string;
  reason: string;
}

// === Evidence ===

export interface EvidenceItem {
  raw: string;
  type?: EvidenceType;
  tier?: EpistemicTier;
  date?: string;
  detail: string;
}

export type EvidenceType =
  | 'CONVERSATION'
  | 'OBSERVATION'
  | 'DATA'
  | 'FOUNDER_STATED'
  | 'WEB_RESEARCH'
  | 'COMPETITIVE_ANALYSIS';

export type EpistemicTier = 'T1' | 'T2' | 'T3';

// === Research Sources ===

export interface ResearchSource {
  raw: string;
  tier?: EpistemicTier;
  date?: string;
  url?: string;
  description?: string;
}

// === Assumptions ===

export interface Assumption {
  raw: string;
  tag?: EpistemicTag;
  tier?: EpistemicTier;
  claim: string;
  loadBearing: boolean;
  blastRadius?: BlastRadius;
  falsification?: string;
  validation?: string;
}

export type EpistemicTag = 'K' | 'B' | 'O';
export type BlastRadius = 'LOW' | 'MEDIUM' | 'HIGH';

// === Hypothesis-Specific Extensions ===

export interface PainScoreEntry {
  segment: string;
  frequency: number;
  severity: number;
  breadth: number;
  alternativesInadequacy: number;
  composite: number;
}

export interface JobsAddressed {
  functional?: string;
  emotional?: string;
  social?: string;
}

export interface VPClause {
  clause: string;
  status: string;
  tier?: EpistemicTier;
  evidence?: string;
}

export interface PhaseEconomics {
  phase: string;
  description: string;
  inputs: EconomicInput[];
  projections?: string;
}

export interface EconomicInput {
  name: string;
  value: string;
  tier?: EpistemicTier;
  source?: string;
}

export interface ScenarioAnalysis {
  base?: EconomicScenario;
  optimistic?: EconomicScenario;
  pessimistic?: EconomicScenario;
  killScenario?: string;
}

export interface EconomicScenario {
  label: string;
  arpu?: string;
  churn?: string;
  cac?: string;
  ltv?: string;
  ltvCacRatio?: number;
  paybackMonths?: number;
  status?: 'PASSES' | 'WARNING' | 'CRITICAL_FAILURE';
}

export interface CostEntry {
  category: string;
  type: 'Fixed' | 'Variable';
  monthly: string;
  tier?: EpistemicTier;
}

export interface ModeThreshold {
  metric: string;
  required: string;
  estimate: string;
  status: 'PASSES' | 'WARNING' | 'FAILS';
}

// === Solution Design ===

export interface SolutionDesign {
  growthArchitecture?: string;
  architectureRationale?: string;
  phases?: SolutionPhase[];
  featureMap: FeatureMapEntry[];
  mvpScope?: MVPScope;
  growthLoops: GrowthLoop[];
  constraintsFromHypotheses: HypothesisConstraint[];
  adequacyCriteria: string[];
  lastUpdated?: string;
}

export interface SolutionPhase {
  name: string;
  timeline: string;
  description: string;
  details: string[];
}

export interface FeatureMapEntry {
  feature: string;
  solvesProblem: string;
  jobDimension?: 'Functional' | 'Emotional' | 'Social' | string;
  priority?: 'MVP' | 'POST_MVP' | 'FUTURE';
  phase?: string;
  tier?: EpistemicTier;
}

export interface MVPScope {
  included: string[];
  excluded: string[];
  ahaMoment?: string;
  timeToValueTarget?: string;
}

export interface GrowthLoop {
  name: string;
  mechanism: string;
  requirements: string[];
  tier?: EpistemicTier;
}

export interface HypothesisConstraint {
  fromHypothesis: string;
  constraint: string;
  ifChanges: string;
}

// === Destruction Log ===

export interface DestructionLog {
  assumptionExtraction: DestructionAssumption[];
  preMortem?: PreMortem;
  redTeam?: RedTeam;
  constraintInversions: ConstraintInversion[];
  evidenceConcentration: EvidenceConcentrationEntry[];
}

export interface DestructionAssumption {
  id: string;
  assumption: string;
  evidenceTier: string;
  falsification: string;
  blastRadius: BlastRadius;
  status: string;
}

export interface PreMortem {
  narrative: string;
  keyFindings: string[];
}

export interface RedTeam {
  scenario: string;
  responses: RedTeamResponse[];
  impactAssessment?: string;
  strategySurvivalDependsOn: string[];
  modifiedStrategyResponse?: string;
}

export interface RedTeamResponse {
  timeline: string;
  action: string;
}

export interface ConstraintInversion {
  assumption: string;
  consequence: string;
  strategySurvives: 'Yes' | 'No' | 'Marginal' | string;
}

export interface EvidenceConcentrationEntry {
  source: string;
  hypothesesSupported: string;
  riskLevel: string;
}

// === Parser Types ===

export interface ParseWarning {
  section: string;
  field: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
}

export interface ParseResult {
  register: HypothesisRegister;
  warnings: ParseWarning[];
  parseCompleteness: number;
}

// === View Models ===

export interface ReadinessView {
  sellGrowReady: boolean;
  businessMode?: BusinessMode;
  buildMethod?: BuildMethod;

  hypothesisSummary: {
    id: HypothesisId;
    label: string;
    confidence?: ConfidenceState;
    evidenceCount: number;
    t1Count: number;
    t2Count: number;
    t3Count: number;
    assumptionCount: number;
    highBlastCount: number;
    hasKillCondition: boolean;
  }[];

  blockers: string[];
  warnings: string[];
}

export interface EvidenceQualityView {
  byHypothesis: {
    id: HypothesisId;
    label: string;
    tierBreakdown: { t1: number; t2: number; t3: number };
    typeBreakdown: Partial<Record<EvidenceType, number>>;
    totalEvidence: number;
    qualityScore: number;
  }[];

  overall: {
    totalEvidence: number;
    tierBreakdown: { t1: number; t2: number; t3: number };
    qualityScore: number;
  };

  tierGaps: {
    hypothesis: HypothesisId;
    item: EvidenceItem;
    impact: string;
  }[];
}

export interface RiskMapView {
  assumptions: {
    hypothesis: HypothesisId;
    claim: string;
    tag?: EpistemicTag;
    tier?: EpistemicTier;
    blastRadius?: BlastRadius;
    loadBearing: boolean;
    falsification?: string;
    validation?: string;
    riskLevel: 'critical' | 'high' | 'medium' | 'low';
  }[];

  byCriticality: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };

  killConditions: {
    hypothesis: HypothesisId;
    condition: string;
  }[];
}

export interface DestructionView {
  hasDestructionLog: boolean;

  assumptions?: {
    total: number;
    byBlastRadius: { high: number; medium: number; low: number };
    entries: DestructionAssumption[];
  };

  preMortem?: {
    narrative: string;
    keyFindings: string[];
  };

  redTeam?: {
    scenario: string;
    responses: RedTeamResponse[];
    survivalDependsOn: string[];
  };

  constraintInversions?: {
    survives: number;
    fails: number;
    marginal: number;
    entries: ConstraintInversion[];
  };

  evidenceConcentration?: {
    highRisk: EvidenceConcentrationEntry[];
    entries: EvidenceConcentrationEntry[];
  };
}

export interface SolutionView {
  hasSolutionDesign: boolean;
  growthArchitecture?: string;
  phases: SolutionPhase[];

  featuresByPriority: {
    mvp: FeatureMapEntry[];
    postMvp: FeatureMapEntry[];
    future: FeatureMapEntry[];
  };

  mvpScope?: MVPScope;
  growthLoops: GrowthLoop[];
  constraints: HypothesisConstraint[];
  adequacyCriteria: string[];
}

export interface HypothesisDetailView {
  id: HypothesisId;
  label: string;
  claim?: string;
  confidence?: ConfidenceState;

  possibilitySpace?: {
    consideredCount: number;
    eliminatedCount: number;
    carriedCount: number;
    entries: PossibilityCandidate[];
    eliminations: EliminationEntry[];
    carried: string[];
  };

  evidence: EvidenceItem[];
  researchSources: ResearchSource[];
  assumptions: Assumption[];
  killCondition?: string;
  lastUpdated?: string;
  updateRationale?: string;

  observableFilters?: string[];
  painScoring?: PainScoreEntry[];
  jobs?: JobsAddressed;
  vpClauses?: VPClause[];
  phaseEconomics?: PhaseEconomics[];
  scenarioAnalysis?: ScenarioAnalysis;
  costStructure?: CostEntry[];
  modeThresholds?: ModeThreshold[];
}

// === UI State Machine ===

export type PanelId = 'readiness' | 'evidence' | 'risk' | 'destruction' | 'solution' | 'detail';

export type AppState =
  | { _tag: 'Loading' }
  | { _tag: 'Loaded'; data: ParseResult; activePanel: PanelId; selectedHypothesis?: HypothesisId }
  | { _tag: 'Error'; message: string }
  | { _tag: 'Stale'; data: ParseResult; activePanel: PanelId; selectedHypothesis?: HypothesisId; error: string };

export type AppEvent =
  | { _tag: 'FetchStart' }
  | { _tag: 'FetchSuccess'; data: ParseResult }
  | { _tag: 'FetchError'; message: string }
  | { _tag: 'SelectPanel'; panel: PanelId }
  | { _tag: 'SelectHypothesis'; id: HypothesisId }
  | { _tag: 'Back' }
  | { _tag: 'Refresh' };

export function transition(state: AppState, event: AppEvent): AppState {
  switch (state._tag) {
    case 'Loading':
      switch (event._tag) {
        case 'FetchSuccess':
          return { _tag: 'Loaded', data: event.data, activePanel: 'readiness' };
        case 'FetchError':
          return { _tag: 'Error', message: event.message };
        default:
          return state;
      }

    case 'Loaded':
      switch (event._tag) {
        case 'SelectPanel':
          return { ...state, activePanel: event.panel, selectedHypothesis: undefined };
        case 'SelectHypothesis':
          return { ...state, activePanel: 'detail', selectedHypothesis: event.id };
        case 'Refresh':
          return { _tag: 'Loading' };
        case 'FetchError':
          return { _tag: 'Stale', data: state.data, activePanel: state.activePanel, selectedHypothesis: state.selectedHypothesis, error: event.message };
        default:
          return state;
      }

    case 'Error':
      switch (event._tag) {
        case 'FetchStart':
          return { _tag: 'Loading' };
        case 'FetchSuccess':
          return { _tag: 'Loaded', data: event.data, activePanel: 'readiness' };
        default:
          return state;
      }

    case 'Stale':
      switch (event._tag) {
        case 'Refresh':
          return { _tag: 'Loading' };
        case 'FetchSuccess':
          return { _tag: 'Loaded', data: event.data, activePanel: state.activePanel, selectedHypothesis: state.selectedHypothesis };
        case 'SelectPanel':
          return { ...state, activePanel: event.panel, selectedHypothesis: undefined };
        case 'SelectHypothesis':
          return { ...state, activePanel: 'detail', selectedHypothesis: event.id };
        case 'Back':
          return { ...state, activePanel: 'readiness', selectedHypothesis: undefined };
        default:
          return state;
      }

    default:
      return state;
  }
}
