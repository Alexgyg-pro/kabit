---
title: Écran bleu (BSOD) Windows — diagnostic et résolution
catégorie: Système d'exploitation
service: Tous services
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: Toujours noter le code d'arrêt affiché avant de redémarrer
---

# Écran bleu (BSOD) Windows — diagnostic et résolution

## Symptômes
- Écran bleu avec message « Votre PC a rencontré un problème »
- Code d'arrêt visible (ex : KERNEL_SECURITY_CHECK_FAILURE, MEMORY_MANAGEMENT)
- Redémarrages aléatoires sans avertissement

## Codes d'arrêt les plus fréquents chez FinCorp

| Code d'arrêt                        | Cause probable           |
|-------------------------------------|--------------------------|
| MEMORY_MANAGEMENT                   | RAM défectueuse          |
| KERNEL_SECURITY_CHECK_FAILURE       | Pilote ou RAM            |
| IRQL_NOT_LESS_OR_EQUAL              | Pilote incompatible      |
| SYSTEM_THREAD_EXCEPTION_NOT_HANDLED | Pilote ou antivirus      |
| CRITICAL_PROCESS_DIED               | Fichiers système corrompus |
| WHEA_UNCORRECTABLE_ERROR            | Matériel (CPU/RAM)       |

## Procédure de diagnostic

### Étape 1 — Récupérer le fichier de vidage mémoire
```
C:\Windows\Minidump\  (fichiers .dmp)
```
Ouvrir avec **WinDbg** ou envoyer à la Boutique IT pour analyse.

### Étape 2 — Vérifier les pilotes récemment installés
```powershell
Get-WinEvent -LogName System | Where-Object {$_.Id -eq 7045} | Select-Object -Last 10
```
Identifier tout pilote installé dans les 48h précédant le premier BSOD.

### Étape 3 — Vérifier la RAM
```cmd
mdsched.exe
```
Sélectionner **Redémarrer maintenant et rechercher les problèmes**.
Si erreurs détectées → remplacer le barrette défectueuse (contacter Boutique IT).

### Étape 4 — Réparer les fichiers système
```cmd
sfc /scannow
DISM /Online /Cleanup-Image /RestoreHealth
```

### Étape 5 — Pilotes GPU/réseau
Désinstaller et réinstaller les pilotes :
- GPU : via Device Manager ou site fabricant (Intel/NVIDIA)
- Réseau : pilote Ethernet ou Wi-Fi

### Étape 6 — Vérifier l'antivirus
Les BSOD peuvent être causés par un conflit entre CrowdStrike Falcon et une mise à jour Windows.
Contacter l'équipe Sécurité IT avant de désactiver l'agent.

## Quand escalader
- BSOD récurrents (plus de 2 en 48h)
- Code WHEA_UNCORRECTABLE_ERROR → probable défaillance matérielle → échange PDT
- Impossible de démarrer Windows normalement
