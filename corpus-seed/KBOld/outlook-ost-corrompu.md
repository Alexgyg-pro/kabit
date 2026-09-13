---
title: Outlook — fichier OST corrompu, réparation et reconstruction
catégorie: Messagerie & Collaboration
service: Tous services
équipes: Boutique IT
dernière_revision: 04/05/2026
statut: Publié
commentaire: Supprimer l'OST ne supprime pas les emails — tout est sur Exchange Online
---

# Outlook — fichier OST corrompu, réparation et reconstruction

## Symptômes
- Outlook plante systématiquement à l'ouverture d'un dossier spécifique
- Erreur "Le fichier de données Outlook n'est pas accessible"
- Dossiers manquants ou en doublon dans Outlook
- Emails présents dans OWA mais absents dans le client Outlook

## Comprendre le fichier OST

Le fichier `.ost` est le **cache local** de la boîte Exchange. Il permet de travailler hors ligne.  
Le supprimer force Outlook à le recréer depuis Exchange — **aucun email n'est perdu**.

## Étape 1 — Utiliser l'outil de réparation ScanOST (via SCANPST)

```
C:\Program Files (x86)\Microsoft Office\root\Office16\SCANPST.EXE
```
1. Fermer Outlook complètement
2. Lancer SCANPST.EXE
3. Naviguer vers le fichier `.ost` :
   ```
   %localappdata%\Microsoft\Outlook\
   ```
4. Cliquer **Démarrer** — l'analyse peut prendre 15 à 30 minutes
5. Si des erreurs sont trouvées : cocher "Créer une sauvegarde" puis **Réparer**

## Étape 2 — Supprimer et reconstruire l'OST

Si la réparation échoue :
1. Fermer Outlook
2. Naviguer vers `%localappdata%\Microsoft\Outlook\`
3. Renommer le fichier `.ost` en `.ost.bak`
4. Relancer Outlook — un nouvel OST est créé et la synchronisation Exchange redémarre
5. Attendre la synchronisation complète avant utilisation

## Étape 3 — Vérifier l'intégrité après reconstruction

- Comparer le nombre de dossiers avec OWA
- Vérifier les dossiers Envoyés, Boîte de réception, Éléments supprimés

## Escalade N2
Si l'OST ne peut pas être créé (erreur de droits) : vérifier les permissions sur le répertoire `%localappdata%\Microsoft\Outlook\`.
