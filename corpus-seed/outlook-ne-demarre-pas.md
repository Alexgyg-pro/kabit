---
title: Outlook — ne démarre pas ou plante au lancement
catégorie: Messagerie & Collaboration
service: Tous services
équipes: Boutique IT
dernière_revision: 04/05/2026
statut: Publié
commentaire: Commencer par le mode sans échec avant toute réinstallation
---

# Outlook — ne démarre pas ou plante au lancement

## Symptômes
- Outlook se ferme immédiatement après l'ouverture
- Barre de chargement bloquée indéfiniment
- Message d'erreur au lancement sans détail explicite
- L'icône tourne dans la barre des tâches sans que la fenêtre s'ouvre

## Étape 1 — Lancer en mode sans échec

```
outlook.exe /safe
```
Exécuter via Démarrer > Rechercher. Si Outlook s'ouvre : un complément est responsable.

**Désactiver les compléments :**  
Fichier > Options > Compléments > Gérer : Compléments COM > Décocher tous > Relancer normalement > Réactiver un par un pour isoler le fautif.

## Étape 2 — Réparer le profil Outlook

Panneau de configuration > Courrier (Microsoft Outlook) > Afficher les profils  
Sélectionner le profil > **Réparer**

Si la réparation échoue : **Supprimer** le profil et en créer un nouveau avec le même compte Exchange.

## Étape 3 — Réparer l'installation Office

Panneau de configuration > Programmes > Microsoft 365 > Modifier > **Réparation rapide**  
Si insuffisant : **Réparation en ligne** (nécessite une connexion internet, ~20 minutes).

## Étape 4 — Vérifier le fichier de données Outlook

```
%localappdata%\Microsoft\Outlook\
```
Renommer le fichier `.ost` en `.ost.old` pour forcer une re-synchronisation avec Exchange.  
Attention : la re-synchronisation peut prendre plusieurs minutes selon la taille de la boîte.

## Escalade N2
Si le problème persiste après réparation Office : ouvrir un ticket avec les journaux d'événements Windows (Observateur d'événements > Application > erreurs Microsoft Office).
