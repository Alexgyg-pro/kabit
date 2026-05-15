# BACKLOG - CAGPT Product Owner

<!-- Fichier réservé au Product Owner — à remplir au fil des sprints -->

## À faire

### US-024 - Ajout au corpus

**En tant que** administrateur,
**Je veux** une fiche dédiée à la réparation du WMI
**Afin d'** avoir une fiche sur un sujet courant.

Notes : dans mes notes personnelles j'ai ceci :

1. Ouvrir un invite de commande en tant qu'administrateur, puis exécuter les commandes suivantes :
2. cd c:\windows\System32\wbem
3. for /f %s in ('dir /b /s \*.dll') do regsvr32 /s %s
4. net stop /y winmgmt
5. for /f %s in ('dir /b \*.mof') do mofcomp %s
6. net start winmgmt
7. Renommer le dossier "C:\windows\System32\GroupPolicy" en "GroupPolicy.old" (Attention il s'agit d'un fichier caché)
8. Ouvrir un invite de commande en tant qu'administrateur, puis exécuter la commande suivante:
9. gpupdate /force
10. Redémarrer le poste.

Si d'autres procédures semblent pertinentes (notamment de faire ça manuellement plutôt que par des instructions PowerShell) ne pas hésiter à les ajouter.
Il y aurait cette possibilité-là aussi :
Ouvrir la base de registre en admin
HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\AppPrivacy
Rechercher LetAppsAccessMicrophone ou LetAppsAccessCamera
Modifier la Valeur sur 1

### US-019 - Révision du UX

**En tant que** administrateur,
**Je veux** quelques aménagements dans la navigation
**Afin de** afin d'avoir un UX plus fluide.

### US-018 - Révision du UX

**En tant que** utilisateur de l'application,
**Je veux** quelques aménagements sur les couleurs
**Afin de** afin de mieux voir.

### US-020 — Assistant de diagnostic RAG

**En tant qu'** administrateur,
**Je veux** pouvoir diagnostiquer un échec du RAG et obtenir des suggestions d'enrichissement de la fiche manquée,
**Afin d'** améliorer le corpus de façon ciblée, guidée par les vrais cas d'échec.

**Scénario :**

1. L'utilisateur pose une question de test — le RAG ne trouve pas la bonne fiche
2. Un bouton "Diagnostiquer" apparaît sous la réponse (visible en mode Admin)
3. L'utilisateur sélectionne la fiche qui _aurait dû_ être trouvée dans la liste du corpus
4. Le système envoie au LLM : la question + les sources effectivement remontées (avec scores) + le contenu de la fiche manquée
5. Le LLM identifie le décalage de vocabulaire et propose des enrichissements concrets à ajouter à la fiche
6. L'utilisateur peut ouvrir la fiche en édition directement depuis le panneau de diagnostic

**Note :** s'appuie sur les cas d'échec documentés dans `EVAL.md` (Q03, Q04, Q06). Complémentaire à US-017.

---

### US-017 — Corpus supplémentaire

**En tant que** Product Owner,
**Je veux** quelques fichiers de corpus supplémentaires, des .md, portant sur OneDrive et les dossiers partagés,
**Afin de** afin de couvrir un domaine qui ne l'est pas.

## Terminé

### ✅ US-023 - Ajout au corpus — réfonte profil Windows

**En tant que** administrateur,
**Je veux** une fiche dédiée à la réfonte du profil windows
**Afin d'** avoir une fiche sur un sujet courant.

**Livré le :** 15/05/2026 — `corpus/profil-windows-refonte.md`

---

### ✅ US-021 - Sauvegarde d'un pré-prompt par défaut

**En tant que** administrateur,
**Je veux** que l'on puisse retrouver le pré-prompt par défaut,
**Afin de** pouvoir le retrouver si jamais il est effacé.

**Livré le :** 15/05/2026 — branche `feature/default-prompt`

---

### ✅ US-022 - Créer une icône

**En tant que** utilisateur,
**Je veux** une icône pour représenter l'application notamment dans les onglets du navigateur
**Afin d'** que ça ait l'air plus professionnel.

**Livré le :** 15/05/2026 — branche `feature/favicon`

---

### US-015 — Formulaires d'édition du catalogue

**En tant qu'** administrateur,
**Je veux** éditer le catalogue via des formulaires structurés (un formulaire par laptop, application, service),
**Afin de** modifier les données sans risque d'erreur de syntaxe JSON et avec une expérience plus guidée.

**Note :** évolution de US-013 (textarea JSON brut). À affiner avant développement.
**Livré le :** 08/05/2026 — branche `feature/catalogue-crud`

---

### ✅ BUG-003 — Les réponses évoquent souvent Document 1

**Symptôme** : Les réponses évoquaient souvent un _Document 1_ qui ressemble à un nom de variable. Disgracieux en démo.

**Cause** : Les blocs de contexte envoyés au LLM étaient étiquetés `Document 1 :`, `Document 2 :`, etc. Le LLM répétait ce qu'on lui avait écrit.

**Correction** : Suppression du numéro dans l'en-tête de chaque bloc de contexte — le LLM ne dispose plus que du titre du document.

**Livré le :** 05/05/2026 — branche `feature/bug-003-document-1`

---

### ✅ US-016 — Golden dataset — jeu de tests qualité RAG

**En tant que** Product Owner,
**Je veux** disposer d'un jeu de questions de référence avec les réponses et sources attendues,
**Afin de** pouvoir mesurer objectivement l'impact de chaque changement technique sur la qualité des réponses.

**Note :** couvre à la fois les questions procédurales (basées sur les fiches `.md`) et les questions sur le catalogue (basées sur `catalogue-it.json`). À définir en collaboration avec les techniciens support pour que les questions reflètent des cas réels.

**Critères d'acceptance :**

- [x] Un fichier `EVAL.md` liste au minimum 10 questions couvrant les deux types de corpus (.md et .json)
- [x] Chaque question indique la source attendue (fichier ou chunk) et les éléments clés de la réponse correcte
- [x] Le document est utilisé manuellement pour valider chaque évolution du pipeline RAG avant merge

**Livré le :** 05/05/2026 — branche `feature/golden-dataset`
**Baseline :** 9/12 (75 %) — 6/6 catalogue ✅, 3/6 fiches .md ✅. Échecs tracés dans `EVAL.md`.

---

### ✅ US-013 — Édition du catalogue

**En tant qu'** administrateur,
**Je veux** pouvoir éditer le catalogue depuis l'interface,
**Afin de** pouvoir tenir compte des évolutions dans l'entreprise.

**Critères d'acceptance :**

- [x] En mode Administrateur, un accès à l'édition du catalogue est disponible dans la modale admin
- [x] Le contenu du fichier `catalogue-it.json` est affiché dans un textarea éditable
- [x] Le JSON est validé syntaxiquement avant sauvegarde — une erreur bloque l'enregistrement et affiche un message explicite
- [x] La sauvegarde écrit le fichier via le backend et déclenche une réindexation
- [x] Un message de confirmation est affiché après sauvegarde

**Note :** cette US couvre l'édition JSON brut. L'évolution vers des formulaires structurés (un formulaire par laptop, application, service) est tracée en US-015.

**Livré le :** 05/05/2026 — branche `feature/edition-catalogue`

---

### ✅ US-014 — Liste de fiches

**En tant qu'** administrateur,
**Je veux** lister les fiches `.md` disponibles dans l'UI administration,
**Afin de** pouvoir en sélectionner une à éditer directement, sans dépendre des résultats d'une recherche.

**Note :** actuellement, la seule façon d'accéder à une fiche pour la modifier est qu'elle apparaisse comme source d'une réponse. Avec une centaine de fiches, c'est impraticable.

**Critères d'acceptance :**

- [x] La modale admin affiche la liste de toutes les fiches `.md` du corpus
- [x] Chaque fiche est cliquable et ouvre la modale d'édition existante (US-011)
- [x] La liste est scrollable et affiche le titre de chaque fiche
- [x] La liste est actualisée après l'ajout d'une nouvelle fiche

**Livré le :** 05/05/2026 — branche `feature/liste-fiches-admin`

### ✅ US-012 — Bouton copier la question-réponse

**En tant qu'** utilisateur de l'application,
**Je veux** copier ma question et la réponse dans le presse-papier,
**Afin de** pouvoir coller ce texte dans une autre application.

**Critères d'acceptance :**

- [x] Un bouton "Copier" est visible sous la réponse dès qu'elle est affichée
- [x] Le contenu copié contient la question suivie de la réponse (texte brut, sans mise en forme Markdown)
- [x] Un feedback visuel confirme la copie (ex. : le bouton passe à "Copié ✓" quelques secondes)
- [x] Le bouton est absent tant qu'aucune réponse n'a été produite

**Livré le :** 05/05/2026 — branche `feature/copier-question-reponse`

### ✅ BUG-002 — Les fiches .md n'étaient plus retrouvées après changement de modèle d'embedding

**Symptôme :**
Après le passage au modèle multilingue `paraphrase-multilingual-MiniLM-L12-v2`, les questions procédurales ("Outlook ne démarre pas", "À quoi sert Teams ?") ne remontaient plus les fiches `.md` correspondantes. Les réponses provenaient du pré-entraînement du LLM, pas du corpus.

**Causes identifiées :**

1. **Frontmatter YAML brut** — les fiches `.md` commencent par un bloc YAML (`---\ntitle: ...\ncatégorie: ...\n---`) qui occupait une grande partie des 2000 chars d'embedding, diluant le signal sémantique utile.
2. **Seuil unique inadapté** — le seuil de similarité unique (0.35 puis 0.25) ne tenait pas compte de la différence structurelle entre chunks JSON (courts, scores élevés) et fiches `.md` (longues, scores plus bas). Les chunks JSON saturaient le TOP_K.

**Corrections apportées :**

- Stripping du frontmatter YAML avant embedding : les métadonnées (`title`, `catégorie`, `service`, `équipes`, `commentaire`) sont converties en texte naturel dense placé en tête du corps de la fiche
- Seuils distincts : JSON à 0.35 (filtre strict, chunks courts), `.md` à 0.20 (filtre permissif, documents longs)
- TOP_K porté de 3 à 5 pour améliorer la diversité des sources retournées

**Livré le :** 05/05/2026 — branche `develop`

---

### ✅ BUG-001 — Le RAG ne répondait pas aux questions portant sur le catalogue JSON

**Symptôme :**
L'application répondait correctement aux questions basées sur les fiches `.md` mais était incapable d'exploiter `catalogue-it.json`. Les questions sur le matériel informatique ou les applications métier produisaient des réponses génériques sans aucune donnée du catalogue.

**Causes identifiées :**

1. **Indexation monolithique** — le JSON était traité comme un seul document (un vecteur unique moyennant toute la sémantique du fichier), ce qui diluait le signal et rendait le matching impossible pour des questions précises.
2. **Modèle d'embedding non adapté** — `all-MiniLM-L6-v2` est principalement anglophone. Il produisait des scores aberrants en français (le chunk "Trading" matchait mieux que "Marketing" pour une question sur le marketing).
3. **Fichier parasite** — `catalogue-it.bak.json` (ancienne version incomplète) était indexé en parallèle et prenait les slots TOP_K au détriment du bon fichier.

**Corrections apportées :**

- Chunking JSON : `catalogue-it.json` est maintenant découpé en ~65 chunks sémantiques indépendants (un par laptop, application, service, outil support)
- Dénormalisation : les chunks de services embarquent les détails complets des laptops et applications associés (noms, modèles, types — pas seulement des IDs)
- Enrichissement sémantique : les textes d'embedding des laptops incluent des synonymes français ("ordinateur laptop portable…") pour améliorer le matching
- Remplacement du modèle d'embedding par `paraphrase-multilingual-MiniLM-L12-v2` (50+ langues)
- Suppression de `catalogue-it.bak.json` et du modèle Mixtral décommissionné chez Groq

**Livré le :** 05/05/2026 — branche `feature/json-chunking`

---

### ✅ US-011 — Édition d'une fiche corpus depuis la modale

**En tant que** administrateur,
**Je veux** pouvoir modifier le contenu d'une fiche corpus directement depuis sa modale de visualisation,
**Afin de** corriger ou enrichir une procédure sans quitter l'interface.

**Critères d'acceptance :**

- [x] En mode Administrateur, un bouton "Modifier" est visible dans l'en-tête de la modale source
- [x] Le mode édition affiche le contenu brut en markdown (non rendu) dans un textarea
- [x] Les boutons "Sauvegarder" et "Annuler" sont disponibles en mode édition
- [x] La sauvegarde écrit le fichier modifié via le backend
- [x] La visualisation est mise à jour immédiatement après sauvegarde
- [x] Une réindexation est déclenchée après sauvegarde
- [x] Le bouton "Modifier" est absent en mode Technicien

**Livré le :** 04/05/2026 — branche `feature/edition-fiche-corpus`

---

### ✅ ÉPIQUE — Gestion des rôles

Distinguer le technicien de support et l'administrateur afin de protéger les actions sensibles (corpus, pré-prompt) tout en laissant au technicien la liberté de personnaliser son interface.

Stories enfants : US-009, US-010.

**Livré le :** 04/05/2026

---

### ✅ US-010 — Sélection du rôle actif

**En tant que** utilisateur de l'application,
**Je veux** pouvoir basculer entre le rôle Technicien et le rôle Administrateur d'un simple clic,
**Afin de** simuler les deux contextes d'utilisation sans mécanisme d'authentification.

**Critères d'acceptance :**

- [x] Un sélecteur visible dans l'interface permet de choisir entre Technicien et Administrateur
- [x] Le changement est immédiat, sans rechargement ni authentification
- [x] Le rôle actif est clairement indiqué dans l'interface
- [x] Le rôle est persisté entre les sessions (localStorage)

**Livré le :** 04/05/2026 — branche `feature/gestion-roles`

---

### ✅ US-009 — Privilèges administrateur sur le corpus

**En tant que** administrateur,
**Je veux** que l'ajout, la modification et la suppression d'éléments du corpus soient réservés au rôle administrateur,
**Afin de** limiter les erreurs involontaires de la part des techniciens.

**Critères d'acceptance :**

- [x] En mode Technicien, les actions d'ajout, modification et suppression du corpus sont masquées ou désactivées
- [x] En mode Technicien, la modification du pré-prompt système est masquée ou désactivée
- [x] En mode Administrateur, toutes les actions de la modale admin sont accessibles
- [x] Le bouton ⚙ admin est visible uniquement en mode Administrateur

**Livré le :** 04/05/2026 — branche `feature/gestion-roles`

---

### ✅ US-008 — Déplacement du bouton du thème

**En tant que** technicien de support,
**Je veux** que le bouton pour choisir le thème soit accessible depuis la page principale,
**Afin de** pouvoir personnaliser l'interface sans ouvrir la modale d'administration.

**Critères d'acceptance :**

- [x] Un bouton ou toggle thème est visible dans le header de la page principale
- [x] Le bouton n'est plus dans la modale admin
- [x] Le changement de thème reste instantané sur toute l'interface
- [x] Le choix reste persisté entre les sessions (localStorage)

**Livré le :** 04/05/2026 — branche `feature/theme-header`

---

### ✅ ÉPIQUE — Page admin

Regrouper dans une page dédiée les configurations de l'application et l'administration du corpus, afin d'améliorer l'expérience UI et de centraliser les outils de gestion.

Stories enfants : US-003, US-004 (thème), US-005 (pré-prompt éditable).

**Livré le :** 04/05/2026

---

### ✅ US-007 — Rendu Markdown dans la zone de réponse

**En tant que** technicien de support,
**Je veux** que les réponses du modèle soient rendues en Markdown (titres, gras, listes, blocs de code…),
**Afin d'** améliorer la lisibilité et l'expérience UI.

**Critères d'acceptance :**

- [x] Titres H1/H2/H3 stylés avec hiérarchie visuelle claire
- [x] Gras, italique, code inline rendus correctement
- [x] Listes à puces et numérotées mises en forme
- [x] Blocs de code avec fond sombre et coloration distincte
- [x] Blockquotes stylés avec bordure latérale

**Livré le :** 04/05/2026 — branche `feature/rendu-markdown-reponse` (regroupé avec US-006)

---

### ✅ US-006 — Affichage de la question en tête de réponse

**En tant que** technicien de support,
**Je veux** que la question que je pose apparaisse en tête de la réponse, avec un style qui la distingue clairement,
**Afin d'** avoir sous les yeux la question à laquelle j'ai obtenu une réponse.

**Critères d'acceptance :**

- [x] La question s'affiche au-dessus de la réponse dès qu'une réponse est produite
- [x] Style distinct : fond sombre, bordure bleue à gauche, texte en italique
- [x] La question affichée correspond bien à celle qui a déclenché la réponse visible

**Livré le :** 04/05/2026 — branche `feature/rendu-markdown-reponse` (regroupé avec US-007)

---

### ✅ US-005 — Pré-prompt éditable depuis l'interface

**En tant que** technicien de support,
**Je veux** rédiger mon propre pré-prompt depuis l'interface,
**Afin de** personnaliser les instructions envoyées au modèle sans modifier de fichier manuellement.

**Note :** Le pré-prompt éditable ici modifie directement `system-prompt.md` (instructions de contexte métier). Il se situe en tête de chaque appel, avant les documents RAG et la question.

**Critères d'acceptance :**

- [x] Textarea éditable dans la section Pré-prompt de la modale admin
- [x] Bouton "Sauvegarder" écrit le contenu dans `system-prompt.md` via le backend
- [x] Confirmation visuelle après sauvegarde
- [x] Le nouveau pré-prompt est pris en compte dès la question suivante

**Livré le :** 04/05/2026 — branche `feature/edition-preprompt`

---

### ✅ US-004 — Thème clair ou sombre au choix

**En tant que** technicien de support,
**Je veux** pouvoir choisir dans la page admin entre un thème sombre (celui existant) et un clair,
**Afin de** rendre l'expérience UI confortable selon mes préférences.

**Critères d'acceptance :**

- [x] Deux boutons 🌙 Sombre / ☀️ Clair dans la section Préférences de la modale admin
- [x] Le changement de thème est instantané sur toute l'interface
- [x] Le choix est persisté entre les sessions (localStorage)
- [x] Les couleurs de code, textes et fonds sont lisibles dans les deux thèmes

**Livré le :** 04/05/2026 — branche `feature/theme-clair`

---

### ✅ US-003 — Création de la page admin

**En tant que** technicien de support,
**Je veux** une page admin dédiée qui regroupe les outils de configuration et d'administration du corpus,
**Afin de** disposer d'un espace séparé de l'interface principale, plus clair et extensible.

**Critères d'acceptance :**

- [x] Bouton ⚙ dans le header ouvre la modale d'administration
- [x] La modale contient une section Corpus (ajout de procédure + réindexer)
- [x] La modale contient une section Pré-prompt
- [x] La modale contient une section Préférences
- [x] Fermeture par croix, clic en dehors, ou bouton Fermer

**Livré le :** 04/05/2026 — branche `feature/page-admin-modale`

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
