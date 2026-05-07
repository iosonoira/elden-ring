# Testing Patterns

**Analysis Date:** 2026-05-06

## Test Framework

**Status:** No testing framework currently configured

**Observations:**
- No test files (`.test.ts`, `.spec.ts`, `.test.vue`, `.spec.vue`) found in codebase
- No test configuration files (e.g., `vitest.config.ts`, `jest.config.js`)
- No testing dependencies in `package.json`
- No test scripts in `package.json`

**Recommendation:** Consider adding Vitest for Vue/Nuxt testing

## Test File Organization

**Location:** Not applicable (no tests exist)

**Expected patterns for Nuxt 4 project:**
- Unit tests: `**/*.test.ts` or `**/*.spec.ts` in same directory as source
- Component tests: `**/*.test.ts` or `**/*.spec.ts` co-located with `.vue` files
- Integration tests: `tests/integration/` directory

## Test Structure

**Not applicable** - no tests currently exist in codebase

## Mocking

**Not applicable** - no tests currently exist in codebase

**Expected patterns for this codebase:**

1. **API mocking:**
   - Use `nocked` or MSW for HTTP mocking
   - Mock external API: `https://eldenring.fanapis.com/api`

2. **Pinia store mocking:**
   - Create test utils to mock stores
   - Use `pinia-plugin-test-utils` if available

3. **File upload mocking:**
   - Mock `File` objects for `save-parser.ts` tests

## Fixtures and Factories

**Not applicable** - no tests currently exist in codebase

**Potential test data locations:**
- JSON data files in `app/assets/data/` can serve as fixtures
- Character save files would need binary test fixtures
- Item database JSON can be used for expected item lists

## Coverage

**Requirements:** None (no tests enforced)

**Recommendation:** Target 70%+ coverage for:
- Store logic (`useSaveStore.ts`, `useWikiStore.ts`)
- Utility functions (`save-parser.ts`)
- Composables (`useCategoryPage.ts`, `useEldenRingApi.ts`)

## Test Types

**Unit Tests:**

Priority areas for unit tests:
- `app/utils/save-parser.ts` - Binary parsing logic
- `app/stores/useSaveStore.ts` - Computed properties for owned/missing items
- `app/stores/useWikiStore.ts` - Cache and fetch logic

**Integration Tests:**

Priority areas:
- Store persistence plugin (`save-store-persist.client.ts`)
- Wiki API integration with caching

**E2E Tests:**

Not currently implemented. Consider Playwright for:
- Character selection flow
- Inventory loading from save file
- Category filtering and pagination

## Common Patterns

**Not applicable** - no tests currently exist in codebase

## Testing Recommendations

1. **Add Vitest:**
   ```bash
   pnpm add -D vitest @vue/test-utils jsdom
   ```

2. **Create test utilities:**
   - Mock for `SaveParser` class
   - Mock for external API responses
   - Pinia store testing helpers

3. **Priority test targets:**
   - `save-parser.ts` - Critical binary parsing logic
   - Store computed properties - Business logic for item categorization
   - Cache invalidation in `useWikiStore.ts`

4. **CI integration:**
   - Add `pnpm test` to build pipeline
   - Enforce coverage thresholds

---

*Testing analysis: 2026-05-06*