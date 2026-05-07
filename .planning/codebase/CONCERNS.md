# Codebase Concerns

**Analysis Date:** 2026-05-06

## Tech Debt

**Hardcoded Save File Offsets in SaveParser:**
- Issue: Binary parser uses magic number offsets (e.g., `0x1901d0e`, `0x0028030f`) that are specific to a particular Elden Ring game version
- Files: `app/utils/save-parser.ts` (lines 37-71)
- Impact: Parser will break silently if FromSoftware releases a game update that changes the save file structure
- Fix approach: Add version detection to validate offsets against known structures, add warning when parsing fails, consider making offsets configurable

**Duplicate API Category Mappings:**
- Issue: The same category-to-API mapping is duplicated in `useWikiStore.ts` and `useEldenRingApi.ts`
- Files: `app/stores/useWikiStore.ts` (lines 23-30), `app/composables/useEldenRingApi.ts` (lines 28-35)
- Impact: Inconsistency risk when updating categories; maintenance burden
- Fix approach: Extract to shared constants in `shared/types/EldenRingApi.ts`

**Type Safety Compromises:**
- Issue: Multiple `as any[]` type casts in computed properties indicate weak typing
- Files: `app/stores/useSaveStore.ts` (lines 118-124, 148-154)
- Impact: Bugs from type mismatches won't be caught at compile time
- Fix approach: Define proper TypeScript interfaces for the computed result types

**Duplicate Asset JSON Files:**
- Issue: Item database JSON files exist both in `app/assets/data/` and `Elden-Ring-Automatic-Checklist/assets/json/`
- Files: `app/assets/data/*.json`, `Elden-Ring-Automatic-Checklist/assets/json/*.json`
- Impact: Confusion about which files are authoritative; potential drift
- Fix approach: Remove duplicate files or clearly document the relationship

## Known Bugs

**No bugs identified through static analysis:**
- No TODO/FIXME/HACK comments found in codebase
- No obvious runtime error patterns detected

**Potential Runtime Issues:**
- Issue: Empty handling in CharacterSlot may cause UI issues
- Files: `app/utils/save-parser.ts` (lines 50-52)
- Workaround: Active characters have non-empty names; empty names are filtered in UI

## Security Considerations

**External API Dependency:**
- Risk: App relies on third-party API `eldenring.fanapis.com/api` with no backup
- Files: `app/composables/useEldenRingApi.ts`, `app/stores/useWikiStore.ts`
- Current mitigation: None - API failure results in empty wiki pages
- Recommendations: Add fallback UI, consider caching aggressively, or self-hosting the wiki data

**Client-Side File Processing:**
- Risk: User uploads save files processed entirely in browser
- Files: `app/stores/useSaveStore.ts` (lines 73-91)
- Current mitigation: Basic header validation (`BND4` check in `save-parser.ts`)
- Recommendations: Add file size limits, additional magic byte validation

**LocalStorage Persistence:**
- Risk: Inventory data persisted in localStorage could contain sensitive character data
- Files: `app/plugins/save-store-persist.client.ts`
- Current mitigation: None
- Recommendations: Consider adding option to clear persisted data, warn users about sensitive data storage

## Performance Bottlenecks

**Large Inventory Processing:**
- Problem: Computing `missingItems` iterates over entire item database on every change
- Files: `app/stores/useSaveStore.ts` (lines 114-139)
- Cause: O(n) operation where n = total items in all categories
- Improvement path: Pre-compute stats incrementally when items are added/removed, use web workers for heavy computation

**Eager Database Loading:**
- Problem: Database loads all categories simultaneously, causing potential memory spike
- Files: `app/stores/useSaveStore.ts` (lines 33-69)
- Cause: `Promise.all()` loads all JSON files at once
- Improvement path: Lazy load categories on-demand

**Unbounded API Caching:**
- Problem: Wiki store caches all fetched items indefinitely
- Files: `app/stores/useWikiStore.ts` (line 6)
- Cause: No cache eviction policy
- Improvement path: Add LRU cache or size limit

## Fragile Areas

**Save Parser Binary Logic:**
- Files: `app/utils/save-parser.ts`
- Why fragile: Binary parsing with hardcoded offsets is inherently fragile; any game update breaks it silently
- Safe modification: Add unit tests for parser with known save file samples; add version detection
- Test coverage: No tests exist

**Pattern Matching in Inventory Extraction:**
- Files: `app/utils/save-parser.ts` (lines 81-124)
- Why fragile: Relies on byte patterns that could appear in wrong locations
- Safe modification: Add validation that extracted IDs exist in known item database
- Test coverage: No tests exist

## Scaling Limits

**LocalStorage Capacity:**
- Current capacity: ~5-10MB typical, varies by browser
- Limit: Large inventories with full item collection could exceed storage
- Scaling path: Store only item IDs (already doing this), or implement chunked storage

**Browser Memory for Large Saves:**
- Current capacity: Depends on save file size, typically <10MB
- Limit: Very large modded saves could cause memory issues
- Scaling path: Process in chunks if needed

## Dependencies at Risk

**External API (eldenring.fanapis.com):**
- Risk: Third-party API may go offline or change without notice
- Impact: Wiki features become non-functional
- Migration plan: Self-host data dump from API, or find alternative data source

**Nuxt 4.x:**
- Risk: Using `nuxt: ^4.4.4` which is relatively new
- Impact: Potential breaking changes in minor versions
- Migration plan: Pin to specific version, test thoroughly before upgrades

## Missing Critical Features

**Test Suite:**
- Problem: No tests exist in the project
- Blocks: Safe refactoring, confidence in parser changes, detecting regressions
- Priority: Critical

**Error Boundaries:**
- Problem: No Vue error boundaries to gracefully handle runtime errors
- Blocks: User-friendly error recovery
- Priority: High

**Loading States for Async Operations:**
- Problem: Some async operations lack user-facing loading indicators
- Blocks: User confusion during slow operations
- Priority: Medium

## Test Coverage Gaps

**Save Parser:**
- What's not tested: Binary parsing logic, offset calculations, pattern matching
- Files: `app/utils/save-parser.ts`
- Risk: Parser changes silently break inventory extraction
- Priority: Critical

**Store Computeds:**
- What's not tested: `missingItems`, `ownedItems`, `stats`, `globalStats` computed logic
- Files: `app/stores/useSaveStore.ts` (lines 114-207)
- Risk: Logic errors in item counting/filtering go undetected
- Priority: High

**API Integration:**
- What's not tested: API failure modes, caching behavior
- Files: `app/composables/useEldenRingApi.ts`, `app/stores/useWikiStore.ts`
- Risk: API errors cause unexpected UI behavior
- Priority: Medium

---

*Concerns audit: 2026-05-06*