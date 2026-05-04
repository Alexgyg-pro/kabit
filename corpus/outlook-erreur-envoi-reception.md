---
title: Outlook — erreurs d'envoi et de réception (codes 0x)
catégorie: Messagerie & Collaboration
service: Tous services
équipes: Boutique IT
dernière_revision: 04/05/2026
statut: Publié
commentaire: Les codes d'erreur 0x sont souvent liés au réseau ou à l'authentification Exchange
---

# Outlook — erreurs d'envoi et de réception (codes 0x)

## Symptômes
- Fenêtre d'erreur avec un code hexadécimal (0x800CCC0F, 0x8004010F…)
- Emails bloqués dans la boîte d'envoi
- Envoi/réception automatique échoue silencieusement

## Codes d'erreur courants

| Code | Signification | Action |
|------|--------------|--------|
| 0x800CCC0F | Connexion interrompue | Vérifier réseau/VPN |
| 0x8004010F | Fichier de données introuvable | Réparer le profil |
| 0x800CCC13 | Impossible de se connecter au serveur | Vérifier Exchange/VPN |
| 0x80040900 | Paramètre serveur SMTP incorrect | Non applicable Exchange Online |
| 0x80070005 | Accès refusé au fichier OST | Vérifier les droits sur le fichier |

## Étape 1 — Vérifier la connectivité

1. Ouvrir OWA : `https://mail.fincorp.com` — si ça fonctionne, le problème est local
2. Vérifier que le VPN est connecté si en télétravail
3. Désactiver temporairement l'antivirus (certains analysent le trafic MAPI et le bloquent)

## Étape 2 — Vider la boîte d'envoi bloquée

1. Passer en **mode hors connexion** (Envoi/Réception > Travailler hors connexion)
2. Ouvrir la boîte d'envoi et supprimer les emails bloqués
3. Repasser en ligne
4. Retaper et renvoyer les emails

## Étape 3 — Réparer le profil Outlook

Panneau de configuration > Courrier > Afficher les profils > **Réparer**  
(voir aussi fiche *outlook-profil-corrompu*)

## Étape 4 — Réinitialiser les identifiants Exchange

Gestionnaire des identifiants Windows > supprimer les entrées Outlook/Office  
Relancer Outlook et se ré-authentifier.

## Escalade N2
Joindre le message d'erreur complet et le code lors de l'escalade. Vérifier le statut Exchange Online sur `https://status.office365.com` avant d'ouvrir un ticket.
