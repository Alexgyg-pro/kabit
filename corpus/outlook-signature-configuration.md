---
title: Outlook — signature email absente, incorrecte ou perdue
catégorie: Messagerie & Collaboration
service: Tous services
équipes: Boutique IT
dernière_revision: 04/05/2026
statut: Publié
commentaire: Les signatures sont locales au poste — elles ne se synchronisent pas entre postes automatiquement
---

# Outlook — signature email absente, incorrecte ou perdue

## Symptômes
- La signature n'apparaît plus dans les nouveaux emails
- La signature est présente mais sans mise en forme (logo manquant, texte brut)
- Après changement de poste ou recréation de profil : signature disparue
- La signature s'affiche en réponse mais pas en nouveau message (ou inversement)

## Étape 1 — Vérifier la configuration des signatures

Fichier > Options > Messagerie > **Signatures**  
Vérifier que :
- Une signature est bien associée aux **Nouveaux messages**
- Une signature est bien associée aux **Réponses/Transferts** (peut être différente)

## Étape 2 — Recréer la signature depuis le modèle FinCorp

Le modèle officiel est disponible sur l'intranet :  
`SharePoint > IT > Ressources > Signature email FinCorp`

1. Copier le modèle depuis la page SharePoint
2. Dans l'éditeur de signature Outlook : coller avec **Ctrl+Shift+V** (collage avec mise en forme)
3. Remplacer les champs : Prénom NOM, Titre, Numéro de téléphone
4. Enregistrer

## Étape 3 — Problème de logo manquant

Le logo de la signature est une image intégrée. Si absent :
- Dans l'éditeur de signature : Insertion > Image > naviguer vers le logo FinCorp  
  (disponible sur SharePoint > IT > Ressources > Logos)
- Enregistrer la signature

## Étape 4 — Récupérer une signature depuis un autre poste

Les fichiers de signature sont stockés dans :
```
%appdata%\Microsoft\Signatures\
```
Copier les fichiers `.htm`, `.rtf` et `.txt` ainsi que le dossier associé vers le même chemin sur le nouveau poste.

## Escalade N2
Pour un déploiement centralisé des signatures via stratégie de groupe : demande à adresser à l'équipe infrastructure.
