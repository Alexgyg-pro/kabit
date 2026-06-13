---
title: SAP S/4HANA — erreurs de connexion et accès refusé
catégorie: Applications métier
service: Stratégie Financière, Ressources Humaines, Direction Générale
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: Les droits SAP sont gérés par les référents métier — la Boutique IT ne peut pas les modifier directement
---

# SAP S/4HANA — erreurs de connexion et accès refusé

## Accès SAP chez FinCorp

- **URL Fiori Launchpad** : `https://sap.fincorp.local/fiori`
- **Connexion** : identifiants SAP distincts des identifiants Windows AD
- **Référent SAP** : équipe SI Finance (ext. 4150)
- **Administrateurs SAP** : Isabelle Marchand & Thomas Becker (Boutique IT)

## Problème 1 — Impossibilité de se connecter au Fiori Launchpad

1. Vérifier l'URL dans le navigateur (Chrome ou Edge recommandés — IE non supporté)
2. Vider le cache navigateur : Ctrl+Shift+Del > Cookies et données de site
3. Vérifier que le VPN est connecté si accès hors bureau
4. Tester avec un autre navigateur
5. Si message « Certificat non valide » → contacter la Boutique IT (certificat interne à installer)

## Problème 2 — Mot de passe SAP expiré

Le mot de passe SAP expire tous les **60 jours** (indépendamment du mot de passe AD).

Réinitialisation :
- Si encore connecté : `Profil > Modifier le mot de passe`
- Si accès perdu : contacter Thomas Becker (ext. 4155) ou Isabelle Marchand (ext. 4156)

## Problème 3 — Erreur « Vous ne disposez pas des autorisations nécessaires »

1. Ce message signifie que le profil SAP de l'utilisateur ne contient pas le rôle requis
2. Procédure :
   - L'utilisateur identifie la transaction ou le module concerné (ex : FB60, ME21N)
   - Son responsable adresse une demande d'accès par email à `si-finance@fincorp.com`
   - Délai de traitement : 24-48h ouvrées

**La Boutique IT ne peut pas attribuer de rôles SAP sans validation du responsable métier.**

## Problème 4 — SAP lent ou timeout

1. Vérifier la charge serveur : ticket à ouvrir auprès du SI Finance
2. Vérifier la connexion réseau de l'utilisateur (SAP est sensible à la latence)
3. Éviter les extractions volumineuses aux heures de pointe (9h-10h et 14h-15h)

## Problème 5 — Erreur lors d'une clôture comptable

Ne jamais tenter une correction manuelle en base de données.
Contacter immédiatement l'équipe SI Finance + le responsable Contrôle de Gestion.
