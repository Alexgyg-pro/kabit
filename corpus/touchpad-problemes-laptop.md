---
title: Pavé tactile (touchpad) — problèmes et réglages
catégorie: Matériel
service: Tous services
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: Sur ThinkPad, le TrackPoint (bouton rouge) est une alternative au touchpad
---

# Pavé tactile (touchpad) — problèmes et réglages

## Problème 1 — Touchpad désactivé

La cause la plus fréquente : la touche de désactivation a été appuyée accidentellement.

- **ThinkPad E16** : Fn + F6 (icône touchpad barré)
- **ASUS ExpertBook** : Fn + F6 ou double-tap dans le coin supérieur gauche du touchpad
- **MacBook Pro** : impossible de désactiver le touchpad accidentellement

Vérifier également :
```
Paramètres > Bluetooth et appareils > Pavé tactile > Activer le pavé tactile (interrupteur)
```

## Problème 2 — Touchpad désactivé lors du branchement d'une souris

Comportement par défaut Windows : le touchpad se désactive quand une souris est branchée.
Pour changer ce comportement :
```
Paramètres > Bluetooth et appareils > Pavé tactile
Décocher "Laisser le pavé tactile activé lorsqu'une souris est connectée"
```

## Problème 3 — Curseur qui saute ou comportement erratique

1. Nettoyer le touchpad avec un chiffon microfibre légèrement humide (résidus de peau = interférences)
2. Vérifier que les poignets ne touchent pas le touchpad pendant la frappe :
   ```
   Paramètres > Bluetooth et appareils > Pavé tactile > Sensibilité du pavé tactile
   Réduire la sensibilité
   ```
3. Mettre à jour le pilote touchpad :
   ```
   Gestionnaire de périphériques > Souris et autres périphériques de pointage
   ```
   Pour ThinkPad : pilote Synaptics via Lenovo Vantage

## Problème 4 — Gestes tactiles ne fonctionnent pas

```
Paramètres > Bluetooth et appareils > Pavé tactile > Gestes à plusieurs doigts
```
Vérifier que les gestes à 2, 3 et 4 doigts sont activés.

Gestes standards Windows :
- 2 doigts : défilement
- 2 doigts pincé : zoom
- 3 doigts glissé : changer de bureau / vue des tâches
- 4 doigts tapé : centre de notifications

## Problème 5 — Touchpad physiquement endommagé

Si le touchpad est fissuré, rayé profondément ou ne répond plus mécaniquement → escalade N2.
Intervention Boutique IT ou envoi en réparation constructeur sous garantie.
