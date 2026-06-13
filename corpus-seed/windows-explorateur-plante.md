---
title: L'Explorateur Windows plante ou se ferme tout seul
catégorie: Système d'exploitation
service: Tous services
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: Ne pas confondre avec un plantage du bureau complet — voir fiche Écran noir si le bureau disparaît entièrement
---

# L'Explorateur Windows plante ou se ferme tout seul

## Symptômes
- Les fenêtres de l'Explorateur se ferment soudainement
- Le bureau (icônes + barre des tâches) disparaît puis réapparaît
- Impossible d'ouvrir certains dossiers sans plantage

## Étape 1 — Redémarrer l'Explorateur manuellement
```
Ctrl + Shift + Échap > Gestionnaire des tâches > Processus
Clic droit sur "Explorateur Windows" > Redémarrer
```
Résout les plantages ponctuels (état corrompu en mémoire).

## Étape 2 — Désactiver la prévisualisation des fichiers
Certains fichiers (PDF corrompus, images RAW) font planter l'Explorateur lors de la prévisualisation.
```
Explorateur > Affichage > Volet de visualisation > Désactiver
```

## Étape 3 — Vider l'historique de l'Explorateur
```
Panneau de configuration > Options des dossiers > Général
Cliquer "Effacer" dans la section Historique
```

## Étape 4 — Rechercher les fichiers système corrompus
```cmd
sfc /scannow
```
Lancer en invite de commandes **administrateur**. Durée : 5-10 minutes.

## Étape 5 — Identifier le dossier ou fichier responsable
Si le plantage arrive toujours dans le même dossier :
1. Ouvrir le dossier en désactivant la prévisualisation
2. Identifier les fichiers récents (triés par date de modification)
3. Déplacer ou supprimer le fichier suspect pour confirmer

## Étape 6 — Extensions Shell corrompues (cause fréquente)
Des logiciels tiers installent des extensions Shell qui peuvent déstabiliser l'Explorateur.
Utiliser **ShellExView** (Sysinternals / NirSoft) pour identifier et désactiver les extensions tierces.
Disponible dans `\\fincorp-deploy\outils\shellexview\`

## Escalade N2
Si le plantage est permanent et empêche tout travail → réinstallation du profil utilisateur (voir fiche Profil corrompu).
