---
title: Outlook/Teams — calendrier Teams désynchronisé avec Outlook
catégorie: Messagerie & Collaboration
service: Tous services
équipes: Boutique IT
dernière_revision: 04/05/2026
statut: Publié
commentaire: Teams et Outlook partagent le même calendrier Exchange — la désynchronisation est toujours temporaire
---

# Outlook/Teams — calendrier Teams désynchronisé avec Outlook

## Symptômes
- Une réunion créée dans Teams n'apparaît pas dans Outlook (ou inversement)
- Le calendrier Teams affiche des réunions annulées ou modifiées avec l'ancienne version
- Les réunions Teams n'affichent pas le lien de réunion dans Outlook
- L'heure d'une réunion est différente entre Outlook et Teams

## Comprendre la synchronisation

Teams et Outlook utilisent **le même calendrier Exchange**. Il n'y a pas deux calendriers distincts — c'est la même source de données. Les désynchronisations sont des délais d'affichage, pas des pertes de données.

## Étape 1 — Forcer la synchronisation dans Outlook

Outlook : **F9** (Envoyer/Recevoir tout)  
Ou : onglet Envoi/Réception > Envoyer/Recevoir tous les dossiers

## Étape 2 — Actualiser le calendrier Teams

Teams : dans le calendrier, cliquer sur le bouton **Actualiser** (icône circulaire en haut à droite)  
Ou : Ctrl+R pour actualiser l'affichage.

## Étape 3 — Problème de fuseau horaire

Si les réunions s'affichent à une heure différente :  
- **Outlook** : Fichier > Options > Calendrier > Fuseau horaire  
- **Teams** : avatar > Paramètres > Général > Langue et heure  
Les deux doivent être configurés sur le même fuseau (ex. : Europe/Paris, UTC+1/UTC+2).

## Étape 4 — Réunion présente dans Exchange mais absente dans Teams

Si une réunion est visible dans OWA et Outlook mais pas dans Teams :
1. Vider le cache Teams
2. Déconnecter et reconnecter Teams
3. Attendre 10 minutes — délai de propagation Exchange vers Teams

## Étape 5 — Réunion Teams sans lien dans Outlook

Si l'invitation reçue n'a pas de lien Teams : voir fiche *outlook-teams-reunion-sans-lien*.

## Escalade N2
Si la désynchronisation dure plus de 30 minutes et touche plusieurs utilisateurs : incident Exchange Online potentiel. Vérifier `https://status.office365.com`.
