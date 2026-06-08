/**
 * Ensure a session password is available.
 *
 * In personal mode, nuxt-auth-utils still requires a session password even
 * though OAuth is not in use. If NUXT_SESSION_PASSWORD is not set, generate
 * an ephemeral one so the app does not silently fail with a misleading
 * "No credentials" screen. The fallback resets on server restart, which
 * is acceptable for single-user personal mode.
 */
import { randomBytes } from 'node:crypto'

export function ensureSessionPassword(): void {
  if (!process.env.NUXT_SESSION_PASSWORD) {
    process.env.NUXT_SESSION_PASSWORD = randomBytes(32).toString('base64')
  }
}
