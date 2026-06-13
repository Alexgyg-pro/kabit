---
title: Réfonte du profil Windows utilisateur
catégorie: Système d'exploitation
service: Tous services
équipes: Boutique IT
dernière_revision: 15/05/2026
statut: Publié
commentaire: Toujours renommer le dossier avant de supprimer la clé registre — permet de récupérer les données de l'ancien profil
---

# Réfonte du profil Windows utilisateur

Procédure à appliquer quand le profil d'un utilisateur est corrompu et qu'une réinitialisation complète est nécessaire. Windows recréera un profil propre à la prochaine connexion.

## Symptômes typiques d'un profil corrompu
- Message "Vous avez été connecté avec un profil temporaire" à l'ouverture de session
- Bureau vide ou différent de l'habituel au démarrage
- Paramètres, raccourcis et fichiers du bureau disparus
- Erreurs répétées au démarrage des applications de l'utilisateur

## Prérequis
- Être connecté avec un compte **administrateur local** (pas le compte de l'utilisateur concerné)
- L'utilisateur doit être **déconnecté** de la session

---

## Méthode 1 — PowerShell (recommandée)

### Étape 1 — Identifier le profil à supprimer

```powershell
Get-ChildItem -Path "HKLM:\Software\Microsoft\Windows NT\CurrentVersion\ProfileList" |
  Get-ItemProperty -Name ProfileImagePath |
  Select-Object ProfileImagePath, PSChildName
```

Repérer la ligne correspondant au compte de l'utilisateur (ex : `C:\Users\moisan_c`). Noter le **PSChildName** (SID du profil, ex : `S-1-5-21-2997242644-1048803884-2836527085-13092`).

### Étape 2 — Renommer le dossier du profil

```powershell
Rename-Item -Path "C:\Users\moisan_c" -NewName "moisan_c.old"
```

> Le dossier `.old` servira à récupérer les données personnelles de l'utilisateur si besoin (Documents, Bureau, etc.).

### Étape 3 — Supprimer la clé de registre du profil

Remplacer le SID par celui noté à l'étape 1 :

```powershell
Remove-Item -Path "HKLM:\Software\Microsoft\Windows NT\CurrentVersion\ProfileList\S-1-5-21-2997242644-1048803884-2836527085-13092" -Recurse
```

### Étape 4 — Redémarrer et reconnecter l'utilisateur

Redémarrer le poste. À la prochaine connexion de l'utilisateur, Windows crée automatiquement un profil neuf.

---

## Méthode 2 — Manuelle via l'interface graphique

### Étape 1 — Renommer le dossier du profil via l'Explorateur

1. Ouvrir l'Explorateur en tant qu'administrateur
2. Naviguer vers `C:\Users\`
3. Renommer le dossier de l'utilisateur (ex : `moisan_c` → `moisan_c.old`)

### Étape 2 — Supprimer le profil via le Panneau de configuration

1. Ouvrir **Panneau de configuration → Système → Paramètres système avancés**
2. Onglet **Paramètres avancés** → section **Profils d'utilisateurs** → cliquer **Paramètres...**
3. Sélectionner le profil de l'utilisateur dans la liste
4. Cliquer **Supprimer**

> Si le profil n'apparaît pas dans la liste (profil temporaire déjà détaché), passer directement à l'étape 3.

### Étape 3 — Supprimer la clé de registre via regedit

1. Ouvrir `regedit.exe` en tant qu'administrateur
2. Naviguer vers : `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\ProfileList`
3. Chercher la sous-clé dont la valeur `ProfileImagePath` correspond au compte (ex : `C:\Users\moisan_c`)
4. Faire un clic droit sur la sous-clé → **Supprimer**

### Étape 4 — Redémarrer et reconnecter l'utilisateur

Redémarrer le poste. Windows recrée le profil à la prochaine connexion.

---

## Récupération des données de l'ancien profil

Après que l'utilisateur s'est reconnecté et dispose d'un profil neuf, copier les données depuis le dossier `.old` :

```powershell
Copy-Item -Path "C:\Users\moisan_c.old\Documents\*" -Destination "C:\Users\moisan_c\Documents\" -Recurse
Copy-Item -Path "C:\Users\moisan_c.old\Desktop\*"   -Destination "C:\Users\moisan_c\Desktop\"   -Recurse
Copy-Item -Path "C:\Users\moisan_c.old\Downloads\*" -Destination "C:\Users\moisan_c\Downloads\" -Recurse
```

Supprimer le dossier `.old` une fois les données récupérées et validées par l'utilisateur.

## Quand escalader
- Le poste ne démarre plus normalement après l'opération → escalader à la Boutique IT
- Le profil se recorrompt immédiatement après la réfonte → suspicion de problème disque ou de GPO → escalader
- Données critiques dans l'ancien profil qui nécessitent une récupération approfondie
