# Roadmap: Elden Ring Tracker

**Defined:** 2026-05-05
**Project:** Elden Ring Tracker
**Core Value:** Players can instantly see what items they have, what's missing, and explore the game's vast encyclopedia — all in a polished, immersive dark interface.

---

## Phase 1: UI Animation Improvements

**Goal:** Enhance smooth animations for existing UI components using SCSS and Vue transitions, following the 7-1 Pattern.

**Requirements:** UI-01, UI-02

**Plans:** 5 plans in 4 waves

**Plan list:**
- [ ] 01-01-PLAN.md — SCSS animations foundation with easing curves
- [ ] 01-02-PLAN.md — Page transitions via Vue Transition
- [ ] 01-03-PLAN.md — Staggered grid animations
- [ ] 01-04-PLAN.md — Hover/focus micro-interactions
- [ ] 01-05-PLAN.md — Expand/collapse accordion transitions

**Success Criteria:**
1. Page transitions work smoothly between routes
2. List/grid items animate in with staggered effect
3. Hover/focus states have refined micro-interactions
4. Custom easing curves applied consistently
5. Expand/collapse transitions on interactive elements

---

### Scope

#### Requirements (UI)

- [ ] **UI-01:** Implement Vue `<Transition>` components for page navigation
- [ ] **UI-02:** Add staggered animations for item grids and lists
- [ ] **UI-03:** Enhance hover/focus micro-interactions on cards and buttons
- [ ] **UI-04:** Add custom cubic-bezier easing curves for smoother motion
- [ ] **UI-05:** Implement expand/collapse transitions for accordions and slots
- [ ] **UI-06:** Create dedicated SCSS animations file following 7-1 pattern

#### Technical Notes

- SCSS animations in `app/assets/scss/abstracts/_animations.scss` or `app/assets/scss/animations/`
- Vue `<Transition>` wrapper in `app/app.vue` or layout
- Reuse existing transition variables (`$transition-base`, `$transition-slow`, etc.)
- Preserve existing glass-panel and gold-glow effects
- No new external animation libraries

---

## Phase Summary

| Phase | Goal | Requirements | Success Criteria |
|-------|------|--------------|------------------|
| 1 | UI Animation Improvements | UI-01 → UI-06 | 6 criteria |

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| UI-01 | Phase 1 | Pending |
| UI-02 | Phase 1 | Pending |
| UI-03 | Phase 1 | Pending |
| UI-04 | Phase 1 | Pending |
| UI-05 | Phase 1 | Pending |
| UI-06 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 6 total
- Mapped to phases: 6
- Unmapped: 0 ✓

---

*Roadmap created: 2026-05-05*
*Last updated: 2026-05-05*