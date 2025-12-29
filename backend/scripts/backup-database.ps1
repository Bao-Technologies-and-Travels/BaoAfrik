# Database Backup Script for Windows PowerShell
# Usage: .\scripts\backup-database.ps1 [backup-name]

param(
    [string]$BackupName = "backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
)

# Get database URL from environment
$DatabaseUrl = $env:DATABASE_URL
if (-not $DatabaseUrl) {
    Write-Host "Error: DATABASE_URL environment variable not set" -ForegroundColor Red
    exit 1
}

# Create backup directory
$BackupDir = ".\backups"
if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
}

$BackupFile = "$BackupDir\$BackupName.sql"

Write-Host "Creating database backup..." -ForegroundColor Green
Write-Host "Database: $DatabaseUrl"
Write-Host "Backup file: $BackupFile"

# Extract connection details from DATABASE_URL
# Format: postgresql://user:password@host:port/database
if ($DatabaseUrl -match 'postgresql://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)') {
    $dbUser = $matches[1]
    $dbPass = $matches[2]
    $dbHost = $matches[3]
    $dbPort = $matches[4]
    $dbName = $matches[5]
    
    # Set PGPASSWORD environment variable
    $env:PGPASSWORD = $dbPass
    
    # Run pg_dump
    $pgDumpPath = "pg_dump"
    if (Get-Command pg_dump -ErrorAction SilentlyContinue) {
        & $pgDumpPath -h $dbHost -p $dbPort -U $dbUser -d $dbName -f $BackupFile
        
        if ($LASTEXITCODE -eq 0) {
            $fileSize = (Get-Item $BackupFile).Length / 1MB
            Write-Host "✓ Backup created successfully: $BackupFile" -ForegroundColor Green
            Write-Host "Backup size: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Green
        } else {
            Write-Host "✗ Backup failed!" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "Error: pg_dump not found. Please install PostgreSQL client tools." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Error: Invalid DATABASE_URL format" -ForegroundColor Red
    exit 1
}

