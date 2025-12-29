#!/bin/bash

# Database Backup Script
# Usage: ./scripts/backup-database.sh [backup-name]

# Get database URL from environment or use default
DATABASE_URL=${DATABASE_URL:-"postgresql://user:password@localhost:5432/baotest"}
BACKUP_NAME=${1:-"backup-$(date +%Y%m%d-%H%M%S)"}
BACKUP_DIR="./backups"
BACKUP_FILE="$BACKUP_DIR/$BACKUP_NAME.sql"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "Creating database backup..."
echo "Database: $DATABASE_URL"
echo "Backup file: $BACKUP_FILE"

# Extract connection details from DATABASE_URL
# Format: postgresql://user:password@host:port/database
DB_INFO=$(echo $DATABASE_URL | sed -n 's|postgresql://\([^:]*\):\([^@]*\)@\([^:]*\):\([^/]*\)/\(.*\)|\1 \2 \3 \4 \5|p')
read DB_USER DB_PASS DB_HOST DB_PORT DB_NAME <<< "$DB_INFO"

# Create backup using pg_dump
PGPASSWORD="$DB_PASS" pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -F c -f "$BACKUP_FILE.dump" 2>/dev/null || \
PGPASSWORD="$DB_PASS" pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$BACKUP_FILE" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✓ Backup created successfully: $BACKUP_FILE"
    echo "Backup size: $(du -h "$BACKUP_FILE"* | cut -f1)"
else
    echo "✗ Backup failed!"
    exit 1
fi

