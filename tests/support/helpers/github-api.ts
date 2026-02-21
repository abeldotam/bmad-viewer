import type { APIRequestContext } from '@playwright/test'

interface AppConfig {
  appMode: 'personal' | 'multiuser' | 'unconfigured'
}

interface ValidateResponse {
  defaultBranch: string
}

export async function fetchAppConfig(request: APIRequestContext): Promise<AppConfig> {
  const response = await request.get('/api/_config')
  return response.json()
}

export async function validateRepo(
  request: APIRequestContext,
  owner: string,
  repo: string
): Promise<{ status: number, body: ValidateResponse }> {
  const response = await request.get(`/api/github/validate?owner=${owner}&repo=${repo}`)
  return {
    status: response.status(),
    body: await response.json()
  }
}
