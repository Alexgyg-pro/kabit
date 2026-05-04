---
title: Outlook — recherche d'emails ne trouve rien ou résultats incomplets
catégorie: Messagerie & Collaboration
service: Tous services
équipes: Boutique IT
dernière_revision: 04/05/2026
statut: Publié
commentaire: La reconstruction de l'index Windows Search résout 90 % des cas
---

# Outlook — recherche d'emails ne trouve rien ou résultats incomplets

## Symptômes
- La barre de recherche Outlook ne retourne aucun résultat pour des emails connus
- Les résultats sont partiels ou très anciens
- Message "Outlook recherche encore vos résultats" qui tourne indéfiniment
- La recherche fonctionne sur OWA mais pas dans le client Outlook

## Étape 1 — Vérifier que la recherche porte sur le bon périmètre

Dans la barre de recherche, vérifier le menu déroulant :
- "Dossier actuel" → limité au dossier ouvert
- "Toutes les boîtes aux lettres" → recherche globale (recommandé)

## Étape 2 — Reconstruire l'index de recherche Windows

1. Panneau de configuration > Options d'indexation
2. Vérifier que "Microsoft Outlook" figure dans les emplacements indexés
3. Cliquer sur **Avancé** > **Reconstruire**  
   ⚠️ La reconstruction peut prendre 1 à 4 heures selon la taille de la boîte — à lancer en fin de journée.

## Étape 3 — Réparer l'index depuis Outlook

Fichier > Options > Recherche > **Options d'indexation** > Avancé > Reconstruire

## Étape 4 — Vérifier le service Windows Search

```
services.msc
```
Rechercher "Windows Search" — le service doit être en état "En cours d'exécution" et démarrage "Automatique".  
S'il est arrêté : clic droit > **Démarrer**.

## Étape 5 — Utiliser OWA en attendant

Pendant la reconstruction de l'index : `https://mail.fincorp.com`  
La recherche OWA utilise l'index Exchange côté serveur — toujours à jour.

## Escalade N2
Si le service Windows Search ne peut pas démarrer : probable corruption de la base d'index. Supprimer `%ProgramData%\Microsoft\Search\Data\Applications\Windows\` et redémarrer le service.
