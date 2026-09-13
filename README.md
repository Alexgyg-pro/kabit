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

## Distribution (mode production)

Pour transférer KABIT sur un autre poste (ex. démo/présentation) sans dépôt Git ni environnement de dev complet : un build unique du frontend, puis copie des fichiers nécessaires (OneDrive, clé USB…).

### 1. Builder le frontend

Depuis la racine, avec `front/.env.local` déjà configuré (la clé Groq est intégrée au build — pas besoin de la reconfigurer sur le poste cible) :

```powershell
.\build.ps1
```

Génère `front/dist/` (build statique, ~20 Mo, dont le runtime WASM du modèle d'embedding).

### 2. Copier les fichiers sur le poste cible

```
back/server.js
back/package.json
front/dist/                 (dossier complet)
corpus/                     (dossier complet)
system-prompt.md
system-prompt.default.md
```

> Copier `corpus/` tel quel reproduit l'état exact du corpus (fiches, statuts KBOffs/KDocs, KDocs générés) — pas besoin de `corpus:reset` sur le poste cible.

### 3. Lancer sur le poste cible

Node.js >= 18 doit être installé. Dans `back/` :

```bash
npm install
node server.js
```

Ouvrir `http://localhost:3001` — un seul terminal suffit : le serveur sert directement le build React, pas besoin de Vite ni d'un second port.

---

## Utilisation

1. Taper une question dans le champ de saisie et appuyer sur **Entrée** ou cliquer **Envoyer**.
2. La réponse arrive en streaming depuis l'API Groq.
3. Cliquer sur un document source dans le panneau latéral pour lire la procédure complète.

### Paramètres disponibles

| Paramètre | Description |
|-----------|-------------|
| **Modèle** | Sélecteur de modèle Groq (GPT OSS 120B par défaut) |
| **Mémoire** | Nombre d'échanges précédents envoyés au LLM (0 à 6) |
| **Réindexer** | Force la ré-indexation du corpus (utile après ajout de fichiers) |

---

## Interface d'administration

Accessible via le bouton **⚙ Administration** dans l'en-tête (rôle Administrateur requis, cf. sélecteur de rôle). La modale est organisée en 4 onglets ; une barre globale reste visible en permanence au-dessus, quel que soit l'onglet actif : le bouton **Réindexer le corpus**, et un switch **KBOld actif** (coché par défaut) pour inclure ou non `KBOld/` dans l'indexation RAG — utile pour tester la pertinence du RAG avec seulement quelques `KDocs/`, sans supprimer `KBOld/`.

| Onglet | Contenu |
|--------|---------|
| **Corpus** | Formulaire d'ajout de fiche · liste des fiches existantes (clic pour ouvrir/éditer) |
| **Catalogue IT** | Éditeur structuré de `catalogue-it.json` (services, matériel, applications, outils) |
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
| **`corpus-seed/`** | Patrimoine figé : `KBOld/` + `KBOffs/` + `KDocs/` + catalogue racine + `references.seed.json` vierge. Source de vérité. | ✅ Oui |
| **`corpus/`** | Bac à sable de l'application : statuts, expérimentations. Jetable. | ❌ Non (gitignoré) |

À la racine de `corpus/` ne restent que le catalogue matériel (`catalogue-it.json`/`.md`) et `references.json` (bookkeeping du pipeline KDocs, toujours vierge après un reset — voir [Pipeline KB → KDoc](#pipeline-kb--kdoc)). Les anciennes fiches KB « officielles » (héritées du principe initial d'un corpus dédié, abandonné au profit d'une base de connaissances unique côté entreprise) vivent dans **`KBOld/`** — toujours indexées pour le RAG, comme avant leur déplacement.

Ainsi, **expérimenter dans l'app ne pollue jamais git**.

### Remettre le corpus à zéro

Depuis `back/` :

```bash
# Recrée corpus/ depuis le seed (KBOld/KBOffs/KDocs restaurés, references.json remis à vide)
npm run corpus:reset -- --force
```

> Les statuts KBOffs/KDocs (`references.json`) ne sont jamais versionnés : après un reset, les fichiers `KBOffs/`/`KDocs/` du seed sont bien présents mais apparaissent « non répertoriés » dans l'admin — à réattribuer si besoin.

> Le `-- --force` est obligatoire pour écraser un `corpus/` existant (garde-fou anti-accident).
> Sur un dossier `corpus/` absent (après un clone), `npm run corpus:reset` suffit.

### Promouvoir un essai au patrimoine

Pour qu'une fiche ou une KB modifiée survive aux resets, la copier dans `corpus-seed/` et la committer (`corpus: …`).

---

## Pipeline KB → KDoc

L'onglet **Sources KDocs** de l'administration gère la transformation d'une KB officielle brute (`KBOffs/`) en fiche `KDoc` propre et indexable (`KDocs/`). Accès : sous-onglets **KBOffs** / **KDocs**, avec filtres par statut ; clic pour sélectionner/attribuer un statut, double-clic pour ouvrir.

### Statuts d'une KB (`KBOffs/`)

| Statut | Signification |
|--------|---------------|
| *(non répertorié)* | KB pas encore triée |
| `selected` | KB retenue, à transformer en KDoc |
| `out` | KB écartée (obsolète, hors périmètre, non pertinente) |
| `duplicate` | Doublon d'une KB déjà traitée |
| `done` | Un KDoc a déjà été généré à partir de cette KB (liaison via le champ `kdoc`) |

### Statuts d'un KDoc (`KDocs/`)

| Statut | Signification |
|--------|---------------|
| `testing` | KDoc généré, statut par défaut, pas encore validé |
| `passed` | KDoc validé, contenu jugé fiable |
| `rejected` | KDoc à revoir ou à supprimer |

> Le statut n'affecte pas l'indexation RAG : un KDoc est indexé dès qu'il existe dans `KDocs/`, quel que soit son statut. Les statuts ne servent qu'au suivi humain du pipeline, via `references.json` (bac à sable, jamais versionné).

### Générer un KDoc

1. Double-cliquer une KB dans le sous-onglet **KBOffs** pour l'ouvrir.
2. Cliquer **Générer un KDoc** : le contenu brut est envoyé au LLM avec un prompt dédié qui produit une fiche au format KABIT (frontmatter + sections *Symptômes*, *Précautions*, *Procédure*, *Vérification*, *Notes*), fidèle à la source, limitée à 3000 caractères.
3. Relire/corriger le texte généré, ajouter une **note technicien** optionnelle (hors-embedding, ajoutée après le marqueur `<<<NOTE>>>` — visible au technicien mais exclue du RAG).
4. **Enregistrer dans KDocs/** : crée le fichier (statut `testing`) et marque la KB source `done`. Une KB n'a jamais plus d'un KDoc — un enregistrement ultérieur met à jour le même fichier plutôt que d'en créer un second.
5. Une fois testé, basculer le statut du KDoc vers `passed` ou `rejected` depuis le sous-onglet **KDocs**.

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
│   ├── KBOld/                       # Anciennes fiches KB officielles (indexées)
│   ├── KBOffs/                      # KB officielles brutes, en attente de tri
│   └── KDocs/                       # KDocs promus au patrimoine
├── corpus/                 # Bac à sable de l'app — GITIGNORÉ (recréé par corpus:reset)
│   ├── KBOld/                       # Copie de travail des fiches KBOld (indexées)
│   ├── KBOffs/                      # Copie de travail (non indexée pour le RAG)
│   └── KDocs/                       # Copie de travail des KDocs (indexés)
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
