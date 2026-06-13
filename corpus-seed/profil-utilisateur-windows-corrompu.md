---
title: Profil utilisateur Windows corrompu — récupération et reconstruction
catégorie: Système d'exploitation
service: Tous services
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: Ne pas supprimer l'ancien profil avant d'avoir récupéré les données locales
---

# Profil utilisateur Windows corrompu — récupération et reconstruction

## Symptômes
- Connexion avec un profil temporaire (bureau vide, « Vous êtes connecté avec un profil temporaire »)
- Erreur au démarrage de session : « Le service des profils utilisateur n'a pas pu ouvrir une session »
- Paramètres, applications ou favoris disparus

## Causes fréquentes
- Coupure brutale pendant une mise à jour
- Disque saturé lors d'une écriture dans le profil
- Corruption du fichier `NTUSER.DAT`

## Procédure de récupération

### Étape 1 — Récupérer les données du profil corrompu
Se connecter avec un compte admin local (Boutique IT) :
- Les données se trouvent dans `C:\Users\[login corrompu]\`
- Copier Documents, Bureau, Téléchargements, Favoris vers un partage réseau ou clé USB

### Étape 2 — Créer un nouveau profil
1. Supprimer ou renommer l'entrée dans le registre :
   ```
   regedit > HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\ProfileList
   ```
   Trouver la clé correspondant au SID de l'utilisateur (valeur `ProfileImagePath` = chemin du profil)
   Renommer la clé en ajoutant `.old`

2. Redémarrer le PC et se connecter avec le compte utilisateur
   → Windows crée automatiquement un nouveau profil propre

### Étape 3 — Restaurer les données
Copier depuis la sauvegarde vers le nouveau profil `C:\Users\[login]\`

### Étape 4 — Vérifier les applications
Certaines applications stockent leurs données dans `AppData` — à vérifier selon les besoins :
- Outlook : `AppData\Local\Microsoft\Outlook\` (fichiers .ost à recréer via resynchronisation)
- Chrome : `AppData\Local\Google\Chrome\User Data\` (sync cloud si compte Google configuré)

## Si la corruption est récurrente
- Vérifier l'état du disque : `chkdsk C: /f /r` (au redémarrage)
- Si SSD défaillant → remplacement du laptop
- Si problème de droits sur le dossier profil → Boutique IT corrige les permissions NTFS
