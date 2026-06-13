---
title: Clavier ou souris ne fonctionnent plus
catégorie: Matériel
service: Tous services
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: Distinguer panne matérielle, pilote et connexion avant d'intervenir
---

# Clavier ou souris ne fonctionnent plus

## Vérifications immédiates

- **USB** : débrancher et rebrancher sur un autre port USB (éviter les hubs USB non alimentés)
- **Bluetooth** : vérifier la batterie du périphérique + voir la fiche Bluetooth
- **Laptop** : le clavier intégré fonctionne-t-il ? Permet de savoir si c'est le périphérique ou Windows

## Problème 1 — Clavier USB ou souris USB non détecté

1. Tester le périphérique sur un autre PC pour confirmer qu'il fonctionne
2. Tester un autre câble USB si possible
3. Vérifier dans le Gestionnaire de périphériques :
   ```
   Gestionnaire de périphériques > Clic droit > Rechercher les modifications sur le matériel
   ```
4. Désinstaller le périphérique dans le Gestionnaire > débrancher > rebrancher (réinstallation du pilote)

## Problème 2 — Clavier intégré du laptop (touches mortes)

Certaines touches cessent de fonctionner après un déversement de liquide ou une usure mécanique.
Test rapide :
```
Démarrer > Clavier visuel (osk.exe)
```
Si le clavier visuel fonctionne mais pas le clavier physique → panne matérielle → escalade N2 + prêt de matériel.

## Problème 3 — Touches de clavier inversées ou caractères incorrects

- Langue du clavier incorrecte : barre des tâches > indicateur de langue (FR/EN) > sélectionner Français (France)
- Raccourci accidentel **Alt + Shift** ou **Win + Espace** : change la langue de saisie
- Pour fixer définitivement :
  ```
  Paramètres > Heure et langue > Langue et région > Supprimer les langues non souhaitées
  ```

## Problème 4 — Souris trop rapide / trop lente

```
Paramètres > Bluetooth et appareils > Souris > Vitesse du pointeur
```
Ou :
```
Panneau de configuration > Souris > Pointeur > Vitesse du pointeur
```

## Problème 5 — Pavé numérique ne fonctionne pas

Vérifier que la touche **Verr Num** (Num Lock) est activée.
Sur les laptops compacts : la touche Fn peut être nécessaire pour activer Num Lock.

## Problème 6 — Souris figée après sortie de veille

```cmd
Gestionnaire de périphériques > Souris > Propriétés > Gestion de l'alimentation
Décocher "Autoriser l'ordinateur à éteindre ce périphérique pour économiser l'énergie"
```
