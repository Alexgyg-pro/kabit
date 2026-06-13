---
title: Salesforce Financial Services Cloud — accès et problèmes courants
catégorie: Applications métier
service: Relation Client, Marketing
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: L'administration Salesforce est gérée par deux admins dédiés — la Boutique IT gère uniquement l'authentification SSO
---

# Salesforce Financial Services Cloud — accès et problèmes courants

## Accès Salesforce chez FinCorp
- **URL** : `https://fincorp.my.salesforce.com`
- **Authentification** : SSO via Azure AD (mêmes identifiants que Windows)
- **Admins Salesforce** : Marie Lefebvre (RC, ext. 4310) et Paul Nguyen (MKT, ext. 4320)
- **Licences** : 60 licences Sales Cloud + Financial Services Cloud

## Problème 1 — Impossible de se connecter (SSO en erreur)

1. Vérifier que le compte Azure AD est actif (connexion Windows OK ?)
2. Accéder via `https://fincorp.my.salesforce.com` — ne pas passer par une URL bookmarkée ancienne
3. Vider le cache navigateur : Ctrl+Shift+Del
4. Si erreur SAML : contacter la Boutique IT — probable désynchronisation du certificat SSO
5. En dernier recours : connexion avec identifiants Salesforce directs (demander à l'admin Salesforce)

## Problème 2 — « Vous n'avez pas accès à cette page »

Les droits dans Salesforce sont gérés via des **profils** et des **ensembles d'autorisations**.
Contact obligatoire : l'admin Salesforce (pas la Boutique IT) pour :
- Accès à un objet (Opportunités, Comptes, Rapports)
- Modification des droits sur des enregistrements
- Accès aux tableaux de bord partagés

## Problème 3 — Données non visibles ou enregistrements manquants

Les enregistrements sont soumis aux règles de partage (règles de visibilité par territoire, par équipe).
Si un conseiller ne voit pas un portefeuille client qu'il devrait gérer :
1. Vérifier l'affectation dans le champ **Propriétaire** de l'enregistrement
2. Contacter l'admin Salesforce pour réaffectation ou ajout aux règles de partage

## Problème 4 — Salesforce lent dans le navigateur

1. Désactiver les extensions de navigateur (AdBlock, etc.)
2. Utiliser **Chrome** (recommandé) ou Edge — Firefox non supporté officiellement
3. Vider le cache Salesforce :
   - `Nom d'utilisateur > Vider le cache > Vider`
4. Activer le mode Lightning Performance :
   - Setup > Lightning Experience > Activer

## Intégration Outlook (Salesforce Inbox)
L'add-in Salesforce Inbox est déployé via Intune.
Si absent dans Outlook : Boutique IT peut le pousser manuellement via le portail Intune.
