---
title: GitHub Enterprise — accès, repositories et droits
catégorie: Applications métier
service: Informatique
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: GitHub Enterprise est réservé à l'équipe IT — aucune donnée métier confidentielle ne doit y être poussée
---

# GitHub Enterprise — accès, repositories et droits

## Accès GitHub Enterprise FinCorp
- **URL** : `https://github.fincorp.local`
- **Authentification** : SSO Azure AD (SAML)
- **Organisation** : `fincorp-it`
- **25 licences développeurs actives**
- **Admin GitHub** : Équipe Boutique IT (ext. 4100)

## Problème 1 — Impossible de se connecter (SSO)

1. Accéder à `https://github.fincorp.local`
2. Cliquer **Sign in with Azure AD**
3. Si erreur SAML : vérifier que le compte Azure AD est actif et dans le groupe `GRP-GITHUB-USERS`
4. Si message « Organization membership required » :
   - Contacter la Boutique IT pour être ajouté à l'organisation `fincorp-it`
   - Délai : 4h ouvrées

## Problème 2 — Accès refusé à un repository

Les droits sur les repositories suivent trois niveaux :
- **Read** : lecture seule (consultation du code)
- **Write** : push sur les branches non protégées
- **Admin** : gestion du repo (settings, protection de branches, webhooks)

Demande d'accès :
1. Identifier le repository et le niveau requis
2. Contacter le **Tech Lead** responsable du repo (voir le fichier CODEOWNERS)
3. Le Tech Lead soumet la demande à la Boutique IT via Jira

## Problème 3 — Push refusé sur main/master

Les branches `main` et `master` sont protégées sur tous les repositories FinCorp :
- Pull Request obligatoire avec au moins 1 reviewer
- Pipeline CI doit passer (GitHub Actions)
- Historique linéaire imposé (rebase, pas de merge commit)

Si une PR est bloquée sans raison apparente : vérifier les checks GitHub Actions dans l'onglet Checks.

## Problème 4 — Tokens d'accès personnels (PAT)

Pour les connexions CLI ou scripts :
1. `Settings > Developer settings > Personal access tokens > Tokens (classic)`
2. Durée de validité maximale autorisée : **90 jours** (politique sécurité)
3. Les PAT doivent être stockés dans le coffre CyberArk (équipe IT) ou dans les secrets GitHub Actions

**Ne jamais committer un PAT ou une clé API dans un repository — même privé.**
CrowdStrike scanne les repositories à la recherche de secrets exposés.

## Bonnes pratiques FinCorp
- Branches nommées selon convention : `feature/JIRA-123-description`, `fix/JIRA-456-description`
- Commits signés (GPG) obligatoires sur les repositories de production
