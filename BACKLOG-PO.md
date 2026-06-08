# BACKLOG - KABIT Product Owner

<!-- Fichier réservé au Product Owner — à remplir au fil des sprints -->

## À faire

### US-035 — Zone hors-embedding dans les fiches : notes destinées au technicien

**En tant que** rédacteur de fiche corpus,
**Je veux** pouvoir ajouter une section en bas de fiche qui ne soit pas indexée par le RAG,
**Afin de** glisser des conseils à l'intention du technicien — par exemple comment formuler son prompt pour obtenir une meilleure réponse dans un contexte donné — sans polluer l'embedding.

**Comportement attendu :**
- Un marqueur spécial (ex. : `<<<NOTE>>>`) délimite la fin du contenu indexé
- Tout ce qui se trouve **après** ce marqueur est exclu de l'embedding et du chunking
- Le contenu après le marqueur reste **visible dans la modale de visualisation de la fiche**
- La section est affichée avec un style distinct dans la modale (ex. : fond légèrement différent, titre "Note technicien")

**Exemple d'usage dans une fiche :**
```
[...procédure...]

<<<NOTE>>>
💡 Pour obtenir une procédure pas-à-pas adaptée au niveau du technicien,
préférez la formulation : "L'utilisateur a le message X, donne-moi les étapes détaillées."
```

**Critères d'acceptance :**
- [ ] Le marqueur est reconnu à l'indexation : le contenu après est exclu de l'embedding
- [ ] La modale de visualisation affiche la note avec un style distinct
- [ ] La note n'apparaît pas dans le contexte envoyé au LLM
- [ ] Le marqueur est documenté dans le formulaire d'édition (placeholder ou tooltip)

---

### US-034 — Indicateur de longueur dans les formulaires de fiche

**En tant qu'** administrateur,
**Je veux** voir le nombre de caractères de la fiche en cours d'édition ou de création, avec une limite conseillée affichée,
**Afin de** ne pas dépasser la taille optimale pour le RAG et éviter que la procédure soit tronquée lors du chunking.

**Comportement attendu :**
- Sous le textarea, afficher un compteur au format `1256 / 2200`
- Si le contenu dépasse 2200 caractères, le nombre de gauche passe en rouge
- Présent dans le formulaire de **création** et le formulaire d'**édition** d'une fiche

**Critères d'acceptance :**
- [ ] Le compteur se met à jour en temps réel à chaque frappe
- [ ] Le seuil de 2200 caractères déclenche le passage en rouge
- [ ] Le compteur est visible sans scroller (positionné juste sous le textarea)

---

### ✅ US-040 — Composant partagé de visualisation et d'édition de fiche

**En tant qu'** administrateur,
**Je veux** un composant unique de visualisation/édition utilisé partout dans l'application où l'on ouvre une fiche,
**Afin d'** avoir une expérience cohérente et de ne pas maintenir deux implémentations parallèles.

**Contexte :**
Il existe actuellement deux endroits où une fiche markdown est affichée avec possibilité d'édition :
- Les fiches du corpus racine (`corpus/*.md`), ouvertes depuis la liste "Fiches du corpus" ou depuis les sources d'une réponse
- Les KDocs générés (`corpus/KDocs/*.md`), pour lesquels il n'y a pas encore de visualisation post-génération

Le comportement attendu est identique dans les deux cas : affichage rendu en markdown, bouton Modifier (admin uniquement), textarea, Sauvegarder / Annuler.

**Détail :**
- Créer un composant `DocViewerModal` réutilisable avec les props : `title`, `content`, `onSave?`, `onClose`
- Modes : lecture (markdown rendu) ↔ édition (textarea)
- Bouton Modifier visible uniquement si `onSave` est fourni
- Remplacer l'implémentation inline existante dans `App.tsx` par ce composant
- Brancher le composant sur le double-clic dans la liste KDocs de `KDocsModal`

**Critères d'acceptance :**
- [x] `DocViewerModal` est utilisé pour les fiches corpus racine (comportement inchangé)
- [x] Double-clic sur un KDoc dans `KDocsModal` ouvre `DocViewerModal` avec le contenu du fichier
- [x] La sauvegarde d'un KDoc écrit bien dans `corpus/KDocs/` et déclenche un message de confirmation
- [x] L'affichage et l'édition fonctionnent de façon identique dans les deux contextes

**Livré le :** 08/06/2026 — branche `feature/KDocs`

---

---

## ÉPIQUE — Pipeline KB → KDoc : traitement des bases de connaissance officielles

**Objectif :** Permettre à l'administrateur de recenser les KB officielles (format brut, souvent incorrect), de générer automatiquement des fiches `.md` propres via le LLM, de les corriger si besoin, et de les intégrer au corpus RAG.

**Workflow cible :**
```
KBOffs/  →  références.json  →  génération LLM  →  KDocs/  →  corpus RAG
(KB brute)   (sélection/statut)   (fiche .md propre)   (KDoc éditable)
```

Stories enfants : US-036, US-037, US-038, US-039.

---

### ✅ US-036 — Infrastructure : dossiers KBOffs/KDocs et references.json

**En tant qu'** administrateur,
**Je veux** que les dossiers `KBOffs/` et `KDocs/` existent dans `corpus/` et qu'un fichier `references.json` soit disponible,
**Afin de** disposer de la structure nécessaire pour stocker les KB sources et les KDocs générés.

**Critères d'acceptance :**
- [x] `corpus/KBOffs/` créé
- [x] `corpus/KDocs/` créé
- [x] `corpus/references.json` initialisé avec `{ "kboffs": [], "kdocs": [] }`
- [x] IDs séquentiels générés automatiquement (`KB00001`, `KDOC00001`, …)
- [x] Endpoints backend : `GET/POST/DELETE /kdocs/references`, `GET /kdocs/files`

**Livré le :** 08/06/2026 — branche `feature/KDocs`

---

### ✅ US-037 — Interface de gestion des sources (liste, filtres, statuts)

**En tant qu'** administrateur,
**Je veux** une fenêtre dédiée accessible depuis la modale d'administration, qui affiche les fichiers présents dans `KBOffs/` et `KDocs/`, avec des filtres et la possibilité d'éditer leur statut dans `references.json`,
**Afin de** piloter quelles KB sont utiles et à quel stade de traitement elles se trouvent.

**Détail :**
- Accessible depuis `AdminModal` via un bouton "Sources"
- Filtre à deux niveaux :
  - **Niveau 1 — sélecteur de dossier** : `KBOffs (N)` / `KDocs (N)`
  - **Niveau 2 — chips de statut** :
    - KBOffs : Toutes / Non répertoriées / `selected` / `out` / `duplicate` / `done`
    - KDocs : Tous / `testing` / `passed` / `rejected`
- Clic simple sur un fichier → formulaire de statut (ligne surlignée)
- Champ titre optionnel + radios statut par dossier
- Possibilité de retirer un fichier de `references.json`
- `updatedAt` horodaté automatiquement à chaque enregistrement

**Critères d'acceptance :**
- [x] Les filtres dossier + statut fonctionnent et affichent les bons fichiers
- [x] Le formulaire de statut se déclenche au clic simple, ligne en surbrillance
- [x] L'enregistrement et le retrait depuis `references.json` fonctionnent
- [x] `updatedAt` est renseigné automatiquement à chaque modification

**Livré le :** 08/06/2026 — branche `feature/KDocs`

---

### US-038 — Génération d'une fiche .md depuis une KB via LLM

**En tant qu'** administrateur,
**Je veux** sélectionner une KB dans `KBOffs/` et déclencher sa conversion en fiche `.md` conforme au format du corpus,
**Afin de** produire automatiquement un KDoc exploitable par le RAG à partir d'une source de qualité variable.

**Contexte :** Les KB sources sont des fichiers markdown issus de ServiceNow — même format de fichier pour toutes les KB.

**Détail :**
- Depuis la modale Sources, un bouton "Générer un KDoc" est disponible sur les KB avec statut `selected`
- Le contenu de la KB est envoyé au LLM avec un prompt de transformation
- Le LLM produit une fiche `.md` avec frontmatter complet (title, catégorie, service, équipes, etc.) conforme aux fiches existantes
- La fiche générée est enregistrée dans `KDocs/` avec un nom de fichier dérivé du titre
- Le statut de la KB dans `references.json` passe automatiquement à `passed` avec horodatage

**Critères d'acceptance :**
- [ ] La fiche générée respecte le format frontmatter des fiches corpus existantes
- [ ] Le fichier est bien créé dans `KDocs/`
- [ ] Le statut passe en `passed` avec horodatage dans `references.json`
- [ ] Un message de confirmation est affiché avec le nom du fichier créé

---

### US-039 — Édition et validation du KDoc généré

**En tant qu'** administrateur,
**Je veux** pouvoir ouvrir et éditer un KDoc depuis la modale Sources,
**Afin de** corriger les éventuelles erreurs introduites lors de la génération avant que le RAG ne l'indexe.

**Contexte :** Les KDocs restent dans `KDocs/` — ils ne sont jamais copiés à la racine de `corpus/`. Les fiches existantes (racine de `corpus/`) et les KDocs générés (`KDocs/`) coexistent en période de transition sans être mélangés. Le RAG devra indexer `KDocs/` en plus de la racine — c'est le critère d'acceptance principal de cette US.

**Détail :**
- Double-clic sur un fichier dans `KDocs/` ouvre un éditeur (textarea en markdown)
- Sauvegarder écrit le fichier dans `KDocs/`
- Le pipeline d'indexation (`runIndexing`) est mis à jour pour couvrir aussi `KDocs/`

**Critères d'acceptance :**
- [ ] L'éditeur affiche le contenu brut markdown du KDoc
- [ ] La sauvegarde écrit bien dans `KDocs/`
- [ ] Le RAG indexe les fichiers de `KDocs/` au même titre que ceux de la racine `corpus/`
- [ ] Aucun fichier de `corpus/` (racine) n'est modifié ou déplacé
- [ ] Une confirmation est affichée après sauvegarde

---

### 🔴 US-033 — Fiabilité du RAG : procédures non restituées malgré source trouvée (PRIORITAIRE)

**En tant que** technicien de support,
**Je veux** que l'assistant me fournisse la procédure complète contenue dans la source trouvée,
**Afin de** pouvoir résoudre l'incident sans escalader vers le N2.

**Problème observé :**
Le RAG identifie correctement la bonne fiche source (ex : `profil-windows-refonte.md`) mais la réponse du LLM indique que "les détails de la procédure ne sont pas disponibles". Le LLM suggère alors une escalade alors qu'une procédure complète existe.

**Cause probable :**
Le chunking par section `##` produit des chunks trop fragmentés. Le chunk récupéré contient le diagnostic (symptômes) mais pas le chunk contenant les étapes de la procédure. Le LLM ne dispose donc que d'une partie de la fiche.

**Pistes d'investigation :**
- Vérifier quels chunks sont effectivement envoyés au LLM pour une question donnée (logs)
- Envisager d'augmenter le TOP_K pour récupérer plus de chunks d'un même fichier
- Envisager un chunking différent : regrouper symptômes + première méthode dans un même chunk

**Critères d'acceptance :**
- [ ] Pour une question dont la fiche source contient une procédure, la réponse inclut les étapes
- [ ] Testé sur `profil-windows-refonte.md` (question : profil temporaire au démarrage)
- [ ] Aucune régression sur les questions du golden dataset (`EVAL.md`)

---

### US-032 - Tableau de bord (à envisager)

**En tant que** administrateur,
**Je veux** pouvoir visualiser des constantes telles que la taille des chucks ou les niveaux de similarité considérés comme suffisants ou d'autres paramètres de l'application,
**Afin de** afin d'avoir une meilleure comréhension de l'outil et, éventuellement, de pouvoir les ajuster.

**Note :** je suggère un objet JS/TS qui rassemble ces réglages.

### US-019 - Révision du UX

**En tant que** administrateur,
**Je veux** quelques aménagements dans la navigation
**Afin de** afin d'avoir un UX plus fluide.

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

## Terminé

### ✅ US-017 — Corpus supplémentaire

**En tant que** Product Owner,
**Je veux** quelques fichiers de corpus supplémentaires, des .md, portant sur OneNote,
**Afin de** afin de couvrir un domaine qui ne l'est pas.

**Livré le :** 18/05/2026 — `corpus/onenote-remplacement-poste.md`, `corpus/onenote-problemes-courants.md`

---

### ✅ US-029 - changement de nom

**En tant qu'** administrateur,
**Je veux** partout où il est fait référence à CAGPT ce soit remplacé par KABIT,
**Afin de** afin de rester cohérent.

**Livré le :** 18/05/2026 — branche `feature/renommage-kabit`

---

### ✅ US-031 - Affichage du catalogue

**En tant que** technicien,
**Je veux** que quand je clique sur une source issue du catalogue, que l'information soit affichée indentée,
**Afin de** de le pas l'avoir tout compacté et difficile à lire.

**Livré le :** 18/05/2026 — branche `feature/affichage-catalogue`

---

### ✅ US-030 - Métadonnées dans le formulaire de nouvelles fiches

**En tant qu'** administrateur,
**Je veux** que dans le formulaire de nouvelle fiches il y ait par défaut les entrées des métadonnées (title, catégorie, service, etc.)
**Afin de** qu'on n'oublie pas d'ajouter les métadonnées indispensables pour les recherches.

**Livré le :** 18/05/2026 — branche `feature/metadonnees-nouvelle-fiche`

---

### ✅ US-028 - Recherche de fiche

**En tant qu'** administrateur,
**Je veux** que dans la page admin > Fiches du corpus il y ait une recherche
**Afin de** afin de retrouver facilement une fiche en particulier.

**Livré le :** 18/05/2026 — branche `feature/recherche-fiche`

---

### ✅ US-018 - Révision du UX — couleurs

**En tant que** utilisateur de l'application,
**Je veux** quelques aménagements sur les couleurs
**Afin de** afin de mieux voir.

**Livré le :** 15/05/2026 — branche `feature/ux-couleurs`

---

### ✅ US-027 — Niveau du technicien configurable

**En tant qu'** administrateur,
**Je veux** configurer le niveau du technicien qui utilise l'assistant,
**Afin que** les conseils d'escalade soient adaptés à son niveau réel.

**Livré le :** 15/05/2026 — branche `feature/niveau-technicien`

---

### ✅ US-026 — Matrice d'escalade

**En tant que** technicien de support,
**Je veux** pouvoir consulter rapidement à qui escalader un incident que je ne sais pas résoudre,
**Afin de** ne pas perdre de temps à chercher le bon interlocuteur.

**Livré le :** 15/05/2026 — `corpus/escalade.md`

---

### ✅ US-025 — Chunking des fiches .md par section

**En tant qu'** administrateur,
**Je veux** que chaque section `##` d'une fiche `.md` soit indexée comme un chunk indépendant,
**Afin de** que le contenu des fiches longues soit entièrement accessible au RAG, et non tronqué.

**Livré le :** 15/05/2026 — branche `feature/md-chunking`

---

### ✅ US-024 - Ajout au corpus — réparation WMI

**En tant que** administrateur,
**Je veux** une fiche dédiée à la réparation du WMI
**Afin d'** avoir une fiche sur un sujet courant.

**Livré le :** 15/05/2026 — `corpus/wmi-reparation.md`

---

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
