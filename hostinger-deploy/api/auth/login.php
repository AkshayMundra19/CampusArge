<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once __DIR__ . '/../lib/db.php';
require_once __DIR__ . '/../lib/jwt.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->email) || !isset($data->password)) {
    http_response_code(400);
    echo json_encode(["error" => "Missing email or password"]);
    exit;
}

$pdo = getDB();
$stmt = $pdo->prepare("SELECT id, email, password_hash, full_name, role, is_legacy_user, verification_status FROM users WHERE email = ?");
$stmt->execute([$data->email]);
$user = $stmt->fetch();

if (!$user) {
    http_response_code(401);
    echo json_encode(["error" => "Invalid credentials"]);
    exit;
}

if ($user['is_legacy_user']) {
    http_response_code(403);
    echo json_encode(["error" => "Password reset required for legacy user. Check your email for instructions.", "legacy" => true]);
    // In a real flow, trigger the password reset email here
    exit;
}

if (password_verify($data->password, $user['password_hash'])) {
    $payload = [
        "id" => $user['id'],
        "email" => $user['email'],
        "role" => $user['role']
    ];
    $jwt = generateJWT($payload);
    
    http_response_code(200);
    echo json_encode([
        "message" => "Login successful",
        "token" => $jwt,
        "user" => [
            "id" => $user['id'],
            "email" => $user['email'],
            "full_name" => $user['full_name'],
            "role" => $user['role'],
            "verification_status" => $user['verification_status']
        ]
    ]);
} else {
    http_response_code(401);
    echo json_encode(["error" => "Invalid credentials"]);
}
