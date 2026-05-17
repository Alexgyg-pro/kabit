---
title: OneNote — Problèmes courants (synchronisation, notes manquantes, plantages)
catégorie: Microsoft 365
service: Tous services
équipes: Boutique IT
dernière_revision: 18/05/2026
statut: Publié
commentaire: Distinguer carnets cloud (OneDrive/SharePoint) et carnets locaux avant toute action sur le cache
---

# OneNote — Problèmes courants

## Carnet bloqué en synchronisation

**Symptômes :** icône de sync qui tourne indéfiniment, message "Synchronisation en cours", modifications non visibles sur un autre appareil, badge d'erreur sur le carnet.

**Procédure :**

1. Clic droit sur le carnet dans la liste à gauche → **État de synchronisation du carnet**
2. Cliquer sur **Synchroniser maintenant** pour forcer
3. Si une erreur est affichée : noter le **code d'erreur** (ex : 0xE4020005)
4. Fermer OneNote complètement et le rouvrir

**Codes d'erreur fréquents :**

| Code | Cause probable | Action |
|------|---------------|--------|
| 0xE000002E | Quota OneDrive dépassé | Libérer de l'espace OneDrive de l'utilisateur |
| 0xE4020005 | Problème réseau ou VPN | Vérifier la connexion et le VPN |
| 0xE000005E | Fichier joint trop volumineux | Déplacer ou supprimer les pièces jointes lourdes |
| 0xE40200B6 | Conflit de version | Chercher les pages en doublon dans le carnet |

**Si la sync reste bloquée — vider le cache OneNote :**
1. Fermer OneNote complètement (vérifier dans le Gestionnaire des tâches)
2. Ouvrir : `%LOCALAPPDATA%\Microsoft\OneNote\`
3. Renommer le dossier `cache` en `cache.old`
4. Rouvrir OneNote — la synchronisation repart de zéro (peut prendre plusieurs minutes selon la taille du carnet)

## Notes ou sections manquantes

**Symptômes :** des notes présentes la veille ont disparu, une section entière est absente, un carnet est vide.

**Étape 1 — Vérifier la Corbeille OneNote :**
- OneNote 2016 : onglet **Historique > Corbeille du Bloc-notes**
- Nouvelle application OneNote : icône corbeille en bas de la liste des sections

Les pages effacées y restent **60 jours** avant suppression définitive.

**Étape 2 — Consulter l'historique des versions :**
- Clic droit sur la page → **Afficher les versions de la page**
- Sélectionner une version antérieure → **Restaurer**

**Étape 3 — Pages récemment supprimées (OneNote 2016) :**
- Onglet **Historique > Pages récemment supprimées**

**Si le contenu a été écrasé dans un carnet partagé :** l'historique des versions conserve toutes les modifications par auteur — restaurer depuis la version d'avant l'écrasement.

## L'utilisateur ne retrouve pas ses carnets OneNote

**Symptômes :** OneNote s'ouvre mais la liste des carnets est vide ou incomplète, le carnet attendu n'apparaît pas.

**Vérifications à faire :**

1. **Le carnet est-il dans OneDrive ?**
   - Ouvrir OneDrive dans le navigateur (`portal.office.com`) → vérifier la présence du dossier carnet
   - Dans OneNote : **Fichier > Ouvrir > OneDrive** → ajouter le carnet manuellement

2. **Le carnet est-il local ?**
   - Chercher dans `%USERPROFILE%\Documents\OneNote Notebooks\`
   - Ouvrir le fichier `.onetoc2` trouvé via **Fichier > Ouvrir > Ordinateur**

3. **Le carnet est-il sur SharePoint ?**
   - Retrouver le lien de partage (e-mail, Teams)
   - Ouvrir le lien → **Modifier dans l'application**

4. **L'utilisateur est-il connecté avec le bon compte ?**
   - Dans OneNote : vérifier le compte connecté (coin supérieur droit)
   - Un utilisateur avec plusieurs comptes (perso + pro) peut se retrouver sur le mauvais

## OneNote ne s'ouvre pas ou plante au démarrage

**Procédure de réparation :**

1. **Réparation rapide Microsoft 365 :**
   - Panneau de configuration → Programmes → Microsoft 365 → **Modifier**
   - Choisir **Réparation rapide** (pas besoin d'internet)
   - Si insuffisant : **Réparation en ligne**

2. **Vider le cache local :**
   - Fermer OneNote
   - Aller dans `%LOCALAPPDATA%\Microsoft\OneNote\`
   - Renommer ou supprimer le dossier → relancer OneNote

3. **Désactiver les compléments COM (OneNote 2016 uniquement) :**
   - Fichier → Options → Compléments → Gérer : Compléments COM → OK
   - Décocher tous les compléments → redémarrer OneNote

## Deux versions de OneNote installées

Sur Windows 10/11, deux versions peuvent coexister :
- **OneNote** (application Microsoft Store) — synchronisation cloud uniquement, pas de carnets locaux
- **OneNote 2016** (inclus dans certaines suites Office) — supporte les carnets locaux

**Recommandation FinCorp :** utiliser l'application **OneNote incluse dans Microsoft 365** (version Store). Elle synchronise automatiquement avec OneDrive for Business et est maintenue activement.

Si l'utilisateur a des carnets locaux dans OneNote 2016 qu'il souhaite migrer : les synchroniser vers OneDrive depuis OneNote 2016 (**clic droit sur le carnet > Synchroniser > Synchroniser ce bloc-notes maintenant**), puis les ouvrir dans la nouvelle application.

## Escalade

Escalader au **N2 M365** si :
- Un carnet SharePoint est inaccessible malgré des droits corrects (problème de permissions au niveau du site SharePoint)
- Le quota OneDrive est bloqué et nécessite une augmentation de capacité
- Des données semblent définitivement perdues (corbeille vide, historique absent) — une restauration depuis les sauvegardes M365 peut être envisagée
