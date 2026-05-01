---
title: Bloomberg Terminal — problèmes de démarrage et de connexion
catégorie: Applications métier
service: Trading, Gestion d'Actifs, Stratégie Financière
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: Bloomberg nécessite une connexion filaire ou VPN actif — jamais sur Wi-Fi invités
---

# Bloomberg Terminal — problèmes de démarrage et de connexion

## Prérequis techniques
- Connexion réseau filaire recommandée (latence critique pour le trading)
- Ports sortants ouverts : TCP 443, TCP 8194, TCP 80
- Licence Bloomberg nominative active (contacter SF ou GA pour attribution)
- Windows 11 Pro — 64 bits obligatoire

## Problème 1 — Bloomberg ne se lance pas (écran noir ou erreur au démarrage)

1. Vérifier que le service Bloomberg tourne :
   ```
   services.msc → "Bloomberg" ou "biolpd"
   ```
   Si arrêté : démarrer manuellement.

2. Vérifier la connectivité réseau Bloomberg :
   ```cmd
   telnet bloomberg.com 443
   ```
   Si timeout → ouvrir un ticket réseau (ports bloqués par le firewall).

3. Réinstaller Bloomberg :
   - Télécharger depuis `https://bloomberg.com/anywhere/download`
   - Installer en tant qu'administrateur
   - Ne pas désinstaller l'ancienne version avant : le nouvel installeur gère la mise à jour

## Problème 2 — Erreur de licence « Not Authorized »

1. Vérifier que la licence est bien attribuée à ce poste :
   - Contacter le référent Bloomberg de la salle des marchés (ext. 4201)
   - Ou ouvrir un ticket Bloomberg : Help Desk +33 1 53 65 5000

2. Si le poste a changé (PDT remplacé) : la licence doit être réassignée via le portail Bloomberg BAP (Bloomberg Account Portal).

## Problème 3 — Données manquantes ou retardées

1. Vérifier la connexion réseau : `ping bdata.bloomberg.com`
2. Vérifier qu'aucun proxy d'entreprise ne filtre le flux Bloomberg
3. Si le problème persiste sur plusieurs postes simultanément → incident Bloomberg côté serveur
   Vérifier sur Bloomberg : `MSG <GO>` puis rechercher les alertes de service

## Problème 4 — Bloomberg Anywhere (accès distant)

Bloomberg Anywhere nécessite :
- Le client B-Unit (token physique ou application mobile)
- Une connexion VPN FinCorp active
- Les mêmes ports réseau que le terminal local

## Contact support Bloomberg
- **France** : +33 1 53 65 5000 (24h/24, 7j/7)
- **Portail** : bloomberg.com/support
- Toujours préciser le numéro de licence (visible dans Bloomberg : `BSUP <GO>`)
