---
title: Lecteurs réseau — accès refusé ou lecteur déconnecté
catégorie: Réseau & Connectivité
service: Tous services
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: Les droits sur les lecteurs réseau sont basés sur les groupes AD — jamais sur l'utilisateur individuel
---

# Lecteurs réseau — accès refusé ou lecteur déconnecté

## Lecteurs réseau mappés chez FinCorp

| Lettre | Partage réseau                         | Accès                    |
|--------|----------------------------------------|--------------------------|
| H:     | `\\fileserver\home\[login]`           | Personnel (utilisateur)  |
| S:     | `\\fileserver\services\[service]`     | Par service (groupe AD)  |
| P:     | `\\fileserver\projets`                | Par projet (groupe AD)   |
| I:     | `\\fileserver\it-commun`              | Équipe IT uniquement     |
| T:     | `\\fileserver\trading`                | Trading + GA uniquement  |

## Problème 1 — Lecteur avec croix rouge (déconnecté)

1. Double-cliquer sur le lecteur — Windows tente de se reconnecter
2. Si échec : vérifier la connexion réseau / VPN
3. Reconnecter manuellement :
   ```cmd
   net use S: \\fileserver\services\SF /persistent:yes
   ```
4. Forcer la reconnexion de tous les lecteurs :
   ```cmd
   gpupdate /force
   ```

## Problème 2 — Accès refusé sur un dossier existant

1. Vérifier que l'utilisateur est dans le bon groupe AD :
   ```powershell
   Get-ADUser -Identity "prenom.nom" -Properties MemberOf | Select-Object -ExpandProperty MemberOf
   ```
2. Les groupes d'accès aux lecteurs suivent la convention : `GRP-FS-[SERVICE]-[RW/RO]`
   Exemple : `GRP-FS-SF-RW` pour lecture/écriture sur le lecteur Stratégie Financière

3. Demande d'ajout au groupe :
   - Le responsable du service envoie un email à `it-support@fincorp.com`
   - Délai : 4h ouvrées

## Problème 3 — Lecteur H: (personnel) inaccessible

Le lecteur H: est créé automatiquement au premier logon.
Si absent : se déconnecter et se reconnecter.
Si vide après migration de poste : vérifier la sauvegarde sur `\\fileserver\home\[login]` depuis un autre chemin.

## Problème 4 — Lecteur T: (Trading) — accès ultra-restreint

Tout accès non autorisé au lecteur T: est journalisé et signalé à l'équipe Conformité.
Demande d'accès via le responsable de la salle des marchés uniquement.
