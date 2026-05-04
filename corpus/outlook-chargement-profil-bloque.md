---
title: Outlook — bloqué sur "Chargement du profil" au démarrage
catégorie: Messagerie & Collaboration
service: Tous services
équipes: Boutique IT
dernière_revision: 04/05/2026
statut: Publié
commentaire: Souvent causé par un complément COM défaillant ou un processus Outlook zombie
---

# Outlook — bloqué sur "Chargement du profil" au démarrage

## Symptômes
- L'écran de démarrage Outlook reste indéfiniment sur "Chargement du profil..."
- La progression ne dépasse pas ce stade
- Fermer et relancer n'aide pas
- Le problème survient après une mise à jour Office ou Windows

## Étape 1 — Tuer les processus Outlook en arrière-plan

1. Gestionnaire des tâches (Ctrl+Shift+Échap)
2. Chercher tous les processus "OUTLOOK.EXE"
3. Terminer chacun d'eux
4. Relancer Outlook normalement

## Étape 2 — Lancer en mode sans échec

```
outlook.exe /safe
```
Si Outlook démarre : un complément est responsable. Désactiver tous les compléments COM puis les réactiver un par un.  
Fichier > Options > Compléments > Gérer : Compléments COM

## Étape 3 — Réinitialiser les paramètres de navigation

```
outlook.exe /resetnavpane
```
Réinitialise le volet de navigation sans toucher aux emails ni au profil.

## Étape 4 — Supprimer les fichiers temporaires Outlook

```
%localappdata%\Microsoft\Outlook\RoamCache\
```
Fermer Outlook, supprimer le contenu de ce dossier, relancer.

## Étape 5 — Vérifier les mises à jour Office en attente

Si le blocage survient juste après une mise à jour :  
Fichier > Compte Office > Options de mise à jour > **Mettre à jour maintenant**  
Certaines mises à jour partielles peuvent laisser Office dans un état instable.

## Escalade N2
Si aucune des étapes ne fonctionne : désinstaller et réinstaller Microsoft 365 via le portail `https://portal.office.com` > Mon compte > Applications Office.
