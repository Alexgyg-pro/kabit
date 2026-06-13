---
title: Bureau à distance (RDP) — connexion et problèmes courants
catégorie: Réseau & Connectivité
service: Informatique, Tous services (accès aux serveurs)
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: RDP vers les serveurs nécessite d'être dans le groupe AD GRP-RDP-[SERVEUR] et d'être connecté au VPN
---

# Bureau à distance (RDP) — connexion et problèmes courants

## Lancer une connexion RDP
```
Win + R > mstsc
```
Ou : Recherche > "Connexion Bureau à distance"

Saisir l'adresse du serveur ou du PC distant :
- Serveurs : `srv-[nom].fincorp.local`
- PC utilisateur : `PAR-PDT-0142.fincorp.local` ou l'adresse IP

## Paramètres recommandés pour FinCorp

Dans mstsc > Afficher les options :
- **Couleurs** : Haute couleur 16 bits (meilleure performance)
- **Expérience** : LAN (bureau FinCorp) ou Modem large bande (VPN/télétravail)
- **Local Resources** : cocher le presse-papiers pour copier-coller entre les sessions
- **Lecteurs** : ne pas partager les lecteurs locaux par défaut (sécurité)

## Problème 1 — Erreur « Impossible de se connecter »

1. Vérifier que le VPN est connecté (si hors réseau FinCorp)
2. Vérifier que le PC/serveur cible est allumé : `ping [nom-machine]`
3. Vérifier les droits : l'utilisateur doit être dans `GRP-RDP-[NOM-MACHINE]`
4. Vérifier que le Bureau à distance est activé sur la machine cible :
   ```
   Panneau de configuration > Système > Paramètres d'accès à distance > Autoriser les connexions Bureau à distance
   ```

## Problème 2 — Erreur d'authentification (Credential SSP)

Message : "Une erreur d'authentification s'est produite. La fonction demandée n'est pas prise en charge."

Cause probable : niveaux de NLA (Network Level Authentication) incompatibles après une mise à jour.
Solution temporaire (à sécuriser ensuite) :
```
regedit > HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp
CredSSPSupportedNodeEncryptionMethods → valeur 0
```
Ou : mettre à jour Windows sur les deux machines.

## Problème 3 — Écran noir en session RDP

1. Attendre 30 secondes (chargement lent du profil)
2. Appuyer sur **Ctrl + Alt + Fin** (équivalent Ctrl+Alt+Suppr en RDP) > Gestionnaire des tâches > Nouveau processus > `explorer.exe`
3. Se déconnecter et se reconnecter

## Problème 4 — Son non transmis depuis le serveur

Dans mstsc > Ressources locales > Son distant > Sélectionner "Lire sur cet ordinateur"

## Sessions abandonnées (serveurs)
Les sessions RDP inactives depuis plus de **2 heures** sont automatiquement déconnectées (politique Intune).
Les sessions déconnectées sont conservées **8 heures** avant fermeture définitive.
