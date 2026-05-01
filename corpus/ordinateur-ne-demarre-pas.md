---
title: L'ordinateur ne démarre pas
catégorie: Matériel
service: Tous services
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: Couvre les cas "pas de réaction", "écran noir au démarrage", "s'allume puis s'éteint"
---

# L'ordinateur ne démarre pas

## Cas 1 — Aucune réaction à l'appui sur le bouton Power

### Étape 1 — Vider les condensateurs (action numéro 1)
Cette manipulation résout ~40% des cas de "ne démarre pas" inexpliqués.
1. Éteindre le laptop et débrancher le chargeur
2. Si la batterie est amovible : la retirer
3. Maintenir le bouton Power enfoncé **30 secondes** (évacue l'électricité résiduelle)
4. Rebrancher uniquement le chargeur (sans remettre la batterie si elle était retirée)
5. Tenter de démarrer

### Étape 2 — Vérifier l'alimentation
- Tester avec un autre chargeur compatible
- Vérifier que la prise secteur fonctionne (tester avec un autre appareil)
- Vérifier le voyant LED du chargeur : allumé = chargeur OK, éteint = chargeur défectueux
- Sur desktop : vérifier que le câble d'alimentation est bien branché sur le bloc d'alimentation ET sur la multiprise

### Étape 3 — Forcer un démarrage à froid
1. Débrancher l'alimentation
2. Attendre 60 secondes
3. Rebrancher et appuyer sur Power

## Cas 2 — Voyants s'allument mais rien à l'écran (écran noir)

1. Vérifier la luminosité de l'écran (touche Fn + luminosité — parfois réglée à 0)
2. Appuyer sur une touche ou bouger la souris (sortie de veille prolongée)
3. Tenter **Win + Ctrl + Shift + B** : réinitialise le pilote graphique sans redémarrer
4. Brancher un écran externe (HDMI/USB-C) pour tester si le problème vient de l'écran intégré
5. Si image visible sur l'écran externe → dalle ou pilote défectueux → escalade N2

## Cas 3 — S'allume puis redémarre en boucle

1. Laisser Windows tenter la réparation automatique (3 échecs de démarrage déclenchent le mode réparation)
2. Si réparation automatique échoue :
   - Démarrer en **Mode sans échec** : F8 au démarrage ou Shift + Redémarrer > Options avancées
   - Désinstaller la dernière mise à jour ou le dernier pilote installé
3. Si impossible de démarrer du tout → escalade N2 pour réinstallation ou récupération de données

## Cas 4 — Bips au démarrage (codes POST)

| Nombre de bips  | Signification probable      |
|-----------------|-----------------------------|
| 1 bip court     | Démarrage normal            |
| 3 bips courts   | Erreur mémoire RAM          |
| 1 bip long continu | Problème RAM ou carte mère |
| Bips répétés    | Surchauffe ou GPU           |

En cas de bips → escalade N2 avec le modèle exact du poste.

## Escalade immédiate
- Poste sous garantie avec panne matérielle confirmée → contacter le support constructeur
- ThinkPad : Lenovo Premier Support — 0800 800 029
- MacBook Pro : Apple Support — Genius Bar ou assistance téléphonique
