# EVAL.md — Jeu de tests qualité RAG

## Mode d'emploi

Pour chaque évolution du pipeline RAG (changement de modèle d'embedding, seuils de similarité, chunking, prompt système), tester manuellement chaque question dans l'application et vérifier :

1. **Source attendue** — le fichier ou chunk indiqué apparaît dans les sources affichées sous la réponse
2. **Éléments clés** — la réponse contient les informations listées

Cocher chaque critère. Si une question échoue, investiguer la cause avant de merger dans `develop`.

> **Modèle LLM de référence pour les tests :** Llama 3.3 70B (meilleur)

---

## Questions procédurales — fiches `.md`

### Q01 — Outlook ne démarre pas

**Question :** Outlook ne démarre pas. Que faire ?

**Source attendue :** `corpus/outlook-ne-demarre-pas.md`

**Éléments clés de la réponse :**
- Lancer en mode sans échec : `outlook.exe /safe`
- Si Outlook s'ouvre en mode sans échec : désactiver les compléments COM un par un
- Réparer le profil via Panneau de configuration > Courrier > Réparer
- Réparation Office : Réparation rapide puis Réparation en ligne si insuffisant
- Renommer le fichier `.ost` en `.ost.old` pour forcer la re-synchronisation Exchange

**Résultat attendu :** ✅ / ❌

---

### Q02 — VPN Cisco AnyConnect inaccessible

**Question :** Le VPN Cisco AnyConnect refuse de se connecter. Que faire ?

**Source attendue :** `corpus/vpn-cisco-connexion-impossible.md`

**Éléments clés de la réponse :**
- Vérifier le service Windows : `services.msc` > Cisco AnyConnect Secure Mobility Agent
- Vérifier que le mot de passe AD n'est pas expiré
- Réinitialiser le profil : supprimer les `.xml` dans `C:\ProgramData\Cisco\Cisco AnyConnect Secure Mobility Client\Profile\`
- Adresse serveur à ressaisir : `vpn.fincorp.com`
- Désinstaller tout VPN tiers concurrent (GlobalProtect, OpenVPN, Pulse Secure)

**Résultat attendu :** ✅ / ❌

---

### Q03 — Teams ne se lance plus

**Question :** Teams se lance mais la fenêtre n'apparaît jamais.

**Source attendue :** `corpus/teams-ne-demarre-pas.md`

**Éléments clés de la réponse :**
- Tuer tous les processus Teams dans le gestionnaire des tâches
- Vider le cache Teams classique : `%appdata%\Microsoft\Teams\`
- Vider le cache Teams 2.0 : `%localappdata%\Packages\MSTeams_8wekyb3d8bbwe\LocalCache\...`
- Réinstaller : Teams classique via Panneau de configuration, Teams 2.0 via Microsoft Store

**Résultat attendu :** ✅ / ❌

---

### Q04 — OneDrive synchronisation bloquée

**Question :** OneDrive affiche une croix rouge. La synchronisation est bloquée.

**Source attendue :** `corpus/onedrive-synchronisation-bloquee.md`

**Éléments clés de la réponse :**
- Cliquer sur l'icône OneDrive > Afficher la synchronisation pour voir l'erreur détaillée
- Si non connecté : se reconnecter avec `prenom.nom@fincorp.com`
- Si fichier bloqué : fermer l'application qui le maintient ouvert
- Quota standard : 1 To par utilisateur. Vérifier sur `https://fincorp-my.sharepoint.com`
- Chemin trop long : activer `LongPathsEnabled = 1` dans le registre

**Résultat attendu :** ✅ / ❌

---

### Q05 — Réinitialisation mot de passe AD

**Question :** Un collaborateur a oublié son mot de passe et son compte est verrouillé. Comment procéder ?

**Source attendue :** `corpus/reinitialisation-mot-de-passe-ad.md`

**Éléments clés de la réponse :**
- Via ADUC (`dsa.msc`) : clic droit > Reset Password + cocher "changer à la prochaine connexion"
- Si compte verrouillé : onglet Account > décocher "Account is locked out"
- Via PowerShell : `Set-ADAccountPassword`, `Set-ADUser -ChangePasswordAtLogon $true`, `Unlock-ADAccount`
- Politique : longueur minimale 14 caractères, validité 90 jours, blocage après 5 tentatives

**Résultat attendu :** ✅ / ❌

---

### Q06 — Écran bleu BSOD

**Question :** Un collaborateur a un écran bleu au démarrage. Comment diagnostiquer ?

**Source attendue :** `corpus/ecran-bleu-bsod-windows.md`

**Éléments clés de la réponse :**
- Relever le code d'arrêt affiché sur l'écran bleu
- Lancer l'outil de diagnostic mémoire Windows (`mdsched.exe`)
- Analyser le fichier de dump : Observateur d'événements ou WinDbg
- Vérifier les pilotes installés récemment (Device Manager > View > Show hidden devices)
- Lancer `sfc /scannow` pour réparer les fichiers système corrompus

**Résultat attendu :** ✅ / ❌

---

## Questions catalogue — `catalogue-it.json`

### Q07 — Laptop pour un collaborateur standard

**Question :** Quel ordinateur portable est fourni à un collaborateur standard ?

**Source attendue :** `catalogue-it.json#LPT-STD-001` (ou LPT-STD-002 / 003 / 004)

**Éléments clés de la réponse :**
- Modèles disponibles : Lenovo ThinkPad E16 Gen 2, ASUS ExpertBook B1, HP EliteBook 840 G10, Dell Latitude 5540
- Profil : collaborateur standard
- Mention de plusieurs modèles selon l'usage (mobilité fréquente vs sédentaire)

**Résultat attendu :** ✅ / ❌

---

### Q08 — Laptop pour cadre dirigeant

**Question :** Quel laptop est attribué aux cadres dirigeants (C-Level) ?

**Source attendue :** `catalogue-it.json#LPT-LUX-001`

**Éléments clés de la réponse :**
- Apple MacBook Pro 16" M3 Pro
- Profil : Cadre dirigeant / C-Level
- Mention de la gamme premium (LPT-LUX)

**Résultat attendu :** ✅ / ❌

---

### Q09 — Applications du service Trading

**Question :** Quelles applications sont utilisées par le service Trading ?

**Source attendue :** `catalogue-it.json#service-TRD`

**Éléments clés de la réponse :**
- Bloomberg Terminal (APP-001)
- ION Trading Fidessa (APP-022)
- FIS Kondor+ (APP-021)
- Murex MX.3 (APP-024)
- Refinitiv Eikon / LSEG (APP-002)

**Résultat attendu :** ✅ / ❌

---

### Q10 — CRM de FinCorp

**Question :** Quel logiciel CRM est utilisé chez FinCorp ?

**Source attendue :** `catalogue-it.json#APP-004`

**Éléments clés de la réponse :**
- Salesforce Financial Services Cloud
- Éditeur : Salesforce
- Type : CRM & gestion de la relation client
- Utilisé par le service Relation Client (RC)

**Résultat attendu :** ✅ / ❌

---

### Q11 — Réinitialisation de mot de passe en libre-service

**Question :** Existe-t-il un portail pour qu'un utilisateur réinitialise lui-même son mot de passe sans appeler le support ?

**Source attendue :** `catalogue-it.json#SUP-OTL-005`

**Éléments clés de la réponse :**
- Portail de réinitialisation de mot de passe (SSPR)
- Type : Application Intranet
- Accessible sans intervention du support

**Résultat attendu :** ✅ / ❌

---

### Q12 — Supervision réseau

**Question :** Quel outil est utilisé pour surveiller l'infrastructure réseau chez FinCorp ?

**Source attendue :** `catalogue-it.json#APP-013` ou `catalogue-it.json#SUP-OTL-007`

**Éléments clés de la réponse :**
- Zabbix (APP-013 — Zabbix LLC)
- Console de supervision Zabbix (SUP-OTL-007) accessible aux équipes IT
- Catégorie : supervision réseau & infrastructure

**Résultat attendu :** ✅ / ❌

---

## Tableau de bord

| #   | Question résumée                          | Type  | Dernière validation | Résultat |
|-----|-------------------------------------------|-------|---------------------|----------|
| Q01 | Outlook ne démarre pas                    | .md   | 05/05/2026          | ✅        |
| Q02 | VPN Cisco AnyConnect inaccessible         | .md   | 05/05/2026          | ✅        |
| Q03 | Teams ne se lance plus                    | .md   | 05/05/2026          | ❌        |
| Q04 | OneDrive synchronisation bloquée          | .md   | 05/05/2026          | ⚠️        |
| Q05 | Réinitialisation mot de passe AD          | .md   | 05/05/2026          | ✅        |
| Q06 | Écran bleu BSOD                           | .md   | 05/05/2026          | ❌        |
| Q07 | Laptop collaborateur standard             | .json | 05/05/2026          | ✅        |
| Q08 | Laptop cadre dirigeant (C-Level)          | .json | 05/05/2026          | ✅        |
| Q09 | Applications du service Trading           | .json | 05/05/2026          | ✅        |
| Q10 | CRM de FinCorp                            | .json | 05/05/2026          | ✅        |
| Q11 | Portail SSPR (mot de passe libre-service) | .json | 05/05/2026          | ✅        |
| Q12 | Supervision réseau (Zabbix)               | .json | 05/05/2026          | ✅        |

**Score : 9/12** (75 %) — dont 6/6 catalogue ✅ et 3/6 fiches .md ✅

---

## Observations — test du 05/05/2026

### Q03 — Teams ne se lance plus ❌
- Question exacte `"Teams se lance mais la fenêtre n'apparaît jamais."` → aucune réponse, aucune source.
- Avec `"... Que faire ?"` ajouté → mauvaises sources (`teams-acces-canal`, `teams-statut-presence`), réponse générée par le LLM sans la procédure correcte.
- **Diagnostic probable :** la formulation ne matche pas le titre ni le corps de `teams-ne-demarre-pas.md`. La fiche parle de Teams qui "se ferme immédiatement" ou "ne démarre pas" — pas de "fenêtre qui n'apparaît pas".
- **Action :** reformuler la question de test OU enrichir la fiche avec ce symptôme.

### Q04 — OneDrive synchronisation bloquée ⚠️
- Question exacte → aucune réponse, aucune source.
- Avec `"... Que faire ?"` → réponse correcte mais source retournée : `LPT-DEV-005` (laptop JSON), pas `onedrive-synchronisation-bloquee.md`. La réponse vient du pré-entraînement du LLM, pas du corpus.
- **Diagnostic probable :** "croix rouge" et "synchronisation bloquée" ne matchent pas suffisamment le contenu de la fiche (score sous le seuil THRESHOLD_MD = 0.20).
- **Action :** enrichir le frontmatter de la fiche (commentaire, équipes) ou ajouter des synonymes dans le corps.

### Q06 — Écran bleu BSOD ❌
- Aucune réponse, aucune source quelle que soit la formulation testée.
- **Diagnostic probable :** "écran bleu" et "BSOD" sont peut-être absents ou rares dans la fiche `ecran-bleu-bsod-windows.md`.
- **Action :** lire la fiche et vérifier que ces termes y figurent bien. Ajouter un synonyme dans le frontmatter si nécessaire.

### Observations générales
- **Catalogue JSON : 6/6** — tous les chunks sont bien retrouvés. Le chunking dénormalisé et le modèle multilingue fonctionnent bien.
- **Fiches .md : 3/6** — les échecs sont liés à des questions dont la formulation s'écarte du vocabulaire utilisé dans la fiche. La sensibilité au phrasé est le principal axe d'amélioration.
- **Sensibilité au phrasé :** ajouter "Que faire ?" ou reformuler en incluant un verbe d'action améliore nettement les résultats (voir Q04 bis). À documenter pour les futurs tests.
