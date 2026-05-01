---
title: Problèmes de veille et d'hibernation
catégorie: Système d'exploitation
service: Tous services
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: La veille prolongée (hibernation) est désactivée sur les postes FinCorp pour accélérer les démarrages
---

# Problèmes de veille et d'hibernation

## Problème 1 — Le PC ne se réveille pas de la veille

1. Appuyer sur une touche ou bouger la souris (attendre 5 secondes)
2. Appuyer sur le bouton Power brièvement (1 seconde)
3. Si écran noir persistant : voir la fiche **Écran noir au démarrage**
4. En dernier recours : maintenir Power 10 secondes pour forcer l'arrêt, puis redémarrer

Pour éviter la récidive — désactiver la suspension USB :
```
Panneau de configuration > Options d'alimentation > Modifier les paramètres du mode > Modifier les paramètres d'alimentation avancés
USB > Suspension sélective USB > Désactivé
```

## Problème 2 — Le PC entre en veille trop rapidement

```
Paramètres > Système > Alimentation et mise en veille
```
- **Écran** : régler selon préférence (ex : 15 minutes)
- **Veille** : régler selon préférence ou **Jamais** si gênant

Pour les postes fixes utilisés comme serveurs de fichiers ou impressions : mettre les deux sur **Jamais**.

## Problème 3 — Le PC ne se met plus en veille

1. Vérifier qu'aucun processus ne bloque la veille :
```cmd
powercfg /requests
```
Affiche les processus qui empêchent la mise en veille.

2. Vérifier le dernier réveil non voulu :
```cmd
powercfg /lastwake
```

3. Désactiver les réveils planifiés (Windows Update peut réveiller le PC la nuit) :
```
Options d'alimentation > Paramètres avancés > Veille > Autoriser les minuteries de réveil > Désactivé
```

## Problème 4 — Perte de données après sortie de veille

La veille standard (S3) sauvegarde l'état en RAM — coupure d'alimentation = perte.
Si l'utilisateur craint les coupures, activer la **veille prolongée** (hiberfil.sys) :
```cmd
powercfg /hibernate on
```
Puis dans Options d'alimentation : à la fermeture du capot > Mettre en veille prolongée.

**Note** : la veille prolongée est désactivée par défaut sur les postes FinCorp pour libérer l'espace SSD.
