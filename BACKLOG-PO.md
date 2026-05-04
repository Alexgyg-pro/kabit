# BACKLOG - CAGPT Product Owner

<!-- Fichier réservé au Product Owner — à remplir au fil des sprints -->

## À faire

### US-003 - Création de page admin

**En tant que** technicien de support,
**Je veux** une page admin sur lesquels vont s'ajouter certaines configurations et administration du corpus.
**Afin de** améliorer l'expérience UI et alimenter le corpus.

### US-004 - Thème clair ou sombre au choix

**En tant que** technicien de support,
**Je veux** pouvoir choisir dans la page admin entre un thème sombre (celui existant) et un clair.
**Afin de** rendre l'expérience UI confortable au technicien selon ses goûts.

### US-005 - Persistence de la question

**En tant que** technicien de support,
**Je veux** que la question que je pose soit en ête de la réponse, avec un style qui permet de bien la distinguer de la réponse
**Afin de** d'avoir sous les yeux la question à laquelle j'ai obtenu une réponse.

### US-006 - Style dans la réponse

**En tant que** technicien de support,
**Je veux** que les styles soient pris en compte dans les réponses
**Afin de** d'améliorer l'expérience UI du technicien.

### US-002 - Pré-prompt métier

**En tant que** technicien de support,
**Je veux** que l'assistant connaisse mon contexte de travail dès le départ
**Afin de** recevoir des réponses directement adaptées à la résolution d'incidents,
sans avoir à me présenter à chaque conversation.

**Critères d'acceptance :**

1. Fichier de configuration
   Un fichier system-prompt.md existe à la racine du projet et contient les instructions destinées au modèle.
2. Injection automatique
   Le contenu de system-prompt.md est envoyé à chaque appel Groq en tant que message system, avant tout message de
   l'utilisateur.
3. Transparence pour l'utilisateur
   Le technicien ne voit pas le contenu du pré-prompt dans l'interface — il est injecté silencieusement.
4. Dégradation gracieuse
   Si le fichier system-prompt.md est absent, l'application continue de fonctionner normalement, sans erreur.
5. Prise en compte sans redémarrage du frontend
   Toute modification du fichier est prise en compte au prochain envoi de message, sans avoir à relancer le frontend.
6. Non versionné si sensible
   Si le pré-prompt contient des informations internes (nom de l'entreprise, contraintes métier), le fichier peut être
   exclu du dépôt via .gitignore. Un fichier system-prompt.example.md est alors fourni comme modèle.

---

## Terminé

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
