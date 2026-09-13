---
title: Navigateur web lent — vider le cache et optimiser
catégorie: Système d'exploitation
service: Tous services
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: Chrome et Edge sont les navigateurs officiels FinCorp — Firefox et IE ne sont plus supportés
---

# Navigateur web lent — vider le cache et optimiser

## Navigateurs officiels FinCorp
- **Microsoft Edge** : installé par défaut, recommandé pour les apps Microsoft 365
- **Google Chrome** : recommandé pour Bloomberg Anywhere et Salesforce
- **Firefox / Internet Explorer** : non supportés officiellement

## Vider le cache — raccourcis universels

**Ctrl + Shift + Suppr** (fonctionne sur Chrome, Edge, Firefox)

Sélectionner :
- Cookies et autres données de site ✓
- Images et fichiers en cache ✓
- Période : Toute la période

Cliquer **Effacer les données**.

## Chrome — optimisation

### Désactiver les extensions inutiles
```
chrome://extensions/
```
Désactiver toutes les extensions non nécessaires (chaque extension consomme de la RAM).

### Vérifier les processus Chrome
```
Shift + Échap (dans Chrome)
```
Affiche le gestionnaire de tâches interne de Chrome — identifier les onglets/extensions gourmands.

### Réinitialiser Chrome
```
Paramètres > Réinitialiser les paramètres > Rétablir les paramètres par défaut
```
Conserve les marque-pages et mots de passe mais supprime les extensions et paramètres personnalisés.

## Edge — optimisation

### Mode Performances (Edge)
```
edge://settings/system
```
Activer **Démarrage rapide** et **Mode veille des onglets** pour réduire la consommation mémoire.

### Vider le cache Edge uniquement pour un site
1. Clic droit dans la barre d'adresse sur le site concerné
2. **Informations sur le site** > **Effacer les données du site**
Utile quand un site spécifique (intranet, SAP Fiori) se comporte bizarrement.

## Problème — Site interne inaccessible ou en erreur SSL

Ajouter le site aux exceptions de confiance :
```
Panneau de configuration > Options Internet > Sécurité > Sites de confiance > Sites
```
Ajouter : `*.fincorp.local` et `*.fincorp.com`

## Problème — Proxy d'entreprise bloque un site

Le proxy FinCorp filtre certains sites. Si un site légitime est bloqué :
1. Vérifier sur un autre poste (confirme que c'est le proxy)
2. Ouvrir une demande d'exception proxy à `it-support@fincorp.com` avec justification métier
