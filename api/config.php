<?php
if (file_exists(__DIR__ . '/config.local.php')) {
    // Local development — config.local.php is gitignored and never uploaded
    require_once __DIR__ . '/config.local.php';
} else {
    // ── Production Settings ──────────────────────────────────────
    // Load secrets from environment variables (e.g. set in Hostinger/Server settings)
    $required_env_vars = ['DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME', 'JWT_SECRET'];
    
    foreach ($required_env_vars as $var) {
        if (getenv($var) === false && !isset($_ENV[$var])) {
            die("Critical Error: Missing required environment variable $var. Do not hardcode secrets here.");
        }
    }

    define('DB_HOST', getenv('DB_HOST') ?: $_ENV['DB_HOST']);
    define('DB_USER', getenv('DB_USER') ?: $_ENV['DB_USER']);
    define('DB_PASS', getenv('DB_PASS') ?: $_ENV['DB_PASS']);
    define('DB_NAME', getenv('DB_NAME') ?: $_ENV['DB_NAME']);
    define('JWT_SECRET', getenv('JWT_SECRET') ?: $_ENV['JWT_SECRET']);

    define('SMTP_HOST', getenv('SMTP_HOST') ?: ($_ENV['SMTP_HOST'] ?? 'smtp-relay.brevo.com'));
    define('SMTP_USER', getenv('SMTP_USER') ?: ($_ENV['SMTP_USER'] ?? 'your_email@example.com'));
    define('SMTP_PASS', getenv('SMTP_PASS') ?: ($_ENV['SMTP_PASS'] ?? 'your_smtp_password'));
    define('SMTP_PORT', getenv('SMTP_PORT') ?: ($_ENV['SMTP_PORT'] ?? 587));

    // Disable error display in production
    ini_set('display_errors', 0);
    error_reporting(0);
}

// Always enable for local dev (config.local.php sets this)
if (!defined('DB_HOST')) {
    ini_set('display_errors', 1);
    error_reporting(E_ALL);
}

