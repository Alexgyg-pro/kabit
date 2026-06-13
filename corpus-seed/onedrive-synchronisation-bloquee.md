---
title: OneDrive — synchronisation bloquée ou en erreur
catégorie: Stockage & Sauvegarde
service: Tous services
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: OneDrive est le seul stockage cloud autorisé — Dropbox, Google Drive et WeTransfer sont bloqués par le proxy
---

# OneDrive — synchronisation bloquée ou en erreur

## Symptômes
- Icône OneDrive avec croix rouge dans la barre des tâches
- Fichiers avec icône de nuage barré
- Erreur « Impossible de synchroniser »

## Vérifications préalables

Cliquer sur l'icône OneDrive > **Afficher la synchronisation** pour voir les erreurs détaillées.

## Problème 1 — Erreur « Vous n'êtes pas connecté »

1. Clic droit icône OneDrive > Paramètres > Compte > **Se connecter**
2. Se connecter avec `prenom.nom@fincorp.com`
3. Si erreur d'authentification : vérifier le MFA (voir fiche MFA)

## Problème 2 — Fichier bloqué (en cours d'utilisation)

Un fichier ouvert dans une application ne peut pas être synchronisé.
Fermer le fichier concerné → synchronisation reprend automatiquement.

Forcer la libération si l'application plante :
```cmd
handle.exe [nom_du_fichier]   (Sysinternals)
```

## Problème 3 — Quota OneDrive dépassé

Quota standard : **1 To** par utilisateur (Microsoft 365 E3).
Vérifier : `https://fincorp-my.sharepoint.com` > Espace de stockage (en haut à droite)

Si dépassement :
1. Vider la corbeille OneDrive
2. Supprimer les anciennes versions de fichiers :
   - Fichier > Historique des versions > Supprimer toutes les versions
3. Demande d'augmentation : `it-support@fincorp.com`

## Problème 4 — Chemin de fichier trop long

Windows limite les chemins à 260 caractères par défaut. OneDrive ajoute le chemin complet.
Solution : activer les chemins longs :
```
regedit > HKLM\SYSTEM\CurrentControlSet\Control\FileSystem
LongPathsEnabled = 1
```
Ou renommer les dossiers avec des noms plus courts.

## Problème 5 — Réinitialisation complète de OneDrive

En dernier recours :
```cmd
%localappdata%\Microsoft\OneDrive\onedrive.exe /reset
```
Attendre 2 minutes, relancer OneDrive depuis le menu Démarrer.
La resynchronisation peut prendre plusieurs heures selon le volume.
