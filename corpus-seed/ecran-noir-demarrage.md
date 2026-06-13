---
title: Écran noir au démarrage ou après connexion Windows
catégorie: Système d'exploitation
service: Tous services
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: Distinct du BSOD — ici Windows semble démarrer mais l'écran reste noir
---

# Écran noir au démarrage ou après connexion Windows

## Symptômes
- L'écran reste noir après l'écran de connexion Windows
- Le curseur de souris est visible mais rien d'autre
- Le bureau s'affiche brièvement puis devient noir

## Étape 1 — Vérifications immédiates (30 secondes)
1. Attendre 2-3 minutes : certains profils lents mettent du temps à charger
2. Bouger la souris et appuyer sur des touches
3. Essayer **Ctrl + Alt + Suppr** : si le menu apparaît, Windows tourne mais l'interface est bloquée

## Étape 2 — Réinitialiser le pilote graphique
**Win + Ctrl + Shift + B** — réinitialise le pilote graphique en 1 seconde sans perte de données.
L'écran clignote brièvement (normal).

## Étape 3 — Redémarrer l'explorateur Windows
Si Ctrl+Alt+Suppr fonctionne :
1. Gestionnaire des tâches > Fichier > Exécuter une nouvelle tâche
2. Taper `explorer.exe` > OK
Le bureau devrait réapparaître.

## Étape 4 — Démarrage en mode sans échec
1. Redémarrer > maintenir **F8** ou **Shift + Redémarrer**
2. Options avancées > Paramètres de démarrage > Mode sans échec avec réseau
3. Si le bureau s'affiche en mode sans échec → le problème vient d'un pilote ou d'un logiciel de démarrage

En mode sans échec :
- Désinstaller les pilotes graphiques récemment mis à jour
- Désactiver les programmes au démarrage (msconfig > Démarrage)

## Étape 5 — Vérifier le service de profil
Dans le journal d'événements (accessible depuis le Gestionnaire des tâches > Fichier > Exécuter > `eventvwr`) :
Chercher des erreurs liées à `User Profile Service` → voir la fiche **Profil utilisateur Windows corrompu**

## Cause fréquente chez FinCorp
Mise à jour du pilote graphique Intel/NVIDIA qui crée un conflit.
Solution : désinstaller le pilote via le mode sans échec, redémarrer (Windows installe le pilote générique).
