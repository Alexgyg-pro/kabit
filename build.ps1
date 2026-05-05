# build.ps1 — Prépare le build de production CAGPT
# Prérequis : Node.js installé, front/.env.local présent avec VITE_GROQ_API_KEY

$ErrorActionPreference = 'Stop'

# Vérifier la clé API
$envFile = Join-Path $PSScriptRoot "front\.env.local"
if (-not (Test-Path $envFile)) {
  Write-Error "❌ front/.env.local introuvable — créez-le avec : VITE_GROQ_API_KEY=votre_cle"
  exit 1
}

Write-Host "📦 Build du frontend..." -ForegroundColor Cyan
Set-Location (Join-Path $PSScriptRoot "front")
npm install
npm run build

Write-Host ""
Write-Host "✅ Build terminé." -ForegroundColor Green
Write-Host ""
Write-Host "Pour démarrer l'application :" -ForegroundColor Yellow
Write-Host "  cd back"
Write-Host "  npm install"
Write-Host "  node server.js"
Write-Host ""
Write-Host "Puis ouvrir : http://localhost:3001" -ForegroundColor Cyan
Write-Host ""
Write-Host "Dossiers à copier sur un autre poste :" -ForegroundColor Yellow
Write-Host "  back/"
Write-Host "  front/dist/"
Write-Host "  corpus/"
Write-Host "  system-prompt.md"
