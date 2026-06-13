---
title: Teams — partage d'écran qui ne fonctionne pas
catégorie: Messagerie & Collaboration
service: Tous services
équipes: Boutique IT
dernière_revision: 04/05/2026
statut: Publié
commentaire: Windows 11 exige une permission explicite pour le partage d'écran dans Teams
---

# Teams — partage d'écran qui ne fonctionne pas

## Symptômes
- Le bouton de partage d'écran est grisé dans la réunion
- L'écran partagé apparaît noir pour les autres participants
- Seule une partie de l'écran est partagée
- Le contenu protégé (DRM) ne peut pas être partagé

## Étape 1 — Vérifier les permissions Windows

**Windows 11 :**  
Paramètres > Confidentialité et sécurité > **Capture d'écran et applications** > autoriser Teams

**Windows 10 :**  
Paramètres > Confidentialité > Capture d'écran > activer pour Teams

## Étape 2 — Problème d'écran noir lors du partage

Causes fréquentes :
- Pilote graphique obsolète
- Contenu protégé DRM (Netflix, vidéos chiffrées) — ne peut pas être partagé
- Ecran externe via DisplayLink — mettre à jour le pilote DisplayLink

**Solution pilote graphique :**  
Gestionnaire de périphériques > Cartes graphiques > clic droit > Mettre à jour le pilote

## Étape 3 — Partager une fenêtre spécifique plutôt que l'écran entier

Dans le menu de partage Teams : choisir une **Fenêtre** plutôt que l'**Écran entier**  
Contourne les restrictions DRM et améliore les performances.

## Étape 4 — Résolution et performances

Si le partage est saccadé pour les autres :
1. Fermer les applications non nécessaires
2. Passer en mode câblé (Ethernet) plutôt que Wi-Fi
3. Dans Teams : le partage en HD est limité aux connexions rapides

## Étape 5 — Partage impossible en réunion externe

Si la réunion est organisée par un client externe, l'administrateur Teams de ce client peut avoir désactivé le partage d'écran pour les invités.  
Solution : demander à l'organisateur d'ajuster les paramètres de la réunion.

## Escalade N2
Si le problème touche tous les utilisateurs Teams de FinCorp simultanément : incident sur le tenant Microsoft 365. Vérifier `https://status.office365.com`.
