---
title: Microsoft Teams — problèmes audio et vidéo en réunion
catégorie: Messagerie & Collaboration
service: Tous services
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: Vérifier en priorité les permissions Windows avant tout diagnostic avancé
---

# Microsoft Teams — problèmes audio et vidéo en réunion

## Symptômes courants
- Micro non détecté ou inaudible pour les autres participants
- Caméra non disponible ou image figée
- Écho ou larsen
- Son coupé par intermittence

## Vérifications préalables (2 minutes)

1. **Périphériques physiques** : câble USB branché ? Casque allumé (Bluetooth) ?
2. **Permissions Windows** :
   - Paramètres > Confidentialité > Microphone : Teams doit être autorisé
   - Paramètres > Confidentialité > Caméra : Teams doit être autorisé
3. **Périphérique par défaut dans Teams** :
   - Dans Teams : avatar > Paramètres > Appareils
   - Sélectionner le bon micro, haut-parleur et caméra
   - Lancer un test audio

## Problème 1 — Micro inaudible

```
Panneau de configuration > Son > Enregistrement
```
Vérifier que le micro est défini par défaut et que le niveau n'est pas à 0.
Désactiver le réglage **Amélioration du microphone** si activé.

Si utilisation d'un casque Jabra ou Poly : mettre à jour le firmware via Jabra Direct / Poly Lens.

## Problème 2 — Caméra non reconnue

1. Gestionnaire de périphériques > Appareils de traitement d'image
2. Désactiver / Réactiver la caméra
3. Vérifier qu'aucune autre application n'utilise la caméra (Zoom, Webex)
4. Pour les MacBook Pro : Réglages Système > Confidentialité & Sécurité > Caméra

## Problème 3 — Écho

L'écho vient toujours du poste qui utilise les haut-parleurs sans casque.
Solution : demander à la personne concernée de mettre un casque ou de baisser son volume de sortie.

## Problème 4 — Teams lent ou plantages en réunion

Vider le cache Teams :
```
%appdata%\Microsoft\Teams\
```
Fermer Teams, supprimer le contenu (pas le dossier), relancer.

Pour Teams 2.0 (nouvelle version) :
```
%localappdata%\Packages\MSTeams_8wekyb3d8bbwe\LocalCache\Microsoft\MSTeams\
```

## Escalade N2
Si le problème touche toute une équipe en même temps : probable incident sur le tenant Microsoft 365.
Vérifier le statut sur `https://status.office365.com`.
