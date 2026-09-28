$ErrorActionPreference = 'Stop'

# Cleanup previous deploy
Remove-Item -Recurse -Force 'd:\Mentoring Path\hostinger-deploy' -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path 'd:\Mentoring Path\hostinger-deploy' | Out-Null

# Build frontend
Set-Location 'd:\Mentoring Path\frontend'
Write-Host "Building React app..."
npm run build

# Copy files
Write-Host "Copying files..."
Copy-Item -Path 'dist\*' -Destination 'd:\Mentoring Path\hostinger-deploy\' -Recurse
Copy-Item -Path '..\api' -Destination 'd:\Mentoring Path\hostinger-deploy\api' -Recurse

# Create .htaccess
Set-Location 'd:\Mentoring Path\hostinger-deploy'
$htaccess = @"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_URI} !^/api/
  RewriteRule . /index.html [L]
</IfModule>
"@
Set-Content -Path '.htaccess' -Value $htaccess

# Zip
Write-Host "Zipping deploy folder..."
Set-Location 'd:\Mentoring Path'
Remove-Item -Force 'mentoring-path-deploy-faculty-pivot.zip' -ErrorAction SilentlyContinue
Compress-Archive -Path 'hostinger-deploy\*', 'hostinger-deploy\.htaccess' -DestinationPath 'mentoring-path-deploy-faculty-pivot.zip' -Force

Write-Host "Build and zip successful!"
