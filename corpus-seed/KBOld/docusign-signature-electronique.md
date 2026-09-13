---
title: DocuSign — problèmes de signature électronique et d'envoi
catégorie: Applications métier
service: Juridique & Conformité, Relation Client, Ressources Humaines
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: DocuSign est la solution de signature électronique certifiée eIDAS — valeur légale garantie
---

# DocuSign — problèmes de signature électronique et d'envoi

## Accès DocuSign chez FinCorp
- **URL** : `https://fincorp.docusign.net`
- **Authentification** : SSO Azure AD
- **Licences** : Business Pro — 30 utilisateurs expéditeurs (JUR, RC, RH prioritaires)
- **Administrateur** : Sophie Morin, équipe Juridique (ext. 4401)

## Problème 1 — Impossible de se connecter

1. Accéder via `https://fincorp.docusign.net` (URL spécifique FinCorp)
2. Cliquer **Se connecter avec votre compte professionnel** (SSO Azure AD)
3. Si erreur SSO : vérifier que le compte Azure AD est actif
4. Si message « Compte non trouvé » : l'utilisateur n'a pas de licence — contacter Sophie Morin

## Problème 2 — Le signataire ne reçoit pas l'email DocuSign

1. Vérifier que l'adresse email du signataire est correcte dans l'enveloppe
2. L'email vient de `dse@docusign.net` — vérifier les spams / filtres anti-phishing
3. Renvoyer la notification depuis DocuSign : Enveloppe > Renvoyer
4. Si le client est derrière un filtre strict : lui proposer le lien de signature direct (DocuSign > Corriger > Copier le lien)

## Problème 3 — Document refusé à la signature (format)

DocuSign accepte : PDF, DOCX, XLSX, PPTX, JPG, PNG (max 25 Mo par fichier, 2 Go par enveloppe).
Convertir en PDF si le format n'est pas supporté.

## Problème 4 — Signature avec niveau d'authentification renforcé (clients)

Pour les contrats nécessitant une signature qualifiée (niveau eIDAS avancé) :
1. Dans l'enveloppe : champ de signature > Modifier > Authentification
2. Sélectionner **SMS OTP** ou **ID Check** selon les instructions juridiques
3. Ces options consomment des crédits supplémentaires — validation de Sophie Morin requise pour les volumes > 10 enveloppes/mois

## Problème 5 — Récupérer un document signé après clôture

Tous les documents signés sont archivés pendant **10 ans** dans DocuSign (exigence légale services financiers).
Accès aux archives : Gérer > Terminé > Filtrer par date ou expéditeur.
