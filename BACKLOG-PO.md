# BACKLOG - CAGPT Product Owner

<!-- Fichier réservé au Product Owner — à remplir au fil des sprints -->

## À faire

### ÉPIQUE — Page admin

Regrouper dans une page dédiée les configurations de l'application et l'administration du corpus, afin d'améliorer l'expérience UI et de centraliser les outils de gestion.

Stories enfants : US-003, US-004.

---

### US-004 - Thème clair ou sombre au choix

> Dépend de US-003 (la page admin doit exister pour accueillir ce paramètre).

**En tant que** technicien de support,
**Je veux** pouvoir choisir dans la page admin entre un thème sombre (celui existant) et un clair,
**Afin de** rendre l'expérience UI confortable selon mes préférences.

---

## Terminé

### US-004 - Ajout de pré-prompt éditable

**En tant que** technicien de support,
**Je veux** rédiger mon propre pré-prompt,
**Afin de** de personnaliser les réponses que je veux obtenir.

note : system-prompt.md n'était sans doute pas modifiable, il s'agirait d'un prompt se situant entre system-prompt.md et la question posée. Le fichier pourrait se trouver avec les fichiers .md du corpus.

---

### US-003 - Création de la page admin

**En tant que** technicien de support,
**Je veux** une page admin dédiée qui regroupe les outils de configuration et d'administration du corpus,
**Afin de** disposer d'un espace séparé de l'interface principale, plus clair et extensible.

---

### ✅ US-005 — Affichage de la question en tête de réponse

**En tant que** technicien de support,
**Je veux** que la question que je pose apparaisse en tête de la réponse, avec un style qui la distingue clairement,
**Afin d'** avoir sous les yeux la question à laquelle j'ai obtenu une réponse.

**Critères d'acceptance :**

- [x] La question s'affiche au-dessus de la réponse dès qu'une réponse est produite
- [x] Style distinct : fond sombre, bordure bleue à gauche, texte en italique
- [x] La question affichée correspond bien à celle qui a déclenché la réponse visible

**Livré le :** 04/05/2026 — branche `feature/rendu-markdown-reponse` (regroupé avec US-006)

---

### ✅ US-006 — Rendu Markdown dans la zone de réponse

**En tant que** technicien de support,
**Je veux** que les réponses du modèle soient rendues en Markdown (titres, gras, listes, blocs de code…),
**Afin d'** améliorer la lisibilité et l'expérience UI.

**Critères d'acceptance :**

- [x] Titres H1/H2/H3 stylés avec hiérarchie visuelle claire
- [x] Gras, italique, code inline rendus correctement
- [x] Listes à puces et numérotées mises en forme
- [x] Blocs de code avec fond sombre et coloration distincte
- [x] Blockquotes stylés avec bordure latérale

**Livré le :** 04/05/2026 — branche `feature/rendu-markdown-reponse` (regroupé avec US-005)

---

### ✅ US-001 — Afficher le contenu d'un document source

**En tant que** technicien,
**Je veux** cliquer sur une source affichée sous la réponse
**Afin de** lire le document original et vérifier les étapes de la procédure.

**Critères d'acceptance :**

- [x] Clic sur une source ouvre une modale
- [x] Le contenu est rendu en markdown (titres, gras, italique, tableaux, blocs de code)
- [x] Fermeture par croix ou clic en dehors
- [x] Les scores de similarité restent visibles sur la liste des sources

**Livré le :** 01/05/2026 — branche `feature/affichage-document-source` + `feature/rendu-markdown-modal`

---

### ✅ US-002 — Pré-prompt métier

**En tant que** technicien de support,
**Je veux** que l'assistant connaisse mon contexte de travail dès le départ
**Afin de** recevoir des réponses directement adaptées à la résolution d'incidents,
sans avoir à me présenter à chaque conversation.

**Critères d'acceptance :**

- [x] Un fichier `system-prompt.md` existe à la racine du projet et contient les instructions destinées au modèle
- [x] Le contenu est envoyé à chaque appel Groq en tant que message `system`, avant tout message de l'utilisateur
- [x] Le technicien ne voit pas le contenu du pré-prompt dans l'interface — il est injecté silencieusement
- [x] Si le fichier est absent, l'application continue de fonctionner normalement, sans erreur
- [x] Toute modification du fichier est prise en compte au prochain rechargement de page, sans redémarrer le frontend
- [x] Un badge "Pré-prompt actif" cliquable dans la barre de statut permet de visualiser le contenu chargé

**Livré le :** 04/05/2026 — branche `develop`
