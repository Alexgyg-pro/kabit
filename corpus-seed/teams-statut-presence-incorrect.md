---
title: Teams — statut de présence figé ou incorrect
catégorie: Messagerie & Collaboration
service: Tous services
équipes: Boutique IT
dernière_revision: 04/05/2026
statut: Publié
commentaire: Le statut se propage entre Outlook et Teams — un dysfonctionnement dans l'un affecte l'autre
---

# Teams — statut de présence figé ou incorrect

## Symptômes
- Teams affiche "Absent" alors que l'utilisateur est actif
- Le statut "En réunion" persiste après la fin de la réunion
- Les collègues voient une présence incorrecte
- Le statut ne change pas malgré l'activité souris/clavier

## Étape 1 — Réinitialiser le statut manuellement

Teams > cliquer sur l'avatar > sélectionner le statut > **Réinitialiser le statut**  
Ou choisir manuellement : Disponible, Occupé, Absent, etc.

## Étape 2 — Statut bloqué en "En réunion"

Après une réunion qui s'est mal terminée (coupure réseau, crash), le statut peut rester figé.
1. Quitter Teams complètement (clic droit dans la barre des tâches > Quitter)
2. Relancer Teams

## Étape 3 — Problème de synchronisation avec Outlook

Teams synchronise le statut avec le calendrier Outlook.  
Si Outlook n'est pas démarré ou est déconnecté, la détection "En réunion" peut dysfonctionner.  
Solution : s'assurer qu'Outlook est ouvert et connecté à Exchange.

## Étape 4 — Délai de propagation normal

La présence Teams met parfois **2 à 5 minutes** à se propager aux autres utilisateurs.  
C'est un comportement normal, pas un bug.

## Étape 5 — Vider le cache Teams

```
%appdata%\Microsoft\Teams\
```
Fermer Teams, vider le cache, relancer. Un cache corrompu peut bloquer la mise à jour du statut.

## Escalade N2
Si le problème touche plusieurs utilisateurs simultanément : probable incident de présence Exchange/Teams. Vérifier `https://status.office365.com` > Rechercher "Presence".
