---
title: Batterie du laptop — problèmes de charge et d'autonomie
catégorie: Matériel
service: Tous services
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: Toujours vérifier l'usure de la batterie avant d'engager un remplacement
---

# Batterie du laptop — problèmes de charge et d'autonomie

## Problème 1 — La batterie ne charge plus du tout

1. Vérifier le chargeur et le câble (tester avec un autre chargeur compatible)
2. Vérifier le connecteur USB-C / barrel du laptop (pas de déformation ou corps étrangers)
3. Hard reset (sans retirer la batterie) :
   - Éteindre le laptop
   - Débrancher l'alimentation
   - Maintenir le bouton Power 15 secondes
   - Rebrancher et redémarrer
4. Vérifier le pilote de batterie :
   ```
   Gestionnaire de périphériques > Batteries
   Désinstaller "Microsoft AC Adapter" + "Microsoft ACPI-Compliant Control Method Battery"
   Redémarrer — Windows les réinstalle automatiquement
   ```

## Problème 2 — Autonomie très réduite (< 1h)

Vérifier l'usure de la batterie :
```powershell
powercfg /batteryreport /output "C:\battery-report.html"
```
Ouvrir `C:\battery-report.html` dans un navigateur.

Indicateurs :
- **Charge Design Capacity vs Full Charge Capacity** : si l'écart dépasse 40%, la batterie est à remplacer
- **Cycle count** : au-delà de 500 cycles, dégradation normale

Si remplacement nécessaire : ouvrir un ticket Boutique IT avec le nom du modèle exact.

## Problème 3 — Batterie bloquée à X% (jamais à 100%)

Certains modèles ont une limitation de charge à 80% activée par défaut (mode conservation).

**Lenovo ThinkPad** :
```
Lenovo Vantage > My Device > Power > Battery Charge Threshold
```
Désactiver "Conservation mode" ou définir la limite à 100%.

**ASUS ExpertBook** :
```
MyASUS > Customization > Battery Care Mode
```

**MacBook Pro** :
```
Réglages Système > Batterie > Décocher "Gestion de l'alimentation optimisée"
```

## Procédure de remplacement
1. Ouvrir un ticket Boutique IT avec le rapport de batterie joint
2. Validation sous 24h
3. Intervention en Boutique IT ou sur site selon disponibilité (durée ~1h)
4. Prêt d'un laptop de remplacement possible sur demande

## Garanties
- ThinkPad E16, ASUS ExpertBook : garantie 3 ans on-site
- ThinkPad X1 Carbon : garantie 3 ans Premier Support
- MacBook Pro, Surface Laptop : garantie constructeur 1 an + AppleCare/Microsoft Complete souscrit
