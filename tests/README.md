# BMAD Viewer — Test Framework

End-to-end test framework using [Playwright](https://playwright.dev/) with [@seontechnologies/playwright-utils](https://github.com/seontechnologies/playwright-utils).

## Setup

```bash
# Install dependencies (includes Playwright)
pnpm install

# Install browser binaries
pnpm exec playwright install --with-deps
```

## Running Tests

```bash
# Run all E2E tests
pnpm test:e2e

# Run in headed mode (see the browser)
pnpm test:e2e -- --headed

# Run with Playwright UI (interactive debugging)
pnpm test:e2e -- --ui

# Run a specific test file
pnpm test:e2e -- tests/e2e/smoke.spec.ts

# Run tests matching a pattern
pnpm test:e2e -- --grep "landing page"

# Debug a specific test
pnpm test:e2e -- --debug tests/e2e/smoke.spec.ts
```

## Architecture

```
tests/
├── e2e/                        # E2E test specs
│   └── smoke.spec.ts           # Basic smoke tests
├── support/
│   ├── merged-fixtures.ts      # Combined Playwright fixtures (single import)
│   ├── fixtures/               # Custom project fixtures
│   └── helpers/
│       └── github-api.ts       # GitHub API proxy helpers
└── README.md
```

### Merged Fixtures

All tests import from `tests/support/merged-fixtures.ts` — a single entry point that combines playwright-utils fixtures using `mergeTests`:

```typescript
import { test, expect } from '../support/merged-fixtures'

test('example', async ({ page, apiRequest }) => {
  // page: standard Playwright page
  // apiRequest: typed HTTP client from playwright-utils
})
```

Available fixtures:

- **apiRequest** — Typed HTTP client with auto-retry and JSON parsing (from `@seontechnologies/playwright-utils`)
- **networkErrorMonitor** — Auto-detects HTTP 4xx/5xx errors during tests (auto-enabled)

### Adding Custom Fixtures

Extend `tests/support/fixtures/` and merge into `merged-fixtures.ts`:

```typescript
// tests/support/fixtures/my-fixture.ts
import { test as base } from '@playwright/test'

export const test = base.extend({
  myFixture: async ({}, use) => {
    await use('value')
  }
})
```

```typescript
// tests/support/merged-fixtures.ts
import { mergeTests } from '@playwright/test'
import { test as myFixture } from './fixtures/my-fixture'
// ... existing imports

export const test = mergeTests(
  apiRequestFixture,
  networkErrorMonitorFixture,
  myFixture  // Add here
)
```

## Best Practices

### Selectors

Use `data-testid` attributes for stable selectors:

```typescript
await page.getByTestId('repo-card')
await page.getByRole('button', { name: 'Add Repository' })
```

### Test Structure

Follow Given/When/Then:

```typescript
test('user can navigate to repo', async ({ page }) => {
  // Given I am on the dashboard
  await page.goto('/dashboard')

  // When I click on a repository
  await page.getByTestId('repo-card').first().click()

  // Then I see the repo dashboard
  await expect(page).toHaveURL(/\/repos\//)
})
```

### Network Error Monitoring

Tests automatically fail on HTTP 4xx/5xx errors. Opt out for tests that expect errors:

```typescript
test('handles invalid repo', {
  annotation: [{ type: 'skipNetworkMonitoring' }]
}, async ({ page }) => {
  // This test expects 404 errors
})
```

## CI Integration

Tests run in CI via GitHub Actions. Key settings:

- **Workers**: 1 (serial) in CI for stability
- **Retries**: 2 in CI
- **Artifacts**: Screenshots, videos, and traces captured on failure
- **Reports**: HTML report + JUnit XML at `test-results/results.xml`

### Artifacts

On failure, find debugging artifacts in:

- `test-results/` — Screenshots, videos, traces
- `playwright-report/` — Interactive HTML report

View the HTML report locally:

```bash
pnpm exec playwright show-report
```

## Configuration

- **playwright.config.ts** — Main configuration (project root)
- **Base URL**: `http://localhost:3000` (overridable via `BASE_URL` env var)
- **Timeouts**: action 15s, navigation 30s, expect 10s, test 60s
- **WebServer**: Auto-starts `pnpm dev` for tests

## Troubleshooting

### Tests fail because dev server doesn't start

Ensure port 3000 is available and environment variables are set:

```bash
cp .env.example .env
# Configure at least one mode (Personal or Multi-user)
```

### Browser binaries not found

```bash
pnpm exec playwright install --with-deps
```

### Tests pass locally but fail in CI

- Check `BASE_URL` environment variable
- Verify GitHub tokens are configured in CI secrets
- Review trace artifacts for timing issues
