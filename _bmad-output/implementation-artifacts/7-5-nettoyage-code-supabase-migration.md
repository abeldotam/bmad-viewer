# Story 7.5: Nettoyage code Supabase & migration

Status: done

## Story

As a **développeur**,
I want **all Supabase-specific code removed cleanly from the codebase**,
So that **the project has no dead code or phantom dependencies**.

## Acceptance Criteria

1. Given la migration est terminée, When je cherche "supabase" dans le code source, Then aucun résultat n'apparaît (hors CHANGELOG/docs historiques) (AC:1)
2. Given les dépendances sont nettoyées, When je regarde `package.json`, Then `@nuxtjs/supabase` et `@supabase/supabase-js` ne sont plus présents (AC:2)
3. Given le module encryption est supprimé, When je cherche "encrypt" ou "decrypt" dans le code, Then aucun résultat n'apparaît (AC:3)
4. Given je lance `pnpm lint && pnpm typecheck`, When le CI s'exécute, Then aucune erreur liée à des imports manquants ou types supprimés (AC:4)
5. Given les fichiers Supabase sont supprimés, When je liste le projet, Then `supabase/`, `app/types/database.types.ts`, `server/utils/encryption.ts`, `server/utils/supabase.ts` n'existent plus (AC:5)
6. Given les pages auth legacy sont supprimées, When je liste les pages, Then `register.vue` et `auth/callback.vue` n'existent plus (AC:6)

## Tasks / Subtasks

- [x] Task 1 — Supprimer les fichiers Supabase (AC: #1, #5)
- [x] Task 2 — Supprimer les pages auth legacy (AC: #6) — déjà fait en Story 7.2
- [x] Task 3 — Retirer les dépendances npm (AC: #2)
- [x] Task 4 — Nettoyer `nuxt.config.ts` (AC: #1)
- [x] Task 5 — Audit complet des imports morts (AC: #1, #3, #4)
- [x] Task 6 — Vérification CI (AC: #4)

## Dev Notes

### Dépendances

- Dépend de Story 7.2 (auth remplacée), 7.3 (database remplacée), 7.4 (routes adaptées)
- Bloque Story 7.6 (documentation)
- Cette story est essentiellement un travail de suppression et vérification

### Checklist de suppression

```
Fichiers à supprimer :
├── server/utils/supabase.ts          ← Supabase service role client
├── server/utils/encryption.ts        ← AES-256-GCM (plus nécessaire)
├── app/types/database.types.ts       ← Types auto-générés Supabase
├── app/pages/register.vue            ← Registration email/password
├── app/pages/auth/callback.vue       ← OAuth callback Supabase
└── supabase/                         ← Tout le dossier
    ├── migrations/
    ├── config.toml
    └── .temp/
```

### Dépendances à retirer

```json
{
  "@nuxtjs/supabase": "^2.0.3",
  "@supabase/supabase-js": "^2.94.0"
}
```

### Implémentation (2026-02-20)

- `register.vue` et `auth/callback.vue` déjà supprimés en Story 7.2
- `@noble/ciphers` n'était plus dans les deps (déjà retiré ou jamais ajouté directement)
- `env.template` (ancien) supprimé — remplacé par `.env.example` en Story 7.1
- `CLAUDE.md` mis à jour avec la nouvelle architecture complète
- `.env.example` nettoyé : section Supabase retirée, section DATABASE_PATH ajoutée
- Grep "supabase" et "encrypt/decrypt" dans server/ et app/ → 0 résultat
- `pnpm lint` et `pnpm typecheck` passent sans erreur

### File List

- `server/utils/supabase.ts` — Supprimé
- `server/utils/encryption.ts` — Supprimé
- `app/types/database.types.ts` — Supprimé
- `supabase/` — Supprimé (migrations, config, .temp)
- `env.template` — Supprimé
- `nuxt.config.ts` — Nettoyé (module + config Supabase retirés)
- `package.json` — Dépendances @nuxtjs/supabase et @supabase/supabase-js retirées
- `.env.example` — Section legacy Supabase retirée
- `CLAUDE.md` — Mis à jour avec la nouvelle architecture
