---
title: Imprimante réseau non détectée ou inaccessible
catégorie: Matériel
service: Tous services
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: Les imprimantes sont nommées selon le format IMP-[SITE]-[ETAGE]-[NUMERO]
---

# Imprimante réseau non détectée ou inaccessible

## Imprimantes disponibles chez FinCorp

| Nom                 | Modèle               | Emplacement             | File d'impression       |
|---------------------|----------------------|-------------------------|-------------------------|
| IMP-PAR-3-01        | Xerox VersaLink C7130| Paris — Étage 3 (open)  | \\print-srv\IMP-PAR-3-01 |
| IMP-PAR-3-02        | Xerox VersaLink C7130| Paris — Étage 3 (salle) | \\print-srv\IMP-PAR-3-02 |
| IMP-PAR-5-01        | Konica Minolta C558  | Paris — Étage 5 (DG)    | \\print-srv\IMP-PAR-5-01 |
| IMP-LYO-2-01        | Xerox VersaLink B415 | Lyon — Étage 2           | \\print-srv\IMP-LYO-2-01 |

## Procédure — Ajouter une imprimante réseau

1. Ouvrir **Paramètres > Bluetooth et appareils > Imprimantes et scanners**
2. Cliquer **Ajouter un appareil > Ajouter manuellement**
3. Sélectionner **Sélectionner une imprimante partagée par nom**
4. Saisir le chemin UNC : `\\print-srv\IMP-PAR-3-01`
5. Installer le pilote si demandé (accepter l'invite UAC)

## Problème — L'imprimante est installée mais les impressions restent bloquées

```cmd
net stop spooler
del /Q /F /S "%systemroot%\System32\spool\PRINTERS\*"
net start spooler
```
Puis relancer l'impression.

## Problème — Erreur « Accès refusé » lors de l'ajout

Le compte doit être dans le groupe AD `GRP-PRINT-[SITE]`.
Contacter la Boutique IT pour vérification des groupes.

## Problème — Impression confidentielle (étage DG)

Les impressions vers IMP-PAR-5-01 nécessitent un code PIN :
1. Dans les propriétés d'impression > **Impression sécurisée**
2. Saisir un code à 4 chiffres
3. Aller au panneau de l'imprimante, saisir le code pour libérer le document

## Escalade
Si le serveur d'impression `\\print-srv` est inaccessible depuis plusieurs postes → contacter l'équipe Infrastructure IT.
