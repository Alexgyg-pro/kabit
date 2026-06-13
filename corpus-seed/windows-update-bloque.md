---
title: Mise à jour Windows bloquée ou en échec
catégorie: Système d'exploitation
service: Tous services
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: Les mises à jour sont déployées via Intune — ne jamais forcer une mise à jour manuellement sur un poste de trader
---

# Mise à jour Windows bloquée ou en échec

## Contexte FinCorp
Les mises à jour Windows sont gérées centralement via **Microsoft Intune**.
Les postes reçoivent les mises à jour approuvées automatiquement le **mardi soir** (Patch Tuesday +7 jours).
Les postes de la salle des marchés (Trading) ont une fenêtre de maintenance décalée : **vendredi 22h-2h**.

## Symptômes
- Windows Update bloqué sur un pourcentage depuis plus de 2h
- Erreur de mise à jour avec code (ex : 0x80070002, 0x8024401C)
- Le PC redémarre en boucle après une mise à jour

## Codes d'erreur fréquents

| Code          | Signification                     | Solution rapide              |
|---------------|-----------------------------------|------------------------------|
| 0x80070002    | Fichiers manquants                | SFC + DISM                   |
| 0x8024401C    | Connexion au serveur de maj       | Vérifier VPN / proxy         |
| 0x80240034    | Mise à jour non applicable        | Ignorer, déjà installée      |
| 0xC1900101    | Incompatibilité pilote            | Mettre à jour les pilotes    |

## Procédure de déblocage

### Étape 1 — Réinitialiser les composants Windows Update
```cmd
net stop wuauserv
net stop cryptSvc
net stop bits
net stop msiserver
ren C:\Windows\SoftwareDistribution SoftwareDistribution.old
ren C:\Windows\System32\catroot2 catroot2.old
net start wuauserv
net start cryptSvc
net start bits
net start msiserver
```

### Étape 2 — Réparer les fichiers système
```cmd
sfc /scannow
DISM /Online /Cleanup-Image /RestoreHealth
```

### Étape 3 — Vérifier la politique Intune
```cmd
gpupdate /force
```
Puis vérifier dans le portail Intune si le poste est en conformité.

### Étape 4 — PC bloqué en boucle de redémarrage
1. Démarrer en mode sans échec (F8 ou Shift+Redémarrer)
2. Désinstaller la dernière mise à jour :
   ```
   Paramètres > Windows Update > Afficher l'historique des mises à jour > Désinstaller les mises à jour
   ```
3. Signaler immédiatement à la Boutique IT — probable incompatibilité à bloquer sur Intune

## Postes de trading — procédure spéciale
Ne jamais redémarrer un poste Bloomberg ou Refinitiv pendant les heures de marché (8h-18h30).
Toute mise à jour urgente doit être validée par le responsable de la salle des marchés.
