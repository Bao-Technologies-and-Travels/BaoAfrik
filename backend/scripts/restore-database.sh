#!/bin/bash

# Database Restore Script
# Usage: ./scripts/restore-database.sh <backup-file>

if [ -z "$1" ]; then
    echo "Error: Backup file required"
    echo "Usage: ./scripts/restore-database.sh <backup-file>"
    exit 1
fi

BACKUP_FILE=$1

if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Get database URL from environment
DATABASE_URL=${DATABASE_URL:-"postgresql://user:password@localhost:5432/baotest"}

echo "Restoring database from backup..."
echo "Backup file: $BACKUP_FILE"
echo "Database: $DATABASE_URL"

# Extract connection details
DB_INFO=$(echo $DATABASE_URL | sed -n 's|postgresql://\([^:]*\):\([^@]*\)@\([^:]*\):\([^/]*\)/\(.*\)|\1 \2 \3 \4 \5|p')
read DB_USER DB_PASS DB_HOST DB_PORT DB_NAME <<< "$DB_INFO"

# Restore backup
if [[ "$BACKUP_FILE" == *.dump ]]; then
    # Custom format backup
    PGPASSWORD="$DB_PASS" pg_restore -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "$BACKUP_FILE"
else
    # SQL format backup
    PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$BACKUP_FILE"
fi

if [ $? -eq 0 ]; then
    echo "✓ Database restored successfully"
else
    echo "✗ Restore failed!"
    exit 1
fi

