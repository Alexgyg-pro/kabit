---
title: Date et heure incorrectes — impact et correction
catégorie: Système d'exploitation
service: Tous services
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: Une heure incorrecte casse l'authentification Kerberos (AD) et les certificats SSL — à traiter en urgence
---

# Date et heure incorrectes — impact et correction

## Pourquoi c'est critique
Une heure décalée de plus de **5 minutes** par rapport au serveur AD provoque :
- Échec d'authentification au domaine Windows
- Erreurs de certificats SSL (sites en HTTPS inatteignables)
- Échec de connexion VPN (certificat "pas encore valide")
- Problèmes de synchronisation SAP et Bloomberg

## Correction rapide

### Sur un poste joint au domaine
L'heure se synchronise automatiquement avec le contrôleur de domaine. Forcer la synchro :
```cmd
w32tm /resync /force
```
Si erreur "L'ordinateur ne s'est pas resynchronisé" : vérifier la connexion réseau/VPN d'abord.

### Sur un poste hors réseau (télétravail sans VPN)
```
Paramètres > Heure et langue > Date et heure
Activer "Définir l'heure automatiquement" et "Définir le fuseau horaire automatiquement"
Cliquer "Synchroniser maintenant"
```
Le poste synchronisera avec `time.windows.com` (serveur Microsoft public).

### Correction manuelle (dernier recours)
```
Paramètres > Heure et langue > Date et heure
Désactiver "Définir l'heure automatiquement"
Cliquer "Modifier" > saisir la date et l'heure correctes
Réactiver la synchronisation automatique
```

## Cause fréquente : pile CMOS déchargée

Sur les postes de plus de 3-4 ans, la pile bouton CMOS (CR2032, sur la carte mère) peut se décharger.
Symptôme : l'heure revient à une date ancienne (2000, 2010) à chaque démarrage.
Solution : remplacer la pile CMOS → escalade N2 pour intervention matérielle.

## Fuseaux horaires — cas particuliers

Pour les collaborateurs en déplacement à l'étranger :
```
Paramètres > Heure et langue > Date et heure > Fuseau horaire
```
Changer temporairement le fuseau (ex : Europe/Paris → America/New_York).
Penser à le remettre au retour.

Les applications FinCorp utilisent l'heure UTC en base de données — l'affichage s'adapte au fuseau local.
