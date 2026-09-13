---
title: Matrice d'escalade — à qui escalader un incident
catégorie: Organisation support
service: Tous services
équipes: Boutique IT
dernière_revision: 15/05/2026
statut: Publié
commentaire: Ce document décrit les règles d'escalade depuis la Boutique IT vers les autres équipes. Ne couvre que les incidents en production (RUN) ; les projets BUILD ont leurs propres équipes dédiées.
---

# Matrice d'escalade — à qui escalader un incident

## Organisation générale du support

Le support informatique est organisé en deux points d'entrée parallèles pour les utilisateurs :

- **Service Desk (SD)** — support téléphonique, N1. Code ServiceNow : `CAGIP-SDW-SPU-SD_SQY`
- **Boutique IT (BTQ)** — support physique sur site, N1. Code ServiceNow : `CAGIP-SDW-SPU-BTQ_SQY`

Les utilisateurs peuvent au choix appeler le Desk ou venir en Boutique. Si le Desk ne peut pas résoudre, il escalade à la Boutique. Si la Boutique ne peut pas résoudre, elle escalade vers les équipes spécialisées décrites ci-dessous.

**Important :** la Boutique ne traite que les incidents en **production (RUN)**. Les sujets liés à des projets en cours (migrations, déploiements, passage Windows 10 → 11…) relèvent des équipes **BUILD** dédiées et provisoires — ne pas les mélanger avec les incidents RUN.

---

## N2 — Poste de Travail (SDW)

**Quand escalader ici :**
- Problème logiciel lié au système d'exploitation (Windows planté, profil corrompu, GPO bloquante)
- Logiciels du socle qui ne fonctionnent pas : antivirus, VDI, agent SCCM, WMI corrompu
- Problème de driver ou de mise à jour système impossible à résoudre en Boutique
- Poste qui ne démarre plus et ne peut pas être remis en état en Boutique

**Logiciels du socle concernés :** Windows, CrowdStrike Falcon, SCCM/Intune (agent), outils de chiffrement (BitLocker), navigateurs gérés par GPO.

**Code ServiceNow :** `CAGIP-SDW-SPU-N2_SQY` `[À COMPLÉTER — vérifier le code exact]`

**Canal :** ticket ServiceNow avec catégorie "Poste de travail"

---

## Équipe M365

**Quand escalader ici :**
- Outlook ne fonctionne **ni en client lourd ni en client léger (OWA)** — si l'un des deux fonctionne, le problème est local et reste en Boutique ou N2
- Teams ne fonctionne ni en application desktop ni dans le navigateur
- Problème de boîte mail (quota, droits, partage de boîte) non résolvable localement
- Problème de licence Microsoft 365 (utilisateur sans accès aux applications)

**Ne pas escalader ici si :** Outlook ne fonctionne qu'en client lourd ou qu'en OWA — c'est un problème de configuration locale, pas M365.

**Code ServiceNow :** `[À COMPLÉTER]`

**Canal :** ticket ServiceNow avec catégorie "Messagerie / M365"

---

## Équipe VPN

**Quand escalader ici :**
- Le client VPN ne parvient pas à se connecter et la procédure de réinitialisation en Boutique n'a pas résolu le problème
- Problème d'authentification VPN (token physique / calculette perdue ou défectueuse : remplacer depuis le stock d'abord)
- Accès VPN refusé alors que les identifiants sont corrects
- VPN instable ou déconnexions répétées sans cause locale identifiée

**Note sur les tokens VPN (calculettes) :** si le token est perdu ou cassé, le remplacer depuis le stock Boutique avant d'escalader. Si le remplacement ne suffit pas (problème d'activation du token), escalader à l'équipe VPN.

**Code ServiceNow :** `[À COMPLÉTER]`

**Canal :** ticket ServiceNow avec catégorie "VPN / Accès distant"

---

## Équipe Habilitations Windows

**Quand escalader ici :**
- Un utilisateur n'a pas les droits sur un dossier réseau ou une ressource partagée
- Un compte utilisateur est verrouillé et le déverrouillage ne se fait pas via les outils habituels
- Besoin d'attribution ou de révocation de droits d'accès (demande formelle requise)
- Accès refusé à une ressource alors que l'utilisateur devrait y avoir droit

**Important :** les demandes d'habilitations nécessitent généralement une validation hiérarchique. S'assurer que l'utilisateur a bien la validation de son responsable avant d'escalader.

**Code ServiceNow :** `[À COMPLÉTER]`

**Canal :** ticket ServiceNow avec catégorie "Habilitations / Droits d'accès"

---

## Équipe Active Directory (AD)

**Quand escalader ici :**
- Problème de compte AD (compte désactivé, expiré, verrouillé) que les outils Boutique ne permettent pas de résoudre
- Problème de synchronisation AD (l'utilisateur existe en AD mais n'apparaît pas dans certains systèmes)
- Problème de GPO qui ne s'applique pas correctement et dont la source est côté serveur AD
- Changement de nom de compte (mutation, mariage) nécessitant une modification AD

**Code ServiceNow :** `[À COMPLÉTER]`

**Canal :** ticket ServiceNow avec catégorie "Active Directory"

---

## Stock — Remplacement matériel

**Quand escalader (ou plutôt : quand solliciter le stock) :**
- Remplacement d'un poste de travail (laptop défaillant, hors garantie, irréparable)
- Remplacement d'un token VPN physique (calculette perdue, cassée ou expirée)
- Fourniture d'un accessoire (souris, clavier, chargeur) selon les règles en vigueur

**Hors périmètre :** les téléphones mobiles ne sont pas gérés par la Boutique dans ce périmètre.

**Procédure :** le remplacement se fait directement depuis le stock Boutique. Si le stock est épuisé, ouvrir une demande d'approvisionnement. `[À COMPLÉTER — procédure de réapprovisionnement]`

---

## Logiciels métier — Support éditeur

**Quand orienter ici :**
- L'incident concerne un logiciel métier spécifique à un service (Bloomberg, DocuSign, outil comptable, outil RH, outil de trading…)
- La Boutique a vérifié que le problème n'est pas lié au poste ou à la connectivité réseau

**Procédure :** les utilisateurs sont invités à contacter directement le support de l'éditeur du logiciel, ou le référent métier de leur service. La Boutique n'est pas le bon canal pour les logiciels métier.

**Référents métier :** `[À COMPLÉTER — liste des référents par logiciel ou par service]`

---

## Quand ne pas escalader — continuer à chercher en Boutique

Pour les incidents sans équipe cible évidente, la Boutique traite du mieux possible avant d'envisager une escalade. Cela inclut notamment :
- Problèmes matériels mineurs (écran, clavier, connectique) réparables en Boutique
- Problèmes de configuration locale sans cause système identifiée
- Incidents intermittents difficiles à reproduire

Dans ces cas, documenter les symptômes précis et les actions déjà tentées avant toute escalade.
