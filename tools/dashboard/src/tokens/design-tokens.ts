// Design tokens as CSS custom properties string.
// Injected once at app mount. Components consume via var(--token-name).

export const designTokensCSS = `
:root {
  /* === Surface & Text === */
  --color-surface: #fafaf9;
  --color-surface-raised: #ffffff;
  --color-surface-sunken: #f0efed;
  --color-surface-overlay: rgba(0, 0, 0, 0.04);
  --color-on-surface: #1c1917;
  --color-on-surface-muted: #78716c;
  --color-on-surface-subtle: #a8a29e;
  --color-border: #e7e5e4;
  --color-border-strong: #d6d3d1;

  /* === Confidence States (primary color language) === */
  --color-confidence-supported: #15803d;
  --color-confidence-supported-bg: #f0fdf4;
  --color-confidence-supported-border: #bbf7d0;
  --color-confidence-researched: #1d4ed8;
  --color-confidence-researched-bg: #eff6ff;
  --color-confidence-researched-border: #bfdbfe;
  --color-confidence-unvalidated: #b45309;
  --color-confidence-unvalidated-bg: #fffbeb;
  --color-confidence-unvalidated-border: #fde68a;
  --color-confidence-broken: #b91c1c;
  --color-confidence-broken-bg: #fef2f2;
  --color-confidence-broken-border: #fecaca;

  /* === Epistemic Tiers === */
  --color-tier-1: #1e40af;
  --color-tier-1-bg: #dbeafe;
  --color-tier-2: #6d28d9;
  --color-tier-2-bg: #ede9fe;
  --color-tier-3: #92400e;
  --color-tier-3-bg: #fef3c7;

  /* === Blast Radius === */
  --color-blast-high: #dc2626;
  --color-blast-high-bg: #fef2f2;
  --color-blast-medium: #d97706;
  --color-blast-medium-bg: #fffbeb;
  --color-blast-low: #78716c;
  --color-blast-low-bg: #f5f5f4;

  /* === Risk Levels === */
  --color-risk-critical: #991b1b;
  --color-risk-critical-bg: #fef2f2;
  --color-risk-high: #c2410c;
  --color-risk-high-bg: #fff7ed;
  --color-risk-medium: #b45309;
  --color-risk-medium-bg: #fffbeb;
  --color-risk-low: #78716c;
  --color-risk-low-bg: #f5f5f4;

  /* === Status === */
  --color-passes: #15803d;
  --color-passes-bg: #f0fdf4;
  --color-warning: #b45309;
  --color-warning-bg: #fffbeb;
  --color-fails: #b91c1c;
  --color-fails-bg: #fef2f2;

  /* === Spacing === */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;

  /* === Typography === */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
  --font-display: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;

  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;

  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;

  --weight-normal: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-bold: 700;

  /* === Radius === */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;

  /* === Shadows === */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-lg: 0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.04);

  /* === Transitions === */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-surface: #0c0a09;
    --color-surface-raised: #1c1917;
    --color-surface-sunken: #0a0908;
    --color-surface-overlay: rgba(255, 255, 255, 0.04);
    --color-on-surface: #fafaf9;
    --color-on-surface-muted: #a8a29e;
    --color-on-surface-subtle: #78716c;
    --color-border: #292524;
    --color-border-strong: #44403c;

    --color-confidence-supported-bg: #052e16;
    --color-confidence-supported-border: #166534;
    --color-confidence-researched-bg: #1e1b4b;
    --color-confidence-researched-border: #3730a3;
    --color-confidence-unvalidated-bg: #451a03;
    --color-confidence-unvalidated-border: #92400e;
    --color-confidence-broken-bg: #450a0a;
    --color-confidence-broken-border: #991b1b;

    --color-tier-1-bg: #1e3a5f;
    --color-tier-2-bg: #2e1065;
    --color-tier-3-bg: #451a03;

    --color-blast-high-bg: #450a0a;
    --color-blast-medium-bg: #451a03;
    --color-blast-low-bg: #1c1917;

    --color-risk-critical-bg: #450a0a;
    --color-risk-high-bg: #431407;
    --color-risk-medium-bg: #451a03;
    --color-risk-low-bg: #1c1917;

    --color-passes-bg: #052e16;
    --color-warning-bg: #451a03;
    --color-fails-bg: #450a0a;

    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
    --shadow-md: 0 1px 3px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.2);
    --shadow-lg: 0 4px 6px rgba(0, 0, 0, 0.35), 0 2px 4px rgba(0, 0, 0, 0.2);
  }
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --transition-fast: 0ms;
    --transition-normal: 0ms;
  }
}
`;
