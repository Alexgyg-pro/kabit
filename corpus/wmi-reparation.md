---
title: Réparation du WMI (Windows Management Instrumentation)
catégorie: Système d'exploitation
service: Tous services
équipes: Boutique IT
dernière_revision: 15/05/2026
statut: Publié
commentaire: Tenter la méthode légère en premier ; la reconstruction complète du dépôt est réservée aux cas bloquants
---

# Réparation du WMI (Windows Management Instrumentation)

Le WMI est le service Windows utilisé par de nombreux outils d'administration (SCCM, scripts PowerShell, monitoring). Sa corruption entraîne des dysfonctionnements variés difficiles à relier à une cause commune.

## Symptômes d'un WMI corrompu
- Erreurs PowerShell du type `HRESULT: 0x80041003` ou `Invalid namespace`
- Scripts ou outils d'administration qui échouent sans raison apparente
- SCCM / antivirus / monitoring ne remontent plus d'inventaire
- La commande `winmgmt /verifyrepository` retourne des erreurs
- Le service WMI (winmgmt) refuse de démarrer ou s'arrête immédiatement

---

## Méthode 1 — Réparation légère (ré-enregistrement des DLL + recompilation MOF)

À essayer en premier. Requiert une **invite de commande administrateur**.

### Étape 1 — Ré-enregistrer les DLL WMI

```cmd
cd C:\Windows\System32\wbem
for /f %s in ('dir /b /s *.dll') do regsvr32 /s %s
```

### Étape 2 — Arrêter le service WMI

```cmd
net stop /y winmgmt
```

### Étape 3 — Recompiler les fichiers MOF

```cmd
for /f %s in ('dir /b *.mof') do mofcomp %s
```

### Étape 4 — Redémarrer le service WMI

```cmd
net start winmgmt
```

### Étape 5 — Vérifier la réparation

```cmd
winmgmt /verifyrepository
```

Si le message est `WMI repository is consistent`, la réparation a réussi. Redémarrer le poste.

---

## Méthode 2 — Reconstruction complète du dépôt WMI

À utiliser si la méthode 1 échoue ou si `winmgmt /verifyrepository` continue de signaler des erreurs.

```cmd
net stop winmgmt
winmgmt /resetrepository
net start winmgmt
winmgmt /verifyrepository
```

> La reconstruction recrée le dépôt depuis zéro. Les personnalisations WMI (namespaces tiers, abonnements d'événements) sont perdues — généralement sans impact sur les postes utilisateurs standard.

Redémarrer le poste après l'opération.

---

## Procédure complémentaire — Réinitialisation des GPO

À combiner avec la réparation WMI quand des problèmes de stratégie de groupe accompagnent les symptômes (applications bloquées, paramètres de sécurité inattendus).

### Étape 1 — Renommer le dossier GroupPolicy

Le dossier est **caché** (`C:\Windows\System32\GroupPolicy`). Activer l'affichage des fichiers cachés dans l'Explorateur ou procéder en ligne de commande :

```cmd
rename C:\Windows\System32\GroupPolicy GroupPolicy.old
```

### Étape 2 — Forcer la mise à jour des stratégies

```cmd
gpupdate /force
```

### Étape 3 — Redémarrer le poste

Windows recrée un dossier `GroupPolicy` propre au redémarrage.

---

## Cas particulier — Accès microphone/caméra bloqué par GPO

Si les applications signalent un accès refusé au microphone ou à la caméra (souvent lié à une GPO trop restrictive) :

1. Ouvrir `regedit.exe` en tant qu'administrateur
2. Naviguer vers : `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\AppPrivacy`
3. Localiser la valeur `LetAppsAccessMicrophone` ou `LetAppsAccessCamera`
4. Modifier la valeur DWORD sur **`1`** (autoriser)
5. Redémarrer le poste

> Si la clé est gérée par GPO, elle sera réécrite au prochain `gpupdate`. Contacter l'équipe réseau pour modifier la GPO à la source.

## Quand escalader
- La réparation WMI échoue et `winmgmt /verifyrepository` reste en erreur → escalader à la Boutique IT
- Problèmes de GPO récurrents ou bloquants → contacter l'équipe réseau
- Poste SCCM qui ne remonte plus d'inventaire après réparation → ticket SCCM
