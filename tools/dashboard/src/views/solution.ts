import type { HypothesisRegister, SolutionView } from '../model/types';

export function computeSolutionView(register: HypothesisRegister): SolutionView {
  if (!register.solutionDesign) {
    return {
      hasSolutionDesign: false,
      phases: [],
      featuresByPriority: { mvp: [], postMvp: [], future: [] },
      growthLoops: [],
      constraints: [],
      adequacyCriteria: [],
    };
  }

  const sd = register.solutionDesign;

  return {
    hasSolutionDesign: true,
    growthArchitecture: sd.growthArchitecture,
    phases: sd.phases ?? [],
    featuresByPriority: {
      mvp: sd.featureMap.filter(f => f.priority === 'MVP'),
      postMvp: sd.featureMap.filter(f => f.priority === 'POST_MVP'),
      future: sd.featureMap.filter(f => f.priority === 'FUTURE'),
    },
    mvpScope: sd.mvpScope,
    growthLoops: sd.growthLoops,
    constraints: sd.constraintsFromHypotheses,
    adequacyCriteria: sd.adequacyCriteria,
  };
}
