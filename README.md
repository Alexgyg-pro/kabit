# CAGPT — Assistant RAG pour Techniciens Support

Assistant de support basé sur RAG (Retrieval-Augmented Generation) :
embeddings 100% navigateur + cache IndexedDB + LLM local via Ollama.

## Prérequis

- **Node.js** >= 18
- **Ollama** installé et démarré ([ollama.ai](https://ollama.ai))
- Le modèle `phi3:mini` téléchargé

## Installation

### 1. Installer et démarrer Ollama

```bash
# Installation (Windows)
winget install Ollama.Ollama

# Démarrer Ollama
ollama serve

# Télécharger le modèle (dans un autre terminal)
ollama pull phi3:mini
```

### 2. Installer les dépendances

```bash
# Backend
cd back
npm install

# Frontend
cd ../front
npm install
```

### 3. Démarrer l'application

**Terminal 1 — Backend :**
```bash
cd back
npm run dev
# ou : node server.js
# → http://localhost:3001
```

**Terminal 2 — Frontend :**
```bash
cd front
npm run dev
# → http://localhost:5173
```

## Utilisation

1. Ouvrir `http://localhost:5173`
2. Attendre le chargement du modèle d'embedding (~10s la première fois, instantané ensuite)
3. L'indexation du corpus se fait automatiquement au premier lancement (~5-10s)
4. Poser une question — la réponse arrive en streaming depuis Ollama

## Ajouter des documents au corpus

**Option A — Directement dans le dossier :**
Copier des fichiers `.md` ou `.json` dans le dossier `corpus/`, puis cliquer sur **Réindexer** dans l'interface.

**Option B — Via l'interface admin :**
Déplier la section **Administration** en bas de page, remplir titre + contenu, cliquer **Sauvegarder**, puis **Réindexer**.

## Structure du projet

```
cagpt/
├── front/          # React/Vite/TypeScript
│   └── src/
│       ├── App.tsx         # Composant principal
│       ├── db.ts           # Gestion IndexedDB
│       └── embeddings.ts   # Transformers.js wrapper
├── back/           # Express (port 3001)
│   └── server.js
├── corpus/         # Vos fichiers .md de procédures
└── BACKLOG-PO.md   # Backlog Product Owner
```

## Architecture technique

| Étape | Technologie | Latence cible |
|-------|-------------|---------------|
| Embedding question | Transformers.js (Xenova/all-MiniLM-L6-v2) | < 100ms |
| Recherche similarité | Cosinus brut en mémoire | < 50ms |
| Génération réponse | Ollama phi3:mini streaming | < 1000ms |
| Cache embeddings | IndexedDB (persistant) | 0ms après 1ère indexation |
