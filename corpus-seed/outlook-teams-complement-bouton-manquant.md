---
title: Outlook/Teams — bouton "Nouvelle réunion Teams" absent dans Outlook
catégorie: Messagerie & Collaboration
service: Tous services
équipes: Boutique IT
dernière_revision: 04/05/2026
statut: Publié
commentaire: C'est le complément "Microsoft Teams Meeting Add-in" qui génère ce bouton — il peut disparaître après une mise à jour Office ou Teams
---

# Outlook/Teams — bouton "Nouvelle réunion Teams" absent dans Outlook

## Symptômes
- Le bouton "Nouvelle réunion Teams" a disparu du ruban du calendrier Outlook
- Le ruban affiche "Réunion Skype" à la place (ancien complément)
- Le bouton est présent mais grisé et inutilisable
- Les réunions créées depuis Outlook n'incluent pas de lien Teams

## Comprendre le mécanisme

Ce bouton est fourni par le **complément COM "Microsoft Teams Meeting Add-in for Microsoft Office"**.  
Il s'installe automatiquement avec Teams et se synchronise avec Outlook.  
Il peut disparaître après une mise à jour d'Office, de Teams, ou si Teams n'est pas démarré.

## Étape 1 — Démarrer Teams avant Outlook

Le complément nécessite que Teams soit démarré pour s'activer.  
1. Quitter Outlook complètement
2. Lancer Teams et attendre qu'il soit connecté
3. Relancer Outlook
4. Vérifier le ruban Calendrier

## Étape 2 — Vérifier que le complément est activé

Dans Outlook : **Fichier > Options > Compléments > Gérer : Compléments COM**  
Chercher **"Microsoft Teams Meeting Add-in for Microsoft Office"**

- **Présent et coché** → relancer Outlook et Teams
- **Présent mais décoché** → cocher et valider
- **Absent de la liste** → voir Étape 3
- **Dans "Compléments désactivés"** → voir Étape 4

## Étape 3 — Réinstaller le complément manuellement

Le fichier du complément est installé par Teams. Si absent :
1. Fermer Outlook et Teams
2. Désinstaller Teams (Panneau de configuration > Programmes)
3. Réinstaller Teams depuis `https://teams.microsoft.com/downloads`
4. Lancer Teams en premier, puis Outlook

Si Teams 2.0 est utilisé (application MSIX) :
```
%localappdata%\Microsoft\TeamsMeetingAddin\
```
Vérifier que ce dossier existe. S'il est vide : réinstaller Teams.

## Étape 4 — Réactiver un complément désactivé par Outlook

Outlook désactive automatiquement les compléments qui ralentissent son démarrage.  
Fichier > Options > Compléments > **Gérer : Éléments désactivés** > Aller  
Si le complément Teams y figure : le sélectionner > **Activer**

## Étape 5 — Vérification via le registre (avancé)

Le complément doit être enregistré dans :
```
HKCU\Software\Microsoft\Office\Outlook\Addins\TeamsAddin.FastConnect
```
Si la clé est absente : la réinstallation de Teams la recréera automatiquement.

## Escalade N2
Si le problème persiste après réinstallation de Teams sur un poste géré par Intune : vérifier qu'aucune stratégie de groupe ne bloque les compléments COM dans Outlook.
