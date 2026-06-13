---
title: Application métier en erreur après mise à jour Windows
catégorie: Applications métier
service: Tous services
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: Ne pas désinstaller la mise à jour Windows sans validation de l'équipe N2 et du responsable métier
---

# Application métier en erreur après mise à jour Windows

## Contexte
Certaines mises à jour Windows peuvent casser la compatibilité avec des applications métier (SAP, Bloomberg, logiciels tiers). Ce problème est plus fréquent avec les mises à jour cumulatives (KB) qui modifient le runtime .NET ou les bibliothèques Visual C++.

## Diagnostic rapide

### Identifier la mise à jour responsable
```powershell
Get-HotFix | Sort-Object -Property InstalledOn -Descending | Select-Object -First 5
```
Noter les KB installées récemment (dans les 24-48h précédant l'incident).

### Vérifier les logs d'événements
```
Observateur d'événements > Journaux Windows > Application
Filtrer par : Erreur, date du premier incident
```
Noter le nom de l'application et le code d'erreur.

## Procédure de résolution

### Étape 1 — Réparer l'installation de l'application
```
Panneau de configuration > Programmes > [Application] > Modifier > Réparer
```
Pour les apps Microsoft Store :
```powershell
Get-AppxPackage [NomApp] | Reset-AppxPackage
```

### Étape 2 — Réinstaller les runtimes
Télécharger depuis `\\fincorp-deploy\runtimes\` :
- `vc_redist.x64.exe` (Visual C++ 2015-2022)
- `.NET Desktop Runtime` (version requise selon l'app)
- `DirectX End-User Runtime`

### Étape 3 — Mode de compatibilité (temporaire)
Clic droit sur l'exe > Propriétés > Compatibilité > Exécuter en mode de compatibilité pour Windows 10.

### Étape 4 — Désinstallation de la mise à jour Windows (validation requise)
**Ne faire que si validé par le N2 ET le responsable métier.**
```
Paramètres > Windows Update > Afficher l'historique > Désinstaller les mises à jour
```
Sélectionner la KB identifiée. Signaler immédiatement à l'équipe Intune pour bloquer cette KB sur le parc.

## Cas spécifiques
- **SAP GUI** : souvent impacté par les mises à jour .NET — télécharger la dernière version SAP GUI sur `\\fincorp-deploy\sap\`
- **Bloomberg** : utilise son propre runtime — voir fiche Bloomberg Terminal
- **Adobe Acrobat** : mettre à jour via Adobe Creative Cloud si en erreur
