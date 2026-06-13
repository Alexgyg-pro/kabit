---
title: Outlook/Teams — indicateur de présence Teams absent dans Outlook
catégorie: Messagerie & Collaboration
service: Tous services
équipes: Boutique IT
dernière_revision: 04/05/2026
statut: Publié
commentaire: La présence Teams dans Outlook nécessite que Teams soit démarré et connecté
---

# Outlook/Teams — indicateur de présence Teams absent dans Outlook

## Symptômes
- La pastille de présence verte/rouge/jaune n'apparaît plus sur les photos de profil dans Outlook
- Survol d'un contact dans Outlook ne montre pas le statut Teams
- La carte de contact ne propose plus les boutons "Chat Teams" ou "Appel Teams"
- Le statut affiché est toujours "Inconnu" ou grisé

## Fonctionnement

L'indicateur de présence dans Outlook est fourni par l'intégration **Teams ↔ Exchange**.  
Teams doit être connecté et en cours d'exécution pour alimenter ces informations.

## Étape 1 — Vérifier que Teams est démarré et connecté

La présence dans Outlook nécessite que Teams soit :
- Ouvert (même en arrière-plan dans la barre des tâches)
- Connecté avec le même compte que celui d'Outlook

Si Teams est fermé : les indicateurs de présence dans Outlook seront grisés ou absents.

## Étape 2 — Vérifier l'option dans Outlook

Fichier > Options > Contacts  
Vérifier que **"Afficher les présences en ligne à côté des noms"** est coché.

## Étape 3 — Vérifier que Skype Entreprise n'est pas installé

Si Skype Entreprise (ancienne version) est installé en parallèle de Teams, il peut prendre le contrôle de la présence et masquer celle de Teams.  
Panneau de configuration > vérifier si "Skype for Business" est installé > si oui, désinstaller.

## Étape 4 — Vider le cache Teams et redémarrer

```
%appdata%\Microsoft\Teams\
```
Fermer Teams et Outlook, vider le cache, relancer Teams en premier, puis Outlook.

## Étape 5 — Délai de propagation

Après connexion de Teams, l'indicateur de présence peut mettre **2 à 5 minutes** à apparaître dans Outlook. Patienter avant de poursuivre le diagnostic.

## Escalade N2
Si la présence fonctionne pour certains contacts mais pas d'autres : probable problème de licence ou de configuration côté Exchange. Vérifier les licences Microsoft 365 des utilisateurs concernés.
