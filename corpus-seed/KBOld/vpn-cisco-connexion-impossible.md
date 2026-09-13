---
title: VPN Cisco AnyConnect — connexion impossible
catégorie: Réseau & Connectivité
service: Tous services
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: Vérifier si l'utilisateur est en télétravail ou en déplacement
---

# VPN Cisco AnyConnect — connexion impossible

## Symptômes
- Message « VPN Service is not available »
- Erreur « Authentication failed » ou « Connection attempt has failed »
- Le client AnyConnect se lance mais reste bloqué sur « Connecting... »

## Causes fréquentes
1. Service Windows AnyConnect arrêté
2. Profil VPN supprimé ou corrompu
3. Mot de passe AD expiré
4. Conflit avec un autre logiciel VPN (ex : GlobalProtect résiduel)
5. Certificat d'authentification expiré

## Procédure de résolution

### Étape 1 — Vérifier le service Windows
```
services.msc → Cisco AnyConnect Secure Mobility Agent
```
Si arrêté : clic droit > Démarrer. Si désactivé : passer le démarrage en Automatique.

### Étape 2 — Tester avec les identifiants AD
- Vérifier que le mot de passe AD n'est pas expiré (connexion Windows OK ?)
- Si expiré : réinitialiser via `https://reset-mdp.fincorp.local` ou appeler la Boutique IT

### Étape 3 — Réinitialiser le profil AnyConnect
```
C:\ProgramData\Cisco\Cisco AnyConnect Secure Mobility Client\Profile\
```
Supprimer les fichiers `.xml`, relancer AnyConnect, ressaisir l'adresse du serveur : `vpn.fincorp.com`

### Étape 4 — Réinstallation propre
1. Désinstaller AnyConnect via Panneau de configuration
2. Supprimer le dossier résiduel `C:\ProgramData\Cisco\`
3. Télécharger le package depuis `\\fincorp-deploy\logiciels\vpn\`
4. Installer en tant qu'administrateur

### Étape 5 — Conflit logiciel
Vérifier la présence d'un autre VPN : GlobalProtect, OpenVPN, Pulse Secure.
Désinstaller tout VPN tiers avant de réinstaller AnyConnect.

## Escalade N2
Si aucune étape ne résout le problème, ouvrir un ticket avec :
- Capture du message d'erreur exact
- Logs AnyConnect : `%APPDATA%\Cisco\Cisco AnyConnect Secure Mobility Client\`
- Type de réseau utilisé (domicile, hôtel, 4G)
