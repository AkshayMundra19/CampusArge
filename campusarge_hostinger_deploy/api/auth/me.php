<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once __DIR__ . '/../lib/db.php';
require_once __DIR__ . '/../lib/auth_middleware.php';

$payload = authenticate();

$pdo = getDB();
$stmt = $pdo->prepare("SELECT id, email, full_name, role, avatar_url, bio, phone, location, verification_status, created_at FROM users WHERE id = ?");
$stmt->execute([$payload['id']]);
$user = $stmt->fetch();

if (!$user) {
    http_response_code(404);
    echo json_encode(["error" => "User not found"]);
    exit;
}

http_response_code(200);
echo json_encode(["user" => $user]);
