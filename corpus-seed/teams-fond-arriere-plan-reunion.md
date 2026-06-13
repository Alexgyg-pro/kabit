---
title: Teams — fond d'écran flou ou arrière-plan personnalisé ne fonctionne pas
catégorie: Messagerie & Collaboration
service: Tous services
équipes: Boutique IT
dernière_revision: 04/05/2026
statut: Publié
commentaire: Le floutage nécessite une carte graphique compatible — vérifier les prérequis avant diagnostic
---

# Teams — fond d'écran flou ou arrière-plan personnalisé ne fonctionne pas

## Symptômes
- L'option "Flou d'arrière-plan" n'apparaît pas dans les effets vidéo
- Le fond personnalisé ne s'applique pas
- L'arrière-plan clignote ou s'applique mal
- Le menu "Effets et avatars" est grisé

## Prérequis matériels

Le floutage et les fonds virtuels nécessitent :
- **Processeur** : Intel Core i5 / AMD Ryzen 5 ou supérieur (8e génération minimum pour Intel)
- **RAM** : 4 Go minimum, 8 Go recommandé
- **Pilote graphique** : à jour

Sur les postes ne répondant pas aux prérequis : l'option est définitivement grisée — aucun paramètre ne peut forcer son activation.

## Étape 1 — Activer l'option pendant une réunion

Dans la réunion > **Plus** (…) > **Effets et avatars vidéo** > sélectionner Flou ou un fond  
Ou avant de rejoindre : dans l'écran de prévisualisation > **Effets d'arrière-plan**

## Étape 2 — Pilote graphique obsolète

Gestionnaire de périphériques > Cartes graphiques > clic droit > **Mettre à jour le pilote**  
Redémarrer et retester.

## Étape 3 — Ajouter un fond personnalisé FinCorp

Les fonds officiels FinCorp sont disponibles sur :  
`SharePoint > Communication > Assets > Fonds Teams`

Pour ajouter : Effets d'arrière-plan > **Ajouter nouveau** > sélectionner l'image téléchargée.  
Les fonds personnalisés sont stockés dans :
```
%appdata%\Microsoft\Teams\Backgrounds\Uploads\
```

## Étape 4 — Floutage qui clignote

Causé par une incompatibilité pilote GPU. Désactiver l'accélération matérielle dans Teams :  
Teams > Paramètres > Général > **Désactiver l'accélération matérielle GPU** > redémarrer Teams.

## Escalade N2
Si le poste répond aux prérequis mais que l'option reste grisée après mise à jour des pilotes : vérifier les stratégies de groupe Teams (certaines organisations désactivent les fonds virtuels via GPO).
