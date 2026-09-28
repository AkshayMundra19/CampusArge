<?php
// Script: api/db_migrations/drop_booking_tables.php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../lib/db.php';

echo "Starting migration: Drop booking tables...\n";

try {
    $pdo = getDB();

    // Drop bookings table
    $pdo->exec("DROP TABLE IF EXISTS bookings");
    echo "Dropped bookings table.\n";

    // Drop faculty_availability table
    $pdo->exec("DROP TABLE IF EXISTS faculty_availability");
    echo "Dropped faculty_availability table.\n";

    // Drop rate_limits table (since it was used for booking rate limiting)
    $pdo->exec("DROP TABLE IF EXISTS rate_limits");
    echo "Dropped rate_limits table.\n";

    echo "Migration completed successfully!\n";
} catch (Exception $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
}
