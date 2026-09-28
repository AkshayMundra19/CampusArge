while ($true) {
    Write-Host "Starting PHP server on port 8000..."
    $process = Start-Process -NoNewWindow -PassThru -FilePath "D:\XAMPP 1\php\php.exe" -ArgumentList "-S 127.0.0.1:8000 -t `"d:\Mentoring Path`""
    Wait-Process -Id $process.Id
    Write-Host "PHP server exited with code $($process.ExitCode). Restarting in 2 seconds..."
    Start-Sleep -Seconds 2
}
