# BACKLOG - CAGPT Product Owner

<!-- Fichier réservé au Product Owner — à remplir au fil des sprints -->

## À faire

### US-001 — Afficher le contenu d'un document source
**En tant que** technicien,  
**Je veux** cliquer sur une source affichée sous la réponse  
**Afin de** lire le document original et vérifier les étapes de la procédure.

**Critères d'acceptance :**
- Clic sur une source ouvre un panneau ou une modale
- Le contenu complet du fichier .md est affiché (rendu texte brut ou markdown)
- Fermeture par croix ou clic en dehors
- Les scores de similarité restent visibles sur la liste des sources

**Notes techniques :** le contenu est déjà en mémoire dans IndexedDB (`DocRecord.content`) — pas de requête backend nécessaire.
