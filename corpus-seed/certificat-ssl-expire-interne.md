---
title: Certificat SSL expiré sur une application interne
catégorie: Sécurité
service: Informatique
équipes: Boutique IT
dernière_revision: 30/04/2026
statut: Publié
commentaire: Les certificats internes sont émis par FinCorp-CA — durée de validité : 2 ans. Surveiller les expirations via le portail PKI
---

# Certificat SSL expiré sur une application interne

## Symptômes
- Navigateur affiche « Votre connexion n'est pas privée » (ERR_CERT_DATE_INVALID)
- Erreur SSL dans les logs applicatifs
- Application interne inaccessible depuis l'extérieur après expiration

## Applications internes concernées (exemples)

| Application          | URL interne                         | Responsable certificat |
|----------------------|-------------------------------------|------------------------|
| SAP Fiori            | sap.fincorp.local                   | Équipe SI Finance + IT |
| Intranet             | intranet.fincorp.local              | Boutique IT            |
| Portail RH           | rh.fincorp.local                    | RH + IT                |
| Reset MDP            | reset-mdp.fincorp.local             | Boutique IT            |
| Jamf Pro (MDM)       | jamf.fincorp.local                  | Boutique IT            |

## Procédure — Renouvellement certificat (Boutique IT)

### Étape 1 — Générer une nouvelle CSR
```powershell
# Créer un fichier de configuration (certreq.inf)
$certConfig = @"
[Version]
Signature="$Windows NT$"
[NewRequest]
Subject="CN=sap.fincorp.local, O=FinCorp Solutions, C=FR"
KeySpec=1
KeyLength=2048
Exportable=TRUE
MachineKeySet=TRUE
SMIME=False
PrivateKeyArchive=FALSE
UserProtected=FALSE
UseExistingKeySet=FALSE
ProviderName="Microsoft RSA SChannel Cryptographic Provider"
ProviderType=12
RequestType=PKCS10
[Extensions]
2.5.29.17 = "{text}dns=sap.fincorp.local&dns=sap"
"@
$certConfig | Out-File -FilePath "C:\certreq.inf" -Encoding ASCII
certreq -new "C:\certreq.inf" "C:\certreq.csr"
```

### Étape 2 — Soumettre à l'autorité de certification interne
```cmd
certreq -submit -attrib "CertificateTemplate:WebServer" "C:\certreq.csr" "C:\certreq.cer"
```
Ou via le portail PKI web : `https://pki.fincorp.local/certsrv`

### Étape 3 — Installer le certificat
```cmd
certreq -accept "C:\certreq.cer"
```
Puis dans IIS / Apache / Nginx : remplacer le certificat dans la configuration du site.

### Étape 4 — Vérifier
```cmd
openssl s_client -connect sap.fincorp.local:443 -showcerts
```

## Monitoring — Alertes d'expiration
Le portail PKI `https://pki.fincorp.local` envoie des alertes automatiques 60, 30 et 7 jours avant expiration.
S'assurer que les alertes arrivent à `it-infra@fincorp.com`.
