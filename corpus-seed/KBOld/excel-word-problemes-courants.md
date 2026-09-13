---
title: Excel et Word — problèmes courants et solutions rapides
catégorie: Applications métier
service: Tous services
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: Microsoft 365 E3 est la licence standard — les fonctionnalités varient selon la version
---

# Excel et Word — problèmes courants et solutions rapides

## Problème 1 — Fichier en lecture seule impossible à modifier

Causes possibles :
1. **Fichier ouvert par quelqu'un d'autre** (SharePoint/OneDrive) : attendre ou contacter la personne
2. **Propriétés du fichier** : clic droit > Propriétés > décocher "Lecture seule"
3. **Mode protégé** (fichier téléchargé d'internet) : cliquer **Activer la modification** dans la bannière jaune
4. **Fichier sur lecteur réseau en lecture seule** : vérifier les droits d'accès

## Problème 2 — Excel : formules qui affichent du texte au lieu du résultat

La cellule est au format Texte — Excel interprète la formule comme du texte.
1. Sélectionner la cellule > Format de cellule > **Standard** ou **Nombre**
2. Double-cliquer dans la cellule puis appuyer sur Entrée pour forcer le recalcul

## Problème 3 — Excel : liens rompus entre fichiers

```
Données > Modifier les liens > Modifier la source
```
Rediriger vers le nouveau chemin du fichier source.
Si l'autre fichier n'existe plus : **Rompre le lien** (les valeurs sont conservées, les formules dynamiques disparaissent).

## Problème 4 — Word : mise en page déréglée après partage

Cause fréquente : imprimante par défaut différente (Word adapte la mise en page à l'imprimante).
Solution : vérifier que l'imprimante par défaut est la même, ou passer en PDF avant partage.

## Problème 5 — Applications Office plantent au démarrage

Lancer en mode sans échec pour diagnostic :
```
Win + R > winword /safe    (Word)
Win + R > excel /safe      (Excel)
```
Si ça fonctionne en mode sans échec → problème de complément (Add-in).
```
Fichier > Options > Compléments > Gérer les compléments COM > Désactiver un à un
```

## Problème 6 — Fichier corrompu impossible à ouvrir

Excel : `Fichier > Ouvrir > [Fichier] > flèche à côté d'Ouvrir > Ouvrir et réparer`

Si échec : récupérer une version antérieure depuis OneDrive ou le lecteur réseau.

## Problème 7 — Activation Office expirée

```
Fichier > Compte > Activer le produit
Se connecter avec prenom.nom@fincorp.com
```
Si l'activation échoue : contacter la Boutique IT pour vérifier la licence dans le portail M365 Admin.
