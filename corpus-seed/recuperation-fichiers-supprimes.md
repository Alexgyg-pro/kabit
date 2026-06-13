---
title: Récupération de fichiers supprimés ou perdus
catégorie: Stockage & Sauvegarde
service: Tous services
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: Plus la tentative de récupération est rapide, plus les chances de succès sont élevées — ne rien écrire sur le disque en attendant
---

# Récupération de fichiers supprimés ou perdus

## Étape 1 — Vérifier la corbeille
Toujours commencer par là.
```
Bureau > Corbeille > Rechercher le fichier > Clic droit > Restaurer
```
Si la corbeille a été vidée ou si le fichier a été supprimé avec Shift+Suppr → passer à l'étape suivante.

## Étape 2 — Versions précédentes Windows (Historique des fichiers)

Clic droit sur le dossier parent > **Restaurer les versions précédentes**
Si des versions apparaissent : sélectionner la date souhaitée > Restaurer.

**Prérequis** : L'historique des fichiers doit être activé (configuré via Intune sur les postes FinCorp sur le lecteur H:).

## Étape 3 — OneDrive — corbeille en ligne

Si le fichier était synchronisé avec OneDrive :
1. `https://fincorp-my.sharepoint.com` > Corbeille (barre latérale gauche)
2. Période de rétention : **93 jours** après suppression
3. Clic droit > Restaurer

Versions antérieures d'un fichier OneDrive :
Clic droit sur le fichier > **Historique des versions** > Restaurer la version souhaitée.

## Étape 4 — SharePoint — corbeille du site

Si le fichier était dans un espace SharePoint d'équipe :
1. Aller sur le site SharePoint > Corbeille
2. Les éléments supprimés sont conservés **93 jours**
3. Si absent de la corbeille de premier niveau : vérifier la **corbeille de second niveau** (administrateur du site)

## Étape 5 — Récupération depuis le serveur de fichiers

Les lecteurs réseau (H:, S:) sont sauvegardés quotidiennement.
Pour demander une restauration :
1. Identifier le fichier, son emplacement et la date de la dernière version valide
2. Ouvrir un ticket Boutique IT avec ces informations
3. Délai de restauration : 4h ouvrées
4. Rétention des sauvegardes : 30 jours (quotidien) + 1 an (mensuel)

## Cas désespéré — Fichier local non sauvegardé

Si le fichier était uniquement sur C: sans sauvegarde OneDrive/réseau :
- Arrêter immédiatement d'utiliser le PC (chaque écriture réduit les chances de récupération)
- Contacter la Boutique IT — l'équipe N2 peut tenter une récupération avec un outil spécialisé
- **Aucune garantie de résultat** — les SSD rendent la récupération plus difficile que les HDD

## Prévention
Rappeler aux utilisateurs : **ne jamais travailler directement sur C:**
Tous les fichiers de travail → OneDrive ou lecteur H:
