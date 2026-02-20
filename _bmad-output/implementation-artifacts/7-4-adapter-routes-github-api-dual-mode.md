# Story 7.4: Adapter les routes GitHub API au dual-mode

Status: done

## Story

As a **utilisateur**,
I want **GitHub API routes to use my OAuth session token (Multi-user) or the env PAT (Personal)**,
So that **all GitHub features work identically in both modes without stored tokens**.

## Acceptance Criteria

1. Given je suis en mode Personal, When une route API GitHub est appelée, Then elle utilise `process.env.GITHUB_TOKEN` (AC:1)
2. Given je suis en mode Multi-user, When une route API GitHub est appelée, Then elle utilise le token OAuth de ma session (AC:2)
3. Given mon token OAuth expire ou est révoqué, When une requête GitHub échoue avec 401, Then je vois un message explicite et suis invité à me reconnecter (AC:3)
4. Given j'ajoute un repo, When le formulaire est soumis, Then il n'y a plus de champ "GitHub token" — le token vient de la session ou de l'env (AC:4)
5. Given je suis en mode Multi-user, When j'ajoute un repo privé auquel j'ai accès, Then le système peut y accéder via mon token OAuth (AC:5)

## Tasks / Subtasks

- [x] Task 1 — Créer le helper centralisé de récupération du token (AC: #1, #2)
- [x] Task 2 — Modifier `server/api/github/contents.get.ts` (AC: #1, #2, #3)
- [x] Task 3 — Modifier `server/api/github/tree.get.ts` (AC: #1, #2)
- [x] Task 4 — Modifier `server/api/github/issues.post.ts` (AC: #1, #2, #3)
- [x] Task 5 — Modifier `server/api/github/issues.get.ts` (AC: #1, #2)
- [x] Task 6 — Modifier `server/api/github/pulls.get.ts` (AC: #1, #2)
- [x] Task 7 — Modifier `server/api/repos/index.post.ts` (AC: #4, #5)
- [x] Task 8 — Modifier `AddRepoModal.vue` (AC: #4)
- [x] Task 9 — Adapter `useRepository.ts` (AC: #4)
- [x] Task 10 — Gestion d'erreur token expiré (AC: #3)

## Dev Notes

### Dépendances

- Dépend de Story 7.1 (mode detection), 7.2 (auth/session), 7.3 (database)
- Bloque Story 7.5 (nettoyage)

### Pattern du helper

```typescript
// server/utils/github-token.ts
export async function getGitHubToken(event: H3Event): Promise<string> {
  const mode = getAppMode()
  if (mode === 'personal') {
    return process.env.GITHUB_TOKEN!
  }
  const session = await requireUserSession(event)
  return session.user.githubToken
}
```

### Impact UX

Le formulaire d'ajout de repo se simplifie considérablement :
- **Avant :** owner, name, token GitHub (optionnel, champ sensible)
- **Après :** owner, name (le token vient de la session OAuth)

En mode Personal, l'utilisateur a accès à tous les repos que son PAT autorise.
En mode Multi-user, l'utilisateur a accès aux repos que son compte GitHub autorise (via les scopes OAuth).

### Implémentation (2026-02-20)

- Implémentée en parallèle des Stories 7.2 et 7.3 car les routes API ont été réécrites ensemble
- `getGitHubToken(event)` auto-importé depuis `server/utils/github-token.ts`
- Toutes les routes GitHub API utilisent `getGitHubToken(event)` + `useDatabase()` au lieu de Supabase + decrypt
- Erreurs 403 pour tokens expirés via `isGitHubAuthError(e)` (existait déjà)
- `AddRepoModal.vue` simplifié à 2 champs (owner + name)

### File List

- `server/utils/github-token.ts` — Nouveau (helper centralisé)
- `server/api/github/contents.get.ts` — Réécrit (Drizzle + getGitHubToken)
- `server/api/github/tree.get.ts` — Réécrit (Drizzle + getGitHubToken)
- `server/api/github/issues.post.ts` — Réécrit (Drizzle + getGitHubToken)
- `server/api/github/issues.get.ts` — Réécrit (Drizzle + getGitHubToken)
- `server/api/github/pulls.get.ts` — Réécrit (Drizzle + getGitHubToken)
- `server/api/repos/index.post.ts` — Réécrit (retrait token/encryption)
- `app/components/dashboard/AddRepoModal.vue` — Simplifié (retrait champ token)
- `app/composables/useRepository.ts` — Simplifié (retrait param token)
