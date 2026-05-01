---
title: Onboarding et offboarding — gestion des accès informatiques
catégorie: Authentification & Accès
service: Ressources Humaines, Informatique
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: Le formulaire de demande doit parvenir à la Boutique IT 5 jours ouvrés avant l'arrivée ou le départ
---

# Onboarding et offboarding — gestion des accès informatiques

## Onboarding — Checklist à J-5 (Boutique IT)

- [ ] Créer le compte AD : `prenom.nom@fincorp.com` (convention obligatoire)
- [ ] Ajouter aux groupes AD selon le service (voir matrice des accès `\\fileserver\it-commun\matrices-acces`)
- [ ] Provisionner Microsoft 365 (licence E3)
- [ ] Créer le compte SAP si service SF/RH/DG (coordinateur SI Finance)
- [ ] Créer le compte Salesforce si service RC/MKT (admin Salesforce)
- [ ] Attribuer licence Bloomberg/Eikon si Trading/SF (responsable salle des marchés)
- [ ] Pré-configurer le laptop (image Intune automatique)
- [ ] Créer le badge d'accès physique (coordination avec la sécurité bâtiment)
- [ ] Enrôler le smartphone professionnel dans Intune (si fourni)

## Onboarding — Jour J

1. Remettre le laptop configuré (mot de passe temporaire communiqué oralement)
2. Guider le collaborateur vers `https://myaccount.microsoft.com` pour changer le MDP et enrôler le MFA
3. Vérifier l'accès aux lecteurs réseau (H:, S:)
4. Vérifier la connexion VPN depuis un réseau externe si télétravail prévu
5. Faire signer le formulaire de remise de matériel

## Offboarding — Checklist J-0 (le jour du départ)

**Actions immédiates (sous 2h) :**
- [ ] Désactiver le compte AD (ne pas supprimer)
- [ ] Révoquer les sessions Azure AD actives :
  ```powershell
  Revoke-AzureADUserAllRefreshToken -ObjectId [UPN]
  ```
- [ ] Désactiver le compte dans tous les systèmes tiers (SAP, Salesforce, Bloomberg, Okta)
- [ ] Désactiver le badge physique (coordination sécurité)
- [ ] Effacement à distance du smartphone (si données d'entreprise dessus via Intune)

**Actions sous 24h :**
- [ ] Redirection des emails vers le responsable (30 jours)
- [ ] Transfert des fichiers OneDrive/SharePoint selon accord du manager
- [ ] Récupération du matériel (laptop, écran, badge, accessoires)
- [ ] Mise à jour CMDB

**Suppression du compte AD : 30 jours après le départ** (exigence légale de rétention).

## Cas particulier — Départ sensible (licenciement, conflit)
Contacter simultanément : Boutique IT + DRH + équipe Sécurité IT + Juridique.
Désactivation du compte AD en temps réel, avant notification à l'employé.
