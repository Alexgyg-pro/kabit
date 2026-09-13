---
title: Disque C: presque plein — nettoyage et libération d'espace
catégorie: Système d'exploitation
service: Tous services
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: Le disque doit toujours avoir au moins 15% d'espace libre — en dessous, Windows se dégrade
---

# Disque C: presque plein — nettoyage et libération d'espace

## Vérifier l'espace disponible
```
Explorateur Windows > Ce PC
```
La barre rouge sous le lecteur C: indique un espace critique (< 10%).

## Étape 1 — Nettoyage de disque Windows
```
Win + R > cleanmgr
```
Cocher :
- Fichiers Internet temporaires ✓
- Fichiers programmes téléchargés ✓
- Corbeille ✓
- Fichiers temporaires ✓
- Miniatures ✓

Cliquer **Nettoyer les fichiers système** pour accéder aux options avancées :
- Anciennes installations Windows (peut libérer 5-20 Go après une mise à jour majeure)
- Fichiers de vidage de la mémoire système

## Étape 2 — Analyser ce qui prend de la place
```
Win + R > cleanmgr /sageset:1
```
Ou utiliser **WinDirStat** (disponible dans `\\fincorp-deploy\outils\windirstat\`) pour visualiser les gros dossiers.

Emplacements à vérifier en priorité :
- `C:\Users\[login]\Downloads` — souvent des fichiers oubliés
- `C:\Users\[login]\AppData\Local\Temp` → supprimer le contenu (pas le dossier)
- `C:\Windows\Temp` → supprimer le contenu

## Étape 3 — Déplacer les données vers OneDrive ou le lecteur réseau

Les données de travail ne doivent pas être stockées sur C:
- Déplacer vers `H:` (lecteur personnel réseau) ou OneDrive
- Configurer OneDrive en **Fichiers à la demande** pour libérer l'espace local :
  ```
  OneDrive > Paramètres > Synchronisation et sauvegarde > Libérer de l'espace disque
  ```

## Étape 4 — Supprimer les points de restauration anciens
```
Panneau de configuration > Système > Protection du système > Configurer
Supprimer tous les points de restauration (ne conserver que le dernier)
```

## À ne pas supprimer
- `C:\Windows\` — système (ne jamais toucher manuellement)
- `C:\Program Files\` — applications installées
- `C:\ProgramData\` — données applications (CrowdStrike, Intune, etc.)
