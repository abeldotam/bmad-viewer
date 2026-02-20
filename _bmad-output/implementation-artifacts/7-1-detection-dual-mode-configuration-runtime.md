# Story 7.1: Détection dual-mode & configuration runtime

Status: done

## Story

As a **self-hoster**,
I want **the application to detect automatically si je suis en mode Personal ou Multi-user via mes variables d'environnement**,
So that **l'application se configure correctement sans intervention manuelle**.

## Acceptance Criteria

1. Given `GITHUB_TOKEN` est défini dans `.env`, When l'application démarre, Then elle fonctionne en mode Personal — pas de login screen, accès direct (AC:1)
2. Given `GITHUB_CLIENT_ID` et `GITHUB_CLIENT_SECRET` sont définis, When l'application démarre, Then elle fonctionne en mode Multi-user — login screen, GitHub OAuth (AC:2)
3. Given aucune variable n'est définie, When l'application démarre, Then une page d'onboarding guide l'utilisateur vers la configuration (AC:3)
4. Given les deux sets de variables sont définis, When l'application démarre, Then le mode Multi-user est prioritaire (AC:4)

## Tasks / Subtasks

- [x] Task 1 — Créer `server/utils/mode.ts` avec la logique de détection (AC: #1, #2, #3, #4)
  - [x] Fonction `getAppMode()` retournant `'personal' | 'multiuser' | 'unconfigured'`
  - [x] Utilise `useRuntimeConfig()` pour lire les env vars Nitro
- [x] Task 2 — Exposer le mode via `runtimeConfig` et API (AC: #1, #2)
  - [x] Déclarer les env vars dans `nuxt.config.ts` → `runtimeConfig` (server-only)
  - [x] Créer `server/api/_config.get.ts` pour exposer le mode au client
  - [x] Créer `app/composables/useAppMode.ts` pour cacher le mode côté client
  - [x] Créer `app/plugins/app-mode.ts` pour charger le mode au démarrage
- [x] Task 3 — Créer `.env.example` avec documentation des deux modes (AC: #1, #2, #3)
  - [x] Commentaires expliquant chaque variable et quel mode elle concerne
- [x] Task 4 — Créer page d'onboarding pour mode unconfigured (AC: #3)
  - [x] `app/pages/setup.vue` avec instructions de configuration
  - [x] Middleware `auth.global.ts` adapté pour rediriger selon le mode

## Dev Notes

### Architecture de la détection

Le mode est calculé côté serveur via `useRuntimeConfig()` dans `server/utils/mode.ts`. Les env vars utilisent le préfixe `NUXT_` pour être auto-injectées par Nitro :

- `NUXT_GITHUB_TOKEN` → mode personal
- `NUXT_OAUTH_GITHUB_CLIENT_ID` + `NUXT_OAUTH_GITHUB_CLIENT_SECRET` → mode multiuser
- Rien → mode unconfigured

Le mode est exposé au client via `/api/_config` (pas de runtimeConfig.public pour éviter d'exposer les tokens). Le composable `useAppMode()` cache le résultat dans `useState`. Un plugin Nuxt le charge au démarrage.

### Middleware auth adapté

Le middleware `auth.global.ts` gère désormais les 3 modes :
- **unconfigured** : redirige tout vers `/setup`
- **personal** : laisse tout passer, redirige `/login` et `/setup` vers `/dashboard`
- **multiuser** : garde le comportement Supabase existant (sera remplacé en Story 7.2)

### File List

- `server/utils/mode.ts` — Logique de détection du mode (type AppMode + getAppMode)
- `server/api/_config.get.ts` — Endpoint API exposant le mode au client
- `app/composables/useAppMode.ts` — Composable client (cache useState)
- `app/plugins/app-mode.ts` — Plugin Nuxt chargeant le mode au démarrage
- `app/pages/setup.vue` — Page d'onboarding (mode unconfigured)
- `app/middleware/auth.global.ts` — Middleware adapté au dual-mode
- `nuxt.config.ts` — runtimeConfig avec env vars serveur
- `.env.example` — Template documenté des deux modes
