---
title: Teams — boucle de connexion ou erreur d'authentification
catégorie: Messagerie & Collaboration
service: Tous services
équipes: Boutique IT
dernière_revision: 04/05/2026
statut: Publié
commentaire: Vider le cache Teams résout la majorité des boucles d'authentification
---

# Teams — boucle de connexion ou erreur d'authentification

## Symptômes
- Teams demande les identifiants en boucle sans jamais se connecter
- Message "Quelque chose s'est mal passé" à la connexion
- Teams redirige vers la page de connexion après avoir saisi le mot de passe
- Code d'erreur CAA20004, CAA82EE2, ou similaire

## Étape 1 — Vider le cache Teams

**Teams classique :**
```
%appdata%\Microsoft\Teams\
```
Fermer Teams complètement (clic droit barre des tâches > Quitter), supprimer le **contenu** du dossier (pas le dossier lui-même), relancer.

**Teams 2.0 (nouvelle version) :**
```
%localappdata%\Packages\MSTeams_8wekyb3d8bbwe\LocalCache\Microsoft\MSTeams\
```

## Étape 2 — Déconnecter et reconnecter le compte

Dans Teams : cliquer sur l'avatar > **Se déconnecter**  
Relancer Teams et se reconnecter avec `prenom.nom@fincorp.com`

## Étape 3 — Supprimer les identifiants en cache Windows

Gestionnaire des identifiants > **Identifiants Windows**  
Supprimer toutes les entrées contenant "msteams", "microsoft", "office365"  
Relancer Teams.

## Étape 4 — Vérifier le statut du compte

1. Vérifier que le mot de passe AD n'est pas expiré (essayer de se connecter sur `https://portal.office.com`)
2. Si le compte est bloqué : voir fiche *reinitialisation-mot-de-passe-ad*
3. Vérifier la licence Microsoft 365 : `https://portal.office.com` > Mon compte > Licences

## Étape 5 — Utiliser Teams Web en attendant

`https://teams.microsoft.com` — version navigateur, contourne les problèmes du client lourd.

## Escalade N2
Si l'erreur concerne le MFA ou l'accès conditionnel : escalader à l'équipe Sécurité/Identity avec le code d'erreur exact.
