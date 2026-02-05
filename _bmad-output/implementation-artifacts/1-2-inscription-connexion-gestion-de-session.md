# Story 1.2: Inscription, connexion & gestion de session

Status: done

## Story

As a **logged-out visitor**,
I want **to create an account via email or connect via GitHub OAuth, and stay logged in after refresh**,
So that **I can securely access the application without re-authenticating**.

## Acceptance Criteria

1. Given I am on the register page, When I submit a valid email and password, Then my account is created and I am redirected to the dashboard (AC:1)
2. Given I am on the login page, When I click "Sign in with GitHub", Then I am redirected to GitHub OAuth and back to the dashboard (AC:2)
3. Given I am logged in, When I refresh the page, Then my session persists (AC:3)
4. Given I am logged in, When I click "Logout", Then my session is destroyed and I am redirected to login (AC:4)
5. Given I am not authenticated, When I try to access a protected page, Then I am redirected to login (AC:5)

## Tasks / Subtasks

- [x] Install and configure @nuxtjs/supabase
- [x] Create login.vue — email/password form + GitHub OAuth button
- [x] Create register.vue — email/password/confirm + GitHub OAuth
- [x] Create auth/callback.vue — OAuth redirect handler
- [x] Create useAuth.ts — login(), register(), loginWithGithub(), logout()
- [x] Create auth.global.ts — middleware protecting all routes except public
- [x] Create server/utils/auth.ts — Bearer token validation via Supabase

## Dev Notes

### Implementation: COMPLETE

- `@nuxtjs/supabase` configured with `redirect: false`, `useSsrCookies: false`
- Auth uses localStorage + Authorization header pattern (not SSR cookies)
- Public routes: `/`, `/login`, `/register`, `/auth/callback`
- Session restoration forced in SPA mode via middleware

### File List

- `app/pages/login.vue`
- `app/pages/register.vue`
- `app/pages/auth/callback.vue`
- `app/composables/useAuth.ts`
- `app/middleware/auth.global.ts`
- `server/utils/auth.ts`
