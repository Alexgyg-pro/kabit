---
title: Teams — messages qui ne s'envoient pas ou disparaissent
catégorie: Messagerie & Collaboration
service: Tous services
équipes: Boutique IT
dernière_revision: 04/05/2026
statut: Publié
commentaire: Un message avec le symbole d'avertissement (⚠️) n'a pas été envoyé — il reste en local
---

# Teams — messages qui ne s'envoient pas ou disparaissent

## Symptômes
- Le message envoyé affiche un symbole ⚠️ ou "Échec de l'envoi"
- Le message apparaît dans la conversation côté émetteur mais pas côté destinataire
- Un message tapé disparaît sans être envoyé
- Délai anormalement long avant confirmation d'envoi

## Étape 1 — Message avec symbole ⚠️

Cliquer sur le symbole ⚠️ à côté du message > choisir **Réessayer**  
Si l'échec persiste : copier le contenu du message, le supprimer, et le renvoyer.

## Étape 2 — Vérifier la connexion réseau

Teams indique en bas de l'interface si la connexion est perdue.  
Vérifier :
- Connexion internet active (ouvrir un navigateur)
- VPN connecté si en télétravail
- Essayer `https://teams.microsoft.com` dans le navigateur

## Étape 3 — Message perdu lors d'une coupure réseau

Si Teams a perdu la connexion pendant la saisie, le message peut être perdu.  
Teams ne sauvegarde pas automatiquement les brouillons dans les conversations.  
Utiliser la touche **↑** (flèche haut) dans la zone de texte pour rappeler le dernier message saisi.

## Étape 4 — Problème d'envoi dans un canal spécifique

Si l'envoi échoue dans un canal mais fonctionne en messagerie directe :
- Vérifier les droits dans le canal (certains canaux sont en lecture seule pour les membres)
- Contacter le propriétaire de l'équipe pour vérifier les paramètres de modération

## Étape 5 — Vider le cache Teams

```
%appdata%\Microsoft\Teams\
```
Fermer Teams, vider le cache, relancer.

## Escalade N2
Si plusieurs utilisateurs ne peuvent plus envoyer de messages simultanément : incident Microsoft. Vérifier `https://status.office365.com`.
