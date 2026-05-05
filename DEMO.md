# Scénario de démo — CAGPT Assistant Support IT

Durée estimée : **15 minutes**

---

## Contexte à poser en introduction (2 min)

> "Chez FinCorp, les techniciens support reçoivent des tickets toute la journée. Plutôt que de chercher dans des wikis dispersés ou d'appeler un collègue, ils ont maintenant un assistant qui connaît les procédures internes ET le catalogue IT de l'entreprise. Je vais vous montrer trois situations concrètes."

**Avant de commencer :**
- Backend et frontend lancés (`npm run dev` dans `front/` et `node back/server.js`)
- Badge **"Groq prêt"** vert dans la barre de statut
- Modèle sélectionné : **Llama 3.3 70B (meilleur)**
- Rôle actif : **Technicien**

---

## Acte 1 — Le technicien répond à un incident (5 min)

**Rôle actif : Technicien**

### Situation 1 — Incident messagerie

Poser la question :

> **"Outlook ne démarre pas. Que faire ?"**

Ce que la démo montre :
- Le système cherche dans le corpus et trouve la bonne fiche en quelques secondes
- La réponse est structurée, en français, avec les étapes numérotées
- Les **sources sont affichées** sous la réponse — cliquer sur la source pour montrer la fiche originale dans la modale
- Montrer le bouton **Copier** : *"Le technicien peut coller la réponse directement dans son ticket ServiceNow"*

### Situation 2 — Question sur le matériel

Poser la question :

> **"Quelles applications sont utilisées par le service Trading ?"**

Ce que la démo montre :
- Cette fois la source est le **catalogue IT** (données structurées), pas une fiche procédurale
- La réponse liste Bloomberg, ION Fidessa, FIS Kondor+, Murex — données réelles du catalogue
- Point fort à souligner : *"Le système fait la différence entre une procédure narrative et des données structurées, et exploite les deux."*

---

## Acte 2 — L'admin enrichit le corpus (5 min)

**Basculer en rôle Admin** (bouton en haut à droite)

Ouvrir la modale admin ⚙ et montrer les trois sections :

### Section "Fiches du corpus"
- Faire défiler la liste des 80+ fiches
- Cliquer sur une fiche (ex. `outlook-ne-demarre-pas`) — elle s'ouvre directement en mode édition
- *"Un admin peut corriger ou enrichir une procédure sans toucher aux fichiers"*
- Annuler sans sauvegarder

### Section "Catalogue IT"
- Montrer le JSON dans le textarea
- *"L'admin peut mettre à jour le catalogue — un nouveau laptop, une nouvelle application — et relancer l'indexation en un clic. La validation JSON bloque toute erreur de syntaxe avant l'enregistrement."*
- Ne pas modifier en démo (risque de casser le corpus)

### Section "Pré-prompt"
- Montrer le contenu du pré-prompt actif
- *"Les instructions métier sont ici — ton de réponse, contexte entreprise, escalade N2. L'admin les ajuste sans toucher au code."*

---

## Acte 3 — Une question qui croise les deux corpus (2 min)

Fermer la modale admin. Poser la question :

> **"Un collaborateur a oublié son mot de passe et son compte est verrouillé. Comment procéder ?"**

Ce que la démo montre :
- Les sources mêlent **outils du catalogue** (ADUC, SSPR) et informations procédurales
- La réponse inclut la commande PowerShell complète
- Point fort : *"Le système sait que FinCorp a un portail SSPR — c'est dans le catalogue, pas dans une procédure générique."*

---

## À éviter pendant la démo

| Question à risque | Problème connu | Alternative |
|---|---|---|
| "Teams se lance mais la fenêtre n'apparaît jamais." | Aucune source retrouvée | Ajouter "Que faire ?" en fin de phrase |
| "OneDrive affiche une croix rouge." | Aucune source retrouvée | Ajouter "Que faire ?" en fin de phrase |
| "Un collaborateur a un écran bleu." | Aucune source retrouvée | Éviter |
| Questions de 3 mots ou moins | Risque de réponse générique | Formuler en phrase complète |

---

## Message de clôture

> "Ce que vous avez vu tourne entièrement en local et dans le navigateur — pas de données qui sortent sauf l'appel au LLM. Le corpus est 100 % maîtrisé par l'équipe. Ajouter une procédure prend 30 secondes depuis l'interface."
