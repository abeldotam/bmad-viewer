# Story 7.2: Remplacement auth Supabase par nuxt-auth-utils

Status: done

## Story

As a **utilisateur**,
I want **to sign in with my GitHub account via OAuth (mode Multi-user) or access directly (mode Personal)**,
So that **I can use bmad-viewer without depending on Supabase**.

## Acceptance Criteria

1. Given je suis en mode Multi-user et non connecté, When je visite l'application, Then je suis redirigé vers la page de login avec un bouton "Sign in with GitHub" (AC:1)
2. Given je clique "Sign in with GitHub", When j'autorise l'application sur GitHub, Then je suis redirigé vers le dashboard avec une session dans un cookie chiffré (AC:2)
3. Given je suis connecté, When je rafraîchis la page, Then ma session persiste via le cookie chiffré (AC:3)
4. Given je clique "Logout", When la déconnexion s'exécute, Then ma session est détruite et je suis redirigé vers login (AC:4)
5. Given je suis en mode Personal, When je visite l'application, Then j'accède directement au dashboard sans écran de login (AC:5)
6. Given je suis en mode Personal, When je visite `/login`, Then je suis redirigé vers le dashboard (AC:6)

## Tasks / Subtasks

- [x] Task 1 — Installer et configurer `nuxt-auth-utils` (AC: #2, #3)
- [x] Task 2 — Créer le handler OAuth GitHub (AC: #2)
- [x] Task 3 — Réécrire `useAuth.ts` (AC: #1, #2, #3, #4, #5)
- [x] Task 4 — Réécrire `auth.global.ts` middleware (AC: #1, #5, #6)
- [x] Task 5 — Réécrire `server/utils/auth.ts` (AC: #2, #3)
- [x] Task 6 — Adapter `login.vue` (AC: #1)
- [x] Task 7 — Réécrire `useApi.ts` (AC: #2, #3)
- [x] Task 8 — Adapter `app.vue` header (AC: #4, #5)

## Dev Notes

### Dépendances

- Dépend de Story 7.1 (détection du mode)
- Bloque Story 7.4 (routes GitHub API) et Story 7.5 (nettoyage)

### nuxt-auth-utils

Module officiel Nuxt par Atinux (Sébastien Chopin). Fournit :
- `useUserSession()` — composable client (loggedIn, user, session, clear, fetch)
- `requireUserSession(event)` — server util
- `setUserSession(event, data)` — pour stocker le token OAuth dans la session
- Session stockée dans un cookie chiffré (clé = `NUXT_SESSION_PASSWORD`)
- OAuth GitHub handler pré-configuré

### Fichiers supprimés par cette story

- `app/pages/register.vue` — Plus de registration email/password
- `app/pages/auth/callback.vue` — Géré par nuxt-auth-utils nativement

### Implémentation (2026-02-20)

- Type augmentation `#auth-utils` placée dans `shared/types/auth.d.ts` (visible par les deux tsconfigs Nuxt)
- `useAuth.ts` utilise `useAppMode()` pour détecter le mode et expose `isAuthenticated`, `displayName`, `avatarUrl`, `logout`
- `useApi.ts` simplifié à `$fetch.create({})` — le cookie session est auto-envoyé par le navigateur
- OAuth handler dans `server/routes/auth/github.get.ts` avec scope `repo` et `read:user`
- Note : `@nuxtjs/supabase` toujours dans nuxt.config.ts (nettoyage Story 7.5)

### File List

- `app/composables/useAuth.ts` — Réécrit (nuxt-auth-utils)
- `app/composables/useApi.ts` — Simplifié (plus de Bearer token)
- `app/middleware/auth.global.ts` — Réécrit (dual-mode)
- `app/pages/login.vue` — Simplifié (bouton GitHub uniquement)
- `app/app.vue` — Adapté (useAuth avec isAuthenticated, displayName, avatarUrl)
- `server/routes/auth/github.get.ts` — Nouveau (handler OAuth)
- `server/utils/auth.ts` — Réécrit (requireUserSession / mode personal)
- `shared/types/auth.d.ts` — Nouveau (augmentation type User #auth-utils)
- `nuxt.config.ts` — Module nuxt-auth-utils ajouté
