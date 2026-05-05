# Codebase Concerns

**Analysis Date:** 2026-05-05

## Tech Debt

**Hardcoded Save File Offsets:**
- Issue: `save-parser.ts` contains hardcoded memory offsets (e.g., `0x1901d0e`, `0x0028030f`) for parsing Elden Ring .sl2 save files. These are brittle magic numbers with no documentation.
- Files: `app/utils/save-parser.ts`
- Impact: If FromSoftware releases a game update that changes save file structure, the parser will silently return incorrect data or crash.
- Fix approach: Document the offset sources, add validation to detect unexpected format changes, and consider a version detection mechanism.

**Hardcoded External API URL:**
- Issue: API endpoint `https://eldenring.fanapis.com/api` is hardcoded in `useWikiStore.ts` and `useEldenRingApi.ts` with no fallback or configuration option.
- Files: `app/stores/useWikiStore.ts`, `app/composables/useEldenRingApi.ts`
- Impact: If the external API becomes unavailable, the wiki feature completely breaks with no graceful degradation.
- Fix approach: Move URL to environment config, add error boundary, implement caching strategy.

**Excessive Type Casting (`as any`):**
- Issue: Multiple instances of loose type casting that bypass TypeScript safety.
- Files: `app/stores/useWikiStore.ts:40,43`, `app/pages/inventory/[category].vue:28,32,36,49`
- Impact: Runtime errors may occur that TypeScript cannot catch during development.
- Fix approach: Define proper interfaces for all data transformations.

**No Input Validation on File Upload:**
- Issue: `handleFileUpload` in `useSaveStore.ts` only validates the BND4 header but does not check file size limits or file type.
- Files: `app/stores/useSaveStore.ts:67-84`
- Impact: Users could upload extremely large files causing memory issues, or non-.sl2 files that cause confusing errors.
- Fix approach: Add file size limit (e.g., 10MB max) and validate file extension.

## Known Issues

**Missing Error Boundary:**
- Issue: No global error handling for Vue component errors. Uncaught errors will crash the entire page.
- Files: No error boundary component exists
- Impact: A single component error could make the entire app unusable.
- Fix approach: Implement Nuxt error boundary or Vue error handling middleware.

**API Failure Silent Failure:**
- Issue: When the external wiki API fails, errors are logged to console but users see no feedback.
- Files: `app/stores/useWikiStore.ts:45-46`, `app/composables/useEldenRingApi.ts:50-52`
- Impact: Users may think the app is broken when wiki data fails to load.
- Fix approach: Add user-visible error states and retry mechanism.

**Database Loading Race Condition:**
- Issue: Pages call `store.loadDatabase()` in `onMounted`, but the store doesn't block UI access during loading. Users can interact with empty states before data loads.
- Files: `app/pages/inventory/[category].vue:7-9`
- Impact: Poor user experience - users see "archives are empty" briefly before data appears.
- Fix approach: Add loading state guards or use lazy-loaded data with suspense.

## Security Considerations

**Client-Side Only Save Parsing:**
- Issue: Save file parsing happens entirely client-side, which is good for privacy, but there's no sanitization of the parsed data before display.
- Files: `app/utils/save-parser.ts`
- Current mitigation: Parsing uses typed arrays with bounds checking, reducing injection risks.
- Recommendations: Consider adding output sanitization if parsed item names are rendered as HTML.

**No Content Security Policy:**
- Issue: No CSP headers configured. App loads external fonts and images from multiple sources.
- Files: `nuxt.config.ts`
- Recommendations: Add CSP configuration to restrict external resource loading.

**API Key Exposure Risk:**
- Issue: External API is unauthenticated (public fan API). If that API changes, the app breaks with no recourse.
- Files: `app/stores/useWikiStore.ts`, `app/composables/useEldenRingApi.ts`
- Recommendations: Document dependency on external service and create local fallback data.

## Performance Bottlenecks

**Large JSON Data Files:**
- Problem: `all_items.json` is 112KB uncompressed, loaded entirely into memory on app start.
- Files: `app/assets/data/all_items.json`
- Cause: All item data is loaded at once via `Promise.all` in `loadDatabase()`.
- Improvement path: Implement lazy loading by category, or use chunked imports.

**No Memoization of Computed Properties:**
- Problem: `missingItems` and `ownedItems` computed properties iterate over entire database on every access. These could be expensive with larger datasets.
- Files: `app/stores/useSaveStore.ts:95-147`
- Cause: Uses `Object.entries()` and creates new arrays on every access without caching.
- Improvement path: Use `watchEffect` to cache results when `foundItemIds` changes.

**Duplicate API Requests:**
- Problem: The wiki store fetches data but the composable also has `getByName` that could fetch the same data again. No deduplication across these layers.
- Files: `app/stores/useWikiStore.ts`, `app/composables/useEldenRingApi.ts`
- Improvement path: Consolidate API calls into single layer.

## Fragile Areas

**Save Parser Magic Numbers:**
- Files: `app/utils/save-parser.ts:37-40,60-71`
- Why fragile: Hardcoded offsets with no explanation or validation. If game updates change save format, the parser returns garbage data silently.
- Safe modification: Add version detection header and offset validation before parsing.
- Test coverage: No tests exist for this parser.

**Reliance on Third-Party Fan API:**
- Files: `app/stores/useWikiStore.ts`, `app/composables/useEldenRingApi.ts`
- Why fragile: No fallback data if API is down. No caching strategy for API responses.
- Safe modification: Add local JSON fallback for critical wiki data.
- Test coverage: No integration tests for API failure scenarios.

**Item ID Matching Logic:**
- Files: `app/stores/useSaveStore.ts:137-144`
- Why fragile: Sequential `if-else-if` chain to match item IDs to categories. If item IDs collide between categories, wrong category is assigned.
- Safe modification: Use a reverse-lookup map instead of sequential checking.

## Scaling Limits

**Memory (Client-Side):**
- Current capacity: All item data (~200KB of JSON) loaded into browser memory
- Limit: Entire dataset must fit in client RAM; no server-side pagination
- Scaling path: Implement virtual scrolling for large categories, server-side API for items

**API Rate Limiting:**
- Current capacity: Unknown - depends on fanapi.io rate limits
- Limit: No throttling or request queuing implemented
- Scaling path: Add request throttling, implement response caching

## Dependencies at Risk

**@nuxt/eslint 1.15.2:**
- Risk: Using Nuxt ESLint module version 1.x with eslint 10.3.0 - unusual combination. ESLint 10.x is very new and may have compatibility issues.
- Impact: Linting may break unexpectedly, configuration may not work as expected.
- Migration plan: Test thoroughly, consider downgrading to eslint 9.x if issues arise.

**eldenring.fanapis.com:**
- Risk: External third-party API with no SLA guarantee
- Impact: Wiki feature completely depends on this service
- Migration plan: Create local fallback JSON database for wiki data

## Missing Critical Features

**Offline Support:**
- Problem: App requires internet for wiki data and has no service worker
- Blocks: Use in offline mode, faster load times

**Error Recovery:**
- Problem: No retry logic for failed API calls or file parsing
- Blocks: Resilience to transient failures

**Data Persistence:**
- Problem: Save file must be re-uploaded on every visit
- Blocks: Remembering progress across sessions (note: this may be intentional for privacy)

## Test Coverage Gaps

**Save Parser:**
- What's not tested: Offset correctness, DLC detection, corrupted file handling
- Files: `app/utils/save-parser.ts`
- Risk: Silent data corruption if format changes
- Priority: High

**Store Logic:**
- What's not tested: Item matching, category resolution, computed property correctness
- Files: `app/stores/useSaveStore.ts`, `app/stores/useWikiStore.ts`
- Risk: Incorrect item categorization
- Priority: Medium

**API Integration:**
- What's not tested: API failure handling, cache invalidation, response parsing
- Files: `app/composables/useEldenRingApi.ts`
- Risk: App breaks silently when API is unavailable
- Priority: High

**Component Rendering:**
- What's not tested: All Vue components
- Files: `app/components/*`, `app/pages/*`
- Risk: UI regressions go unnoticed
- Priority: Low (visual testing is complex)

---

*Concerns audit: 2026-05-05*