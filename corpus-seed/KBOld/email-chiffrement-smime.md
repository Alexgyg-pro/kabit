---
title: Chiffrement des emails sensibles — S/MIME et étiquettes de confidentialité
catégorie: Sécurité
service: Juridique & Conformité, Direction Générale, Trading
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: Obligatoire pour tout email contenant des données clients, des informations de marché non publiques ou des données RGPD
---

# Chiffrement des emails sensibles — S/MIME et étiquettes de confidentialité

## Deux mécanismes disponibles chez FinCorp

| Mécanisme              | Usage                               | Obligatoire pour        |
|------------------------|-------------------------------------|-------------------------|
| Étiquettes M365 (AIP)  | Classification et protection simple | Tous collaborateurs     |
| S/MIME                 | Chiffrement fort de bout en bout    | JUR, DG, Trading        |

## Étiquettes de confidentialité Microsoft Purview

Disponibles dans Outlook, Word, Excel, PowerPoint, Teams :

| Étiquette         | Niveau de protection                    |
|-------------------|-----------------------------------------|
| Public            | Aucune restriction                      |
| Interne           | Accès limité au domaine fincorp.com     |
| Confidentiel      | Chiffré, pas de transfert externe       |
| Hautement confidentiel | Chiffré, pas de copie, pas d'impression |

Appliquer une étiquette dans Outlook :
- Nouvel email > **Sensibilité** (barre du ruban) > Sélectionner le niveau
- Les pièces jointes héritent de l'étiquette de l'email

## S/MIME — Configuration initiale

1. Le certificat S/MIME est déployé automatiquement via Intune sur les postes concernés
2. Vérifier la présence du certificat :
   ```
   Outlook > Fichier > Options > Centre de gestion de la confidentialité > Sécurité de messagerie
   ```
   Le certificat `prenom.nom@fincorp.com` doit apparaître dans **Certificats numériques**

3. Configurer la signature et le chiffrement par défaut :
   - Cocher **Ajouter une signature numérique aux messages sortants**
   - Cocher **Chiffrer le contenu et les pièces jointes des messages sortants** (pour les services DG/JUR/Trading)

## S/MIME — Problème de déchiffrement d'un email reçu

Si un email chiffré est illisible :
1. Vérifier que le certificat du destinataire est installé
2. Si migration de poste : réinstaller le certificat depuis `\\fincorp-deploy\certificats\smime\`
3. Contacter la Boutique IT pour export/import du certificat privé (opération sécurisée avec log)

## Règles légales FinCorp (MiFID II / RGPD)
- Toute communication contenant des **recommandations d'investissement** → étiquette Confidentiel minimum
- Toute donnée personnelle client → étiquette Confidentiel minimum
- Toute information de marché non publique (MNPI) → S/MIME obligatoire + étiquette Hautement confidentiel
