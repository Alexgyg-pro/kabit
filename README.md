# KABIT — Assistant RAG pour Techniciens Support

Assistant de support basé sur RAG (Retrieval-Augmented Generation) :
embeddings 100% navigateur + cache IndexedDB + génération via l'API Groq (LLM cloud).

## Prérequis

- **Node.js** >= 18
- Un compte **Groq** avec une clé API — [console.groq.com](https://console.groq.com)

## Installation

### 1. Cloner et installer les dépendances

```bash
# Backend
cd back
npm install

# Frontend
cd ../front
npm install
```

### 2. Configurer la clé API Groq

Créer le fichier `front/.env.local` (non versionné) :

```
VITE_GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxx
```

> La clé commence toujours par `gsk_`. Sans ce fichier, l'application affiche un avertissement et les réponses LLM ne fonctionnent pas.

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

## Ajouter des documents au corpus

**Option A — Directement dans le dossier :**
Copier des fichiers `.md` ou `.json` dans `corpus/`, puis cliquer sur **Réindexer** dans l'interface.

**Option B — Via le panneau Administration :**
Déplier la section **Administration** en bas de la page, remplir le titre et le contenu, cliquer **Sauvegarder**, puis **Réindexer**.

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
│   └── server.js           # Sert le corpus, expose /corpus/list et /corpus/add
├── corpus/                 # Procédures IT au format .md / .json
└── BACKLOG-PO.md           # Backlog Product Owner
```

---

## Architecture technique

| Étape | Technologie | Détail |
|-------|-------------|--------|
| Embedding question | Transformers.js — `Xenova/all-MiniLM-L6-v2` | Tourne dans un Web Worker, vecteur 384 dims |
| Recherche similarité | Cosinus en mémoire | Seuil 0.35, top 3 documents retenus |
| Génération réponse | Groq API — `llama-3.3-70b-versatile` | Streaming SSE, modèle configurable |
| Cache embeddings | IndexedDB (navigateur) | Persistant entre sessions, vidé sur Réindexer |

### Modèles Groq disponibles

| Modèle | Vitesse | Qualité |
|--------|---------|---------|
| `llama-3.3-70b-versatile` | Moyenne | Meilleure (défaut) |
| `llama-3.1-8b-instant` | Rapide | Bonne |
| `mixtral-8x7b-32768` | Moyenne | Bonne |
| `gemma2-9b-it` | Rapide | Correcte |
