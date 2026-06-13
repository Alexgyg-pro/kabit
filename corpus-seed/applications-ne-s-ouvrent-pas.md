---
title: Une application ne s'ouvre pas ou se ferme immédiatement
catégorie: Système d'exploitation
service: Tous services
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: Vérifier en priorité si le problème est lié à un manque de droits ou à une mise à jour récente
---

# Une application ne s'ouvre pas ou se ferme immédiatement

## Étape 1 — Essayer en tant qu'administrateur
Clic droit sur l'application > **Exécuter en tant qu'administrateur**
Si ça fonctionne → problème de droits, contacter la Boutique IT pour corriger les permissions.

## Étape 2 — Vérifier les mises à jour récentes
L'application fonctionnait hier ? Une mise à jour Windows ou de l'application peut être responsable.
```
Paramètres > Windows Update > Afficher l'historique des mises à jour
```
Voir aussi la fiche **Application métier en erreur après mise à jour Windows**.

## Étape 3 — Vider le cache de l'application

Chaque application a son propre cache :
- **Emplacement général** : `%localappdata%\[NomApp]` et `%appdata%\[NomApp]`
- Renommer le dossier de cache (ex : `Cache` → `Cache.old`) et relancer l'application

## Étape 4 — Réparer l'installation
```
Paramètres > Applications > Applications installées > [Application] > Modifier > Réparer
```
Ou via le Panneau de configuration > Programmes et fonctionnalités.

## Étape 5 — Réinstaller proprement
1. Désinstaller via Panneau de configuration > Programmes et fonctionnalités
2. Supprimer les restes dans `%localappdata%` et `%appdata%`
3. Redémarrer
4. Réinstaller depuis `\\fincorp-deploy\logiciels\` ou le portail Intune Company Portal

## Étape 6 — Consulter les logs d'erreur
```
Observateur d'événements > Journaux Windows > Application
Filtrer par Erreur, sur la période du plantage
```
Le nom de l'application et le code d'exception permettent un diagnostic précis.

## Cas particulier — Application bloquée par CrowdStrike
Si l'application ne s'ouvre pas silencieusement (pas de message d'erreur) → probable blocage CrowdStrike.
Voir la fiche **CrowdStrike Falcon — alertes et faux positifs**.

## Cas particulier — Application Microsoft 365 (Word, Excel, Teams)
Réparer via :
```
Paramètres > Applications > Microsoft 365 > Modifier > Réparation rapide
```
Si réparation rapide insuffisante : Réparation en ligne (nécessite une connexion internet, ~20 min).
