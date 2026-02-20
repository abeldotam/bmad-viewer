---
stepsCompleted: [1, 2, 3]
inputDocuments: []
session_topic: 'Transition open-source de bmad-viewer — remplacement de Supabase par une solution self-host clef en main'
session_goals: 'Solution auth + stockage tokens clef en main, installation simple, zéro compromis sécurité, pas de dépendance cloud externe'
selected_approach: 'ai-recommended'
techniques_used: ['Constraint Mapping', 'First Principles Thinking', 'Chaos Engineering']
ideas_generated: ['dual-mode-architecture', 'github-oauth-as-identity', 'sqlite-embedded', 'pat-personal-mode', 'no-token-storage', 'session-cookie-encryption']
context_file: ''
---

# Brainstorming Session Results

**Facilitator:** Abel
**Date:** 2026-02-20

## Session Overview

**Topic:** Transition open-source de bmad-viewer — remplacement de Supabase par une solution self-host clef en main
**Goals:** Solution auth + stockage tokens clef en main, installation simple, zéro compromis sécurité, pas de dépendance cloud externe

### Session Setup

Le projet bmad-viewer utilise actuellement Supabase pour l'authentification (via @nuxtjs/supabase), le stockage des tokens GitHub chiffrés (PostgreSQL + AES-256-GCM), et le Row-Level Security. L'objectif est de trouver une architecture alternative permettant un self-hosting simple et sécurisé.

## Technique Selection

**Approach:** AI-Recommended Techniques
**Analysis Context:** Transition open-source avec focus sur simplicité, sécurité, et autonomie

**Recommended Techniques:**

- **Constraint Mapping:** Identifier toutes les contraintes réelles vs imaginées avant de générer des solutions
- **First Principles Thinking:** Déconstruire le problème jusqu'aux fondamentaux pour reconstruire sans biais Supabase
- **Chaos Engineering:** Stress-tester les meilleures solutions contre les pires scénarios

## Technique Execution Results

### Constraint Mapping

**Contraintes identifiées :**

| Contrainte | Type | Négociable ? |
|---|---|---|
| Multi-user sur bmad.ninja (hosted) | Fonctionnelle | Non |
| Self-hostable facilement | Fonctionnelle | Non |
| Open-source | Stratégique | Non |
| Tokens GitHub sécurisés | Sécurité | Non |
| Résistant aux attaquants | Sécurité | Non |
| Simple à setup | UX | Non |
| Se passer de Supabase | Technique | Oui (c'est un moyen, pas une fin) |

**Contrainte éliminée :** Zero-knowledge encryption n'est pas nécessaire si on ne stocke plus les tokens de manière persistante.

### First Principles Thinking

**Question fondamentale :** Pourquoi stocker les tokens GitHub ?

**Réponse :** bmad-viewer est read-only sur les repos. La seule écriture = création d'issues. GitHub OAuth fournit un token de session qui suffit pour toutes ces opérations.

**Insight clé :** GitHub IS l'identité. Pas besoin d'une couche d'auth séparée.

**Architecture retenue — Dual Mode :**

1. **Mode Personal** (self-host solo) : `GITHUB_TOKEN` dans `.env`, pas de login screen
2. **Mode Multi-user** (hosted/équipe) : GitHub OAuth via `nuxt-auth-utils`, token en cookie session chiffré, SQLite pour les repos

### Chaos Engineering (Stress-test)

- Token en cookie session chiffré → si serveur compromis, aucun token en base
- Mode Personal avec PAT en .env → standard industrie, jamais commité (.gitignore)
- SQLite → fichier unique, backups simples, pas de service externe à sécuriser
- Pas de RLS nécessaire en mode Personal (1 seul user)
- Mode Multi-user : isolation par user_id en code (pas de RLS SQL mais logique applicative)

## Décision finale

**Architecture retenue :** Dual-mode (Personal + Multi-user) avec GitHub OAuth + SQLite embarqué, sans aucune dépendance cloud externe.
