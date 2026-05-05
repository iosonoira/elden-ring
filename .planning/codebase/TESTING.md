# Testing Patterns

**Analysis Date:** 2026-05-05

## Test Framework

**Status:** Not detected

No testing framework is currently configured or used in this codebase.

- No test runner installed (no vitest, jest, or other test frameworks in package.json)
- No test files found in the project
- No test configuration files (no jest.config.*, vitest.config.*, etc.)

## Test File Organization

**Location:** Not applicable

No tests exist in the current codebase.

**Expected Location (if tests were to be added):**
- Unit tests could be placed alongside source files or in `__tests__` directories
- Integration tests could use Nuxt's built-in test utilities
- E2E tests could use Playwright or Cypress

## Test Structure

**Not applicable** - no tests exist in codebase.

## Mocking

**Not applicable** - no tests exist in codebase.

**Note:** If testing were to be added, consider:
- Mocking `$fetch` or `$AsyncData` for API composables
- Mocking file reader for `SaveParser` class
- Using Pinia testing utilities for store testing

## Fixtures and Factories

**Not applicable** - no tests exist in codebase.

**Potential test data locations (if tests were to be added):**
- JSON data files in `app/assets/data/` could serve as fixtures
- Type definitions in `app/shared/types/` could inform test data structures

## Coverage

**Requirements:** None enforced

No coverage tooling is configured.

## Test Types

**Unit Tests:**
- Not present
- Could test `SaveParser` class logic (hex conversion, pattern matching)
- Could test store computed properties (`missingItems`, `ownedItems`, `stats`)

**Integration Tests:**
- Not present
- Could test Pinia stores with database loading
- Could test composable behavior with mocked API

**E2E Tests:**
- Not present
- Could use Playwright to test file upload flow
- Could test page navigation and routing

## Common Patterns

**None established** - no testing patterns in use.

**Recommendations for future testing:**
- Use `@pinia/testing` for store unit tests
- Use Nuxt `useTestUtils` for component testing
- Mock external API calls to `eldenring.fanapis.com`
- Test `SaveParser` with pre-configured ArrayBuffer fixtures

## Test Framework Recommendations

If testing were to be added, the recommended stack would be:

**Framework:**
- Vitest - aligns with Nuxt/Vue ecosystem
- Alternative: Jest with ts-jest

**Component Testing:**
- Vue Test Utils (built into Vue ecosystem)
- Alternatively: Testing Library for Vue

**E2E Testing:**
- Playwright - recommended for Nuxt projects

**Installation would add packages like:**
```json
{
  "devDependencies": {
    "vitest": "^2.0.0",
    "@vue/test-utils": "^2.4.0",
    "@pinia/testing": "^2.0.0"
  }
}
```

---

*Testing analysis: 2026-05-05*