---
title: Teams — lent, CPU ou RAM élevés
catégorie: Messagerie & Collaboration
service: Tous services
équipes: Boutique IT
dernière_revision: 04/05/2026
statut: Publié
commentaire: Teams 2.0 est significativement plus léger que Teams classique — migrer si possible
---

# Teams — lent, CPU ou RAM élevés

## Symptômes
- L'ordinateur ralentit dès que Teams est ouvert
- Le ventilateur tourne en permanence
- Gestionnaire des tâches : Teams consomme > 30 % CPU ou > 500 Mo de RAM au repos
- Lenteur lors du changement d'onglet ou du chargement des messages

## Étape 1 — Vérifier la version de Teams

Dans Teams : avatar > À propos > Version  
**Teams classique (< 2.x)** : plus gourmand en ressources, migrer vers Teams 2.0 recommandé.  
**Teams 2.0** : architecture Webview2 plus légère.

## Étape 2 — Désactiver l'accélération matérielle GPU

Teams > avatar > Paramètres > Général  
Décocher **Désactiver l'accélération matérielle GPU**  
⚠️ Sur certaines configurations, l'accélération GPU crée des fuites mémoire — désactiver peut paradoxalement améliorer les performances.

## Étape 3 — Vider le cache

```
%appdata%\Microsoft\Teams\
```
Fermer Teams, supprimer le contenu, relancer. Le cache peut atteindre plusieurs Go et dégrader les performances.

## Étape 4 — Réduire les notifications et aperçus

Teams > Paramètres > Notifications  
Réduire les notifications actives (désactiver les aperçus de message dans les canaux peu utilisés).

## Étape 5 — Limiter Teams au démarrage

Si Teams n'est pas nécessaire en permanence :  
Teams > Paramètres > Général > décocher **Démarrer automatiquement Teams**  
Ou : Gestionnaire des tâches > Démarrage > désactiver Teams.

## Escalade N2
Sur les postes < 8 Go RAM : Teams + Outlook + navigateur peuvent saturer la mémoire. Envisager une extension RAM (ticket matériel).
