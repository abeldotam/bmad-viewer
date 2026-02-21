import { mergeTests } from '@playwright/test'
import { test as apiRequestFixture } from '@seontechnologies/playwright-utils/api-request/fixtures'
import { test as networkErrorMonitorFixture } from '@seontechnologies/playwright-utils/network-error-monitor/fixtures'

export const test = mergeTests(
  apiRequestFixture,
  networkErrorMonitorFixture
)

export { expect } from '@playwright/test'
