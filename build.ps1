# build.ps1 - Prepare le build de production KABIT
# Prerequis : Node.js installe, front/.env.local present avec VITE_GROQ_API_KEY

$ErrorActionPreference = 'Stop'

# Verifier la cle API
$envFile = Join-Path $PSScriptRoot "front\.env.local"
if (-not (Test-Path $envFile)) {
  Write-Error "front/.env.local introuvable - creez-le avec : VITE_GROQ_API_KEY=votre_cle"
  exit 1
}

Write-Host "Build du frontend..." -ForegroundColor Cyan
Set-Location (Join-Path $PSScriptRoot "front")
npm install
npm run build

Write-Host ""
Write-Host "Build termine." -ForegroundColor Green
Write-Host ""
Write-Host "Pour demarrer l'application :" -ForegroundColor Yellow
Write-Host "  cd back"
Write-Host "  npm install"
Write-Host "  node server.js"
Write-Host ""
Write-Host "Puis ouvrir : http://localhost:3001" -ForegroundColor Cyan
Write-Host ""
Write-Host "Fichiers a copier sur un autre poste :" -ForegroundColor Yellow
Write-Host "  back/server.js"
Write-Host "  back/package.json"
Write-Host "  front/dist/            (dossier complet)"
Write-Host "  corpus/                (dossier complet)"
Write-Host "  system-prompt.md"
Write-Host ""
Write-Host "Sur le nouveau poste, dans back/ :" -ForegroundColor Yellow
Write-Host "  npm install"
Write-Host "  node server.js"
