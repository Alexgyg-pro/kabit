---
title: Casque sans fil — problèmes de son via dongle USB
catégorie: Matériel
service: Tous services
équipes: Boutique IT
dernière_revision: 04/06/2026
statut: Publié
commentaire: Le Bluetooth est désactivé sur les postes FinCorp — les casques sans fil fonctionnent exclusivement via leur dongle USB fourni
---

# Casque sans fil — problèmes de son via dongle USB

Sur les postes FinCorp, le Bluetooth est bridé par politique de sécurité. Les casques sans fil (Jabra, Poly) fonctionnent via un **dongle USB dédié** livré avec le casque. Les deux problèmes les plus fréquents sont la perte d'appairage entre le casque et le dongle, et le dongle défectueux.

## Dongles de référence FinCorp

| Casque                  | Dongle associé     |
|-------------------------|--------------------|
| Jabra Evolve2 65        | Jabra Link 380     |
| Poly Voyager Focus 2 UC | Poly BT700         |

---

## Symptômes

- Pas de son dans Teams (ni micro ni haut-parleur) alors que le casque est allumé
- Le casque n'apparaît pas dans les appareils audio de Windows
- Teams indique "Aucun périphérique audio détecté"
- Le casque était fonctionnel la veille sans changement apparent

---

## Étape 1 — Vérifier la reconnaissance du dongle

1. Brancher le dongle sur un autre port USB du poste
2. Ouvrir le **Gestionnaire de périphériques** (`devmgmt.msc`)
3. Vérifier que le dongle apparaît sous **Son, vidéo et jeux** ou **Périphériques USB**
4. S'il apparaît avec un triangle orange : désinstaller le périphérique, débrancher, rebrancher

> Si le dongle n'apparaît dans aucune catégorie même après changement de port → **dongle probablement HS**, passer à l'étape 4.

---

## Étape 2 — Ré-appairer le casque avec le dongle

### Jabra Evolve2 65 + Jabra Link 380

1. Éteindre le casque
2. Maintenir le **bouton d'appairage** du dongle jusqu'au clignotement rapide (mode appairage)
3. Sur le casque : maintenir le **bouton marche** jusqu'aux bips d'appairage
4. Attendre la confirmation sonore (bip long = appairage réussi)

### Poly Voyager Focus 2 UC + Poly BT700

1. Éteindre le casque
2. Brancher le BT700 — il entre automatiquement en mode appairage (LED clignotante)
3. Sur le casque : maintenir le **bouton Bluetooth** jusqu'aux bips
4. LED fixe sur le dongle = appairage réussi

---

## Étape 3 — Vérifier la sélection dans Teams

Après appairage :

1. Dans Teams : **Paramètres (···) > Paramètres > Appareils**
2. Sélectionner le casque comme **Haut-parleur** ET comme **Microphone**
3. Lancer un appel test pour valider

---

## Étape 4 — Dongle défectueux

Si le dongle n'est pas reconnu malgré le changement de port et un redémarrage du poste :

- Le dongle est probablement HS
- Contacter la **Boutique IT** pour un remplacement
- En attendant, proposer à l'utilisateur un casque filaire de prêt si disponible

## Quand escalader

- Le casque lui-même n'est plus reconnu après ré-appairage sur un dongle de remplacement fonctionnel → escalader à la Boutique IT (possible défaut matériel casque)
