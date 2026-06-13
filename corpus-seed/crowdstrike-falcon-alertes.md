---
title: CrowdStrike Falcon — alertes et faux positifs
catégorie: Sécurité
service: Informatique
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: CrowdStrike est l'EDR de référence FinCorp — ne jamais désactiver sans validation de l'équipe Sécurité
---

# CrowdStrike Falcon — alertes et faux positifs

## Contexte
CrowdStrike Falcon est déployé sur 100% des postes FinCorp (Windows et macOS).
Il remplace l'antivirus traditionnel (Windows Defender reste actif en mode passif).

## Problème 1 — Application bloquée par CrowdStrike

Symptômes : application qui ne se lance pas, message d'accès refusé sans autre explication, fichier supprimé automatiquement.

1. Vérifier dans les logs Windows si CrowdStrike est à l'origine :
   ```
   Observateur d'événements > Applications et services > CrowdStrike
   ```
2. **Ne pas contourner CrowdStrike sans validation.**
3. Ouvrir un ticket urgent à l'équipe Sécurité IT avec :
   - Nom du fichier / application bloqué
   - Hash SHA-256 si disponible
   - Capture de l'alerte CrowdStrike

L'équipe Sécurité IT peut créer une exclusion dans la console Falcon si le fichier est légitime.

## Problème 2 — Faux positif sur un outil de développement (équipe IT)

Les outils de pentest, scripts PowerShell avancés et compilateurs peuvent déclencher des alertes.

Procédure de whitelisting :
1. Ouvrir un ticket auprès de l'équipe Sécurité IT avec justification métier
2. Test en environnement bac à sable si nécessaire
3. Création d'une exclusion ciblée (path + hash, jamais d'exclusion globale)

## Problème 3 — Agent CrowdStrike consomme beaucoup de CPU

L'agent peut utiliser 20-30% de CPU lors d'une analyse approfondie (scan actif, mise à jour de contenu).
Cela est normal et temporaire (< 15 min).

Si la consommation est permanente :
1. Vérifier la version de l'agent : `SC query csagent`
2. Signaler à l'équipe Sécurité IT — probable analyse liée à une détection en cours

## Problème 4 — Alerte de sécurité critique (Detection)

Si CrowdStrike affiche une alerte critique ou si l'utilisateur reçoit un email d'alerte :
1. **Ne pas éteindre le poste**
2. Débrancher le câble réseau immédiatement
3. Appeler la Boutique IT : ext. 4100
4. Ne toucher à rien — l'équipe Sécurité IT prend la main à distance

**Un incident de sécurité non signalé expose FinCorp à des risques de conformité MiFID II.**
