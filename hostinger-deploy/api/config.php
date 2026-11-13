<?php
if (file_exists(__DIR__ . '/config.local.php')) {
    // Local development — config.local.php is gitignored and never uploaded
    require_once __DIR__ . '/config.local.php';
} else {
    // ── Production Settings for Hostinger ─────────────────────────
    define('DB_HOST', getenv('DB_HOST') ?: ($_ENV['DB_HOST'] ?? 'localhost'));
    define('DB_USER', getenv('DB_USER') ?: ($_ENV['DB_USER'] ?? 'u_campusarge'));
    define('DB_PASS', getenv('DB_PASS') ?: ($_ENV['DB_PASS'] ?? ''));
    define('DB_NAME', getenv('DB_NAME') ?: ($_ENV['DB_NAME'] ?? 'campusarge_db'));
    define('JWT_SECRET', getenv('JWT_SECRET') ?: ($_ENV['JWT_SECRET'] ?? 'campusarge_secure_jwt_token_2026_xyz'));

    define('SMTP_HOST', getenv('SMTP_HOST') ?: ($_ENV['SMTP_HOST'] ?? 'smtp.hostinger.com'));
    define('SMTP_USER', getenv('SMTP_USER') ?: ($_ENV['SMTP_USER'] ?? 'query@campusarge.com'));
    define('SMTP_PASS', getenv('SMTP_PASS') ?: ($_ENV['SMTP_PASS'] ?? 'Yashvardhan@_2027'));
    define('SMTP_PORT', getenv('SMTP_PORT') ?: ($_ENV['SMTP_PORT'] ?? 465));

    // Disable error display in production
    ini_set('display_errors', 0);
    error_reporting(0);
}

if (!defined('DB_HOST')) {
    define('DB_HOST', 'localhost');
}
