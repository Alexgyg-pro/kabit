---
title: Réinitialisation de mot de passe Active Directory
catégorie: Authentification & Accès
service: Tous services
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: Ne jamais transmettre le mot de passe temporaire par email
---

# Réinitialisation de mot de passe Active Directory

## Quand l'utiliser
- Collaborateur qui a oublié son mot de passe
- Compte verrouillé après trop de tentatives (seuil : 5 tentatives)
- Nouveau collaborateur sans mot de passe initial
- Mot de passe expiré (validité : 90 jours)

## Politique de mots de passe FinCorp

| Paramètre             | Valeur           |
|-----------------------|------------------|
| Longueur minimale     | 14 caractères    |
| Complexité            | Obligatoire      |
| Durée de validité     | 90 jours         |
| Historique            | 12 derniers      |
| Tentatives avant lock | 5                |
| Durée du verrou       | 30 minutes       |

## Procédure — Via ADUC (Active Directory Users and Computers)

1. Ouvrir ADUC : `dsa.msc`
2. Rechercher le compte : CTRL+F, saisir le login ou prénom.nom
3. Clic droit sur le compte > **Reset Password**
4. Saisir le mot de passe temporaire (ex : `FinC@rp2026!`)
5. Cocher **L'utilisateur doit changer le mot de passe à la prochaine connexion**
6. Cliquer **OK**
7. Si compte verrouillé : onglet Account > décocher **Account is locked out**

## Procédure — Via PowerShell (plus rapide)

```powershell
# Réinitialiser
Set-ADAccountPassword -Identity "prenom.nom" -Reset `
  -NewPassword (ConvertTo-SecureString "FinC@rp2026!" -AsPlainText -Force)

# Forcer changement à la prochaine connexion
Set-ADUser -Identity "prenom.nom" -ChangePasswordAtLogon $true

# Déverrouiller
Unlock-ADAccount -Identity "prenom.nom"

# Vérifier le statut du compte
Get-ADUser -Identity "prenom.nom" -Properties LockedOut, PasswordExpired, Enabled
```

## Communication du mot de passe temporaire
- **Par téléphone uniquement** — jamais par email, Teams ou SMS
- Demander à l'utilisateur de changer immédiatement depuis `https://myaccount.microsoft.com`

## Cas MFA (Okta Verify / Microsoft Authenticator)
Si le collaborateur a perdu son téléphone ou changé d'appareil, réinitialiser également le MFA :
- Azure AD : portail admin > Utilisateur > Méthodes d'authentification > Supprimer
- Okta : Admin Console > Utilisateur > Reset MFA
