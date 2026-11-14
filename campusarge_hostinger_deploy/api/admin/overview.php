<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

require_once __DIR__ . '/../lib/db.php';
require_once __DIR__ . '/../lib/auth_middleware.php';

$user = authenticate('admin');
$pdo = getDB();

try {
    $stats = [
        'total_students' => $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'student'")->fetchColumn(),
        'total_faculty' => $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'faculty'")->fetchColumn(),
        'total_universities' => $pdo->query("SELECT COUNT(*) FROM universities")->fetchColumn(),
        'total_bookings' => $pdo->query("SELECT COUNT(*) FROM bookings")->fetchColumn(),
        'pending_verification' => $pdo->query("SELECT COUNT(*) FROM faculty WHERE verification_status = 'pending'")->fetchColumn(),
        'open_reports' => $pdo->query("SELECT COUNT(*) FROM reports WHERE status = 'open'")->fetchColumn(),
    ];

    echo json_encode(["stats" => $stats]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to load overview data"]);
}
