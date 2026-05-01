---
title: Système lent — diagnostic et optimisation
catégorie: Système d'exploitation
service: Tous services
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: Un poste de moins de 3 ans qui rame systématiquement doit remonter en N2 pour analyse approfondie
---

# Système lent — diagnostic et optimisation

## Étape 1 — Identifier le goulot d'étranglement

Ouvrir le Gestionnaire des tâches (Ctrl+Shift+Échap) > onglet **Performances** :

| Ressource | Seuil d'alerte | Cause probable             |
|-----------|----------------|----------------------------|
| CPU       | > 90% continu  | Processus runaway, virus   |
| RAM       | > 90%          | Trop d'onglets/apps ouverts|
| Disque    | > 95% continu  | HDD en fin de vie, indexation |
| Réseau    | > 90%          | Synchronisation cloud      |

## Étape 2 — Processus consommateurs

Onglet **Processus** > trier par CPU ou RAM.

Processus légitimes souvent gourmands :
- `MsMpEng.exe` (Windows Defender) — analyse en cours, normal si ponctuel
- `OneDrive.exe` — synchronisation, peut être pausée temporairement
- `SearchIndexer.exe` — indexation, normal en fin de journée

Processus suspects : tout processus inconnu > 50% CPU → screenshot + escalade Sécurité IT.

## Étape 3 — Démarrage Windows lent

```
Gestionnaire des tâches > Démarrage
```
Désactiver les applications non essentielles (conserver : CrowdStrike, OneDrive, AnyConnect).

## Étape 4 — Disque presque plein

Le disque C: doit avoir au minimum 15% d'espace libre.
```
Paramètres > Système > Stockage > Nettoyer des fichiers
```
Ou via :
```cmd
cleanmgr /sageset:1
cleanmgr /sagerun:1
```

## Étape 5 — Laptop ThinkPad E16 ou ASUS lent sur batterie

Le mode performance peut être réduit en mode batterie.
Brancher le chargeur et vérifier :
```
Centre de mobilité Windows (Win+X) > Mode d'alimentation : Haute performance
```

## Étape 6 — SSD fragmenté ou dégradé

```powershell
Optimize-Volume -DriveLetter C -Verbose
```
Pour vérifier l'état du SSD :
```cmd
wmic diskdrive get status
```

## Escalade N2
Si lenteurs persistantes après ces étapes : ouvrir un ticket avec le rapport Gestionnaire des tâches (captures) et le modèle du poste. L'équipe N2 peut effectuer un diagnostic à distance via SCCM Remote Control.
