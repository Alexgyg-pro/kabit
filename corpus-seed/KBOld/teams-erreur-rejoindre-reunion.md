---
title: Teams — impossible de rejoindre une réunion
catégorie: Messagerie & Collaboration
service: Tous services
équipes: Boutique IT
dernière_revision: 04/05/2026
statut: Publié
commentaire: Le lien de réunion reste valide même si Teams plante — utiliser Teams Web en secours
---

# Teams — impossible de rejoindre une réunion

## Symptômes
- Clic sur "Rejoindre" sans effet
- Erreur "Vous n'êtes pas autorisé à rejoindre cette réunion"
- La réunion se charge indéfiniment
- Déconnexion immédiate après avoir rejoint

## Étape 1 — Rejoindre via Teams Web (solution de secours rapide)

Dans l'invitation email ou le calendrier : copier le lien de réunion  
Ouvrir dans **Chrome ou Edge** (pas Firefox) → rejoindre via le navigateur  
Contourne la majorité des problèmes du client lourd.

## Étape 2 — Erreur "Vous n'êtes pas autorisé"

Causes possibles :
- La réunion est configurée pour les **utilisateurs FinCorp uniquement** (pas d'invités externes)
- Se connecter avec `prenom.nom@fincorp.com` (pas un compte personnel)
- L'organisateur n'a pas encore admis le participant depuis la salle d'attente

## Étape 3 — Problème de salle d'attente

Si la réunion a une salle d'attente activée : l'organisateur doit admettre manuellement chaque participant.  
Contacter l'organisateur si l'attente dure > 2 minutes.

## Étape 4 — Réunion Teams créée depuis Outlook sans lien

Si l'invitation ne contient pas de lien Teams (voir fiche *outlook-teams-reunion-sans-lien*) :  
Demander à l'organisateur de renvoyer l'invitation après avoir réinstallé le complément Teams.

## Étape 5 — Problème réseau

Teams nécessite l'accès aux URL Microsoft 365 sur les ports 80 et 443.  
En VPN d'entreprise : certains VPN bloquent le trafic multimédia Teams — basculer en **split tunneling** si disponible.

## Escalade N2
Pour les réunions avec des partenaires externes bloquées par les règles réseau FinCorp : ticket réseau avec les URL de destination.
