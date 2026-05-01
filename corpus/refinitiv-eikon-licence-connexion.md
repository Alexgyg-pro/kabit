---
title: Refinitiv Eikon (LSEG) — problèmes de licence et de connexion
catégorie: Applications métier
service: Trading, Stratégie Financière
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: Refinitiv Eikon est la solution secondaire — Bloomberg reste prioritaire pour le trading actif
---

# Refinitiv Eikon (LSEG) — problèmes de licence et de connexion

## Prérequis
- Licence Refinitiv nominative attribuée (20 licences disponibles — contacter SF ou Trading pour attribution)
- Connexion réseau filaire ou VPN actif
- Ports ouverts : TCP 443, TCP 8080, TCP 9000-9002

## Problème 1 — Erreur « Invalid credentials » ou « Licence not found »

1. Vérifier les identifiants Refinitiv (distincts des identifiants Windows) :
   - Format : adresse email professionnelle `prenom.nom@fincorp.com`
   - Mot de passe Refinitiv géré sur `https://my.refinitiv.com`

2. Si le compte est verrouillé (3 tentatives) :
   - Déblocage via `https://my.refinitiv.com > Account > Unlock`
   - Ou contacter le Support Refinitiv : +44 20 7542 8015

3. Vérifier que la licence est active :
   - Le référent Eikon chez FinCorp (ext. 4210 — Bureau SF) peut vérifier le tableau des licences

## Problème 2 — Eikon se lance mais pas de données

1. Vérifier la connectivité :
   ```cmd
   telnet eikon.thomsonreuters.com 443
   ```
2. Vérifier qu'aucun proxy d'entreprise ne filtre le flux Eikon
3. Réinitialiser le cache Eikon :
   ```
   %appdata%\Thomson Reuters\Eikon\
   Supprimer le dossier Cache
   ```
4. Redémarrer Eikon

## Problème 3 — Eikon ne se lance pas (erreur au démarrage)

1. Vérifier le service Eikon :
   ```
   services.msc → "Eikon" ou "ThomsonReuters.Desktop.Service"
   ```
2. Réinstaller Eikon :
   - Télécharger depuis `https://eikon.thomsonreuters.com/index.html`
   - Installer en tant qu'administrateur

## Problème 4 — Conflit Bloomberg + Eikon simultanément

Il est possible d'utiliser Bloomberg Terminal et Eikon en parallèle.
Si conflit réseau détecté : utiliser des profils réseau différents via le gestionnaire de connexions Windows.

## Contact support Refinitiv
- Téléphone : +44 20 7542 8015
- Portail : `https://my.refinitiv.com/content/mytr/en/signin.html`
- Horaires : 24h/24 pour les clients trading
