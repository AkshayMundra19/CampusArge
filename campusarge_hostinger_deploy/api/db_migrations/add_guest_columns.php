<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../lib/db.php';

try {
    $pdo = getDB();
    
    // Make student_id nullable
    $pdo->exec("ALTER TABLE bookings MODIFY student_id CHAR(36) NULL");
    
    // Add guest columns
    $pdo->exec("ALTER TABLE bookings ADD COLUMN guest_name VARCHAR(255) NULL");
    $pdo->exec("ALTER TABLE bookings ADD COLUMN guest_email VARCHAR(255) NULL");
    $pdo->exec("ALTER TABLE bookings ADD COLUMN guest_phone VARCHAR(50) NULL");

    // Create a table for rate limiting
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS rate_limits (
            ip_address VARCHAR(45) PRIMARY KEY,
            request_count INT DEFAULT 1,
            last_request TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    ");
    
    echo "Migration completed successfully.\n";
} catch (PDOException $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
}
