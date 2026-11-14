$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  CampusArge - Hostinger Deployment Package Generator     " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$projectRoot = "D:\CampusArge"
$deployDir = Join-Path $projectRoot "hostinger-deploy"
$frontendDir = Join-Path $projectRoot "frontend"
$zipOutput = Join-Path $projectRoot "campusarge_hostinger_deploy.zip"

# 1. Clean previous build directory and zip
Write-Host "`n[1/5] Cleaning up previous deployment artifacts..." -ForegroundColor Yellow
$frontendDist = Join-Path $frontendDir "dist"
if (Test-Path $frontendDist) {
    Remove-Item -Recurse -Force $frontendDist
}

if (Test-Path $deployDir) {
    Remove-Item -Recurse -Force $deployDir
}
New-Item -ItemType Directory -Force -Path $deployDir | Out-Null

if (Test-Path $zipOutput) {
    Remove-Item -Force $zipOutput
}

# 2. Build Frontend
Write-Host "`n[2/5] Building Vite production bundle..." -ForegroundColor Yellow
Set-Location $frontendDir
npm run build

# 3. Copy Frontend Dist to Deploy Folder
Write-Host "`n[3/5] Copying static assets and SPA files to deploy folder..." -ForegroundColor Yellow
Copy-Item -Path (Join-Path $frontendDir "dist\*") -Destination $deployDir -Recurse -Force

# 4. Copy API Backend to Deploy Folder
Write-Host "`n[4/5] Copying backend API and Hostinger mailer..." -ForegroundColor Yellow
$apiDeployDir = Join-Path $deployDir "api"
Copy-Item -Path (Join-Path $projectRoot "api") -Destination $deployDir -Recurse -Force

# Ensure .htaccess exists in deploy root
$rootHtaccess = Join-Path $frontendDir "public\.htaccess"
if (Test-Path $rootHtaccess) {
    Copy-Item -Path $rootHtaccess -Destination (Join-Path $deployDir ".htaccess") -Force
}

# 5. Create Ready-to-Upload ZIP for Hostinger
Write-Host "`n[5/5] Compressing into deployable ZIP archive..." -ForegroundColor Yellow
Set-Location $deployDir
$itemsToZip = Get-ChildItem -Path $deployDir -Force | Select-Object -ExpandProperty FullName
Compress-Archive -Path $itemsToZip -DestinationPath $zipOutput -Force

Set-Location $projectRoot

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "  SUCCESS! Deployment package is ready:                   " -ForegroundColor Green
Write-Host "  $zipOutput" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "`nTo Deploy on Hostinger:" -ForegroundColor Cyan
Write-Host "1. Login to Hostinger hPanel -> File Manager"
Write-Host "2. Open the 'public_html' folder of campusarge.com"
Write-Host "3. Upload 'campusarge_hostinger_deploy.zip'"
Write-Host "4. Right-click the zip file and click 'Extract' into public_html"
Write-Host "5. Done! Your website and contact email forms will work immediately."
