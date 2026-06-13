---
title: Panneau de configuration — outils essentiels pour le support N1
catégorie: Système d'exploitation
service: Tous services
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: Le Panneau de configuration reste plus complet que les Paramètres Windows pour le support avancé
---

# Panneau de configuration — outils essentiels

## Accès rapide

```
Win + R > control
```
Ou : Recherche Windows > "Panneau de configuration"

Afficher en mode **Petites icônes** pour voir tous les outils d'un coup.

## Outils les plus utilisés en support

### Programmes et fonctionnalités
```
control > Programmes > Programmes et fonctionnalités
```
- Désinstaller une application
- Réparer une installation (bouton Modifier sur certaines apps)
- Voir les mises à jour installées (lien à gauche)

### Options d'alimentation
```
control > Options d'alimentation
```
- Changer le comportement du bouton Power (fermer le capot = veille ou arrêt)
- Modifier les délais de mise en veille de l'écran
- Créer un mode d'alimentation personnalisé

### Région
```
control > Région
```
- Format de date et d'heure (critique pour SAP et certains exports Excel)
- Séparateur décimal : virgule (France) vs point (UK/US)
- Utile quand un utilisateur a des anomalies dans ses fichiers Excel

### Comptes d'utilisateurs
```
control > Comptes d'utilisateurs
```
- Voir le type de compte (Administrateur ou Utilisateur standard)
- Gérer les informations d'identification Windows (mots de passe mémorisés)

### Centre de réseau et partage
```
control > Centre de réseau et partage
```
- Voir l'état de la connexion réseau active
- Modifier les paramètres de la carte réseau
- Diagnostiquer une connexion réseau

### Infos système importantes
```
Win + Pause (ou control > Système)
```
Affiche :
- Édition Windows (10 ou 11, 32 ou 64 bits)
- RAM installée
- Nom du PC et du domaine
- Processeur

### Outils d'administration
```
control > Outils Windows (ou Outils d'administration)
```
Accès direct à : Services, Observateur d'événements, Gestion des disques, Planificateur de tâches.

## Commandes Exécuter (Win+R) utiles

| Commande        | Outil ouvert                        |
|-----------------|-------------------------------------|
| `msconfig`      | Configuration du système (démarrage)|
| `services.msc`  | Gestionnaire des services           |
| `devmgmt.msc`   | Gestionnaire de périphériques       |
| `diskmgmt.msc`  | Gestion des disques                 |
| `eventvwr`      | Observateur d'événements            |
| `ncpa.cpl`      | Connexions réseau                   |
| `appwiz.cpl`    | Programmes et fonctionnalités       |
| `certmgr.msc`   | Certificats utilisateur             |
| `regedit`       | Éditeur du registre (avec précaution)|
| `cleanmgr`      | Nettoyage de disque                 |
| `mstsc`         | Bureau à distance (RDP)             |
| `osk`           | Clavier visuel                      |
