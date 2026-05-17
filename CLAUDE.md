# CLAUDE.md — Règles du projet KABIT

## Langue
Toujours répondre en français.

## Git — Stratégie de branches

```
main
 └── develop
      └── feature/[nom-court]
```

- **main** : versions majeures stables uniquement. Merge depuis develop uniquement.
- **develop** : branche d'intégration. Toujours partir de develop pour une nouvelle fonctionnalité.
- **feature/[nom]** : une branche par fonctionnalité. Supprimée après fusion dans develop.

### Règles
- Toute nouvelle fonctionnalité = nouvelle branche `feature/` depuis develop
- Fusion dans develop uniquement quand la fonctionnalité est satisfaisante
- Supprimer la branche feature après la fusion
- Merger develop dans main uniquement pour une version majeure
- Messages de commit courts et directs — pas de verbosité

### Exemples de noms de branches
- `feature/affichage-document-source`
- `feature/historique-conversations`
- `feature/export-pdf`

### Format des commits
```
type: description courte
```
Types : `feat`, `fix`, `style`, `refactor`, `docs`, `corpus`

Exemples :
- `feat: affichage du document source au clic`
- `fix: prompt 70B trop restrictif`
- `corpus: ajout 20 fiches support N1`
- `docs: BACKLOG-PO US-001`

## Stack technique
- **Front** : React/Vite + TypeScript — port 5173
- **Back** : Express — port 3001
- **Embeddings** : @huggingface/transformers (Xenova/all-MiniLM-L6-v2) dans un Web Worker
- **LLM** : Groq API (llama-3.3-70b-versatile par défaut)
- **Cache** : IndexedDB

## Ce qu'il ne faut pas committer
- `front/.env.local` (clé API Groq) — couvert par `.gitignore`
- `node_modules/`
- `dist/`
