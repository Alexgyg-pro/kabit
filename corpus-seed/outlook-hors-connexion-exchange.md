---
title: Outlook — déconnecté d'Exchange, mode hors connexion
catégorie: Messagerie & Collaboration
service: Tous services
équipes: Boutique IT
dernière_revision: 04/05/2026
statut: Publié
commentaire: Vérifier en priorité la connectivité réseau et le VPN avant tout diagnostic Outlook
---

# Outlook — déconnecté d'Exchange, mode hors connexion

## Symptômes
- Barre d'état Outlook affiche "Déconnecté" ou "Hors connexion"
- Les emails s'accumulent dans la boîte d'envoi sans partir
- Pas de réception de nouveaux messages
- Indicateur réseau rouge dans la barre de statut Outlook

## Vérification préalable — Réseau et VPN

1. Vérifier la connexion internet (ouvrir un navigateur)
2. Si en télétravail : vérifier que le **VPN Cisco** est connecté (voir fiche *vpn-cisco-connexion-impossible*)
3. Tester l'accès à OWA : `https://mail.fincorp.com`  
   Si OWA fonctionne, le problème est local à Outlook.

## Étape 1 — Désactiver le mode hors connexion manuellement

Onglet **Envoi/Réception** > décocher **Travailler hors connexion**  
Le bouton est en surbrillance quand le mode est actif.

## Étape 2 — Forcer la reconnexion

Clic droit sur l'icône Outlook dans la barre des tâches > **Reconnecter**  
Ou : F9 pour forcer un envoi/réception immédiat.

## Étape 3 — Vérifier les identifiants Exchange

Si une fenêtre d'authentification apparaît :
1. Saisir `FINCORP\prenom.nom` (ou `prenom.nom@fincorp.com`)
2. Cocher **Mémoriser mes informations d'identification**
3. Si refus : le mot de passe AD a peut-être expiré — voir fiche *reinitialisation-mot-de-passe-ad*

## Étape 4 — Vider les identifiants en cache

Gestionnaire des identifiants Windows (chercher dans Démarrer) > **Identifiants Windows**  
Supprimer toutes les entrées `MicrosoftOffice` et `outlook.office365.com`  
Relancer Outlook et ressaisir les identifiants.

## Escalade N2
Si déconnexion récurrente sur plusieurs postes simultanément : incident Exchange Online probable. Vérifier `https://status.office365.com`.
