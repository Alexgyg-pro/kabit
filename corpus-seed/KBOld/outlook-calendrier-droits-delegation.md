---
title: Outlook — calendrier partagé, délégation et droits d'accès
catégorie: Messagerie & Collaboration
service: Tous services
équipes: Boutique IT
dernière_revision: 04/05/2026
statut: Publié
commentaire: Distinguer "partage de calendrier" (lecture) et "délégation" (modification au nom de)
---

# Outlook — calendrier partagé, délégation et droits d'accès

## Symptômes
- Impossible de voir le calendrier d'un collègue
- Les modifications du délégataire n'apparaissent pas
- Erreur "Vous ne disposez pas des autorisations pour afficher ce dossier"
- Invitation reçue mais calendrier toujours inaccessible

## Deux notions à distinguer

| Type | Usage | Niveau d'accès |
|------|-------|----------------|
| **Partage de calendrier** | Voir les disponibilités | Lecture seule par défaut |
| **Délégation** | Gérer l'agenda au nom de | Lecture + écriture + envoi en son nom |

## Cas 1 — Partager son calendrier (émetteur)

1. Outlook > Calendrier > clic droit sur le calendrier > **Propriétés de partage**
2. Cliquer **Ajouter** > rechercher le collègue
3. Sélectionner le niveau : Disponible/Occupé, Détails limités, Détails complets, Éditeur

## Cas 2 — Ouvrir un calendrier partagé (destinataire)

Calendrier > Ouvrir le calendrier > **À partir du carnet d'adresses** > saisir le nom  
Ou accepter l'invitation de partage reçue par email.

## Cas 3 — Configurer une délégation (assistant/secrétariat)

**Côté délégant :**  
Fichier > Paramètres du compte > Accès délégué > **Ajouter**  
Sélectionner le délégataire > choisir les niveaux (Calendrier : Éditeur recommandé)

**Côté délégataire :**  
Pour envoyer des réunions au nom de : dans la composition, cliquer **De** > sélectionner l'adresse du délégant.

## Cas 4 — Droits non appliqués

Si les droits ont été accordés mais que l'accès reste refusé :
1. Le destinataire doit fermer et relancer Outlook
2. Vérifier que les droits sont appliqués côté Exchange via OWA > Calendrier > Partage et autorisations

## Escalade N2
Pour les délégations de direction générale ou accès aux boîtes de service : traitement via ticket IT avec validation du responsable.
