---
title: Pilotes (drivers) — mise à jour et réinstallation
catégorie: Système d'exploitation
service: Tous services
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: Ne jamais mettre à jour tous les pilotes en même temps — un à la fois pour identifier les régressions
---

# Pilotes (drivers) — mise à jour et réinstallation

## Quand mettre à jour un pilote ?
- Périphérique qui ne fonctionne pas ou mal après une mise à jour Windows
- Problème d'affichage, de son ou de réseau apparu récemment
- BSOD avec code lié à un composant spécifique

## Méthode 1 — Via le Gestionnaire de périphériques
```
Win + X > Gestionnaire de périphériques
```
Clic droit sur le périphérique > **Mettre à jour le pilote** > Rechercher automatiquement

Si Windows ne trouve pas de mise à jour : utiliser la méthode 2.

## Méthode 2 — Via Lenovo Vantage (ThinkPad)
```
Démarrer > Lenovo Vantage > Support système > Mises à jour du système
```
Outil officiel Lenovo — détecte et installe les pilotes adaptés au modèle exact.
Recommandé pour : pilote graphique, audio, Wi-Fi, ThinkPad Input Devices (touchpad/TrackPoint).

## Méthode 3 — Via MyASUS (ASUS ExpertBook)
```
Démarrer > MyASUS > Mise à jour & restauration
```
Equivalent Lenovo Vantage pour les postes ASUS.

## Méthode 4 — Téléchargement direct constructeur
Toujours préférer le site officiel du constructeur au lieu de sites tiers :
- **Lenovo** : support.lenovo.com
- **ASUS** : asus.com/support
- **Intel** (pilotes graphiques intégrés) : downloadcenter.intel.com
- **Realtek** (son/réseau) : via le site du fabricant du PC, pas le site Realtek directement

## Revenir à un pilote précédent (rollback)
Si une mise à jour de pilote crée des problèmes :
```
Gestionnaire de périphériques > [Périphérique] > Propriétés > Pilote > Revenir au pilote précédent
```
Option disponible seulement si un pilote antérieur est sauvegardé (généralement dans les 7 jours).

## Désinstaller et réinstaller proprement
1. Gestionnaire de périphériques > Clic droit > Désinstaller l'appareil
2. Cocher **Supprimer le logiciel de pilote pour ce périphérique**
3. Redémarrer → Windows réinstalle le pilote générique
4. Installer ensuite le pilote spécifique du constructeur

## Pilotes critiques à ne jamais désinstaller sans sauvegarde
- Pilote réseau Ethernet (si désinstallé sans Wi-Fi disponible → plus de connexion pour récupérer le pilote)
- Pilote contrôleur de stockage (NVMe/SATA) → risque de non-démarrage
