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

if (!isset($data->email) || !isset($data->password) || !isset($data->full_name) || !isset($data->role)) {
    http_response_code(400);
    echo json_encode(["error" => "Missing required fields"]);
    exit;
}

$pdo = getDB();

// Check if email exists
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$data->email]);
if ($stmt->fetch()) {
    http_response_code(409);
    echo json_encode(["error" => "Email already exists"]);
    exit;
}

// UUIDv4 Generation
$uuid = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
    mt_rand(0, 0xffff), mt_rand(0, 0xffff),
    mt_rand(0, 0xffff),
    mt_rand(0, 0x0fff) | 0x4000,
    mt_rand(0, 0x3fff) | 0x8000,
    mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
);

$passwordHash = password_hash($data->password, PASSWORD_BCRYPT);
$role = 'faculty'; // registration can never create admin or any other role

try {
    $stmt = $pdo->prepare("INSERT INTO users (id, email, password_hash, full_name, role) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$uuid, $data->email, $passwordHash, $data->full_name, $role]);
    
    $payload = [
        "id" => $uuid,
        "email" => $data->email,
        "role" => $role
    ];
    $jwt = generateJWT($payload);
    
    http_response_code(201);
    echo json_encode([
        "message" => "User registered successfully",
        "token" => $jwt,
        "user" => [
            "id" => $uuid,
            "email" => $data->email,
            "full_name" => $data->full_name,
            "role" => $role
        ]
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to register user"]);
}
