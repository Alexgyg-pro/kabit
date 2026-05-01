---
title: Impression PDF — problèmes et solutions
catégorie: Système d'exploitation
service: Tous services
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: Microsoft Print to PDF est disponible nativement — Adobe Acrobat Pro est réservé au service Marketing
---

# Impression PDF — problèmes et solutions

## Imprimer en PDF (créer un PDF depuis n'importe quelle application)

1. Ouvrir la boîte d'impression : **Ctrl + P**
2. Sélectionner l'imprimante : **Microsoft Print to PDF**
3. Cliquer Imprimer > choisir l'emplacement de sauvegarde

Si **Microsoft Print to PDF** est absent :
```
Paramètres > Applications > Fonctionnalités optionnelles > Ajouter une fonctionnalité
Rechercher "Microsoft Print to PDF" > Installer
```

## Problème 1 — PDF s'imprime en blanc ou vide

1. Fermer Adobe Acrobat / Edge, rouvrir le PDF
2. Essayer d'imprimer avec **Imprimer en tant qu'image** :
   ```
   Boîte impression Adobe > Avancé > Imprimer en tant qu'image
   ```
3. Si PDF corrompu : ouvrir dans Chrome et imprimer depuis Chrome

## Problème 2 — Impression partielle ou coupée

- Format de papier incorrect : vérifier que le format est A4 (France) et non Letter (US)
- Ajuster les marges : dans la boîte d'impression, sélectionner **Ajuster à la page**

## Problème 3 — Adobe Acrobat ne peut pas imprimer

1. Vérifier que le spouleur d'impression tourne :
   ```cmd
   net stop spooler && net start spooler
   ```
2. Réparer Adobe Acrobat :
   ```
   Aide > Réparer l'installation d'Acrobat
   ```
3. Réinstaller le pilote de l'imprimante

## Outils PDF disponibles chez FinCorp

| Outil                    | Usage                              | Disponibilité         |
|--------------------------|------------------------------------|-----------------------|
| Microsoft Print to PDF   | Créer des PDF simples              | Tous les postes       |
| Adobe Acrobat Pro        | Édition, signature, OCR PDF        | Marketing (15 licences)|
| Edge (lecteur PDF)       | Lire, annoter, remplir des formulaires | Tous les postes    |
| DocuSign                 | Signature électronique légale      | JUR, RC, RH           |

## Combiner plusieurs PDF sans Adobe
Windows 11 permet de combiner des PDF via l'Explorateur :
Sélectionner plusieurs PDF > Clic droit > Imprimer > Microsoft Print to PDF
(Les PDF sont mis à la suite dans un seul fichier)
