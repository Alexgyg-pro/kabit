---
title: MFA — changement de smartphone ou perte du téléphone
catégorie: Authentification & Accès
service: Tous services
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: En cas de perte du téléphone, signaler immédiatement à la Boutique IT ET à l'équipe Sécurité
---

# MFA — changement de smartphone ou perte du téléphone

## Solution MFA chez FinCorp
- **Microsoft Authenticator** : pour Microsoft 365, Azure AD, SAP Fiori
- **Okta Verify** : pour Salesforce, DocuSign, portails partenaires
- **Backup** : code de secours à usage unique (à conserver en lieu sûr)

## Cas 1 — Changement planifié de smartphone

### Étape 1 — Sur l'ancien téléphone (avant de l'effacer)
Exporter les comptes si possible :
- Microsoft Authenticator : Paramètres > Sauvegarde (sauvegarde iCloud ou compte Microsoft)
- Okta Verify : pas d'export natif — prévoir la re-enrôlement

### Étape 2 — Réinitialiser le MFA côté serveur (Boutique IT)
**Microsoft Authenticator** :
1. Portail Azure AD > Utilisateurs > [Nom] > Méthodes d'authentification
2. Cliquer **Exiger la réinscription de l'authentification multifacteur**

**Okta Verify** :
1. Okta Admin Console > Annuaire > Personnes > [Nom]
2. Onglet **Plus** > **Réinitialiser le facteur Okta Verify**

### Étape 3 — Re-enrôlement sur le nouveau téléphone
1. Se connecter sur `https://myaccount.microsoft.com`
2. Sécurité > Méthodes de vérification > Ajouter une méthode
3. Scanner le QR code avec la nouvelle application

## Cas 2 — Perte ou vol du téléphone

**Action immédiate** :
1. Appeler la Boutique IT : ext. 4100 (ou +33 1 XX XX XX XX hors bureau)
2. La Boutique IT révoque immédiatement tous les tokens MFA actifs
3. Signaler également à l'équipe Sécurité IT si le téléphone contenait des emails professionnels

**Désactivation à distance (si Intune MDM)** :
- Portail Intune > Appareils > [Téléphone] > Effacer / Supprimer les données d'entreprise

## Codes de secours (backup codes)
Chaque utilisateur dispose de 8 codes de secours générés à l'enrôlement.
À conserver dans un coffre de mots de passe (Bitwarden, 1Password) — jamais dans Outlook.
Si les codes sont perdus : Boutique IT génère de nouveaux codes après vérification d'identité téléphonique.
