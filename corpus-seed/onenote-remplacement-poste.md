---
title: OneNote — Récupération des carnets lors d'un remplacement de poste
catégorie: Microsoft 365
service: Tous services
équipes: Boutique IT
dernière_revision: 18/05/2026
statut: Publié
commentaire: Premier réflexe — demander où étaient stockés les carnets avant de toucher quoi que ce soit
---

# OneNote — Récupération des carnets lors d'un remplacement de poste

## Diagnostic préalable — localiser les carnets

Avant toute action, identifier où étaient stockés les carnets sur l'ancien poste.

**Questions à poser à l'utilisateur :**
- Utilisait-il l'application **OneNote** (incluse dans Windows 10/11) ou **OneNote 2016** ?
- Voyait-il ses carnets dans son OneDrive ?
- Avait-il des carnets "locaux" (non synchronisés, jamais apparus dans OneDrive) ?

**Les emplacements possibles :**

| Type | Emplacement | Récupération |
|------|-------------|--------------|
| OneDrive Personnel | Cloud | Automatique après connexion M365 |
| OneDrive Entreprise | Cloud (SharePoint) | Automatique après connexion M365 |
| Local (ancien poste) | `Documents\OneNote Notebooks\` | Manuelle — copie depuis sauvegarde |
| SharePoint (carnet d'équipe) | URL SharePoint | Manuelle — rouvrir depuis le lien |

## Carnets OneDrive — récupération automatique

Si les carnets étaient stockés dans OneDrive (cas le plus fréquent chez FinCorp) :

1. Connecter le compte Microsoft 365 de l'utilisateur sur le nouveau poste
2. Attendre que OneDrive finisse de synchroniser (icône barre des tâches — sans croix rouge)
3. Ouvrir OneNote → **Fichier > Ouvrir** : les carnets apparaissent automatiquement
4. Si un carnet manque : **Fichier > Ouvrir > OneDrive** → le sélectionner manuellement

**Si rien n'apparaît malgré une sync OneDrive correcte** : aller sur `portal.office.com > OneDrive` depuis le navigateur et vérifier que les carnets (dossiers `.one`) sont bien présents dans le cloud.

## Carnets locaux — migration depuis l'ancien poste

Les carnets locaux ne sont **pas dans le cloud** — ils doivent être copiés physiquement depuis l'ancien poste ou depuis la sauvegarde.

**Emplacement par défaut :**
```
%USERPROFILE%\Documents\OneNote Notebooks\
```

**Procédure :**
1. Récupérer le dossier `OneNote Notebooks` depuis la sauvegarde du profil ou le disque de l'ancien poste
2. Copier le dossier dans `Documents` du nouveau poste
3. Dans OneNote : **Fichier > Ouvrir > Ordinateur > Parcourir** → sélectionner le fichier `.onetoc2` (index du carnet)
4. Le carnet s'ouvre — **proposer à l'utilisateur de le synchroniser vers OneDrive** pour éviter que le problème se reproduise lors du prochain remplacement

**Si aucune sauvegarde disponible :** vérifier si la redirection de dossiers (GPO) était active sur l'ancien poste — les `Documents` peuvent être sur un partage réseau. Contacter le N2 Poste de Travail si une restauration de profil est nécessaire.

## Carnets SharePoint — reconnexion

Les carnets partagés (carnets d'équipe, cahiers de réunion) sont hébergés sur SharePoint :

1. Retrouver le **lien SharePoint** du carnet — auprès du collègue qui l'a partagé, ou dans l'e-mail d'invitation initial
2. Ouvrir le lien dans le navigateur → bouton **Modifier dans l'application**
3. OneNote s'ouvre et ajoute le carnet à la liste locale

Si le lien est introuvable : chercher le carnet dans **Teams > onglet Notes** de l'équipe concernée (Teams embarque OneNote par canal).

## Carnet rapide (Quick Notes) manquant

Le Carnet rapide contient les notes prises "hors contexte" (raccourci Windows + N). Il est souvent oublié lors d'un remplacement.

- **Nouvelle application OneNote** : synchronisé sur OneDrive → dossier `Carnets` > carnet `Notes rapides` — récupéré automatiquement
- **OneNote 2016** : peut être stocké localement dans `%APPDATA%\Microsoft\OneNote\16.0\` si OneDrive n'était pas configuré

Pour ouvrir le Carnet rapide manuellement : **Fichier > Ouvrir > Notes rapides**.

## Escalade

Escalader au **N2 Poste de Travail** si :
- Les carnets locaux sont introuvables et aucune sauvegarde n'est disponible (restauration de profil)
- Une GPO de redirection de dossiers était active et le partage réseau est inaccessible

Escalader au **N2 M365** si :
- Le compte M365 ne se connecte pas à OneDrive malgré une configuration correcte
- Un carnet SharePoint est inaccessible alors que l'utilisateur a les droits
