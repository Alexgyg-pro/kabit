---
title: Outlook — profil corrompu ou inutilisable
catégorie: Messagerie & Collaboration
service: Tous services
équipes: Boutique IT
dernière_revision: 04/05/2026
statut: Publié
commentaire: La suppression du profil ne supprime pas les emails — ils sont sur Exchange
---

# Outlook — profil corrompu ou inutilisable

## Symptômes
- Outlook demande les identifiants en boucle
- Erreur "Impossible de démarrer Microsoft Outlook. Impossible d'ouvrir la fenêtre Outlook"
- Le profil n'apparaît plus dans les paramètres de messagerie
- Outlook démarre sur un profil vide sans aucun compte configuré

## Étape 1 — Accéder au gestionnaire de profils

```
Panneau de configuration > Courrier (Microsoft Outlook) > Afficher les profils
```
Si le Panneau de configuration n'affiche pas "Courrier" : chercher directement "mlcfg32.cpl" dans l'explorateur.

## Étape 2 — Tenter une réparation

Sélectionner le profil existant > **Réparer**  
Suivre l'assistant de réparation avec les identifiants Exchange du collaborateur.

## Étape 3 — Créer un nouveau profil

1. Dans le gestionnaire de profils : **Ajouter**
2. Nommer le nouveau profil (ex. : `prenom.nom_nouveau`)
3. Renseigner l'adresse email professionnelle — la configuration Exchange se fait automatiquement sur le réseau FinCorp
4. Sélectionner **"Toujours utiliser ce profil"** et pointer sur le nouveau profil
5. Relancer Outlook — la synchronisation Exchange redémarre

**Note :** Aucun email n'est perdu. Tout est stocké sur Exchange Online.

## Étape 4 — Supprimer l'ancien profil corrompu

Une fois le nouveau profil fonctionnel, retourner dans le gestionnaire de profils et supprimer l'ancien.

## Escalade N2
Si la création du nouveau profil échoue avec une erreur d'authentification : vérifier le statut du compte dans Active Directory (compte bloqué ou expiré).
