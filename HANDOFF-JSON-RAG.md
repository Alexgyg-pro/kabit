# Handoff — Problème JSON dans le pipeline RAG

## Ce que l'utilisateur veut

Le corpus doit pouvoir contenir deux types de fichiers qui coexistent :
- **`.md`** — fiches narratives (procédures, témoignages, fiabilité variable)
- **`.json`** — données structurées, source de vérité (catalogue matériel, annuaire, etc.)

**Cas de test concret :** `corpus/catalogue-it.json` contient 7 modèles de laptops.
- Question "Quels sont les laptops de l'entreprise ?" → doit retourner les 7 modèles
- Question avec "ordinateur" à la place de "laptop" → doit aussi fonctionner

L'utilisateur a fait la remarque (juste) que le LLM n'a aucun problème à lire un JSON
structuré — clé/valeur, c'est même plus simple que du texte narratif. Le problème vient
du pipeline RAG *avant* le LLM, pas du LLM lui-même.

---

## Architecture du pipeline (front/src/App.tsx)

```
Indexation :
  fichier → contenu brut → embed(toEmbeddingText(content, path)) → vecteur → IndexedDB

Requête :
  question → embed(question) → cosine similarity → top-K docs → contexte → Groq
```

**Constantes importantes :**
- `SIMILARITY_THRESHOLD = 0.35` — score minimum pour qu'un document soit retenu
- `TOP_K = 3` — nombre max de documents dans le contexte
- Modèle d'embedding : `Xenova/all-MiniLM-L6-v2` (anglophone, 384 dimensions)

---

## Ce qui a été tenté (dans l'ordre)

### 1. Conversion JSON → MD (annulée)
Créé `catalogue-it.md` à partir du JSON. L'utilisateur a dit qu'il voulait garder les
deux formats. Le `.json` a été restauré. Le `.md` existe toujours dans le corpus.

### 2. Fonction `flattenJson()` pour l'embedding
JSON brut → texte aplati "clé valeur" sans `{`, `"`, `:`.
Exemple : `laptop ordinaire Lenovo ThinkPad E16 Gen 2 processeur Intel Core i5...`
**Résultat :** améliore la qualité du vecteur d'embedding pour le JSON.

### 3. Normalisation des underscores dans les clés
`laptop_ordinaire` → `laptop ordinaire` pour améliorer la reconnaissance sémantique.

### 4. Contexte envoyé à Groq : JSON brut intégral (pas de troncature)
Correction de l'erreur précédente : le JSON est envoyé tel quel au LLM (pas aplati,
pas tronqué). Le LLM lit parfaitement la structure JSON.
Pour les `.md` : toujours tronqués à 1500 chars.

---

## Pourquoi ça ne marche probablement toujours pas

### Hypothèse 1 — Pas de réindexation
L'IndexedDB conserve les anciens vecteurs. Après chaque changement de code lié à
l'indexation, il faut cliquer "Réindexer" dans l'app. **À vérifier en premier.**

### Hypothèse 2 — Score de similarité sous le seuil
Le modèle `all-MiniLM-L6-v2` est anglophone. "Quels sont les laptops" vs texte aplati
du JSON → le score pourrait être à 0.33 au lieu de 0.35 (juste sous le seuil).
**À vérifier :** ajouter un `console.log` des scores dans `App.tsx` pour voir ce qui
se passe réellement.

### Hypothèse 3 — Le .md "vole" les slots TOP_K=3
Si `catalogue-it.md` a un meilleur score que `catalogue-it.json` sur la même requête,
il prend sa place parmi les 3 documents retenus. Les deux couvrent le même contenu.

### Hypothèse 4 — Saut sémantique "ordinateur" / "laptop"
Le modèle n'a pas appris l'équivalence français/anglais pour ces termes. Le texte aplati
contient "laptop ordinaire" mais pas "ordinateur portable". Le `.md` contient
"Matériel informatique" mais pas "ordinateur" explicitement non plus.

---

## Pistes à explorer (par ordre de priorité)

### Piste A — Diagnostiquer d'abord (5 min)
Dans `runIndexing` et `handleAsk`, ajouter des `console.log` :
```typescript
// À l'indexation : vérifier que le texte aplati est bien généré
console.log(`[${file.path}] embedding text:`, toEmbeddingText(content, file.path).slice(0, 200));

// À la requête : voir tous les scores, pas seulement ceux au-dessus du seuil
const scored = docs.map((doc) => ({ doc, score: cosineSimilarity(qEmbed, doc.embedding) }));
console.log('scores:', scored.map(r => ({ path: r.doc.path, score: r.score.toFixed(3) })));
```
Cela donnera une image réelle de ce qui se passe.

### Piste B — Chunking du JSON (solution robuste)
Au lieu d'indexer le JSON comme un seul document, le découper en entrées individuelles
à l'indexation. Chaque laptop devient son propre document indexé :
```
id: "catalogue-it.json#laptop/0"
title: "Lenovo ThinkPad E16 Gen 2"
content: { "modele": "Lenovo...", "processeur": "...", ... }
```
C'est ce que fait LangChain avec `JSONLoader`. Avantage : chaque entrée a son propre
vecteur, le matching est bien plus précis. Inconvénient : il faut définir quelle clé
représente les "entrées" à indexer (configurable par fichier ou convention).

### Piste C — Champ `_synonymes` dans le JSON
Ajouter un champ conventionnel (ex: `_index_hint`) dans les JSONs pour enrichir
l'embedding avec des mots-clés en langage naturel :
```json
{
  "_index_hint": "catalogue matériel informatique ordinateurs portables laptops notebooks",
  "materiel": { ... }
}
```
Simple, rétrocompatible, contrôlé par l'utilisateur.

### Piste D — Baisser le seuil de similarité
Tester avec `SIMILARITY_THRESHOLD = 0.28` au lieu de `0.35` pour voir si le document
est trouvé. Si oui, le problème est le seuil, pas l'embedding.

### Piste E — Query expansion côté question
Avant d'embeder la question, l'enrichir avec des synonymes connus :
"ordinateur" → "ordinateur laptop notebook portable". Complexe, à éviter sauf si
les autres pistes échouent.

---

## État du code actuel (branche develop)

Fichiers modifiés par rapport à l'état initial de session :
- `front/src/App.tsx` : fonctions `flattenJson()` et `toEmbeddingText()` ajoutées,
  pipeline embedding différencié JSON/MD, contexte Groq JSON brut intégral
- `back/server.js` : endpoint `PUT /corpus/file` ajouté
- `corpus/catalogue-it.md` : version Markdown du catalogue (coexiste avec le .json)
- `corpus/catalogue-it.json` : restauré tel quel après tentative de suppression

La **Piste A** (diagnostiquer via console.log) devrait être le premier réflexe.
