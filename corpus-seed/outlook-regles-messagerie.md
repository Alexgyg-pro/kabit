---
title: Outlook — règles de messagerie qui ne fonctionnent pas
catégorie: Messagerie & Collaboration
service: Tous services
équipes: Boutique IT
dernière_revision: 04/05/2026
statut: Publié
commentaire: Les règles côté serveur (OWA) s'appliquent même quand Outlook est fermé
---

# Outlook — règles de messagerie qui ne fonctionnent pas

## Symptômes
- Les emails ne sont pas déplacés automatiquement dans les dossiers attendus
- Une règle s'applique aléatoirement
- Conflit entre plusieurs règles
- Les règles fonctionnent dans OWA mais pas dans le client Outlook (ou inversement)

## Comprendre les deux types de règles

| Type | Où s'exécute | Fonctionne Outlook fermé |
|------|-------------|--------------------------|
| **Règle côté serveur** | Exchange Online | ✅ Oui |
| **Règle côté client** | Outlook local | ❌ Non |

Les règles créées dans OWA sont toujours côté serveur. Dans Outlook, cela dépend des conditions utilisées.

## Étape 1 — Vérifier l'ordre des règles

Les règles s'appliquent **dans l'ordre de la liste**. La première règle qui correspond est appliquée, les suivantes sont ignorées (sauf si "Continuer avec les règles suivantes" est coché).

Fichier > Gérer les règles et alertes > réorganiser avec les flèches haut/bas.

## Étape 2 — Vérifier si une règle est désactivée

Dans le gestionnaire de règles : la case à cocher à gauche doit être cochée pour que la règle soit active.

## Étape 3 — Corriger les règles en conflit

Si deux règles se contredisent :
1. Identifier les règles qui portent sur les mêmes emails
2. Fusionner en une seule règle avec des conditions multiples
3. Ou utiliser "Arrêter le traitement des règles suivantes" sur la règle prioritaire

## Étape 4 — Quota de règles atteint

Exchange Online limite la taille totale des règles à **256 Ko**. Si ce quota est atteint, les nouvelles règles ne peuvent pas être sauvegardées.  
Solution : supprimer ou simplifier les règles existantes.

## Étape 5 — Recréer la règle dans OWA

Si la règle fonctionne dans OWA mais pas dans Outlook : la recréer directement dans OWA pour la forcer côté serveur.  
`https://mail.fincorp.com` > Paramètres (engrenage) > Afficher tous les paramètres > Messagerie > Règles
