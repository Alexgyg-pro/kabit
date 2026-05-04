---
title: Outlook — lent, figé ou qui ne répond plus
catégorie: Messagerie & Collaboration
service: Tous services
équipes: Boutique IT
dernière_revision: 04/05/2026
statut: Publié
commentaire: Les grands fichiers OST (> 20 Go) sont la cause principale de lenteur
---

# Outlook — lent, figé ou qui ne répond plus

## Symptômes
- Outlook met plusieurs secondes à passer d'un email à l'autre
- Message "Outlook ne répond pas" dans la barre de titre
- Lenteur au démarrage (> 2 minutes)
- Interface gelée pendant la recherche ou l'envoi

## Étape 1 — Vérifier la taille du fichier OST

```
%localappdata%\Microsoft\Outlook\
```
Un fichier `.ost` supérieur à 20 Go dégrade significativement les performances.  
Solution : archiver les anciens emails vers l'archive en ligne (voir fiche *outlook-quota-boite-saturee*).

## Étape 2 — Désactiver les compléments inutiles

Fichier > Options > Compléments > Compléments COM  
Désactiver les compléments tiers non essentiels (antivirus Outlook, outils de signature, etc.)  
Conserver : complément Teams, complément Calendrier Exchange.

## Étape 3 — Vider le cache Outlook

Fichier > Options > Avancé > Fichiers de données Outlook > Paramètres  
Réduire la période de synchronisation du cache à **3 mois** (au lieu de "Tout").

## Étape 4 — Désactiver l'aperçu des pièces jointes

Affichage > Volet de lecture > Désactivé  
Réduire considérablement la charge si la boîte contient de nombreuses PJ.

## Étape 5 — Compacter le fichier OST

Fichier > Paramètres du compte > Fichiers de données > sélectionner le fichier > Paramètres > Compacter maintenant

## Escalade N2
Si les lenteurs persistent sur un poste récent (< 3 ans) : diagnostic mémoire et disque à effectuer (RAM < 8 Go ou disque HDD à remplacer par SSD).
