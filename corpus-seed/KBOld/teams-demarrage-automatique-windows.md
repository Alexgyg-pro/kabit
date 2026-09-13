---
title: Teams — gérer le démarrage automatique avec Windows
catégorie: Messagerie & Collaboration
service: Tous services
équipes: Boutique IT
dernière_revision: 04/05/2026
statut: Publié
commentaire: Teams 2.0 se gère différemment de Teams classique pour le démarrage automatique
---

# Teams — gérer le démarrage automatique avec Windows

## Symptômes
- Teams se lance automatiquement à chaque démarrage Windows (non souhaité)
- Teams ne se lance plus automatiquement (comportement souhaité perdu)
- Teams est désactivé au démarrage mais réapparaît après une mise à jour

## Désactiver le démarrage automatique

**Via Teams :**  
Teams > avatar > Paramètres > Général  
Décocher **Démarrer automatiquement Teams**

**Via le Gestionnaire des tâches :**  
Ctrl+Shift+Échap > onglet **Démarrage** > clic droit sur Teams > **Désactiver**

**Via les Paramètres Windows 11 :**  
Paramètres > Applications > **Démarrage** > désactiver Microsoft Teams

## Activer le démarrage automatique

Même chemin inverse : cocher "Démarrer automatiquement Teams" dans les paramètres Teams.

## Cas Teams 2.0 (application MSIX)

Teams 2.0 gère son démarrage différemment :
```
Paramètres Windows > Applications > Démarrage > Microsoft Teams (work or school)
```
La clé registre correspondante :
```
HKCU\Software\Microsoft\Windows\CurrentVersion\Run
```
Supprimer la valeur "com.squirrel.Teams.Teams" pour désactiver définitivement.

## Teams se réactive après les mises à jour

Comportement connu de Microsoft Teams : les mises à jour majeures réactivent parfois le démarrage automatique.  
Solution : re-désactiver manuellement après chaque mise à jour significative.

## Recommandation FinCorp

Pour les postes partagés ou les collaborateurs en présentiel avec Outlook ouvert en permanence :  
le démarrage automatique de Teams est **recommandé** pour ne pas manquer les messages entrants.
