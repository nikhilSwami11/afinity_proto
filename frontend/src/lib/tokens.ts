/**
 * Semantic class tokens for the Affinity app.
 * All color classes reference CSS custom properties defined in globals.css.
 * No raw Tailwind color values (slate-*, white/*, violet-*) should appear in components.
 */

export const t = {
  // ─── Page wrapper ──────────────────────────────────────────────────────────
  page: 'min-h-screen bg-app-canvas text-app-fg',

  // ─── Cards ─────────────────────────────────────────────────────────────────
  // Primary content card (large radius)
  card: 'rounded-[32px] border border-app-line bg-app-surface text-app-fg',
  // Slightly smaller radius variant
  cardSm: 'rounded-[28px] border border-app-line bg-app-surface text-app-fg',
  // Sidebar / compact card
  cardMd: 'rounded-3xl border border-app-line bg-app-surface text-app-fg',
  // Modal card (solid, non-transparent background)
  cardModal: 'rounded-[32px] border border-app-line bg-app-surface-solid text-app-fg shadow-2xl',

  // ─── Inner surfaces (nested blocks within cards) ────────────────────────────
  inner: 'rounded-2xl border border-app-line bg-app-surface-hover',
  innerLg: 'rounded-3xl border border-app-line bg-app-surface-hover',
  innerXl: 'rounded-[28px] border border-app-line bg-app-surface-hover',

  // ─── Text ──────────────────────────────────────────────────────────────────
  fg: 'text-app-fg',
  fgSoft: 'text-app-fg-soft',
  fgMuted: 'text-app-fg-muted',
  fgDim: 'text-app-fg-dim',
  placeholder: 'placeholder:text-app-fg-dim',

  // ─── Buttons ───────────────────────────────────────────────────────────────
  btnPrimary:
    'rounded-2xl bg-app-action text-app-action-fg hover:bg-app-action-hover',
  btnOutline:
    'rounded-2xl border border-app-line-soft bg-app-surface text-app-fg hover:bg-app-surface-hover',
  btnGhost:
    'rounded-2xl text-app-fg-soft hover:bg-app-surface-hover hover:text-app-fg',

  // ─── Navigation ────────────────────────────────────────────────────────────
  navActive: 'bg-app-nav-pill text-app-nav-pill-fg',
  navInactive:
    'text-app-fg-soft hover:bg-app-surface-hover hover:text-app-fg',

  // ─── Badges ────────────────────────────────────────────────────────────────
  badge: 'rounded-full bg-app-surface-hover text-app-fg hover:bg-app-surface-hover',
  badgeAccent:
    'rounded-full bg-app-violet text-app-violet-fg hover:bg-app-violet',
  badgeOk:
    'rounded-full bg-app-ok text-app-ok-fg hover:bg-app-ok',

  // ─── Accent surfaces ───────────────────────────────────────────────────────
  accentCard: 'rounded-3xl border border-app-violet-line bg-app-violet-wash',

  // ─── Form inputs ───────────────────────────────────────────────────────────
  input:
    'border-app-line bg-app-surface text-app-fg placeholder:text-app-fg-dim',
  textareaGhost:
    'border-0 bg-transparent text-app-fg placeholder:text-app-fg-dim focus-visible:ring-0',

  // ─── Navigation shell ──────────────────────────────────────────────────────
  sidebar: 'rounded-3xl border border-app-line bg-app-surface backdrop-blur',

  // ─── Tabs ──────────────────────────────────────────────────────────────────
  tabList: 'rounded-2xl bg-app-surface-hover',

  // ─── Overlays / Modal ──────────────────────────────────────────────────────
  modalBackdrop: 'fixed inset-0 bg-app-scrim backdrop-blur-sm',
  overlayLabel: 'rounded-2xl border border-app-line bg-app-overlay backdrop-blur',
} as const;
