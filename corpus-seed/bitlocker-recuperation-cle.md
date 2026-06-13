---
title: BitLocker — récupération de clé de chiffrement
catégorie: Sécurité
service: Tous services
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: Toutes les clés BitLocker sont sauvegardées dans Azure AD — ne jamais stocker la clé dans un email
---

# BitLocker — récupération de clé de chiffrement

## Contexte
Tous les laptops FinCorp sont chiffrés avec BitLocker (politique de sécurité obligatoire).
L'écran de récupération BitLocker apparaît après :
- Remplacement de la carte mère
- Modification du BIOS/UEFI
- Plusieurs échecs de connexion
- Déconnexion du domaine

## Procédure de récupération

### Option 1 — Via Azure AD (Boutique IT)

1. Se connecter au portail Azure AD :
   `https://aad.portal.azure.com` > Azure Active Directory > Appareils
2. Rechercher le poste par nom (ex : `PAR-PDT-0142`)
3. Cliquer sur l'appareil > **Clés de récupération BitLocker**
4. Communiquer l'ID de clé + la clé de récupération à l'utilisateur **par téléphone uniquement**

### Option 2 — Via le portail SSPR utilisateur

Si l'utilisateur a accès à un autre appareil :
1. `https://myaccount.microsoft.com` > Appareils > Clés de récupération BitLocker

### Procédure utilisateur (saisie de la clé)

1. À l'écran bleu BitLocker : noter l'**ID de clé** affiché (8 premiers caractères)
2. Contacter la Boutique IT avec cet ID
3. Saisir la clé de récupération (48 chiffres) dans le champ dédié
4. Windows démarre normalement

## Après la récupération

1. Vérifier que BitLocker est toujours actif :
   ```cmd
   manage-bde -status C:
   ```
   Statut attendu : **Protection activée**
2. Si le statut est **Protection suspendue** : réactiver via :
   ```cmd
   manage-bde -protectors -enable C:
   ```
3. Mettre à jour la clé dans Azure AD :
   ```powershell
   BackupToAAD-BitLockerKeyProtector -MountPoint "C:" -KeyProtectorId (Get-BitLockerVolume -MountPoint "C:").KeyProtector[1].KeyProtectorId
   ```

## Incidents fréquents à signaler à l'équipe Sécurité IT
- Demande de clé BitLocker sans vérification d'identité préalable
- Clé introuvable dans Azure AD (poste non joint au domaine ou enrôlement Intune manquant)
