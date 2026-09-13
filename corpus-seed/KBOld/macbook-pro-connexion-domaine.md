---
title: MacBook Pro — connexion au domaine Windows et accès aux ressources internes
catégorie: Authentification & Accès
service: Direction Générale, Marketing
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: Les MacBook sont réservés aux cadres DG et équipe Marketing — enrôlement Jamf Pro obligatoire
---

# MacBook Pro — connexion au domaine Windows et accès aux ressources internes

## Contexte
Les MacBook Pro M3 Pro (Direction Générale) et MacBook Air (Marketing) sont gérés via **Jamf Pro** (MDM Apple).
Ils ne sont pas joints au domaine Active Directory mais utilisent l'authentification Azure AD via SSO.

## Enrôlement Jamf Pro (nouveau MacBook)

1. Démarrer le Mac > assistant de configuration
2. À l'étape **Gestion de l'appareil** : l'enrôlement Jamf se déclenche automatiquement si sur réseau Wi-Fi FinCorp
3. Se connecter avec le compte Azure AD : `prenom.nom@fincorp.com`
4. Attendre l'installation des profils et applications (~15 min)

Si l'enrôlement ne se déclenche pas automatiquement :
- Ouvrir Safari > `https://jamf.fincorp.local/enroll`
- Se connecter avec les identifiants AD

## Accès aux lecteurs réseau depuis macOS

Les lecteurs réseau sont accessibles via SMB :
1. Finder > Aller > Se connecter au serveur : `smb://fileserver.fincorp.local/[dossier]`
2. Authentification : `FINCORP\prenom.nom` + mot de passe AD
3. Cocher **Mémoriser le mot de passe** pour éviter la ressaisie

Lecteurs disponibles :
- `smb://fileserver.fincorp.local/DG` — Direction Générale
- `smb://fileserver.fincorp.local/MKT` — Marketing
- `smb://fileserver.fincorp.local/COMMUN` — Partage inter-services

## Problème — Le Mac ne trouve pas les serveurs internes

1. Vérifier la connexion VPN (Cisco AnyConnect pour macOS disponible dans le Self Service Jamf)
2. Tester la résolution DNS : `Terminal > nslookup fileserver.fincorp.local`
3. Si DNS KO : vérifier que les serveurs DNS 10.10.1.53 et 10.10.1.54 sont configurés

## Problème — Applications Microsoft 365 non activées

1. Ouvrir une app Office (Word, Excel)
2. Se connecter avec `prenom.nom@fincorp.com`
3. Si erreur de licence : Boutique IT vérifie l'attribution dans le portail M365 Admin

## Problème — Certificat Wi-Fi 802.1X non présent

1. Self Service Jamf > **Installer le certificat FinCorp-CA**
2. Redémarrer, se reconnecter à FINCORP-CORP
