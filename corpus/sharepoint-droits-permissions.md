---
title: SharePoint — problèmes de droits d'accès et de partage
catégorie: Messagerie & Collaboration
service: Tous services
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: Les propriétaires de site SharePoint peuvent gérer eux-mêmes les accès — la Boutique IT intervient uniquement sur les sites racines
---

# SharePoint — problèmes de droits d'accès et de partage

## Architecture SharePoint FinCorp

| Site                              | URL                                      | Propriétaires         |
|-----------------------------------|------------------------------------------|-----------------------|
| Intranet FinCorp                  | fincorp.sharepoint.com/sites/intranet    | Communication, IT     |
| Finance & Reporting               | fincorp.sharepoint.com/sites/finance     | Équipe SF             |
| RH & Formations                  | fincorp.sharepoint.com/sites/rh          | Équipe RH             |
| Projets IT                        | fincorp.sharepoint.com/sites/it-projets  | Boutique IT           |
| Salle des marchés (accès restreint)| fincorp.sharepoint.com/sites/trading    | Responsable Trading   |

## Problème 1 — Accès refusé à un site ou un document

1. Vérifier si l'utilisateur a reçu une invitation (vérifier les spams)
2. Contacter le **propriétaire du site** (pas la Boutique IT en premier lieu) :
   - Sur la page du site : clic sur la roue dentée > **Autorisations du site**
   - Le propriétaire peut ajouter directement via **Inviter des personnes**
3. Si propriétaire inconnu : Boutique IT peut identifier le propriétaire via le portail M365 Admin

## Problème 2 — Partage externe bloqué

Le partage externe est **désactivé par défaut** sur tous les sites FinCorp sauf exceptions validées par la DSI.

Pour partager avec un prestataire externe :
1. Le responsable du projet envoie une demande à `it-support@fincorp.com`
2. Justification métier requise
3. Activation limitée dans le temps (max 90 jours)
4. Le lien de partage sera en **lecture seule** avec expiration

## Problème 3 — Documents en lecture seule impossible à modifier

- Vérifier qu'un autre utilisateur n'a pas le fichier ouvert (icône verte dans SharePoint)
- Ouvrir dans l'application desktop (pas le navigateur) pour co-édition
- Si verrou persistant : Boutique IT peut forcer la libération du verrou

## Problème 4 — Synchronisation OneDrive SharePoint bloquée

```
OneDrive > Paramètres > Compte > Choisir les dossiers
```
Vérifier que le dossier SharePoint est bien sélectionné pour la synchronisation.
Voir aussi la fiche **OneDrive — synchronisation bloquée**.
