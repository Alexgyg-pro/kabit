---
title: Périphérique USB non reconnu
catégorie: Matériel
service: Tous services
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: Les clés USB personnelles sont bloquées par politique de sécurité — seules les clés FinCorp approuvées sont autorisées
---

# Périphérique USB non reconnu

## Symptômes
- Notification « Périphérique USB non reconnu »
- Le périphérique apparaît avec un point d'exclamation jaune dans le Gestionnaire de périphériques
- Aucune réaction au branchement

## Politique FinCorp — Clés USB
Les clés USB personnelles sont **bloquées par CrowdStrike et Intune** (politique de sécurité).
Seules les clés USB chiffrées approuvées (référence : Kingston IronKey D500S) sont autorisées.
Pour obtenir une clé approuvée : ouvrir une demande auprès de la Boutique IT.

## Procédure de diagnostic (périphériques autorisés)

### Étape 1 — Changer de port USB
- Tester sur un port USB directement sur le PC (pas sur un hub ou un écran)
- Préférer les ports USB-A 3.0 (bleus) aux ports USB 2.0

### Étape 2 — Vider les condensateurs USB
1. Débrancher tous les périphériques USB
2. Éteindre le PC, débrancher l'alimentation
3. Maintenir Power 15 secondes
4. Rebrancher et tester

### Étape 3 — Réinitialiser les contrôleurs USB
```
Gestionnaire de périphériques > Contrôleurs de bus USB
Clic droit sur chaque "Concentrateur racine USB" > Désinstaller l'appareil
Redémarrer — Windows réinstalle les contrôleurs automatiquement
```

### Étape 4 — Vérifier dans le journal d'événements
```
Observateur d'événements > Système > Filtrer : ID 43 (USB)
```
Le message d'erreur précise si c'est un problème d'alimentation, de pilote ou de matériel.

### Étape 5 — Désactiver la gestion d'alimentation USB
```
Panneau de configuration > Options d'alimentation > Modifier les paramètres du mode > Modifier les paramètres d'alimentation avancés
USB > Paramètre de suspension sélective USB > Désactivé
```

## Cas particulier — Disque dur externe non détecté
```
Gestion des disques (diskmgmt.msc)
```
Si le disque apparaît mais sans lettre de lecteur : clic droit > Modifier la lettre de lecteur.
Si non initialisé : initialiser en MBR ou GPT selon l'usage.
