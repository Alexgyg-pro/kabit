---
title: Connexion Wi-Fi au bureau — problèmes et résolution
catégorie: Réseau & Connectivité
service: Tous services
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: Le Wi-Fi invités est limité à 10 Mbit/s, ne pas l'utiliser pour les outils métier
---

# Connexion Wi-Fi au bureau — problèmes et résolution

## Réseaux Wi-Fi disponibles chez FinCorp

| SSID              | Usage                        | Authentification     |
|-------------------|------------------------------|----------------------|
| FINCORP-CORP      | Collaborateurs (prioritaire) | 802.1X / certificat  |
| FINCORP-MOBILE    | Smartphones professionnels   | 802.1X / certificat  |
| FINCORP-GUEST     | Visiteurs et prestataires    | Portail captif       |

**Important** : toujours utiliser FINCORP-CORP pour Bloomberg, SAP et les applications métier.

## Problème 1 — Impossible de voir le réseau FINCORP-CORP

1. Vérifier que le Wi-Fi est activé (touche Fn ou icône systray)
2. Désactiver / réactiver la carte Wi-Fi :
   ```
   Gestionnaire de périphériques > Cartes réseau > Désactiver / Activer
   ```
3. Redémarrer le service réseau :
   ```cmd
   netsh winsock reset
   netsh int ip reset
   ipconfig /flushdns
   ```
4. Redémarrer le PC

## Problème 2 — Connecté mais sans accès aux ressources internes

1. Vérifier l'adresse IP obtenue : `ipconfig`
   - Plage attendue : `10.10.x.x` (bureau Paris), `10.20.x.x` (Lyon)
   - Si adresse `169.254.x.x` → DHCP non joignable → forcer un renouvellement :
   ```cmd
   ipconfig /release && ipconfig /renew
   ```
2. Tester la résolution DNS : `nslookup intranet.fincorp.local`
3. Vérifier que le certificat machine est présent (authentification 802.1X) :
   ```
   certmgr.msc > Personnel > Certificats
   ```
   Doit contenir un certificat émis par `FinCorp-CA` non expiré.

## Problème 3 — Déconnexions fréquentes

- Désactiver l'économie d'énergie sur la carte Wi-Fi :
  ```
  Gestionnaire de périphériques > Carte Wi-Fi > Propriétés > Gestion de l'alimentation
  Décocher "Autoriser l'ordinateur à éteindre ce périphérique pour économiser de l'énergie"
  ```
- Mettre à jour le pilote Wi-Fi depuis le site du constructeur

## Escalade
Signaler à la Boutique IT si plusieurs postes du même open-space sont affectés simultanément — probable panne de borne Cisco Catalyst.
