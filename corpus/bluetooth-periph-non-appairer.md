---
title: Périphériques Bluetooth non appairés ou déconnectés
catégorie: Matériel
service: Tous services
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: Les accessoires Bluetooth fournis par FinCorp sont référencés — tout remplacement passe par la Boutique IT
---

# Périphériques Bluetooth non appairés ou déconnectés

## Périphériques Bluetooth standard FinCorp

| Modèle                         | Type       | Profil utilisateur      |
|--------------------------------|------------|-------------------------|
| Logitech MX Keys S             | Clavier    | Développeurs, DG        |
| Logitech MX Master 3S          | Souris     | Tous                    |
| Jabra Evolve2 65               | Casque     | Tous (open-space)       |
| Apple Magic Keyboard + Mouse   | Kit complet| MacBook Pro DG          |
| Poly Voyager Focus 2 UC        | Casque     | Direction / managers    |

## Problème 1 — Périphérique non détecté lors de l'appairage

1. Vérifier que le Bluetooth est activé sur le PC :
   ```
   Paramètres > Bluetooth et appareils > Bluetooth : Activé
   ```
2. Mettre le périphérique en mode appairage (maintenir le bouton Bluetooth)
3. Ajouter l'appareil :
   ```
   Paramètres > Bluetooth et appareils > Ajouter un appareil > Bluetooth
   ```
4. Si non visible : désactiver/réactiver le Bluetooth sur le PC

## Problème 2 — Périphérique appairé mais non fonctionnel

1. Supprimer l'appareil de la liste Bluetooth, puis le ré-appairer
2. Vérifier la batterie du périphérique (niveau bas = comportement aléatoire)
3. Mettre à jour le pilote Bluetooth :
   ```
   Gestionnaire de périphériques > Bluetooth > [Adaptateur] > Mettre à jour le pilote
   ```

## Problème 3 — Déconnexions fréquentes

- Interférences Wi-Fi 2.4GHz : activer le Wi-Fi sur la bande 5GHz si possible
- Distance trop grande : le Bluetooth a une portée effective de ~10m (obstacles inclus)
- Pour Logitech MX : utiliser le récepteur USB Logi Bolt (fourni) plutôt que le Bluetooth natif — plus stable

## Problème 4 — Casque Jabra sans son dans Teams

1. Dans Teams > Paramètres > Appareils : sélectionner le casque Jabra comme micro ET haut-parleur
2. Mettre à jour le firmware Jabra : application **Jabra Direct** (disponible dans le Self-Service Intune)
3. Si le casque est reconnu comme « Jabra Link » mais sans audio : désinstaller et réinstaller le pilote Jabra

## Casques Apple (MacBook Pro DG)
Les AirPods Pro sont personnels — non pris en charge par la Boutique IT pour un usage professionnel.
