# KABIT — Assistant RAG pour Techniciens Support

Assistant de support basé sur RAG (Retrieval-Augmented Generation) :
embeddings 100% navigateur + cache IndexedDB + génération via l'API Groq (LLM cloud).

## Prérequis

- **Node.js** >= 18
- Un compte **Groq** avec une clé API — [console.groq.com](https://console.groq.com)

## Installation

### 1. Se placer à la racine du projet

Le développement (Git, Claude Code, scripts) se pilote depuis la racine `kabit/`, pas depuis `front/` ni `back/`. Ce n'est qu'au moment de lancer une commande `npm` spécifique qu'on descend dans le sous-dossier concerné.

### 2. Cloner et installer les dépendances

```bash
# Backend
cd back
npm install

# Frontend
cd ../front
npm install
```

### 3. Configurer la clé API Groq

Créer le fichier `front/.env.local` (non versionné) :

```
VITE_GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxx
```

> La clé commence toujours par `gsk_`. Sans ce fichier, l'application affiche un avertissement et les réponses LLM ne fonctionnent pas.

### 4. Générer le corpus de travail

Le dossier `corpus/` n'est **pas versionné** (voir [Corpus : patrimoine vs bac à sable](#corpus--patrimoine-vs-bac-à-sable)). Après un clone, on le recrée depuis le patrimoine `corpus-seed/` :

```bash
cd back
npm run corpus:reset
```

---

## Lancer le projet

Il faut deux terminaux ouverts simultanément.

**Terminal 1 — Backend :**
```bash
cd back
npm run dev
# → http://localhost:3001
```

**Terminal 2 — Frontend :**
```bash
cd front
npm run dev
# → http://localhost:5173
```

Ouvrir `http://localhost:5173` dans le navigateur.

### Premier lancement

1. Le modèle d'embedding (`Xenova/all-MiniLM-L6-v2`, ~50 Mo) se télécharge automatiquement depuis HuggingFace — attendre la barre de progression.
2. L'indexation du corpus démarre ensuite (~5–15s selon le nombre de fichiers).
3. Une fois terminé, l'interface est prête à répondre aux questions.

Les embeddings sont mis en cache dans IndexedDB — les lancements suivants sont quasi-instantanés.

---

## Utilisation

1. Taper une question dans le champ de saisie et appuyer sur **Entrée** ou cliquer **Envoyer**.
2. La réponse arrive en streaming depuis l'API Groq.
3. Cliquer sur un document source dans le panneau latéral pour lire la procédure complète.

### Paramètres disponibles

| Paramètre | Description |
|-----------|-------------|
| **Modèle** | Sélecteur de modèle Groq (llama-3.3-70b par défaut) |
| **Mémoire** | Nombre d'échanges précédents envoyés au LLM (0 à 6) |
| **Réindexer** | Force la ré-indexation du corpus (utile après ajout de fichiers) |

---

## Interface d'administration

Accessible via le bouton **⚙ Administration** dans l'en-tête (rôle Administrateur requis, cf. sélecteur de rôle). La modale est organisée en 3 onglets ; le bouton **Réindexer le corpus** reste visible en permanence au-dessus, quel que soit l'onglet actif.

| Onglet | Contenu |
|--------|---------|
| **Corpus** | Formulaire d'ajout de fiche · liste des fiches existantes (clic pour ouvrir/éditer) · éditeur structuré du catalogue IT |
| **Sources KDocs** | Gestionnaire du pipeline KB → KDoc : fichiers `KBOffs/` et `KDocs/`, statuts de référencement |
| **Préférences** | Niveau technicien (adapte les conseils d'escalade) · pré-prompt système (`system-prompt.md`) |

> ⚠️ **Démo uniquement :** la création, l'édition et l'affichage de fiches dans l'onglet **Corpus** opèrent sur `KBOld/` — un corpus de démonstration fictif. Dans un usage réel, la base de connaissances de l'entreprise reste la source unique (voir [Corpus : patrimoine vs bac à sable](#corpus--patrimoine-vs-bac-à-sable)) ; ces fiches n'ont pas vocation à être éditées depuis KABIT.

### Ajouter des documents au corpus

**Option A — Directement dans le dossier :**
Copier des fichiers `.md` dans `corpus/KBOld/` (ou `.json` à la racine), puis cliquer sur **Réindexer** dans l'interface.

**Option B — Via l'onglet Corpus de l'admin :**
Remplir le titre et le contenu dans le formulaire, cliquer **Sauvegarder**, puis **Réindexer**.

---

## Corpus : patrimoine vs bac à sable

Le corpus est séparé en deux dossiers :

| Dossier | Rôle | Versionné ? |
|---------|------|-------------|
| **`corpus-seed/`** | Patrimoine figé : `KBOld/` + `KBOffs/` (avec leurs annotations) + catalogue racine + `references.seed.json` vierge. Source de vérité. | ✅ Oui |
| **`corpus/`** | Bac à sable de l'application : KDocs générés, statuts, expérimentations. Jetable. | ❌ Non (gitignoré) |

À la racine de `corpus/` ne restent que le catalogue matériel (`catalogue-it.json`/`.md`) et `references.json` (bookkeeping du pipeline KDocs). Les anciennes fiches KB « officielles » (héritées du principe initial d'un corpus dédié, abandonné au profit d'une base de connaissances unique côté entreprise) vivent dans **`KBOld/`** — toujours indexées pour le RAG, comme avant leur déplacement.

Ainsi, **expérimenter dans l'app ne pollue jamais git**.

### Remettre le corpus à zéro

Depuis `back/` :

```bash
# Recrée corpus/ depuis le seed (references vierge, KDocs vidé, KBOffs restaurés)
npm run corpus:reset -- --force
```

> Le `-- --force` est obligatoire pour écraser un `corpus/` existant (garde-fou anti-accident).
> Sur un dossier `corpus/` absent (après un clone), `npm run corpus:reset` suffit.

### Promouvoir un essai au patrimoine

Pour qu'une fiche ou une KB modifiée survive aux resets, la copier dans `corpus-seed/` et la committer (`corpus: …`).

---

## Structure du projet

```
kabit/
├── front/                  # React/Vite/TypeScript (port 5173)
│   ├── .env.local          # Clé API Groq — NE PAS COMMITTER
│   └── src/
│       ├── App.tsx                 # Composant principal, pipeline RAG
│       ├── embedding.worker.ts     # Web Worker HuggingFace Transformers.js
│       ├── embeddings.ts           # Interface Worker + calcul cosinus
│       └── db.ts                   # Cache embeddings (IndexedDB)
├── back/                   # Express (port 3001)
│   ├── server.js           # Sert le corpus, expose /corpus/* et /kdocs/*
│   └── scripts/
│       └── corpus-reset.js # Régénère corpus/ depuis corpus-seed/
├── corpus-seed/            # Patrimoine versionné (seed du corpus)
│   └── KBOld/                       # Anciennes fiches KB officielles (indexées)
├── corpus/                 # Bac à sable de l'app — GITIGNORÉ (recréé par corpus:reset)
│   └── KBOld/                       # Copie de travail des fiches KBOld (indexées)
└── BACKLOG-PO.md           # Backlog Product Owner
```

---

## Architecture technique

| Étape | Technologie | Détail |
|-------|-------------|--------|
| Embedding question | Transformers.js — `Xenova/all-MiniLM-L6-v2` | Tourne dans un Web Worker, vecteur 384 dims |
| Recherche similarité | Cosinus en mémoire | Seuil 0.35, top 3 documents retenus |
| Génération réponse | Groq API — `openai/gpt-oss-120b` | Streaming SSE, modèle configurable |
| Cache embeddings | IndexedDB (navigateur) | Persistant entre sessions, vidé sur Réindexer |

### Modèles Groq disponibles

| Modèle | Vitesse | Qualité |
|--------|---------|---------|
| `openai/gpt-oss-120b` | Moyenne | Meilleure (défaut) |
| `openai/gpt-oss-20b` | Rapide | Bonne |
| `qwen/qwen3.8-27b` | Moyenne | Bonne |

> ⚠️ Groq retire régulièrement des modèles de son catalogue. En cas d'erreur `model_not_found`, vérifier la liste à jour sur [console.groq.com/docs/models](https://console.groq.com/docs/models) ou via `GET https://api.groq.com/openai/v1/models`, et mettre à jour `GROQ_MODELS` dans `front/src/App.tsx`.

**Afficher le catalogue complet (JSON brut) :**
```bash
curl.exe https://api.groq.com/openai/v1/models -H "Authorization: Bearer TA_CLE_ICI"
```
> Sous PowerShell, `curl` est un alias vers `Invoke-WebRequest` qui ne gère pas `-H` de la même façon — utiliser `curl.exe` explicitement (l'exécutable Windows natif), ou la commande PowerShell ci-dessous.

**Afficher juste l'id et le fournisseur de chaque modèle (PowerShell, sans dépendance externe) :**
```powershell
(Invoke-RestMethod -Uri "https://api.groq.com/openai/v1/models" -Headers @{ Authorization = "Bearer TA_CLE_ICI" }).data |
  Select-Object id, owned_by |
  Sort-Object id |
  Format-Table -AutoSize
```
