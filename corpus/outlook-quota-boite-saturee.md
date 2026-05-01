---
title: Outlook — boîte mail saturée et dépassement de quota
catégorie: Messagerie & Collaboration
service: Tous services
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: Le quota standard est de 100 Go sur Exchange Online — augmentation possible sur demande justifiée
---

# Outlook — boîte mail saturée et dépassement de quota

## Symptômes
- Message « Votre boîte aux lettres est presque pleine »
- Impossibilité d'envoyer des emails (mais réception toujours active)
- Outlook lent au démarrage

## Quota FinCorp (Exchange Online / Microsoft 365)

| Profil              | Quota boîte principale | Archive en ligne |
|---------------------|------------------------|------------------|
| Collaborateur standard | 100 Go              | 1,5 To           |
| Direction Générale  | 100 Go                 | Illimitée        |
| Compte partagé      | 50 Go                  | Non activée      |

## Étape 1 — Vérifier l'espace utilisé

Dans Outlook : Fichier > Informations sur le compte > Paramètres du compte  
Ou via OWA : `https://mail.fincorp.com` > Paramètres > Messagerie > Stockage

## Étape 2 — Libérer de l'espace rapidement

1. Vider la corbeille et le dossier Courrier indésirable
2. Trier par taille :
   - Outlook : Affichage > Vue actuelle > Gérer les vues > Trier par Taille (décroissant)
   - Supprimer les emails avec pièces jointes volumineuses (> 10 Mo)
3. Vider le dossier **Éléments envoyés** des emails anciens > 1 an

## Étape 3 — Activer et utiliser l'archive en ligne

L'archive en ligne est activée par défaut. Pour y déplacer des emails :
- Clic droit sur un dossier > **Archiver**
- Ou configurer la stratégie d'archivage automatique :
  Outlook > Fichier > Options > Avancé > Paramètres de l'archivage automatique

## Étape 4 — Augmentation de quota

Si l'archive est pleine et le besoin est justifié :
1. Le collaborateur envoie une demande à son responsable
2. Le responsable valide et transfert à `it-support@fincorp.com`
3. Traitement sous 2 jours ouvrés via le portail Microsoft 365 Admin

## Bonnes pratiques
- Ne pas stocker les fichiers de travail dans Outlook — utiliser SharePoint ou OneDrive
- Les pièces jointes > 10 Mo doivent être partagées via un lien SharePoint, pas attachées directement
