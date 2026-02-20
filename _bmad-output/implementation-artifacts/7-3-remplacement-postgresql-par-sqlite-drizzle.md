# Story 7.3: Remplacement PostgreSQL Supabase par SQLite + Drizzle

Status: done

## Story

As a **self-hoster**,
I want **repository data stored in an embedded SQLite database instead of Supabase PostgreSQL**,
So that **I don't need any external database service**.

## Acceptance Criteria

1. Given l'application démarre pour la première fois, When SQLite est initialisé, Then la base `data/bmad-viewer.db` est créée automatiquement avec le schéma correct (AC:1)
2. Given je suis en mode Multi-user, When j'ajoute un repo, Then il est stocké dans SQLite avec mon `user_id` GitHub (AC:2)
3. Given je suis en mode Personal, When j'ajoute un repo, Then il est stocké avec `user_id = 'personal'` (AC:3)
4. Given je liste mes repos, When la requête est exécutée, Then seuls mes repos sont retournés (isolation par user_id) (AC:4)
5. Given le cache de fichiers existe, When un fichier est demandé et cached_at < 5 minutes, Then le contenu est retourné depuis le cache (AC:5)
6. Given je supprime un repo, When la suppression s'exécute, Then les cached_files associés sont supprimés en cascade (AC:6)

## Tasks / Subtasks

- [x] Task 1 — Installer les dépendances SQLite + Drizzle (AC: #1)
- [x] Task 2 — Créer le schéma Drizzle (AC: #1, #2, #3)
- [x] Task 3 — Créer la connexion et l'initialisation (AC: #1)
- [x] Task 4 — Réécrire `server/api/repos/index.post.ts` (AC: #2, #3)
- [x] Task 5 — Réécrire `server/api/repos/index.get.ts` (AC: #4)
- [x] Task 6 — Réécrire `server/api/repos/[id].patch.ts` (AC: #2)
- [x] Task 7 — Réécrire `server/api/repos/[id].delete.ts` (AC: #6)
- [x] Task 8 — Adapter le caching dans `server/api/github/contents.get.ts` (AC: #5)

## Dev Notes

### Dépendances

- Dépend de Story 7.1 (détection du mode pour user_id)
- Peut être développée en parallèle de Story 7.2
- Bloque Story 7.4 (routes GitHub) et Story 7.5 (nettoyage)

### Schéma SQLite vs Supabase actuel

| Supabase (actuel) | SQLite (cible) | Changement |
|---|---|---|
| `id UUID` | `id TEXT` (hex randomblob) | Type adapté SQLite |
| `user_id UUID REFERENCES auth.users` | `user_id TEXT` (GitHub ID ou 'personal') | Plus de FK vers auth |
| `github_token_encrypted TEXT` | **Supprimé** | Token en session uniquement |
| RLS policies | Filtre `WHERE user_id = ?` en code | Logique applicative |
| `gen_random_uuid()` | `lower(hex(randomblob(16)))` | Équivalent SQLite |

### Structure fichiers

```
data/
  bmad-viewer.db          # Créé automatiquement au premier lancement
server/
  database/
    schema.ts             # Schéma Drizzle
    index.ts              # Connexion + init
```

### Implémentation (2026-02-20)

- `useDatabase()` placé dans `server/utils/database.ts` (auto-import Nitro) et non `server/database/index.ts`
- Schéma dans `server/database/schema.ts` avec `crypto.randomUUID()` pour les IDs
- Tables créées automatiquement via SQL brut au premier appel (pas de migration Drizzle nécessaire)
- `pnpm.onlyBuiltDependencies` ajouté au `package.json` pour `better-sqlite3` (pnpm v10 bloque les build scripts par défaut)
- Note : `drizzle.config.ts` non créé — inutile car les tables sont auto-créées

### File List

- `server/database/schema.ts` — Nouveau (schéma Drizzle)
- `server/utils/database.ts` — Nouveau (connexion SQLite + auto-create tables)
- `server/api/repos/index.post.ts` — Réécrit (Drizzle, sans encryption)
- `server/api/repos/index.get.ts` — Réécrit (Drizzle)
- `server/api/repos/[id].patch.ts` — Réécrit (Drizzle)
- `server/api/repos/[id].delete.ts` — Réécrit (Drizzle)
- `server/api/github/contents.get.ts` — Adapté (cache Drizzle)
