---
title: Teams — ne démarre pas ou se ferme immédiatement
catégorie: Messagerie & Collaboration
service: Tous services
équipes: Boutique IT
dernière_revision: 04/05/2026
statut: Publié
commentaire: Distinguer Teams classique (MSI) et Teams 2.0 (MSIX) — les chemins de cache diffèrent
---

# Teams — ne démarre pas ou se ferme immédiatement

## Symptômes
- L'icône Teams apparaît dans la barre des tâches puis disparaît
- Teams se lance mais la fenêtre ne s'ouvre jamais
- Message d'erreur Windows "Microsoft Teams a cessé de fonctionner"
- Teams tourne en arrière-plan (gestionnaire des tâches) mais sans interface

## Étape 1 — Forcer la fermeture et relancer

1. Gestionnaire des tâches > chercher tous les processus "Teams.exe" ou "ms-teams.exe"
2. Terminer tous les processus
3. Relancer Teams depuis le menu Démarrer

## Étape 2 — Vider le cache Teams

**Teams classique :**
```
%appdata%\Microsoft\Teams\
```
Supprimer le contenu (pas le dossier) et relancer.

**Teams 2.0 :**
```
%localappdata%\Packages\MSTeams_8wekyb3d8bbwe\LocalCache\Microsoft\MSTeams\
```

## Étape 3 — Réinstaller Teams

**Teams classique :**  
Panneau de configuration > Désinstaller > Microsoft Teams  
Puis réinstaller depuis : `https://teams.microsoft.com/downloads`

**Teams 2.0 :**  
Teams 2.0 est géré par Windows Update / Microsoft Store. Rechercher "Microsoft Teams" dans le Store et mettre à jour.

## Étape 4 — Vérifier les prérequis système

Teams nécessite :
- Windows 10 version 1903 minimum (Teams 2.0 : Windows 10 22H2)
- .NET Framework 4.5 ou supérieur
- Au moins 4 Go de RAM

## Étape 5 — Vérifier les journaux Teams

```
%appdata%\Microsoft\Teams\logs.txt
```
Ouvrir avec Bloc-notes, rechercher "ERROR" pour identifier la cause.

## Escalade N2
Joindre le fichier `logs.txt` au ticket d'escalade. Pour les postes gérés par Intune, vérifier si une stratégie bloque l'application.
