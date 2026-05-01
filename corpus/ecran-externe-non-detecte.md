---
title: Écran externe non détecté ou image incorrecte
catégorie: Matériel
service: Tous services
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: Les postes DG disposent de deux écrans 4K — procédure spécifique section dédiée
---

# Écran externe non détecté ou image incorrecte

## Configurations d'affichage standard FinCorp

| Profil matériel                   | Écrans fournis                         | Connectique       |
|-----------------------------------|----------------------------------------|-------------------|
| Laptop ordinaire (ThinkPad E16)   | 1 écran Dell 27" FHD                  | HDMI ou USB-C     |
| Laptop développeur (X1 Carbon)    | 2 écrans Dell 27" QHD                 | Thunderbolt 4     |
| MacBook Pro 16" (DG)              | 2 écrans LG UltraFine 27" 4K          | USB-C / Thunderbolt|
| Surface Laptop 6 (directeurs)     | 1-2 écrans Dell 27" QHD               | USB-C / DisplayPort|

## Problème 1 — Écran non détecté après connexion

1. Vérifier le câble (débrancher / rebrancher fermement)
2. Tenter un autre câble ou adaptateur
3. Raccourci Windows : **Win + P** > Étendre ou Dupliquer
4. Forcer la détection :
   ```
   Paramètres > Système > Affichage > Détecter (en bas de page)
   ```
5. Mettre à jour le pilote graphique :
   ```
   Gestionnaire de périphériques > Cartes graphiques > Mettre à jour le pilote
   ```

## Problème 2 — Image floue ou résolution incorrecte

1. Clic droit bureau > Paramètres d'affichage
2. Vérifier que la résolution est sur **Recommandé**
3. Pour les écrans 4K : s'assurer que la mise à l'échelle est à 150% ou 200%
4. Si image floue dans une application spécifique :
   ```
   Clic droit sur l'exe > Propriétés > Compatibilité > Modifier les paramètres PPP élevés
   Cocher "Remplacer le comportement de mise à l'échelle PPP"
   ```

## Problème 3 — Écran externe éteint mais reconnu par Windows

- Vérifier que l'écran est bien allumé et sur la bonne entrée (HDMI 1, DisplayPort, etc.)
- Tester avec **Win + P** > Deuxième écran seulement pour vérifier

## Cas spécifique — MacBook Pro (DG) et écrans LG 4K

- Utiliser uniquement les ports Thunderbolt 3/4 (gauche du MacBook)
- En cas de non-détection : maintenir le bouton d'alimentation de l'écran 10 secondes pour réinitialiser
- Mode Clamshell (MacBook fermé) : nécessite alimentation secteur + clavier/souris Bluetooth

## Docking stations (bureau fixe)

Si le laptop est connecté via une station d'accueil Lenovo ThinkPad Thunderbolt 4 :
1. Débrancher / rebrancher le câble Thunderbolt du dock
2. Mettre à jour le firmware du dock : `Lenovo System Update`
