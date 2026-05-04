---
title: Outlook/Teams — réunion créée depuis Outlook sans lien Teams
catégorie: Messagerie & Collaboration
service: Tous services
équipes: Boutique IT
dernière_revision: 04/05/2026
statut: Publié
commentaire: Une réunion Outlook sans lien Teams est une réunion classique Exchange — pas une réunion Teams
---

# Outlook/Teams — réunion créée depuis Outlook sans lien Teams

## Symptômes
- L'invitation envoyée depuis Outlook ne contient pas le lien "Rejoindre la réunion Microsoft Teams"
- Les participants reçoivent une invitation calendrier sans bouton Teams
- La réunion est visible dans Teams mais sans espace de chat associé
- Le bouton "Rejoindre" n'apparaît pas dans le calendrier Teams des participants

## Cause principale

Ce problème survient quand la réunion est créée via **Nouvelle réunion** (bouton standard) plutôt que **Nouvelle réunion Teams**.  
Le complément Teams n'a pas été utilisé — l'invitation est une réunion Exchange classique, pas Teams.

## Solution 1 — Recréer la réunion correctement

1. Supprimer l'invitation existante (annuler et informer les participants)
2. Dans le calendrier Outlook : utiliser le bouton **Nouvelle réunion Teams** (ruban, onglet Accueil ou Réunion)
3. Renseigner les participants, titre, date et heure
4. Envoyer — l'invitation contiendra automatiquement le lien Teams

## Solution 2 — Ajouter Teams à une invitation existante (si modifiable)

Ouvrir l'invitation depuis le calendrier Outlook (en mode édition, pas aperçu)  
Si le bouton "Réunion Teams" apparaît dans le ruban : cliquer dessus pour convertir  
⚠️ Cette option n'est pas toujours disponible si l'invitation a déjà été envoyée.

## Solution 3 — Créer la réunion directement depuis Teams

Teams > Calendrier > **Nouvelle réunion** > renseigner les champs > Enregistrer  
L'invitation est envoyée automatiquement aux participants et apparaît dans leurs calendriers Outlook.

## Prévention

Vérifier que le bouton "Nouvelle réunion Teams" est visible dans Outlook avant de planifier.  
S'il est absent : voir fiche *outlook-teams-complement-bouton-manquant*.
