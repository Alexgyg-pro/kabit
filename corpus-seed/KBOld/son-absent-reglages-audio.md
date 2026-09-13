---
title: Pas de son — diagnostic et réglages audio Windows
catégorie: Matériel
service: Tous services
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: Vérifier en priorité le volume et le périphérique de sortie avant tout diagnostic avancé
---

# Pas de son — diagnostic et réglages audio Windows

## Vérifications en 1 minute

1. **Volume non coupé ?** Icône haut-parleur dans la barre des tâches — clic pour vérifier
2. **Bon périphérique de sortie ?** Clic droit sur l'icône son > Ouvrir les paramètres du son > Choisir le périphérique de sortie
3. **Casque branché ?** Si un casque filaire est branché, les haut-parleurs intégrés sont désactivés automatiquement

## Problème 1 — Aucun son sur haut-parleurs internes

```
Panneau de configuration > Son > onglet Lecture
```
Vérifier que les haut-parleurs sont définis comme **Périphérique par défaut** (coche verte).
Si absents de la liste : clic droit dans la zone blanche > **Afficher les périphériques désactivés** > Réactiver.

## Problème 2 — Aucun son après mise à jour Windows

Mettre à jour ou réinstaller le pilote audio :
```
Gestionnaire de périphériques > Contrôleurs son, vidéo et jeu
Clic droit > Mettre à jour le pilote
```
Si ça ne suffit pas : désinstaller le pilote, redémarrer (Windows le réinstalle automatiquement).

Pour les ThinkPad : installer **Dolby Audio** via Lenovo Vantage.

## Problème 3 — Son présent mais très faible

1. Vérifier le volume de l'application spécifique :
   ```
   Clic droit icône son > Ouvrir le mixeur de volume
   ```
   Chaque application a son propre curseur.
2. Vérifier les améliorations audio :
   ```
   Panneau de configuration > Son > Lecture > Haut-parleurs > Propriétés > Améliorations
   Désactiver toutes les améliorations (test)
   ```

## Problème 4 — Pas de son dans Teams/Zoom uniquement

Voir la fiche **Microsoft Teams — problèmes audio et vidéo**.
Le périphérique audio par défaut Windows ≠ périphérique configuré dans Teams.

## Problème 5 — Pas de son via HDMI (écran externe)

```
Panneau de configuration > Son > Lecture
```
Sélectionner **[Nom écran] HDMI** comme périphérique par défaut.
Si l'écran n'apparaît pas : débrancher/rebrancher le câble HDMI.

## Réinitialisation complète du service audio
```cmd
net stop audiosrv
net stop AudioEndpointBuilder
net start audiosrv
net start AudioEndpointBuilder
```
