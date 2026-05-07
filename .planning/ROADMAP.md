# Roadmap: Elden Ring Tracker

**Defined:** 2026-05-06
**Project:** Elden Ring Tracker
**Core Value:** Players can instantly see what items they have, what's missing, and explore the game's vast encyclopedia — all in a polished, immersive dark interface.

---

## Phase 1: Navigation & State Persistence

**Goal:** Implement smart sidebar redirects and ensure save file state persists during navigation

**Requirements:** NAV-01, NAV-02, NAV-03, STATE-01, STATE-02, STATE-03

**Plans:** 3 plans in 2 waves

### Plan list:

- [x] 01-01-PLAN.md — Analyze current sidebar and routing logic
- [ ] 01-02-PLAN.md — Implement smart redirect in sidebar
- [ ] 01-03-PLAN.md — Verify/fix state persistence

**Success Criteria:**
1. Smart redirect works: no save → Archives, save loaded → Inventory
2. Sidebar properly checks save state before navigation
3. Save data persists across route changes

---

### Scope

#### Requirements (Navigation + State)

- [ ] **NAV-01:** Sidebar checks if save file is loaded before navigation
- [ ] **NAV-02:** No save loaded → redirect to Archives (encyclopedia view)
- [ ] **NAV-03:** Save loaded → redirect to Inventory (progress view)
- [ ] **STATE-01:** Save file data persists across page navigation
- [ ] **STATE-02:** Verify Pinia store retains data on route change
- [ ] **STATE-03:** Fix any state reset issues if found

#### Technical Notes

- Modify `AppSidebar.vue` to check `useSaveStore().isLoaded`
- Add computed or watcher to determine target route
- May need to modify Nuxt page middleware or route guards
- Pinia should persist by default; verify if SSR causes issues

---

## Phase Summary

| Phase | Goal | Requirements | Success Criteria |
|-------|------|--------------|------------------|
| 1 | Navigation & State Persistence | NAV-01 → NAV-03, STATE-01 → STATE-03 | 3 criteria |

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| NAV-01 | Phase 1 | Pending |
| NAV-02 | Phase 1 | Pending |
| NAV-03 | Phase 1 | Pending |
| STATE-01 | Phase 1 | Pending |
| STATE-02 | Phase 1 | Pending |
| STATE-03 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 6 total
- Mapped to phases: 6
- Unmapped: 0 ✓

---

*Roadmap created: 2026-05-06*
*Last updated: 2026-05-06*