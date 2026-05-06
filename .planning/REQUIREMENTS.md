# Requirements: Elden Ring Tracker

**Defined:** 2026-05-06
**Core Value:** Players can instantly see what items they have, what's missing, and explore the game's vast encyclopedia — all in a polished, immersive dark interface.

## v1 Requirements

### Navigation

- [ ] **NAV-01:** Sidebar checks if save file is loaded before navigation
- [ ] **NAV-02:** No save loaded → redirect to Archives (encyclopedia view)
- [ ] **NAV-03:** Save loaded → redirect to Inventory (progress view)

### State Management

- [ ] **STATE-01:** Save file data persists across page navigation
- [ ] **STATE-02:** Verify Pinia store retains data on route change
- [ ] **STATE-03:** Fix any state reset issues if found

## Out of Scope

| Feature | Reason |
|---------|--------|
| Save file cloud sync | No backend, client-side only |
| Multiple save profiles | Single character for v1 |
| Export/import inventory | Can be added as v2 |

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
*Requirements defined: 2026-05-06*
*Last updated: 2026-05-06*