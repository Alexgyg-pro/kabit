---
title: Copier-coller ne fonctionne plus
catégorie: Système d'exploitation
service: Tous services
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: Problème fréquent après de longues sessions — redémarrer l'Explorateur suffit dans 80% des cas
---

# Copier-coller ne fonctionne plus

## Étape 1 — Redémarrer l'Explorateur Windows (solution rapide)
```
Ctrl + Shift + Échap > Gestionnaire des tâches
Clic droit sur "Explorateur Windows" > Redémarrer
```
Résout le problème dans la grande majorité des cas.

## Étape 2 — Vider le presse-papiers
```cmd
cmd /c "echo off | clip"
```
Ou via le raccourci **Win + V** > cliquer "Effacer tout" (si l'historique du presse-papiers est activé).

## Étape 3 — Vérifier le service rdpclip (si connexion Bureau à distance)
Le copier-coller entre une session RDP et le poste local dépend du service `rdpclip.exe`.
```
Gestionnaire des tâches > Détails > rdpclip.exe
Clic droit > Fin de tâche
```
Puis relancer depuis Exécuter (Win+R) : `rdpclip`

## Étape 4 — Activer l'historique du presse-papiers
Si l'utilisateur veut accéder à ses anciens éléments copiés :
```
Paramètres > Système > Presse-papiers > Historique du Presse-papiers : Activer
```
Raccourci : **Win + V** pour afficher l'historique.

## Étape 5 — Conflits logiciels
Certains gestionnaires de presse-papiers ou logiciels de traduction interceptent le presse-papiers.
Vérifier les applications en cours d'exécution (Gestionnaire des tâches) et en fermer une par une pour identifier le coupable.

## Cas particulier — Copier-coller bloqué dans une application spécifique
Certaines applications web (notamment les portails bancaires et RH) bloquent le collage dans les champs de mot de passe.
Solution de contournement : utiliser un gestionnaire de mots de passe (Bitwarden) qui remplit automatiquement les champs.
