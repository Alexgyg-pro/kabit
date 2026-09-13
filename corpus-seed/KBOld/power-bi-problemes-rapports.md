---
title: Power BI — problèmes d'accès aux rapports et de rafraîchissement des données
catégorie: Applications métier
service: Stratégie Financière, Direction Générale, Marketing, Relation Client
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: Les workspaces Power BI sont gérés par les référents métier — la Boutique IT gère la passerelle de données
---

# Power BI — problèmes d'accès aux rapports et de rafraîchissement des données

## Accès Power BI chez FinCorp
- **URL** : `https://app.powerbi.com`
- **Authentification** : SSO Azure AD
- **Licences** : Power BI Pro (40 utilisateurs) — attribuée par la Boutique IT sur demande du manager
- **Passerelle de données** : `pbi-gateway.fincorp.local` (utilisée pour SAP, SQL Server, fichiers locaux)

## Problème 1 — Rapport inaccessible ou « Vous n'avez pas accès »

Les accès aux rapports et workspaces sont gérés par les **propriétaires de workspace** (équipes métier).

1. Identifier le workspace concerné (barre latérale gauche > Workspaces)
2. Contacter le propriétaire :
   - SF Finance : Lucas Bernard (ext. 4151)
   - Direction : assistante de direction (ext. 4001)
   - Marketing : Paul Nguyen (ext. 4320)
3. Le propriétaire peut partager directement : `…` > Gérer les autorisations > Partager

**La Boutique IT n'accorde pas d'accès aux workspaces métier.**

## Problème 2 — Données obsolètes dans un rapport

Power BI actualise les données selon un planning configuré.

Vérifier la fréquence d'actualisation :
1. Workspace > Jeux de données > `…` > Planifier l'actualisation
2. Si l'actualisation a échoué : un triangle orange s'affiche

Causes fréquentes d'échec :
- Passerelle de données hors ligne : contacter la Boutique IT (surveillance 24h)
- Credentials SAP/SQL expirées : reconfigurer dans les paramètres du jeu de données
- Volume de données trop important : découper les requêtes

Forcer une actualisation manuelle : Jeu de données > `…` > Actualiser maintenant

## Problème 3 — Power BI Desktop ne se connecte pas à SAP

1. Vérifier que la passerelle de données est sélectionnée dans les paramètres de connexion
2. Le driver SAP HANA ODBC doit être installé : `\\fincorp-deploy\drivers\sap-hana-odbc\`
3. Pour les connexions DirectQuery : nécessite la passerelle on-premises

## Problème 4 — Rapport lent à charger

1. Vider le cache navigateur
2. Utiliser Power BI Desktop plutôt que le navigateur pour les rapports complexes
3. Si persistant : signaler au propriétaire du workspace pour optimisation du modèle de données
